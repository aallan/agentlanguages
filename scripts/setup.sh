#!/usr/bin/env bash
# scripts/setup.sh — prepare the Python venv for scripts/refresh_stars.py.
#
# Homebrew Python on macOS refuses pip installs at the system level (PEP 668),
# so the stars-refresh script's dependencies live in a project-local .venv/
# that is gitignored. This script creates the venv and installs from
# scripts/requirements.txt. Idempotent — safe to re-run.
#
# Usage:
#   ./scripts/setup.sh
#
# After setup, refresh the catalogue's star counts with:
#   GITHUB_TOKEN=$(gh auth token) .venv/bin/python scripts/refresh_stars.py

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ ! -d .venv ]; then
  echo "Creating .venv/ ..."
  python3 -m venv .venv
fi

echo "Installing scripts/requirements.txt into .venv/ ..."
.venv/bin/pip install --quiet --upgrade pip
.venv/bin/pip install --quiet -r scripts/requirements.txt

echo ""
echo "Done. Refresh stars with:"
echo "  GITHUB_TOKEN=\$(gh auth token) .venv/bin/python scripts/refresh_stars.py"
