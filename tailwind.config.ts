import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/views/**/*.{ts,tsx,html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config
