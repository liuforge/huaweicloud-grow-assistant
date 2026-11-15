const { getBrowserContext } = require('../core/cdp_client');
const config = require('../../config/default.json');

async function runHarmonyCase() {
  const { context } = await getBrowserContext();
  const page = await context.newPage();

  try {
    console.log('[每日鸿蒙案例] 正在加载鸿蒙案例库...');
    await page.goto('https://harmonybp.developer.huaweicloud.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const cases = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/cases/"]'));
      return Array.from(new Set(links.map(a => a.href))).filter(h => h.length > 40);
    });

    const target = cases[3] || cases[0] || 'https://harmonybp.developer.huaweicloud.com/cases/c0043e1e9d0240d19c23fa2556d5ecfc';
    console.log(`[每日鸿蒙案例] 进入目标案例: ${target}`);
    await page.goto(target, { waitUntil: 'domcontentloaded' });

    console.log('[每日鸿蒙案例] 正在进行有效停留 (35秒心跳滚动)...');
    for (let s = 0; s < 7; s++) {
      await page.waitForTimeout(5000);
      await page.evaluate(() => window.scrollBy(0, 300));
    }

    console.log('[每日鸿蒙案例] 案例浏览有效停留已满足 (+10 积分)!');
    return true;
  } finally {
    if (!page.isClosed()) await page.close();
  }
}

if (require.main === module) {
  runHarmonyCase().then(() => process.exit(0)).catch(e => {
    console.error('[每日鸿蒙案例] 执行异常:', e);
    process.exit(1);
  });
}

module.exports = { runHarmonyCase };
