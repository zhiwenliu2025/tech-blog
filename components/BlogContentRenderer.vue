<template>
  <div class="blog-content-renderer">
    <EditorContent :editor="editor" class="prose prose-lg max-w-none dark:prose-invert" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { OptimizedImage } from './extensions/OptimizedImage'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { watch, onBeforeUnmount, onMounted, nextTick } from 'vue'
// @ts-ignore - markdown-it types may not be available
import MarkdownIt from 'markdown-it'
// @ts-ignore - highlight.js types
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
// highlight.js 样式已在全局 CSS 中导入

const props = withDefaults(
  defineProps<{
    content: string
    contentType?: 'html' | 'markdown' | 'auto'
  }>(),
  {
    contentType: 'auto'
  }
)

// 初始化 markdown 解析器
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  linkify: true, // 自动转换 URL 为链接
  typographer: true, // 启用一些语言中性的替换 + 引号美化
  breaks: true, // 转换换行符为 <br>
  highlight: function (str: string, lang?: string) {
    // 使用 highlight.js 进行语法高亮
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value
        return `<pre class="code-block hljs"><code class="language-${lang}">${highlighted}</code></pre>`
      } catch (err) {
        console.warn('Highlight.js error:', err)
      }
    }

    // 如果没有指定语言或语言不支持，使用自动检测
    try {
      const highlighted = hljs.highlightAuto(str).value
      return `<pre class="code-block hljs"><code>${highlighted}</code></pre>`
    } catch (err) {
      // 如果高亮失败，转义 HTML 并返回
      const escapeHtml = (text: string) => {
        const map: Record<string, string> = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }
        return text.replace(/[&<>"']/g, m => map[m] || m)
      }
      return `<pre class="code-block"><code>${escapeHtml(str)}</code></pre>`
    }
  }
})

// 检测内容类型（改进的检测：区分 markdown 和 HTML）
const detectContentType = (content: string): 'html' | 'markdown' => {
  if (!content) return 'markdown'

  // 检测 markdown 特征
  const markdownPatterns = [
    /^#{1,6}\s/m, // 标题
    /^\*\*.*\*\*/, // 粗体
    /^\*.*\*(?!\*)/, // 斜体
    /^\[.*\]\(.*\)/, // 链接
    /^!\[.*\]\(.*\)/, // 图片
    /^```/m, // 代码块
    /^>\s/m, // 引用
    /^[-*+]\s/m, // 无序列表
    /^\d+\.\s/m // 有序列表
  ]

  // 如果匹配任何 markdown 特征，认为是 markdown
  const hasMarkdownFeatures = markdownPatterns.some(pattern => pattern.test(content))

  if (hasMarkdownFeatures) {
    return 'markdown'
  }

  // 检测 HTML 标签（更严格的检测）
  // 只有当包含完整的 HTML 结构标签时才认为是 HTML
  const htmlStructurePattern = /<(p|div|h[1-6]|ul|ol|li|blockquote|pre|table|article|section)[\s>]/i
  if (htmlStructurePattern.test(content)) {
    return 'html'
  }

  // 默认返回 markdown
  return 'markdown'
}

// 将内容转换为 HTML
const getHtmlContent = (content: string, type: 'html' | 'markdown' | 'auto' = 'auto'): string => {
  if (!content) return ''

  // 自动检测类型
  if (type === 'auto') {
    type = detectContentType(content)
  }

  if (type === 'markdown') {
    const html = md.render(content)
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        's',
        'code',
        'pre',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'hr',
        'div',
        'span',
        'sub',
        'sup'
      ],
      ALLOWED_ATTR: [
        'href',
        'src',
        'alt',
        'title',
        'target',
        'rel',
        'class',
        'id',
        'style',
        'data-lang',
        'data-highlighted'
      ],
      ALLOW_DATA_ATTR: true,
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
    })
  }

  // 如果已经是 HTML，先进行净化
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'hr',
      'div',
      'span',
      'sub',
      'sup'
    ],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'target',
      'rel',
      'class',
      'id',
      'style',
      'data-lang',
      'data-highlighted'
    ],
    ALLOW_DATA_ATTR: true,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  })
}

// 创建只读编辑器实例（仅在客户端）
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      // 配置代码块
      codeBlock: {
        HTMLAttributes: {
          class: 'rounded-md bg-gray-100 dark:bg-gray-800 p-4 font-mono text-sm'
        }
      },
      // 配置行内代码
      code: {
        HTMLAttributes: {
          class: 'rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 font-mono text-sm'
        }
      },
      // 配置引用
      blockquote: {
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic'
        }
      }
    }),
    // 使用自定义的优化图片扩展，支持响应式 WebP
    OptimizedImage.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto my-4 mx-auto block'
      }
    }),
    // 添加表格支持
    Table.configure({
      resizable: false,
      HTMLAttributes: {
        class: 'border-collapse table-auto w-full my-4'
      }
    }),
    TableRow,
    TableHeader,
    TableCell.configure({
      HTMLAttributes: {
        class: 'border border-gray-300 dark:border-gray-600 px-4 py-2'
      }
    })
  ],
  content: typeof window !== 'undefined' ? getHtmlContent(props.content, props.contentType) : '',
  editable: false, // 只读模式
  editorProps: {
    attributes: {
      class: 'prose prose-lg max-w-none dark:prose-invert focus:outline-none'
    },
    // 允许所有 HTML 标签和属性，确保 highlight.js 的标记不被清理
    transformPastedHTML: (html: string) => html,
    transformPastedText: (text: string) => text
  },
  // 确保解析时保留所有 HTML
  parseOptions: {
    preserveWhitespace: 'full'
  }
})

// 监听内容变化
watch(
  () => [props.content, props.contentType],
  ([newContent, newType]) => {
    if (editor.value) {
      const htmlContent = getHtmlContent(
        newContent || '',
        (newType || 'auto') as 'html' | 'markdown' | 'auto'
      )
      const currentContent = editor.value.getHTML()

      // 只有当内容真正改变时才更新
      if (htmlContent !== currentContent) {
        editor.value.commands.setContent(htmlContent)
        // 在下一个 tick 中应用代码高亮，使用 setTimeout 确保 DOM 更新完成
        nextTick(() => {
          setTimeout(() => {
            applyCodeHighlighting()
          }, 50)
        })
      }
    }
  },
  { immediate: true }
)

// 应用代码高亮（处理已渲染的代码块）
const applyCodeHighlighting = () => {
  if (typeof window === 'undefined') return

  // 查找所有代码块（包括已经高亮和未高亮的）
  const allCodeBlocks = document.querySelectorAll('.ProseMirror pre code')

  allCodeBlocks.forEach(block => {
    const codeElement = block as HTMLElement
    const preElement = codeElement.parentElement as HTMLElement

    if (!preElement) return

    // 检查是否已经高亮（通过检查是否有 hljs 的 span 标签）
    const hasHighlighting = codeElement.querySelector(
      'span.hljs-keyword, span.hljs-string, span.hljs-comment, span.hljs-number'
    )

    // 如果已经有高亮标记且已经处理过，跳过
    if (hasHighlighting && codeElement.dataset.highlighted === 'true') return

    codeElement.dataset.highlighted = 'true'

    // 如果已经有高亮，只需要确保类名正确
    if (hasHighlighting) {
      preElement.classList.add('hljs', 'code-block')
      codeElement.classList.add('hljs')
      if (!preElement.querySelector('.copy-button')) {
        addCopyButton(preElement)
      }
      return
    }

    // 获取语言（从 class 或 data-lang 属性）
    const langMatch = codeElement.className.match(/language-(\w+)/)
    const lang =
      langMatch?.[1] ||
      codeElement.getAttribute('data-lang') ||
      preElement.getAttribute('data-lang') ||
      null

    // 获取原始代码文本（去除已有的 HTML 标签）
    let codeText = codeElement.textContent || codeElement.innerText || ''

    // 如果 textContent 为空但 innerHTML 有内容，尝试从 innerHTML 提取文本
    if (!codeText.trim() && codeElement.innerHTML) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = codeElement.innerHTML
      codeText = tempDiv.textContent || tempDiv.innerText || ''
    }

    if (!codeText.trim()) return

    try {
      let highlighted: string
      let detectedLang: string | null = null

      if (lang && hljs.getLanguage(lang)) {
        highlighted = hljs.highlight(codeText, { language: lang }).value
        detectedLang = lang
      } else {
        // 自动检测语言
        const result = hljs.highlightAuto(codeText, [
          'javascript',
          'typescript',
          'python',
          'java',
          'css',
          'html',
          'json',
          'bash',
          'shell',
          'sql',
          'vue',
          'jsx',
          'tsx'
        ])
        highlighted = result.value
        detectedLang = result.language || null
      }

      // 更新代码内容（先净化 HTML）
      codeElement.innerHTML = DOMPurify.sanitize(highlighted, {
        ALLOWED_TAGS: ['span'],
        ALLOWED_ATTR: ['class'],
        ALLOW_DATA_ATTR: false
      })

      // 更新类名和属性
      if (detectedLang) {
        codeElement.className = `language-${detectedLang} hljs`
        preElement.setAttribute('data-lang', detectedLang)
      } else {
        codeElement.className = 'hljs'
      }

      preElement.classList.add('hljs', 'code-block')

      // 添加复制按钮
      addCopyButton(preElement)
    } catch (err) {
      console.warn('Code highlighting error:', err)
      // 如果高亮失败，至少添加 hljs 类
      preElement.classList.add('hljs', 'code-block')
      codeElement.classList.add('hljs')
      if (!preElement.querySelector('.copy-button')) {
        addCopyButton(preElement)
      }
    }
  })
}

// 添加复制按钮
const addCopyButton = (preElement: HTMLElement) => {
  // 如果已经有复制按钮，跳过
  if (preElement.querySelector('.copy-button')) return

  const button = document.createElement('button')
  button.className = 'copy-button'
  button.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
    </svg>
    <span class="copy-text">复制</span>
  `
  button.setAttribute('aria-label', '复制代码')
  button.setAttribute('title', '复制代码')

  button.addEventListener('click', async e => {
    e.stopPropagation()
    const codeElement = preElement.querySelector('code')
    if (codeElement) {
      const text = codeElement.textContent || ''
      try {
        await navigator.clipboard.writeText(text)
        const textSpan = button.querySelector('.copy-text')
        if (textSpan) {
          textSpan.textContent = '已复制!'
          button.classList.add('copied')
        }
        setTimeout(() => {
          if (textSpan) {
            textSpan.textContent = '复制'
            button.classList.remove('copied')
          }
        }, 2000)
      } catch (err) {
        console.error('复制失败:', err)
        const textSpan = button.querySelector('.copy-text')
        if (textSpan) {
          textSpan.textContent = '复制失败'
          setTimeout(() => {
            if (textSpan) {
              textSpan.textContent = '复制'
            }
          }, 2000)
        }
      }
    }
  })

  preElement.classList.add('group', 'relative')
  preElement.style.position = 'relative'
  preElement.appendChild(button)
}

// 组件挂载后应用代码高亮和设置内容
onMounted(() => {
  if (editor.value && props.content) {
    const htmlContent = getHtmlContent(props.content, props.contentType)
    editor.value.commands.setContent(htmlContent)
    // 使用多个 nextTick 确保 DOM 完全渲染
    nextTick(() => {
      setTimeout(() => {
        applyCodeHighlighting()
      }, 100)
    })
  } else if (editor.value) {
    // 即使没有内容，也检查是否有需要高亮的代码块
    nextTick(() => {
      setTimeout(() => {
        applyCodeHighlighting()
      }, 100)
    })
  }
})

// 组件卸载时销毁编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
/* 确保编辑器内容样式正确 */
:deep(.ProseMirror) {
  outline: none;
  font-size: 1.0625rem;
  line-height: 1.75;
}

/* 代码块样式增强 - 使用深色主题 */
:deep(.ProseMirror pre),
:deep(.ProseMirror pre.code-block),
:deep(.ProseMirror pre.hljs) {
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  position: relative;
  margin: 2rem 0;
  font-size: 0.875rem;
  line-height: 1.7;
  border: 1px solid rgb(55 65 75);
  transition: all 0.2s;
  /* 深色主题背景色 */
  background-color: rgb(13 17 23) !important;
  color: rgb(201 209 217) !important;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

:deep(.ProseMirror pre:hover) {
  box-shadow: 0 15px 40px -10px rgba(0, 0, 0, 0.4);
}

:deep(.dark .ProseMirror pre),
:deep(.dark .ProseMirror pre.code-block),
:deep(.dark .ProseMirror pre.hljs) {
  border-color: rgb(55 65 75);
  background-color: rgb(13 17 23) !important;
}

/* 确保 highlight.js 的样式优先级 */
:deep(.ProseMirror pre.hljs code),
:deep(.ProseMirror pre.hljs code.hljs) {
  background: transparent !important;
  padding: 0 !important;
  font-size: inherit !important;
  line-height: inherit !important;
  display: block !important;
  color: inherit !important;
  font-family:
    'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace !important;
}

/* 复制按钮样式 - 优化版 */
:deep(.ProseMirror pre .copy-button) {
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgb(156 163 175);
  background-color: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgb(55 65 75);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(-4px);
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

:deep(.ProseMirror pre:hover .copy-button) {
  opacity: 1;
  transform: translateY(0);
}

:deep(.dark .ProseMirror pre .copy-button) {
  color: rgb(156 163 175);
  background-color: rgb(31 41 55);
  border-color: rgb(55 65 75);
}

:deep(.ProseMirror pre .copy-button:hover) {
  background-color: rgba(55, 65, 75, 0.9);
  border-color: rgb(75 85 99);
  color: rgb(229 231 235);
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(0, 0, 0, 0.3);
}

:deep(.dark .ProseMirror pre .copy-button) {
  color: rgb(156 163 175);
  background-color: rgba(31, 41, 55, 0.8);
  border-color: rgb(55 65 75);
}

:deep(.dark .ProseMirror pre .copy-button:hover) {
  background-color: rgba(55, 65, 75, 0.9);
  border-color: rgb(75 85 99);
  color: rgb(229 231 235);
}

:deep(.ProseMirror pre .copy-button.copied) {
  color: rgb(34 197 94);
  border-color: rgb(34 197 94);
  background-color: rgba(20, 83, 45, 0.8);
  transform: scale(1.05);
}

:deep(.dark .ProseMirror pre .copy-button.copied) {
  color: rgb(74 222 128);
  border-color: rgb(74 222 128);
  background-color: rgba(20, 83, 45, 0.8);
}

:deep(.ProseMirror pre .copy-button svg) {
  flex-shrink: 0;
}

/* 代码块内的代码样式 */
:deep(.ProseMirror pre.code-block code),
:deep(.ProseMirror pre.hljs code) {
  background: transparent;
  padding: 0;
  font-size: inherit;
  line-height: inherit;
  display: block;
  color: inherit;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
}

/* 代码块语言标签 - 优化版 */
:deep(.ProseMirror pre.code-block::before),
:deep(.ProseMirror pre.hljs::before) {
  content: attr(data-lang);
  position: absolute;
  top: 0.875rem;
  left: 1rem;
  font-size: 0.75rem;
  color: rgb(156 163 175);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.5rem;
  background-color: rgba(55, 65, 75, 0.5);
  border-radius: 0.25rem;
  line-height: 1;
}

:deep(.dark .ProseMirror pre.code-block::before),
:deep(.dark .ProseMirror pre.hljs::before) {
  color: rgb(156 163 175);
  background-color: rgba(55, 65, 75, 0.5);
}

/* 代码块滚动条样式 */
:deep(.ProseMirror pre.code-block::-webkit-scrollbar),
:deep(.ProseMirror pre.hljs::-webkit-scrollbar) {
  height: 8px;
}

:deep(.ProseMirror pre.code-block::-webkit-scrollbar-track),
:deep(.ProseMirror pre.hljs::-webkit-scrollbar-track) {
  background: rgb(243 244 246);
  border-radius: 4px;
}

:deep(.dark .ProseMirror pre.code-block::-webkit-scrollbar-track),
:deep(.dark .ProseMirror pre.hljs::-webkit-scrollbar-track) {
  background: rgb(31 41 55);
}

:deep(.ProseMirror pre.code-block::-webkit-scrollbar-thumb),
:deep(.ProseMirror pre.hljs::-webkit-scrollbar-thumb) {
  background: rgb(156 163 175);
  border-radius: 4px;
}

:deep(.ProseMirror pre.code-block::-webkit-scrollbar-thumb:hover),
:deep(.ProseMirror pre.hljs::-webkit-scrollbar-thumb:hover) {
  background: rgb(107 114 128);
}

/* 行内代码样式 - 优化版 */
:deep(.ProseMirror code) {
  background-color: rgb(254 242 242);
  color: rgb(220 38 38);
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.9em;
  font-weight: 600;
  border: 1px solid rgb(254 226 226);
}

:deep(.dark .ProseMirror code) {
  background-color: rgb(69 26 26);
  color: rgb(252 165 165);
  border-color: rgb(127 29 29);
}

/* 图片样式 - 优化版 */
:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin: 2rem auto;
  display: block;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

:deep(.ProseMirror img:hover) {
  transform: scale(1.02);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 图片标题样式 */
:deep(.ProseMirror figure) {
  margin: 2rem 0;
}

:deep(.ProseMirror figure img) {
  margin: 0;
}

:deep(.ProseMirror figcaption) {
  color: rgb(107 114 128);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-top: 0.75rem;
  text-align: center;
  font-style: italic;
}

:deep(.dark .ProseMirror figcaption) {
  color: rgb(156 163 175);
}

/* 链接样式 - 优化版 */
:deep(.ProseMirror a) {
  color: rgb(59 130 246);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

:deep(.ProseMirror a:hover) {
  color: rgb(29 78 216);
  border-bottom-color: rgb(29 78 216);
}

/* 外部链接图标 */
:deep(.ProseMirror a[href^='http']::after) {
  content: '↗';
  margin-left: 0.2em;
  font-size: 0.85em;
  opacity: 0.6;
}

:deep(.dark .ProseMirror a) {
  color: rgb(96 165 250);
}

:deep(.dark .ProseMirror a:hover) {
  color: rgb(147 197 253);
  border-bottom-color: rgb(147 197 253);
}

/* 引用样式 - 优化版 */
:deep(.ProseMirror blockquote) {
  border-left: 4px solid rgb(59 130 246);
  padding: 1em 1.5em;
  margin: 2rem 0;
  font-style: normal;
  color: rgb(75 85 99);
  background-color: rgb(239 246 255);
  border-radius: 0 0.5rem 0.5rem 0;
  position: relative;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

:deep(.ProseMirror blockquote::before) {
  content: '"';
  font-size: 3em;
  color: rgb(59 130 246);
  opacity: 0.2;
  position: absolute;
  top: -0.1em;
  left: 0.3em;
  line-height: 1;
  font-family: Georgia, serif;
}

:deep(.ProseMirror blockquote p) {
  margin: 0.75em 0;
}

:deep(.ProseMirror blockquote p:first-child) {
  margin-top: 0;
}

:deep(.ProseMirror blockquote p:last-child) {
  margin-bottom: 0;
}

:deep(.dark .ProseMirror blockquote) {
  border-left-color: rgb(96 165 250);
  color: rgb(156 163 175);
  background-color: rgb(30 41 59);
  box-shadow: 0 2px 8px rgba(96, 165, 250, 0.1);
}

:deep(.dark .ProseMirror blockquote::before) {
  color: rgb(96 165 250);
}

/* 列表样式 - 优化版 */
:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.75rem;
  margin: 1.25rem 0;
}

:deep(.ProseMirror ul) {
  list-style-type: disc;
}

:deep(.ProseMirror ul ul) {
  list-style-type: circle;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

:deep(.ProseMirror ul ul ul) {
  list-style-type: square;
}

:deep(.ProseMirror li) {
  margin: 0.75rem 0;
  padding-left: 0.5rem;
  line-height: 1.75;
}

:deep(.ProseMirror ul > li::marker) {
  color: rgb(59 130 246);
  font-size: 1.2em;
}

:deep(.ProseMirror ol > li::marker) {
  color: rgb(59 130 246);
  font-weight: 700;
}

:deep(.dark .ProseMirror ul > li::marker),
:deep(.dark .ProseMirror ol > li::marker) {
  color: rgb(96 165 250);
}

/* 标题样式 - 优化版 */
:deep(.ProseMirror h1) {
  font-size: clamp(1.875rem, 5vw, 2.5rem);
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 1em;
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: rgb(17 24 39);
}

:deep(.ProseMirror h2) {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 0.75em;
  line-height: 1.3;
  letter-spacing: -0.02em;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgb(229 231 235);
  color: rgb(17 24 39);
}

:deep(.ProseMirror h3) {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  margin-top: 1.75em;
  margin-bottom: 0.5em;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: rgb(17 24 39);
}

:deep(.ProseMirror h4) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.5;
  color: rgb(17 24 39);
}

:deep(.dark .ProseMirror h1),
:deep(.dark .ProseMirror h2),
:deep(.dark .ProseMirror h3),
:deep(.dark .ProseMirror h4) {
  color: rgb(243 244 246);
}

:deep(.dark .ProseMirror h2) {
  border-bottom-color: rgb(55 65 81);
}

/* 段落样式 - 优化版 */
:deep(.ProseMirror p) {
  margin: 1.5em 0;
  line-height: 1.8;
  color: rgb(55 65 81);
}

:deep(.ProseMirror p:first-of-type) {
  margin-top: 0;
}

:deep(.dark .ProseMirror p) {
  color: rgb(209 213 219);
}

/* 表格样式 - 优化版 */
:deep(.ProseMirror table) {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgb(229 231 235);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.ProseMirror table th),
:deep(.ProseMirror table td) {
  border: 1px solid rgb(229 231 235);
  padding: 0.75rem 1rem;
  text-align: left;
}

:deep(.ProseMirror table thead) {
  background-color: rgb(249 250 251);
  font-weight: 700;
}

:deep(.ProseMirror table th) {
  background-color: rgb(249 250 251);
  font-weight: 700;
  color: rgb(17 24 39);
  border-bottom: 2px solid rgb(209 213 219);
}

:deep(.ProseMirror table tbody tr) {
  transition: background-color 0.2s ease;
}

:deep(.ProseMirror table tbody tr:nth-child(even)) {
  background-color: rgb(249 250 251);
}

:deep(.ProseMirror table tbody tr:hover) {
  background-color: rgb(243 244 246);
}

:deep(.dark .ProseMirror table) {
  border-color: rgb(55 65 81);
}

:deep(.dark .ProseMirror table th),
:deep(.dark .ProseMirror table td) {
  border-color: rgb(55 65 81);
}

:deep(.dark .ProseMirror table thead),
:deep(.dark .ProseMirror table th) {
  background-color: rgb(31 41 55);
  color: rgb(243 244 246);
  border-bottom-color: rgb(55 65 81);
}

:deep(.dark .ProseMirror table tbody tr:nth-child(even)) {
  background-color: rgb(30 41 59);
}

:deep(.dark .ProseMirror table tbody tr:hover) {
  background-color: rgb(39 50 66);
}

/* 水平分割线 - 优化版 */
:deep(.ProseMirror hr) {
  border: none;
  border-top: 2px solid rgb(229 231 235);
  margin: 3rem 0;
  position: relative;
}

:deep(.ProseMirror hr::after) {
  content: '✦';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 0 1rem;
  color: rgb(156 163 175);
  font-size: 0.875rem;
}

:deep(.dark .ProseMirror hr) {
  border-top-color: rgb(55 65 81);
}

:deep(.dark .ProseMirror hr::after) {
  background-color: rgb(17 24 39);
  color: rgb(107 114 128);
}
</style>
