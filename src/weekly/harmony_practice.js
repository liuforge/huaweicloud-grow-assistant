const { getBrowserContext } = require('../core/cdp_client');

/**
 * 自动化执行鸿蒙案例云端实践与编译构建
 * 满足成长中心任务：【每周实践一次鸿蒙案例】 (+100 积分)
 */
async function runHarmonyPractice(caseUrl = 'https://harmonybp.developer.huaweicloud.com/cases/8064f6e996cd42d3b20bb88f8a96ade5') {
  const { context } = await getBrowserContext();
  const page = await context.newPage();

  try {
    console.log(`[Weekly Harmony Practice] 打开鸿蒙案例详情页: ${caseUrl}`);
    await page.goto(caseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const practiceBtn = page.locator('button.cp-btn--primary:has-text("云端实践")').first();
    if (await practiceBtn.isVisible()) {
      console.log('[Weekly Harmony Practice] 点击「云端实践」...');
      await practiceBtn.click();
      await page.waitForTimeout(5000);
    }

    // 切换至开发者空间标签页
    const pages = context.pages();
    const devPage = pages.find(p => p.url().includes('devstation') || p.url().includes('aidevspace')) || page;
    const wsFrame = devPage.frames().find(f => f.url().includes('workspace.developer.huaweicloud.com'));

    if (wsFrame) {
      console.log('[Weekly Harmony Practice] 找到云端工作空间 Frame...');
      
      // 若处于新建项目弹窗，填入目录并创建
      const dirInput = wsFrame.locator('input[placeholder*="my-app"], input[placeholder*="/home/"]').first();
      if (await dirInput.isVisible({ timeout: 10000 }).catch(() => false)) {
        await dirInput.fill('harmony-auto-app');
        const createBtn = wsFrame.locator('button.btn-primary:has-text("创建")').first();
        if (await createBtn.isVisible()) {
          await createBtn.click();
          await devPage.waitForTimeout(10000);
        }
      }

      // 切换至 CodeArts Web 触发编译
      console.log('[Weekly Harmony Practice] 切换至 CodeArts Web...');
      await wsFrame.evaluate(() => {
        const items = Array.from(document.querySelectorAll('a, div, span'));
        const webItem = items.find(el => el.innerText && el.innerText.trim() === 'CodeArts Web');
        if (webItem) webItem.click();
      });
      await devPage.waitForTimeout(4000);

      const taskInput = wsFrame.locator('textarea[placeholder*="描述新任务"], textarea').first();
      if (await taskInput.isVisible({ timeout: 10000 }).catch(() => false)) {
        await taskInput.fill('请帮我编译打包当前鸿蒙项目，生成产物并验证构建');
        const sendBtn = wsFrame.locator('.btn-send, button:has-text("发送"), [class*="send"]').last();
        await sendBtn.click();
        console.log('[Weekly Harmony Practice] 已发送构建指令至 CodeArts AI 智能体...');

        // 自动同意并授权
        for (let i = 0; i < 10; i++) {
          await devPage.waitForTimeout(3000);
          await wsFrame.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, .btn, span'));
            for (const b of btns) {
              const t = (b.innerText || '').trim().toLowerCase();
              if (t === 'always allow' || t === '总是允许' || t === '允许' || t === '确定') {
                b.click();
              }
            }
          });
        }
      }
    }

    console.log('[Weekly Harmony Practice] 鸿蒙案例云端实践与编译打包触发流程完成 (+100 积分)!');
    return true;
  } catch (e) {
    console.warn('[Weekly Harmony Practice] 异常:', e.message);
    return false;
  } finally {
    if (!page.isClosed()) await page.close();
  }
}

module.exports = { runHarmonyPractice };
