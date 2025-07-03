# 05 - 追蹤和提交變更

## 理解 Git 的三個區域

```
工作區        暫存區        版本庫
(Working)  →  (Staging)  →  (Repository)
編輯檔案      準備提交      永久保存
```

## 檔案的生命週期

### 檔案狀態
1. **未追蹤 (Untracked)**：新建立的檔案，Git 還不認識
2. **已追蹤 (Tracked)**：
   - **未修改 (Unmodified)**：檔案沒有變化
   - **已修改 (Modified)**：檔案有變化，但還沒加入暫存區
   - **已暫存 (Staged)**：檔案已加入暫存區，準備提交

## 實際操作示範

### 準備工作
確保你在上一章建立的專案目錄中：
```bash
cd my-first-project
```

### 1. 修改現有檔案

編輯 README.md，加入新內容：
```markdown
# 我的第一個專案

這是我學習 Git 的第一個專案。

## 專案目標
- 學會基本的 Git 操作
- 理解版本控制的概念
- 練習檔案追蹤和提交

## 學習筆記
今天學了 Git 的基本概念，覺得很有趣！
```

### 2. 檢查狀態
```bash
git status
```

輸出：
```
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   README.md

no changes added to commit (use "git add" to stage files)
```

### 3. 查看具體變更
```bash
git diff
```

會顯示檔案的具體變更：
```diff
diff --git a/README.md b/README.md
index 1234567..abcdefg 100644
--- a/README.md
+++ b/README.md
@@ -4,3 +4,8 @@ 這是我學習 Git 的第一個專案。
 ## 專案目標
 - 學會基本的 Git 操作
 - 理解版本控制的概念
+- 練習檔案追蹤和提交
+
+## 學習筆記
+今天學了 Git 的基本概念，覺得很有趣！
```

符號說明：
- `+` 表示新增的行
- `-` 表示刪除的行
- 沒有符號表示沒有變更的行

### 4. 分階段提交

**加入部分變更到暫存區**
```bash
git add README.md
```

**檢查暫存區狀態**
```bash
git status
```

現在會看到：
```
On branch main
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	modified:   README.md
```

**查看暫存區的變更**
```bash
git diff --staged
```

### 5. 提交變更
```bash
git commit -m "更新 README，新增學習筆記"
```

## 多個檔案的管理

### 建立多個檔案
```bash
echo "console.log('Hello, World!');" > app.js
echo "body { font-family: Arial; }" > style.css
mkdir docs
echo "# 開發筆記" > docs/notes.md
```

### 選擇性加入檔案
```bash
git add app.js style.css    # 只加入特定檔案
git status
```

### 批次加入檔案
```bash
git add .                   # 加入所有變更
git add *.js               # 加入所有 .js 檔案
git add docs/              # 加入整個資料夾
```

### 提交多個檔案
```bash
git commit -m "新增基本的 HTML/CSS/JS 檔案和文件"
```

## 實用的暫存區技巧

### 移除暫存區的檔案
```bash
git reset HEAD filename    # 從暫存區移除，但保留修改
```

### 捨棄工作區的修改
```bash
git checkout -- filename  # 恢復到最後一次提交的狀態
```

### 一次完成加入和提交
```bash
git commit -am "提交訊息"  # 只對已追蹤的檔案有效
```

## 寫好提交訊息

### 好的提交訊息
- **新增註冊功能的基本表單**
- **修正使用者登入時的密碼驗證錯誤**
- **更新 README 文件，新增安裝說明**

### 不好的提交訊息
- **修改**
- **update**
- **一些變更**
- **修正 bug**

### 提交訊息規範
```
類型: 簡短描述

詳細說明（可選）
```

常見類型：
- **新增 (Add)**：新功能或檔案
- **修正 (Fix)**：錯誤修復
- **更新 (Update)**：現有功能改進
- **刪除 (Remove)**：移除檔案或功能

## 實作練習

1. 修改 app.js，加入一個函數
2. 建立一個新檔案 config.json
3. 使用 `git status` 和 `git diff` 檢查變更
4. 分別提交這兩個變更（兩次提交）
5. 查看提交歷史

### 參考解答
```bash
# 1. 修改 app.js
echo "function greet(name) { return 'Hello, ' + name; }" >> app.js

# 2. 建立 config.json
echo '{"app": "my-first-project", "version": "1.0.0"}' > config.json

# 3. 檢查變更
git status
git diff

# 4. 分別提交
git add app.js
git commit -m "新增 greet 函數到 app.js"

git add config.json
git commit -m "新增專案設定檔 config.json"

# 5. 查看歷史
git log --oneline
```

## 常見問題解答

### Q: 什麼時候應該提交？
A: 每完成一個小功能或修正一個問題就提交一次。提交要有意義，但不要太大。

### Q: 提交後發現訊息寫錯了怎麼辦？
A: 可以用 `git commit --amend -m "新的訊息"` 修改最後一次提交的訊息。

### Q: 加入暫存區後又修改了檔案會怎樣？
A: 檔案會同時存在於暫存區（舊版本）和工作區（新版本），需要再次 `git add`。

---

**上一章：[建立你的第一個專案](first-project.md)**  
**下一章：[查看歷史記錄](viewing-history.md)**