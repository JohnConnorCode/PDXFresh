import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role/Title',
      type: 'string',
      description: 'Optional. E.g., "Marathon Runner", "Busy Parent", "Wellness Coach"',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      description: 'The testimonial text',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'image',
      title: 'Customer Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
    defineField({
      name: 'blend',
      title: 'Related Blend',
      type: 'reference',
      to: { type: 'blend' },
      description: 'Optional: Link to the specific blend they\'re talking about',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Featured testimonials appear on homepage',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'quote',
      media: 'image',
    },
  },
});
