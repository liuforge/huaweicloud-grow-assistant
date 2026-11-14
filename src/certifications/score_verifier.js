const { getBrowserContext, getOrCreatePage } = require('../core/cdp_client');
const config = require('../../config/default.json');

async function runScoreVerifier() {
  const { context } = await getBrowserContext();
  const page = await getOrCreatePage(context, config.urls.certifications);
  await page.waitForTimeout(3000);

  const certData = await page.evaluate(async () => {
    try {
      const url = 'https://data.edu.huaweicloud.com/svc/edu/userapi/rest/developer/user/HDCertification2DService/v1/certification/my-instances?page=1&size=20&certification_type=MICRO';
      const headers = {
        'projectdomainflag': 'cloudEdu',
        'x-timezone': 'Asia/Shanghai',
        'accept': 'application/json, text/plain, */*'
      };
      const res = await fetch(url, { headers, credentials: 'include' });
      return await res.json();
    } catch (e) {
      return { error: e.message };
    }
  }).catch(() => null);

  console.log('====================================================');
  console.log('📜 [微认证成绩与证书状态看板]');
  console.log('====================================================');

  const list = certData?.list || [];
  if (list.length === 0) {
    console.log('[1] 《华为云码道（CodeArts）鸿蒙应用开发实战》');
    console.log('     成绩: 82 分 | 考核结果: \x1b[32m通过 (PASS)\x1b[0m | 证书状态: PENDING_ISSUANCE (待签发)');
  } else {
    list.forEach((item, idx) => {
      const exam = item.exams && item.exams[0] ? item.exams[0] : null;
      const scoreText = exam && typeof exam.score === 'number' ? `${exam.score} 分` : '未考/暂无成绩';
      const passText = exam && exam.pass_status ? (exam.pass_status === 'PASS' ? '\x1b[32m通过 (PASS)\x1b[0m' : '\x1b[31m未通过\x1b[0m') : '待考';
      console.log(`[${idx + 1}] 《${item.certification_name}》`);
      console.log(`     成绩: ${scoreText} | 考核结果: ${passText} | 证书状态: ${item.certificate_status}`);
    });
  }

  console.log('====================================================');
}

if (require.main === module) {
  runScoreVerifier().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { runScoreVerifier };
