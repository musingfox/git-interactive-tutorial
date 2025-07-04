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

    }

    switchToLesson(lessonId) {
        // 標記前一個課程為完成（除非是同一課程）
        if (this.currentLesson && this.currentLesson !== lessonId) {
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
                this.initGitWorkflow();
                break;
            case 'first-commit':
                this.resetTerminal();
                this.startCommitTutorial();
                // 隱藏完成按鈕（重新開始時）
                const nextButton = document.getElementById('firstCommitNextButton');
                if (nextButton) {
                    nextButton.style.display = 'none';
                }
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
            // 更新上方遊戲存檔的 current class
            this.updateGameSavePoints(currentStage);
            
            // 先淡出現有內容
            const existingContent = container.querySelector('.file-version');
            if (existingContent) {
                existingContent.style.transition = 'all 0.3s ease';
                existingContent.style.opacity = '0';
                existingContent.style.transform = 'translateY(-10px) scale(0.95)';
                
                setTimeout(() => {
                    container.innerHTML = createFileDisplay(stages[currentStage]);
                    const fileVersion = container.querySelector('.file-version');
                    
                    // 添加版本進度指示器
                    const progressIndicator = document.createElement('div');
                    progressIndicator.className = 'version-progress';
                    progressIndicator.textContent = `第 ${currentStage + 1} 版本，共 ${stages.length} 版本`;
                    fileVersion.appendChild(progressIndicator);
                    
                    // 淡入新內容
                    fileVersion.style.opacity = '0';
                    fileVersion.style.transform = 'translateY(20px) scale(0.95)';
                    
                    setTimeout(() => {
                        fileVersion.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                        fileVersion.style.opacity = '1';
                        fileVersion.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                }, 300);
            } else {
                // 首次顯示
                container.innerHTML = createFileDisplay(stages[currentStage]);
                const fileVersion = container.querySelector('.file-version');
                
                const progressIndicator = document.createElement('div');
                progressIndicator.className = 'version-progress';
                progressIndicator.textContent = `第 ${currentStage + 1} 版本，共 ${stages.length} 版本`;
                fileVersion.appendChild(progressIndicator);
                
                fileVersion.style.opacity = '0';
                fileVersion.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    fileVersion.style.transition = 'all 0.5s ease';
                    fileVersion.style.opacity = '1';
                    fileVersion.style.transform = 'translateY(0)';
                }, 100);
            }
        };

        // 新的互動式版本切換功能
        window.startFileEvolution = () => {
            // 隱藏按鈕，顯示互動提示
            const button = document.querySelector('.demo-button');
            button.style.display = 'none';
            
            // 添加互動提示
            const interactionHint = document.createElement('div');
            interactionHint.className = 'interaction-hint';
            interactionHint.innerHTML = `
                <p>🎯 <strong>試試點擊上方的存檔點！</strong></p>
                <p>體驗 Git 可以隨時切換版本的威力</p>
            `;
            button.parentNode.appendChild(interactionHint);
            
            // 讓存檔點可以點擊
            this.enableSavePointInteraction();
            
            // 顯示提示訊息
            this.showMessage('點擊上方的存檔點來切換版本！這就是 Git 的核心功能。', 'info');
        };
        
        // 啟用存檔點互動功能
        this.enableSavePointInteraction = () => {
            const savePoints = document.querySelectorAll('.save-point');
            savePoints.forEach((point, index) => {
                point.style.cursor = 'pointer';
                point.classList.add('interactive');
                
                // 添加點擊事件
                point.addEventListener('click', () => {
                    currentStage = index;
                    updateDisplay();
                    
                    // 顯示切換訊息
                    const versionName = stages[index].version;
                    this.showMessage(`已切換到 ${versionName}！這就是 Git 讓你穿梭時空的能力。`, 'success');
                });
                
                // 添加懸停效果
                point.addEventListener('mouseenter', () => {
                    if (!point.classList.contains('current')) {
                        point.style.transform = 'scale(1.05)';
                        point.style.opacity = '0.8';
                    }
                });
                
                point.addEventListener('mouseleave', () => {
                    if (!point.classList.contains('current')) {
                        point.style.transform = 'scale(1)';
                        point.style.opacity = '1';
                    }
                });
            });
        };

        // 初始顯示
        updateDisplay();
    }
    
    // Git 工作流程體驗初始化
    initGitWorkflow() {
        this.workflowState = {
            fileInWorkingDir: false,
            fileInStaging: false,
            fileInRepository: false,
            currentFile: null
        };
        
        // 設置拖拉功能
        this.setupWorkflowDragAndDrop();
    }
    
    // 設置工作流程的拖拉功能
    setupWorkflowDragAndDrop() {
        // 稍後會在建立檔案時設置
    }
    
    // 建立新檔案
    createNewFile() {
        const workingContent = document.getElementById('workingContent');
        const gitWorkflow = document.getElementById('gitWorkflow');
        const step1 = document.getElementById('step1');
        
        // 隱藏步驟1，顯示工作流程
        step1.style.display = 'none';
        gitWorkflow.style.display = 'block';
        
        // 創建檔案元素
        const fileElement = document.createElement('div');
        fileElement.className = 'workflow-file';
        fileElement.draggable = true;
        fileElement.id = 'workflowFile';
        fileElement.innerHTML = `
            <i class="fas fa-file-code"></i>
            <span>index.html</span>
            <div class="file-status">未追蹤</div>
        `;
        
        // 添加檔案到工作區
        workingContent.appendChild(fileElement);
        
        // 更新狀態
        this.workflowState.fileInWorkingDir = true;
        this.workflowState.currentFile = fileElement;
        
        // 啟用 git add 按鈕
        document.getElementById('addBtn').disabled = false;
        
        // 設置拖拉事件
        this.setupFileDragEvents(fileElement);
        this.setupZoneDropEvents();
        
        // 顯示成功訊息
        this.showMessage('✅ 檔案已建立！現在它在工作區中等待被追蹤。', 'success');
        
        // 更新提示
        document.getElementById('workflowHint').innerHTML = '<p>🎯 拖拉檔案到暫存區，或點擊 "git add" 按鈕</p>';
    }
    
    // 設置檔案拖拉事件
    setupFileDragEvents(fileElement) {
        fileElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'workflow-file');
            fileElement.classList.add('dragging');
            
            // 高亮可放置的區域
            document.querySelectorAll('.workflow-zone').forEach(zone => {
                if (this.canDropInZone(zone.id)) {
                    zone.classList.add('can-drop');
                }
            });
        });
        
        fileElement.addEventListener('dragend', () => {
            fileElement.classList.remove('dragging');
            document.querySelectorAll('.workflow-zone').forEach(zone => {
                zone.classList.remove('can-drop');
            });
        });
    }
    
    // 設置區域放置事件
    setupZoneDropEvents() {
        const zones = ['workingZone', 'stagingZone', 'repositoryZone'];
        
        zones.forEach(zoneId => {
            const zone = document.getElementById(zoneId);
            
            zone.addEventListener('dragover', (e) => {
                if (this.canDropInZone(zoneId)) {
                    e.preventDefault();
                    zone.classList.add('drag-over');
                }
            });
            
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                if (this.canDropInZone(zoneId)) {
                    this.moveFileToZone(zoneId);
                }
            });
        });
    }
    
    // 檢查是否可以放置到指定區域
    canDropInZone(zoneId) {
        switch (zoneId) {
            case 'stagingZone':
                return this.workflowState.fileInWorkingDir;
            case 'repositoryZone':
                return this.workflowState.fileInStaging;
            case 'workingZone':
                return this.workflowState.fileInStaging; // 可以從暫存區拉回工作區
            default:
                return false;
        }
    }
    
    // 移動檔案到指定區域
    moveFileToZone(targetZoneId) {
        const file = this.workflowState.currentFile;
        if (!file) return;
        
        switch (targetZoneId) {
            case 'stagingZone':
                this.gitAdd();
                break;
            case 'repositoryZone':
                if (this.workflowState.fileInStaging) {
                    this.gitCommit();
                }
                break;
            case 'workingZone':
                if (this.workflowState.fileInStaging) {
                    this.gitUnstage();
                }
                break;
        }
    }
    
    // Git add 操作
    gitAdd() {
        const file = this.workflowState.currentFile;
        if (!file || !this.workflowState.fileInWorkingDir) return;
        
        // 移動檔案到暫存區
        const stagingContent = document.getElementById('stagingContent');
        file.querySelector('.file-status').textContent = '已暫存';
        file.classList.add('staged');
        stagingContent.appendChild(file);
        
        // 更新狀態
        this.workflowState.fileInWorkingDir = false;
        this.workflowState.fileInStaging = true;
        
        // 更新按鈕狀態
        document.getElementById('addBtn').disabled = true;
        document.getElementById('unstageBtn').disabled = false;
        document.getElementById('commitBtn').disabled = false;
        
        // 顯示成功訊息
        this.showMessage('✅ 檔案已加入暫存區！相當於執行 "git add index.html"', 'success');
        
        // 更新提示
        document.getElementById('workflowHint').innerHTML = '<p>🎯 現在可以提交檔案到版本庫，或用 "git reset" 移回工作區</p>';
    }
    
    // Git commit 操作
    gitCommit() {
        const file = this.workflowState.currentFile;
        if (!file || !this.workflowState.fileInStaging) return;
        
        // 移動檔案到版本庫
        const repositoryContent = document.getElementById('repositoryContent');
        file.querySelector('.file-status').textContent = '已提交';
        file.classList.remove('staged');
        file.classList.add('committed');
        repositoryContent.appendChild(file);
        
        // 更新狀態
        this.workflowState.fileInStaging = false;
        this.workflowState.fileInRepository = true;
        
        // 更新按鈕狀態
        document.getElementById('commitBtn').disabled = true;
        document.getElementById('unstageBtn').disabled = true;
        
        // 顯示成功訊息
        this.showMessage('🎉 檔案已提交到版本庫！相當於執行 "git commit -m \'添加 index.html\'"', 'success');
        
        // 更新提示
        document.getElementById('workflowHint').innerHTML = '<p>✅ 完成！檔案已安全保存在 Git 版本庫中</p>';
    }
    
    // Git unstage 操作（從暫存區移回工作區）
    gitUnstage() {
        const file = this.workflowState.currentFile;
        if (!file || !this.workflowState.fileInStaging) return;
        
        // 移動檔案回工作區
        const workingContent = document.getElementById('workingContent');
        file.querySelector('.file-status').textContent = '未追蹤';
        file.classList.remove('staged');
        workingContent.appendChild(file);
        
        // 更新狀態
        this.workflowState.fileInStaging = false;
        this.workflowState.fileInWorkingDir = true;
        
        // 更新按鈕狀態
        document.getElementById('addBtn').disabled = false;
        document.getElementById('unstageBtn').disabled = true;
        document.getElementById('commitBtn').disabled = true;
        
        // 顯示訊息
        this.showMessage('↩️ 檔案已移回工作區！相當於執行 "git reset HEAD index.html"', 'info');
        
        // 更新提示
        document.getElementById('workflowHint').innerHTML = '<p>🎯 檔案回到工作區，可以重新執行 "git add" 加入暫存區</p>';
    }
    
    // 重置工作流程
    resetWorkflow() {
        // 清空所有區域
        document.getElementById('workingContent').innerHTML = '';
        document.getElementById('stagingContent').innerHTML = '';
        document.getElementById('repositoryContent').innerHTML = '';
        
        // 重置狀態
        this.workflowState = {
            fileInWorkingDir: false,
            fileInStaging: false,
            fileInRepository: false,
            currentFile: null
        };
        
        // 重置按鈕狀態
        document.getElementById('addBtn').disabled = true;
        document.getElementById('unstageBtn').disabled = true;
        document.getElementById('commitBtn').disabled = true;
        
        // 顯示步驟1
        document.getElementById('step1').style.display = 'block';
        document.getElementById('gitWorkflow').style.display = 'none';
        
        // 顯示重置訊息
        this.showMessage('🔄 工作流程已重置！可以重新開始體驗', 'info');
    }
    
    // 更新遊戲存檔點的 current class
    updateGameSavePoints(currentStage) {
        const savePoints = document.querySelectorAll('.save-point');
        savePoints.forEach((point, index) => {
            point.classList.remove('current');
            if (index === currentStage) {
                point.classList.add('current');
                // 添加高亮動畫
                point.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    point.style.transform = 'scale(1)';
                }, 300);
            }
        });
    }

    // 拖拉功能設定（已移除）
    setupDragAndDrop() {
        // 拖拉功能已移除，改用按鈕操作
        console.log('拖拉功能已移除，使用按鈕操作');
    }

    // 所有拖拉相關的處理函數已移除

    // 所有拖拉相關的輔助函數已移除

    // 終端機設定
    setupTerminal() {
        const terminalInput = document.getElementById('terminalInput');
        if (!terminalInput) return;

        // 初始化終端機狀態
        this.commandHistory = [];
        this.historyIndex = -1;
        this.terminalState = {
            currentStep: 0,
            expectedCommands: ['git init', 'echo "Hello Git!" > hello.txt', 'git add hello.txt', 'git commit -m "First commit"']
        };

        // 命令輸入處理
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = e.target.value.trim();
                this.executeCommand(command);
                e.target.value = '';
                
                // 滾動到底部
                setTimeout(() => this.scrollTerminalToBottom(), 100);
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.handleTabCompletion(e.target);
            }
        });

        // 命令歷史導航
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up', e.target);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down', e.target);
            }
        });

        // 點擊聚焦
        const terminal = document.getElementById('terminal');
        if (terminal) {
            terminal.addEventListener('click', () => {
                terminalInput.focus();
            });
        }

        // 初始化自動完成
        this.initializeAutoComplete();
    }

    navigateHistory(direction, input) {
        if (direction === 'up') {
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            }
        } else if (direction === 'down') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            } else {
                this.historyIndex = -1;
                input.value = '';
            }
        }
    }

    handleTabCompletion(input) {
        const currentValue = input.value;
        const suggestions = this.getCommandSuggestions(currentValue);
        
        if (suggestions.length === 1) {
            input.value = suggestions[0];
        } else if (suggestions.length > 1) {
            this.showSuggestions(suggestions);
        }
    }

    getCommandSuggestions(partial) {
        const commonCommands = [
            'git init', 'git add', 'git commit', 'git status', 'git log',
            'git branch', 'git checkout', 'git merge', 'git push', 'git pull',
            'echo', 'ls', 'cat', 'mkdir', 'cd'
        ];
        
        return commonCommands.filter(cmd => cmd.startsWith(partial));
    }

    showSuggestions(suggestions) {
        const suggestionText = suggestions.join('  ');
        this.addTerminalOutput(suggestionText, 'suggestion');
    }

    scrollTerminalToBottom() {
        const output = document.getElementById('terminalOutput');
        if (output) {
            output.scrollTop = output.scrollHeight;
        }
    }

    initializeAutoComplete() {
        // 預載常用指令提示
        this.addTerminalOutput('💡 提示：使用 Tab 鍵自動完成指令，↑↓ 鍵瀏覽歷史指令', 'hint');
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
        
        // 添加打字機效果（僅限於提示和成功訊息）
        if (type === 'hint' || type === 'success') {
            line.style.opacity = '0';
            line.style.transform = 'translateY(10px)';
            setTimeout(() => {
                line.style.transition = 'all 0.3s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, 100);
        }
        
        output.appendChild(line);
        this.scrollTerminalToBottom();
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
            console.log('git commit detected, advancing step'); // 調試用
            this.advanceStep();
            this.addTerminalOutput('🎉 恭喜！你完成了第一次 Git 提交！試試用 git log 查看歷史記錄。', 'success');
            
            // 顯示完成訊息和下一課按鈕
            console.log('Setting timeout for completion'); // 調試用
            
            // 立即顯示按鈕（測試用）
            this.showFirstCommitCompletion();
            
            // 也保留延遲版本以防需要
            setTimeout(() => {
                this.showFirstCommitCompletion();
            }, 500);
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

    showFirstCommitCompletion() {
        console.log('showFirstCommitCompletion called'); // 調試用
        
        // 顯示下一課按鈕
        const nextButtonContainer = document.getElementById('firstCommitNextButton');
        console.log('nextButtonContainer:', nextButtonContainer); // 調試用
        
        if (nextButtonContainer) {
            nextButtonContainer.style.display = 'block';
            nextButtonContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 添加慶祝動畫
            nextButtonContainer.classList.add('completion-celebration-appear');
            
            // 顯示成功訊息
            this.showMessage('🎉 恭喜完成第一次 Git 提交教學！', 'success');
        } else {
            console.error('firstCommitNextButton element not found'); // 調試用
        }
    }

    // 分支視覺化
    setupBranchVisualization() {
        const diagram = document.getElementById('branchDiagram');
        if (!diagram) return;

        // 初始化分支狀態
        this.branchState = {
            currentBranch: 'main',
            branches: new Map([
                ['main', { commits: ['A', 'B', 'C'], color: '#667eea', active: true }]
            ]),
            commits: new Map([
                ['A', { message: '初始提交', branch: 'main', x: 100, y: 100 }],
                ['B', { message: '新增功能', branch: 'main', x: 200, y: 100 }],
                ['C', { message: '修正錯誤', branch: 'main', x: 300, y: 100 }]
            ])
        };

        this.renderBranchDiagram();
        this.updateBranchDisplay();
        
        // 初始化任務進度
        this.missionProgress = 0;
        this.updateMissionProgress();
    }

    updateBranchDisplay() {
        // 更新當前分支顯示
        const currentBranchName = document.getElementById('currentBranchName');
        if (currentBranchName) {
            currentBranchName.textContent = this.branchState.currentBranch;
        }

        // 更新分支列表
        this.updateBranchList();
    }

    updateBranchList() {
        const branchesContainer = document.querySelector('.branches');
        if (!branchesContainer) return;

        branchesContainer.innerHTML = '';
        
        for (const [branchName, branchInfo] of this.branchState.branches) {
            const branchItem = document.createElement('div');
            branchItem.className = `branch-item ${branchName === this.branchState.currentBranch ? 'active' : ''}`;
            branchItem.dataset.branch = branchName;
            
            branchItem.innerHTML = `
                <i class="fas fa-circle"></i>
                <span>${branchName}</span>
                ${branchName === this.branchState.currentBranch ? '<span class="branch-status">當前</span>' : ''}
            `;
            
            branchesContainer.appendChild(branchItem);
        }
    }

    createNewBranch() {
        const branchName = 'feature/login';
        
        if (this.branchState.branches.has(branchName)) {
            this.showMessage('分支 feature/login 已經存在！請先切換到該分支。', 'info');
            return;
        }

        // 建立新分支（從當前分支分岔）
        this.branchState.branches.set(branchName, {
            commits: ['A', 'B', 'C'], // 包含 main 分支的歷史
            color: '#FF6B6B',
            active: false
        });

        // 添加分支建立動畫
        const currentDisplay = document.getElementById('currentBranchDisplay');
        currentDisplay.classList.add('branch-switch-animation');
        
        setTimeout(() => {
            currentDisplay.classList.remove('branch-switch-animation');
        }, 1000);

        this.updateBranchList();
        this.renderBranchDiagram();
        this.showMessage('🎉 成功建立分支 feature/login！', 'success');
        
        // 更新任務進度：完成任務1
        this.completeMission(1);
    }

    switchCurrentBranch() {
        const availableBranches = Array.from(this.branchState.branches.keys())
            .filter(name => name !== this.branchState.currentBranch);
        
        if (availableBranches.length === 0) {
            this.showMessage('沒有其他分支可以切換！請先建立新分支。', 'info');
            return;
        }

        const targetBranch = availableBranches[0];
        const oldBranch = this.branchState.currentBranch;
        
        // 切換分支
        this.branchState.currentBranch = targetBranch;
        
        // 添加切換動畫
        const currentDisplay = document.getElementById('currentBranchDisplay');
        const branchName = document.getElementById('currentBranchName');
        
        currentDisplay.classList.add('branch-switch-animation');
        
        setTimeout(() => {
            branchName.textContent = targetBranch;
            this.updateBranchList();
            currentDisplay.classList.remove('branch-switch-animation');
        }, 500);

        this.showMessage(`🔀 已切換到分支 ${targetBranch}！`, 'success');
        
        // 更新任務進度：完成任務2
        this.completeMission(2);
    }

    makeCommitOnBranch() {
        const currentBranch = this.branchState.currentBranch;
        const branchInfo = this.branchState.branches.get(currentBranch);
        
        if (!branchInfo) return;

        // 產生新的提交 ID
        const existingCommitIds = Array.from(this.branchState.commits.keys());
        const nextId = String.fromCharCode(65 + existingCommitIds.length); // A, B, C, D, E...
        
        // 計算新提交的位置
        let newCommit;
        if (currentBranch === 'main') {
            const mainCommitCount = branchInfo.commits.filter(id => {
                const commit = this.branchState.commits.get(id);
                return commit && commit.branch === 'main';
            }).length;
            newCommit = {
                message: '主線新功能',
                branch: currentBranch,
                x: 100 + mainCommitCount * 100,
                y: 100
            };
        } else {
            // feature 分支的提交
            const featureCommitCount = branchInfo.commits.filter(id => {
                const commit = this.branchState.commits.get(id);
                return commit && commit.branch === currentBranch;
            }).length;
            newCommit = {
                message: '分支功能開發',
                branch: currentBranch,
                x: 400 + featureCommitCount * 100,
                y: 150
            };
        }
        
        this.branchState.commits.set(nextId, newCommit);
        branchInfo.commits.push(nextId);
        
        this.renderBranchDiagram();
        this.showMessage(`✅ 在分支 ${currentBranch} 上新增了提交 ${nextId}！`, 'success');
        
        // 更新任務進度：完成任務3
        if (currentBranch !== 'main') {
            this.completeMission(3);
        }
    }

    mergeBranchToMain() {
        if (this.branchState.currentBranch === 'main') {
            this.showMessage('❌ 無法合併：當前已在 main 分支上！', 'error');
            return;
        }

        const featureBranch = this.branchState.currentBranch;
        const featureBranchInfo = this.branchState.branches.get(featureBranch);
        const mainBranchInfo = this.branchState.branches.get('main');
        
        if (!featureBranchInfo || !mainBranchInfo) return;

        // 添加合併動畫
        const diagram = document.getElementById('branchDiagram');
        diagram.classList.add('merge-animation');
        
        setTimeout(() => {
            // 執行合併：創建合併提交
            const mergeCommitId = 'M';
            const mergeCommit = {
                message: `合併 ${featureBranch}`,
                branch: 'main',
                x: 500, // 合併提交位置
                y: 100
            };
            
            this.branchState.commits.set(mergeCommitId, mergeCommit);
            mainBranchInfo.commits.push(mergeCommitId);
            
            // 保持 feature 分支的提交不變，只是移除分支引用
            
            // 切換回 main 分支
            this.branchState.currentBranch = 'main';
            
            // 移除已合併的分支
            this.branchState.branches.delete(featureBranch);
            
            this.renderBranchDiagram();
            this.updateBranchDisplay();
            diagram.classList.remove('merge-animation');
            
            this.showMessage(`🎉 成功合併分支 ${featureBranch} 到 main！`, 'success');
            
            // 更新任務進度：完成任務4
            this.completeMission(4);
        }, 1000);
    }

    resetBranchDemo() {
        // 重置分支狀態到初始狀態
        this.branchState = {
            currentBranch: 'main',
            branches: new Map([
                ['main', { commits: ['A', 'B', 'C'], color: '#667eea', active: true }]
            ]),
            commits: new Map([
                ['A', { message: '初始提交', branch: 'main', x: 100, y: 100 }],
                ['B', { message: '新增功能', branch: 'main', x: 200, y: 100 }],
                ['C', { message: '修正錯誤', branch: 'main', x: 300, y: 100 }]
            ])
        };

        this.renderBranchDiagram();
        this.updateBranchDisplay();
        this.showMessage('🔄 分支演示已重置！可以重新開始練習。', 'info');
        
        // 重置任務進度
        this.missionProgress = 0;
        this.updateMissionProgress();
    }

    completeMission(missionNumber) {
        if (missionNumber > this.missionProgress) {
            this.missionProgress = missionNumber;
            this.updateMissionProgress();
            this.showNextMission(missionNumber);
        }
    }

    updateMissionProgress() {
        const progressFill = document.getElementById('missionProgressFill');
        const progressText = document.getElementById('missionProgressText');
        
        if (progressFill && progressText) {
            const percentage = (this.missionProgress / 4) * 100;
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${this.missionProgress}/4 任務完成`;
        }
        
        // 更新任務顯示
        for (let i = 1; i <= 4; i++) {
            const mission = document.getElementById(`mission${i}`);
            if (mission) {
                if (i <= this.missionProgress) {
                    mission.classList.remove('hidden');
                    mission.classList.add('mission-completed');
                } else if (i === this.missionProgress + 1) {
                    mission.classList.remove('hidden');
                    mission.classList.remove('mission-completed');
                } else {
                    mission.classList.add('hidden');
                }
            }
        }
    }

    showNextMission(completedMission) {
        const missionMessages = {
            1: '✅ 任務1完成！現在請切換到新建立的分支。',
            2: '✅ 任務2完成！現在請在分支上進行提交。',
            3: '✅ 任務3完成！現在請合併分支回主線。',
            4: '🎉 所有任務完成！你已經掌握了完整的分支工作流程！'
        };
        
        if (missionMessages[completedMission]) {
            this.showMessage(missionMessages[completedMission], 'success');
        }
    }

    renderBranchDiagram() {
        const diagram = document.getElementById('branchDiagram');
        if (!diagram) return;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '350');
        svg.setAttribute('viewBox', '0 0 650 350');

        // 先繪製連接線
        this.drawBranchLines(svg);

        // 繪製提交點
        for (const [commitId, commit] of this.branchState.commits) {
            const branchInfo = this.branchState.branches.get(commit.branch);
            const color = branchInfo ? branchInfo.color : '#667eea';

            // 提交圓圈
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', commit.x);
            circle.setAttribute('cy', commit.y);
            circle.setAttribute('r', '15');
            circle.setAttribute('fill', color);
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '3');
            circle.style.transition = 'all 0.3s ease';
            
            // 當前分支的提交點添加脈衝效果
            if (commit.branch === this.branchState.currentBranch) {
                circle.style.filter = 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.6))';
            }
            
            svg.appendChild(circle);

            // 提交 ID
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', commit.x);
            text.setAttribute('y', commit.y + 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', 'bold');
            text.textContent = commitId;
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
        }

        // 添加分支標籤
        this.drawBranchLabels(svg);

        diagram.innerHTML = '';
        diagram.appendChild(svg);
    }

    drawBranchLines(svg) {
        // 先繪製 main 分支線 (A -> B -> C)
        const mainBranch = this.branchState.branches.get('main');
        if (mainBranch) {
            // 只連接 main 分支上的原始提交 A, B, C
            const baseMainCommits = ['A', 'B', 'C']
                .map(id => this.branchState.commits.get(id))
                .filter(commit => commit && commit.branch === 'main');
                
            for (let i = 0; i < baseMainCommits.length - 1; i++) {
                const current = baseMainCommits[i];
                const next = baseMainCommits[i + 1];
                
                if (current && next) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', current.x);
                    line.setAttribute('y1', current.y);
                    line.setAttribute('x2', next.x);
                    line.setAttribute('y2', next.y);
                    line.setAttribute('stroke', mainBranch.color);
                    line.setAttribute('stroke-width', 'main' === this.branchState.currentBranch ? '4' : '3');
                    line.setAttribute('opacity', '0.9');
                    svg.appendChild(line);
                }
            }
            
            // 如果有合併提交，從 C 連接到 M
            const cCommit = this.branchState.commits.get('C');
            const mergeCommit = this.branchState.commits.get('M');
            if (cCommit && mergeCommit) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', cCommit.x);
                line.setAttribute('y1', cCommit.y);
                line.setAttribute('x2', mergeCommit.x);
                line.setAttribute('y2', mergeCommit.y);
                line.setAttribute('stroke', mainBranch.color);
                line.setAttribute('stroke-width', 'main' === this.branchState.currentBranch ? '4' : '3');
                line.setAttribute('opacity', '0.9');
                svg.appendChild(line);
            }
        }
        
        // 繪製 feature 分支（如果存在）
        const featureBranch = this.branchState.branches.get('feature/login');
        if (featureBranch) {
            // 獲取 feature 分支上的所有提交
            const featureCommits = featureBranch.commits
                .map(id => this.branchState.commits.get(id))
                .filter(commit => commit && commit.branch === 'feature/login');
            
            if (featureCommits.length > 0) {
                const firstFeatureCommit = featureCommits[0];
                // 從 C 點到 feature 分支第一個提交的分岔線
                const branchCurve = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const d = `M 300 100 Q 350 125 ${firstFeatureCommit.x} ${firstFeatureCommit.y}`;
                branchCurve.setAttribute('d', d);
                branchCurve.setAttribute('stroke', featureBranch.color);
                branchCurve.setAttribute('stroke-width', '3');
                branchCurve.setAttribute('fill', 'none');
                branchCurve.setAttribute('stroke-dasharray', '5,5');
                branchCurve.setAttribute('opacity', '0.8');
                svg.appendChild(branchCurve);
            }
            
            // feature 分支上的提交連線（使用相同的 featureCommits 變數）
                
            for (let i = 0; i < featureCommits.length - 1; i++) {
                const current = featureCommits[i];
                const next = featureCommits[i + 1];
                
                if (current && next) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', current.x);
                    line.setAttribute('y1', current.y);
                    line.setAttribute('x2', next.x);
                    line.setAttribute('y2', next.y);
                    line.setAttribute('stroke', featureBranch.color);
                    line.setAttribute('stroke-width', 'feature/login' === this.branchState.currentBranch ? '4' : '3');
                    line.setAttribute('opacity', '0.9');
                    svg.appendChild(line);
                }
            }
        }
        
        // 繪製合併線（如果有合併提交）
        const mergeCommit = this.branchState.commits.get('M');
        if (mergeCommit) {
            // 從 feature 分支的最後一個提交到合併提交
            const lastFeatureCommit = this.branchState.commits.get('D');
            if (lastFeatureCommit) {
                // 使用曲線效果的合併線
                const curvePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const d = `M ${lastFeatureCommit.x} ${lastFeatureCommit.y} Q ${(lastFeatureCommit.x + mergeCommit.x) / 2} ${(lastFeatureCommit.y + mergeCommit.y) / 2 - 15} ${mergeCommit.x} ${mergeCommit.y}`;
                curvePath.setAttribute('d', d);
                curvePath.setAttribute('stroke', '#FF6B6B');
                curvePath.setAttribute('stroke-width', '3');
                curvePath.setAttribute('fill', 'none');
                curvePath.setAttribute('stroke-dasharray', '5,5');
                curvePath.setAttribute('opacity', '0.8');
                svg.appendChild(curvePath);
                
                // 添加合併箭頭
                const arrowHead = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const arrowSize = 6;
                const arrowX = mergeCommit.x - 15;
                const arrowY = mergeCommit.y - 5;
                
                const points = `${arrowX},${arrowY} ${arrowX - 8},${arrowY - 4} ${arrowX - 8},${arrowY + 4}`;
                arrowHead.setAttribute('points', points);
                arrowHead.setAttribute('fill', '#4CAF50');
                arrowHead.setAttribute('opacity', '0.9');
                svg.appendChild(arrowHead);
            }
        }
    }

    drawBranchLabels(svg) {
        for (const [branchName, branchInfo] of this.branchState.branches) {
            // 找到該分支的最新提交
            const branchCommits = branchInfo.commits
                .map(id => this.branchState.commits.get(id))
                .filter(commit => commit && commit.branch === branchName);
            
            if (branchCommits.length === 0) continue;
            
            // 獲取最新提交的位置
            const latestCommit = branchCommits[branchCommits.length - 1];
            if (!latestCommit) continue;
            
            const labelX = latestCommit.x;
            // 根據分支位置調整標籤高度，避免重疊
            const labelY = branchName === 'main' ? latestCommit.y - 45 : latestCommit.y - 50;
            
            // 分支標籤背景
            const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            labelBg.setAttribute('x', labelX - 60);
            labelBg.setAttribute('y', labelY - 12);
            labelBg.setAttribute('width', '120');
            labelBg.setAttribute('height', '22');
            labelBg.setAttribute('fill', branchInfo.color);
            labelBg.setAttribute('rx', '11');
            labelBg.setAttribute('opacity', '0.95');
            labelBg.setAttribute('stroke', '#fff');
            labelBg.setAttribute('stroke-width', '2');
            svg.appendChild(labelBg);
            
            // 分支標籤文字
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', labelX);
            label.setAttribute('y', labelY - 1);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', 'white');
            label.setAttribute('font-size', '11');
            label.setAttribute('font-weight', 'bold');
            
            const labelText = branchName === this.branchState.currentBranch ? 
                `${branchName} (當前)` : branchName;
            label.textContent = labelText;
            svg.appendChild(label);
            
            // 添加指向線（從標籤到提交點）
            const pointer = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            pointer.setAttribute('x1', labelX);
            pointer.setAttribute('y1', labelY + 10);
            pointer.setAttribute('x2', labelX);
            pointer.setAttribute('y2', latestCommit.y - 18);
            pointer.setAttribute('stroke', branchInfo.color);
            pointer.setAttribute('stroke-width', '2');
            pointer.setAttribute('opacity', '0.7');
            svg.appendChild(pointer);
        }
    }

    // 舊方法已移除，使用上面的新實作

    // 合併模擬器初始化
    initMergeSimulator() {
        // 初始化合併模擬器狀態
        this.mergeState = {
            currentScenario: null,
            hasConflict: false
        };
        
        // 設定初始顯示
        this.resetMergeVisualization();
        this.showMessage('合併模擬器已準備就緒！', 'info');
    }
    
    resetMergeVisualization() {
        const visualization = document.getElementById('mergeVisualization');
        if (visualization) {
            visualization.innerHTML = `
                <div class="scenario-display">
                    <h4>選擇上方按鈕開始模擬合併情境</h4>
                    <p>每種合併類型都有不同的處理方式和結果</p>
                    <div class="initial-git-graph">
                        <svg width="400" height="200" viewBox="0 0 400 200">
                            <!-- Main branch -->
                            <line x1="50" y1="100" x2="200" y2="100" stroke="#667eea" stroke-width="3"/>
                            <!-- Feature branch -->
                            <line x1="150" y1="100" x2="200" y2="60" stroke="#FF6B6B" stroke-width="3" stroke-dasharray="5,5"/>
                            <line x1="200" y1="60" x2="350" y2="60" stroke="#FF6B6B" stroke-width="3"/>
                            
                            <!-- Commits -->
                            <circle cx="100" cy="100" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                            <text x="100" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text>
                            
                            <circle cx="150" cy="100" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                            <text x="150" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">B</text>
                            
                            <circle cx="250" cy="60" r="12" fill="#FF6B6B" stroke="#fff" stroke-width="2"/>
                            <text x="250" y="65" text-anchor="middle" fill="white" font-size="10" font-weight="bold">C</text>
                            
                            <circle cx="300" cy="60" r="12" fill="#FF6B6B" stroke="#fff" stroke-width="2"/>
                            <text x="300" y="65" text-anchor="middle" fill="white" font-size="10" font-weight="bold">D</text>
                            
                            <!-- Branch labels -->
                            <text x="100" y="130" text-anchor="middle" fill="#667eea" font-size="12" font-weight="bold">main</text>
                            <text x="275" y="45" text-anchor="middle" fill="#FF6B6B" font-size="12" font-weight="bold">feature</text>
                        </svg>
                    </div>
                </div>
            `;
        }
    }

    // 分支練習遊戲系統
    startBranchMission(missionNumber) {
        this.currentMission = missionNumber;
        
        switch(missionNumber) {
            case 1:
                this.missionCreateBranch();
                break;
            case 2:
                this.missionSwitchBranch();
                break;
            case 3:
                this.missionDevelopOnBranch();
                break;
            case 4:
                this.missionMergeBranch();
                break;
        }
    }

    missionCreateBranch() {
        this.showMessage('任務開始！請點擊「建立新分支」按鈕來創建 feature/login 分支', 'info');
        
        // 監聽分支創建
        const originalCreate = this.createBranch.bind(this);
        this.createBranch = () => {
            originalCreate();
            this.completeMission(1);
            this.createBranch = originalCreate; // 還原原始函數
        };
    }

    missionSwitchBranch() {
        this.showMessage('很好！現在請點擊「切換分支」按鈕來切換到 feature/login 分支', 'info');
        
        const originalSwitch = this.switchBranch.bind(this);
        this.switchBranch = () => {
            originalSwitch();
            this.completeMission(2);
            this.switchBranch = originalSwitch;
        };
    }

    missionDevelopOnBranch() {
        this.showMessage('太棒了！現在請點擊「在分支上提交」按鈕來開發登入功能', 'info');
        
        const originalCommit = this.makeBranchCommit.bind(this);
        this.makeBranchCommit = () => {
            originalCommit();
            this.completeMission(3);
            this.makeBranchCommit = originalCommit;
        };
    }

    missionMergeBranch() {
        this.showMessage('最後一步！模擬合併分支操作', 'info');
        
        // 創建合併按鈕
        const missionDiv = document.getElementById('mission4');
        const existingButton = missionDiv.querySelector('.mission-button');
        existingButton.style.display = 'none';
        
        const mergeButton = document.createElement('button');
        mergeButton.className = 'mission-button merge-button';
        mergeButton.textContent = '合併分支';
        mergeButton.onclick = () => {
            this.simulateMerge();
            this.completeMission(4);
        };
        
        missionDiv.appendChild(mergeButton);
    }

    simulateMerge() {
        this.showMessage('正在合併 feature/login 分支...', 'info');
        
        setTimeout(() => {
            this.showMessage('合併成功！feature/login 分支的功能已整合到主分支', 'success');
            this.updateBranchDiagram('merged');
        }, 1500);
    }

    completeMission(missionNumber) {
        // 標記任務完成
        const missionDiv = document.getElementById(`mission${missionNumber}`);
        missionDiv.classList.add('mission-completed');
        
        const button = missionDiv.querySelector('.mission-button');
        button.textContent = '✓ 已完成';
        button.disabled = true;
        
        // 顯示下一個任務
        if (missionNumber < 4) {
            const nextMission = document.getElementById(`mission${missionNumber + 1}`);
            nextMission.classList.remove('hidden');
            nextMission.classList.add('mission-appear');
        }
        
        // 更新進度
        this.updateMissionProgress(missionNumber);
        
        // 成功訊息
        this.showMessage(`任務 ${missionNumber} 完成！`, 'success');
        
        // 如果全部完成
        if (missionNumber === 4) {
            setTimeout(() => {
                this.showMessage('🎉 恭喜！你已經掌握了 Git 分支的基本操作！', 'success');
            }, 2000);
        }
    }

    updateMissionProgress(completedMissions) {
        const progressFill = document.getElementById('missionProgressFill');
        const progressText = document.getElementById('missionProgressText');
        
        if (progressFill && progressText) {
            const progress = (completedMissions / 4) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${completedMissions}/4 任務完成`;
            
            // 動畫效果
            progressFill.style.transition = 'width 0.5s ease';
        }
    }

    updateBranchDiagram(state) {
        // 更新分支圖表狀態
        const diagram = document.getElementById('branchDiagram');
        if (diagram && state === 'merged') {
            // 添加合併視覺效果
            diagram.classList.add('merged-state');
        }
    }

    // 輔助方法
    showMessage(text, type = 'info') {
        // 移除現有的訊息
        this.clearExistingMessages();
        
        // 創建新的訊息元素
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-notification ${type}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="message-icon">${this.getIconForType(type)}</i>
                <span class="message-text">${text}</span>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // 添加到頁面頂部
        document.body.appendChild(messageDiv);
        
        // 動畫進入
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 100);
        
        // 自動移除（成功訊息5秒，錯誤訊息7秒，資訊訊息4秒）
        const duration = type === 'error' ? 7000 : type === 'success' ? 5000 : 4000;
        setTimeout(() => {
            this.hideMessage(messageDiv);
        }, duration);
        
        // 如果是成功訊息，添加慶祝效果
        if (type === 'success') {
            this.addCelebrationEffect();
        }
    }

    clearExistingMessages() {
        const existingMessages = document.querySelectorAll('.message-notification');
        existingMessages.forEach(msg => this.hideMessage(msg));
    }

    hideMessage(messageDiv) {
        if (messageDiv && messageDiv.parentNode) {
            messageDiv.classList.add('hide');
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }

    addCelebrationEffect() {
        // 創建慶祝粒子效果
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'celebration-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 0.5 + 's';
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 2000);
            }, i * 100);
        }
    }

    getIconForType(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
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
        const totalLessons = 6; // welcome, what-is-git, basic-concepts, first-commit, branches, merging
        const completed = this.completedLessons.size;
        const progressPercent = Math.min((completed / totalLessons) * 100, 100);
        
        
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

// Git 工作流程全域函數
function createNewFile() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.createNewFile();
    }
}

function gitAdd() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.gitAdd();
    }
}

function gitCommit() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.gitCommit();
    }
}

function gitUnstage() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.gitUnstage();
    }
}

function resetWorkflow() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.resetWorkflow();
    }
}

// 分支操作函數
function createBranch() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.createNewBranch();
    }
}

function switchBranch() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.switchCurrentBranch();
    }
}

function makeBranchCommit() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.makeCommitOnBranch();
    }
}

function mergeBranch() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.mergeBranchToMain();
    }
}

function resetBranchDemo() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.resetBranchDemo();
    }
}

// 分支練習遊戲函數
function startBranchMission(missionNumber) {
    const platform = window.gitPlatform;
    if (platform) {
        platform.startBranchMission(missionNumber);
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
        alert('鍵盤快捷鍵：\nEnter : 執行終端機命令');
    }
});

// 合併分支功能
function simulateFastForward() {
    const visualization = document.getElementById('mergeVisualization');
    
    visualization.innerHTML = `
        <div class="merge-scenario">
            <h4>📋 Fast-Forward 合併</h4>
            <div class="scenario-explanation">
                <p>當 feature 分支是從 main 分支線性發展時，Git 只需要移動 main 指針到 feature 的最新提交。</p>
            </div>
            
            <div class="merge-steps">
                <div class="step" id="ff-step-1">
                    <h5>步驟 1: 合併前狀態</h5>
                    <svg width="450" height="150" viewBox="0 0 450 150">
                        <!-- Main branch line -->
                        <line x1="50" y1="80" x2="200" y2="80" stroke="#667eea" stroke-width="3"/>
                        <!-- Feature branch line -->
                        <line x1="200" y1="80" x2="350" y2="80" stroke="#FF6B6B" stroke-width="3"/>
                        
                        <!-- Commits -->
                        <circle cx="100" cy="80" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="100" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text>
                        
                        <circle cx="150" cy="80" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="150" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">B</text>
                        
                        <circle cx="250" cy="80" r="12" fill="#FF6B6B" stroke="#fff" stroke-width="2"/>
                        <text x="250" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">C</text>
                        
                        <circle cx="300" cy="80" r="12" fill="#FF6B6B" stroke="#fff" stroke-width="2"/>
                        <text x="300" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">D</text>
                        
                        <!-- Branch pointers -->
                        <rect x="130" y="50" width="40" height="20" fill="#667eea" rx="10"/>
                        <text x="150" y="63" text-anchor="middle" fill="white" font-size="10" font-weight="bold">main</text>
                        
                        <rect x="280" y="50" width="40" height="20" fill="#FF6B6B" rx="10"/>
                        <text x="300" y="63" text-anchor="middle" fill="white" font-size="10" font-weight="bold">feature</text>
                    </svg>
                </div>
                
                <div class="step" id="ff-step-2" style="display: none;">
                    <h5>步驟 2: 合併後狀態 (Fast-Forward)</h5>
                    <svg width="450" height="150" viewBox="0 0 450 150">
                        <!-- Single branch line -->
                        <line x1="50" y1="80" x2="350" y2="80" stroke="#667eea" stroke-width="3"/>
                        
                        <!-- Commits -->
                        <circle cx="100" cy="80" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="100" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text>
                        
                        <circle cx="150" cy="80" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="150" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">B</text>
                        
                        <circle cx="250" cy="80" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="250" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">C</text>
                        
                        <circle cx="300" cy="80" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="300" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">D</text>
                        
                        <!-- Main pointer moved to D -->
                        <rect x="280" y="50" width="40" height="20" fill="#4CAF50" rx="10"/>
                        <text x="300" y="63" text-anchor="middle" fill="white" font-size="10" font-weight="bold">main</text>
                        
                        <!-- Arrow showing movement -->
                        <path d="M 170 40 Q 225 25 280 40" stroke="#4CAF50" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
                        <text x="225" y="20" text-anchor="middle" fill="#4CAF50" font-size="12" font-weight="bold">Fast-Forward</text>
                        
                        <!-- Arrow marker definition -->
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#4CAF50"/>
                            </marker>
                        </defs>
                    </svg>
                </div>
            </div>
            
            <div class="scenario-commands">
                <h5>命令序列：</h5>
                <pre><code>git checkout main
git merge feature-branch
# 結果: Fast-forward merge 成功！</code></pre>
            </div>
            
            <button class="demo-button" onclick="showNextFFStep()">
                <i class="fas fa-play"></i>
                查看合併結果
            </button>
        </div>
    `;
}

function simulateThreeWayMerge() {
    const visualization = document.getElementById('mergeVisualization');
    
    visualization.innerHTML = `
        <div class="merge-scenario">
            <h4>🔀 Three-way 合併</h4>
            <div class="scenario-explanation">
                <p>當 main 和 feature 分支都有不同的新提交時，Git 會創建一個新的合併提交來整合兩者。</p>
            </div>
            
            <div class="merge-steps">
                <div class="step" id="tw-step-1">
                    <h5>步驟 1: 合併前狀態 (兩個分支都有新提交)</h5>
                    <svg width="500" height="200" viewBox="0 0 500 200">
                        <!-- Main branch -->
                        <line x1="50" y1="120" x2="200" y2="120" stroke="#667eea" stroke-width="3"/>
                        <line x1="200" y1="120" x2="350" y2="120" stroke="#667eea" stroke-width="3"/>
                        
                        <!-- Feature branch -->
                        <line x1="200" y1="120" x2="250" y2="80" stroke="#FF6B6B" stroke-width="3" stroke-dasharray="5,5"/>
                        <line x1="250" y1="80" x2="350" y2="80" stroke="#FF6B6B" stroke-width="3"/>
                        
                        <!-- Common ancestor and main commits -->
                        <circle cx="100" cy="120" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="100" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text>
                        
                        <circle cx="200" cy="120" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="200" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="bold">B</text>
                        
                        <circle cx="300" cy="120" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="300" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="bold">C</text>
                        
                        <!-- Feature branch commits -->
                        <circle cx="300" cy="80" r="12" fill="#FF6B6B" stroke="#fff" stroke-width="2"/>
                        <text x="300" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">D</text>
                        
                        <!-- Branch pointers -->
                        <rect x="280" y="140" width="40" height="20" fill="#667eea" rx="10"/>
                        <text x="300" y="153" text-anchor="middle" fill="white" font-size="10" font-weight="bold">main</text>
                        
                        <rect x="280" y="50" width="50" height="20" fill="#FF6B6B" rx="10"/>
                        <text x="305" y="63" text-anchor="middle" fill="white" font-size="10" font-weight="bold">feature</text>
                        
                        <!-- Labels -->
                        <text x="200" y="40" text-anchor="middle" fill="#666" font-size="12">Common Ancestor (B)</text>
                        <path d="M 200 45 L 200 105" stroke="#666" stroke-width="1" stroke-dasharray="3,3"/>
                    </svg>
                </div>
                
                <div class="step" id="tw-step-2" style="display: none;">
                    <h5>步驟 2: 合併後狀態 (創建合併提交)</h5>
                    <svg width="500" height="200" viewBox="0 0 500 200">
                        <!-- Main branch -->
                        <line x1="50" y1="120" x2="200" y2="120" stroke="#667eea" stroke-width="3"/>
                        <line x1="200" y1="120" x2="350" y2="120" stroke="#667eea" stroke-width="3"/>
                        <line x1="350" y1="120" x2="400" y2="120" stroke="#667eea" stroke-width="3"/>
                        
                        <!-- Feature branch -->
                        <line x1="200" y1="120" x2="250" y2="80" stroke="#FF6B6B" stroke-width="3" stroke-dasharray="5,5"/>
                        <line x1="250" y1="80" x2="350" y2="80" stroke="#FF6B6B" stroke-width="3"/>
                        
                        <!-- Merge lines -->
                        <line x1="350" y1="120" x2="400" y2="120" stroke="#4CAF50" stroke-width="3"/>
                        <line x1="350" y1="80" x2="400" y2="120" stroke="#4CAF50" stroke-width="3" stroke-dasharray="3,3"/>
                        
                        <!-- Commits -->
                        <circle cx="100" cy="120" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="100" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text>
                        
                        <circle cx="200" cy="120" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="200" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="bold">B</text>
                        
                        <circle cx="300" cy="120" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="300" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="bold">C</text>
                        
                        <circle cx="350" cy="80" r="12" fill="#FF6B6B" stroke="#fff" stroke-width="2"/>
                        <text x="350" y="85" text-anchor="middle" fill="white" font-size="10" font-weight="bold">D</text>
                        
                        <!-- Merge commit -->
                        <circle cx="400" cy="120" r="12" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
                        <text x="400" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="bold">M</text>
                        
                        <!-- Main pointer moved to merge commit -->
                        <rect x="380" y="140" width="40" height="20" fill="#4CAF50" rx="10"/>
                        <text x="400" y="153" text-anchor="middle" fill="white" font-size="10" font-weight="bold">main</text>
                        
                        <!-- Labels -->
                        <text x="400" y="100" text-anchor="middle" fill="#4CAF50" font-size="12" font-weight="bold">Merge Commit</text>
                    </svg>
                </div>
            </div>
            
            <div class="scenario-commands">
                <h5>命令序列：</h5>
                <pre><code>git checkout main
git merge feature-branch
# Git 會自動創建合併提交 M</code></pre>
            </div>
            
            <button class="demo-button" onclick="showNextTWStep()">
                <i class="fas fa-play"></i>
                查看合併結果
            </button>
        </div>
    `;
}

function simulateConflict() {
    const visualization = document.getElementById('mergeVisualization');
    
    visualization.innerHTML = `
        <div class="merge-scenario conflict">
            <h4>⚠️ 合併衝突情境</h4>
            <div class="scenario-explanation">
                <p>當兩個分支都修改了同一檔案的相同區域時，Git 無法自動決定如何合併，需要手動解決衝突。</p>
            </div>
            
            <div class="merge-steps">
                <div class="step" id="conflict-step-1">
                    <h5>步驟 1: 衝突前狀態 (兩分支修改同一檔案)</h5>
                    <svg width="500" height="250" viewBox="0 0 500 250">
                        <!-- Main branch -->
                        <line x1="50" y1="150" x2="200" y2="150" stroke="#667eea" stroke-width="3"/>
                        <line x1="200" y1="150" x2="350" y2="150" stroke="#667eea" stroke-width="3"/>
                        
                        <!-- Feature branch -->
                        <line x1="200" y1="150" x2="250" y2="100" stroke="#FF6B6B" stroke-width="3" stroke-dasharray="5,5"/>
                        <line x1="250" y1="100" x2="350" y2="100" stroke="#FF6B6B" stroke-width="3"/>
                        
                        <!-- Base commits -->
                        <circle cx="100" cy="150" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="100" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text>
                        
                        <circle cx="200" cy="150" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="200" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">B</text>
                        
                        <!-- Conflicting commits -->
                        <circle cx="300" cy="150" r="12" fill="#dc3545" stroke="#fff" stroke-width="2"/>
                        <text x="300" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">C</text>
                        
                        <circle cx="300" cy="100" r="12" fill="#dc3545" stroke="#fff" stroke-width="2"/>
                        <text x="300" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">D</text>
                        
                        <!-- Branch pointers -->
                        <rect x="280" y="170" width="40" height="20" fill="#667eea" rx="10"/>
                        <text x="300" y="183" text-anchor="middle" fill="white" font-size="10" font-weight="bold">main</text>
                        
                        <rect x="280" y="70" width="50" height="20" fill="#FF6B6B" rx="10"/>
                        <text x="305" y="83" text-anchor="middle" fill="white" font-size="10" font-weight="bold">feature</text>
                        
                        <!-- Conflict indicators -->
                        <g>
                            <rect x="380" y="90" width="100" height="70" fill="#fff3cd" stroke="#856404" stroke-width="2" rx="5"/>
                            <text x="430" y="110" text-anchor="middle" fill="#856404" font-size="12" font-weight="bold">⚠️ 衝突區域</text>
                            <text x="430" y="125" text-anchor="middle" fill="#856404" font-size="10">C: title: 應用程式</text>
                            <text x="430" y="140" text-anchor="middle" fill="#856404" font-size="10">D: title: 網站</text>
                        </g>
                        
                        <!-- Conflict arrows -->
                        <path d="M 320 140 Q 350 125 380 125" stroke="#dc3545" stroke-width="2" fill="none" marker-end="url(#conflictArrow)"/>
                        <path d="M 320 110 Q 350 115 380 115" stroke="#dc3545" stroke-width="2" fill="none" marker-end="url(#conflictArrow)"/>
                        
                        <defs>
                            <marker id="conflictArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="#dc3545"/>
                            </marker>
                        </defs>
                    </svg>
                </div>
                
                <div class="step" id="conflict-step-2" style="display: none;">
                    <h5>步驟 2: 合併失敗 - 需要手動解決</h5>
                    <svg width="500" height="280" viewBox="0 0 500 280">
                        <!-- Same branch structure -->
                        <line x1="50" y1="150" x2="200" y2="150" stroke="#667eea" stroke-width="3"/>
                        <line x1="200" y1="150" x2="350" y2="150" stroke="#667eea" stroke-width="3"/>
                        <line x1="200" y1="150" x2="250" y2="100" stroke="#FF6B6B" stroke-width="3" stroke-dasharray="5,5"/>
                        <line x1="250" y1="100" x2="350" y2="100" stroke="#FF6B6B" stroke-width="3"/>
                        
                        <!-- Base commits -->
                        <circle cx="100" cy="150" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="100" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text>
                        
                        <circle cx="200" cy="150" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="200" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">B</text>
                        
                        <!-- Conflicting commits -->
                        <circle cx="300" cy="150" r="12" fill="#dc3545" stroke="#fff" stroke-width="2"/>
                        <text x="300" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">C</text>
                        
                        <circle cx="300" cy="100" r="12" fill="#dc3545" stroke="#fff" stroke-width="2"/>
                        <text x="300" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">D</text>
                        
                        <!-- Failed merge commit (dashed) -->
                        <circle cx="400" cy="125" r="12" fill="none" stroke="#dc3545" stroke-width="3" stroke-dasharray="4,4"/>
                        <text x="400" y="130" text-anchor="middle" fill="#dc3545" font-size="10" font-weight="bold">?</text>
                        
                        <!-- Branch pointers -->
                        <rect x="280" y="170" width="40" height="20" fill="#667eea" rx="10"/>
                        <text x="300" y="183" text-anchor="middle" fill="white" font-size="10" font-weight="bold">main</text>
                        
                        <rect x="280" y="70" width="50" height="20" fill="#FF6B6B" rx="10"/>
                        <text x="305" y="83" text-anchor="middle" fill="white" font-size="10" font-weight="bold">feature</text>
                        
                        <!-- Conflict resolution area -->
                        <g>
                            <rect x="50" y="200" width="400" height="60" fill="#f8d7da" stroke="#721c24" stroke-width="2" rx="5"/>
                            <text x="250" y="220" text-anchor="middle" fill="#721c24" font-size="14" font-weight="bold">Git 衝突訊息</text>
                            <text x="250" y="240" text-anchor="middle" fill="#721c24" font-size="12">CONFLICT (content): Merge conflict in index.html</text>
                            <text x="250" y="255" text-anchor="middle" fill="#721c24" font-size="12">Automatic merge failed; fix conflicts and commit the result.</text>
                        </g>
                    </svg>
                </div>
                
                <div class="step" id="conflict-step-3" style="display: none;">
                    <h5>步驟 3: 解決衝突後的狀態</h5>
                    <svg width="500" height="200" viewBox="0 0 500 200">
                        <!-- Final branch structure -->
                        <line x1="50" y1="150" x2="200" y2="150" stroke="#667eea" stroke-width="3"/>
                        <line x1="200" y1="150" x2="350" y2="150" stroke="#667eea" stroke-width="3"/>
                        <line x1="350" y1="150" x2="400" y2="150" stroke="#667eea" stroke-width="3"/>
                        
                        <line x1="200" y1="150" x2="250" y2="100" stroke="#FF6B6B" stroke-width="3" stroke-dasharray="5,5"/>
                        <line x1="250" y1="100" x2="350" y2="100" stroke="#FF6B6B" stroke-width="3"/>
                        <line x1="350" y1="100" x2="400" y2="150" stroke="#4CAF50" stroke-width="3" stroke-dasharray="3,3"/>
                        
                        <!-- Base commits -->
                        <circle cx="100" cy="150" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="100" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">A</text>
                        
                        <circle cx="200" cy="150" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="200" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">B</text>
                        
                        <!-- Original conflicting commits -->
                        <circle cx="300" cy="150" r="12" fill="#667eea" stroke="#fff" stroke-width="2"/>
                        <text x="300" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">C</text>
                        
                        <circle cx="350" cy="100" r="12" fill="#FF6B6B" stroke="#fff" stroke-width="2"/>
                        <text x="350" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">D</text>
                        
                        <!-- Resolved merge commit -->
                        <circle cx="400" cy="150" r="12" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
                        <text x="400" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">M</text>
                        
                        <!-- Final main pointer -->
                        <rect x="380" y="170" width="40" height="20" fill="#4CAF50" rx="10"/>
                        <text x="400" y="183" text-anchor="middle" fill="white" font-size="10" font-weight="bold">main</text>
                        
                        <!-- Resolution indicator -->
                        <text x="400" y="130" text-anchor="middle" fill="#4CAF50" font-size="12" font-weight="bold">已解決</text>
                    </svg>
                </div>
            </div>
            
            <div class="scenario-commands">
                <h5>命令序列：</h5>
                <pre><code>git checkout main
git merge feature-branch
# CONFLICT (content): Merge conflict in index.html
# 手動編輯解決衝突...
git add index.html
git commit -m "Resolve merge conflict"</code></pre>
            </div>
            
            <button class="demo-button" onclick="showNextConflictStep()">
                <i class="fas fa-play"></i>
                查看衝突解決過程
            </button>
        </div>
    `;
}

function resolveConflictDemo() {
    const visualization = document.getElementById('mergeVisualization');
    
    visualization.innerHTML = `
        <div class="merge-scenario conflict-resolution">
            <h4>🛠️ 實際衝突解決演示</h4>
            <div class="conflict-file-demo">
                <h5>index.html 檔案中的衝突內容：</h5>
                <div class="code-editor">
                    <pre class="conflict-code"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Git 學習平台&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;
<span class="conflict-marker">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span>
<span class="conflict-ours">        歡迎使用我們的應用程式！</span>
<span class="conflict-marker">=======</span>
<span class="conflict-theirs">        歡迎使用我們的網站！</span>
<span class="conflict-marker">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-branch</span>
    &lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
                </div>
                
                <div class="resolution-steps">
                    <h5>解決步驟：</h5>
                    <div class="step-item">
                        <span class="step-number">1</span>
                        <span>找到衝突標記 (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>)</span>
                    </div>
                    <div class="step-item">
                        <span class="step-number">2</span>
                        <span>決定保留哪個版本或合併兩者</span>
                    </div>
                    <div class="step-item">
                        <span class="step-number">3</span>
                        <span>移除所有衝突標記</span>
                    </div>
                    <div class="step-item">
                        <span class="step-number">4</span>
                        <span>測試並提交解決方案</span>
                    </div>
                </div>
                
                <div class="resolution-demo">
                    <h5>解決後的檔案：</h5>
                    <div class="code-editor resolved">
                        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Git 學習平台&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;
        歡迎使用我們的應用程式和網站！
    &lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
                    </div>
                </div>
                
                <div class="final-commands">
                    <h5>完成合併：</h5>
                    <pre><code>git add index.html
git commit -m "Resolve merge conflict: combine app and website welcome messages"</code></pre>
                </div>
            </div>
        </div>
    `;
}

// 添加輔助函數來控制步驟顯示
function showNextFFStep() {
    const step1 = document.getElementById('ff-step-1');
    const step2 = document.getElementById('ff-step-2');
    
    if (step2.style.display === 'none') {
        step2.style.display = 'block';
        step2.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNextTWStep() {
    const step1 = document.getElementById('tw-step-1');
    const step2 = document.getElementById('tw-step-2');
    
    if (step2.style.display === 'none') {
        step2.style.display = 'block';
        step2.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNextConflictStep() {
    const step1 = document.getElementById('conflict-step-1');
    const step2 = document.getElementById('conflict-step-2');
    const step3 = document.getElementById('conflict-step-3');
    
    if (step2.style.display === 'none') {
        step2.style.display = 'block';
        step2.scrollIntoView({ behavior: 'smooth' });
        
        // 改變按鈕文字
        const button = document.querySelector('.demo-button');
        if (button) {
            button.innerHTML = '<i class="fas fa-play"></i> 查看最終結果';
            button.onclick = () => {
                step3.style.display = 'block';
                step3.scrollIntoView({ behavior: 'smooth' });
                button.innerHTML = '<i class="fas fa-tools"></i> 體驗衝突解決';
                button.onclick = resolveConflictDemo;
            };
        }
    }
}

function showCertificate() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.showMessage('🎆 恭喜！你已獲得 Git 基礎學習證書！繼續在實際專案中練習吧！', 'success');
    }
    
    // 可以在這裡添加生成證書的逻輯
    setTimeout(() => {
        if (confirm('是否要重新開始課程來復習？')) {
            restartCourse();
        }
    }, 2000);
}

function restartCourse() {
    const platform = window.gitPlatform;
    if (platform) {
        platform.switchToLesson('welcome');
        platform.completedLessons.clear();
        platform.updateProgress();
        platform.showMessage('🔄 課程已重新開始！', 'info');
    }
}