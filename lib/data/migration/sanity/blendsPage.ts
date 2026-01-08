/**
 * PORTLAND FRESH - Migration-Ready Schema
 *
 * This is the Portland Fresh version of blendsPage.ts
 * Copy this to sanity/schemas/blendsPage.ts when migrating to your own Sanity instance
 *
 * Changes from shared version:
 * - Line 12: "Our Blends" → "Our Sauces"
 * - Line 19: Removed "cold-pressed" and "wellness journey" language
 */
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blendsPage',
  title: 'Sauces Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      initialValue: 'Our Sauces',
    }),
    defineField({
      name: 'subheading',
      title: 'Page Subheading',
      type: 'text',
      rows: 2,
      initialValue: 'Each sauce is carefully crafted from organic ingredients, blended fresh and delivered within 48 hours of production.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({ title }) {
      return {
        title: title || 'Sauces Page',
      };
    },
  },
});
