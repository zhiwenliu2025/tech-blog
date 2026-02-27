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
          setTimeout(applyEnhancements, 50)
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
      if (!preElement.closest('.code-block-wrapper')) {
        enhanceCodeBlock(preElement)
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

      // 增强代码块（终端窗口风格）
      enhanceCodeBlock(preElement)
    } catch (err) {
      console.warn('Code highlighting error:', err)
      preElement.classList.add('hljs', 'code-block')
      codeElement.classList.add('hljs')
      enhanceCodeBlock(preElement)
    }
  })
}

// 将代码块增强为终端窗口风格
const enhanceCodeBlock = (preElement: HTMLElement) => {
  // 已经增强过则跳过
  if (preElement.closest('.code-block-wrapper')) return

  const lang = preElement.getAttribute('data-lang') || ''
  const langLabel = lang ? lang.toUpperCase() : 'CODE'

  // ── 包裹容器 ──
  const wrapper = document.createElement('div')
  wrapper.className = 'code-block-wrapper'

  // ── 标题栏 ──
  const header = document.createElement('div')
  header.className = 'code-block-header'
  header.innerHTML = `
    <div class="code-block-dots">
      <span class="code-dot code-dot-red"></span>
      <span class="code-dot code-dot-amber"></span>
      <span class="code-dot code-dot-green"></span>
    </div>
    <span class="code-block-lang">${langLabel}</span>
    <button class="copy-button" aria-label="复制代码" title="复制代码">
      <svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
      <svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display:none">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <span class="copy-text">复制</span>
    </button>
  `

  // 复制按钮逻辑
  const button = header.querySelector('.copy-button') as HTMLButtonElement
  button.addEventListener('click', async e => {
    e.stopPropagation()
    const codeElement = preElement.querySelector('code')
    if (!codeElement) return

    const text = codeElement.textContent || ''
    const copyIcon = button.querySelector('.copy-icon') as SVGElement
    const checkIcon = button.querySelector('.check-icon') as SVGElement
    const textSpan = button.querySelector('.copy-text') as HTMLElement

    try {
      await navigator.clipboard.writeText(text)
      copyIcon.style.display = 'none'
      checkIcon.style.display = ''
      textSpan.textContent = '已复制!'
      button.classList.add('copied')
      setTimeout(() => {
        copyIcon.style.display = ''
        checkIcon.style.display = 'none'
        textSpan.textContent = '复制'
        button.classList.remove('copied')
      }, 2000)
    } catch {
      textSpan.textContent = '复制失败'
      setTimeout(() => {
        textSpan.textContent = '复制'
      }, 2000)
    }
  })

  // 插入 DOM：wrapper > header + pre
  preElement.parentNode!.insertBefore(wrapper, preElement)
  wrapper.appendChild(header)
  wrapper.appendChild(preElement)

  // 清除 pre 上的冗余内联样式（由 wrapper 接管）
  preElement.style.position = ''
  preElement.style.borderRadius = ''
  preElement.style.margin = ''
}

// ── 增强普通 HTML 图片（Markdown 渲染的 <img>，不经过 OptimizedImageComponent）──
const { open: openImageLightbox } = useImageLightbox()

const enhanceImages = () => {
  if (typeof window === 'undefined') return

  // 只处理未经过 Tiptap node view 渲染的原始 img（.image-figure 是 node view 的外层）
  const rawImgs = Array.from(
    document.querySelectorAll<HTMLImageElement>('.ProseMirror img')
  ).filter(img => !img.closest('.image-figure') && !img.closest('.image-enhanced'))

  if (rawImgs.length === 0) return

  // 收集所有原始图片供 lightbox 批量预览
  const imageList = rawImgs.map(img => ({
    src: img.src,
    alt: img.alt || '',
    title: img.title || ''
  }))

  rawImgs.forEach((img, index) => {
    // 二次防重
    if (img.closest('.image-enhanced')) return

    const parent = img.parentNode
    if (!parent) return

    // ── 外层 figure ──
    const figure = document.createElement('figure')
    figure.className = 'image-enhanced'

    // ── 内容容器（承载遮罩） ──
    const inner = document.createElement('div')
    inner.className = 'image-enhanced-inner'
    inner.setAttribute('role', 'button')
    inner.setAttribute('tabindex', '0')
    inner.setAttribute('aria-label', '点击放大查看图片')

    // ── 放大图标遮罩 ──
    const overlay = document.createElement('div')
    overlay.className = 'image-enhanced-overlay'
    overlay.setAttribute('aria-hidden', 'true')
    overlay.innerHTML = `<div class="image-enhanced-overlay-icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
      </svg>
    </div>`

    parent.insertBefore(figure, img)
    img.style.margin = '0'
    inner.appendChild(img)
    inner.appendChild(overlay)
    figure.appendChild(inner)

    // ── 图注（从 alt 或 title 提取） ──
    const captionText =
      img.title?.trim() ||
      (img.alt?.trim() && !/\.(jpe?g|png|gif|webp|svg|avif)$/i.test(img.alt) ? img.alt.trim() : '')
    if (captionText) {
      const caption = document.createElement('figcaption')
      caption.className = 'image-enhanced-caption'
      caption.textContent = captionText
      figure.appendChild(caption)
    }

    // ── 点击/键盘 → lightbox ──
    const openAt = () => openImageLightbox(imageList, index)
    inner.addEventListener('click', openAt)
    inner.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openAt()
      }
    })
  })
}

// 统一执行内容增强的时机
const applyEnhancements = () => {
  applyCodeHighlighting()
  enhanceImages()
}

// 组件挂载后应用代码高亮和设置内容
onMounted(() => {
  if (editor.value && props.content) {
    const htmlContent = getHtmlContent(props.content, props.contentType)
    editor.value.commands.setContent(htmlContent)
    nextTick(() => {
      setTimeout(applyEnhancements, 100)
    })
  } else if (editor.value) {
    nextTick(() => {
      setTimeout(applyEnhancements, 100)
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
/* ── ProseMirror 基础 ── */
:deep(.ProseMirror) {
  outline: none;
  font-size: 1.0625rem;
  line-height: 1.75;
}

/* ════════════════════════════════════════
   代码块 — 终端窗口风格
   ════════════════════════════════════════ */

/* 外层容器：统一圆角 / 边框 / 阴影 */
:deep(.ProseMirror .code-block-wrapper) {
  margin: 2rem 0;
  border-radius: 0.875rem;
  overflow: hidden;
  border: 1px solid rgb(48 56 69);
  background-color: rgb(13 17 23);
  box-shadow:
    0 10px 30px -8px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  transition: box-shadow 0.2s ease;
}

:deep(.ProseMirror .code-block-wrapper:hover) {
  box-shadow:
    0 16px 40px -8px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.06) inset;
}

/* 标题栏 */
:deep(.ProseMirror .code-block-header) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background-color: rgb(22 27 34);
  border-bottom: 1px solid rgb(48 56 69);
  user-select: none;
}

/* macOS 红绿灯 */
:deep(.ProseMirror .code-block-dots) {
  display: flex;
  gap: 0.375rem;
  margin-right: 0.25rem;
}

:deep(.ProseMirror .code-dot) {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
}

:deep(.ProseMirror .code-dot-red) {
  background-color: rgb(255 95 86);
}
:deep(.ProseMirror .code-dot-amber) {
  background-color: rgb(255 189 68);
}
:deep(.ProseMirror .code-dot-green) {
  background-color: rgb(39 201 63);
}

/* 语言徽章 */
:deep(.ProseMirror .code-block-lang) {
  flex: 1;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(139 148 158);
}

/* 复制按钮 */
:deep(.ProseMirror .copy-button) {
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.3125rem 0.625rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgb(110 118 129);
  background: transparent;
  border: 1px solid rgb(48 56 69);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
  white-space: nowrap;
}

:deep(.ProseMirror .copy-button svg) {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

:deep(.ProseMirror .copy-button:hover) {
  color: rgb(201 209 217);
  border-color: rgb(88 96 109);
  background-color: rgb(33 38 45);
}

:deep(.ProseMirror .copy-button.copied) {
  color: rgb(63 185 80);
  border-color: rgb(63 185 80);
  background-color: rgba(63, 185, 80, 0.1);
}

/* <pre> 本体（无圆角，交给 wrapper） */
:deep(.ProseMirror pre),
:deep(.ProseMirror pre.code-block),
:deep(.ProseMirror pre.hljs) {
  border-radius: 0 !important;
  margin: 0 !important;
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.75;
  background-color: rgb(13 17 23) !important;
  color: rgb(201 209 217) !important;
  border: none !important;
  box-shadow: none !important;
}

/* 代码内容 */
:deep(.ProseMirror pre code),
:deep(.ProseMirror pre.hljs code) {
  background: transparent !important;
  padding: 0 !important;
  border: none !important;
  font-size: inherit !important;
  line-height: inherit !important;
  display: block !important;
  color: inherit !important;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace !important;
  font-weight: 400 !important;
}

/* 滚动条（代码区域） */
:deep(.ProseMirror pre::-webkit-scrollbar) {
  height: 6px;
}

:deep(.ProseMirror pre::-webkit-scrollbar-track) {
  background: rgb(22 27 34);
}

:deep(.ProseMirror pre::-webkit-scrollbar-thumb) {
  background: rgb(48 56 69);
  border-radius: 3px;
}

:deep(.ProseMirror pre::-webkit-scrollbar-thumb:hover) {
  background: rgb(88 96 109);
}

/* ── 行内代码 ── */
:deep(.ProseMirror code) {
  background-color: rgb(240 246 252);
  color: rgb(36 41 47);
  padding: 0.15em 0.4em;
  border-radius: 0.3125rem;
  font-size: 0.875em;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-weight: 500;
  border: 1px solid rgb(209 217 224);
}

:deep(.dark .ProseMirror code) {
  background-color: rgb(33 38 45);
  color: rgb(121 192 255);
  border-color: rgb(48 56 69);
}

/* ── 图片（基础，node view 和原始 img 通用） ── */
:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 0.875rem;
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.12);
}

/* ── 普通 HTML img 增强容器（enhanceImages() 注入） ── */
:deep(.ProseMirror .image-enhanced) {
  margin: 2rem 0;
  text-align: center;
}

:deep(.ProseMirror .image-enhanced-inner) {
  position: relative;
  display: inline-block;
  max-width: 100%;
  border-radius: 0.875rem;
  overflow: hidden;
  cursor: zoom-in;
  outline: none;
}

:deep(.ProseMirror .image-enhanced-inner:focus-visible) {
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.5);
}

:deep(.ProseMirror .image-enhanced-inner img) {
  display: block;
  margin: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.ProseMirror .image-enhanced-inner:hover img) {
  transform: scale(1.015);
}

/* 悬停遮罩 */
:deep(.ProseMirror .image-enhanced-overlay) {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s ease;
  border-radius: 0.875rem;
  pointer-events: none;
}

:deep(.ProseMirror .image-enhanced-inner:hover .image-enhanced-overlay) {
  background: rgba(0, 0, 0, 0.3);
}

:deep(.ProseMirror .image-enhanced-overlay-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  opacity: 0;
  transform: scale(0.7);
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.ProseMirror .image-enhanced-overlay-icon svg) {
  width: 1.25rem;
  height: 1.25rem;
}

:deep(.ProseMirror .image-enhanced-inner:hover .image-enhanced-overlay-icon) {
  opacity: 1;
  transform: scale(1);
}

/* 图注 */
:deep(.ProseMirror .image-enhanced-caption) {
  display: block;
  margin-top: 0.625rem;
  font-size: 0.8125rem;
  color: rgb(100 116 139);
  font-style: italic;
  line-height: 1.5;
  text-align: center;
}

:deep(.dark .ProseMirror .image-enhanced-caption) {
  /* slate-400 — 对比度 ≈ 4.6:1（原 slate-500 仅 2.8:1，不符合 WCAG AA） */
  color: rgb(148 163 184);
}

/* ── 链接 ── */
:deep(.ProseMirror a) {
  color: rgb(59 130 246);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

:deep(.ProseMirror a:hover) {
  color: rgb(29 78 216);
  border-bottom-color: rgb(29 78 216);
}

:deep(.ProseMirror a[href^='http']::after) {
  content: '↗';
  margin-left: 0.2em;
  font-size: 0.8em;
  opacity: 0.5;
}

:deep(.dark .ProseMirror a) {
  color: rgb(96 165 250);
}
:deep(.dark .ProseMirror a:hover) {
  color: rgb(147 197 253);
  border-bottom-color: rgb(147 197 253);
}

/* ── 引用块 ── */
:deep(.ProseMirror blockquote) {
  border-left: 3px solid rgb(59 130 246);
  padding: 0.875em 1.25em;
  margin: 2rem 0;
  color: rgb(75 85 99);
  background-color: rgb(239 246 255);
  border-radius: 0 0.5rem 0.5rem 0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
}

:deep(.ProseMirror blockquote p) {
  margin: 0.5em 0;
}
:deep(.ProseMirror blockquote p:first-child) {
  margin-top: 0;
}
:deep(.ProseMirror blockquote p:last-child) {
  margin-bottom: 0;
}

:deep(.dark .ProseMirror blockquote) {
  border-left-color: rgb(96 165 250);
  /* slate-200 → 14.39:1 AAA（引用背景更深，需要更亮的文字） */
  color: rgb(226 232 240);
  background-color: rgb(15 23 42);
  box-shadow: 0 2px 8px rgba(96, 165, 250, 0.06);
}

/* ── 列表 ── */
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
  margin: 0.625rem 0;
  padding-left: 0.375rem;
  line-height: 1.75;
}

:deep(.ProseMirror ul > li::marker) {
  color: rgb(59 130 246);
  font-size: 1.1em;
}
:deep(.ProseMirror ol > li::marker) {
  color: rgb(59 130 246);
  font-weight: 700;
}
:deep(.dark .ProseMirror ul > li::marker),
:deep(.dark .ProseMirror ol > li::marker) {
  color: rgb(96 165 250);
}

/* ── 标题 ── */
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
  font-size: clamp(1.375rem, 3.5vw, 1.875rem);
  font-weight: 700;
  margin-top: 2.25em;
  margin-bottom: 0.75em;
  line-height: 1.3;
  letter-spacing: -0.02em;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgb(229 231 235);
  color: rgb(17 24 39);
}

:deep(.ProseMirror h3) {
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  font-weight: 600;
  margin-top: 1.75em;
  margin-bottom: 0.5em;
  line-height: 1.4;
  color: rgb(17 24 39);
}

:deep(.ProseMirror h4) {
  font-size: 1.0625rem;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: rgb(17 24 39);
}

/*
  暗黑模式标题亮度阶梯（以 gray-900 #111827 为背景）
  h1  slate-50  → 16.77:1  AAA  ████████████████▋
  h2  slate-50  → 16.77:1  AAA  ████████████████▋
  h3  slate-100 → 16.19:1  AAA  ████████████████
  h4  slate-200 → 14.39:1  AAA  ██████████████▍
  大小 + 字重提供层级，颜色差异保留视觉区分
*/
:deep(.dark .ProseMirror h1) {
  color: rgb(248 250 252); /* slate-50 */
}
:deep(.dark .ProseMirror h2) {
  color: rgb(248 250 252); /* slate-50 — 上调，确保标题亮于正文 */
  border-bottom-color: rgb(51 65 85); /* slate-700 */
}
:deep(.dark .ProseMirror h3) {
  color: rgb(241 245 249); /* slate-100 — 上调，比正文略亮 */
}
:deep(.dark .ProseMirror h4) {
  color: rgb(226 232 240); /* slate-200 */
}

/* ── 段落 ── */
:deep(.ProseMirror p) {
  margin: 1.25em 0;
  line-height: 1.8;
  color: rgb(55 65 81);
}

:deep(.ProseMirror p:first-of-type) {
  margin-top: 0;
}

/*
  暗黑模式正文亮度（以 gray-900 #111827 为背景）
  slate-100 → 16.19:1 AAA  — 较 slate-200(14.39:1) 对比度提升约 13%
*/
:deep(.dark .ProseMirror p) {
  color: rgb(241 245 249); /* slate-100 */
}

/* 列表项与段落保持一致 — 默认 prose-invert 使用 gray-300(12.04:1)，比段落暗 4 档 */
:deep(.dark .ProseMirror li) {
  color: rgb(241 245 249); /* slate-100 — 与段落统一 */
}

/* ── 加粗文字 ── */
:deep(.ProseMirror strong) {
  color: rgb(17 24 39);
  font-weight: 700;
}
:deep(.dark .ProseMirror strong) {
  color: rgb(248 250 252); /* slate-50 — 亮于正文 slate-100，视觉层次清晰 */
}

/* ── 斜体文字 ── */
:deep(.dark .ProseMirror em) {
  color: rgb(241 245 249); /* slate-100 — 与正文一致 */
}

/* ── 表格 ── */
:deep(.ProseMirror table) {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgb(229 231 235);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

:deep(.ProseMirror table th),
:deep(.ProseMirror table td) {
  border: 1px solid rgb(229 231 235);
  padding: 0.75rem 1rem;
  text-align: left;
}

:deep(.ProseMirror table th) {
  background-color: rgb(249 250 251);
  font-weight: 700;
  color: rgb(17 24 39);
  border-bottom: 2px solid rgb(209 213 219);
}

:deep(.ProseMirror table tbody tr) {
  transition: background-color 0.15s ease;
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
:deep(.dark .ProseMirror table th) {
  background-color: rgb(31 41 55);
  color: rgb(243 244 246);
  border-bottom-color: rgb(55 65 81);
}
/* 单元格正文 — slate-200(14.39:1)，与正文 slate-100 接近，表格背景略深故降一档 */
:deep(.dark .ProseMirror table td) {
  color: rgb(226 232 240);
}
:deep(.dark .ProseMirror table tbody tr:nth-child(even)) {
  background-color: rgb(30 41 59);
}
:deep(.dark .ProseMirror table tbody tr:hover) {
  background-color: rgb(39 50 66);
}

/* ── 分割线 ── */
:deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid rgb(229 231 235);
  margin: 3rem 0;
  position: relative;
}

:deep(.ProseMirror hr::after) {
  content: '···';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 0 1rem;
  color: rgb(156 163 175);
  font-size: 1rem;
  letter-spacing: 0.2em;
}

:deep(.dark .ProseMirror hr) {
  border-top-color: rgb(55 65 81);
}
:deep(.dark .ProseMirror hr::after) {
  /* 匹配布局 dark:bg-gray-900 (#111827) */
  background-color: rgb(17 24 39);
  color: rgb(71 85 105);
}
</style>
