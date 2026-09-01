import type { CollectionEntry } from 'astro:content';

/**
 * Fail the build if any `crossrefs[].slug` does not name a real entry.
 *
 * The Zod schema in `src/content.config.ts` validates `crossrefs[].camp`
 * against `campEnum` but leaves `slug` a bare string, because a schema has no
 * clean way to see its sibling entries while they are still loading. An
 * unchecked slug is not a build error, it is a dead link on a rendered detail
 * page, which is the kind of fault that survives review: crossrefs arrive
 * hand-written in contributor PRs, and CONTRIBUTING asks for two to four of
 * them per entry.
 *
 * Called from `getStaticPaths` in `src/pages/languages/[slug].astro`, which
 * receives the whole collection before it filters to entries with a body, so
 * bodyless entries are covered too.
 */

/** Levenshtein distance, for the "did you mean" hint. */
function distance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = row;
  }
  return prev[b.length];
}

/** The closest real slug, when one is close enough to be worth suggesting. */
function nearest(slug: string, known: string[]): string | null {
  let best: string | null = null;
  let bestDistance = Infinity;
  for (const candidate of known) {
    const d = distance(slug, candidate);
    if (d < bestDistance) {
      bestDistance = d;
      best = candidate;
    }
  }
  // Two edits on a short slug is still plausibly a typo; beyond that the
  // suggestion is noise and the author meant something we do not have.
  return best !== null && bestDistance <= Math.max(2, Math.floor(slug.length / 3))
    ? best
    : null;
}

export function validateCrossrefs(languages: CollectionEntry<'languages'>[]): void {
  const known = languages.map((l) => l.id).sort();
  const ids = new Set(known);

  const broken: string[] = [];
  for (const entry of languages) {
    for (const ref of entry.data.crossrefs ?? []) {
      if (ids.has(ref.slug)) continue;
      const hint = nearest(ref.slug, known);
      broken.push(
        `  ${entry.id}.md -> crossref slug "${ref.slug}" (named "${ref.name}") matches no entry` +
          (hint ? `; did you mean "${hint}"?` : '')
      );
    }
  }

  if (broken.length > 0) {
    const summary =
      broken.length === 1
        ? '1 crossref points at an entry that does not exist'
        : `${broken.length} crossrefs point at entries that do not exist`;
    throw new Error(
      `${summary}:\n` +
        `${broken.join('\n')}\n\n` +
        `Every crossrefs[].slug must match a filename in src/content/languages/ without its .md extension.`
    );
  }
}
