/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB130',
        'primary-dark': '#E69D20',
        'primary-light': '#FFC160',
        accent: '#FFB130',
        background: '#FFFFFF',
        'background-alt': '#F5F5F5',
        'background-secondary': '#F5F5F5',
        text: '#000000',
        'text-secondary': '#666666',
        border: '#E0E0E0',
        card: '#F5F5F5',
        warning: '#F59E0B',
        success: '#10B981',
        error: '#EF4444',
        'btn-bg': '#000000',
        'btn-text': '#FFFFFF',
        'progress-bg': '#000000',
        'progress-tip': '#FFB130',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        card: '0 4px 8px rgba(0, 0, 0, 0.08)',
        elevated: '0 6px 16px rgba(0, 0, 0, 0.12)',
        button: '0 2px 5px rgba(0, 0, 0, 0.15)',
        focus: '0 0 0 3px rgba(255, 177, 48, 0.4)',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        'lg': '0.5rem',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
    },
  },
  plugins: [],
} 