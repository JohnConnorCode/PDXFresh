import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'farm',
  title: 'Farm',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Farm Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'practices',
      title: 'Farming Practices',
      type: 'blockContent',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
  ],
});
