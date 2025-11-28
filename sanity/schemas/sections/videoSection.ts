import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'videoSection',
  title: 'Video Section',
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
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube or Vimeo URL',
      validation: (Rule) =>
        Rule.required().custom((url) => {
          if (!url) return true;
          const isYouTube =
            url.includes('youtube.com') || url.includes('youtu.be');
          const isVimeo = url.includes('vimeo.com');
          if (!isYouTube && !isVimeo) {
            return 'Please enter a valid YouTube or Vimeo URL';
          }
          return true;
        }),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Custom Thumbnail',
      type: 'image',
      description: 'Optional: Override the video thumbnail',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption below the video',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9 (Widescreen)', value: '16/9' },
          { title: '4:3 (Standard)', value: '4/3' },
          { title: '1:1 (Square)', value: '1/1' },
          { title: '9:16 (Vertical)', value: '9/16' },
        ],
      },
      initialValue: '16/9',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max Width',
      type: 'string',
      options: {
        list: [
          { title: 'Small (640px)', value: 'max-w-xl' },
          { title: 'Medium (768px)', value: 'max-w-3xl' },
          { title: 'Large (1024px)', value: 'max-w-5xl' },
          { title: 'Full Width', value: 'max-w-7xl' },
        ],
      },
      initialValue: 'max-w-5xl',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Cream', value: 'accent-cream' },
          { title: 'Dark', value: 'gray-900' },
        ],
      },
      initialValue: 'white',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      videoUrl: 'videoUrl',
    },
    prepare({ title, videoUrl }) {
      return {
        title: title || 'Video Section',
        subtitle: videoUrl || 'No video URL set',
      };
    },
  },
});
