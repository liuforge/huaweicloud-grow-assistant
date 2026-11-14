const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');
const config = require('../../config/default.json');

const SUGGESTIONS = [
  {
    title: '【功能建议】开发者成长中心建议增加任务结算中状态反馈与代金券补货订阅',
    content: '当前成长中心每周微认证与鸿蒙端云实践任务完成后，存在约 12~24 小时的批处理结算延迟。建议在任务卡片上增加“对账中/即将到账”标签，并提供代金券库存补货站内信/邮件订阅提醒功能。'
  },
  {
    title: '【开发体验】建议 CodeArts Web 增加鸿蒙 ArkTS 本地编译环境版本智能检测与自动修复',
    content: '在导入开源鸿蒙项目模板时，不同 DevEco Studio 与 SDK 版本间的 compileSdkVersion 容易产生不兼容报错（如错误码 00303313）。建议在打开项目时增加版本自检并提供一键自动迁移修复。'
  }
];

async function runSubmitSuggestion() {
  const { context } = await getBrowserContext();
  const page = await getOrCreatePage(context, config.urls.yunsheng);
  await page.waitForTimeout(3000);

  const sug = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
  console.log(`[云声建议] 准备提交平台优化建议: ${sug.title}...`);

  const createBtn = page.locator('button:has-text("提建议"), button:has-text("新建建议"), .new-btn').first();
  if (await createBtn.isVisible()) {
    await createBtn.click();
    await page.waitForTimeout(2000);

    const titleInput = page.locator('input[placeholder*="标题"], #title').first();
    if (await titleInput.isVisible()) {
      await titleInput.fill(sug.title);
    }

    const descArea = page.locator('textarea, div[contenteditable="true"]').first();
    if (await descArea.isVisible()) {
      await descArea.fill(sug.content);
    }

    const submitBtn = page.locator('button:has-text("提交"), .btn-primary').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
      console.log('[云声建议] 建议已成功提交至官方产品经理审核 (采纳可得 +60 ~ +200 积分)!');
      return true;
    }
  }

  console.log('[云声建议] 当前页面处于列表查看状态，未触发直接提交。');
  return false;
}

if (require.main === module) {
  runSubmitSuggestion().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { runSubmitSuggestion };
