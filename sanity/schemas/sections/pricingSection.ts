import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pricingSection',
  title: 'Pricing Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Simple, Transparent Pricing',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'plans',
      title: 'Pricing Plans',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Plan Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'string',
              description: 'e.g., "$49/month" or "Custom"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'priceNote',
              title: 'Price Note',
              type: 'string',
              description: 'e.g., "per month, billed annually"',
            }),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'ctaLabel',
              title: 'CTA Button Label',
              type: 'string',
              initialValue: 'Get Started',
            }),
            defineField({
              name: 'ctaUrl',
              title: 'CTA Button URL',
              type: 'string',
            }),
            defineField({
              name: 'isPopular',
              title: 'Mark as Popular',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'popularLabel',
              title: 'Popular Badge Label',
              type: 'string',
              initialValue: 'Most Popular',
              hidden: ({ parent }) => !parent?.isPopular,
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'price',
              isPopular: 'isPopular',
            },
            prepare({ title, subtitle, isPopular }) {
              return {
                title: isPopular ? `⭐ ${title}` : title,
                subtitle,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(4),
    }),
    defineField({
      name: 'variant',
      title: 'Layout Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Cards', value: 'cards' },
          { title: 'Table', value: 'table' },
        ],
      },
      initialValue: 'cards',
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
      plans: 'plans',
    },
    prepare({ title, plans }) {
      return {
        title: title || 'Pricing Section',
        subtitle: `${plans?.length || 0} plans`,
      };
    },
  },
});
