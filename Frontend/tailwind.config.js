/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f0ff',
          100: '#e6e1ff',
          200: '#cec4ff',
          300: '#ab97ff',
          400: '#8a68ff',
          500: '#6f3dfb',
          600: '#5f27f0',
          700: '#4f1cd6',
          800: '#4219ac',
          900: '#371888',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(79, 28, 214, 0.12)',
        card: '0 2px 12px -2px rgba(16, 24, 40, 0.08)',
      },
    },
  },
  plugins: [],
}
