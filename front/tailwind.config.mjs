/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  purge: [
    "./src/app/components/**/*.js",
    "./src/app/**/*.js",
    // "./src/app/Login/*.{js,ts,jsx,tsx,mdx}",
    // "./src/app/JoinClass/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: 'class',
  variants: {},  
  plugins: [],
};
