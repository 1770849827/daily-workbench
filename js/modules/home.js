/**
 * 首页模块
 */
const HomeModule = {
    STORAGE_WELCOME_KEY: 'home_welcome_index',
    STORAGE_WELCOME_DATE_KEY: 'home_welcome_date',
    _clockInterval: null,

    // 励志欢迎词
    QUOTES: [
        '新的一天，新的开始！',
        '自律即自由',
        '每一天都是新的机会',
        '坚持就是胜利',
        '今天也要加油鸭',
        '星光不问赶路人，时光不负有心人',
        '种一棵树最好的时间是十年前，其次是现在',
        '越努力越幸运',
        '不负韶华，只争朝夕',
        '你的坚持终将美好'
    ],

    render(container) {
        const now = new Date();
        const dateStr = this.formatLongDate(now);
        const welcome = this.getTodayWelcome();

        // 读取各模块数据
        const waterAmount = this.getTodayWater();
        const todoStats = this.getTodayTodoStats();
        const exerciseCalories = this.getTodayExerciseCalories();
        const foodInfo = this.getFoodEquivalent(exerciseCalories);
        const swimCount = this.getTotalSwimCount();

        let html = `
            <div style="text-align:center; margin-bottom:24px;">
                <div style="font-size:15px; color:var(--text-secondary); margin-bottom:4px;">${dateStr}</div>
                <div style="font-size:36px; font-weight:700; color:var(--primary); letter-spacing:1px;" id="homeClock">${this.formatClock(now)}</div>
            </div>

            <div class="card" style="text-align:center; margin-bottom:20px; background:linear-gradient(135deg, var(--primary), var(--primary-light)); color:white; border:none;">
                <div style="font-size:18px; font-weight:600; line-height:1.6;">${welcome}</div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
                ${this.renderStatBox('🥂', waterAmount + 'ml', '今日喝水', 'meal', waterAmount > 0, 'home_duck')}
                ${this.renderStatBox('🗒', todoStats.completed + '/' + todoStats.total, '今日待办', 'todo', todoStats.completed > 0, 'home_rabbit')}
                ${this.renderExerciseFoodBox(exerciseCalories, foodInfo, 'home_cat')}
                ${this.renderStatBox('🌊', swimCount + '次', '累计游泳', 'fitness', swimCount > 0, 'home_dog')}
            </div>

            <div class="card" style="text-align:center;">
                <div style="font-size:13px; color:var(--text-light); margin-bottom:8px;">快速操作</div>
                <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
                    <button class="btn btn-primary btn-sm" onclick="App.loadModule('todo')">📋 添加计划</button>
                    <button class="btn btn-sm" style="background:var(--primary-bg); color:var(--primary);" onclick="App.loadModule('english')">🌍 英语学习</button>
                    <button class="btn btn-sm" style="background:var(--primary-bg); color:var(--primary);" onclick="App.loadModule('fitness')">💪 开始锻炼</button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // 启动实时时钟
        this.startClock();
    },

    /**
     * 渲染统计小格子
     */
    renderStatBox(icon, value, label, module, filled, stickerName) {
        const borderStyle = App.cardBorderStyle(filled);
        const stickerImg = App.renderSticker(stickerName);
        return `
            <div class="card" style="position:relative; text-align:center; cursor:pointer; transition:0.2s; ${borderStyle}"
                 onclick="App.loadModule('${module}')"
                 onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='var(--shadow-md)';"
                 onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='var(--shadow-sm)';">
                <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${stickerImg}</div>
                <div style="font-size:28px; margin-bottom:4px;">${icon}</div>
                <div style="font-size:22px; font-weight:700; color:var(--primary);">${value}</div>
                <div style="font-size:12px; color:var(--text-light); margin-top:2px;">${label}</div>
            </div>
        `;
    },

    /**
     * 渲染运动消耗+食物对照格子（替换原来的"今日热量"格子）
     */
    renderExerciseFoodBox(calories, foodInfo, stickerName) {
        const filled = calories > 0;
        const borderStyle = App.cardBorderStyle(filled) + (filled ? ' background:#FFF8E1;' : '');
        const stickerImg = App.renderSticker(stickerName);
        if (filled) {
            return `
                <div class="card" style="position:relative; text-align:center; cursor:pointer; transition:0.2s; ${borderStyle}"
                     onclick="App.loadModule('fitness')"
                     onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='var(--shadow-md)';"
                     onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='var(--shadow-sm)';">
                    <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${stickerImg}</div>
                    <div style="font-size:24px; margin-bottom:4px;">🔥</div>
                    <div style="font-size:18px; font-weight:700; color:#E65100;">${calories} kcal</div>
                    <div style="font-size:11px; color:#BF360C; margin-top:3px; line-height:1.3;">≈ ${foodInfo.emoji}${foodInfo.text}</div>
                </div>
            `;
        }
        return `
            <div class="card" style="position:relative; text-align:center; cursor:pointer; transition:0.2s; ${borderStyle}"
                 onclick="App.loadModule('fitness')"
                 onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='var(--shadow-md)';"
                 onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='var(--shadow-sm)';">
                <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${stickerImg}</div>
                <div style="font-size:24px; margin-bottom:4px;">💪</div>
                <div style="font-size:16px; font-weight:700; color:var(--text-light);">去运动</div>
                <div style="font-size:11px; color:var(--text-light); margin-top:2px;">打卡查看消耗</div>
            </div>
        `;
    },

    /**
     * 启动实时时钟
     */
    startClock() {
        if (this._clockInterval) clearInterval(this._clockInterval);
        this._clockInterval = setInterval(() => {
            const el = document.getElementById('homeClock');
            if (el) {
                el.textContent = this.formatClock(new Date());
            } else {
                clearInterval(this._clockInterval);
                this._clockInterval = null;
            }
        }, 1000);
    },

    /**
     * 格式化长日期
     */
    formatLongDate(date) {
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日 ${weekdays[date.getDay()]}`;
    },

    /**
     * 格式化时钟
     */
    formatClock(date) {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${h}:${m}:${s}`;
    },

    /**
     * 获取今日欢迎词（同一天返回同一条）
     */
    getTodayWelcome() {
        const today = Storage.formatDate();
        let index = Storage.get(this.STORAGE_WELCOME_INDEX_KEY || this.STORAGE_WELCOME_KEY, 0);
        let savedDate = Storage.get(this.STORAGE_WELCOME_DATE_KEY, '');

        if (savedDate !== today) {
            // 新的一天，随机选一条
            index = Math.floor(Math.random() * this.QUOTES.length);
            Storage.set(this.STORAGE_WELCOME_KEY, index);
            Storage.set(this.STORAGE_WELCOME_DATE_KEY, today);
        }

        return this.QUOTES[index] || this.QUOTES[0];
    },

    /**
     * 获取今日喝水量(ml)
     */
    getTodayWater() {
        const records = Storage.get('meal_records', []);
        const today = Storage.formatDate();
        return records
            .filter(r => r.date === today && r.mealType === 'water')
            .reduce((sum, r) => sum + (parseInt(r.waterAmount) || 0), 0);
    },

    /**
     * 获取今日待办统计
     */
    getTodayTodoStats() {
        const todos = Storage.get('todos', []);
        const today = Storage.formatDate();
        const todayTodos = todos.filter(t => t.date === today);
        const completed = todayTodos.filter(t => t.completed).length;
        return { total: todayTodos.length, completed };
    },

    /**
     * 获取今日运动消耗热量(kcal) - 所有运动记录的calories字段求和
     */
    getTodayExerciseCalories() {
        const records = Storage.get('fitness_records', []);
        const today = Storage.formatDate();
        return records
            .filter(r => r.date === today)
            .reduce((sum, r) => sum + (parseInt(r.calories) || 0), 0);
    },

    /**
     * 累计游泳次数 - 统计所有 type==='swim' 的健身记录
     * （每条游泳打卡都已存为一条 swim 记录，无需改数据格式）
     */
    getTotalSwimCount() {
        const records = Storage.get('fitness_records', []);
        return records.filter(r => r.type === 'swim').length;
    },

    /**
     * 根据热量返回趣味食物对照（与 FitnessModule 保持一致）
     */
    getFoodEquivalent(calories) {
        const cal = parseInt(calories) || 0;
        if (cal <= 0) return { text: '还没有运动记录哦', emoji: '💪', foodCal: 0 };
        if (cal < 60) return { text: '半根香蕉', emoji: '🍌', foodCal: 50 };
        if (cal < 100) return { text: '一根小香蕉', emoji: '🍌', foodCal: 89 };
        if (cal < 150) return { text: '一块巧克力', emoji: '🍫', foodCal: 115 };
        if (cal < 200) return { text: '一根香蕉 + 一块巧克力', emoji: '🍌🍫', foodCal: 155 };
        if (cal < 280) return { text: '一碗米饭 + 一个煎蛋', emoji: '🍳🍚', foodCal: 260 };
        if (cal < 350) return { text: '一个汉堡', emoji: '🍔', foodCal: 300 };
        if (cal < 450) return { text: '一份炸鸡 + 一杯可乐', emoji: '🍗🥤', foodCal: 420 };
        return { text: '一个大份披萨', emoji: '🍕', foodCal: 550 };
    },

    /**
     * 获取今日摄入热量
     */
    getTodayCalories() {
        const records = Storage.get('meal_records', []);
        const today = Storage.formatDate();
        return records
            .filter(r => r.date === today && r.mealType !== 'water')
            .reduce((sum, r) => sum + (parseInt(r.calories) || 0), 0);
    },

    /**
     * 获取今日运动时长(分钟)
     */
    getTodayExercise() {
        const records = Storage.get('fitness_records', []);
        const today = Storage.formatDate();
        return records
            .filter(r => r.date === today)
            .reduce((sum, r) => sum + (parseInt(r.duration) || 0), 0);
    },

    /**
     * 页面卸载时清理时钟
     */
    destroy() {
        if (this._clockInterval) {
            clearInterval(this._clockInterval);
            this._clockInterval = null;
        }
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};
