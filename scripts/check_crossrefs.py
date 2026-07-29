#!/usr/bin/env python3
"""Check for unidirectional crossrefs in the catalogue.

Walks src/content/languages/*.md, builds a directed graph of crossrefs,
and reports edges where A references B but B does not reference A.
Exits 0 regardless (warns, does not block).
"""
from __future__ import annotations

import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
LANGUAGES_DIR = ROOT / "src" / "content" / "languages"


def read_frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    return yaml.safe_load(parts[1]) or {}


def main() -> int:
    if not LANGUAGES_DIR.exists():
        print("No languages directory found. Skipping.")
        return 0

    entries: dict[str, dict] = {}
    for path in sorted(LANGUAGES_DIR.glob("*.md")):
        fm = read_frontmatter(path)
        slug = path.stem
        entries[slug] = fm

    crossrefs: dict[str, set[str]] = {}
    for slug, fm in entries.items():
        crossrefs[slug] = {
            ref.get("slug")
            for ref in fm.get("crossrefs") or []
            if ref.get("slug")
        }

    warnings = 0
    for slug_a, refs_a in crossrefs.items():
        for slug_b in sorted(refs_a):
            if slug_b not in entries:
                print(
                    f"::warning file=src/content/languages/{slug_a}.md,title=Unknown crossref::"
                    f"Crossref '{slug_b}' in '{slug_a}' does not exist."
                )
                warnings += 1
                continue
            if slug_a not in crossrefs.get(slug_b, set()):
                name_a = entries[slug_a].get("name", slug_a)
                camp_a = entries[slug_a].get("camp", "unclassified")
                print(
                    f"::warning file=src/content/languages/{slug_a}.md,title=Missing reverse crossref::"
                    f"'{slug_a}' crossrefs '{slug_b}', but '{slug_b}' does not crossref back."
                )
                print(
                    f"  Suggested snippet for '{slug_b}.md':\n"
                    f"  - slug: {slug_a}\n"
                    f"    name: {name_a}\n"
                    f"    camp: {camp_a}\n"
                    f"    relation: \"...\""
                )
                warnings += 1

    if warnings:
        print(f"\nFound {warnings} missing/unidirectional crossref(s). Please review and add reverse pointers if appropriate.")
    else:
        print("All crossrefs are bidirectional. 🎉")

    return 0


if __name__ == "__main__":
    sys.exit(main())
