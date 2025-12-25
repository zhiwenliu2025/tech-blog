import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicDir = join(__dirname, '..', 'public')

// 主题色
const primaryColor = '#3b82f6'
const backgroundColor = '#ffffff'
const darkBackgroundColor = '#1e293b'

// 创建 SVG 图标（书籍图标）
const createIconSVG = (size, isMaskable = false) => {
  const padding = isMaskable ? size * 0.1 : 0 // maskable 图标需要 10% 安全边距
  const contentSize = size - padding * 2
  const centerX = size / 2
  const centerY = size / 2

  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  ${isMaskable ? `<rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size * 0.2}"/>` : ''}
  <g transform="translate(${centerX}, ${centerY})">
    <!-- 书籍主体 -->
    <rect x="${-contentSize * 0.3}" y="${-contentSize * 0.35}" 
          width="${contentSize * 0.6}" height="${contentSize * 0.7}" 
          fill="${primaryColor}" rx="${contentSize * 0.05}"/>
    
    <!-- 书页线条 -->
    <line x1="${-contentSize * 0.25}" y1="${-contentSize * 0.25}" 
          x2="${contentSize * 0.25}" y2="${-contentSize * 0.25}" 
          stroke="${backgroundColor}" stroke-width="${contentSize * 0.02}" opacity="0.3"/>
    <line x1="${-contentSize * 0.25}" y1="${-contentSize * 0.1}" 
          x2="${contentSize * 0.25}" y2="${-contentSize * 0.1}" 
          stroke="${backgroundColor}" stroke-width="${contentSize * 0.02}" opacity="0.3"/>
    <line x1="${-contentSize * 0.25}" y1="${contentSize * 0.05}" 
          x2="${contentSize * 0.25}" y2="${contentSize * 0.05}" 
          stroke="${backgroundColor}" stroke-width="${contentSize * 0.02}" opacity="0.3"/>
    
    <!-- 书脊高光 -->
    <rect x="${-contentSize * 0.3}" y="${-contentSize * 0.35}" 
          width="${contentSize * 0.08}" height="${contentSize * 0.7}" 
          fill="${backgroundColor}" opacity="0.2" rx="${contentSize * 0.05}"/>
  </g>
</svg>`
}

// 生成图标函数
async function generateIcon(size, filename, isMaskable = false) {
  const svg = createIconSVG(size, isMaskable)
  const svgBuffer = Buffer.from(svg)

  try {
    await sharp(svgBuffer).resize(size, size).png().toFile(join(publicDir, filename))

    console.log(`✅ 生成成功: ${filename} (${size}x${size})`)
  } catch (error) {
    console.error(`❌ 生成失败: ${filename}`, error)
    throw error
  }
}

// 主函数
async function generateAllIcons() {
  console.log('开始生成 PWA 图标...\n')

  try {
    // 生成标准图标
    await generateIcon(64, 'pwa-64x64.png')
    await generateIcon(192, 'pwa-192x192.png')
    await generateIcon(512, 'pwa-512x512.png')

    // 生成 maskable 图标（带安全边距）
    await generateIcon(512, 'maskable-icon-512x512.png', true)

    // 生成 Apple 图标
    await generateIcon(180, 'apple-touch-icon.png')

    console.log('\n✨ 所有图标生成完成！')
    console.log('\n生成的文件：')
    console.log('  - pwa-64x64.png')
    console.log('  - pwa-192x192.png')
    console.log('  - pwa-512x512.png')
    console.log('  - maskable-icon-512x512.png')
    console.log('  - apple-touch-icon.png')
  } catch (error) {
    console.error('\n❌ 生成图标时出错:', error)
    process.exit(1)
  }
}

// 运行
generateAllIcons()
