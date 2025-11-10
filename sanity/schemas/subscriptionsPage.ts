import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'subscriptionsPage',
  title: 'Subscriptions Page',
  type: 'document',
  fields: [
    // Hero Section
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      initialValue: 'Subscriptions',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      initialValue: 'Your body likes rhythm.',
    }),
    defineField({
      name: 'heroText',
      title: 'Hero Text',
      type: 'text',
      rows: 2,
      initialValue: 'Subscribe to a weekly or bi-weekly drop. You choose your blend mix and size. Skip or pause anytime.',
    }),

    // How It Works Section
    defineField({
      name: 'howHeading',
      title: 'How It Works Heading',
      type: 'string',
      initialValue: 'How It Works',
    }),
    defineField({
      name: 'howSteps',
      title: 'How It Works Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'stepNumber',
              title: 'Step Number',
              type: 'number',
            }),
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Step Description',
              type: 'text',
              rows: 2,
            }),
          ],
        },
      ],
    }),

    // Member Perks Section
    defineField({
      name: 'perksHeading',
      title: 'Member Perks Heading',
      type: 'string',
      initialValue: 'Member Perks',
    }),
    defineField({
      name: 'perks',
      title: 'Member Perks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Perk Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Perk Description',
              type: 'text',
              rows: 2,
            }),
          ],
        },
      ],
    }),

    // Pricing Section
    defineField({
      name: 'pricingHeading',
      title: 'Pricing Heading',
      type: 'string',
      initialValue: 'Subscription Plans',
    }),
    defineField({
      name: 'plans',
      title: 'Subscription Plans',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Plan Name',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Plan Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'isPopular',
              title: 'Is Popular',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'priceItems',
              title: 'Price Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'size',
                      title: 'Size',
                      type: 'string',
                    }),
                    defineField({
                      name: 'price',
                      title: 'Price',
                      type: 'string',
                    }),
                  ],
                },
              ],
            }),
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'pricingNote',
      title: 'Pricing Note',
      type: 'string',
      initialValue: 'All plans include free local pickup. Delivery options coming soon.',
    }),

    // CTA Section
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      initialValue: 'Ready to Start?',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'text',
      rows: 2,
      initialValue: 'Join the community. Lock in your weekly or bi-weekly drops.',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heroHeading',
    },
    prepare({ title }) {
      return {
        title: title || 'Subscriptions Page',
      };
    },
  },
});
