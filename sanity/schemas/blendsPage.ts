import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blendsPage',
  title: 'Blends Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      initialValue: 'Our Blends',
    }),
    defineField({
      name: 'subheading',
      title: 'Page Subheading',
      type: 'text',
      rows: 2,
      initialValue: 'Each blend is carefully crafted with cold-pressed organic ingredients to support your wellness journey.',
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
        title: title || 'Blends Page',
      };
    },
  },
});
