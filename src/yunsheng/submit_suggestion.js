const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  console.log('Navigating to Cloud Voice new suggestion page...');
  await page.goto('https://bbs.huaweicloud.com/suggestion/new', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1. Select 功能建议
  const funcType = page.locator('.type-item, .item, [class*="type"]').filter({ hasText: '功能建议' }).first();
  if (await funcType.isVisible()) {
    console.log('Selecting 功能建议...');
    await funcType.click();
    await page.waitForTimeout(500);
  }

  // 2. Fill Title (max 64 chars)
  const title = '【功能建议】CodeArts端云协同编译建议增加鸿蒙SDK版本兼容检测与一键修复';
  console.log('Setting title:', title);
  const titleInput = page.locator('.input-title, input[placeholder*="标题"]').first();
  await titleInput.fill(title);
  await page.waitForTimeout(500);

  // 3. Select Tag
  const tagInput = page.locator('.input-tag').first();
  if (await tagInput.isVisible()) {
    await tagInput.click();
    await page.waitForTimeout(1000);
    const tagItem = page.locator('li.product-item').filter({ hasText: 'CodeArts' }).or(page.locator('li.product-item').filter({ hasText: '云开发环境' })).first();
    if (await tagItem.isVisible()) {
      await tagItem.click();
      await page.waitForTimeout(500);
    }
  }

  // 4. Fill Content via TinyMCE
  const contentHtml = `<p><strong>【业务场景】</strong><br />
在华为云 CodeArts Web 端云协同开发鸿蒙原生应用与端云一体实战项目中，开发者常需拉取开源案例（如 TodoList、智慧推荐等）并在云端容器内执行 hvigorw assembleHap 编译打包。</p>
<p><strong>【当前痛点】</strong><br />
开源项目代码仓中的 build-profile.json5 常硬编码特定的 compileSdkVersion（例如历史版本 24），而云端容器内 DevEco Studio 与 SDK 版本通常已自动升级至最新稳定版（例如 26.0.0），导致直接执行编译时频繁抛出 00303313 版本不匹配错误，阻断了开发者的初次体验流畅度。</p>
<p><strong>【优化建议】</strong><br />
1. <strong>版本智能检测机制</strong>：在拉取 Git 仓完成后，CodeArts 静态检查组件自动比对 build-profile.json5 中的 SDK 字段与当前容器环境；<br />
2. <strong>一键智能适配/移除</strong>：在检测到版本冲突时，在 Web 端主动提供“一键适配当前环境 SDK”微交互按钮，自动同步匹配最新版本并直接无缝触发构建；<br />
3. <strong>构建日志与成长中心对账</strong>：进一步缩短云端编译成功产物与开发者成长中心“每周实践一次鸿蒙案例”任务的异步结算延迟，提升反馈确定性。</p>`;

  await page.evaluate((html) => {
    if (window.tinymce && window.tinymce.activeEditor) {
      window.tinymce.activeEditor.setContent(html);
      return 'TinyMCE success';
    } else {
      const ifr = document.querySelector('#editor_ifr');
      if (ifr && ifr.contentDocument) {
        ifr.contentDocument.body.innerHTML = html;
        return 'Iframe success';
      }
    }
    return 'Editor not found';
  }, contentHtml);

  await page.waitForTimeout(1500);

  // 5. Check agreement checkbox
  const agreeCb = page.locator('.check-box, input[type="checkbox"]').filter({ hasText: '已知晓' }).or(page.locator('input[type="checkbox"]').last());
  if (await agreeCb.isVisible()) {
    await agreeCb.check({ force: true });
    await page.waitForTimeout(500);
  }

  // 6. Submit
  const submitBtn = page.locator('button:has-text("提交建议"), .submit-btn, .btn-block:has-text("提交建议")').first();
  if (await submitBtn.isVisible()) {
    console.log('Submitting Sunday Cloud Voice suggestion...');
    await submitBtn.click();
    await page.waitForTimeout(5000);
  }

  console.log('Submission finished. Current URL:', page.url());
  await page.screenshot({ path: '/Users/liujunyan/.gemini/antigravity/brain/c48e92a3-2a69-4006-997b-bc8e23a940a9/sunday_suggestion_done.png' });
  await page.close();
  process.exit(0);
})();
