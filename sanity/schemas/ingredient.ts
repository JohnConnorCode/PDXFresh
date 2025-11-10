import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'ingredient',
  title: 'Ingredient',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Ingredient Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Fruit', value: 'fruit' },
          { title: 'Root', value: 'root' },
          { title: 'Green', value: 'green' },
          { title: 'Herb', value: 'herb' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'seasonality',
      title: 'Seasonality',
      type: 'string',
      description: 'E.g., "Year-round", "Summer", "Winter"',
    }),
    defineField({
      name: 'farms',
      title: 'Source Farms',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'farm' },
        },
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
});
