# 14 - 實用指令速查

## 基本操作

### 初始化和設定
```bash
git init                                    # 初始化新的 Git 倉庫
git config --global user.name "姓名"       # 設定全局使用者名稱
git config --global user.email "email"     # 設定全局電子郵件
git config --list                          # 查看所有設定
```

### 基本檔案操作
```bash
git status                                  # 查看工作區狀態
git add 檔案名稱                            # 加入特定檔案到暫存區
git add .                                   # 加入所有修改到暫存區
git add *.js                               # 加入所有 .js 檔案
git commit -m "提交訊息"                    # 提交暫存區的變更
git commit -am "提交訊息"                   # 加入並提交已追蹤檔案的修改
```

## 查看資訊

### 歷史記錄
```bash
git log                                     # 查看完整提交歷史
git log --oneline                          # 簡化的單行歷史
git log --graph                            # 圖形化顯示分支
git log --graph --oneline --all            # 顯示所有分支的圖形化歷史
git log -n 5                               # 只顯示最近 5 次提交
git log --since="2023-01-01"               # 查看特定日期後的提交
git log --author="作者名稱"                 # 查看特定作者的提交
```

### 查看變更
```bash
git diff                                    # 查看工作區與暫存區的差異
git diff --staged                          # 查看暫存區與最後提交的差異
git diff HEAD                              # 查看工作區與最後提交的差異
git diff HEAD~1 HEAD                       # 比較兩次提交
git show HEAD                              # 查看最新提交的詳細內容
git show 提交ID                            # 查看特定提交的內容
```

### 檔案資訊
```bash
git blame 檔案名稱                          # 查看檔案每一行的修改者
git log -p 檔案名稱                         # 查看特定檔案的修改歷史
git show HEAD:檔案名稱                      # 查看特定版本的檔案內容
```

## 分支操作

### 基本分支操作
```bash
git branch                                  # 查看本地分支
git branch -a                              # 查看所有分支（包含遠端）
git branch 新分支名稱                       # 建立新分支
git checkout 分支名稱                       # 切換到指定分支
git checkout -b 新分支名稱                  # 建立並切換到新分支
git branch -d 分支名稱                      # 刪除已合併的分支
git branch -D 分支名稱                      # 強制刪除分支
```

### 合併操作
```bash
git merge 分支名稱                          # 合併指定分支到目前分支
git merge --no-ff 分支名稱                  # 強制建立合併提交
git rebase 分支名稱                         # 將目前分支重新定位到指定分支
```

## 遠端操作

### 遠端倉庫管理
```bash
git remote -v                              # 查看遠端倉庫
git remote add origin URL                  # 新增遠端倉庫
git remote remove origin                   # 移除遠端倉庫
git clone URL                              # 複製遠端倉庫到本地
```

### 同步操作
```bash
git fetch                                  # 獲取遠端更新（不合併）
git pull                                   # 獲取並合併遠端更新
git pull origin main                       # 從特定遠端分支拉取
git push                                   # 推送到預設遠端分支
git push origin main                       # 推送到特定遠端分支
git push -u origin 分支名稱                # 首次推送並設定追蹤
git push --force                           # 強制推送（危險）
```

## 撤銷和修復

### 撤銷暫存區
```bash
git reset HEAD 檔案名稱                    # 從暫存區移除特定檔案
git reset HEAD                             # 清空暫存區
```

### 撤銷工作區修改
```bash
git checkout -- 檔案名稱                   # 撤銷特定檔案的修改
git checkout .                             # 撤銷所有檔案的修改
git clean -fd                              # 刪除未追蹤的檔案和目錄
```

### 撤銷提交
```bash
git reset --soft HEAD~1                   # 撤銷提交，保留檔案修改
git reset --mixed HEAD~1                  # 撤銷提交和暫存，保留檔案修改
git reset --hard HEAD~1                   # 完全撤銷提交（危險）
git revert HEAD                            # 建立新提交來撤銷最後提交
```

### 修改提交
```bash
git commit --amend -m "新訊息"             # 修改最後一次提交訊息
git commit --amend --no-edit               # 將暫存區內容加入最後提交
```

## 暫存 (Stash)

### 基本暫存操作
```bash
git stash                                  # 暫存目前修改
git stash save "說明訊息"                   # 暫存並加上說明
git stash list                             # 查看暫存列表
git stash pop                              # 恢復最新暫存並刪除
git stash apply                            # 恢復最新暫存但不刪除
git stash drop                             # 刪除最新暫存
git stash clear                            # 清空所有暫存
```

## 標籤 (Tag)

### 標籤操作
```bash
git tag                                    # 查看所有標籤
git tag v1.0.0                             # 建立輕量標籤
git tag -a v1.0.0 -m "版本 1.0.0"          # 建立註解標籤
git push origin v1.0.0                     # 推送特定標籤
git push origin --tags                     # 推送所有標籤
git tag -d v1.0.0                          # 刪除本地標籤
```

## 檔案管理

### 忽略檔案
```bash
echo "檔案名稱" >> .gitignore              # 加入忽略檔案
git rm --cached 檔案名稱                   # 停止追蹤但保留檔案
git rm 檔案名稱                            # 刪除檔案並停止追蹤
```

### 重命名和移動
```bash
git mv 舊名稱 新名稱                        # 重命名檔案
git mv 檔案 目錄/                          # 移動檔案到目錄
```

## 實用別名設定

```bash
# 設定常用別名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
git config --global alias.lg 'log --oneline --graph --all'
```

## 進階操作

### 搜尋功能
```bash
git log --grep="關鍵字"                    # 搜尋提交訊息
git log -S "程式碼內容"                     # 搜尋程式碼變更
git grep "搜尋內容"                        # 在追蹤檔案中搜尋
```

### 比較和分析
```bash
git diff --name-only                       # 只顯示變更的檔案名稱
git diff --stat                            # 顯示變更統計
git log --stat                             # 顯示每次提交的統計
git shortlog -sn                           # 按作者統計提交數量
```

### 清理和維護
```bash
git gc                                     # 垃圾回收
git fsck                                   # 檢查倉庫完整性
git reflog                                 # 查看操作記錄
git count-objects -vH                      # 查看倉庫統計資訊
```

## 緊急救援指令

### 找回遺失的提交
```bash
git reflog                                 # 查看所有操作記錄
git reset --hard 提交ID                   # 恢復到特定提交
```

### 查看檔案在特定時點的內容
```bash
git show 提交ID:檔案路徑                   # 查看特定版本的檔案
git checkout 提交ID -- 檔案名稱            # 恢復特定版本的檔案
```

## 組合指令範例

### 常用工作流程
```bash
# 開始新功能
git checkout -b feature/new-function
git add .
git commit -m "實作新功能"
git push -u origin feature/new-function

# 完成功能並合併
git checkout main
git pull origin main
git merge feature/new-function
git push origin main
git branch -d feature/new-function
```

### 快速修復
```bash
# 緊急修復
git checkout -b hotfix/critical-bug
# 修復程式碼
git add .
git commit -m "修正關鍵錯誤"
git checkout main
git merge hotfix/critical-bug
git push origin main
git branch -d hotfix/critical-bug
```

## 提示

- 使用 Tab 鍵自動完成分支名稱和檔案名稱
- 大部分指令都可以用 `--help` 查看詳細說明
- 建議先在測試專案練習危險操作
- 重要操作前先備份或建立新分支

---

**上一章：[常見問題解決](common-issues.md)**  
**回到首頁：[README](../README.md)**