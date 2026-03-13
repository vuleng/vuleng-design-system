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
        // ── Navy-tinted neutrals — replaces generic grays in light mode ─────
        neutral: {
          50:  '#f7f9fb',
          100: '#edf1f5',
          200: '#dce3eb',
          300: '#c4ced9',
          400: '#94a3b4',
          500: '#6b7d8f',
          600: '#4a5e71',
          700: '#364b5e',
          800: '#253a4d',
          900: '#1a2c3d',
          950: '#0f1c2a',
        },
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'heading': '-0.02em',
        'body': '0',
        'wide': '0.05em',
      },
      lineHeight: {
        'heading': '1.2',
        'body': '1.6',
      },
      maxWidth: {
        'prose': '65ch',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px 0 rgba(24, 54, 83, 0.06), 0 1px 2px -1px rgba(24, 54, 83, 0.04)',
        'elevation-2': '0 4px 6px -1px rgba(24, 54, 83, 0.08), 0 2px 4px -2px rgba(24, 54, 83, 0.04)',
        'elevation-3': '0 10px 15px -3px rgba(24, 54, 83, 0.10), 0 4px 6px -4px rgba(24, 54, 83, 0.05)',
      },
    },
  },

  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
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
        // ── Reduced motion: disable all transitions & animations ──
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
        // ── Typography base ──
        'h1, h2, h3, h4, h5, h6': {
          letterSpacing: '-0.02em',
          lineHeight: '1.2',
        },
        'p, li, dd, dt': {
          lineHeight: '1.6',
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
          fontSize: '0.9375rem',
          fontWeight: '700',
          lineHeight: '1.25rem',
          letterSpacing: '0.01em',
          color: '#ffffff',
          backgroundColor: 'rgba(224, 117, 32, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 150ms ease, opacity 150ms ease, box-shadow 150ms ease, transform 150ms ease',
          boxShadow: '0 1px 3px 0 rgba(224, 117, 32, 0.16), 0 1px 2px -1px rgba(224, 117, 32, 0.10)',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(208, 96, 0, 0.98)',
            boxShadow: '0 4px 6px -1px rgba(224, 117, 32, 0.22), 0 2px 4px -2px rgba(224, 117, 32, 0.12)',
            transform: 'translateY(-1px)',
          },
          '&:active:not(:disabled)': {
            opacity: '0.9',
            boxShadow: '0 1px 2px 0 rgba(224, 117, 32, 0.12)',
            transform: 'translateY(0)',
          },
          '&:disabled': {
            backgroundColor: '#c4ced9',
            color: '#6b7d8f',
            cursor: 'not-allowed',
            border: '1px solid transparent',
            backdropFilter: 'none',
            boxShadow: 'none',
            transform: 'none',
          },
          '.dark &:disabled': {
            backgroundColor: '#364b5e',
            color: '#6b7d8f',
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
          backgroundColor: 'rgba(247, 249, 251, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(196, 206, 217, 0.8)',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 150ms ease, border-color 150ms ease, transform 150ms ease',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#183653',
            transform: 'translateY(-1px)',
          },
          '&:active:not(:disabled)': {
            transform: 'translateY(0)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            transform: 'none',
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
          transition: 'background-color 150ms ease, color 150ms ease, transform 150ms ease',
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
          transition: 'background-color 150ms ease, opacity 150ms ease, transform 150ms ease',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(185, 28, 28, 0.95)',
            transform: 'translateY(-1px)',
          },
          '&:active:not(:disabled)': {
            opacity: '0.9',
            transform: 'translateY(0)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            transform: 'none',
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
          transition: 'background-color 150ms ease, opacity 150ms ease, box-shadow 150ms ease, transform 150ms ease',
          boxShadow: '0 1px 3px 0 rgba(24, 54, 83, 0.16), 0 1px 2px -1px rgba(24, 54, 83, 0.10)',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(18, 42, 66, 0.95)',
            boxShadow: '0 4px 6px -1px rgba(24, 54, 83, 0.18), 0 2px 4px -2px rgba(24, 54, 83, 0.10)',
            transform: 'translateY(-1px)',
          },
          '&:active:not(:disabled)': {
            opacity: '0.9',
            boxShadow: '0 1px 2px 0 rgba(24, 54, 83, 0.12)',
            transform: 'translateY(0)',
          },
          '&:disabled': {
            backgroundColor: '#c4ced9',
            color: '#6b7d8f',
            cursor: 'not-allowed',
            border: '1px solid transparent',
            backdropFilter: 'none',
            boxShadow: 'none',
            transform: 'none',
          },
          '.dark &:disabled': {
            backgroundColor: '#364b5e',
            color: '#6b7d8f',
          },
        },

        // ── Card — navy-tinted glass with elevation hierarchy ──
        '.card': {
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 206, 217, 0.6)',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(24, 54, 83, 0.06), 0 1px 2px -1px rgba(24, 54, 83, 0.04)',
          '.dark &': {
            backgroundColor: 'rgba(30, 41, 59, 0.85)',
            borderColor: 'rgba(71, 85, 105, 0.5)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.12)',
          },
        },
        '.card-raised': {
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 206, 217, 0.5)',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(24, 54, 83, 0.08), 0 2px 4px -2px rgba(24, 54, 83, 0.04)',
          '.dark &': {
            backgroundColor: 'rgba(40, 53, 72, 0.9)',
            borderColor: 'rgba(71, 85, 105, 0.5)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -2px rgba(0, 0, 0, 0.15)',
          },
        },
        '.card-floating': {
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(196, 206, 217, 0.4)',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(24, 54, 83, 0.10), 0 4px 6px -4px rgba(24, 54, 83, 0.05)',
          '.dark &': {
            backgroundColor: 'rgba(40, 53, 72, 0.95)',
            borderColor: 'rgba(71, 85, 105, 0.4)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
          },
        },

        // ── Input Field — navy-tinted borders ──
        '.input-field': {
          width: '100%',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: '#1D1D1D',
          backgroundColor: '#ffffff',
          border: '1px solid #c4ced9',
          borderRadius: '0.5rem',
          outline: 'none',
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
          '&::placeholder': {
            color: '#94a3b4',
          },
          '&:focus': {
            borderColor: 'transparent',
            boxShadow: '0 0 0 2px rgba(224, 117, 32, 0.5), 0 0 0 4px rgba(224, 117, 32, 0.15)',
          },
          '.dark &': {
            color: '#f3f4f6',
            backgroundColor: '#283548',
            borderColor: '#4a5e71',
          },
          '.dark &::placeholder': {
            color: '#6b7d8f',
          },
        },

        // ── Select Field — navy-tinted borders ──
        '.select-field': {
          width: '100%',
          padding: '0.5rem 2.5rem 0.5rem 1rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: '#1D1D1D',
          backgroundColor: '#ffffff',
          border: '1px solid #c4ced9',
          borderRadius: '0.5rem',
          outline: 'none',
          appearance: 'none',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7d8f'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
          cursor: 'pointer',
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
          '&:focus': {
            borderColor: 'transparent',
            boxShadow: '0 0 0 2px rgba(224, 117, 32, 0.5), 0 0 0 4px rgba(224, 117, 32, 0.15)',
          },
          '.dark &': {
            color: '#f3f4f6',
            backgroundColor: '#283548',
            borderColor: '#4a5e71',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b4'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
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
          letterSpacing: '0.02em',
        },

        // ── Button Sizes ──
        '.btn-sm': {
          padding: '0.375rem 0.75rem',
          fontSize: '0.8125rem',
          gap: '0.375rem',
        },
        '.btn-lg': {
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          gap: '0.625rem',
        },

        // ── Skeleton Loader ──
        '.skeleton': {
          backgroundColor: '#edf1f5',
          borderRadius: '0.375rem',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          '.dark &': {
            backgroundColor: '#253a4d',
          },
        },
        '.skeleton-text': {
          height: '0.875rem',
          borderRadius: '0.25rem',
        },
        '.skeleton-heading': {
          height: '1.5rem',
          width: '60%',
          borderRadius: '0.25rem',
        },
        '.skeleton-avatar': {
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '9999px',
        },
      })

      // ── Utility classes ──
      addUtilities({
        '.text-balance': {
          textWrap: 'balance',
        },
        '.text-pretty': {
          textWrap: 'pretty',
        },
      })
    }),
  ],
}
