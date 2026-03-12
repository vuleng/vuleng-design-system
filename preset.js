const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // ── Brand palette (from Profilhåndbok) ──────────────────────────────
        vulkan: {
          // Primary orange — logo colour, CTAs
          orange: '#FF8935',        // Oransje A
          'orange-hover': '#F06400', // Oransje B  (darker shade for :hover)
          'orange-light': '#FFB885', // Oransje C  (soft tint)
          // Primary blue — headers, nav, key surfaces
          navy: '#183653',           // Marineblå
          // Background tint — page / panel backgrounds on light mode
          bg: '#F5F9FF',             // Lyseblå
          // Text / UI neutrals
          gray: '#3F3F3F',           // Grå  — sub-headings, secondary text
          black: '#1D1D1D',          // Svart — body text, high-contrast text
        },
        // ── Dark mode surfaces (functional, not in brand guide) ─────────────
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          card: '#283548',
        },
        orange: {
          50: '#fff8f0',
          100: '#ffedd9',
          200: '#ffd9b3',
          300: '#FFB885',
          400: '#FF8935',
          500: '#F06400',
          600: '#cc5500',
          700: '#a34400',
          800: '#7a3300',
          900: '#522200',
          950: '#331500',
        },
        navy: {
          50: '#F5F9FF',
          100: '#e0eaf4',
          200: '#b8cce0',
          300: '#8faec9',
          400: '#5c83a8',
          500: '#3a6389',
          600: '#2a4d6d',
          700: '#183653',
          800: '#122a42',
          900: '#0d1f31',
          950: '#081420',
        },
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },

  plugins: [
    plugin(function ({ addBase, addComponents }) {
      // ── Base styles ──
      addBase({
        '*, *::before, *::after': {
          margin: '0',
          padding: '0',
          boxSizing: 'border-box',
        },
        html: {
          '-webkit-text-size-adjust': '100%',
        },
        '[v-cloak]': {
          display: 'none',
        },
      })

      // ── Component classes ──
      addComponents({
        // ── Soft Glass Buttons ──
        '.btn-primary': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1.25rem',
          fontSize: '0.875rem',
          fontWeight: '700',
          lineHeight: '1.25rem',
          color: '#ffffff',
          backgroundColor: 'rgba(255, 137, 53, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 150ms ease, opacity 150ms ease, box-shadow 150ms ease',
          boxShadow: '0 1px 3px 0 rgba(255, 137, 53, 0.16), 0 1px 2px -1px rgba(255, 137, 53, 0.10)',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(240, 100, 0, 0.95)',
            boxShadow: '0 4px 6px -1px rgba(255, 137, 53, 0.18), 0 2px 4px -2px rgba(255, 137, 53, 0.10)',
          },
          '&:active:not(:disabled)': {
            opacity: '0.9',
            boxShadow: '0 1px 2px 0 rgba(255, 137, 53, 0.12)',
          },
          '&:disabled': {
            backgroundColor: '#cbd5e1',
            color: '#94a3b8',
            cursor: 'not-allowed',
            border: '1px solid transparent',
            backdropFilter: 'none',
            boxShadow: 'none',
          },
          '.dark &:disabled': {
            backgroundColor: '#334155',
            color: '#64748b',
          },
        },

        '.btn-secondary': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          lineHeight: '1.25rem',
          color: '#183653',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 150ms ease, border-color 150ms ease',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#183653',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
          '.dark &': {
            color: '#e2e8f0',
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderColor: 'rgba(71, 85, 105, 0.6)',
          },
          '.dark &:hover:not(:disabled)': {
            backgroundColor: 'rgba(51, 65, 85, 0.8)',
            borderColor: '#94a3b8',
          },
        },

        '.btn-ghost': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          lineHeight: '1.25rem',
          color: '#183653',
          backgroundColor: 'transparent',
          border: '1px solid transparent',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 150ms ease, color 150ms ease',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(24, 54, 83, 0.06)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
          '.dark &': {
            color: '#e2e8f0',
          },
          '.dark &:hover:not(:disabled)': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
        },

        '.btn-danger': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1.25rem',
          fontSize: '0.875rem',
          fontWeight: '700',
          lineHeight: '1.25rem',
          color: '#ffffff',
          backgroundColor: 'rgba(220, 38, 38, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 150ms ease, opacity 150ms ease',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(185, 28, 28, 0.95)',
          },
          '&:active:not(:disabled)': {
            opacity: '0.9',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },

        '.btn-navy': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1.25rem',
          fontSize: '0.875rem',
          fontWeight: '700',
          lineHeight: '1.25rem',
          color: '#ffffff',
          backgroundColor: 'rgba(24, 54, 83, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 150ms ease, opacity 150ms ease, box-shadow 150ms ease',
          boxShadow: '0 1px 3px 0 rgba(24, 54, 83, 0.16), 0 1px 2px -1px rgba(24, 54, 83, 0.10)',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(18, 42, 66, 0.95)',
            boxShadow: '0 4px 6px -1px rgba(24, 54, 83, 0.18), 0 2px 4px -2px rgba(24, 54, 83, 0.10)',
          },
          '&:active:not(:disabled)': {
            opacity: '0.9',
            boxShadow: '0 1px 2px 0 rgba(24, 54, 83, 0.12)',
          },
          '&:disabled': {
            backgroundColor: '#cbd5e1',
            color: '#94a3b8',
            cursor: 'not-allowed',
            border: '1px solid transparent',
            backdropFilter: 'none',
            boxShadow: 'none',
          },
          '.dark &:disabled': {
            backgroundColor: '#334155',
            color: '#64748b',
          },
        },

        // ── Card ──
        '.card': {
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
          '.dark &': {
            backgroundColor: '#1e293b',
            borderColor: '#374151',
          },
        },

        // ── Input Field ──
        '.input-field': {
          width: '100%',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: '#111827',
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          outline: 'none',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          '&::placeholder': {
            color: '#9ca3af',
          },
          '&:focus': {
            borderColor: 'transparent',
            boxShadow: '0 0 0 2px #FF8935',
          },
          '.dark &': {
            color: '#f3f4f6',
            backgroundColor: '#283548',
            borderColor: '#4b5563',
          },
          '.dark &::placeholder': {
            color: '#6b7280',
          },
        },

        // ── Select Field ──
        '.select-field': {
          width: '100%',
          padding: '0.5rem 2.5rem 0.5rem 1rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: '#111827',
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          outline: 'none',
          appearance: 'none',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
          cursor: 'pointer',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          '&:focus': {
            borderColor: 'transparent',
            boxShadow: '0 0 0 2px #FF8935',
          },
          '.dark &': {
            color: '#f3f4f6',
            backgroundColor: '#283548',
            borderColor: '#4b5563',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%239ca3af'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
          },
        },

        // ── Badge ──
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.125rem 0.625rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '700',
          lineHeight: '1rem',
        },
      })
    }),
  ],
}
