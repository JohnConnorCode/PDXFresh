import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      description: 'Main headline for the about page',
    }),
    defineField({
      name: 'mission',
      title: 'Mission Statement',
      type: 'blockContent',
      description: 'The core mission and purpose of Long Life',
    }),
    defineField({
      name: 'story',
      title: 'Our Story',
      type: 'blockContent',
      description: 'The founding story, why Long Life exists, the journey so far',
    }),
    defineField({
      name: 'promise',
      title: 'Our Promise',
      type: 'blockContent',
      description: 'What customers can expect from Long Life - values and commitments',
    }),
    defineField({
      name: 'founderImage',
      title: 'Founder/Team Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
    defineField({
      name: 'processImages',
      title: 'Process Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Photos showing juice-making process, sourcing, team at work',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'teamMember' },
        },
      ],
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
        title: title || 'About Long Life',
      };
    },
  },
});
