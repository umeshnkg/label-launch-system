// Cloudflare Pages Function: POST /api/lead
// Lead form -> ClickUp task in the "fresh leads" list, plus an email via Resend
// when a key is configured. Same pipeline as the UGHD Studios site.

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const {
    name, email, role, releaseDate, releasePlan, budget, message, page, service, source, ref, website,
  } = data || {};

  // Honeypot field: people never see it, so anything in it is a bot. Say ok and do nothing.
  if ((website || '').toString().trim()) return json({ ok: true, contact: null });

  const cleanName = (name || '').toString().trim().slice(0, 120);
  const cleanEmail = (email || '').toString().trim().slice(0, 200);
  if (!cleanName || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
    return json({ ok: false, error: 'Please add your name and a valid email.' }, 400);
  }

  const field = (v, max = 300) => (v || '').toString().trim().slice(0, max) || '-';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(releaseDate || '') ? releaseDate : '';
  const releaseWindow = windowFor(date);
  const urgent = /urgent/i.test(releaseWindow);
  // They came in from a personal outreach link (/?ref=...), so the lead is warm.
  const outreach = (ref || '').toString().trim().slice(0, 80);
  // The phone number is handed only to leads rated warm or hot, on the thank-you screen and in the confirmation email.
  const phone = env.LEAD_PHONE || '+1 (606) 227 4600';
  const { score, tier, hits } = scoreLead({ email: cleanEmail, date, releasePlan, message, outreach });
  const contact = tier === 'cold' ? null : { phone, tel: '+' + phone.replace(/\D/g, '') };
  // Chosen source, else what the text says ("Robin gave me your contact"), else the outreach link.
  const leadSource = (source || '').toString().split(':')[0] || (hits.includes('mentions a referral') ? 'Referral' : '') || (outreach ? 'Outreach' : '');

  const description = [
    `**Label Launch System lead** (${tier.toUpperCase()}, score ${score}/8: ${hits.join(', ') || 'no signals'})`,
    '',
    `**Name:** ${cleanName}`,
    `**Email:** ${cleanEmail}`,
    `**Role:** ${field(role)}`,
    `**Release date:** ${date || 'not set'} (${releaseWindow})`,
    `**Releasing:** ${field(releasePlan)}`,
    `**Budget:** ${field(budget)}`,
    `**Found us via:** ${field(source, 200)}${!source && leadSource ? ` (inferred: ${leadSource})` : ''}`,
    ...(outreach ? [`**Outreach link:** ${outreach}`] : []),
    ...(service ? [`**Clicked "Ask for this" on:** ${field(service, 80)}`] : []),
    `**Page:** ${field(page, 200)}`,
    '',
    '**About the release:**',
    field(message, 4000),
  ].join('\n');

  const tasks = [];

  if (env.CLICKUP_API_TOKEN && env.CLICKUP_LIST_ID) {
    const headers = { Authorization: env.CLICKUP_API_TOKEN, 'Content-Type': 'application/json' };
    tasks.push(
      clickupFields(env, headers, {
        "Client's Name": cleanName,
        Email: cleanEmail,
        'Est. Budget $': budget === 'Not sure yet' ? '' : budget,
        'Lead Role': role,
        'Release Date': date,
        'Release Window': releaseWindow,
        'Release Plan': releasePlan,
        'Lead Score': String(score),
        // "Other: Podcast" picks the "Other" option; the detail stays in the description.
        'Lead Source': leadSource,
      }).then((custom_fields) =>
        fetch(`https://api.clickup.com/api/v2/list/${env.CLICKUP_LIST_ID}/task`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: `LLS lead: ${cleanName}${role ? ` (${field(role, 40)})` : ''}`,
            description,
            status: 'fresh leads',
            // ClickUp: 1 urgent, 2 high, 3 normal. Five label leads were lost to slow replies, so hot ones go to the top.
            priority: tier === 'hot' ? 1 : tier === 'warm' || urgent || /12,000/.test(budget || '') ? 2 : 3,
            tags: ['label-launch-system', tier, ...(urgent ? ['urgent'] : []), ...(outreach ? ['outreach'] : [])],
            custom_fields,
          }),
        })
      )
    );
  }

  if (env.RESEND_API_KEY) {
    tasks.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // labellaunchsystem.com is the verified Resend sending domain (DKIM + SPF CNAMEs live in Cloudflare DNS).
          from: 'Label Launch System <noreply@labellaunchsystem.com>',
          to: [env.LEAD_NOTIFY_EMAIL || 'contact@lyricvideo.tv'],
          reply_to: cleanEmail,
          subject: `LLS lead [${tier.toUpperCase()}]: ${cleanName} | ${field(role, 40)} | ${field(budget)} | ${releaseWindow}`,
          text: description.replace(/\*\*/g, '').replace(/_/g, ''),
        }),
      })
    );
    // Confirmation to the sender. One past client only reached us by email because the
    // old form failed silently, so the lead must be able to tell that this one worked.
    const first = cleanName.split(/\s+/)[0];
    const urgentLine = contact ? [`If the release is urgent, call or text ${contact.phone}.`, ''] : [];
    tasks.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Label Launch System <noreply@labellaunchsystem.com>',
          to: [cleanEmail],
          reply_to: env.LEAD_NOTIFY_EMAIL || 'contact@lyricvideo.tv',
          subject: `Got your release, ${first}`,
          text: [
            `Hi ${first},`,
            '',
            'Thanks for the note. I read every one of these myself and reply within 24 hours with a plan, a delivery date and a price in writing.',
            '',
            'If you want to send the track, lyrics, artwork or a reference in the meantime, reply to this email. A premaster is fine, nothing you send is shared, and I will sign an NDA first if you prefer.',
            '',
            ...urgentLine,
            'If you have not heard from me within a day, something went wrong on our side: email contact@lyricvideo.tv and we will take it from there.',
            '',
            'Umesh',
            'Label Launch System by LyricVideo.tv',
            'labellaunchsystem.com',
          ].join('\n'),
        }),
      })
    );
  }

  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === 'rejected') {
      console.error('Lead delivery error:', r.reason);
    } else if (!r.value.ok) {
      // ClickUp or Resend answered with an error status; surface it in the Functions log.
      console.error('Lead delivery failed:', r.value.url, r.value.status, await r.value.text().catch(() => ''));
    }
  }

  return json({ ok: true, contact });
}

// Lead score from the signals that preceded every $3K+ account in the mailbox research
// (UG Brain/plan/label-launch-system-site/lead-form-research-*.md). The stated budget was
// never one of them, so it is not asked. An outreach link counts double: the lead is warm.
function scoreLead({ email, date, releasePlan, message, outreach }) {
  const msg = (message || '').toString();
  const freeMail = /@(gmail|googlemail|yahoo|ymail|hotmail|outlook|live|msn|icloud|me|mac|aol|proton|protonmail|pm|gmx|web|mail|yandex|zoho|t-online|orange|free|laposte)\.[a-z.]+$/i;
  const signals = {
    'company email': !freeMail.test(email),
    'mentions a referral': /\b(referr|recommend|gave me your|got your (contact|details|email)|introduc|told me about you|sent me your way)/i.test(msg),
    'release date': !!date,
    'several songs': /EP|Several/.test(releasePlan || ''),
    'link included': /https?:\/\/|www\.|\b[a-z0-9-]+\.(com|io|co|net|de|fm|tv|link)\b/i.test(msg),
    'real brief': msg.trim().split(/\s+/).filter(Boolean).length >= 40,
    'writes about their artist': /\b(our|the|my) (artist|artists|act|band|client|roster|talent|singer)s?\b|\b(feat|ft)\.?\s|\bx\s+[A-Z]/i.test(msg),
    'outreach link': !!outreach,
  };
  const hits = Object.keys(signals).filter((k) => signals[k]);
  const score = hits.length + (signals['outreach link'] ? 1 : 0);
  // Anyone Umesh wrote to personally is hot by definition; he already knows who they are.
  const tier = outreach || score >= 4 ? 'hot' : score >= 2 ? 'warm' : 'cold';
  return { score, tier, hits };
}

// Release date -> the window the team filters on. A past date means a catalog track.
function windowFor(date) {
  if (!date) return 'Not set yet';
  const days = (Date.parse(`${date}T12:00:00Z`) - Date.now()) / 86400000;
  if (days < -1) return 'Already released';
  if (days < 7) return 'Less than a week (urgent)';
  if (days < 14) return '1 to 2 weeks';
  if (days < 28) return '2 to 4 weeks';
  if (days < 56) return '4 to 8 weeks';
  return '8+ weeks';
}

// Map { "Field name": value } onto the list's custom fields, matched by name so
// fields can be added or renamed in ClickUp without a code change. Dropdowns
// match the option by name; missing fields or options are skipped.
async function clickupFields(env, headers, values) {
  try {
    const res = await fetch(`https://api.clickup.com/api/v2/list/${env.CLICKUP_LIST_ID}/field`, { headers });
    if (!res.ok) return [];
    const { fields = [] } = await res.json();
    // Ignore emoji and punctuation, so "Client's Name" matches "👋 Client's Name".
    const norm = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '');
    const out = [];
    for (const [name, raw] of Object.entries(values)) {
      const value = (raw || '').toString().trim();
      const f = fields.find((x) => norm(x.name) === norm(name));
      if (!f || !value) continue;
      if (f.type === 'date') {
        // Noon UTC keeps the same calendar day in every timezone the team works in.
        const ms = Date.parse(`${value}T12:00:00Z`);
        if (ms) out.push({ id: f.id, value: ms });
      } else if (f.type === 'drop_down') {
        const opt = (f.type_config?.options || []).find((o) => norm(o.name) === norm(value));
        if (opt) out.push({ id: f.id, value: opt.id });
      } else {
        out.push({ id: f.id, value: value.slice(0, 300) });
      }
    }
    return out;
  } catch (e) {
    console.error('ClickUp field lookup failed:', e);
    return [];
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
