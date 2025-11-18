import { defineConfig, type Config } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { structure } from './sanity/structure';
import { OpenPreviewAction } from './sanity/actions/OpenPreviewAction';

const config: Config = defineConfig({
  name: 'default',
  title: 'Long Life',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      return [...prev, OpenPreviewAction];
    },
  },
});

export default config;
