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
            lineHeight: '1.75',
            fontSize: '1.0625rem',
            // 优化段落间距
            p: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
              lineHeight: '1.8'
            },
            'p:first-of-type': {
              marginTop: '0'
            },
            // 优化链接样式
            a: {
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: '1px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#1d4ed8',
                borderBottomColor: '#1d4ed8'
              },
              // 外部链接图标
              '&[href^="http"]::after': {
                content: '"↗"',
                marginLeft: '0.2em',
                fontSize: '0.85em',
                opacity: '0.6'
              }
            },
            '[class~="lead"]': {
              color: 'rgb(75 85 99)',
              fontSize: '1.25em',
              lineHeight: '1.6',
              marginTop: '1.2em',
              marginBottom: '1.2em'
            },
            strong: {
              color: 'rgb(17 24 39)',
              fontWeight: '700'
            },
            // 优化标题样式
            h1: {
              color: 'rgb(17 24 39)',
              fontWeight: '800',
              fontSize: 'clamp(1.875rem, 5vw, 2.5rem)',
              lineHeight: '1.2',
              marginTop: '0',
              marginBottom: '1em',
              letterSpacing: '-0.025em'
            },
            h2: {
              color: 'rgb(17 24 39)',
              fontWeight: '700',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              lineHeight: '1.3',
              marginTop: '2em',
              marginBottom: '0.75em',
              letterSpacing: '-0.02em',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid rgb(229 231 235)'
            },
            h3: {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              lineHeight: '1.4',
              marginTop: '1.75em',
              marginBottom: '0.5em',
              letterSpacing: '-0.01em'
            },
            h4: {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
              fontSize: '1.125rem',
              lineHeight: '1.5',
              marginTop: '1.5em',
              marginBottom: '0.5em'
            },
            // 优化列表样式
            'ul > li': {
              paddingLeft: '0.5em',
              marginTop: '0.75em',
              marginBottom: '0.75em'
            },
            'ul > li::marker': {
              color: '#3b82f6',
              fontSize: '1.2em'
            },
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.75em',
              marginTop: '1.25em',
              marginBottom: '1.25em'
            },
            'ul ul': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
              listStyleType: 'circle'
            },
            'ul ul ul': {
              listStyleType: 'square'
            },
            'ol > li': {
              paddingLeft: '0.5em',
              marginTop: '0.75em',
              marginBottom: '0.75em'
            },
            'ol > li::marker': {
              fontWeight: '600',
              color: '#3b82f6'
            },
            ol: {
              paddingLeft: '1.75em',
              marginTop: '1.25em',
              marginBottom: '1.25em'
            },
            // 优化引用块样式
            blockquote: {
              fontWeight: '400',
              fontStyle: 'normal',
              color: 'rgb(75 85 99)',
              borderLeftWidth: '4px',
              borderLeftColor: '#3b82f6',
              backgroundColor: 'rgb(239 246 255)',
              padding: '1em 1.5em',
              marginTop: '2em',
              marginBottom: '2em',
              borderRadius: '0 0.5rem 0.5rem 0',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              position: 'relative'
            },
            'blockquote p:first-of-type::before': {
              content: 'open-quote',
              fontSize: '3em',
              color: '#3b82f6',
              opacity: '0.2',
              position: 'absolute',
              top: '-0.1em',
              left: '0.3em',
              lineHeight: '1'
            },
            'blockquote p': {
              marginTop: '0.75em',
              marginBottom: '0.75em'
            },
            // 优化水平分割线
            hr: {
              borderColor: 'rgb(229 231 235)',
              borderTopWidth: '2px',
              marginTop: '3em',
              marginBottom: '3em',
              borderStyle: 'solid',
              position: 'relative',
              '&::after': {
                content: '"✦"',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '0 1em',
                color: 'rgb(156 163 175)',
                fontSize: '0.875rem'
              }
            },
            // 行内代码优化
            code: {
              color: 'rgb(220 38 38)',
              fontWeight: '600',
              fontSize: '0.9em',
              backgroundColor: 'rgb(254 242 242)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              border: '1px solid rgb(254 226 226)'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            'a code': {
              color: '#3b82f6',
              backgroundColor: 'rgb(239 246 255)',
              borderColor: 'rgb(191 219 254)'
            },
            // 代码块优化
            pre: {
              color: 'rgb(229 231 235)',
              backgroundColor: 'rgb(13 17 23)',
              overflowX: 'auto',
              fontSize: '0.875em',
              lineHeight: '1.7',
              marginTop: '2em',
              marginBottom: '2em',
              borderRadius: '0.75rem',
              padding: '1.25em 1.5em',
              border: '1px solid rgb(55 65 75)',
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)'
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
              lineHeight: 'inherit',
              border: 'none'
            },
            'pre code::before': {
              content: 'none'
            },
            'pre code::after': {
              content: 'none'
            },
            // 优化表格样式
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875em',
              lineHeight: '1.7',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              border: '1px solid rgb(229 231 235)'
            },
            thead: {
              color: 'rgb(17 24 39)',
              fontWeight: '700',
              backgroundColor: 'rgb(249 250 251)',
              borderBottomWidth: '2px',
              borderBottomColor: 'rgb(209 213 219)'
            },
            'thead th': {
              verticalAlign: 'bottom',
              paddingRight: '1em',
              paddingBottom: '0.75em',
              paddingLeft: '1em',
              paddingTop: '0.75em'
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'rgb(229 231 235)',
              transition: 'background-color 0.2s ease'
            },
            'tbody tr:nth-child(even)': {
              backgroundColor: 'rgb(249 250 251)'
            },
            'tbody tr:hover': {
              backgroundColor: 'rgb(243 244 246)'
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0'
            },
            'tbody td': {
              verticalAlign: 'top',
              paddingTop: '0.75em',
              paddingRight: '1em',
              paddingBottom: '0.75em',
              paddingLeft: '1em'
            },
            // 图片样式优化
            img: {
              marginTop: '2em',
              marginBottom: '2em',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            },
            figure: {
              marginTop: '2em',
              marginBottom: '2em'
            },
            'figure > *': {
              marginTop: '0',
              marginBottom: '0'
            },
            'figure figcaption': {
              color: 'rgb(107 114 128)',
              fontSize: '0.875em',
              lineHeight: '1.5',
              marginTop: '0.75em',
              textAlign: 'center',
              fontStyle: 'italic'
            }
          }
        },
        dark: {
          css: {
            color: 'rgb(209 213 219)',
            p: {
              color: 'rgb(209 213 219)'
            },
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd',
                borderBottomColor: '#93c5fd'
              }
            },
            '[class~="lead"]': {
              color: 'rgb(156 163 175)'
            },
            strong: {
              color: 'rgb(243 244 246)'
            },
            h1: {
              color: 'rgb(243 244 246)'
            },
            h2: {
              color: 'rgb(243 244 246)',
              borderBottomColor: 'rgb(55 65 81)'
            },
            h3: {
              color: 'rgb(243 244 246)'
            },
            h4: {
              color: 'rgb(243 244 246)'
            },
            'ul > li::marker': {
              color: '#60a5fa'
            },
            'ol > li::marker': {
              color: '#60a5fa'
            },
            blockquote: {
              color: 'rgb(156 163 175)',
              borderLeftColor: '#60a5fa',
              backgroundColor: 'rgb(30 41 59)'
            },
            'blockquote p:first-of-type::before': {
              color: '#60a5fa'
            },
            hr: {
              borderColor: 'rgb(55 65 81)',
              '&::after': {
                backgroundColor: 'rgb(17 24 39)',
                color: 'rgb(107 114 128)'
              }
            },
            code: {
              color: 'rgb(252 165 165)',
              backgroundColor: 'rgb(69 26 26)',
              borderColor: 'rgb(127 29 29)'
            },
            'a code': {
              color: '#93c5fd',
              backgroundColor: 'rgb(30 58 138)',
              borderColor: 'rgb(37 99 235)'
            },
            pre: {
              backgroundColor: 'rgb(13 17 23)',
              borderColor: 'rgb(55 65 75)'
            },
            thead: {
              color: 'rgb(243 244 246)',
              backgroundColor: 'rgb(31 41 55)',
              borderBottomColor: 'rgb(55 65 81)'
            },
            'tbody tr': {
              borderBottomColor: 'rgb(55 65 81)'
            },
            'tbody tr:nth-child(even)': {
              backgroundColor: 'rgb(30 41 59)'
            },
            'tbody tr:hover': {
              backgroundColor: 'rgb(39 50 66)'
            },
            table: {
              borderColor: 'rgb(55 65 81)'
            },
            'figure figcaption': {
              color: 'rgb(156 163 175)'
            }
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
  darkMode: 'class'
}
