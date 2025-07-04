#!/bin/bash

# GitHub Pages 部署腳本
echo "🚀 開始建立 GitHub 儲存庫和部署..."

# 1. 建立 GitHub 儲存庫
echo "📦 建立 GitHub 儲存庫..."
gh repo create git-interactive-tutorial --public --description "Git 互動式學習平台 - 透過動畫和實際操作輕鬆學習版本控制" --clone=false

# 2. 連接遠端儲存庫
echo "🔗 連接遠端儲存庫..."
git remote add origin https://github.com/$(gh api user --jq .login)/git-interactive-tutorial.git

# 3. 重新命名分支為 main (GitHub Pages 建議)
echo "🔄 重新命名分支..."
git branch -M main

# 4. 推送到 GitHub
echo "📤 推送代碼到 GitHub..."
git push -u origin main

# 5. 啟用 GitHub Pages
echo "🌐 啟用 GitHub Pages..."
gh repo edit --enable-pages --pages-source-branch main --pages-source-path ./interactive-git-tutorial

echo "✅ 部署完成！"
echo "📍 網站網址：https://$(gh api user --jq .login).github.io/git-interactive-tutorial/"
echo "📍 儲存庫網址：https://github.com/$(gh api user --jq .login)/git-interactive-tutorial"