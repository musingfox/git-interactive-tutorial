// Git 互動學習平台 JavaScript

class GitLearningPlatform {
    constructor() {
        this.currentLesson = 'welcome';
        this.progress = 0;
        this.completedLessons = new Set();
        this.virtualFileSystem = new Map();
        this.gitRepository = {
            commits: [],
            branches: new Map([['main', []]]),
            currentBranch: 'main',
            workingDirectory: new Map(),
            stagingArea: new Map()
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupTerminal();
        this.setupBranchVisualization();
        this.updateProgress();
    }

    setupEventListeners() {
        // 課程導航
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const lesson = e.currentTarget.dataset.lesson;
                this.switchToLesson(lesson);
            });
        });

        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && e.ctrlKey) {
                this.nextLesson();
            } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
                this.previousLesson();
            }
        });
    }

    switchToLesson(lessonId) {
        // 標記前一個課程為完成（除了歡迎頁面）
        if (this.currentLesson && this.currentLesson !== 'welcome' && this.currentLesson !== lessonId) {
            this.completedLessons.add(this.currentLesson);
        }

        // 隱藏所有課程內容
        document.querySelectorAll('.lesson-content').forEach(content => {
            content.classList.remove('active');
        });

        // 更新側邊欄狀態
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.classList.remove('active');
        });

        // 顯示選中的課程
        const targetLesson = document.getElementById(lessonId);
        const targetMenuItem = document.querySelector(`[data-lesson="${lessonId}"]`);
        
        if (targetLesson && targetMenuItem) {
            targetLesson.classList.add('active');
            targetMenuItem.classList.add('active');
            this.currentLesson = lessonId;
            
            // 初始化特定課程的功能
            this.initLessonFeatures(lessonId);
            
            // 更新進度條
            this.updateProgress();
        }
    }

    initLessonFeatures(lessonId) {
        switch(lessonId) {
            case 'what-is-git':
                this.initFileEvolutionDemo();
                break;
            case 'basic-concepts':
                this.initDragAndDrop();
                break;
            case 'first-commit':
                this.resetTerminal();
                this.startCommitTutorial();
                break;
            case 'branches':
                this.initBranchVisualization();
                break;
            case 'merging':
                this.initMergeSimulator();
                break;
        }
    }

    // 檔案演變動畫
    initFileEvolutionDemo() {
        const container = document.getElementById('fileEvolution');
        if (!container) return;

        const stages = [
            { name: 'README.md', content: '# 我的專案', version: 'v1.0' },
            { name: 'README.md', content: '# 我的專案\n\n## 簡介\n這是一個很棒的專案', version: 'v1.1' },
            { name: 'README.md', content: '# 我的專案\n\n## 簡介\n這是一個很棒的專案\n\n## 安裝\nnpm install', version: 'v1.2' }
        ];

        let currentStage = 0;

        const createFileDisplay = (stage) => {
            return `
                <div class="file-version">
                    <div class="version-tag">${stage.version}</div>
                    <div class="file-preview">
                        <div class="file-header">${stage.name}</div>
                        <div class="file-content">${stage.content.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
            `;
        };

        const updateDisplay = () => {
            container.innerHTML = createFileDisplay(stages[currentStage]);
            
            const fileVersion = container.querySelector('.file-version');
            fileVersion.style.opacity = '0';
            fileVersion.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                fileVersion.style.transition = 'all 0.5s ease';
                fileVersion.style.opacity = '1';
                fileVersion.style.transform = 'translateY(0)';
            }, 100);
        };

        window.startFileEvolution = () => {
            currentStage = 0;
            updateDisplay();
            
            const interval = setInterval(() => {
                currentStage++;
                if (currentStage < stages.length) {
                    updateDisplay();
                } else {
                    clearInterval(interval);
                    this.showMessage('檔案演變完成！這就是版本控制的威力。', 'success');
                }
            }, 2000);
        };

        // 初始顯示
        updateDisplay();
    }

    // 拖拉功能設定
    setupDragAndDrop() {
        const draggables = document.querySelectorAll('.draggable');
        const dropZones = document.querySelectorAll('.drop-zone');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', this.handleDragStart);
            draggable.addEventListener('dragend', this.handleDragEnd);
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver);
            zone.addEventListener('drop', this.handleDrop.bind(this));
            zone.addEventListener('dragenter', this.handleDragEnter);
            zone.addEventListener('dragleave', this.handleDragLeave);
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.textContent.trim());
        e.target.classList.add('dragging');
        
        // 高亮所有可放置區域
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.add('highlight-drop-zone');
        });
        
        // 添加拖拉指引
        this.showDragGuidance();
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        
        // 移除所有高亮效果
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('highlight-drop-zone', 'drag-over');
        });
        
        // 移除拖拉指引
        this.hideDragGuidance();
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
        
        // 顯示區域說明
        this.showDropZoneInfo(e.currentTarget);
    }

    handleDragLeave(e) {
        // 只在真正離開元素時移除樣式
        if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.classList.remove('drag-over');
            this.hideDropZoneInfo();
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const fileName = e.dataTransfer.getData('text/plain');
        const targetZone = e.currentTarget.dataset.zone;
        
        // 顯示成功動畫
        this.showDropSuccessAnimation(e.currentTarget, fileName);
        
        // 根據目標區域給予回饋
        if (targetZone === 'staging') {
            this.showMessage(`很好！${fileName} 已加入暫存區。這相當於執行 'git add ${fileName}'`, 'success');
            this.moveFileToZone(fileName, 'staging');
        } else if (targetZone === 'repository') {
            if (this.hasFileInStaging(fileName)) {
                this.showMessage(`完美！${fileName} 已提交到版本庫。這相當於執行 'git commit'`, 'success');
                this.moveFileToZone(fileName, 'repository');
            } else {
                this.showMessage(`等等！檔案需要先加入暫存區才能提交。`, 'error');
                this.showErrorAnimation(e.currentTarget);
                return;
            }
        } else if (targetZone === 'working') {
            this.showMessage(`${fileName} 在工作區中。你可以編輯這個檔案。`, 'info');
            this.moveFileToZone(fileName, 'working');
        }
    }

    // 顯示放置成功動畫
    showDropSuccessAnimation(element, fileName) {
        element.classList.add('drop-success');
        
        // 創建成功標記
        const successMark = document.createElement('div');
        successMark.className = 'drop-success-mark';
        successMark.innerHTML = `✓ ${fileName}`;
        element.appendChild(successMark);
        
        setTimeout(() => {
            element.classList.remove('drop-success');
            if (successMark.parentNode) {
                successMark.remove();
            }
        }, 2000);
    }

    // 顯示錯誤動畫
    showErrorAnimation(element) {
        element.classList.add('drop-error');
        setTimeout(() => {
            element.classList.remove('drop-error');
        }, 1000);
    }

    // 移動檔案到指定區域
    moveFileToZone(fileName, zoneName) {
        const fileElement = document.querySelector(`[draggable="true"]:contains("${fileName}")`);
        if (!fileElement) return;
        
        // 創建檔案副本在目標區域
        const targetZone = document.querySelector(`[data-zone="${zoneName}"]`);
        if (targetZone) {
            const fileClone = fileElement.cloneNode(true);
            fileClone.classList.add('file-in-zone');
            targetZone.appendChild(fileClone);
            
            // 動畫效果
            fileClone.style.transform = 'scale(0)';
            fileClone.style.opacity = '0';
            setTimeout(() => {
                fileClone.style.transition = 'all 0.3s ease';
                fileClone.style.transform = 'scale(1)';
                fileClone.style.opacity = '1';
            }, 100);
        }
    }

    // 顯示拖拉指引
    showDragGuidance() {
        const guidance = document.createElement('div');
        guidance.id = 'drag-guidance';
        guidance.className = 'drag-guidance';
        guidance.innerHTML = '拖拉檔案到不同區域來學習 Git 工作流程';
        document.body.appendChild(guidance);
    }

    // 隱藏拖拉指引
    hideDragGuidance() {
        const guidance = document.getElementById('drag-guidance');
        if (guidance) {
            guidance.remove();
        }
    }

    // 顯示區域資訊
    showDropZoneInfo(zone) {
        const zoneName = zone.dataset.zone;
        let info = '';
        
        switch(zoneName) {
            case 'working':
                info = '工作區：編輯檔案的地方';
                break;
            case 'staging':
                info = '暫存區：準備提交的檔案';
                break;
            case 'repository':
                info = '版本庫：已提交的檔案歷史';
                break;
        }
        
        const infoElement = document.createElement('div');
        infoElement.id = 'zone-info';
        infoElement.className = 'zone-info';
        infoElement.textContent = info;
        zone.appendChild(infoElement);
    }

    // 隱藏區域資訊
    hideDropZoneInfo() {
        const info = document.getElementById('zone-info');
        if (info) {
            info.remove();
        }
    }

    hasFileInStaging(fileName) {
        // 簡化版本，假設檔案已在暫存區
        return true;
    }

    // 終端機設定
    setupTerminal() {
        const terminalInput = document.getElementById('terminalInput');
        if (!terminalInput) return;

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = e.target.value.trim();
                this.executeCommand(command);
                e.target.value = '';
            }
        });

        // 添加命令歷史功能
        this.commandHistory = [];
        this.historyIndex = -1;

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    e.target.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    e.target.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
                } else {
                    this.historyIndex = -1;
                    e.target.value = '';
                }
            }
        });
    }

    executeCommand(command) {
        // 添加到歷史記錄
        if (command && this.commandHistory[this.commandHistory.length - 1] !== command) {
            this.commandHistory.push(command);
        }
        this.historyIndex = -1;

        // 顯示用戶輸入
        this.addTerminalOutput(`$ ${command}`, 'user-input');

        // 處理命令
        const result = this.processGitCommand(command);
        this.addTerminalOutput(result.output, result.type);

        // 更新步驟狀態
        if (result.success) {
            this.updateStepProgress(command);
        }
    }

    processGitCommand(command) {
        const [cmd, ...args] = command.split(' ');

        switch (cmd) {
            case 'git':
                return this.handleGitCommand(args);
            case 'echo':
                return this.handleEchoCommand(args);
            case 'ls':
                return this.handleLsCommand();
            case 'cat':
                return this.handleCatCommand(args);
            case 'clear':
                document.getElementById('terminalOutput').innerHTML = '';
                return { output: '', type: 'success', success: true };
            case 'help':
                return {
                    output: '可用命令：git, echo, ls, cat, clear, help',
                    type: 'info',
                    success: true
                };
            default:
                return {
                    output: `command not found: ${cmd}`,
                    type: 'error',
                    success: false
                };
        }
    }

    handleGitCommand(args) {
        if (args.length === 0) {
            return {
                output: 'usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]...',
                type: 'info',
                success: false
            };
        }

        const [subcommand, ...subargs] = args;

        switch (subcommand) {
            case 'init':
                this.gitRepository.initialized = true;
                return {
                    output: 'Initialized empty Git repository in /git-tutorial/.git/',
                    type: 'success',
                    success: true
                };

            case 'add':
                if (subargs.length === 0) {
                    return {
                        output: 'Nothing specified, nothing added.',
                        type: 'error',
                        success: false
                    };
                }
                return this.handleGitAdd(subargs);

            case 'commit':
                return this.handleGitCommit(subargs);

            case 'status':
                return this.handleGitStatus();

            case 'log':
                return this.handleGitLog();

            case 'branch':
                return this.handleGitBranch(subargs);

            case 'checkout':
                return this.handleGitCheckout(subargs);

            default:
                return {
                    output: `git: '${subcommand}' is not a git command. See 'git help'.`,
                    type: 'error',
                    success: false
                };
        }
    }

    handleEchoCommand(args) {
        const text = args.join(' ');
        
        // 檢查是否有重定向
        const parts = text.split(' > ');
        if (parts.length === 2) {
            const content = parts[0].replace(/"/g, '');
            const filename = parts[1].trim();
            this.gitRepository.workingDirectory.set(filename, content);
            return {
                output: '',
                type: 'success',
                success: true
            };
        }
        
        return {
            output: text.replace(/"/g, ''),
            type: 'info',
            success: true
        };
    }

    handleLsCommand() {
        const files = Array.from(this.gitRepository.workingDirectory.keys());
        return {
            output: files.length > 0 ? files.join('  ') : '',
            type: 'info',
            success: true
        };
    }

    handleCatCommand(args) {
        if (args.length === 0) {
            return {
                output: 'cat: missing file operand',
                type: 'error',
                success: false
            };
        }

        const filename = args[0];
        const content = this.gitRepository.workingDirectory.get(filename);
        
        if (content === undefined) {
            return {
                output: `cat: ${filename}: No such file or directory`,
                type: 'error',
                success: false
            };
        }

        return {
            output: content,
            type: 'info',
            success: true
        };
    }

    handleGitAdd(files) {
        if (!this.gitRepository.initialized) {
            return {
                output: 'fatal: not a git repository (or any of the parent directories): .git',
                type: 'error',
                success: false
            };
        }

        let addedFiles = [];
        
        for (const file of files) {
            if (file === '.') {
                // 添加所有檔案
                for (const [filename, content] of this.gitRepository.workingDirectory) {
                    this.gitRepository.stagingArea.set(filename, content);
                    addedFiles.push(filename);
                }
            } else if (this.gitRepository.workingDirectory.has(file)) {
                const content = this.gitRepository.workingDirectory.get(file);
                this.gitRepository.stagingArea.set(file, content);
                addedFiles.push(file);
            } else {
                return {
                    output: `fatal: pathspec '${file}' did not match any files`,
                    type: 'error',
                    success: false
                };
            }
        }

        return {
            output: addedFiles.length > 0 ? `Added: ${addedFiles.join(', ')}` : '',
            type: 'success',
            success: true
        };
    }

    handleGitCommit(args) {
        if (!this.gitRepository.initialized) {
            return {
                output: 'fatal: not a git repository',
                type: 'error',
                success: false
            };
        }

        if (this.gitRepository.stagingArea.size === 0) {
            return {
                output: 'nothing to commit, working tree clean',
                type: 'info',
                success: false
            };
        }

        // 找到 -m 參數
        const messageIndex = args.indexOf('-m');
        if (messageIndex === -1 || messageIndex === args.length - 1) {
            return {
                output: 'Aborting commit due to empty commit message.',
                type: 'error',
                success: false
            };
        }

        const message = args[messageIndex + 1].replace(/"/g, '');
        
        // 創建提交
        const commitId = this.generateCommitId();
        const commit = {
            id: commitId,
            message: message,
            files: new Map(this.gitRepository.stagingArea),
            timestamp: new Date(),
            branch: this.gitRepository.currentBranch
        };

        this.gitRepository.commits.push(commit);
        const branchCommits = this.gitRepository.branches.get(this.gitRepository.currentBranch);
        branchCommits.push(commitId);

        // 清空暫存區
        this.gitRepository.stagingArea.clear();

        return {
            output: `[${this.gitRepository.currentBranch} ${commitId.substring(0, 7)}] ${message}\n ${commit.files.size} file(s) changed`,
            type: 'success',
            success: true
        };
    }

    handleGitStatus() {
        if (!this.gitRepository.initialized) {
            return {
                output: 'fatal: not a git repository',
                type: 'error',
                success: false
            };
        }

        let output = `On branch ${this.gitRepository.currentBranch}\n\n`;

        if (this.gitRepository.commits.length === 0) {
            output += 'No commits yet\n\n';
        }

        if (this.gitRepository.stagingArea.size > 0) {
            output += 'Changes to be committed:\n';
            for (const filename of this.gitRepository.stagingArea.keys()) {
                output += `  new file:   ${filename}\n`;
            }
            output += '\n';
        }

        const unstagedFiles = [];
        for (const filename of this.gitRepository.workingDirectory.keys()) {
            if (!this.gitRepository.stagingArea.has(filename)) {
                unstagedFiles.push(filename);
            }
        }

        if (unstagedFiles.length > 0) {
            output += 'Untracked files:\n';
            for (const filename of unstagedFiles) {
                output += `  ${filename}\n`;
            }
        }

        if (this.gitRepository.stagingArea.size === 0 && unstagedFiles.length === 0) {
            output += 'nothing to commit, working tree clean';
        }

        return {
            output: output,
            type: 'info',
            success: true
        };
    }

    handleGitLog() {
        if (!this.gitRepository.initialized || this.gitRepository.commits.length === 0) {
            return {
                output: 'fatal: your current branch does not have any commits yet',
                type: 'error',
                success: false
            };
        }

        let output = '';
        const branchCommits = this.gitRepository.branches.get(this.gitRepository.currentBranch);
        
        for (let i = branchCommits.length - 1; i >= 0; i--) {
            const commitId = branchCommits[i];
            const commit = this.gitRepository.commits.find(c => c.id === commitId);
            
            if (commit) {
                output += `commit ${commit.id}\n`;
                output += `Date: ${commit.timestamp.toDateString()}\n\n`;
                output += `    ${commit.message}\n\n`;
            }
        }

        return {
            output: output,
            type: 'info',
            success: true
        };
    }

    generateCommitId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    addTerminalOutput(text, type = 'info') {
        const output = document.getElementById('terminalOutput');
        if (!output) return;

        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.innerHTML = `<span class="output-text">${text.replace(/\n/g, '<br>')}</span>`;
        
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    resetTerminal() {
        const output = document.getElementById('terminalOutput');
        if (output) {
            output.innerHTML = `
                <div class="output-line">
                    <span class="prompt">git-tutorial $</span>
                    <span class="hint">輸入 'git init' 來初始化新的 Git 倉庫</span>
                </div>
            `;
        }

        // 重置虛擬檔案系統
        this.gitRepository = {
            commits: [],
            branches: new Map([['main', []]]),
            currentBranch: 'main',
            workingDirectory: new Map(),
            stagingArea: new Map(),
            initialized: false
        };
    }

    startCommitTutorial() {
        this.currentStep = 0;
        this.updateStepDisplay();
    }

    updateStepProgress(command) {
        const steps = ['git init', 'echo', 'git add', 'git commit'];
        const currentStepElement = document.querySelector('.step.active');
        
        if (command.startsWith('git init')) {
            this.advanceStep();
            this.addTerminalOutput('💡 很好！現在建立一個檔案來練習。試試輸入：echo "Hello Git!" > hello.txt', 'hint');
        } else if (command.startsWith('echo') && command.includes('>')) {
            this.advanceStep();
            this.addTerminalOutput('💡 檔案建立成功！現在用 git add 將它加入暫存區：git add hello.txt', 'hint');
        } else if (command.startsWith('git add')) {
            this.advanceStep();
            this.addTerminalOutput('💡 檔案已加入暫存區！最後用 git commit 提交：git commit -m "我的第一次提交"', 'hint');
        } else if (command.startsWith('git commit')) {
            this.advanceStep();
            this.addTerminalOutput('🎉 恭喜！你完成了第一次 Git 提交！試試用 git log 查看歷史記錄。', 'success');
        }
    }

    advanceStep() {
        const steps = document.querySelectorAll('.step');
        const currentActive = document.querySelector('.step.active');
        
        if (currentActive) {
            currentActive.classList.remove('active');
            currentActive.classList.add('completed');
        }

        this.currentStep++;
        if (this.currentStep < steps.length) {
            steps[this.currentStep].classList.add('active');
        }
    }

    // 分支視覺化
    setupBranchVisualization() {
        const diagram = document.getElementById('branchDiagram');
        if (!diagram) return;

        this.branchData = {
            commits: [
                { id: 'A', message: '初始提交', branch: 'main', x: 100, y: 100 },
                { id: 'B', message: '新增功能', branch: 'main', x: 200, y: 100 },
                { id: 'C', message: '修正錯誤', branch: 'main', x: 300, y: 100 }
            ],
            branches: [
                { name: 'main', commits: ['A', 'B', 'C'], color: '#667eea' }
            ]
        };

        this.renderBranchDiagram();
    }

    renderBranchDiagram() {
        const diagram = document.getElementById('branchDiagram');
        if (!diagram) return;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '300');
        svg.setAttribute('viewBox', '0 0 600 300');

        // 先繪製連接線（在提交點之下）
        this.drawBranchLines(svg);

        // 繪製提交點
        this.branchData.commits.forEach(commit => {
            // 根據分支決定顏色
            const branchInfo = this.branchData.branches.find(b => b.name === commit.branch);
            const color = branchInfo ? branchInfo.color : '#667eea';

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', commit.x);
            circle.setAttribute('cy', commit.y);
            circle.setAttribute('r', '15');
            circle.setAttribute('fill', color);
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '3');
            svg.appendChild(circle);

            // 提交 ID
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', commit.x);
            text.setAttribute('y', commit.y + 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', 'bold');
            text.textContent = commit.id;
            svg.appendChild(text);

            // 提交訊息
            const message = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            message.setAttribute('x', commit.x);
            message.setAttribute('y', commit.y - 25);
            message.setAttribute('text-anchor', 'middle');
            message.setAttribute('fill', '#333');
            message.setAttribute('font-size', '10');
            message.textContent = commit.message;
            svg.appendChild(message);
        });

        diagram.innerHTML = '';
        diagram.appendChild(svg);
    }

    drawBranchLines(svg) {
        // 繪製 main 分支線
        const mainCommits = this.branchData.commits.filter(c => c.branch === 'main');
        for (let i = 0; i < mainCommits.length - 1; i++) {
            const current = mainCommits[i];
            const next = mainCommits[i + 1];
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', current.x);
            line.setAttribute('y1', current.y);
            line.setAttribute('x2', next.x);
            line.setAttribute('y2', next.y);
            line.setAttribute('stroke', '#667eea');
            line.setAttribute('stroke-width', '3');
            svg.appendChild(line);
        }

        // 繪製 feature 分支線
        const featureCommits = this.branchData.commits.filter(c => c.branch === 'feature');
        if (featureCommits.length > 0) {
            // 從 main 分支的 B 點繋接到 feature 分支
            const branchPoint = this.branchData.commits.find(c => c.id === 'B');
            const firstFeature = featureCommits[0];
            
            if (branchPoint && firstFeature) {
                const branchLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                branchLine.setAttribute('x1', branchPoint.x);
                branchLine.setAttribute('y1', branchPoint.y);
                branchLine.setAttribute('x2', firstFeature.x);
                branchLine.setAttribute('y2', firstFeature.y);
                branchLine.setAttribute('stroke', '#4CAF50');
                branchLine.setAttribute('stroke-width', '3');
                svg.appendChild(branchLine);
            }

            // feature 分支內的連接
            for (let i = 0; i < featureCommits.length - 1; i++) {
                const current = featureCommits[i];
                const next = featureCommits[i + 1];
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', current.x);
                line.setAttribute('y1', current.y);
                line.setAttribute('x2', next.x);
                line.setAttribute('y2', next.y);
                line.setAttribute('stroke', '#4CAF50');
                line.setAttribute('stroke-width', '3');
                svg.appendChild(line);
            }
        }
    }

    // 分支操作
    createBranch() {
        const newCommit = {
            id: 'D',
            message: '新功能開發',
            branch: 'feature',
            x: 200,
            y: 180
        };

        this.branchData.commits.push(newCommit);
        this.branchData.branches.push({
            name: 'feature',
            commits: ['B', 'D'],
            color: '#4CAF50'
        });

        this.renderBranchDiagram();
        this.showMessage('建立了新分支 "feature"！', 'success');
    }

    switchBranch() {
        this.showMessage('已切換到 feature 分支！', 'info');
    }

    makeBranchCommit() {
        const newCommit = {
            id: 'E',
            message: '完成功能',
            branch: 'feature',
            x: 300,
            y: 180
        };

        this.branchData.commits.push(newCommit);
        this.renderBranchDiagram();
        this.showMessage('在 feature 分支上建立了新提交！', 'success');
    }

    // 合併模擬器初始化
    initMergeSimulator() {
        // 這裡可以添加合併視覺化的邏輯
        this.showMessage('合併模擬器已準備就緒！', 'info');
    }

    // 輔助方法
    showMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.innerHTML = `<i class="fas fa-${this.getIconForType(type)}"></i> ${text}`;
        
        // 找到當前活動的課程內容
        const activeLesson = document.querySelector('.lesson-content.active');
        if (activeLesson) {
            const existingMessage = activeLesson.querySelector('.success-message, .error-message, .info-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            activeLesson.insertBefore(messageDiv, activeLesson.firstChild);
            
            // 3秒後自動移除
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 3000);
        }
    }

    getIconForType(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // 課程導航
    nextLesson() {
        const lessons = ['welcome', 'what-is-git', 'basic-concepts', 'first-commit', 'branches', 'merging'];
        const currentIndex = lessons.indexOf(this.currentLesson);
        
        if (currentIndex < lessons.length - 1) {
            this.switchToLesson(lessons[currentIndex + 1]);
        }
    }

    previousLesson() {
        const lessons = ['welcome', 'what-is-git', 'basic-concepts', 'first-commit', 'branches', 'merging'];
        const currentIndex = lessons.indexOf(this.currentLesson);
        
        if (currentIndex > 0) {
            this.switchToLesson(lessons[currentIndex - 1]);
        }
    }

    // 進度更新
    updateProgress() {
        const totalLessons = 5; // welcome, what-is-git, basic-concepts, first-commit, branches
        const completed = this.completedLessons.size;
        const progressPercent = Math.min((completed / totalLessons) * 100, 100);
        
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${progressPercent}%`;
            progressText.textContent = `${Math.round(progressPercent)}%`;
            
            // 動畫效果
            progressFill.style.transition = 'width 0.5s ease-in-out';
        }
        
        // 更新側邊欄完成狀態
        this.updateSidebarCompletionStatus();
        
        // 如果完成所有課程，顯示恭喜訊息
        if (completed >= totalLessons) {
            this.showCompletionCelebration();
        }
    }

    // 更新側邊欄完成狀態
    updateSidebarCompletionStatus() {
        document.querySelectorAll('.lesson-item').forEach(item => {
            const lesson = item.dataset.lesson;
            if (this.completedLessons.has(lesson)) {
                item.classList.add('completed');
                // 添加完成標記
                if (!item.querySelector('.completion-mark')) {
                    const mark = document.createElement('span');
                    mark.className = 'completion-mark';
                    mark.innerHTML = '✓';
                    item.appendChild(mark);
                }
            }
        });
    }

    // 課程完成慶祝
    showCompletionCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'completion-celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <h2>🎉 恭喜完成 Git 學習！</h2>
                <p>你已經掌握了 Git 的基本技能！</p>
                <button onclick="restartCourse()">重新學習</button>
            </div>
        `;
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.remove();
            }
        }, 5000);
    }
}

// 全域函數
function startLearning() {
    const platform = window.gitPlatform;
    platform.switchToLesson('what-is-git');
}

function nextLesson() {
    const platform = window.gitPlatform;
    platform.nextLesson();
}

function restartCourse() {
    const platform = window.gitPlatform;
    platform.switchToLesson('welcome');
    platform.completedLessons.clear();
    platform.updateProgress();
}

// 分支操作全域函數
function createBranch() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.createBranch();
    }
}

function switchBranch() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.switchBranch();
    }
}

function makeBranchCommit() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.makeBranchCommit();
    }
}

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    window.gitPlatform = new GitLearningPlatform();
    
    // 添加一些視覺效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in');
            }
        });
    }, observerOptions);

    // 觀察所有需要動畫效果的元素
    document.querySelectorAll('.feature-card, .area, .step').forEach(el => {
        observer.observe(el);
    });
});

// 鍵盤快捷鍵提示
document.addEventListener('keydown', (e) => {
    if (e.key === '?' && e.shiftKey) {
        alert('鍵盤快捷鍵：\nCtrl + → : 下一課\nCtrl + ← : 上一課\nEnter : 執行終端機命令');
    }
});