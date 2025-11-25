import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'ctaSection',
  title: 'CTA Section',
  type: 'object',
  fields: [
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
      rows: 2,
    }),
    defineField({
      name: 'ctaPrimary',
      title: 'Primary CTA',
      type: 'cta',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'Secondary CTA',
      type: 'cta',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'centered' },
          { title: 'Banner', value: 'banner' },
          { title: 'Box', value: 'box' },
        ],
      },
      initialValue: 'centered',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Primary Green', value: 'accent-primary' },
          { title: 'Yellow', value: 'accent-yellow' },
          { title: 'Cream', value: 'accent-cream' },
          { title: 'White', value: 'white' },
        ],
      },
      initialValue: 'accent-primary',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'variant',
    },
  },
});
