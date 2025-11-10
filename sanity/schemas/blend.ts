import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blend',
  title: 'Blend',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Blend Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short, punchy description. E.g., "Wake the system. Feel the rush."',
    }),
    defineField({
      name: 'functionList',
      title: 'Functions',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'E.g., "energy", "focus", "mood elevation"',
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'ingredient' },
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'labelColor',
      title: 'Label Color',
      type: 'string',
      options: {
        list: [
          { title: 'Yellow', value: 'yellow' },
          { title: 'Red', value: 'red' },
          { title: 'Green', value: 'green' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Blend Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'sizePrice' },
        },
      ],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
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
      title: 'name',
      subtitle: 'tagline',
      media: 'image',
    },
  },
});
