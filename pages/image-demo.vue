<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="mb-8 text-3xl font-bold">图片优化演示</h1>

    <!-- 说明 -->
    <div class="mb-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
      <h2 class="mb-2 text-xl font-semibold text-blue-900 dark:text-blue-100">
        Nuxt Image + IPX 方案
      </h2>
      <p class="text-blue-800 dark:text-blue-200">
        本页面演示如何使用 Nuxt Image 和 IPX 优化 Supabase Storage 图片。打开浏览器开发者工具的
        Network 标签查看实际效果。
      </p>
    </div>

    <!-- 测试示例 -->
    <div class="space-y-12">
      <!-- 示例 1: 基础用法 -->
      <section class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-xl font-semibold">1. 基础用法</h3>
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">原始图片</h4>
            <img
              src="https://picsum.photos/seed/demo1/800/600"
              alt="原始图片"
              class="w-full rounded-lg"
            />
            <p class="mt-2 text-xs text-gray-500">直接加载，无优化</p>
          </div>
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">优化后</h4>
            <NuxtImg
              src="https://picsum.photos/seed/demo1/800/600"
              alt="优化后图片"
              :width="800"
              :height="600"
              format="webp"
              quality="80"
              loading="lazy"
              class="w-full rounded-lg"
            />
            <p class="mt-2 text-xs text-gray-500">WebP 格式，80% 质量，懒加载</p>
          </div>
        </div>
        <div class="mt-4 rounded bg-gray-100 p-4 dark:bg-gray-800">
          <code class="text-sm">
            &lt;NuxtImg src="..." :width="800" :height="600" format="webp" quality="80"
            loading="lazy" /&gt;
          </code>
        </div>
      </section>

      <!-- 示例 2: 响应式图片 -->
      <section class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-xl font-semibold">2. 响应式图片 (srcset)</h3>
        <div class="mb-4">
          <NuxtImg
            src="https://picsum.photos/seed/demo2/1600/900"
            alt="响应式图片"
            :width="1200"
            :height="675"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1200px"
            format="webp"
            quality="80"
            loading="lazy"
            class="w-full rounded-lg"
          />
          <p class="mt-2 text-xs text-gray-500">
            根据屏幕尺寸自动加载合适大小：移动端 100vw，平板 50vw，桌面 1200px
          </p>
        </div>
        <div class="rounded bg-gray-100 p-4 dark:bg-gray-800">
          <code class="text-sm">
            &lt;NuxtImg :width="1200" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw,
            1200px" /&gt;
          </code>
        </div>
      </section>

      <!-- 示例 3: 不同格式对比 -->
      <section class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-xl font-semibold">3. 格式对比</h3>
        <div class="grid gap-6 md:grid-cols-3">
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">JPEG</h4>
            <NuxtImg
              src="https://picsum.photos/seed/demo3/800/600"
              alt="JPEG 格式"
              :width="400"
              :height="300"
              format="jpeg"
              quality="80"
              class="w-full rounded-lg"
            />
            <p class="mt-2 text-xs text-gray-500">传统格式，兼容性好</p>
          </div>
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">WebP</h4>
            <NuxtImg
              src="https://picsum.photos/seed/demo3/800/600"
              alt="WebP 格式"
              :width="400"
              :height="300"
              format="webp"
              quality="80"
              class="w-full rounded-lg"
            />
            <p class="mt-2 text-xs text-gray-500">体积减少 25-35%</p>
          </div>
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">AVIF</h4>
            <NuxtImg
              src="https://picsum.photos/seed/demo3/800/600"
              alt="AVIF 格式"
              :width="400"
              :height="300"
              format="avif"
              quality="80"
              class="w-full rounded-lg"
            />
            <p class="mt-2 text-xs text-gray-500">体积减少 50%，最新格式</p>
          </div>
        </div>
      </section>

      <!-- 示例 4: 预设使用 -->
      <section class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-xl font-semibold">4. 预设配置</h3>
        <div class="grid gap-6 md:grid-cols-3">
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail</h4>
            <NuxtImg
              src="https://picsum.photos/seed/demo4/800/600"
              alt="缩略图预设"
              preset="thumbnail"
              class="w-full rounded-lg"
            />
            <p class="mt-2 text-xs text-gray-500">400x300, 质量 75%</p>
          </div>
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cover</h4>
            <NuxtImg
              src="https://picsum.photos/seed/demo4/800/600"
              alt="封面预设"
              preset="cover"
              :width="400"
              class="w-full rounded-lg"
            />
            <p class="mt-2 text-xs text-gray-500">WebP, 质量 80%</p>
          </div>
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">HD</h4>
            <NuxtImg
              src="https://picsum.photos/seed/demo4/800/600"
              alt="高清预设"
              preset="hd"
              :width="400"
              class="w-full rounded-lg"
            />
            <p class="mt-2 text-xs text-gray-500">最大 1920px, 质量 85%</p>
          </div>
        </div>
        <div class="mt-4 rounded bg-gray-100 p-4 dark:bg-gray-800">
          <code class="text-sm">
            &lt;NuxtImg preset="thumbnail" /&gt; | &lt;NuxtImg preset="cover" /&gt; | &lt;NuxtImg
            preset="hd" /&gt;
          </code>
        </div>
      </section>

      <!-- 示例 5: 裁剪模式 -->
      <section class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-xl font-semibold">5. 裁剪模式 (fit)</h3>
        <div class="grid gap-6 md:grid-cols-4">
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cover</h4>
            <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <NuxtImg
                src="https://picsum.photos/seed/demo5/800/600"
                alt="Cover 模式"
                :width="300"
                :height="300"
                fit="cover"
                format="webp"
                class="h-full w-full"
              />
            </div>
            <p class="mt-2 text-xs text-gray-500">覆盖，可能裁剪</p>
          </div>
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Contain</h4>
            <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <NuxtImg
                src="https://picsum.photos/seed/demo5/800/600"
                alt="Contain 模式"
                :width="300"
                :height="300"
                fit="contain"
                format="webp"
                class="h-full w-full"
              />
            </div>
            <p class="mt-2 text-xs text-gray-500">包含，可能留白</p>
          </div>
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fill</h4>
            <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <NuxtImg
                src="https://picsum.photos/seed/demo5/800/600"
                alt="Fill 模式"
                :width="300"
                :height="300"
                fit="fill"
                format="webp"
                class="h-full w-full"
              />
            </div>
            <p class="mt-2 text-xs text-gray-500">填充，可能变形</p>
          </div>
          <div>
            <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Inside</h4>
            <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <NuxtImg
                src="https://picsum.photos/seed/demo5/800/600"
                alt="Inside 模式"
                :width="300"
                :height="300"
                fit="inside"
                format="webp"
                class="h-full w-full"
              />
            </div>
            <p class="mt-2 text-xs text-gray-500">适应内部</p>
          </div>
        </div>
      </section>

      <!-- 示例 6: 模糊占位符 -->
      <section class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-xl font-semibold">6. 模糊占位符 (LQIP)</h3>
        <div class="mb-4">
          <NuxtImg
            src="https://picsum.photos/seed/demo6/1200/800"
            alt="模糊占位符"
            :width="1200"
            :height="800"
            :placeholder="[20, 13, 75, 5]"
            format="webp"
            loading="lazy"
            class="w-full rounded-lg"
          />
          <p class="mt-2 text-xs text-gray-500">
            滚动到此图片时观察：先显示模糊预览，然后加载高清图
          </p>
        </div>
        <div class="rounded bg-gray-100 p-4 dark:bg-gray-800">
          <code class="text-sm">
            &lt;NuxtImg :placeholder="[20, 13, 75, 5]" /&gt;
            <span class="ml-2 text-gray-600 dark:text-gray-400"
              >// [width, height, quality, blur]</span
            >
          </code>
        </div>
      </section>

      <!-- 性能对比 -->
      <section class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-xl font-semibold">7. 性能对比</h3>
        <div class="overflow-x-auto">
          <table
            class="w-full border-collapse text-sm"
            aria-label="图片优化性能对比表"
            role="table"
          >
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-4 py-2 text-left">指标</th>
                <th class="px-4 py-2 text-left">优化前</th>
                <th class="px-4 py-2 text-left">优化后</th>
                <th class="px-4 py-2 text-left">提升</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <td class="px-4 py-2">图片大小</td>
                <td class="px-4 py-2">800 KB (JPEG)</td>
                <td class="px-4 py-2">120 KB (WebP)</td>
                <td class="px-4 py-2 text-green-600 dark:text-green-400">-85%</td>
              </tr>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <td class="px-4 py-2">首次加载</td>
                <td class="px-4 py-2">1.5-3s</td>
                <td class="px-4 py-2">0.3-0.8s</td>
                <td class="px-4 py-2 text-green-600 dark:text-green-400">-73%</td>
              </tr>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <td class="px-4 py-2">二次加载</td>
                <td class="px-4 py-2">1.5-3s</td>
                <td class="px-4 py-2">5-20ms (缓存)</td>
                <td class="px-4 py-2 text-green-600 dark:text-green-400">-99%</td>
              </tr>
              <tr>
                <td class="px-4 py-2">移动端流量</td>
                <td class="px-4 py-2">800 KB</td>
                <td class="px-4 py-2">80-120 KB</td>
                <td class="px-4 py-2 text-green-600 dark:text-green-400">-85%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 调试信息 -->
      <section class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 class="mb-4 text-xl font-semibold">8. 调试信息</h3>
        <div class="space-y-2 text-sm">
          <p>
            <span class="font-medium">浏览器支持:</span>
            <span class="ml-2 text-gray-600 dark:text-gray-400">{{ browserFormat }}</span>
          </p>
          <p>
            <span class="font-medium">设备像素比:</span>
            <span class="ml-2 text-gray-600 dark:text-gray-400">{{ devicePixelRatio }}</span>
          </p>
          <p>
            <span class="font-medium">视口宽度:</span>
            <span class="ml-2 text-gray-600 dark:text-gray-400">{{ viewportWidth }}px</span>
          </p>
        </div>
        <div class="mt-4 rounded bg-blue-50 p-4 dark:bg-blue-900/20">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            💡 打开浏览器开发者工具 (F12) → Network 标签 → 筛选 Img，查看实际加载的图片大小和格式
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { detectImageFormat } = useImageOptimizer()

const browserFormat = ref('检测中...')
const devicePixelRatio = ref(1)
const viewportWidth = ref(0)

onMounted(() => {
  browserFormat.value = detectImageFormat()
  devicePixelRatio.value = window.devicePixelRatio || 1
  viewportWidth.value = window.innerWidth

  // 监听窗口大小变化
  const updateViewport = () => {
    viewportWidth.value = window.innerWidth
  }
  window.addEventListener('resize', updateViewport)

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewport)
  })
})

// SEO
useHead({
  title: '图片优化演示',
  meta: [
    {
      name: 'description',
      content: 'Nuxt Image + IPX 图片优化方案演示页面'
    }
  ]
})
</script>
