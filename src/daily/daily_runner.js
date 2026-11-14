const { runSignIn } = require('./sign_in');
const { runHarmonyCase } = require('./harmony_case');
const { runHarmonyStar } = require('./harmony_star');
const { runDevSpaceTask } = require('./devspace_task');
const { runBlogPublisher } = require('./blog_publisher');

async function main() {
  console.log('====================================================');
  console.log('🚀 [Daily Runner] 开始执行华为云成长中心每日自动化循环');
  console.log(`执行时间: ${new Date().toLocaleString()}`);
  console.log('====================================================');

  try {
    console.log('\n[任务 1/5] 每日签到 (+10 分)');
    await runSignIn().catch(e => console.error('签到跳过/失败:', e.message));

    console.log('\n[任务 2/5] 每日浏览鸿蒙案例 (+10 分)');
    await runHarmonyCase().catch(e => console.error('案例浏览跳过/失败:', e.message));

    console.log('\n[任务 3/5] 每日Star鸿蒙案例代码仓 (+30 分)');
    await runHarmonyStar().catch(e => console.error('Star仓跳过/失败:', e.message));

    console.log('\n[任务 4/5] 每日体验 AI DevSpace (+30 分)');
    await runDevSpaceTask().catch(e => console.error('DevSpace体验跳过/失败:', e.message));

    console.log('\n[任务 5/5] 每日发布技术文章 (+60 分)');
    await runBlogPublisher().catch(e => console.error('博文发布跳过/失败:', e.message));

    console.log('\n====================================================');
    console.log('🎉 [Daily Runner] 每日任务执行流程结束 (理论日收益: +140 积分)');
    console.log('====================================================');
  } catch (err) {
    console.error('Daily Runner 异常终止:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main().then(() => process.exit(0));
}

module.exports = { main };
