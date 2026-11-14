const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');
const config = require('../../config/default.json');

(async () => {
  try {
    const { context } = await getBrowserContext();
    const page = await getOrCreatePage(context, config.urls.grow);
    await page.waitForTimeout(2000);

    let reqHeaders = null;
    const captureHandler = req => {
      if (req.url().includes('query-mission-list-by-condition')) {
        reqHeaders = req.headers();
      }
    };
    page.on('request', captureHandler);

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    page.off('request', captureHandler);

    if (!reqHeaders || !reqHeaders.csrf) {
      // Fallback: parse from page text directly
      const text = await page.evaluate(() => document.body.innerText);
      const pointsMatch = text.match(/(\d+)\s*我的积分/);
      console.log('====================================================');
      console.log(`[成长中心看板] 实时积分: ${pointsMatch ? pointsMatch[1] : '待登录/加载中'} 分`);
      console.log('====================================================');
      process.exit(0);
      return;
    }

    const missionsResult = await page.evaluate(async (csrf) => {
      const res = await fetch('https://devdata.huaweicloud.com/rest/developer/fwdu/rest/developer/user/hdcommunitysoservice/v1/growth/mission/query-mission-list-by-condition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'csrf': csrf
        },
        credentials: 'include',
        body: JSON.stringify({ page_no: 1, page_size: 20, category_key: 'DAILY_MISSIONS' })
      });
      return await res.json().catch(() => null);
    }, reqHeaders.csrf);

    const pointsText = await page.evaluate(() => {
      const m = document.body.innerText.match(/(\d+)\s*我的积分/);
      return m ? m[1] : '未知';
    });

    console.log('====================================================');
    console.log(`[成长中心看板] 实时积分: ${pointsText} 分`);
    console.log('====================================================');

    const list = missionsResult?.QueryMissionDtoList || [];
    let completedCount = 0;
    list.forEach((m, idx) => {
      const isDone = m.is_finish === 1;
      if (isDone) completedCount++;
      const tag = isDone ? '[\x1b[32m已完成\x1b[0m]' : '[\x1b[33m待完成/处理中\x1b[0m]';
      console.log(`${(idx + 1).toString().padStart(2, ' ')}. ${tag} 【${m.title}】 (+${m.bonus}分)`);
    });

    console.log('----------------------------------------------------');
    console.log(`任务统计: 已完成 ${completedCount} / 总计 ${list.length}`);
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('获取状态失败:', err.message);
    process.exit(1);
  }
})();
