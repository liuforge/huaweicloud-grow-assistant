const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');

const FREE_CERT_IDS = [
  '4d5675fd2080405abe7314e8eae0399a', // 华为云码道（CodeArts）鸿蒙应用开发实战
  '9b164a73f33545d3bc69a523db79a04e', // 华为云鲲鹏弹性云服务器高可用性架构实践
  'ae1d1d6cb66448fdbd2208ff9b583702', // 搭建Discuz论坛网站
  '2e8fa91a249d4b399ab64b30dba095f9', // 华为云数据库服务实践
  '92841b01030c47f2864d38461546112c', // 华为云存储服务实践
  'ab32296d08d344bb86c5525c36adc0f4'  // 华为云计算服务实践
];

async function runActivateFreeCerts() {
  const { context } = await getBrowserContext();
  console.log(`[微认证激活] 开始检查并激活 ${FREE_CERT_IDS.length} 项官方免费微认证...`);

  for (const certId of FREE_CERT_IDS) {
    const url = `https://edu.huaweicloud.com/certification/${certId}`;
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2500);

      const activateBtn = page.locator('button:has-text("免费激活"), .btn:has-text("免费激活")').first();
      if (await activateBtn.isVisible()) {
        console.log(`[微认证激活] 发现可激活认证 (${certId})，正在点击...`);
        await activateBtn.click();
        await page.waitForTimeout(1500);

        const confirmBtn = page.locator('.tiny-dialog-box button:has-text("确定"), button:has-text("确认")').first();
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
          await page.waitForTimeout(2000);
        }
        console.log(`[微认证激活] 认证 ${certId} 激活成功！`);
      } else {
        console.log(`[微认证激活] 认证 ${certId} 已处于激活有效状态。`);
      }
    } catch (e) {
      console.warn(`[微认证激活] 处理 ${certId} 异常:`, e.message);
    } finally {
      if (!page.isClosed()) await page.close();
    }
  }

  console.log('[微认证激活] 所有 0 元微认证检查激活完毕！');
}

if (require.main === module) {
  runActivateFreeCerts().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { runActivateFreeCerts };
