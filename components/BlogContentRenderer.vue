<template>
  <div class="blog-content-renderer">
    <EditorContent :editor="editor" class="prose prose-lg max-w-none dark:prose-invert" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { watch, onBeforeUnmount, onMounted, nextTick } from 'vue'
// @ts-ignore - markdown-it types may not be available
import MarkdownIt from 'markdown-it'
// @ts-ignore - highlight.js types
import hljs from 'highlight.js'
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

// 检测内容类型（简单检测：如果包含 HTML 标签，则认为是 HTML）
const detectContentType = (content: string): 'html' | 'markdown' => {
  if (!content) return 'markdown'

  // 简单的检测：如果包含 HTML 标签，则认为是 HTML
  const htmlTagPattern = /<[a-z][\s\S]*>/i
  if (htmlTagPattern.test(content)) {
    return 'html'
  }

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
    return md.render(content)
  }

  // 如果已经是 HTML，直接返回
  return content
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
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto my-4 mx-auto block',
        loading: 'lazy'
      },
      inline: false
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

      // 更新代码内容
      codeElement.innerHTML = highlighted

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
}

/* 代码块样式增强 - 使用深色主题 */
:deep(.ProseMirror pre),
:deep(.ProseMirror pre.code-block),
:deep(.ProseMirror pre.hljs) {
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  position: relative;
  margin: 1.5rem 0;
  font-size: 0.875rem;
  line-height: 1.6;
  border: 1px solid rgb(55 65 75);
  transition: opacity 0.2s;
  /* 深色主题背景色 */
  background-color: rgb(13 17 23) !important;
  color: rgb(201 209 217) !important;
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

/* 复制按钮样式 */
:deep(.ProseMirror pre .copy-button) {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(107 114 128);
  background-color: rgb(255 255 255);
  border: 1px solid rgb(229 231 235);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0;
  z-index: 10;
}

:deep(.ProseMirror pre:hover .copy-button) {
  opacity: 1;
}

:deep(.dark .ProseMirror pre .copy-button) {
  color: rgb(156 163 175);
  background-color: rgb(31 41 55);
  border-color: rgb(55 65 75);
}

:deep(.ProseMirror pre .copy-button:hover) {
  background-color: rgb(243 244 246);
  border-color: rgb(209 213 219);
  color: rgb(55 65 81);
}

:deep(.dark .ProseMirror pre .copy-button:hover) {
  background-color: rgb(55 65 75);
  border-color: rgb(75 85 99);
  color: rgb(209 213 219);
}

:deep(.ProseMirror pre .copy-button.copied) {
  color: rgb(34 197 94);
  border-color: rgb(34 197 94);
}

:deep(.dark .ProseMirror pre .copy-button.copied) {
  color: rgb(74 222 128);
  border-color: rgb(74 222 128);
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

/* 代码块语言标签（可选） */
:deep(.ProseMirror pre.code-block::before),
:deep(.ProseMirror pre.hljs::before) {
  content: attr(data-lang);
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  font-size: 0.75rem;
  color: rgb(107 114 128);
  text-transform: uppercase;
  font-weight: 500;
}

:deep(.dark .ProseMirror pre.code-block::before),
:deep(.dark .ProseMirror pre.hljs::before) {
  color: rgb(156 163 175);
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

/* 行内代码样式 */
:deep(.ProseMirror code) {
  background-color: rgb(243 244 246);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

:deep(.dark .ProseMirror code) {
  background-color: rgb(31 41 55);
}

/* 图片样式 */
:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

/* 链接样式 */
:deep(.ProseMirror a) {
  color: rgb(59 130 246);
  text-decoration: underline;
  transition: color 0.2s;
}

:deep(.ProseMirror a:hover) {
  color: rgb(37 99 235);
}

:deep(.dark .ProseMirror a) {
  color: rgb(96 165 250);
}

:deep(.dark .ProseMirror a:hover) {
  color: rgb(147 197 253);
}

/* 引用样式 */
:deep(.ProseMirror blockquote) {
  border-left: 4px solid rgb(209 213 219);
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: rgb(107 114 128);
}

:deep(.dark .ProseMirror blockquote) {
  border-left-color: rgb(75 85 99);
  color: rgb(156 163 175);
}

/* 列表样式 */
:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

:deep(.ProseMirror li) {
  margin: 0.5rem 0;
}

/* 标题样式 */
:deep(.ProseMirror h1) {
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

:deep(.ProseMirror h2) {
  font-size: 1.875rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

:deep(.ProseMirror h3) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

/* 段落样式 */
:deep(.ProseMirror p) {
  margin: 1rem 0;
  line-height: 1.75;
}

/* 表格样式 */
:deep(.ProseMirror table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

:deep(.ProseMirror table th),
:deep(.ProseMirror table td) {
  border: 1px solid rgb(229 231 235);
  padding: 0.5rem;
  text-align: left;
}

:deep(.dark .ProseMirror table th),
:deep(.dark .ProseMirror table td) {
  border-color: rgb(75 85 99);
}

:deep(.ProseMirror table th) {
  background-color: rgb(243 244 246);
  font-weight: 600;
}

:deep(.dark .ProseMirror table th) {
  background-color: rgb(31 41 55);
}

/* 水平分割线 */
:deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid rgb(229 231 235);
  margin: 2rem 0;
}

:deep(.dark .ProseMirror hr) {
  border-top-color: rgb(75 85 99);
}
</style>
