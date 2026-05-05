import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Shadcn semantic tokens mapped to ShopHub design system
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Brand palette
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          400: '#94A3B8',
          600: '#475569',
          800: '#1E293B',
          900: '#0F172A',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        danger: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        neutral: {
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
        },
        // Platform colors
        lazada: {
          DEFAULT: 'hsl(var(--lazada))',
          foreground: 'hsl(var(--lazada-foreground))',
        },
        shopee: {
          DEFAULT: 'hsl(var(--shopee))',
          foreground: 'hsl(var(--shopee-foreground))',
        },
        tiktok: {
          DEFAULT: 'hsl(var(--tiktok))',
          foreground: 'hsl(var(--tiktok-foreground))',
        },
        // Order status colors
        status: {
          pending: 'hsl(var(--status-pending))',
          confirmed: 'hsl(var(--status-confirmed))',
          shipping: 'hsl(var(--status-shipping))',
          delivered: 'hsl(var(--status-delivered))',
          cancelled: 'hsl(var(--status-cancelled))',
          returning: 'hsl(var(--status-returning))',
          urgent: 'hsl(var(--status-urgent))',
        },
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'Noto Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        display: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-1': ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-2': ['1.375rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        overline: ['0.6875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'numeric-lg': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        numeric: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'numeric-sm': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        code: ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px rgba(0, 0, 0, 0.05)',
        focus: '0 0 0 3px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

