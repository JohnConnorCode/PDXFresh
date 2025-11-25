import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'newsletterSection',
  title: 'Newsletter Section',
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
      rows: 3,
    }),
    defineField({
      name: 'placeholder',
      title: 'Input Placeholder',
      type: 'string',
      initialValue: 'Enter your email',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Subscribe',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Simple', value: 'simple' },
          { title: 'With Image', value: 'with-image' },
          { title: 'Banner', value: 'banner' },
        ],
      },
      initialValue: 'simple',
    }),
    defineField({
      name: 'image',
      title: 'Image (for "With Image" variant)',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.variant !== 'with-image',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      variant: 'variant',
    },
    prepare({ title, variant }) {
      return {
        title: title || 'Newsletter Section',
        subtitle: variant ? `Variant: ${variant}` : undefined,
      };
    },
  },
});
