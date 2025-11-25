import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pageBuilder',
  title: 'Page Builder',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        { type: 'heroSection' },
        { type: 'contentSection' },
        { type: 'ctaSection' },
        { type: 'featureGrid' },
        { type: 'imageGallery' },
        { type: 'statsSection' },
        { type: 'testimonialsSection' },
        { type: 'newsletterSection' },
      ],
      validation: (Rule) => Rule.required().min(1),
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
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to publish/unpublish this page',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      isPublished: 'isPublished',
    },
    prepare({ title, subtitle, isPublished }) {
      return {
        title,
        subtitle: `/${subtitle} ${isPublished ? '✓ Published' : '⦿ Draft'}`,
      };
    },
  },
});
