import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sizePrice',
  title: 'Size & Price',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'E.g., "1-Gallon Jug", "½-Gallon Jug", "Shot"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'stripePriceId',
      title: 'Stripe Price ID',
      type: 'string',
      description: 'Optional: The Stripe Price ID for checkout (e.g., price_xxxxx). Use when not linking to a Stripe Product.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true; // Optional field
          if (!/^price_[a-zA-Z0-9]+$/.test(value)) {
            return 'Must be a valid Stripe Price ID (starts with "price_")';
          }
          return true;
        }),
    }),
  ],
});
