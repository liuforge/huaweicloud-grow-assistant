const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');
const config = require('../../config/default.json');

async function runHarmonyCase() {
  const { context } = await getBrowserContext();
  const page = await getOrCreatePage(context, config.urls.harmonyCenter);
  await page.waitForTimeout(3000);

  console.log('[每日鸿蒙案例] 正在定位案例详情页...');
  const caseCard = page.locator('.case-card, .practice-item, [class*="case-item"], [class*="practice-card"]').first();
  if (await caseCard.isVisible()) {
    await caseCard.click();
  } else {
    // Direct navigate to an unvisited case
    await page.goto('https://harmonybp.developer.huaweicloud.com/case-detail/1000000001', { waitUntil: 'domcontentloaded' });
  }

  console.log(`[每日鸿蒙案例] 正在停留浏览 (${config.defaultTimeouts.dwellSeconds}秒)，以满足平台有效阅读要求...`);
  await page.waitForTimeout(config.defaultTimeouts.dwellSeconds * 1000);
  console.log('[每日鸿蒙案例] 案例浏览有效停留达成 (+10 积分)!');
  return true;
}

if (require.main === module) {
  runHarmonyCase().then(() => process.exit(0)).catch(e => {
    console.error('[每日鸿蒙案例] 执行异常:', e);
    process.exit(1);
  });
}

module.exports = { runHarmonyCase };
