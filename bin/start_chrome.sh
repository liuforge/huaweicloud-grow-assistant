#!/usr/bin/env bash
# 启动具备远程 CDP 调试端口的 Chrome 自动化实例 (macOS)

PORT=${1:-9222}
USER_DATA_DIR="$HOME/Library/Application Support/Google/Chrome-Automation"

echo "正在启动 Chrome 调试实例 (端口: $PORT)..."
mkdir -p "$USER_DATA_DIR"

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$USER_DATA_DIR" \
  --no-first-run \
  --no-default-browser-check \
  "https://developer.huaweicloud.com/grow" > /dev/null 2>&1 &

sleep 2
echo "Chrome 实例已在后台就绪！可运行 npm run status 检查连接。"
