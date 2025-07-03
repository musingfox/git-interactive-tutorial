# 練習2：網站開發專案

## 學習目標
- 理解分支的概念和用途
- 學會建立、切換、合併分支
- 練習處理合併衝突
- 體驗並行開發的工作流程

## 情境說明
你正在開發一個個人網站，需要同時進行多個功能的開發：
- 主頁設計
- 關於我頁面
- 聯絡表單
- 網站樣式優化

使用分支可以讓你：
- 各功能獨立開發，不互相影響
- 隨時切換工作重點
- 功能完成後再整合到主版本

## 練習步驟

### 第1步：建立基礎專案
```bash
mkdir my-website
cd my-website
git init
```

建立基本的 HTML 檔案 `index.html`：
```html
<!DOCTYPE html>
<html>
<head>
    <title>我的個人網站</title>
</head>
<body>
    <h1>歡迎來到我的網站</h1>
    <p>這個網站正在建設中...</p>
</body>
</html>
```

提交基礎版本：
```bash
git add index.html
git commit -m "建立基礎 HTML 結構"
```

### 第2步：建立功能分支
為主頁設計建立分支：
```bash
git branch feature/homepage-design
git checkout feature/homepage-design
# 或者一次完成：git checkout -b feature/homepage-design
```

檢查目前分支：
```bash
git branch
```

### 第3步：在分支上開發
修改 `index.html`，加入更多內容：
```html
<!DOCTYPE html>
<html>
<head>
    <title>我的個人網站</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        .intro { background: #f5f5f5; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>歡迎來到我的網站</h1>
    <div class="intro">
        <h2>關於這個網站</h2>
        <p>這是我的個人網站，用來展示我的學習成果和專案作品。</p>
        <p>目前正在使用 Git 進行版本控制，讓開發更有條理！</p>
    </div>
    
    <h2>導航</h2>
    <ul>
        <li><a href="#about">關於我</a></li>
        <li><a href="#contact">聯絡方式</a></li>
    </ul>
</body>
</html>
```

提交變更：
```bash
git add index.html
git commit -m "完善主頁設計，新增樣式和導航"
```

### 第4步：切換回主分支
```bash
git checkout main
```

查看 `index.html` 的內容，注意它還是原來的基礎版本！

### 第5步：建立另一個功能分支
為關於我頁面建立分支：
```bash
git checkout -b feature/about-page
```

建立 `about.html`：
```html
<!DOCTYPE html>
<html>
<head>
    <title>關於我 - 我的個人網站</title>
</head>
<body>
    <h1>關於我</h1>
    <p>我是一個正在學習程式開發的初學者。</p>
    <p>目前正在學習：</p>
    <ul>
        <li>Git 版本控制</li>
        <li>HTML/CSS</li>
        <li>JavaScript</li>
    </ul>
    <a href="index.html">回到首頁</a>
</body>
</html>
```

同時修改 `index.html`，更新導航連結：
```html
<!-- 把導航部分的連結更新為 -->
<h2>導航</h2>
<ul>
    <li><a href="about.html">關於我</a></li>
    <li><a href="#contact">聯絡方式</a></li>
</ul>
```

提交變更：
```bash
git add .
git commit -m "新增關於我頁面並更新導航連結"
```

### 第6步：合併第一個功能分支
回到主分支並合併主頁設計：
```bash
git checkout main
git merge feature/homepage-design
```

查看歷史：
```bash
git log --oneline --graph
```

### 第7步：嘗試合併第二個分支（會產生衝突）
```bash
git merge feature/about-page
```

你會看到合併衝突的訊息！

### 第8步：解決合併衝突
打開 `index.html`，你會看到類似這樣的衝突標記：
```html
<<<<<<< HEAD
        <li><a href="#about">關於我</a></li>
=======
        <li><a href="about.html">關於我</a></li>
>>>>>>> feature/about-page
```

手動編輯，保留正確的版本：
```html
        <li><a href="about.html">關於我</a></li>
```

完成合併：
```bash
git add index.html
git commit -m "合併關於我頁面功能，解決導航連結衝突"
```

### 第9步：清理分支
刪除已經合併的分支：
```bash
git branch -d feature/homepage-design
git branch -d feature/about-page
```

查看最終結果：
```bash
git log --oneline --graph
git branch
```

## 進階練習

### 練習A：並行開發多個功能
1. 同時建立三個分支：
   - `feature/contact-form`：聯絡表單
   - `feature/navigation-menu`：導航選單改進
   - `feature/footer`：頁尾資訊

2. 在每個分支上各自開發

3. 嘗試不同的合併順序

### 練習B：實驗性分支
1. 建立 `experiment/dark-theme` 分支
2. 嘗試暗色主題設計
3. 如果滿意就合併，不滿意就刪除

### 練習C：緊急修復
1. 在主分支發現一個重要錯誤（比如拼字錯誤）
2. 建立 `hotfix/typo-fix` 分支
3. 快速修復並合併回主分支

## 挑戰練習

### 挑戰1：複雜的合併衝突
1. 建立兩個分支，都修改同一個檔案的同一部分
2. 練習解決複雜的合併衝突
3. 學會使用 `git diff` 理解衝突內容

### 挑戰2：分支重命名
```bash
git branch -m 舊名稱 新名稱    # 重命名分支
```

### 挑戰3：查看分支差異
```bash
git diff main..feature/branch-name    # 比較分支差異
```

## 檢查清單

完成練習後，確認你能夠：
- [ ] 建立新分支 (`git branch` 或 `git checkout -b`)
- [ ] 切換分支 (`git checkout`)
- [ ] 在分支上提交變更
- [ ] 合併分支 (`git merge`)
- [ ] 解決合併衝突
- [ ] 刪除不需要的分支 (`git branch -d`)
- [ ] 查看分支圖 (`git log --graph`)
- [ ] 理解 HEAD 指標的概念

## 常見問題

### Q: 合併後分支還需要保留嗎？
A: 功能分支合併後通常會刪除，保持分支列表乾淨。

### Q: 切換分支時有未提交的修改怎麼辦？
A: 可以先提交、使用 `git stash` 暫存，或者撤銷修改。

### Q: 如何撤銷合併？
A: 如果剛剛合併且還沒有其他提交，可以用 `git reset --hard HEAD~1`

### Q: 分支名稱有建議的格式嗎？
A: 建議使用 `類型/簡短描述` 格式，如 `feature/user-login`、`fix/button-bug`

## 實際應用場景

這個練習模擬了真實的開發情境：
- **功能分支**：開發新功能時不影響主版本
- **並行開發**：多個功能同時進行
- **衝突解決**：團隊協作時的常見情況
- **分支管理**：保持專案結構清晰

---

**上一個練習：[基本操作練習](../exercise-01-basic/README.md)**  
**下一個練習：[協作練習](../exercise-03-collaboration/README.md)**