/**
 * PORTLAND FRESH - Migration-Ready Schema
 *
 * This is the Portland Fresh version of post.ts
 * Copy this to sanity/schemas/post.ts when migrating to your own Sanity instance
 *
 * Changes from shared version:
 * - Line 68: Removed "Wellness" category, added "Flavor" and "Kitchen Tips"
 */
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Journal Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to publish/unpublish this post',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Flavor', value: 'flavor' },
          { title: 'Recipes', value: 'recipes' },
          { title: 'Kitchen Tips', value: 'kitchen-tips' },
          { title: 'Sustainability', value: 'sustainability' },
          { title: 'Behind the Scenes', value: 'behind-the-scenes' },
        ],
      },
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
      title: 'title',
      subtitle: 'excerpt',
      media: 'coverImage',
    },
  },
});
