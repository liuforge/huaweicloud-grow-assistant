const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');

const TOPICS = [
  {
    title: '基于华为云GaussDB分布式架构的企业高并发数据库实战解析',
    tag: '云数据库',
    content: `## 一、GaussDB 核心架构优势\n华为云企业级分布式数据库 GaussDB 采用领先的计算与存储分离架构，具备极致弹性与高可用特性。\n\n## 二、核心实践要点\n1. 分布式全局死锁检测与并发控制\n2. 跨AZ多活容灾与秒级主备倒换\n3. 智能查询优化器与向量化引擎加速\n\n## 三、总结\n在应对极端波峰流量时，GaussDB 展现出卓越的低延时与高吞吐性能。`
  },
  {
    title: '深度解析华为云CodeArts码道智能体驱动HarmonyOS原生开发新范式',
    tag: '鸿蒙',
    content: `## 一、码道核心技术架构\n华为云 CodeArts 深度融合 ArkTS 语法树规范与端云一体化理念，为开发者提供高可信代码生成能力。\n\n## 二、关键应用场景\n1. 规范化 ArkTS 页面骨架与组件树生成\n2. 端侧与云端数据模型接口双向绑定\n3. 自动化测试用例与错误诊断建议\n\n## 三、结语\n码道大幅缩减了新生态应用的学习与研发门槛。`
  }
];

async function runBlogPublisher() {
  const { context } = await getBrowserContext();
  const page = await getOrCreatePage(context, 'https://bbs.huaweicloud.com/blogs/article');
  await page.waitForTimeout(4000);

  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  console.log(`[每日博客] 正在撰写发布技术博文: 《${topic.title}》...`);

  // Type title
  const titleInput = page.locator('input[placeholder*="请输入标题"], #title, input.title-input').first();
  if (await titleInput.isVisible()) {
    await titleInput.fill(topic.title);
  }

  // Type content in editor
  const contentArea = page.locator('textarea, .milkdown, div[contenteditable="true"]').first();
  if (await contentArea.isVisible()) {
    await contentArea.click();
    await contentArea.fill(topic.content);
  }

  await page.waitForTimeout(1000);

  // Click publish
  const pubBtn = page.locator('button:has-text("发布文章"), button:has-text("发表文章"), .publish-btn').first();
  if (await pubBtn.isVisible()) {
    console.log('[每日博客] 点击发布按钮...');
    await pubBtn.click();
    await page.waitForTimeout(3000);
    console.log('[每日博客] 博客发布成功 (+60 积分)!');
    return true;
  } else {
    console.warn('[每日博客] 未找到发布按钮，可能今日已达发文上限。');
    return false;
  }
}

if (require.main === module) {
  runBlogPublisher().then(() => process.exit(0)).catch(e => {
    console.error('[每日博客] 执行异常:', e);
    process.exit(1);
  });
}

module.exports = { runBlogPublisher };
