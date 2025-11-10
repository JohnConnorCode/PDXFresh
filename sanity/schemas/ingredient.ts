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
      name: 'function',
      title: 'Function',
      type: 'blockContent',
      description: 'Detailed explanation of this ingredient\'s health benefits and functional properties',
    }),
    defineField({
      name: 'image',
      title: 'Ingredient Image',
      type: 'image',
      description: 'High-quality photo of the ingredient (min 800x800px)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'nutritionalProfile',
      title: 'Nutritional Profile',
      type: 'text',
      rows: 3,
      description: 'Key vitamins, minerals, and compounds',
    }),
    defineField({
      name: 'sourcingStory',
      title: 'Sourcing Story',
      type: 'blockContent',
      description: 'Where and how we source this ingredient, farm partnerships, seasonal details',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
});
