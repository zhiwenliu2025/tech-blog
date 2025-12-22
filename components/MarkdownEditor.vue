<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div
      v-if="editor"
      class="mb-2 flex flex-wrap items-center gap-1 rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-800"
    >
      <!-- 标题 -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2 dark:border-gray-600">
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('heading', { level: 1 })
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="标题 1"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          H1
        </button>
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('heading', { level: 2 })
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="标题 2"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          H2
        </button>
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('heading', { level: 3 })
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="标题 3"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          H3
        </button>
      </div>

      <!-- 文本格式 -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2 dark:border-gray-600">
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('bold')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="加粗 (Ctrl+B)"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <Icon name="i-heroicons-bold" class="h-4 w-4" />
        </button>
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('italic')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="斜体 (Ctrl+I)"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <Icon name="i-heroicons-italic" class="h-4 w-4" />
        </button>
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('strike')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="删除线"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <span class="text-xs font-bold">S</span>
        </button>
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('code')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="行内代码"
          @click="editor.chain().focus().toggleCode().run()"
        >
          <Icon name="i-heroicons-code-bracket" class="h-4 w-4" />
        </button>
      </div>

      <!-- 列表 -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2 dark:border-gray-600">
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('bulletList')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="无序列表"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <Icon name="i-heroicons-list-bullet" class="h-4 w-4" />
        </button>
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('orderedList')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="有序列表"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <Icon name="i-heroicons-list-ordered" class="h-4 w-4" />
        </button>
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('blockquote')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="引用"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <Icon name="i-heroicons-chat-bubble-left" class="h-4 w-4" />
        </button>
      </div>

      <!-- 代码块和分隔线 -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2 dark:border-gray-600">
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('codeBlock')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="代码块"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        >
          <Icon name="i-heroicons-code-bracket-square" class="h-4 w-4" />
        </button>
        <!-- 代码块语言选择 -->
        <div v-if="editor.isActive('codeBlock')" class="relative">
          <select
            :value="getCurrentCodeBlockLanguage()"
            class="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            title="选择代码语言"
            @change="setCodeBlockLanguage($event)"
          >
            <option value="">无语言</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="swift">Swift</option>
            <option value="kotlin">Kotlin</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="scss">SCSS</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
            <option value="toml">TOML</option>
            <option value="bash">Bash</option>
            <option value="shell">Shell</option>
            <option value="powershell">PowerShell</option>
            <option value="sql">SQL</option>
            <option value="vue">Vue</option>
            <option value="jsx">JSX</option>
            <option value="tsx">TSX</option>
            <option value="markdown">Markdown</option>
            <option value="dockerfile">Dockerfile</option>
            <option value="nginx">Nginx</option>
            <option value="apache">Apache</option>
          </select>
        </div>
        <button
          type="button"
          class="rounded px-2 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          title="分隔线"
          @click="editor.chain().focus().setHorizontalRule().run()"
        >
          <Icon name="i-heroicons-minus" class="h-4 w-4" />
        </button>
      </div>

      <!-- 链接和图片 -->
      <div class="flex items-center gap-1">
        <button
          type="button"
          :class="[
            'rounded px-2 py-1 text-sm font-medium transition-colors',
            editor.isActive('link')
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
          title="链接"
          @click="setLink"
        >
          <Icon name="i-heroicons-link" class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="rounded px-2 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          title="插入图片"
          @click="showImageUploadDialog = true"
        >
          <Icon name="i-heroicons-photo" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- 编辑器内容 -->
    <div
      class="min-h-[400px] rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800"
      :class="{ 'ring-2 ring-primary-500': isDragging }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
    >
      <EditorContent :editor="editor" class="prose prose-sm max-w-none dark:prose-invert" />
    </div>

    <!-- 图片上传对话框 -->
    <div
      v-if="showImageUploadDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="showImageUploadDialog = false"
    >
      <div class="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800" @click.stop>
        <div
          class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">上传图片</h3>
          <button
            type="button"
            class="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            @click="showImageUploadDialog = false"
          >
            <Icon name="i-heroicons-x-mark" class="h-5 w-5" />
          </button>
        </div>
        <div class="p-4">
          <ImageUploader
            ref="imageUploaderRef"
            :post-id="postId"
            @uploaded="handleImageUploaded"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>

    <!-- Markdown 提示 -->
    <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
      提示：支持 Markdown 语法，可以使用快捷键（如 Ctrl+B 加粗，Ctrl+I 斜体）或直接输入 Markdown
      语法
    </p>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { watch, onBeforeUnmount, onMounted, nextTick } from 'vue'
// @ts-ignore
import MarkdownIt from 'markdown-it'
// @ts-ignore
import TurndownService from 'turndown'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
  }>(),
  {
    placeholder: '开始输入 Markdown 内容...'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 初始化 markdown 解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// 初始化 turndown 服务（HTML 转 Markdown）
const turndownService = new TurndownService({
  headingStyle: 'atx', // 使用 # 风格的标题
  codeBlockStyle: 'fenced', // 使用 ``` 风格的代码块
  bulletListMarker: '-', // 使用 - 作为列表标记
  emDelimiter: '*', // 使用 * 作为斜体标记
  strongDelimiter: '**' // 使用 ** 作为加粗标记
})

// 配置 turndown 以保留代码块语言
turndownService.addRule('codeBlock', {
  filter: (node: Node) => {
    return node.nodeName === 'PRE' && (node as HTMLElement).querySelector('code') !== null
  },
  replacement: (_content: string, node: Node) => {
    const codeElement = (node as HTMLElement).querySelector('code')
    const language = codeElement?.getAttribute('class')?.replace('language-', '') || ''
    const code = codeElement?.textContent || ''
    return language ? `\n\`\`\`${language}\n${code}\n\`\`\`\n` : `\n\`\`\`\n${code}\n\`\`\`\n`
  }
})

// 将 Markdown 转换为 HTML
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return ''
  try {
    return md.render(markdown)
  } catch (error) {
    console.error('Markdown to HTML conversion error:', error)
    return ''
  }
}

// 将 HTML 转换为 Markdown
const htmlToMarkdown = (html: string): string => {
  if (!html || html.trim() === '' || html === '<p></p>' || html === '<p><br></p>') {
    return ''
  }
  try {
    const markdown = turndownService.turndown(html).trim()
    return markdown
  } catch (error) {
    console.error('HTML to Markdown conversion error:', error)
    return ''
  }
}

// 创建编辑器实例
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      codeBlock: {
        HTMLAttributes: {
          class: 'code-block-editor'
        },
        languageClassPrefix: 'language-',
        defaultLanguage: null
      },
      code: {
        HTMLAttributes: {
          class: 'rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 font-mono text-sm'
        }
      },
      blockquote: {
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic'
        }
      }
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto my-4',
        loading: 'lazy'
      },
      inline: false,
      allowBase64: false
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class:
          'text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
      }
    })
  ],
  content: markdownToHtml(props.modelValue || ''),
  editable: true,
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none dark:prose-invert focus:outline-none min-h-[400px]',
      placeholder: props.placeholder
    }
  },
  onUpdate: ({ editor }) => {
    // 当编辑器内容更新时，转换为 Markdown 并触发更新
    const html = editor.getHTML()
    const markdown = htmlToMarkdown(html)
    emit('update:modelValue', markdown)
    // 更新代码块语言标签
    nextTick(() => {
      updateCodeBlockLabels()
    })
  }
})

// 监听外部 modelValue 变化
watch(
  () => props.modelValue,
  newValue => {
    if (editor.value) {
      const currentMarkdown = htmlToMarkdown(editor.value.getHTML())
      // 只有当内容真正改变时才更新（避免循环更新）
      if (newValue !== currentMarkdown) {
        const html = markdownToHtml(newValue || '')
        editor.value.commands.setContent(html, { emitUpdate: false })
      }
    }
  }
)

// 设置链接
const setLink = () => {
  if (!editor.value) return

  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('输入链接 URL:', previousUrl)

  if (url === null) {
    return
  }

  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

// 图片上传相关
const showImageUploadDialog = ref(false)
const imageUploaderRef = ref<InstanceType<typeof ImageUploader> | null>(null)
const isDragging = ref(false)

// 处理图片上传成功
const handleImageUploaded = (url: string) => {
  if (!editor.value) return

  // 插入图片到编辑器
  editor.value.chain().focus().setImage({ src: url, alt: '图片' }).run()

  // 关闭对话框
  setTimeout(() => {
    showImageUploadDialog.value = false
    if (imageUploaderRef.value) {
      imageUploaderRef.value.removeImage()
    }
  }, 500)
}

// 处理图片上传错误
const handleImageError = (error: string) => {
  console.error('图片上传错误:', error)
  // 错误已在 ImageUploader 组件中显示
}

// 处理拖拽上传
const handleDrop = async (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]

  if (!file || !file.type.startsWith('image/')) {
    return
  }

  if (!editor.value) return

  // 显示上传对话框并自动上传
  showImageUploadDialog.value = true
  await nextTick()
  if (imageUploaderRef.value) {
    await imageUploaderRef.value.uploadImage(file)
  }
}

// 监听粘贴事件（粘贴图片）
let pasteHandler: ((e: ClipboardEvent) => Promise<void>) | null = null

onMounted(() => {
  pasteHandler = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items || !editor.value) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          // 显示上传对话框并自动上传
          showImageUploadDialog.value = true
          await nextTick()
          if (imageUploaderRef.value) {
            await imageUploaderRef.value.uploadImage(file)
          }
        }
        break
      }
    }
  }

  document.addEventListener('paste', pasteHandler as EventListener)
})

onBeforeUnmount(() => {
  if (pasteHandler) {
    document.removeEventListener('paste', pasteHandler as EventListener)
  }
})

// 获取当前代码块的语言
const getCurrentCodeBlockLanguage = (): string => {
  if (!editor.value || !editor.value.isActive('codeBlock')) {
    return ''
  }
  const attrs = editor.value.getAttributes('codeBlock')
  return attrs.language || ''
}

// 设置代码块语言
const setCodeBlockLanguage = (event: Event) => {
  if (!editor.value) return
  const target = event.target as HTMLSelectElement
  const language = target.value
  editor.value.chain().focus().updateAttributes('codeBlock', { language }).run()
  // 更新代码块语言标签
  nextTick(() => {
    updateCodeBlockLabels()
  })
}

// 更新代码块语言标签显示
const updateCodeBlockLabels = () => {
  if (typeof window === 'undefined') return

  const codeBlocks = document.querySelectorAll('.ProseMirror pre.code-block-editor')
  codeBlocks.forEach(pre => {
    const codeElement = pre.querySelector('code')
    if (!codeElement) return

    const classList = Array.from(codeElement.classList)
    const languageClass = classList.find(cls => cls.startsWith('language-'))
    const language = languageClass ? languageClass.replace('language-', '') : ''

    if (language) {
      ;(pre as HTMLElement).style.setProperty('--code-language', `'${language.toUpperCase()}'`)
      pre.setAttribute('data-has-language', 'true')
      // 确保 padding-top 足够显示标签
      ;(pre as HTMLElement).style.paddingTop = '2.5rem'
    } else {
      pre.removeAttribute('data-has-language')
      ;(pre as HTMLElement).style.paddingTop = '1rem'
    }
  })
}

// 组件挂载后更新代码块标签
onMounted(() => {
  if (editor.value) {
    nextTick(() => {
      updateCodeBlockLabels()
    })
  }
})

// 监听编辑器内容变化，更新代码块标签
watch(
  () => editor.value?.getHTML(),
  () => {
    if (editor.value) {
      nextTick(() => {
        updateCodeBlockLabels()
      })
    }
  }
)

// 组件卸载时销毁编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
/* 编辑器样式 */
:deep(.ProseMirror) {
  outline: none;
  min-height: 400px;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: rgb(156 163 175);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.dark .ProseMirror p.is-editor-empty:first-child::before) {
  color: rgb(107 114 128);
}

/* 代码块样式 */
:deep(.ProseMirror pre.code-block-editor) {
  position: relative;
  background-color: rgb(15 23 42);
  border: 1px solid rgb(30 41 59);
  border-radius: 0.5rem;
  padding: 1rem;
  padding-top: 2.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  font-size: 0.875rem;
  line-height: 1.75;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  color: rgb(226 232 240);
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

:deep(.dark .ProseMirror pre.code-block-editor) {
  background-color: rgb(15 23 42);
  border-color: rgb(30 41 59);
  color: rgb(226 232 240);
}

/* 代码块语言标签 - 使用 JavaScript 动态设置 */
:deep(.ProseMirror pre.code-block-editor) {
  --code-language: '';
}

:deep(.ProseMirror pre.code-block-editor::before) {
  content: var(--code-language, '代码');
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 1rem;
  background-color: rgb(30 41 59);
  border-bottom: 1px solid rgb(51 65 85);
  border-radius: 0.5rem 0.5rem 0 0;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: rgb(148 163 184);
  letter-spacing: 0.05em;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    sans-serif;
}

:deep(.dark .ProseMirror pre.code-block-editor::before) {
  background-color: rgb(30 41 59);
  border-bottom-color: rgb(51 65 85);
  color: rgb(148 163 184);
}

/* 隐藏没有语言的代码块标签 */
:deep(.ProseMirror pre.code-block-editor:not([data-has-language])::before) {
  display: none;
  padding-top: 0;
}

/* 代码块内 code 元素 */
:deep(.ProseMirror pre.code-block-editor code) {
  background: transparent;
  padding: 0;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  border-radius: 0;
  display: block;
  white-space: pre;
  overflow-x: auto;
}

/* 代码块滚动条样式 */
:deep(.ProseMirror pre.code-block-editor::-webkit-scrollbar) {
  height: 8px;
}

:deep(.ProseMirror pre.code-block-editor::-webkit-scrollbar-track) {
  background: rgb(30 41 59);
  border-radius: 4px;
}

:deep(.ProseMirror pre.code-block-editor::-webkit-scrollbar-thumb) {
  background: rgb(51 65 85);
  border-radius: 4px;
}

:deep(.ProseMirror pre.code-block-editor::-webkit-scrollbar-thumb:hover) {
  background: rgb(71 85 105);
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
</style>
