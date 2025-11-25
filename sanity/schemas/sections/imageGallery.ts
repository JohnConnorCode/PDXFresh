import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Masonry', value: 'masonry' },
          { title: 'Carousel', value: 'carousel' },
        ],
      },
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      imageCount: 'images.length',
      media: 'images.0',
    },
    prepare({ title, imageCount, media }) {
      return {
        title: title || 'Image Gallery',
        subtitle: `${imageCount || 0} images`,
        media,
      };
    },
  },
});
