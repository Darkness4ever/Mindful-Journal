// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  // You may omit `content` entirely in v4 if you rely on Tailwind’s auto-discovery.
  // But it’s often useful to be explicit:
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Add custom colors, spacing, etc. here if needed.
    },
  },
  plugins: [
    // e.g., require('@tailwindcss/forms'), require('@tailwindcss/typography'), etc.
  ],
};
