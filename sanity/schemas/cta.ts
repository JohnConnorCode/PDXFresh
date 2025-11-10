import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'cta',
  title: 'Call to Action',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Link', value: 'link' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'target',
      title: 'Link Target',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Internal Page', value: 'page' },
              { title: 'External URL', value: 'external' },
            ],
          },
        }),
        defineField({
          name: 'pageRef',
          title: 'Page',
          type: 'reference',
          to: { type: 'page' },
          hidden: ({ parent }) => parent?.type !== 'page',
        }),
        defineField({
          name: 'externalUrl',
          title: 'External URL',
          type: 'url',
          hidden: ({ parent }) => parent?.type !== 'external',
        }),
        defineField({
          name: 'newTab',
          title: 'Open in new tab',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'prefetch',
      title: 'Prefetch Link',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});
