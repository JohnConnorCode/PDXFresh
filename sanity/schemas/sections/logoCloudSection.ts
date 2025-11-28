import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'logoCloudSection',
  title: 'Logo Cloud Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Trusted By',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Logo Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Company Name',
              type: 'string',
              description: 'Used for alt text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link URL',
              type: 'url',
              description: 'Optional: Link to company website',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              media: 'image',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(3).max(12),
    }),
    defineField({
      name: 'variant',
      title: 'Display Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'Inline', value: 'inline' },
        ],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'grayscale',
      title: 'Grayscale Effect',
      type: 'boolean',
      description: 'Show logos in grayscale, color on hover',
      initialValue: true,
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
      logos: 'logos',
    },
    prepare({ title, logos }) {
      return {
        title: title || 'Logo Cloud Section',
        subtitle: `${logos?.length || 0} logos`,
      };
    },
  },
});
