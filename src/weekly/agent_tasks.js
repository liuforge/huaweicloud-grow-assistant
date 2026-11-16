const { getBrowserContext } = require('../core/cdp_client');

const AGENT_REPOS = [
  'ai-interview-swarm',
  'OpsSwarm',
  'redbook-operate',
  'Prompt_to_Premiere',
  'okr-cascade',
  'xhs-cross-platform-rewrite',
  'gitcode-issue-triage'
];

/**
 * 自动完成每周 Star Agent 实践中心开源仓库
 */
async function starAgentRepo() {
  const { context } = await getBrowserContext();
  const page = await context.newPage();

  try {
    console.log('[Weekly Agent Star] 开始检查 Agent 实践中心未 Star 仓库...');
    for (const repo of AGENT_REPOS) {
      const url = `https://gitcode.com/agent-best-practices/${repo}`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2500);

      const starState = await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('.status-btn.is-no-wrapper, button, div')).find(el => {
          const t = (el.innerText || '').trim();
          return (t.startsWith('Star\n') || t.startsWith('Starred\n') || t === 'Star' || t === 'Starred');
        });
        return btn ? btn.innerText.replace(/\n+/g, ' ') : 'not found';
      });

      if (starState.startsWith('Star ') || starState === 'Star') {
        console.log(`[Weekly Agent Star] 找到未 Star 仓库: ${repo}，正在点赞...`);
        const starBtn = await page.evaluate(() => {
          const all = Array.from(document.querySelectorAll('.status-btn.is-no-wrapper'));
          for (const el of all) {
            const r = el.getBoundingClientRect();
            const txt = (el.innerText || '').trim();
            if (r.width > 20 && r.height > 20 && txt.startsWith('Star')) {
              return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
            }
          }
          return null;
        });

        if (starBtn) {
          await page.mouse.click(starBtn.x, starBtn.y);
          await page.waitForTimeout(3000);
          console.log(`[Weekly Agent Star] 成功点赞 ${repo} (+50 积分)!`);
          return true;
        }
      }
    }
    console.log('[Weekly Agent Star] 所有指定仓库均已被 Star。');
    return true;
  } catch (e) {
    console.warn('[Weekly Agent Star] 异常:', e.message);
    return false;
  } finally {
    if (!page.isClosed()) await page.close();
  }
}

/**
 * 自动向 Agent 实践中心提交高质量建议 Issue
 */
async function submitAgentIssue(repo = 'redbook-operate', title, content) {
  const { context } = await getBrowserContext();
  const page = await context.newPage();

  try {
    const url = `https://gitcode.com/agent-best-practices/${repo}/issues/new`;
    console.log(`[Weekly Agent Issue] 导航至新建 Issue 页面: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);

    const titleInput = page.locator('input[placeholder*="标题"], input[placeholder*="Title"], input[type="text"]').first();
    if (!await titleInput.isVisible()) {
      console.warn('[Weekly Agent Issue] 未找到标题输入框，请核实登录态。');
      return false;
    }

    const issueTitle = title || '[建议] 优化智能体协同流程中的异常降级重试与状态流转机制';
    await titleInput.fill(issueTitle);
    await page.waitForTimeout(1000);

    const contentInput = page.locator('textarea, .monaco-editor, [contenteditable="true"]').first();
    const issueBody = content || `### 业务场景描述
在体验开源多智能体项目时，各角色 Agent 协同调用底层大模型生成结构化产物，在复杂长链路业务中对异常容错与降级有较高要求。

### 优化建议与方案
1. **多模型降级容错机制（Multi-model Fallback）**：
   - 当主模型接口超时或返回格式异常时，自动熔断降级至备份模型，保证主链路不中断。
2. **状态快照与断点续跑（Checkpointing & Resumption）**：
   - 增加中间执行状态的轻量级缓存，避免单步失败导致全流程重新执行。
3. **结构化 Pydantic 字段级自动校验与纠错**：
   - 提升智能体工具调用的参数鲁棒性。

感谢开源团队的无私贡献！`;

    await contentInput.fill(issueBody);
    await page.waitForTimeout(2000);

    const submitBtn = page.locator('button:has-text("创建 Issue"), button:has-text("新建 Issue"), button:has-text("提交")').first();
    await submitBtn.click();
    await page.waitForTimeout(5000);

    console.log(`[Weekly Agent Issue] 成功提交 Issue，目标链接: ${page.url()} (+60 积分)!`);
    return true;
  } catch (e) {
    console.warn('[Weekly Agent Issue] 异常:', e.message);
    return false;
  } finally {
    if (!page.isClosed()) await page.close();
  }
}

module.exports = { starAgentRepo, submitAgentIssue };
