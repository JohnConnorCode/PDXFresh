'use client';

import { defineConfig, Studio } from 'sanity';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from '../../../sanity/schemas';

const config = defineConfig({
  name: 'default',
  title: 'Long Life',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [visionTool()],
  schema: {
    types: schemaTypes,
  },
});

export default function StudioPage() {
  return <Studio config={config} />;
}
