/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Añade los colores que necesitas
        teal: {
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        emerald: {
          600: '#059669',
          700: '#047857',
          800: '#065f46',
        },
         purple: {
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        violet: {
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        amber: {
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
        },
        indigo: {
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        }
      },
      backgroundImage: {
        'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};