const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');
const config = require('../../config/default.json');

async function runSignIn() {
  const { context } = await getBrowserContext();
  const page = await getOrCreatePage(context, config.urls.grow);
  await page.waitForTimeout(2000);

  const signBtn = page.locator('button:has-text("立即签到"), [class*="btn"]:has-text("立即签到"), div:has-text("立即签到")').first();
  if (await signBtn.isVisible()) {
    console.log('[每日签到] 检测到未签到，正在执行签到...');
    await signBtn.click();
    await page.waitForTimeout(2000);
    console.log('[每日签到] 签到完成 (+10 积分)!');
    return true;
  } else {
    console.log('[每日签到] 今日已签到，跳过。');
    return false;
  }
}

if (require.main === module) {
  runSignIn().then(() => process.exit(0)).catch(e => {
    console.error('[每日签到] 执行异常:', e);
    process.exit(1);
  });
}

module.exports = { runSignIn };
