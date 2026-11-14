# 自动化防切屏与 CDP 无感交互设计规范

## 1. 考试防作弊机制背景
华为云微认证在线理论考试具备严格的防切屏监考机制：
- 页面监听 `visibilitychange`、`window.blur` 等事件。
- 单场考试切屏超过 3 次将直接强制交卷并判定为不合格。

## 2. 核心架构解法：纯 DOM 级别的 CDP 注入
本方案完全摒弃传统的物理键鼠切屏或弹窗机制，采用 Google Chrome 原生 **Chrome DevTools Protocol (CDP)**：
1. **守护模式启动**：Chrome 以后台独立实例启动，暴露 `--remote-debugging-port=9222`。
2. **免切屏评估**：通过 `playwright-core` 建立 WebSocket 连接，直接向考试页面执行 DOM 级别的 `evaluate` 脚本。
3. **零焦点变动**：所有选项选择与点击均在 DOM 内存中触发，完全不触发操作系统级的窗口失焦或 Tab 切换，实现 100% 监考无感与合规。
