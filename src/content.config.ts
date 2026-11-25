import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const schema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  category: z.enum(['Redes', 'Windows', 'Linux', 'DFIR', 'Otros']),
  type: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(true),
  example: z.boolean().default(false),
  source: z.string().optional(),
});

export const collections = {
  notes: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/notes' }), schema }),
  labs: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/labs' }), schema }),
};
