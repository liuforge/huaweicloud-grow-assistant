const { chromium } = require('playwright-core');
const config = require('../../config/default.json');

async function getBrowserContext(cdpUrl = config.cdpUrl) {
  const browser = await chromium.connectOverCDP(cdpUrl);
  const context = browser.contexts()[0];
  return { browser, context };
}

async function findPageByUrl(context, urlSubstr) {
  const pages = context.pages();
  return pages.find(p => p.url().includes(urlSubstr)) || null;
}

async function getOrCreatePage(context, targetUrl) {
  const existing = context.pages().find(p => p.url().includes(targetUrl));
  if (existing) {
    return existing;
  }
  const page = await context.newPage();
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  return page;
}

module.exports = {
  getBrowserContext,
  findPageByUrl,
  getOrCreatePage
};
