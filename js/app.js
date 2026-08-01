/**
 * 主应用逻辑
 * 负责路由、导航、模块切换
 */

const App = {
    currentModule: 'home',
    modules: {},

    /**
     * 渲染暹罗厘普贴纸图片（所有模块共用）
     * @param {string} name - 贴纸名称: 'dog'|'cat'|'carrot'|'rabbit'|'duck'
     * @returns {string} HTML <img> 标签，若贴纸数据未加载则返回空字符串
     */
    renderSticker(name) {
        if (!window.STICKER_IMAGES || !window.STICKER_IMAGES[name]) return '';
        return `<img src="${window.STICKER_IMAGES[name]}" style="width:32px;height:32px;object-fit:contain;" alt="${name}" loading="lazy">`;
    },

    /**
     * 根据填写状态返回边框样式（实线=已填写 / 虚线=未填写）
     * @param {boolean} filled - 是否已填写/有数据
     * @returns {string} CSS border 样式
     */
    cardBorderStyle(filled) {
        return filled
            ? 'border:2px solid var(--border);'
            : 'border:2px dashed var(--border-light);';
    },

    init() {
        // 注册模块
        this.modules = {
            home: HomeModule,
            todo: TodoModule,
            english: EnglishModule,
            calligraphy: CalligraphyModule,
            fitness: FitnessModule,
            meal: MealModule,
            savings: SavingsModule,
            accounting: AccountingModule,
            places: PlacesModule,
            weekly: WeeklyModule,
            monthly: MonthlyModule
        };

        // 初始化导航
        this.initNavigation();

        // 初始化移动端菜单
        this.initMobileMenu();

        // 初始化模态框
        this.initModal();

        // 初始化导入导出
        this.initImportExport();

        // 初始化同步
        this.initSync();

        // 注册 Service Worker
        this.registerSW();

        // 初始化背景轮播（Chiikawa 壁纸，每日轮换）
        this.initBackground();

        // 设置封面图（比格多栋）
        this.setCoverImage();

        // 显示开屏画面
        this.showSplash();

        // 加载默认模块
        this.loadModule(this.currentModule);
    },

    /**
     * 初始化导航
     */
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const module = item.dataset.module;
                this.loadModule(module);

                // 移动端关闭侧边栏
                if (window.innerWidth <= 768) {
                    this.closeSidebar();
                }
            });
        });
    },

    /**
     * 加载模块
     */
    loadModule(moduleName) {
        this.currentModule = moduleName;

        // 更新导航高亮
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.module === moduleName);
        });

        // 更新标题
        const titles = {
            home: '首页',
            todo: '每日计划',
            english: '英语学习',
            calligraphy: '硬笔练字',
            fitness: '游泳健身',
            meal: '饮食记录',
            savings: '存钱计划',
            accounting: '每日记账',
            places: '我的足迹',
            weekly: '周报',
            monthly: '月报'
        };
        document.getElementById('pageTitle').textContent = titles[moduleName] || '生活工作台';

        // 渲染模块
        const module = this.modules[moduleName];
        const container = document.getElementById('mainContent');

        if (module && typeof module.render === 'function') {
            container.innerHTML = '';
            module.render(container);
        }
    },

    /**
     * 移动端菜单
     */
    initMobileMenu() {
        const toggle = document.getElementById('menuToggle');
        const overlay = document.getElementById('overlay');

        toggle.addEventListener('click', () => this.toggleSidebar());
        overlay.addEventListener('click', () => this.closeSidebar());
    },

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    },

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    },

    /**
     * 模态框
     */
    initModal() {
        const overlay = document.getElementById('modalOverlay');
        const closeBtn = document.getElementById('modalClose');

        closeBtn.addEventListener('click', () => this.closeModal());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });
    },

    openModal(title, bodyHTML) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = bodyHTML;
        document.getElementById('modalOverlay').classList.add('active');
    },

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    },

    /**
     * 导入导出
     */
    initImportExport() {
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    Storage.importAll(data);
                    this.showToast('数据导入成功！', 'success');
                    setTimeout(() => location.reload(), 1000);
                } catch (err) {
                    this.showToast('导入失败：文件格式错误', 'error');
                }
            };
            reader.readAsText(file);
        });
    },

    async exportData() {
        const data = Storage.getAll();
        const images = await Storage.getAllImages();

        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: data,
            images: images
        };

        const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `生活工作台_备份_${Storage.formatDate()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('数据导出成功！', 'success');
    },

    /**
     * 同步
     */
    initSync() {
        document.getElementById('syncBtn').addEventListener('click', async () => {
            await Sync.sync();
        });
    },

    /**
     * 注册 Service Worker
     */
    async registerSW() {
        if ('serviceWorker' in navigator) {
            try {
                const reg = await navigator.serviceWorker.register('service-worker.js');
                // 检测 SW 更新：新版本安装完成后提示用户刷新
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // 有新版本且当前有活跃的 SW → 提示用户
                                this.showToast('🎉 发现新版本，点击刷新更新', 'success');
                                // 3秒后自动刷新
                                setTimeout(() => location.reload(), 3000);
                            }
                        });
                    }
                });
            } catch (e) {
                console.warn('SW registration failed:', e);
            }
        }
    },

    /**
     * 背景轮播（Chiikawa 壁纸，按星期几每日轮换）
     */
    initBackground() {
        const el = document.getElementById('bg-layer');
        if (!el) return;
        const imgs = window.BACKGROUND_IMAGES;
        if (!imgs || !imgs.length) return;
        // 星期天=0 ... 星期六=6，对图片数量取模 → 每天一张，自动轮换
        const idx = new Date().getDay() % imgs.length;
        // 叠加一层柔和米色蒙版，保证卡片与文字清晰可读
        const overlay = 'linear-gradient(rgba(250,247,242,0.55), rgba(250,247,242,0.66))';
        el.style.backgroundImage = overlay + ', url(' + imgs[idx] + ')';
        // 淡入
        requestAnimationFrame(() => { el.style.opacity = '1'; });
    },

    /**
     * 设置封面图（暹罗厘普 比格多栋）
     */
    setCoverImage() {
        const img = document.getElementById('coverLogo');
        if (img && window.COVER_IMAGE) {
            img.src = window.COVER_IMAGE;
            img.onerror = function() { this.style.display = 'none'; };
        }
    },

    /**
     * 显示开屏画面（全员粉色爱心合照，1.5s后淡出）
     * 兜底：最多3秒后强制显示主界面（防止白屏）
     */
    showSplash() {
        const el = document.getElementById('splash-screen');
        const app = document.getElementById('app');

        // 兜底：无论 splash 是否成功，3秒后强制隐藏开屏
        const forceShow = setTimeout(() => {
            if (el) { el.classList.add('fade-out', 'hidden'); }
        }, 3000);

        if (!el || !window.SPLASH_IMAGE) {
            // 没有 splash 图片 → 直接隐藏
            clearTimeout(forceShow);
            if (el) el.classList.add('hidden');
            return;
        }

        el.style.backgroundImage = 'url(' + window.SPLASH_IMAGE + ')';
        // 1.5秒后开始淡出
        setTimeout(() => {
            clearTimeout(forceShow);
            el.classList.add('fade-out');
            // 淡出动画结束后隐藏开屏（释放 z-index）
            setTimeout(() => { el.classList.add('hidden'); }, 600);
        }, 1500);
    },

    /**
     * Toast 提示
     */
    showToast(message, type = '') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast show ' + type;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => App.init());
