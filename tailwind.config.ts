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
        'accent-primary': 'var(--accent-primary, #205b4c)',
        'accent-yellow': 'var(--accent-yellow, #f6a723)',
        'accent-green': 'var(--accent-green, #8ac7b8)',
        'accent-cream': 'var(--accent-cream, #fdf5e6)',
        'accent-secondary': 'var(--accent-secondary, #f28d6d)',
      },
      fontFamily: {
        'sans': ['var(--font-grotesk)', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      lineHeight: {
        'tight': '0.9',
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
