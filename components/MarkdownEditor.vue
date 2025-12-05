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
          title="图片"
          @click="setImage"
        >
          <Icon name="i-heroicons-photo" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- 编辑器内容 -->
    <div
      class="min-h-[400px] rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-800"
    >
      <EditorContent :editor="editor" class="prose prose-sm max-w-none dark:prose-invert" />
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
import { watch, onBeforeUnmount, onMounted } from 'vue'
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

// 将 Markdown 转换为 HTML
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return ''
  return md.render(markdown)
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
          class: 'rounded-md bg-gray-100 dark:bg-gray-800 p-4 font-mono text-sm'
        }
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
        class: 'rounded-lg max-w-full h-auto'
      }
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
        editor.value.commands.setContent(html, false)
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

// 设置图片
const setImage = () => {
  if (!editor.value) return

  const url = window.prompt('输入图片 URL:')

  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

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
:deep(.ProseMirror pre) {
  background-color: rgb(243 244 246);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
  font-size: 0.875rem;
  line-height: 1.6;
}

:deep(.dark .ProseMirror pre) {
  background-color: rgb(31 41 55);
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
