/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          50:  '#f0efff',
          100: '#e4e2ff',
          200: '#cdc9ff',
          300: '#ada6ff',
          400: '#8b80ff',
          500: '#6C63FF',
          600: '#5a50f5',
          700: '#4a3fdf',
          800: '#3d34b8',
          900: '#342d93'
        },
        accent: {
          DEFAULT: '#00D4AA',
          50:  '#e6fff9',
          100: '#b3fff0',
          200: '#66ffe1',
          300: '#1affd2',
          400: '#00f0c0',
          500: '#00D4AA',
          600: '#00b891',
          700: '#009678',
          800: '#007860',
          900: '#005e4c'
        },
        surface: {
          DEFAULT: '#1A1A2E',
          50:  '#f2f2f8',
          100: '#d9d9ef',
          200: '#b3b3de',
          300: '#8c8ccc',
          400: '#6666bb',
          500: '#4040a0',
          600: '#2e2e7a',
          700: '#242452',
          800: '#1A1A2E',
          900: '#12121f'
        },
        base: {
          DEFAULT: '#0A0A0F',
          50:  '#e8e8f0',
          100: '#c5c5d8',
          200: '#9090b5',
          300: '#5b5b92',
          400: '#36366f',
          500: '#1e1e4a',
          600: '#141430',
          700: '#0e0e20',
          800: '#0A0A0F',
          900: '#050508'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
        'gradient-surface': 'linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)'
      },
      boxShadow: {
        'primary': '0 0 20px rgba(108, 99, 255, 0.35)',
        'accent':  '0 0 20px rgba(0, 212, 170, 0.35)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}