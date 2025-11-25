import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'featureGrid',
  title: 'Feature Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'icon',
              title: 'Icon (optional)',
              type: 'string',
              description: 'Lucide icon name (e.g., "Heart", "Zap", "Star")',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(2).max(6),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [2, 3, 4],
      },
      initialValue: 3,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      featureCount: 'features.length',
    },
    prepare({ title, featureCount }) {
      return {
        title: title || 'Feature Grid',
        subtitle: `${featureCount || 0} features`,
      };
    },
  },
});
