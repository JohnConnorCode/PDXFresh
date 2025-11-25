import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contentSection',
  title: 'Content Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'centered' },
          { title: 'Left Aligned', value: 'left' },
          { title: 'Two Column', value: 'two-column' },
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Cream', value: 'accent-cream' },
          { title: 'Light Yellow', value: 'accent-yellow/10' },
          { title: 'Light Green', value: 'accent-green/10' },
        ],
      },
      initialValue: 'white',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'layout',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Content Section',
        subtitle: subtitle ? `Layout: ${subtitle}` : undefined,
      };
    },
  },
});
