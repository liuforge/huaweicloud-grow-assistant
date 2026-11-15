const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');

const BLOG_TEMPLATES = [
  {
    title: '基于华为云分布式消息DMS与事件网格EG构建百万级金融事务解耦与流批一体架构',
    tags: '分布式消息服务 DMS,事件网格 EG',
    content: `<h2>前言</h2>
<p>在分布式金融核心与高频交易系统中，各微服务之间往往面临强依赖同步阻塞、流量洪峰冲击下游持久层、以及分布式事务最终一致性难以保证等严峻挑战。华为云分布式消息服务 DMS 与事件网格 EventGrid（EG）为企业级架构提供了极低时延、海量吞吐与高可靠的异步通信中枢。本文结合金融级业务实践，深度解析基于 DMS 与 EG 构建高吞吐、零丢失、无侵入事务解耦架构的实战演进路径。</p>
<hr />
<h2>一、分布式事务最终一致性与消息防重防丢设计</h2>
<p>在资金转账、订单交易与结算对账等核心场景中，任何消息的丢失或重复消费都会直接导致账实不符。基于 DMS RocketMQ 版可实现严格的事务闭环：</p>
<ul>
<li><strong>两阶段半消息（Half Message）机制</strong>：业务生产者首先发送 Half 消息，DMS 确认暂存后本地执行数据库核心事务；若本地事务提交成功，则向 DMS 发送 Commit 确认；若发生宕机，DMS 自动发起回查仲裁。</li>
<li><strong>双链路死信队列（DLQ）与幂等防重保障</strong>：消费端利用 Redis/DCS 全局流水号生成分布式去重表，保障主交易链路零阻塞。</li>
<li><strong>多副本跨 AZ 同步落盘</strong>：配置 3 副本跨可用区分离部署与强制刷盘策略，确保单机房故障情况下 RPO = 0。</li>
</ul>
<hr />
<h2>二、事件网格 EG 驱动的无侵入事件路由与流批一体</h2>
<ol>
<li><strong>Serverless 事件总线解耦</strong>：借助华为云 EventGrid，将底层业务系统的微服务消息自动标准化为 CloudEvents 格式，无损分流推送到 OBS 与 FunctionGraph。</li>
<li><strong>弹性削峰与背压机制</strong>：在大促和开市早盘瞬时数十倍流量涌入时，DMS 充当系统级减震器，下游消费集群自主调节拉取批次。</li>
</ol>
<hr />
<h2>三、总结</h2>
<p>通过“DMS 事务可靠消息通道 + EventGrid 事件总线标准路由 + FunctionGraph 弹性事件计算”，实现了从传统紧耦合向完全事件驱动型云原生架构的演进。</p>`
  }
];

async function runBlogPublisher() {
  const { context } = await getBrowserContext();
  const page = await context.newPage();

  try {
    console.log('[每日博客] 正在打开华为云开发者博客发布页面...');
    await page.goto('https://bbs.huaweicloud.com/blogs/article', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    const tpl = BLOG_TEMPLATES[0];
    console.log(`[每日博客] 正在填写博文: 《${tpl.title}》...`);

    const titleInput = page.locator('#blogTitle, #title, input[placeholder*="标题"]').first();
    await titleInput.fill(tpl.title);
    await titleInput.dispatchEvent('input');
    await titleInput.dispatchEvent('change');

    await page.evaluate(html => {
      if (window.tinymce && window.tinymce.activeEditor) {
        window.tinymce.activeEditor.setContent(html);
        window.tinymce.activeEditor.fire('change');
        window.tinymce.activeEditor.fire('input');
        window.tinymce.activeEditor.fire('keyup');
      }
    }, tpl.content);

    await page.waitForTimeout(2000);

    await page.evaluate(tags => {
      if (window.$ && $('#blogLable').length) {
        $('#blogLable').val(tags);
      }
      if (window.$ && $('#agreementBox').length && !$('#agreementBox').hasClass('checked')) {
        $('#agreementBox').click();
      }
      if (window.$) {
        $('.write-blog-publish-btn').removeClass('write-blog-publish-btn-no');
      }
    }, tpl.tags);

    await page.waitForTimeout(1000);

    console.log('[每日博客] 点击提交发布...');
    await page.evaluate(() => {
      if (window.newBlogSubmit) {
        window.newBlogSubmit();
      } else if (window.$) {
        $('#submit-btn').click();
      }
    });

    await page.waitForTimeout(5000);
    console.log(`[每日博客] 发布完成，当前页面: ${page.url()} (+60 积分)!`);
    return true;
  } finally {
    if (!page.isClosed()) await page.close();
  }
}

if (require.main === module) {
  runBlogPublisher().then(() => process.exit(0)).catch(e => {
    console.error('[每日博客] 执行异常:', e);
    process.exit(1);
  });
}

module.exports = { runBlogPublisher };
