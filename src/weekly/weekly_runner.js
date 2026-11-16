const { starAgentRepo, submitAgentIssue } = require('./agent_tasks');
const { submitCompetitionWork } = require('./competition_submit');
const { runHarmonyPractice } = require('./harmony_practice');
const { getBrowserContext } = require('../core/cdp_client');

async function main() {
  console.log('====================================================');
  console.log('🌟 [Weekly Runner] 开始执行华为云成长中心周常全量自动化任务');
  console.log(`执行时间: ${new Date().toLocaleString()}`);
  console.log('====================================================');

  // 1. Agent Center Star (+50 分)
  console.log('\n[周常 1/5] 检查并点赞 Agent 实践中心开源项目 (+50 分)...');
  await starAgentRepo();

  // 2. Agent Center Issue (+60 分)
  console.log('\n[周常 2/5] 向 Agent 实践中心开源仓库提 Issue (+60 分)...');
  await submitAgentIssue();

  // 3. Weekly Harmony Practice (+100 分)
  console.log('\n[周常 3/5] 执行鸿蒙案例云端实践与编译打包 (+100 分)...');
  await runHarmonyPractice();

  // 4. Weekly Competition Submit (+100 分)
  console.log('\n[周常 4/5] 打包并提交开发者大赛作品 (+100 分)...');
  await submitCompetitionWork();

  // 5. Developer Activity signup (+10 分)
  console.log('\n[周常 5/5] 检查并报名最新开发者活动 (+10 分)...');
  const { context } = await getBrowserContext();
  const eventPage = await context.newPage();
  try {
    await eventPage.goto('https://developer.huaweicloud.com/events', { waitUntil: 'domcontentloaded' });
    await eventPage.waitForTimeout(3000);
    const signupBtn = eventPage.locator('button:has-text("立即报名"), .btn-signup').first();
    if (await signupBtn.isVisible()) {
      await signupBtn.click();
      console.log('活动报名点击成功 (+10 积分)!');
    }
  } catch (e) {
    console.warn('活动报名跳过:', e.message);
  } finally {
    if (!eventPage.isClosed()) await eventPage.close();
  }

  console.log('\n====================================================');
  console.log('🎉 [Weekly Runner] 华为云成长中心周常全流程执行完毕！');
  console.log('====================================================');
}

if (require.main === module) {
  main().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main };
