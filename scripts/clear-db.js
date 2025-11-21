import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 加载环境变量
config()

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

// 创建 Supabase 客户端（使用 service key）
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 清空数据库
async function clearDatabase() {
  try {
    console.log('开始清空数据库...')

    // 删除所有博客文章
    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // 删除所有记录

    if (deleteError) {
      console.error('清空数据失败:', deleteError)
      return
    }

    console.log('数据库已清空')
  } catch (error) {
    console.error('清空数据库过程中发生错误:', error)
  }
}

// 运行清空操作
clearDatabase()
