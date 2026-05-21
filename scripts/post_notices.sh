#!/usr/bin/env bash
# scripts/post_notices.sh — post cataloguing notices to repos in notices.tsv.
#
# Reads scripts/notices.tsv (one row per repo, tab-separated), substitutes
# {Name} and {slug} into scripts/notice-template.md, and creates a GitHub
# issue on each repo. Designed to be run incrementally over several days:
# defaults to 5 posts per run, with a 30-minute sleep between each post.
#
# Idempotent — re-runs skip repos that already have the notice posted (the
# check uses GitHub's issue-search to look for a matching title). Safe to
# interrupt (ctrl-C) and restart later.
#
# Usage:
#   ./scripts/post_notices.sh                    # dry-run preview of next 5 posts
#   ./scripts/post_notices.sh --really           # actually post (5/run default)
#   ./scripts/post_notices.sh --really --max 10  # raise the per-run limit
#   SLEEP=600 ./scripts/post_notices.sh --really # shorter sleep for testing
#
# Recommended cadence: ./scripts/post_notices.sh --really once a day for a
# working week. Idempotence makes daily re-runs safe.

set -euo pipefail

# ---- args ----
REALLY=false
MAX=5
while [ $# -gt 0 ]; do
  case "$1" in
    --really) REALLY=true; shift ;;
    --max) MAX="$2"; shift 2 ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "Unknown arg: $1 (use --help)" >&2; exit 2 ;;
  esac
done

# ---- paths ----
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
TSV="scripts/notices.tsv"
TEMPLATE="scripts/notice-template.md"
LOG="scripts/notices.log"
SLEEP="${SLEEP:-1800}"  # 30 min between posts

[ -f "$TSV" ]      || { echo "Missing $TSV" >&2; exit 1; }
[ -f "$TEMPLATE" ] || { echo "Missing $TEMPLATE" >&2; exit 1; }

TEMPLATE_BODY="$(cat "$TEMPLATE")"

# ---- main loop ----
processed=0
posted=0
skipped=0

# Pipe the TSV through awk to convert tab delimiters to Unit Separator
# (\x1f) bytes. Bash's `read` collapses consecutive whitespace IFS
# characters — meaning empty fields between two tabs vanish — but does
# NOT collapse non-whitespace delimiters. Using \x1f gives strict parsing
# so the row "repo<TAB>name<TAB>slug<TAB><TAB>extra" (empty skip column)
# is read as five fields, with field 4 correctly empty.
while IFS=$'\037' read -r repo name slug skip extra; do
  # Strip surrounding whitespace from repo
  repo="${repo#"${repo%%[![:space:]]*}"}"
  repo="${repo%"${repo##*[![:space:]]}"}"

  # Skip blank lines and comments
  [ -z "$repo" ] && continue
  case "$repo" in \#*) continue ;; esac

  # Explicit skip from the TSV
  if [ -n "${skip:-}" ]; then
    printf '[skip] %-30s — %s\n' "$repo" "$skip"
    skipped=$((skipped+1))
    continue
  fi

  # Are Issues even enabled on the repo?
  has_issues="$(gh repo view "$repo" --json hasIssuesEnabled --jq '.hasIssuesEnabled' 2>/dev/null || echo "")"
  if [ "$has_issues" != "true" ]; then
    printf '[skip] %-30s — Issues disabled on repo\n' "$repo"
    skipped=$((skipped+1))
    continue
  fi

  title="$name added to a directory of programming languages for AI agents"

  # Idempotence: skip if a matching-title issue already exists
  existing="$(gh issue list --repo "$repo" --search "\"$title\" in:title" --json number --jq 'length' 2>/dev/null || echo "0")"
  if [ "${existing:-0}" != "0" ]; then
    printf '[skip] %-30s — Notice already posted\n' "$repo"
    skipped=$((skipped+1))
    continue
  fi

  # Fill the template
  body="${TEMPLATE_BODY//\{Name\}/$name}"
  body="${body//\{slug\}/$slug}"
  # If the row has a repo-name clarification sentence, prepend it as the
  # very first paragraph (above "Hello." in the standard template).
  if [ -n "${extra:-}" ]; then
    body="$extra"$'\n\n'"$body"
  fi

  if ! $REALLY; then
    printf '[dry]  %-30s would post: %s\n' "$repo" "$title"
    processed=$((processed+1))
    [ "$processed" -ge "$MAX" ] && break
    continue
  fi

  # Actually post
  if url="$(gh issue create --repo "$repo" --title "$title" --body "$body" 2>&1)"; then
    printf '[post] %-30s %s\n' "$repo" "$url"
    printf '%s\t%s\t%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$repo" "$url" >> "$LOG"
    posted=$((posted+1))
    processed=$((processed+1))
  else
    printf '[fail] %-30s %s\n' "$repo" "$url"
    skipped=$((skipped+1))
    continue
  fi

  if [ "$processed" -ge "$MAX" ]; then
    printf '\n(max %d posts reached. Re-run later to continue.)\n' "$MAX"
    break
  fi

  printf '       sleeping %ds before next post...\n' "$SLEEP"
  sleep "$SLEEP"

done < <(awk 'BEGIN{FS="\t"; OFS="\037"} {$1=$1; print}' "$TSV")

# ---- summary ----
if ! $REALLY; then
  printf '\n(dry-run. Add --really to actually post. Limit was %d.)\n' "$MAX"
else
  printf '\nDone. posted=%d skipped=%d (log: %s)\n' "$posted" "$skipped" "$LOG"
fi
