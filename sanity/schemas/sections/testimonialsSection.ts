import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'testimonialsSection',
  title: 'Testimonials Section',
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
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Carousel', value: 'carousel' },
          { title: 'Grid', value: 'grid' },
        ],
      },
      initialValue: 'carousel',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      testimonialCount: 'testimonials.length',
    },
    prepare({ title, testimonialCount }) {
      return {
        title: title || 'Testimonials Section',
        subtitle: `${testimonialCount || 0} testimonials`,
      };
    },
  },
});
