# 06 - 查看歷史記錄

## 基本歷史查看

### 查看完整歷史
```bash
git log
```

典型輸出：
```
commit a1b2c3d4e5f6789... (HEAD -> main)
Author: 張小明 <ming@example.com>
Date:   Wed Oct 25 15:30:25 2023 +0800

    新增 greet 函數到 app.js

commit b2c3d4e5f6789a1b...
Author: 張小明 <ming@example.com>
Date:   Wed Oct 25 15:25:10 2023 +0800

    更新 README，新增學習筆記
```

### 簡化版歷史
```bash
git log --oneline
```

輸出：
```
a1b2c3d 新增 greet 函數到 app.js
b2c3d4e 更新 README，新增學習筆記
c3d4e5f 新增 README 檔案
```

## 進階歷史查看選項

### 限制顯示數量
```bash
git log -3                    # 只顯示最近 3 次提交
git log --oneline -5          # 簡化格式顯示最近 5 次
```

### 按時間篩選
```bash
git log --since="2023-10-01"        # 從某日期開始
git log --until="2023-10-31"        # 到某日期為止
git log --since="2 weeks ago"       # 最近兩週
git log --since="3 days ago"        # 最近三天
```

### 按作者篩選
```bash
git log --author="張小明"            # 特定作者的提交
git log --author="ming@example.com" # 用email篩選
```

### 按檔案篩選
```bash
git log README.md                   # 只看特定檔案的修改歷史
git log --follow README.md          # 追蹤檔案重命名
```

### 圖形化顯示
```bash
git log --graph --oneline           # 顯示分支圖
git log --graph --all               # 顯示所有分支
```

## 查看具體變更

### 查看特定提交的內容
```bash
git show a1b2c3d                    # 用提交 ID
git show HEAD                       # 最新提交
git show HEAD~1                     # 上一次提交
git show HEAD~2                     # 上上次提交
```

### 比較不同版本
```bash
git diff HEAD~1 HEAD                # 比較最新和上一次
git diff a1b2c3d b2c3d4e            # 比較兩個特定提交
git diff HEAD~3..HEAD               # 比較最近4次提交的總變化
```

### 查看檔案在特定版本的內容
```bash
git show HEAD~2:README.md           # 看兩次提交前的 README.md
git show a1b2c3d:app.js             # 看特定提交時的 app.js
```

## 實用的歷史格式

### 自訂顯示格式
```bash
git log --pretty=format:"%h - %an, %ar : %s"
```

輸出：
```
a1b2c3d - 張小明, 2 hours ago : 新增 greet 函數到 app.js
b2c3d4e - 張小明, 3 hours ago : 更新 README，新增學習筆記
```

### 常用格式選項
- `%h`：簡短的提交 hash
- `%H`：完整的提交 hash
- `%an`：作者名稱
- `%ae`：作者 email
- `%ad`：作者日期
- `%ar`：相對時間（如 "2 hours ago"）
- `%s`：提交訊息標題

### 預設美化格式
```bash
git log --pretty=oneline --abbrev-commit --graph
```

## 搜尋歷史

### 搜尋提交訊息
```bash
git log --grep="修正"                # 搜尋包含「修正」的提交
git log --grep="bug" --grep="fix"   # 搜尋包含 bug 或 fix 的提交
```

### 搜尋程式碼變更
```bash
git log -S "function greet"         # 搜尋增加或刪除特定字串的提交
git log -G "console.log"            # 用正規表達式搜尋
```

### 搜尋檔案變更
```bash
git log --name-only                 # 顯示每次提交修改了哪些檔案
git log --stat                      # 顯示每次提交的統計資訊
```

## 實際操作練習

### 1. 建立測試歷史
讓我們先建立一些提交來練習：

```bash
# 建立和修改一些檔案
echo "# 專案說明" > project.md
git add project.md
git commit -m "新增專案說明文件"

echo "版本: 1.0.0" >> project.md
git add project.md
git commit -m "更新專案版本資訊"

echo "// 主要應用程式" > main.js
git add main.js
git commit -m "新增主程式檔案"

echo "console.log('應用程式啟動');" >> main.js
git add main.js
git commit -m "新增啟動訊息"
```

### 2. 練習各種查看方式
```bash
# 查看完整歷史
git log

# 查看簡化歷史
git log --oneline

# 查看最近 2 次提交
git log -2

# 查看圖形化歷史
git log --graph --oneline

# 查看特定檔案的歷史
git log project.md

# 查看最新提交的詳細內容
git show HEAD

# 比較倒數第二次和最新的提交
git diff HEAD~1 HEAD
```

### 3. 搜尋練習
```bash
# 搜尋包含「新增」的提交
git log --grep="新增"

# 搜尋修改了 main.js 的提交
git log main.js

# 查看統計資訊
git log --stat --oneline
```

## 解讀提交資訊

### 提交 ID (Hash)
- 每個提交都有唯一的 40 字元識別碼
- 通常只需要前 7-8 字元就能識別
- 可以用這個 ID 來參考特定的提交

### HEAD 指標
- `HEAD`：目前所在的提交
- `HEAD~1` 或 `HEAD^`：上一次提交
- `HEAD~2`：上兩次提交
- `HEAD~n`：上 n 次提交

### 分支資訊
- `(HEAD -> main)`：目前在 main 分支的最新提交
- `(origin/main)`：遠端倉庫的 main 分支位置

## 常見使用情境

### 查找特定功能何時加入
```bash
git log --grep="登入功能" --oneline
```

### 查看某個檔案的完整修改歷史
```bash
git log -p README.md              # 顯示每次修改的詳細內容
```

### 找出誰修改了特定行
```bash
git blame README.md               # 顯示每一行是誰修改的
```

### 查看兩個版本之間的所有變更
```bash
git log --oneline HEAD~5..HEAD   # 查看最近 5 次提交
```

## 實用提示

1. **使用方向鍵**：在 `git log` 中可以用上下鍵瀏覽，按 `q` 退出
2. **複製提交 ID**：可以複製貼上前幾個字元，不需要完整的 hash
3. **別名設定**：為常用命令設定別名
   ```bash
   git config --global alias.lg "log --oneline --graph --all"
   ```

---

**上一章：[追蹤和提交變更](tracking-commits.md)**  
**下一章：[分支的概念](../03-branching/branch-concepts.md)**