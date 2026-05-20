import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const campEnum = z.enum([
  'syntactic',
  'verification',
  'orchestration',
  'adjacent',
  'unclassified',
]);

const maturityEnum = z.enum([
  'thought_experiment',
  'research_paper',
  'early_implementation',
  'working_compiler',
  'production_ready',
]);

const languages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/languages' }),
  schema: z.object({
    name: z.string(),
    camp: campEnum,
    spans_camps: z.array(campEnum).optional().default([]),
    one_liner: z.string().min(10).max(280),
    url: z.string().url(),

    // GitHub owner/name (e.g. "aallan/vera"). Null when the project has no
    // public GitHub repo (papers, self-hosted, etc.).
    repo: z.string().nullable().default(null),

    // arXiv URL for paper-only entries.
    paper: z.string().url().nullable().default(null),

    author: z.string(),
    implementation_language: z.string(),
    compilation_target: z.string(),
    license: z.string(),
    maturity: maturityEnum,

    // ISO month, "YYYY-MM".
    date_appeared: z.string().regex(/^\d{4}-\d{2}$/, 'date_appeared must be YYYY-MM'),

    agent_tooling: z.array(z.string()).default([]),
    key_idea: z.string(),

    // Optional secondary URL (e.g. a benchmark or companion project).
    benchmark: z
      .object({
        label: z.string(),
        url: z.string().url(),
      })
      .optional(),

    // Optional structured detail-page fields. Presence of a non-empty MDX body
    // is what causes a detail page to render; these fields shape what goes on it.
    pullquote: z.string().optional(),

    code_sample: z
      .object({
        // `code` may contain raw HTML for hand-tuned syntax highlighting
        // (e.g. <span class="kw">...). Rendered with `set:html`.
        code: z.string(),
        caption: z.string().optional(),
      })
      .optional(),

    crossrefs: z
      .array(
        z.object({
          slug: z.string(),
          name: z.string(),
          camp: campEnum,
          relation: z.string(),
        })
      )
      .optional(),

    history: z
      .array(
        z.object({
          when: z.string(),
          what: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { languages };
