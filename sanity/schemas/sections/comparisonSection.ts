import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'comparisonSection',
  title: 'Comparison Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Compare Plans',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'features',
      title: 'Feature Rows',
      description: 'List of features to compare',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Feature Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'tooltip',
              title: 'Tooltip',
              type: 'string',
              description: 'Optional explanation shown on hover',
            }),
          ],
          preview: {
            select: {
              title: 'name',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'columns',
      title: 'Comparison Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Column Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'string',
              description: 'e.g., "$29/mo" or "Free"',
            }),
            defineField({
              name: 'featureValues',
              title: 'Feature Values',
              description:
                'Enter values for each feature in order. Use "true", "false", or a text value.',
              type: 'array',
              of: [{ type: 'string' }],
            }),
            defineField({
              name: 'ctaLabel',
              title: 'CTA Label',
              type: 'string',
              initialValue: 'Get Started',
            }),
            defineField({
              name: 'ctaUrl',
              title: 'CTA URL',
              type: 'string',
            }),
            defineField({
              name: 'isHighlighted',
              title: 'Highlight Column',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'price',
              isHighlighted: 'isHighlighted',
            },
            prepare({ title, subtitle, isHighlighted }) {
              return {
                title: isHighlighted ? `⭐ ${title}` : title,
                subtitle,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(5),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Cream', value: 'accent-cream' },
          { title: 'Light Gray', value: 'gray-50' },
        ],
      },
      initialValue: 'white',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      columns: 'columns',
      features: 'features',
    },
    prepare({ title, columns, features }) {
      return {
        title: title || 'Comparison Section',
        subtitle: `${columns?.length || 0} columns, ${features?.length || 0} features`,
      };
    },
  },
});
