/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        dark: {
          50: '#18181b',
          100: '#27272a',
          200: '#3f3f46',
          300: '#52525b',
          400: '#71717a',
          500: '#a1a1aa',
          600: '#d4d4d8',
          700: '#e4e4e7',
          800: '#f4f4f5',
          900: '#fafafa'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'rgb(55 65 81)',
            lineHeight: '1.7',
            a: {
              color: '#3b82f6',
              textDecoration: 'none',
              '&:hover': {
                color: '#1d4ed8',
                textDecoration: 'underline'
              }
            },
            '[class~="lead"]': {
              color: 'rgb(75 85 99)'
            },
            strong: {
              color: 'rgb(31 41 55)'
            },
            'ol > li::marker': {
              fontWeight: '400',
              color: 'rgb(107 114 128)'
            },
            'ul > li::marker': {
              backgroundColor: '#3b82f6'
            },
            hr: {
              borderColor: 'rgb(229 231 235)',
              borderTopWidth: 1
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: 'rgb(75 85 99)',
              borderLeftWidth: '0.25rem',
              borderLeftColor: '#3b82f6',
              quotes: '"\\201C""\\201D""\\2018""\\2019"'
            },
            h1: {
              color: 'rgb(17 24 39)',
              fontWeight: '800'
            },
            h2: {
              color: 'rgb(17 24 39)',
              fontWeight: '700'
            },
            h3: {
              color: 'rgb(17 24 39)',
              fontWeight: '600'
            },
            h4: {
              color: 'rgb(17 24 39)',
              fontWeight: '600'
            },
            'figure figcaption': {
              color: 'rgb(107 114 128)'
            },
            code: {
              color: 'rgb(31 41 55)',
              fontWeight: '600'
            },
            'code::before': {
              content: '"`"'
            },
            'code::after': {
              content: '"`"'
            },
            'a code': {
              color: '#3b82f6'
            },
            pre: {
              color: 'rgb(229 231 235)',
              backgroundColor: 'rgb(17 24 39)',
              overflowX: 'auto'
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: '400',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit'
            },
            'pre code::before': {
              content: 'none'
            },
            'pre code::after': {
              content: 'none'
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875em',
              lineHeight: '1.7142857'
            },
            thead: {
              color: 'rgb(31 41 55)',
              fontWeight: '600',
              borderBottomWidth: '1px',
              borderBottomColor: 'rgb(209 213 219)'
            },
            'thead th': {
              verticalAlign: 'bottom',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em'
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'rgb(229 231 235)'
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0'
            },
            'tbody td': {
              verticalAlign: 'top',
              paddingTop: '0.5714286em',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em'
            }
          }
        },
        dark: {
          css: {
            color: 'rgb(209 213 219)',
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd'
              }
            },
            '[class~="lead"]': {
              color: 'rgb(156 163 175)'
            },
            strong: {
              color: 'rgb(243 244 246)'
            },
            'ol > li::marker': {
              color: 'rgb(156 163 175)'
            },
            hr: {
              borderColor: 'rgb(55 65 81)'
            },
            blockquote: {
              color: 'rgb(156 163 175)',
              borderLeftColor: '#60a5fa'
            },
            h1: {
              color: 'rgb(243 244 246)'
            },
            h2: {
              color: 'rgb(243 244 246)'
            },
            h3: {
              color: 'rgb(243 244 246)'
            },
            h4: {
              color: 'rgb(243 244 246)'
            },
            'figure figcaption': {
              color: 'rgb(156 163 175)'
            },
            code: {
              color: 'rgb(243 244 246)'
            },
            'a code': {
              color: '#60a5fa'
            },
            pre: {
              backgroundColor: 'rgb(31 41 55)'
            },
            thead: {
              color: 'rgb(243 244 246)',
              borderBottomColor: 'rgb(55 65 81)'
            },
            'tbody tr': {
              borderBottomColor: 'rgb(55 65 81)'
            }
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
  darkMode: 'class'
}
