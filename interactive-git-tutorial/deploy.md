# 部署指南

## 🚀 部署方案選擇

### 1. GitHub Pages (建議)
**最簡單的部署方式**

#### 步驟：
1. 將專案推送到 GitHub 儲存庫
2. 在 GitHub 儲存庫設定中啟用 Pages
3. 選擇 `main` 分支作為來源
4. 將發布目錄設定為 `interactive-git-tutorial`

#### 自動部署：
- 已包含 GitHub Actions 配置 (`.github/workflows/deploy.yml`)
- 推送到 main 分支即自動部署

#### 存取網址：
```
https://[你的用戶名].github.io/[儲存庫名稱]/
```

### 2. Netlify
**功能豐富的免費選項**

#### 步驟：
1. 連接 GitHub 儲存庫
2. 設定建置目錄為 `interactive-git-tutorial`
3. 發布目錄設定為 `.`
4. 自動部署已配置 (`netlify.toml`)

#### 特色：
- 自動 HTTPS
- 表單處理
- 分支預覽
- 自訂域名

### 3. Vercel
**高效能 CDN**

#### 步驟：
1. 連接 GitHub 儲存庫
2. 導入專案時選擇 `interactive-git-tutorial` 目錄
3. 使用預設設定部署
4. 配置已準備 (`vercel.json`)

#### 特色：
- 邊緣快取
- 全球 CDN
- 即時預覽

### 4. Cloudflare Pages
**無限頻寬**

#### 步驟：
1. 連接 GitHub 儲存庫
2. 設定建置目錄為 `interactive-git-tutorial`
3. 建置命令留空（純靜態）
4. 輸出目錄設定為 `.`

## 🛠️ 部署前檢查

### 檔案結構確認：
```
interactive-git-tutorial/
├── index.html       # 主頁面
├── script.js        # 主要邏輯
├── styles.css       # 樣式檔案
├── README.md        # 專案說明
├── netlify.toml     # Netlify 配置
├── vercel.json      # Vercel 配置
└── deploy.md        # 部署指南
```

### 相對路徑檢查：
所有資源都使用相對路徑，適合靜態部署：
- CSS: `href="styles.css"`
- JavaScript: `src="script.js"`
- 字體: CDN 載入

## 🎯 建議部署流程

### 快速部署（GitHub Pages）：
```bash
# 1. 確保在正確目錄
cd /Users/nickhuang/workspace/git-tutorial

# 2. 檢查狀態
git status

# 3. 添加新檔案
git add .

# 4. 提交變更
git commit -m "feat: 新增部署配置檔案"

# 5. 推送到 GitHub
git push origin main

# 6. 在 GitHub 設定頁面啟用 Pages
```

### 域名設定（選擇性）：
- 新增 `CNAME` 檔案包含自訂域名
- 在 DNS 設定中添加 CNAME 記錄指向 GitHub Pages

## 🔧 SEO 優化建議

### 1. 添加 meta 標籤
```html
<meta name="description" content="Git 互動式學習平台 - 透過動畫和實際操作輕鬆學習版本控制">
<meta name="keywords" content="Git, 版本控制, 教學, 互動式學習">
<meta name="author" content="Git Tutorial">
```

### 2. 添加 Open Graph 標籤
```html
<meta property="og:title" content="Git 互動式學習平台">
<meta property="og:description" content="透過動畫和實際操作輕鬆學習版本控制">
<meta property="og:type" content="website">
```

### 3. 建立 robots.txt
```
User-agent: *
Allow: /
Sitemap: https://[你的域名]/sitemap.xml
```

## 📊 效能優化

### 1. 圖片優化
- 使用適當的圖片格式（WebP, AVIF）
- 實施延遲載入

### 2. 快取策略
- 設定適當的 Cache-Control 標頭
- 使用 CDN 加速靜態資源

### 3. 壓縮
- 啟用 Gzip/Brotli 壓縮
- 縮小 CSS/JS 檔案

## 🎉 部署完成後

### 測試項目：
- [ ] 所有課程頁面正常載入
- [ ] 互動功能正常運作
- [ ] 終端機模擬器工作正常
- [ ] 分支視覺化顯示正確
- [ ] 響應式設計在各裝置上正常
- [ ] 所有外部資源（字體、圖示）載入正常

### 持續維護：
- 定期檢查外部 CDN 連結
- 監控網站效能
- 收集使用者回饋
- 更新教學內容

選擇最適合你的部署方案，開始分享你的 Git 學習平台！