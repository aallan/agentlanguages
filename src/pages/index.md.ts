import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { campsIntro, camps, methodology, withCampBold } from '../data/homepage-copy';

// Markdown companion to the homepage.
//
// Mirrors the prose on agentlanguages.dev (hero, camps narrative, three camp
// sections, full catalogue index, methodology) but as flat markdown — no
// component scaffolding, no theme toggle, no syntax-highlighted hand-tuned
// code samples. The HTML pages remain the primary surface; this exists so
// that an agent following `<link rel="alternate" type="text/markdown">` or
// scanning llms.txt can read the substance in one fetch.
//
// All editorial prose (camp theses, camp body paragraphs, methodology copy)
// is sourced from ../data/homepage-copy so the HTML and markdown surfaces
// can't drift. Surface-specific framing — the H1, the catalogue listing,
// the agent-accessible-resources block — stays in this file.

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://agentlanguages.dev')).toString().replace(/\/$/, '');
  const languages = await getCollection('languages');

  // Group by camp, alphabetical within each.
  const byCamp = (camp: string) =>
    languages
      .filter((l) => l.data.camp === camp)
      .sort((a, b) => a.data.name.localeCompare(b.data.name));

  const syntactic = byCamp('syntactic');
  const verification = byCamp('verification');
  const orchestration = byCamp('orchestration');
  const adjacent = byCamp('adjacent');
  const unclassified = byCamp('unclassified');
  const trackedCount = languages.length;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const buildDate = new Date();
  const asOfLabel = `${buildDate.getDate()} ${monthNames[buildDate.getMonth()]} ${buildDate.getFullYear()}`;

  const lines: string[] = [];

  lines.push('# agentlanguages.dev');
  lines.push('');
  lines.push(`> A community-edited catalogue of programming languages designed for AI agents to author code. ${trackedCount} projects organised around three philosophical camps — syntactic, verification, orchestration — plus adjacent and unclassified buckets.`);
  lines.push('');
  lines.push(`As of ${asOfLabel}. ${trackedCount} languages tracked.`);
  lines.push('');
  lines.push('Originally catalogued in a post ["Three camps alike in dignity"](https://negroniventurestudios.com/2026/05/20/three-camps-alike-in-dignity/) written for the Negroni Venture Studios blog.');
  lines.push('');

  // The taxonomy. campsIntro.body is plain prose with bare camp names; we
  // wrap each name in **bold** for the markdown surface (the HTML surface
  // wraps them in camp-coloured spans instead — see withCampSpans).
  lines.push('## The taxonomy');
  lines.push('');
  lines.push(`${campsIntro.heading} ${withCampBold(campsIntro.body)}`);
  lines.push('');

  // Three camp sections — thesis as blockquote, then the body paragraphs.
  for (const [heading, camp] of [
    ['Syntactic', camps.syntactic],
    ['Verification', camps.verification],
    ['Orchestration', camps.orchestration],
  ] as const) {
    lines.push(`## ${heading}`);
    lines.push('');
    lines.push(`> ${camp.thesis}`);
    lines.push('');
    for (const paragraph of camp.paragraphs) {
      lines.push(paragraph);
      lines.push('');
    }
  }

  // Catalogue listing.
  const renderEntry = (l: typeof languages[number]) => {
    return `- **[${l.data.name}](${base}/languages/${l.id}.md)** — ${l.data.one_liner}`;
  };

  lines.push(`## The full catalogue (as of ${asOfLabel})`);
  lines.push('');
  lines.push('Every language designed for LLMs or agents to author code.');
  lines.push('');

  if (syntactic.length > 0) {
    lines.push('### Syntactic camp');
    lines.push('');
    syntactic.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }
  if (verification.length > 0) {
    lines.push('### Verification camp');
    lines.push('');
    verification.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }
  if (orchestration.length > 0) {
    lines.push('### Orchestration camp');
    lines.push('');
    orchestration.forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }
  if (adjacent.length > 0 || unclassified.length > 0) {
    lines.push('### Adjacent & unclassified');
    lines.push('');
    lines.push('Infrastructure that operates around these languages, or candidates that haven\'t shipped enough to classify.');
    lines.push('');
    [...adjacent, ...unclassified].forEach((l) => lines.push(renderEntry(l)));
    lines.push('');
  }

  // Methodology — sourced from the shared module so the HTML and markdown
  // surfaces stay in sync.
  lines.push('## Methodology');
  lines.push('');
  lines.push(methodology.lead);
  lines.push('');
  for (const section of [methodology.whatCounts, methodology.howToContribute, methodology.forMachines]) {
    lines.push(`### ${section.heading}`);
    lines.push('');
    for (const paragraph of section.paragraphs) {
      lines.push(paragraph);
      lines.push('');
    }
  }

  // The "For machines" subsection inside Methodology covers /llms.txt,
  // /llms-full.txt, /sitemap.xml, and the markdown alternates. We used to
  // duplicate them in a standalone "Agent-accessible resources" section
  // here; the methodology subsection makes that redundant.

  lines.push('---');
  lines.push('');
  lines.push(`HTML version: ${base}/`);
  lines.push(`Maintained by Alasdair Allan · [github.com/aallan/agentlanguages](https://github.com/aallan/agentlanguages)`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
