const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');

/**
 * 官方开发者大赛管理与追踪模块
 * 
 * 功能：
 * 1. 查询当前账号在华为云开发者大赛平台的报名与参赛状态。
 * 2. 检查待提交作品的赛事列表与截止日期。
 * 3. 规范化管理官方参赛作品提交材料。
 */

const COMPETITIONS = [
  {
    id: '1300000350',
    name: '2026华为开发者大赛·小红书Skill创新赛',
    url: 'https://developer.huaweicloud.com/competition/information/1300000350/introduction',
    submitUrl: 'https://developer.huaweicloud.com/competition/information/1300000350/submission',
    bonusInfo: '参赛作品入围/获奖可获专项代金券及奖金池支持'
  },
  {
    id: '1300000363',
    name: '华为云鸿蒙与多智能体协同创新大赛',
    url: 'https://developer.huaweicloud.com/competition/information/1300000363',
    submitUrl: 'https://developer.huaweicloud.com/competition/information/1300000363',
    bonusInfo: '每周提交作品可获取成长中心 +100 积分'
  }
];

async function checkCompetitions() {
  const { context } = await getBrowserContext();
  console.log('====================================================');
  console.log('🏆 [官方开发者大赛追踪看板]');
  console.log('====================================================');

  for (const comp of COMPETITIONS) {
    const page = await context.newPage();
    try {
      await page.goto(comp.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const statusText = await page.evaluate(() => {
        const text = document.body.innerText;
        if (text.includes('已报名') || text.includes('已参赛') || text.includes('我的团队')) {
          return '已报名';
        }
        if (text.includes('立即报名')) {
          return '未报名';
        }
        return '查看中';
      });

      console.log(`[赛事 ID: ${comp.id}] 《${comp.name}》`);
      console.log(`  报名状态: ${statusText === '已报名' ? '\x1b[32m已报名\x1b[0m' : statusText}`);
      console.log(`  激励说明: ${comp.bonusInfo}`);
      console.log(`  赛事链接: ${comp.url}\n`);
    } catch (e) {
      console.warn(`检查赛事 ${comp.id} 失败:`, e.message);
    } finally {
      if (!page.isClosed()) await page.close();
    }
  }

  console.log('====================================================');
}

if (require.main === module) {
  checkCompetitions().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { checkCompetitions, COMPETITIONS };
