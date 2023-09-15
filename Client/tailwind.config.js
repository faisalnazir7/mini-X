/** @type {import('tailwindcss').Config} */ 
export default { 
  content: [ 
    // Or if using src directory: 
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
    "./node_modules/tw-elements/dist/js/**/*.js", 
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite-react/**/*.js', './Pages/**/*.{ts,tsx}','./Components/**/*.{ts,tsx}', './public/**/*.html',
  ], 
  darkMode: 'class', 
  theme: { 
    extend: {  
      colors: { 
        dark: "#000000", 
        light: "#f5f5f5", 
        primary: "#B63E96", 
        primaryDark: "#58E6D9",  
      }, 
    },
  }, 
  plugins: [], 
}
