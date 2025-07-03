# 03 - 安裝和設定

## 安裝 Git

### Windows
1. 前往 [git-scm.com](https://git-scm.com/download/win)
2. 下載並執行安裝程式
3. 安裝過程中保持預設設定即可
4. 完成後會有 Git Bash 可以使用

### macOS
**方法一：使用 Homebrew（推薦）**
```bash
brew install git
```

**方法二：從官網下載**
1. 前往 [git-scm.com](https://git-scm.com/download/mac)
2. 下載並安裝

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
```

## 驗證安裝

開啟終端機/命令提示字元，輸入：
```bash
git --version
```

如果顯示版本號碼，表示安裝成功。

## 基本設定

安裝完成後，需要設定你的身份識別：

### 設定使用者名稱
```bash
git config --global user.name "你的姓名"
```

### 設定電子郵件
```bash
git config --global user.email "your.email@example.com"
```

### 設定預設編輯器（可選）
```bash
git config --global core.editor "code --wait"  # 使用 VS Code
```

## 檢查設定

查看目前的設定：
```bash
git config --list
```

查看特定設定：
```bash
git config user.name
git config user.email
```

## 選擇工具

### 終端機 vs 圖形介面

**終端機（推薦學習）**
- 功能完整
- 學會後適用所有環境
- 理解 Git 運作原理

**圖形介面工具**
- GitHub Desktop
- SourceTree
- VS Code 內建 Git 功能

### 文字編輯器推薦

- **VS Code**：功能強大，有很多 Git 相關擴充功能
- **Sublime Text**：輕量快速
- **Atom**：GitHub 開發的編輯器

## 設定別名（可選但實用）

為常用指令設定簡短別名：

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

設定後可以用 `git st` 代替 `git status`。

## 常見問題

### Q: 為什麼需要設定 user.name 和 user.email？
A: 每次提交都會記錄是誰做的修改，這些資訊用於識別作者。

### Q: --global 參數是什麼意思？
A: 表示這個設定適用於這台電腦上的所有 Git 專案。如果不加 --global，設定只適用於目前的專案。

### Q: 忘記設定會怎樣？
A: Git 會在你第一次提交時提醒你設定身份資訊。

## 檢查清單

安裝完成後確認以下項目：

- [ ] Git 已安裝（`git --version` 有顯示版本）
- [ ] 已設定 user.name
- [ ] 已設定 user.email
- [ ] 選好了編輯器和終端機工具
- [ ] 理解終端機的基本操作

## 下一步

現在你已經準備好開始使用 Git 了！讓我們來建立第一個專案。

---

**上一章：[Git 基本概念](git-concepts.md)**  
**下一章：[建立你的第一個專案](../02-basic-operations/first-project.md)**