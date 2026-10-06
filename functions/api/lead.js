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
    name, email, role, artist, releaseWindow, songLink, budget, message, page, service,
  } = data || {};

  const cleanName = (name || '').toString().trim().slice(0, 120);
  const cleanEmail = (email || '').toString().trim().slice(0, 200);
  if (!cleanName || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
    return json({ ok: false, error: 'Please add your name and a valid email.' }, 400);
  }

  const field = (v, max = 300) => (v || '').toString().trim().slice(0, max) || '-';
  const lowBudget = budget === 'Under $1,000';
  const urgent = /urgent/i.test(releaseWindow || '');

  const description = [
    '**Label Launch System lead**',
    '',
    `**Name:** ${cleanName}`,
    `**Email:** ${cleanEmail}`,
    `**Role:** ${field(role)}`,
    `**Artist / song:** ${field(artist)}`,
    `**Release window:** ${field(releaseWindow)}`,
    `**Song link:** ${field(songLink, 500)}`,
    `**Budget:** ${field(budget)}`,
    `**Interested in:** ${field(service)}`,
    `**Page:** ${field(page, 200)}`,
    '',
    '**Message:**',
    field(message, 4000),
    '',
    lowBudget ? '_Under $2,500: the site pointed them to makelyricvideo.com/pro._' : '',
  ].join('\n');

  const tasks = [];

  if (env.CLICKUP_API_TOKEN && env.CLICKUP_LIST_ID) {
    tasks.push(
      fetch(`https://api.clickup.com/api/v2/list/${env.CLICKUP_LIST_ID}/task`, {
        method: 'POST',
        headers: {
          Authorization: env.CLICKUP_API_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `LLS lead: ${cleanName}${artist ? ` (${field(artist, 80)})` : ''}`,
          description,
          status: 'fresh leads',
          priority: urgent || /10,000|20,000/.test(budget || '') ? 2 : 3,
          tags: ['label-launch-system', lowBudget ? 'route-to-mlv' : 'qualified', ...(urgent ? ['urgent'] : [])],
        }),
      })
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
          // Keep the verified ughdstudios.com sender until labellaunchsystem.com is verified in Resend.
          from: 'Label Launch System <noreply@ughdstudios.com>',
          to: [env.LEAD_NOTIFY_EMAIL || 'contact@lyricvideo.tv'],
          reply_to: cleanEmail,
          subject: `LLS lead: ${cleanName} | ${field(budget)} | ${field(releaseWindow)}`,
          text: description.replace(/\*\*/g, '').replace(/_/g, ''),
        }),
      })
    );
  }

  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === 'rejected') console.error('Lead delivery error:', r.reason);
  }

  return json({ ok: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
