import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'centered' },
          { title: 'Split (Image Right)', value: 'split-right' },
          { title: 'Split (Image Left)', value: 'split-left' },
          { title: 'Full Width Background', value: 'full-width' },
        ],
      },
      initialValue: 'centered',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'ctaPrimary',
      title: 'Primary CTA',
      type: 'cta',
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'Secondary CTA',
      type: 'cta',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Cream', value: 'accent-cream' },
          { title: 'Yellow Gradient', value: 'yellow-gradient' },
          { title: 'Green Gradient', value: 'green-gradient' },
        ],
      },
      initialValue: 'white',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'variant',
      media: 'image',
    },
  },
});
