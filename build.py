#!/usr/bin/env python3
"""Bouwt de site: plakt header en footer uit src/layout.html om elke pagina in src/pages/.

Gebruik:  python3 build.py      -> schrijft naar site/
Elke pagina begint met een metadata-blok:
<!--meta
title: Paginatitel
description: Korte omschrijving voor Google
nav: aanbod
scripts: scan.js
-->
"""
import pathlib
import re
import shutil

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "site"

NAV = [
    ("aanbod", "aanbod.html", "Aanbod"),
    ("scan", "volhoudscan.html", "Volhoudscan"),
    ("over", "over-mij.html", "Over mij"),
    ("faq", "faq.html", "FAQ"),
    ("contact", "intake.html", "Contact"),
]


def nav_html(active: str, mobile: bool = False) -> str:
    items = []
    for i, (key, href, label) in enumerate(NAV, 1):
        cur = ' aria-current="page"' if key == active else ""
        if mobile:
            items.append(f'<a href="{href}"{cur}>{label}<span>0{i}</span></a>')
        else:
            items.append(f'<li><a href="{href}"{cur}>{label}</a></li>')
    return "\n".join(items)


def build() -> None:
    layout = (SRC / "layout.html").read_text(encoding="utf-8")
    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(ROOT / "assets", OUT / "assets")

    for page in sorted((SRC / "pages").glob("*.html")):
        raw = page.read_text(encoding="utf-8")
        m = re.match(r"<!--meta\n(.*?)\n-->\n", raw, re.S)
        meta = dict(line.split(": ", 1) for line in m.group(1).splitlines()) if m else {}
        body = raw[m.end():] if m else raw
        scripts = "".join(
            f'\n  <script src="assets/{s.strip()}" defer></script>'
            for s in meta.get("scripts", "").split(",") if s.strip()
        )
        html = (
            layout.replace("{{title}}", meta.get("title", "VDM Training"))
            .replace("{{description}}", meta.get("description", ""))
            .replace("{{nav}}", nav_html(meta.get("nav", "")))
            .replace("{{nav_mobile}}", nav_html(meta.get("nav", ""), mobile=True))
            .replace("{{scripts}}", scripts)
            .replace("{{float}}", "" if meta.get("nofloat") else FLOAT)
            .replace("{{content}}", body)
        )
        (OUT / page.name).write_text(html, encoding="utf-8")
        print("gebouwd:", page.name)


FLOAT = """<a class="float-pill" href="volhoudscan.html">
    <span class="dot" aria-hidden="true"></span>Gratis Volhoudscan · 3 min
    <span class="go" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>
  </a>"""

if __name__ == "__main__":
    build()
