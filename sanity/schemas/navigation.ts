import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'primaryLinks',
      title: 'Primary Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'reference',
              title: 'Link To',
              type: 'reference',
              to: { type: 'page' },
            }),
            defineField({
              name: 'externalUrl',
              title: 'External URL',
              type: 'url',
            }),
            defineField({
              name: 'newTab',
              title: 'Open in new tab',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'reference',
              title: 'Link To',
              type: 'reference',
              to: { type: 'page' },
            }),
            defineField({
              name: 'externalUrl',
              title: 'External URL',
              type: 'url',
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'reference',
              title: 'Link To',
              type: 'reference',
              to: { type: 'page' },
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
    }),
  ],
});
