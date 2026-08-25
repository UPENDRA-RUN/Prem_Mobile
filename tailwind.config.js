/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          black: '#050505',
          darkBlack: '#0a0a0a',
          yellow: '#ffd000',
          yellowHover: '#e6bd00',
          gold: '#f4b800',
          red: '#e51b23',
          redHover: '#cc141c',
          white: '#ffffff',
          lightGray: '#f5f5f5',
          gray: '#777777',
          border: '#dedede',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        'page': '1500px',
      },
      boxShadow: {
        'category': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 24px -4px rgba(0, 0, 0, 0.12)',
        'yellow-glow': '0 0 30px rgba(255, 208, 0, 0.45)',
        'gold-glow': '0 0 40px rgba(244, 184, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
