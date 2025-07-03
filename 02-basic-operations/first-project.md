# 04 - 建立你的第一個專案

## 建立新的 Git 專案

### 方法一：從零開始建立

1. **建立專案資料夾**
```bash
mkdir my-first-project
cd my-first-project
```

2. **初始化 Git 倉庫**
```bash
git init
```

你會看到類似這樣的訊息：
```
Initialized empty Git repository in /path/to/my-first-project/.git/
```

### 方法二：複製現有專案

```bash
git clone https://github.com/someone/project.git
cd project
```

## 了解專案結構

初始化後，你會看到：

```
my-first-project/
├── .git/          ← Git 的管理資料夾（隱藏）
└── (你的檔案)
```

**重要：** `.git` 資料夾包含所有版本控制資訊，不要手動修改或刪除它。

## 建立第一個檔案

讓我們建立一個簡單的檔案：

```bash
echo "# 我的第一個專案" > README.md
```

或用編輯器建立一個檔案，內容如下：
```markdown
# 我的第一個專案

這是我學習 Git 的第一個專案。

## 專案目標
- 學會基本的 Git 操作
- 理解版本控制的概念
```

## 檢查專案狀態

```bash
git status
```

你會看到類似輸出：
```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	README.md

nothing added to commit but untracked files present (use "git add" to track)
```

### 狀態說明
- **On branch main**：目前在 main 分支上
- **No commits yet**：還沒有任何提交記錄
- **Untracked files**：有檔案還沒被 Git 追蹤

## 第一次提交

### 1. 將檔案加入暫存區
```bash
git add README.md
```

或加入所有檔案：
```bash
git add .
```

### 2. 檢查狀態
```bash
git status
```

現在會看到：
```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   README.md
```

### 3. 提交變更
```bash
git commit -m "新增 README 檔案"
```

成功後會看到：
```
[main (root-commit) a1b2c3d] 新增 README 檔案
 1 file changed, 6 insertions(+)
 create mode 100644 README.md
```

## 恭喜！

你已經完成了第一次 Git 提交！這個提交包含：
- 一個新檔案 README.md
- 6 行新增的內容
- 提交訊息「新增 README 檔案」
- 一個唯一的識別碼（a1b2c3d...）

## 查看提交歷史

```bash
git log
```

會顯示：
```
commit a1b2c3d4e5f6... (HEAD -> main)
Author: 你的姓名 <your.email@example.com>
Date:   Wed Oct 25 14:30:00 2023 +0800

    新增 README 檔案
```

### 簡化版本的歷史
```bash
git log --oneline
```

## 實作練習

1. 在專案中建立一個新檔案 `hello.txt`，內容寫「Hello, Git!」
2. 使用 `git status` 檢查狀態
3. 將檔案加入暫存區
4. 提交這個變更，訊息為「新增 hello.txt」
5. 使用 `git log` 查看歷史

### 解答
```bash
echo "Hello, Git!" > hello.txt
git status
git add hello.txt
git commit -m "新增 hello.txt"
git log --oneline
```

## 重要概念總結

- `git init`：初始化新的 Git 倉庫
- `git status`：查看目前狀態
- `git add`：將檔案加入暫存區
- `git commit`：提交變更到版本庫
- `git log`：查看提交歷史

## 常見錯誤

### 忘記設定身份
```
Please tell me who you are.
```
**解決方法**：設定 user.name 和 user.email

### 沒有加入暫存區就提交
```
nothing to commit, working tree clean
```
**解決方法**：先用 `git add` 加入檔案

---

**上一章：[安裝和設定](../01-basics/installation-setup.md)**  
**下一章：[追蹤和提交變更](tracking-commits.md)**