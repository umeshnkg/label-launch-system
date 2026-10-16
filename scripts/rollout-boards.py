"""Boards for the Rollout hero, cut from treatment PDFs or tiled from a folder.

  python -I scripts/rollout-boards.py --pdf <treatment.pdf> --page <n> --crop x0,y0,x1,y1 --out <name> [--palette]
      render page n at 220 dpi, crop the fraction box (0..1 of the page), fit
      onto a 1200 x 676 white board, save public/kit/rollout/<name>.webp <= 150 KB.
  python -I scripts/rollout-boards.py --tiles <dir> --out <name> [--cols 4 --rows 3] [--palette]
      the first cols*rows images of <dir> (sorted) cover-cropped into a grid with
      8 px gutters on white, 1200 x 676.
  --palette prints the five dominant colours of the result as hex, for src/rollout.js.
"""
import argparse
import io
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "kit", "rollout")
W, H = 1200, 676
MAX_BYTES = 150 * 1024


def fit_on_board(im):
    """Letterbox `im` onto a white W x H board, keeping its aspect."""
    im = im.convert("RGB")
    s = min(W / im.width, H / im.height)
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    board = Image.new("RGB", (W, H), (255, 255, 255))
    board.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
    return board


def cover(im, w, h):
    im = im.convert("RGB")
    s = max(w / im.width, h / im.height)
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def save_webp(board, path):
    for q in range(82, 38, -6):
        buf = io.BytesIO()
        board.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= MAX_BYTES:
            with open(path, "wb") as f:
                f.write(buf.getvalue())
            return q, buf.tell()
    with open(path, "wb") as f:
        f.write(buf.getvalue())
    return None, buf.tell()


def palette(board, n=5):
    small = board.resize((200, 112))
    q = small.quantize(colors=n, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[: n * 3]
    counts = sorted(q.getcolors(), reverse=True)
    out = []
    for _, idx in counts:
        r, g, b = pal[idx * 3: idx * 3 + 3]
        out.append(f"#{r:02x}{g:02x}{b:02x}")
    return out


def from_pdf(pdf, page_no, crop):
    import pymupdf  # PyMuPDF
    doc = pymupdf.open(pdf)
    page = doc[page_no - 1]
    pix = page.get_pixmap(dpi=220)
    im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    x0, y0, x1, y1 = crop
    return im.crop((round(x0 * im.width), round(y0 * im.height), round(x1 * im.width), round(y1 * im.height)))


def from_tiles(folder, cols, rows):
    files = sorted(f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))[: cols * rows]
    gutter = 8
    tw = (W - gutter * (cols + 1)) // cols
    th = (H - gutter * (rows + 1)) // rows
    board = Image.new("RGB", (W, H), (255, 255, 255))
    for i, name in enumerate(files):
        im = Image.open(os.path.join(folder, name))
        tile = cover(im, tw, th)
        x = gutter + (i % cols) * (tw + gutter)
        y = gutter + (i // cols) * (th + gutter)
        board.paste(tile, (x, y))
    return board


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf")
    ap.add_argument("--page", type=int)
    ap.add_argument("--crop", default="0,0,1,1")
    ap.add_argument("--tiles")
    ap.add_argument("--cols", type=int, default=4)
    ap.add_argument("--rows", type=int, default=3)
    ap.add_argument("--out", required=True)
    ap.add_argument("--palette", action="store_true")
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    if a.pdf:
        crop = tuple(float(v) for v in a.crop.split(","))
        board = fit_on_board(from_pdf(a.pdf, a.page, crop))
    elif a.tiles:
        board = from_tiles(a.tiles, a.cols, a.rows)
    else:
        sys.exit("need --pdf or --tiles")
    path = os.path.join(OUT, f"{a.out}.webp")
    q, n = save_webp(board, path)
    print(f"public/kit/rollout/{a.out}.webp  {n // 1024} KB  q={q if q else 'over budget'}")
    if a.palette:
        print("palette", palette(board))
    if q is None:
        sys.exit(1)


if __name__ == "__main__":
    main()
