const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');
const config = require('../../config/default.json');

/**
 * 每日签到模块
 * 
 * 避坑说明：
 * 华为云成长中心页面常驻显示“已连续签到 X 天”信息卡片，严禁将该文字作为已签到的判定标准。
 * 必须严格校验交互按钮的具体状态与文字内容（“立即签到” vs “已签到”）。
 */
async function runSignIn() {
  const { context } = await getBrowserContext();
  const page = await getOrCreatePage(context, config.urls.grow);
  await page.waitForTimeout(2000);

  // 1. 定位交互按钮，严格排除静态文案卡片
  const signStatus = await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button, div[role="button"], .btn, .sign-btn, [class*="sign"]'));
    const targetBtn = allButtons.find(b => {
      const text = b.innerText ? b.innerText.trim() : '';
      return (text === '立即签到' || text === '已签到') && b.children.length <= 1;
    });

    if (!targetBtn) {
      return { found: false, text: '' };
    }

    return {
      found: true,
      text: targetBtn.innerText.trim(),
      canClick: targetBtn.innerText.trim() === '立即签到'
    };
  });

  if (!signStatus.found) {
    console.warn('[每日签到] 未能唯一定位签到交互按钮，请检查登录态或网络。');
    return false;
  }

  if (signStatus.canClick) {
    console.log('[每日签到] 状态确认为【未签到】，正在执行签到点击...');
    const btn = page.locator('button:has-text("立即签到"), [class*="btn"]:has-text("立即签到"), div:has-text("立即签到")').first();
    await btn.click();
    await page.waitForTimeout(2000);
    console.log('[每日签到] 签到完成 (+10 积分)!');
    return true;
  } else {
    console.log(`[每日签到] 状态已确认为【${signStatus.text}】，今日无需重复签到。`);
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
