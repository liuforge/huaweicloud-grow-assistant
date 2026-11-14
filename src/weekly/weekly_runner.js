const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');
const config = require('../../config/default.json');

async function main() {
  console.log('====================================================');
  console.log('🌟 [Weekly Runner] 开始执行华为云成长中心周常自动化任务');
  console.log(`执行时间: ${new Date().toLocaleString()}`);
  console.log('====================================================');

  const { context } = await getBrowserContext();

  // 1. Agent Center Star
  console.log('\n[周常 1/4] 检查并点赞 Agent 实践中心开源仓库 (+50 分)...');
  const starPage = await context.newPage();
  try {
    await starPage.goto('https://gitcode.com/huaweicloud-agent/smart-campus', { waitUntil: 'domcontentloaded' });
    await starPage.waitForTimeout(3000);
    const starBtn = starPage.locator('button:has-text("Star"), [data-test="star-button"]').first();
    if (await starBtn.isVisible()) {
      const text = await starBtn.innerText();
      if (!text.includes('Starred') && !text.includes('已Star')) {
        await starBtn.click();
        console.log('Agent 实践中心仓库点赞成功 (+50 积分)!');
      } else {
        console.log('本周 Agent 仓库已处于 Star 状态。');
      }
    }
  } catch (e) {
    console.warn('Agent Star 处理跳过:', e.message);
  } finally {
    if (!starPage.isClosed()) await starPage.close();
  }

  // 2. Developer Activity signup
  console.log('\n[周常 2/4] 检查并报名最新开发者活动 (+10 分)...');
  const eventPage = await context.newPage();
  try {
    await eventPage.goto('https://developer.huaweicloud.com/events', { waitUntil: 'domcontentloaded' });
    await eventPage.waitForTimeout(3000);
    const signupBtn = eventPage.locator('button:has-text("立即报名"), .btn-signup').first();
    if (await signupBtn.isVisible()) {
      await signupBtn.click();
      console.log('活动报名点击成功 (+10 积分)!');
    } else {
      console.log('暂无可报名的新活动或本周已完成。');
    }
  } catch (e) {
    console.warn('活动报名跳过:', e.message);
  } finally {
    if (!eventPage.isClosed()) await eventPage.close();
  }

  console.log('\n====================================================');
  console.log('🎉 [Weekly Runner] 周常任务执行流程结束！');
  console.log('====================================================');
}

if (require.main === module) {
  main().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main };
