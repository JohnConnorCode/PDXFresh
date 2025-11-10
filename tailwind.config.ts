import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (can be overridden via CSS variables from Sanity)
        'accent-yellow': 'var(--accent-yellow, #FCD34D)',
        'accent-red': 'var(--accent-red, #EF4444)',
        'accent-green': 'var(--accent-green, #10B981)',
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-playfair)', 'serif'],
      },
      spacing: {
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
};

export default config;
