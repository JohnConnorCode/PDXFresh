import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
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
          name: 'ctaPrimary',
          title: 'Primary CTA',
          type: 'reference',
          to: { type: 'cta' },
        }),
        defineField({
          name: 'ctaSecondary',
          title: 'Secondary CTA',
          type: 'reference',
          to: { type: 'cta' },
        }),
        defineField({
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    defineField({
      name: 'valueProps',
      title: 'Value Propositions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'icon',
              title: 'Icon (optional)',
              type: 'image',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'featuredBlends',
      title: 'Featured Blends',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'blend' },
        },
      ],
    }),
    defineField({
      name: 'sizesPricing',
      title: 'Sizes & Pricing',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'sizePrice' },
        },
      ],
    }),
    defineField({
      name: 'processIntro',
      title: 'Process Section Intro',
      type: 'string',
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'processStep' },
        },
      ],
    }),
    defineField({
      name: 'sourcingIntro',
      title: 'Sourcing Section Intro',
      type: 'string',
    }),
    defineField({
      name: 'standards',
      title: 'Quality Standards',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'standard' },
        },
      ],
    }),
    defineField({
      name: 'communityBlurb',
      title: 'Community Blurb',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'newsletterCta',
      title: 'Newsletter CTA',
      type: 'reference',
      to: { type: 'cta' },
    }),
  ],
});
