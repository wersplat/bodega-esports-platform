/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./frontend/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroicons/react/solid/*.js",
    "./node_modules/@heroicons/react/outline/*.js",
  ],
  theme: {
    extend: {
      transitionProperty: {
        'spacing': 'margin-padding',
        'spacing': 'margin, padding',
      },
    },
  },
// No plugins are currently being used. Add plugins here if needed in the future.
  plugins: [],
}
