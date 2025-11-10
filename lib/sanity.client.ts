import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jrc9x3mn';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

let cachedClient: ReturnType<typeof createClient> | null = null;
let cachedPreviewClient: ReturnType<typeof createClient> | null = null;

function createSanityClient() {
  try {
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      token: process.env.SANITY_READ_TOKEN,
    });
  } catch {
    return null;
  }
}

function createSanityPreviewClient() {
  try {
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_READ_TOKEN,
    });
  } catch {
    return null;
  }
}

export function getClient(usePreview = false) {
  if (usePreview) {
    if (!cachedPreviewClient) {
      cachedPreviewClient = createSanityPreviewClient();
    }
    return cachedPreviewClient!;
  } else {
    if (!cachedClient) {
      cachedClient = createSanityClient();
    }
    return cachedClient!;
  }
}

// Initialize clients
cachedClient = createSanityClient();
cachedPreviewClient = createSanityPreviewClient();

export const client = cachedClient!;
export const previewClient = cachedPreviewClient!;
