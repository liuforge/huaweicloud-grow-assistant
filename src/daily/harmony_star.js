const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');
const config = require('../../config/default.json');

async function runHarmonyStar() {
  const { context } = await getBrowserContext();
  const page = await getOrCreatePage(context, config.urls.harmonyCenter);
  await page.waitForTimeout(3000);

  console.log('[每日鸿蒙Star] 正在检索未 Star 的鸿蒙案例仓库...');
  const repoLinks = [
    'https://gitcode.com/harmony-practice-center/todo_list',
    'https://gitcode.com/harmony-practice-center/rentandbuy',
    'https://gitcode.com/harmony-practice-center/ecommerce',
    'https://gitcode.com/harmony-practice-center/travel_assistant'
  ];

  // Try each until one is successfully starred
  for (const url of repoLinks) {
    const starPage = await context.newPage();
    try {
      await starPage.goto(url, { waitUntil: 'domcontentloaded' });
      await starPage.waitForTimeout(3000);

      const starBtn = starPage.locator('button:has-text("Star"), .star-btn, [data-test="star-button"]').first();
      if (await starBtn.isVisible()) {
        const text = await starBtn.innerText();
        if (!text.includes('Starred') && !text.includes('已Star') && !text.includes('取消Star')) {
          console.log(`[每日鸿蒙Star] 发现未Star项目: ${url}，正在点赞...`);
          await starBtn.click();
          await starPage.waitForTimeout(2000);
          console.log('[每日鸿蒙Star] 点赞成功 (+30 积分)!');
          await starPage.close();
          return true;
        }
      }
    } catch (e) {
      console.warn(`[每日鸿蒙Star] 检查 ${url} 失败:`, e.message);
    } finally {
      if (!starPage.isClosed()) await starPage.close();
    }
  }

  console.log('[每日鸿蒙Star] 今日备选仓库均已处于 Star 状态。');
  return true;
}

if (require.main === module) {
  runHarmonyStar().then(() => process.exit(0)).catch(e => {
    console.error('[每日鸿蒙Star] 执行异常:', e);
    process.exit(1);
  });
}

module.exports = { runHarmonyStar };
