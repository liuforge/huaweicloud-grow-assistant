const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');
const config = require('../../config/default.json');

(async () => {
  try {
    const { context } = await getBrowserContext();
    const page = await getOrCreatePage(context, config.urls.grow);

    let respData = null;
    const captureHandler = async res => {
      if (res.url().includes('bonus-flow')) {
        respData = await res.json().catch(() => null);
      }
    };
    page.on('response', captureHandler);

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('span, a, div')).find(x => x.children.length === 0 && x.innerText.trim() === '积分明细');
      if (el) el.click();
    });
    await page.waitForTimeout(2000);
    page.off('response', captureHandler);

    console.log('====================================================');
    console.log(`[成长中心明细] 最近变动流水 (总记录: ${respData?.count || 0})`);
    console.log('====================================================');

    const flows = respData?.BonusFlowList || [];
    flows.slice(0, 15).forEach((item, idx) => {
      console.log(`[${(idx + 1).toString().padStart(2, ' ')}] ${item.commit_time} | ${item.detail.padEnd(26, ' ')} | +${item.beans.toString().padStart(3, ' ')} 分 | 结余: ${item.balance}`);
    });

    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('获取明细失败:', err.message);
    process.exit(1);
  }
})();
