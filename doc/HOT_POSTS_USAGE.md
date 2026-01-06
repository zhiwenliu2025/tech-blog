# 热门文章功能使用指南

## 📋 功能说明

热门文章功能基于**方案一（实时计算）**实现，通过动态计算文章的阅读量、点赞数和评论数来生成热度分数，无需额外的数据库字段或定时任务。

## 🎯 热度计算公式

```
基础热度分数 = 阅读量 × 0.3 + 点赞数 × 0.4 + 评论数 × 0.3
```

### 时间衰减（可选）

为了让新文章也有曝光机会，我们加入了时间衰减因子：

- **7天内**: 100% 权重（满分）
- **30天内**: 80% 权重
- **90天内**: 50% 权重
- **90天后**: 30% 权重

```
最终热度分数 = 基础热度分数 × 时间衰减因子
```

## 📦 已实现的功能

### 1. ✅ useHotPosts Composable

**文件位置**: `composables/useHotPosts.ts`

**主要功能**:

- `fetchHotPosts()` - 获取热门文章（首页侧边栏使用）
- `fetchPostsSortedByHot()` - 获取按热度排序的文章列表（博客列表页使用）
- `calculateHotScore()` - 计算基础热度分数
- `calculateHotScoreWithDecay()` - 计算带时间衰减的热度分数

**使用示例**:

```typescript
const { fetchHotPosts, hotPosts, loading, error } = useHotPosts()

// 获取热门文章（默认5篇，最近30天，使用时间衰减）
await fetchHotPosts(5, 30, true)

// 获取所有文章并按热度排序（分页）
const result = await fetchPostsSortedByHot(1, 10, true)
```

### 2. ✅ HotPosts 组件

**文件位置**: `components/HotPosts.vue`

**组件特性**:

- 🥇🥈🥉 前三名特殊样式（金银铜牌）
- 📊 显示阅读量、点赞数、评论数
- 🔥 可选显示热度分数
- ✨ 悬停动画效果
- 📱 响应式设计
- 🌙 深色模式支持

**Props**:

```typescript
interface Props {
  limit?: number // 显示数量，默认 5
  days?: number // 查询天数，默认 30
  showScore?: boolean // 是否显示热度分数，默认 false
  useDecay?: boolean // 是否使用时间衰减，默认 true
}
```

**使用示例**:

```vue
<!-- 首页侧边栏 -->
<HotPosts :limit="5" :days="30" :use-decay="true" :show-score="false" />

<!-- 显示热度分数 -->
<HotPosts :limit="10" :show-score="true" />

<!-- 不使用时间衰减 -->
<HotPosts :use-decay="false" />
```

### 3. ✅ 首页集成

**文件位置**: `pages/index.vue`

热门文章组件已集成到首页侧边栏，显示在"关于博客"模块上方。

### 4. ✅ 博客列表页排序

**文件位置**: `pages/blog/index.vue`

在筛选条件中添加了"🔥 热度排序"选项：

- 最新发布
- 最近更新
- **🔥 热度排序** ← 新增
- 阅读量
- 点赞数
- 按标题

## 🚀 使用方法

### 查看热门文章

1. **首页侧边栏**: 直接查看热门文章列表，点击任意文章跳转
2. **查看更多**: 点击"查看更多 →"跳转到按热度排序的博客列表页

### 按热度浏览文章

1. 访问 `/blog` 博客列表页
2. 在筛选条件中，排序选择"🔥 热度排序"
3. 文章将按热度分数从高到低排列

### URL 直达

```
# 直接访问按热度排序的文章列表
/blog?sort=hot
```

## 🎨 UI 展示

### 排名样式

- **第1名**: 金色渐变徽章（🥇）
- **第2名**: 银色渐变徽章（🥈）
- **第3名**: 铜色渐变徽章（🥉）
- **其他**: 灰色徽章

### 统计信息

每篇文章显示：

- 👁️ 阅读量
- ❤️ 点赞数
- 💬 评论数

### 动画效果

- 悬停时向右平移
- 徽章缩放动画
- 渐变闪烁效果

## ⚙️ 配置选项

### 修改热度计算权重

编辑 `composables/useHotPosts.ts`：

```typescript
const calculateHotScore = (post: BlogPostRow): number => {
  const viewWeight = 0.3 // 阅读量权重
  const likeWeight = 0.4 // 点赞数权重
  const commentWeight = 0.3 // 评论数权重

  // 根据你的需求调整权重
  // 例如：更重视点赞 -> likeWeight = 0.5, viewWeight = 0.25, commentWeight = 0.25
}
```

### 修改时间衰减策略

编辑 `composables/useHotPosts.ts`：

```typescript
const calculateDecayFactor = (publishedAt: string): number => {
  const daysSincePublished = // ...计算天数

  // 自定义时间衰减规则
  if (daysSincePublished <= 7) return 1.0
  else if (daysSincePublished <= 30) return 0.8
  else if (daysSincePublished <= 90) return 0.5
  else return 0.3
}
```

### 修改显示数量

编辑 `pages/index.vue`：

```vue
<!-- 修改 limit 属性 -->
<HotPosts :limit="10" :days="60" />
```

## 📊 性能说明

### 方案一（实时计算）性能特点

**优点**:

- ✅ 实时性强，数据始终最新
- ✅ 无需额外数据库字段
- ✅ 无需定时任务维护
- ✅ 实现简单，易于调整算法

**适用场景**:

- 文章数量 < 1000 篇
- 小型到中型博客
- 对实时性要求高的场景

**性能优化建议**:

1. **使用缓存** (已实现)

   ```typescript
   // 使用 Nuxt 的 useAsyncData 缓存热门文章
   // 缓存时间可在 nuxt.config.ts 中配置
   ```

2. **限制查询范围**

   ```typescript
   // 只查询最近 30 天的文章
   fetchHotPosts(5, 30, true)
   ```

3. **CDN 缓存**
   - 静态页面可利用 CDN 缓存
   - 降低服务器计算压力

## 🔄 扩展方案

### 方案二：缓存热度分数

如果文章数量增长到 1000+ 篇，建议升级到方案二（缓存热度分数）：

1. 在数据库添加 `hot_score` 字段
2. 创建定时任务更新热度分数
3. 查询时直接使用 `hot_score` 排序

详细方案见 `doc/HOT_POSTS_IMPLEMENTATION.md`

## 🐛 故障排除

### 热门文章不显示

**原因**: 可能是最近没有文章或文章互动数据为空

**解决方法**:

1. 检查是否有已发布的文章
2. 检查文章是否有阅读量、点赞或评论
3. 调整时间范围（增加 `days` 参数）

### 排序不准确

**原因**: 权重配置可能不适合你的博客

**解决方法**:

1. 调整 `calculateHotScore` 中的权重
2. 调整时间衰减因子
3. 禁用时间衰减（`useDecay: false`）

### 性能问题

**原因**: 文章数量过多导致实时计算变慢

**解决方法**:

1. 减少查询的时间范围（`days` 参数）
2. 增加缓存时间
3. 升级到方案二（缓存热度分数）

## 📝 维护建议

### 定期监控

- 监控热门文章列表的查询性能
- 分析用户对热门文章的点击率
- 根据数据调整权重配置

### 算法优化

- 定期分析热度分数分布
- 根据用户反馈调整时间衰减策略
- 考虑加入更多因素（如收藏数、分享数等）

### 数据分析

建议记录以下指标：

- 热门文章的平均热度分数
- 热门文章的点击率
- 不同排序方式的使用频率

## 🎯 未来改进方向

### 短期改进

1. **趋势指示器**: 显示文章热度上升/下降趋势
2. **热度徽章**: 超级热门文章特殊标记
3. **个性化推荐**: 基于用户历史结合热度推荐

### 长期改进

1. **机器学习**: 使用 ML 模型预测文章热度
2. **A/B 测试**: 测试不同权重配置的效果
3. **实时热度**: WebSocket 实时更新热度分数

## 📚 相关文档

- [热门文章功能完整实现方案](./HOT_POSTS_IMPLEMENTATION.md)
- [功能路线图](./FEATURE_ROADMAP.md)
- [README](../README.md)

## 🆘 获取帮助

如有问题，请：

1. 查看本文档的故障排除部分
2. 查看完整实现方案文档
3. 提交 Issue 或 Pull Request

---

**版本**: v1.0.0  
**更新时间**: 2026-01-06  
**实施方案**: 方案一（实时计算）
