import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        'dark-bg': '#1a202c',
        'dark-text': '#f7fafc',
        background: {
          light: 'white',
          dark: '#121212',
        },
      },

      // ✅ Minimal fix for border classes
      borderColor: ({theme}) => ({
        border: theme("colors.border"),
        input: theme("colors.input"),
        ring: theme("colors.ring"),
      }),

      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#111827',
            lineHeight: '1.7',
            h1: { fontSize: '2.25rem', fontWeight: '700', marginTop: '1.5em', marginBottom: '0.75em', letterSpacing: '-0.025em' },
            h2: { fontSize: '1.75rem', fontWeight: '600', marginTop: '1.25em', marginBottom: '0.6em', letterSpacing: '-0.02em' },
            h3: { fontSize: '1.25rem', fontWeight: '600', marginTop: '1em', marginBottom: '0.5em' },
            p: { marginTop: '1em', marginBottom: '1em' },
            blockquote: { fontStyle: 'italic', borderLeft: '4px solid #e5e7eb', paddingLeft: '1em', color: '#6b7280', backgroundColor: '#f9fafb', borderRadius: '0.5rem' },
            ul: { listStyleType: 'disc', paddingLeft: '1.5em' },
            ol: { listStyleType: 'decimal', paddingLeft: '1.5em' },
            a: { color: '#2563eb', textDecoration: 'underline', fontWeight: '500', '&:hover': { color: '#1d4ed8' } },
            code: { backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '0.25rem', fontWeight: '500', fontSize: '0.875em' },
            pre: { backgroundColor: '#111827', color: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' },
          },
        },
        invert: {
          css: {
            color: '#e5e7eb',
            lineHeight: '1.7',
            h1: { color: '#fff' },
            h2: { color: '#f3f4f6' },
            h3: { color: '#f3f4f6' },
            p: { color: '#d1d5db' },
            blockquote: { color: '#d1d5db', backgroundColor: '#1f2937', borderLeft: '4px solid #374151' },
            a: { color: '#60a5fa' },
            code: { backgroundColor: '#374151', color: '#e5e7eb' },
            pre: { backgroundColor: '#111827', color: '#f9fafb' },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}

export default config
