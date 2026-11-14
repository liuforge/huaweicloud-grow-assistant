# Huawei Cloud Grow Assistant 🚀

> 华为云开发者成长中心（Grow Center）零成本全自动积分收割、微认证应试辅助与云端实践管家。

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)]()
[![Playwright CDP](https://img.shields.io/badge/automation-Playwright%20CDP-blue.svg)]()
[![Zero-Cost Target](https://img.shields.io/badge/target-5000%20Points%20Voucher-orange.svg)]()

---

## 📌 项目概述

本项目为华为云开发者成长中心量身定制，旨在通过纯零成本（0元）路径快速积累 5000 积分以兑换 500 元无门槛云资源代金券。项目集成了：
- **每日自动化任务循环**：每日签到、鸿蒙案例浏览、GitCode Star、AI DevSpace 体验、社区技术博客发布。
- **周常高额任务调度**：鸿蒙案例云端 CodeArts 编译打包、KooLabs 实验、GitCode Issue/Star、赛事提交。
- **微认证应试辅助**：官方 0 元免费微认证自动批量激活、无感防切屏考试辅助、成绩与发证状态实时追踪。
- **云声改进建议沉淀**：高质量产品优化提案模板库与一键提交。

---

## 📂 目录架构

```text
huaweicloud-grow-assistant/
├── bin/
│   └── start_chrome.sh          # 启动 Chrome CDP 调试实例
├── config/
│   └── default.json             # 端口、各业务中心 URL 及超时配置
├── docs/
│   ├── 01_POINTS_STRATEGY.md    # 5000 积分完整冲刺规划与分值表
│   └── 02_ANTI_CHEAT_GUIDE.md   # CDP 无感防切屏技术规范
├── src/
│   ├── core/
│   │   └── cdp_client.js        # Playwright CDP 核心连接层
│   ├── daily/
│   │   ├── daily_runner.js      # 每日任务总调度入口 (+140分)
│   │   ├── sign_in.js           # 每日签到
│   │   ├── harmony_case.js      # 鸿蒙案例有效停留浏览
│   │   ├── harmony_star.js      # GitCode 鸿蒙仓库自动 Star
│   │   ├── devspace_task.js     # AI DevSpace 智能环境体验
│   │   └── blog_publisher.js    # 社区优质技术博客发布
│   ├── certifications/
│   │   ├── activate_free_certs.js # 0 元微认证批量激活
│   │   └── score_verifier.js    # 考试成绩与证书签发查询
│   ├── yunsheng/
│   │   └── submit_suggestion.js # 云声高价值建议提交 (+60/+200分)
│   └── monitor/
│       ├── grow_status.js       # 实时积分与 15 项任务完成矩阵看板
│       └── bonus_flow.js        # 积分历史流水变动明细
├── package.json
└── README.md
```

---

## 🛠️ 快速开始

### 1. 启动 Chrome 调试实例
执行启动脚本打开 Chrome（仅需首次登录一次华为云账号，后续全自动复用会话）：
```bash
bash bin/start_chrome.sh
```

### 2. 检查成长中心看板
```bash
npm run status
```

### 3. 一键执行每日日常循环 (+140 积分)
```bash
npm run daily
```

### 4. 查验微认证成绩与发证进度
```bash
npm run cert:score
```

---

## 🔒 安全与隐私

- 本项目通过本地端口 `9222` 直接复用系统 Chrome 运行态会话，不抓取、不上传任何密码、Token 或私钥凭据。
- 敏感会话文件均已列入 `.gitignore`，安全可靠。
