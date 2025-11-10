// CRITICAL: Trim whitespace from environment variables (Vercel can add newlines)
export const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jrc9x3mn').trim();
export const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').trim();
export const apiVersion = '2024-01-01';
