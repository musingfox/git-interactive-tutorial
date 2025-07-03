# 13 - 常見問題解決

## 初學者最常遇到的問題

### 1. 忘記設定身份資訊

**錯誤訊息：**
```
Please tell me who you are.

Run
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
```

**解決方法：**
```bash
git config --global user.name "你的姓名"
git config --global user.email "your.email@example.com"
```

**預防方法：**
每次安裝 Git 後立即設定身份資訊。

### 2. 提交時沒有加入暫存區

**錯誤訊息：**
```
nothing to commit, working tree clean
```

**原因：** 修改了檔案但忘記用 `git add`

**解決方法：**
```bash
git status                    # 檢查哪些檔案被修改
git add 檔案名稱              # 加入特定檔案
# 或
git add .                     # 加入所有修改
git commit -m "提交訊息"
```

### 3. 想要撤銷剛才的操作

#### 撤銷 git add（從暫存區移除）
```bash
git reset HEAD 檔案名稱       # 移除特定檔案
git reset HEAD                # 移除所有暫存的檔案
```

#### 撤銷工作區的修改
```bash
git checkout -- 檔案名稱      # 恢復特定檔案到最後提交狀態
git checkout .                # 恢復所有檔案
```

#### 撤銷最後一次提交
```bash
git reset --soft HEAD~1       # 保留檔案修改，只撤銷提交
git reset --hard HEAD~1       # 完全撤銷，包括檔案修改
```

### 4. 提交訊息寫錯了

**修改最後一次提交的訊息：**
```bash
git commit --amend -m "正確的提交訊息"
```

**注意：** 只能修改最後一次提交，且如果已經推送到遠端，需要強制推送。

### 5. 誤刪檔案要怎麼恢復

#### 如果還沒提交刪除
```bash
git checkout HEAD -- 檔案名稱  # 恢復特定檔案
git checkout HEAD .            # 恢復所有刪除的檔案
```

#### 如果已經提交刪除
```bash
git log --oneline              # 找到刪除前的提交
git checkout 提交ID -- 檔案名稱  # 恢復特定版本的檔案
```

### 6. 不小心進入了 vim 編輯器

當你運行 `git commit` 沒有加 `-m` 參數時，可能會進入 vim 編輯器：

**如何退出：**
1. 按 `Esc` 鍵確保在命令模式
2. 輸入 `:q!` 然後按 Enter（強制退出不儲存）
3. 或輸入 `:wq` 然後按 Enter（儲存並退出）

**如果要寫提交訊息：**
1. 按 `i` 進入插入模式
2. 輸入提交訊息
3. 按 `Esc` 回到命令模式
4. 輸入 `:wq` 儲存並退出

**預防方法：**
```bash
git config --global core.editor "code --wait"  # 設定 VS Code 為編輯器
```

## 分支相關問題

### 7. 不知道現在在哪個分支

```bash
git branch                     # 查看所有分支，* 表示目前分支
git status                     # 也會顯示目前分支
```

### 8. 切換分支時有未提交的修改

**錯誤訊息：**
```
error: Your local changes to the following files would be overwritten by checkout:
        filename
Please commit your changes or stash them before you switch branches.
```

**解決方法1：提交修改**
```bash
git add .
git commit -m "儲存進度"
git checkout 其他分支
```

**解決方法2：暫存修改**
```bash
git stash                      # 暫存目前修改
git checkout 其他分支
# 工作完後回來
git checkout 原分支
git stash pop                  # 恢復暫存的修改
```

### 9. 分支合併出現衝突

**衝突訊息：**
```
CONFLICT (content): Merge conflict in filename
Automatic merge failed; fix conflicts and then commit the result.
```

**解決步驟：**
1. 用編輯器打開衝突檔案
2. 尋找衝突標記：
   ```
   <<<<<<< HEAD
   目前分支的內容
   =======
   要合併的分支內容
   >>>>>>> branch-name
   ```
3. 手動編輯，保留想要的內容
4. 刪除衝突標記
5. 加入解決後的檔案：`git add 檔案名稱`
6. 完成合併：`git commit`

## 遠端倉庫問題

### 10. 推送被拒絕

**錯誤訊息：**
```
! [rejected] main -> main (fetch first)
error: failed to push some refs to 'repository-url'
```

**原因：** 遠端有新的提交，需要先拉取

**解決方法：**
```bash
git pull origin main           # 先拉取遠端更新
git push origin main           # 再推送
```

### 11. 忘記遠端倉庫的網址

```bash
git remote -v                  # 查看所有遠端倉庫
git remote show origin         # 查看 origin 的詳細資訊
```

### 12. 想要清理本地分支

```bash
git branch                     # 查看本地分支
git branch -d 分支名稱         # 刪除已合併的分支
git branch -D 分支名稱         # 強制刪除分支
git remote prune origin        # 清理已刪除的遠端分支參考
```

## 檔案相關問題

### 13. 某個檔案總是被 Git 追蹤但不想要

**建立 .gitignore 檔案：**
```bash
echo "filename" >> .gitignore
git add .gitignore
git commit -m "忽略不需要的檔案"
```

**如果檔案已經被追蹤：**
```bash
git rm --cached filename       # 從 Git 移除但保留在工作區
echo "filename" >> .gitignore
git add .gitignore
git commit -m "停止追蹤檔案並加入 gitignore"
```

### 14. 想要看某個檔案是誰修改的

```bash
git blame filename             # 查看每一行的修改者
git log -p filename            # 查看檔案的完整修改歷史
```

## 效能和清理問題

### 15. 倉庫變得很大

```bash
git gc                         # 垃圾回收，清理不需要的物件
git count-objects -vH          # 查看倉庫大小統計
```

### 16. 想要完全重來

**重置到特定提交：**
```bash
git reset --hard 提交ID        # 危險！會丟失所有後續修改
```

**重置到遠端狀態：**
```bash
git fetch origin
git reset --hard origin/main   # 完全同步遠端狀態
```

## 預防問題的好習慣

### 1. 經常檢查狀態
```bash
git status                     # 養成隨時檢查的習慣
```

### 2. 小步提交
- 每完成一個小功能就提交
- 提交訊息要清楚描述做了什麼

### 3. 推送前先拉取
```bash
git pull                       # 推送前先更新
git push
```

### 4. 備份重要分支
```bash
git branch backup-main         # 重要操作前先備份
```

### 5. 使用 .gitignore
預先設定不要追蹤的檔案類型

## 求助資源

### 內建幫助
```bash
git help                       # 查看幫助
git help add                   # 查看特定指令的幫助
```

### 查看配置
```bash
git config --list              # 查看所有配置
```

### 檢查倉庫狀態
```bash
git status
git log --oneline -5
git branch -a
```

## 記住：不要害怕出錯

- Git 的設計很難真正丟失資料  
- 大部分操作都可以撤銷
- 實驗和練習是學習的最好方法
- 遇到問題時，先用 `git status` 了解目前狀況

---

**上一章：[團隊協作流程](../04-remote/collaboration.md)**  
**下一章：[實用指令速查](command-reference.md)**