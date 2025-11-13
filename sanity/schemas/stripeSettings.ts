import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'stripeSettings',
  title: 'Stripe Settings',
  type: 'document',
  description: 'Global Stripe configuration. Controls whether test or production keys are used.',
  fields: [
    defineField({
      name: 'mode',
      title: 'Stripe Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Test Mode (sandbox)', value: 'test' },
          { title: 'Production Mode (live charges)', value: 'production' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      description: 'Controls which Stripe keys are used for checkouts. Test mode uses sandbox keys, production mode uses live keys.',
    }),
    defineField({
      name: 'lastModified',
      title: 'Last Modified',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
      description: 'Automatically updated when mode is changed',
    }),
    defineField({
      name: 'modifiedBy',
      title: 'Modified By',
      type: 'string',
      readOnly: true,
      description: 'Admin email who last changed the mode',
    }),
  ],
  preview: {
    select: {
      mode: 'mode',
      lastModified: 'lastModified',
    },
    prepare(selection) {
      const { mode, lastModified } = selection;
      const modeLabel = mode === 'production' ? '🔴 Production' : '🟢 Test';
      const lastModDate = lastModified
        ? new Date(lastModified).toLocaleDateString()
        : 'unknown';
      return {
        title: modeLabel,
        subtitle: `Last changed: ${lastModDate}`,
      };
    },
  },
});
