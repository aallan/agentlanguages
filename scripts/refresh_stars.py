#!/usr/bin/env python3
"""Refresh GitHub star/fork counts for all catalogued languages.

Reads `repo:` fields from src/content/languages/*.md, calls the GitHub REST
API for each, and writes src/data/stars.json. If the API call fails for a
given repo, the previous value (if any) is preserved so the site doesn't
regress to "—" on a transient network blip.

Local setup (Homebrew Python refuses pip installs at the system level under
PEP 668, so we use a project-local venv):

    python3 -m venv .venv
    .venv/bin/pip install pyyaml
    GITHUB_TOKEN=$(gh auth token) .venv/bin/python scripts/refresh_stars.py

CI setup (refresh-stars.yml installs pyyaml directly on the runner):

    pip install pyyaml
    GITHUB_TOKEN=$GITHUB_TOKEN python3 scripts/refresh_stars.py

GITHUB_TOKEN is optional — without it the script falls back to unauthenticated
requests with a 60/hour rate limit, which is fine for the catalogue's size but
will hit the limit if run repeatedly.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
LANGUAGES_DIR = ROOT / "src" / "content" / "languages"
STARS_FILE = ROOT / "src" / "data" / "stars.json"


def read_frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    return yaml.safe_load(parts[1]) or {}


def collect_repos() -> list[str]:
    repos: list[str] = []
    for path in sorted(LANGUAGES_DIR.glob("*.md")):
        fm = read_frontmatter(path)
        repo = fm.get("repo")
        if isinstance(repo, str) and "/" in repo:
            repos.append(repo)
    return repos


def fetch_repo(repo: str, token: str | None) -> dict | None:
    url = f"https://api.github.com/repos/{repo}"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "agentlanguages-stars-refresh",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        print(f"  ! {repo}: HTTP {exc.code} ({exc.reason})", file=sys.stderr)
        return None
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        print(f"  ! {repo}: {exc}", file=sys.stderr)
        return None
    return {
        "stars": payload.get("stargazers_count", 0),
        "forks": payload.get("forks_count", 0),
        "fetched_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


def load_existing() -> dict[str, dict]:
    if not STARS_FILE.exists():
        return {}
    try:
        return json.loads(STARS_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def main() -> int:
    token = os.environ.get("GITHUB_TOKEN")
    repos = collect_repos()
    print(
        f"Refreshing stars for {len(repos)} repo(s)"
        f"{' (authenticated)' if token else ' (unauthenticated)'}"
    )

    existing = load_existing()
    updated: dict[str, dict] = {}
    failures = 0

    for repo in repos:
        print(f"  · {repo}")
        result = fetch_repo(repo, token=token)
        if result is None:
            failures += 1
            if repo in existing:
                updated[repo] = existing[repo]
        else:
            updated[repo] = result

    STARS_FILE.parent.mkdir(parents=True, exist_ok=True)
    STARS_FILE.write_text(
        json.dumps(updated, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    relpath = STARS_FILE.relative_to(ROOT)
    print(f"Wrote {relpath} — {len(updated)} entries, {failures} failure(s)")

    # Non-zero exit only if everything failed (likely network or auth issue).
    return 1 if failures and failures == len(repos) else 0


if __name__ == "__main__":
    sys.exit(main())
