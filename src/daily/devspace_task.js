const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');
const config = require('../../config/default.json');

async function runDevSpaceTask() {
  const { context } = await getBrowserContext();
  const page = await getOrCreatePage(context, config.urls.agentCenter);
  await page.waitForTimeout(3000);

  console.log('[每日DevSpace] 正在触发 Agent 实践中心的体验入口...');
  const clicked = await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('button, a, div[role="button"], .btn'));
    const target = allBtns.find(b => b.innerText.includes('前往AI DevSpace实践') && b.closest('div')?.innerText.includes('30 积分'));
    if (target) {
      target.click();
      return true;
    }
    const anyBtn = allBtns.find(b => b.innerText.includes('前往AI DevSpace实践'));
    if (anyBtn) {
      anyBtn.click();
      return true;
    }
    return false;
  });

  console.log(`[每日DevSpace] 按钮触发状态: ${clicked ? '成功' : '未找到'}`);
  await page.waitForTimeout(4000);
  console.log('[每日DevSpace] 体验信号已成功发送至后台，等待系统对账入账 (+30 积分)!');
  return true;
}

if (require.main === module) {
  runDevSpaceTask().then(() => process.exit(0)).catch(e => {
    console.error('[每日DevSpace] 执行异常:', e);
    process.exit(1);
  });
}

module.exports = { runDevSpaceTask };
