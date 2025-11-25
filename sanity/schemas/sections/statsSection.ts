import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'statsSection',
  title: 'Stats Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'e.g., "10,000+" or "99%"',
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              value: 'value',
              label: 'label',
            },
            prepare({ value, label }) {
              return {
                title: `${value} ${label}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Primary Green', value: 'accent-primary' },
          { title: 'White', value: 'white' },
          { title: 'Cream', value: 'accent-cream' },
        ],
      },
      initialValue: 'accent-primary',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      statCount: 'stats.length',
    },
    prepare({ title, statCount }) {
      return {
        title: title || 'Stats Section',
        subtitle: `${statCount || 0} stats`,
      };
    },
  },
});
