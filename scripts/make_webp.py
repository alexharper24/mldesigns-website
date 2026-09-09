#!/usr/bin/env python
"""
Generate responsive WebP derivatives for the work gallery.

    python scripts/make_webp.py

The gallery is a CSS multi-column layout: 2 columns on a phone, 3 by default,
4 above 1500px, inside a container of min(94%, 1560px). That puts each image
in a slot roughly 180px to 390px wide, while the source files are 1024px to
1600px. So the win here is mostly *dimensional*, not just format.

Originals are never touched or deleted (see CLAUDE.md). Derivatives land in
img/work/r/ and the originals stay as the <img src> fallback.
"""

import io
import os
import sys

from PIL import Image

SRC_DIR = os.path.join("img", "work")
OUT_DIR = os.path.join("img", "work", "r")
WIDTHS = (400, 800)
QUALITY = 78


def main():
    force = "--force" in sys.argv[1:]
    os.makedirs(OUT_DIR, exist_ok=True)

    names = sorted(f for f in os.listdir(SRC_DIR)
                   if f.lower().endswith((".jpg", ".jpeg", ".png"))
                   and os.path.isfile(os.path.join(SRC_DIR, f)))

    src_kb = made = skipped = 0
    out_kb = {w: 0 for w in WIDTHS}

    for f in names:
        sp = os.path.join(SRC_DIR, f)
        src_kb += os.path.getsize(sp) // 1024
        stem = os.path.splitext(f)[0]
        im = None
        for w in WIDTHS:
            op = os.path.join(OUT_DIR, "%s-%d.webp" % (stem, w))
            if os.path.exists(op) and not force:
                out_kb[w] += os.path.getsize(op) // 1024
                skipped += 1
                continue
            if im is None:
                im = Image.open(sp).convert("RGB")
            # never upscale past the source
            tw = min(w, im.size[0])
            th = max(1, round(im.size[1] * tw / im.size[0]))
            im.resize((tw, th), Image.LANCZOS).save(
                op, "WEBP", quality=QUALITY, method=6)
            out_kb[w] += os.path.getsize(op) // 1024
            made += 1

    print("  sources      : %d files, %d KB" % (len(names), src_kb))
    for w in WIDTHS:
        print("  %-4dw webp   : %d KB" % (w, out_kb[w]))
    print("  encoded %d, reused %d" % (made, skipped))
    if src_kb:
        print("  a desktop load (800w set) is %d%% of the original weight"
              % (out_kb[800] * 100 // src_kb))


if __name__ == "__main__":
    main()
