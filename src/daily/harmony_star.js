const { getBrowserContext } = require('../core/cdp_client');

async function runHarmonyStar() {
  const { context } = await getBrowserContext();
  const page = await context.newPage();

  try {
    console.log('[每日鸿蒙Star] 正在加载 GitCode 鸿蒙实践中心官方组织...');
    await page.goto('https://gitcode.com/harmony-practice-center', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const repos = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="/harmony-practice-center/"]'));
      const names = new Set();
      links.forEach(a => {
        const parts = a.getAttribute('href').split('/').filter(Boolean);
        if (parts.length === 2) {
          names.add(parts[1]);
        }
      });
      return Array.from(names);
    });

    console.log(`[每日鸿蒙Star] 发现案例仓库: ${repos.join(', ')}`);

    let starredRepo = null;
    for (const repo of repos) {
      await page.goto(`https://gitcode.com/harmony-practice-center/${repo}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2500);

      const target = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('.status-btn.is-no-wrapper'));
        for (const el of all) {
          const r = el.getBoundingClientRect();
          if (r.width > 20 && r.height > 20 && el.innerText.includes('Star')) {
            return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: el.innerText.trim(), isStarred: el.innerText.includes('Starred') };
          }
        }
        return null;
      });

      if (target && !target.isStarred) {
        console.log(`[每日鸿蒙Star] 找到未Star项目: ${repo}，正在点击 Star...`);
        await page.mouse.click(target.x, target.y);
        await page.waitForTimeout(3000);
        console.log(`[每日鸿蒙Star] 项目 ${repo} 点赞成功 (+30 积分)!`);
        starredRepo = repo;
        break;
      }
    }

    if (!starredRepo) {
      console.log('[每日鸿蒙Star] 所有实践中心仓库均已被 Star。');
    }
    return true;
  } finally {
    if (!page.isClosed()) await page.close();
  }
}

if (require.main === module) {
  runHarmonyStar().then(() => process.exit(0)).catch(e => {
    console.error('[每日鸿蒙Star] 执行异常:', e);
    process.exit(1);
  });
}

module.exports = { runHarmonyStar };
