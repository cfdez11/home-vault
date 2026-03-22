/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'media',
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },

        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },

        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          subtle: 'var(--primary-subtle)',
        },

        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },

        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },

        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
          subtle: 'var(--accent-subtle)',
        },

        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
          subtle: 'var(--destructive-subtle)',
        },

        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
          subtle: 'var(--success-subtle)',
        },

        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
          subtle: 'var(--warning-subtle)',
        },

        caution: {
          DEFAULT: 'var(--caution)',
          foreground: 'var(--caution-foreground)',
          subtle: 'var(--caution-subtle)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',    /* 24px — cards, modals */
        md: 'var(--radius-md)', /* 16px — inner card elements */
        sm: 'var(--radius-sm)', /* 12px — buttons, inputs */
      },
      fontFamily: {
        'manrope': ['Manrope_400Regular'],
        'manrope-medium': ['Manrope_500Medium'],
        'manrope-semibold': ['Manrope_600SemiBold'],
        'manrope-bold': ['Manrope_700Bold'],
        'manrope-extrabold': ['Manrope_800ExtraBold'],
        'inter': ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
      },
    },
  },
  plugins: [],
}
