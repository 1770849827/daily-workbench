/**
 * 游泳健身模块（含运动心情贴纸 + 彩色日历）
 */
const FitnessModule = {
    STORAGE_KEY: 'fitness_records',
    BODY_KEY: 'fitness_body_data',
    currentTab: 'swim',
    currentDate: new Date(),
    selectedDate: null,

    // 运动心情贴纸列表
    moodStickers: [
        { name: 'fit_dog_tired', label: '累成狗了' },
        { name: 'fit_rabbit_weights', label: '充满力量' },
        { name: 'fit_duck_yoga', label: '平静瑜伽' },
        { name: 'fit_cat_angry', label: '愤怒举铁' },
        { name: 'fit_carrot_gym', label: '坚持就是胜利' }
    ],

    // 运动类型配色（日历圆形背景）
    typeColors: {
        swim: '#88C6ED',     // 游泳 - 蓝色
        home: '#FFFACD',     // 居家运动 - 奶油黄
        rest: '#A8E6CF'      // 休息日 - 薄荷绿(指定色号)
    },

    getRecords() {
        return Storage.get(this.STORAGE_KEY, []);
    },

    saveRecords(records) {
        Storage.set(this.STORAGE_KEY, records);
    },

    getBodyData() {
        return Storage.get(this.BODY_KEY, []);
    },

    saveBodyData(data) {
        Storage.set(this.BODY_KEY, data);
    },

    render(container) {
        const records = this.getRecords();
        const bodyData = this.getBodyData();
        const today = Storage.formatDate();

        // 本周统计
        const weekStats = this.calculateWeekStats(records);

        // 今日运动
        const todayRecords = records.filter(r => r.date === today);

        // 最新身体数据
        const latestBody = bodyData.length > 0
            ? bodyData.sort((a, b) => b.date.localeCompare(a.date))[0]
            : null;

        let html = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">游泳健身</h2>
                    <p class="page-subtitle">坚持运动，遇见更好的自己</p>
                </div>
                <button class="btn btn-primary" onclick="FitnessModule.showAddForm()">➕ 运动打卡</button>
            </div>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--info);">${weekStats.count}</div>
                    <div class="stat-label">本周运动次数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${weekStats.duration}</div>
                    <div class="stat-label">本周时长（分）</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--danger);">${weekStats.calories}</div>
                    <div class="stat-label">本周消耗（kcal）</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--success);">${weekStats.monthDays}</div>
                    <div class="stat-label">本月运动天数</div>
                </div>
            </div>
        `;

        // 日历视图
        html += this.renderCalendar(records);

        // 今日运动区
        html += `
            <h3 style="margin: 16px 0 10px; font-size: 15px; color: var(--text-secondary);">今日运动</h3>
            <div class="tabs">
                <div class="tab ${this.currentTab === 'swim' ? 'active' : ''}" onclick="FitnessModule.switchTab('swim')">🏊 游泳</div>
                <div class="tab ${this.currentTab === 'home' ? 'active' : ''}" onclick="FitnessModule.switchTab('home')">🏠 居家锻炼</div>
                <div class="tab ${this.currentTab === 'rest' ? 'active' : ''}" onclick="FitnessModule.switchTab('rest')">😴 休息日</div>
            </div>
        `;

        if (todayRecords.length > 0) {
            const typeNames = { swim: '🏊 游泳', home: '🏠 居家锻炼', rest: '😴 休息日' };
            todayRecords.forEach(r => {
                html += `
                    <div class="list-item">
                        <span style="font-size:24px;">${r.type === 'swim' ? '🏊' : r.type === 'home' ? '🏠' : '😴'}</span>
                        <div style="flex:1;">
                            <div style="font-weight:500;">${typeNames[r.type] || r.type}</div>
                            <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">
                                ${r.type !== 'rest' ? `⏱ ${r.duration || 0}分钟 · 🔥 ${r.calories || 0}kcal` : '休息日'}
                                ${r.count && r.type !== 'rest' ? ` · ✅ ${r.count}次/趟` : ''}
                            </div>
                            ${r.note ? `<div style="font-size:12px; color:var(--text-light); margin-top:2px;">${this.escapeHtml(r.note)}</div>` : ''}
                            ${r.mood ? `<div style="margin-top:6px;">${App.renderSticker(r.mood)}</div>` : ''}
                        </div>
                        <div class="action-buttons">
                            <button class="action-btn danger" onclick="FitnessModule.delete('${r.id}')">删除</button>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `<div class="empty-state" style="padding:24px;"><div class="empty-state-text">今天还没有运动记录</div></div>`;
        }

        // 身体数据区
        html += `
            <h3 style="margin: 20px 0 10px; font-size: 15px; color: var(--text-secondary);">身体数据</h3>
            <div class="card" style="position:relative; ${App.cardBorderStyle(!!latestBody)}">
                <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g3_dog_cool2')}</div>
        `;

        if (latestBody) {
            const m = latestBody.measurements || {};
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div>
                        <div style="font-size:28px; font-weight:700; color:var(--primary);">${latestBody.weight || '-'} kg</div>
                        <div style="font-size:12px; color:var(--text-light);">${latestBody.date}</div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="FitnessModule.showBodyForm()">📋 记录数据</button>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(80px, 1fr)); gap:8px;">
                    ${this.renderMeasurement('胸围', m.chest)}
                    ${this.renderMeasurement('腰围', m.waist)}
                    ${this.renderMeasurement('臀围', m.hip)}
                    ${this.renderMeasurement('大腿', m.thigh)}
                    ${this.renderMeasurement('手臂', m.arm)}
                </div>
            `;
        } else {
            html += `
                <div class="empty-state" style="padding:24px;">
                    <div class="empty-state-text">还没有身体数据记录</div>
                </div>
                <button class="btn btn-primary" style="width:100%;" onclick="FitnessModule.showBodyForm()">📋 记录身体数据</button>
            `;
        }

        html += '</div>';

        // 本周时长柱状图
        html += this.renderWeekChart(records);

        // 运动历史
        html += `
            <h3 style="margin: 20px 0 10px; font-size: 15px; color: var(--text-secondary);">运动历史</h3>
        `;

        const recent = [...records].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt).slice(0, 20);

        if (recent.length === 0) {
            html += `<div class="empty-state"><div class="empty-state-icon">💪</div><div class="empty-state-text">还没有运动记录</div></div>`;
        } else {
            const groups = {};
            recent.forEach(r => {
                if (!groups[r.date]) groups[r.date] = [];
                groups[r.date].push(r);
            });

            const typeNames = { swim: '🏊 游泳', home: '🏠 居家锻炼', rest: '😴 休息日' };

            for (const [date, items] of Object.entries(groups)) {
                const d = new Date(date);
                const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
                const dayDuration = items.reduce((s, r) => s + (parseInt(r.duration) || 0), 0);
                const dayCalories = items.reduce((s, r) => s + (parseInt(r.calories) || 0), 0);

                html += `<div style="margin-bottom: 12px;">
                    <div style="display:flex; justify-content:space-between; font-size: 12px; color: var(--text-light); margin-bottom: 6px;">
                        <span>${d.getMonth() + 1}月${d.getDate()}日 周${weekDays[d.getDay()]}</span>
                        <span>${dayDuration}分钟 · ${dayCalories}kcal</span>
                    </div>`;

                items.forEach(r => {
                    html += `
                        <div class="list-item">
                            <span style="font-size:24px;">${r.type === 'swim' ? '🏊' : r.type === 'home' ? '🏠' : '😴'}</span>
                            <div style="flex:1;">
                                <div style="font-weight:500;">${typeNames[r.type] || r.type}</div>
                                <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">
                                    ${r.type !== 'rest' ? `⏱ ${r.duration || 0}分钟 · 🔥 ${r.calories || 0}kcal` : '休息日'}
                                    ${r.count && r.type !== 'rest' ? ` · ✅ ${r.count}次/趟` : ''}
                                </div>
                                ${r.note ? `<div style="font-size:12px; color:var(--text-light); margin-top:2px;">${this.escapeHtml(r.note)}</div>` : ''}
                                ${r.mood ? `<div style="margin-top:6px;">${App.renderSticker(r.mood)}</div>` : ''}
                            </div>
                            <div class="action-buttons">
                                <button class="action-btn danger" onclick="FitnessModule.delete('${r.id}')">删除</button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
        }

        container.innerHTML = html;
    },

    renderMeasurement(label, value) {
        return `
            <div style="text-align:center; padding:8px; background:var(--bg); border-radius:8px;">
                <div style="font-size:16px; font-weight:700; color:var(--text);">${value || '-'}</div>
                <div style="font-size:11px; color:var(--text-light);">${label}</div>
            </div>
        `;
    },

    renderWeekChart(records) {
        const now = new Date();
        const dayOfWeek = now.getDay() || 7; // 周一为1
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayOfWeek + 1);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dateStr = Storage.formatDate(d);
            const dayRecords = records.filter(r => r.date === dateStr && r.type !== 'rest');
            const duration = dayRecords.reduce((s, r) => s + (parseInt(r.duration) || 0), 0);
            days.push({
                label: ['一', '二', '三', '四', '五', '六', '日'][i],
                duration
            });
        }

        const maxDuration = Math.max(...days.map(d => d.duration), 60);

        let html = '<div class="chart-container">';
        html += '<div class="chart-title">本周运动时长（分钟）</div>';
        html += '<div style="display:flex; gap:8px; align-items:flex-end; height:100px; padding:0 10px;">';

        days.forEach(d => {
            const height = (d.duration / maxDuration) * 100;
            html += `
                <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <div style="font-size:11px; color:var(--text-light);">${d.duration > 0 ? d.duration : ''}</div>
                    <div style="width:100%; max-width:30px; height:70px; display:flex; align-items:flex-end;">
                        <div style="width:100%; height:${height}%; background:var(--info); border-radius:4px 4px 0 0; min-height:${d.duration > 0 ? '4px' : '0'};"></div>
                    </div>
                    <div style="font-size:11px; color:var(--text-light);">${d.label}</div>
                </div>
            `;
        });

        html += '</div></div>';
        return html;
    },

    switchTab(tab) {
        this.currentTab = tab;
        App.loadModule('fitness');
    },

    showAddForm() {
        const today = Storage.formatDate();
        const defaultDate = this.selectedDate || today;

        // 生成心情贴纸选择器 HTML
        const moodOptions = this.moodStickers.map((s, i) => `
            <div class="mood-option ${i === 0 ? 'selected' : ''}" data-mood="${s.name}" onclick="FitnessModule.selectMood(this)" title="${s.label}">
                ${App.renderSticker(s.name)}
            </div>
        `).join('');

        const html = `
            <form onsubmit="FitnessModule.save(event)">
                <div class="form-group">
                    <label class="form-label">训练项目</label>
                    <select class="form-select" id="fitType" onchange="FitnessModule.onTypeChange()">
                        <option value="swim" ${this.currentTab === 'swim' ? 'selected' : ''}>🏊 游泳</option>
                        <option value="home" ${this.currentTab === 'home' ? 'selected' : ''}>🏠 居家锻炼</option>
                        <option value="rest" ${this.currentTab === 'rest' ? 'selected' : ''}>😴 休息日</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">日期</label>
                    <input type="date" class="form-input" id="fitDate" value="${defaultDate}">
                </div>
                <div id="fitDetailFields">
                    <div class="form-group">
                        <label class="form-label">运动时长（分钟）</label>
                        <input type="number" class="form-input" id="fitDuration" placeholder="如 60" min="1" oninput="FitnessModule.updateCalorieUI()" onchange="FitnessModule.updateCalorieUI()">
                    </div>
                    <div class="form-group">
                        <label class="form-label">消耗热量（kcal）</label>
                        <input type="number" class="form-input" id="fitCalories" placeholder="可手动填写或自动估算">
                        <div id="calorieBox" style="border-radius:14px; background:#FFF8E1; border:2px dashed #FFCC80; padding:18px 12px; margin-top:10px; text-align:center;">
                            <div style="font-size:15px; color:#E65100;">🔥 输入运动时长查看热量消耗</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">完成次数 / 趟数</label>
                        <input type="number" class="form-input" id="fitCount" placeholder="如 20（选填）" min="0">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">💖 今日运动心情（选一张代表你的感受）</label>
                    <div id="moodPicker" style="display:flex; gap:10px; flex-wrap:wrap; padding:10px; background:var(--primary-bg); border-radius:14px;">
                        ${moodOptions}
                    </div>
                    <input type="hidden" id="fitMood" value="fit_dog_tired">
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <textarea class="form-textarea" id="fitNote" placeholder="运动感受..." style="min-height:60px;"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">打卡</button>
            </form>
        `;
        App.openModal('运动打卡', html);

        // 根据初始类型显示/隐藏详情字段
        this.onTypeChange();

        // 弹窗打开后自动触发一次热量计算
        setTimeout(() => { this.updateCalorieUI(); }, 100);
    },

    // 切换运动类型时显示/隐藏字段
    onTypeChange() {
        const type = document.getElementById('fitType').value;
        const detailFields = document.getElementById('fitDetailFields');
        if (detailFields) {
            detailFields.style.display = type === 'rest' ? 'none' : 'block';
        }
        if (type !== 'rest') {
            setTimeout(() => { this.updateCalorieUI(); }, 50);
        }
    },

    // 选择心情贴纸
    selectMood(el) {
        document.querySelectorAll('.mood-option').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('fitMood').value = el.dataset.mood;
    },

    // 根据运动类型与时长计算消耗热量（kcal）
    // 游泳约 8 kcal/分钟（中等强度），居家锻炼约 5 kcal/分钟
    calculateCalories(type, duration) {
        const rate = type === 'swim' ? 8 : 5;
        return Math.round((parseInt(duration) || 0) * rate);
    },

    // 根据热量返回趣味食物对照文案（带emoji和精确卡路里）
    getFoodEquivalent(calories) {
        const cal = parseInt(calories) || 0;
        if (cal <= 0) return { text: '输入时长查看', emoji: '', foodCal: 0 };
        if (cal < 60) return { text: '半根香蕉', emoji: '🍌', foodCal: 50 };
        if (cal < 100) return { text: '一根小香蕉', emoji: '🍌', foodCal: 89 };
        if (cal < 150) return { text: '一块巧克力', emoji: '🍫', foodCal: 115 };
        if (cal < 200) return { text: '一根香蕉 + 一块巧克力', emoji: '🍌🍫', foodCal: 155 };
        if (cal < 280) return { text: '一碗米饭 + 一个煎蛋', emoji: '🍳🍚', foodCal: 260 };
        if (cal < 350) return { text: '一个汉堡', emoji: '🍔', foodCal: 300 };
        if (cal < 450) return { text: '一份炸鸡 + 一杯可乐', emoji: '🍗🥤', foodCal: 420 };
        return { text: '一个大份披萨', emoji: '🍕', foodCal: 550 };
    },

    // 实时更新热量估算输入框与"热量消耗方框"（匹配截图样式）
    updateCalorieUI() {
        const typeEl = document.getElementById('fitType');
        const durEl = document.getElementById('fitDuration');
        const box = document.getElementById('calorieBox');
        const calInput = document.getElementById('fitCalories');

        if (!box || !typeEl || !durEl) return;

        const type = typeEl.value;
        const duration = parseInt(durEl.value) || 0;

        if (!duration) {
            box.style.cssText = 'border-radius:14px; background:#FFF8E1; border:2px dashed #FFCC80; padding:18px 12px; margin-top:10px; text-align:center;';
            box.innerHTML = '<div style="font-size:15px; color:#E65100;">🔥 输入运动时长查看热量消耗</div>';
            if (calInput) { calInput.value = ''; }
            return;
        }

        const cal = this.calculateCalories(type, duration);
        const food = this.getFoodEquivalent(cal);
        box.style.cssText = 'border-radius:14px; background:#FFF8E1; border:2px dashed #FFCC80; padding:18px 12px; margin-top:10px; text-align:center;';
        box.innerHTML =
            '<div style="font-size:15px; color:#795548; margin-bottom:6px;">今日运动消耗 <b style="font-size:22px; color:#E65100;">' + cal + '</b> kcal</div>' +
            '<div style="font-size:14px; color:#BF360C;">≈ 相当于吃了 ' + food.emoji + ' ' + food.text + ' （' + food.foodCal + ' kcal）</div>';

        // 强制填充热量输入框（多种方式兼容手机浏览器）
        if (calInput) {
            calInput.value = String(cal);
            // 部分手机浏览器需要 setAttribute
            calInput.setAttribute('value', String(cal));
        }
    },

    updateCalorieEstimate() {
        this.updateCalorieUI();
    },

    estimateCalories() {
        this.updateCalorieUI();
    },

    save(event) {
        event.preventDefault();

        const _type = document.getElementById('fitType').value;
        const _mood = document.getElementById('fitMood').value;

        // 休息日不需要时长和热量
        const _duration = _type === 'rest' ? 0 : (parseInt(document.getElementById('fitDuration').value) || 0);
        const _calVal = _type === 'rest' ? 0 : parseInt(document.getElementById('fitCalories').value);
        const _calories = _type === 'rest' ? 0 : (_calVal ? _calVal : this.calculateCalories(_type, _duration));
        const _count = _type === 'rest' ? 0 : (parseInt(document.getElementById('fitCount').value) || 0);

        const record = {
            id: Storage.generateId(),
            type: _type,
            date: document.getElementById('fitDate').value,
            duration: _duration,
            calories: _calories,
            count: _count,
            note: document.getElementById('fitNote').value,
            mood: _mood,
            createdAt: Date.now()
        };

        const records = this.getRecords();
        records.push(record);
        this.saveRecords(records);

        this.currentTab = record.type;

        App.closeModal();
        App.showToast('运动打卡成功！', 'success');
        App.loadModule('fitness');
    },

    showBodyForm() {
        const bodyData = this.getBodyData();
        const latest = bodyData.length > 0
            ? bodyData.sort((a, b) => b.date.localeCompare(a.date))[0]
            : null;
        const m = latest && latest.measurements || {};

        const html = `
            <form onsubmit="FitnessModule.saveBody(event)">
                <div class="form-group">
                    <label class="form-label">日期</label>
                    <input type="date" class="form-input" id="bodyDate" value="${Storage.formatDate()}">
                </div>
                <div class="form-group">
                    <label class="form-label">体重（kg）</label>
                    <input type="number" class="form-input" id="bodyWeight" value="${latest && latest.weight || ''}" placeholder="如 65.5" step="0.1">
                </div>
                <div style="font-size:13px; font-weight:600; color:var(--text-secondary); margin-bottom:8px;">围度记录（cm，选填）</div>
                <div class="form-group">
                    <label class="form-label">胸围</label>
                    <input type="number" class="form-input" id="bodyChest" value="${m.chest || ''}" placeholder="如 90" step="0.1">
                </div>
                <div class="form-group">
                    <label class="form-label">腰围</label>
                    <input type="number" class="form-input" id="bodyWaist" value="${m.waist || ''}" placeholder="如 75" step="0.1">
                </div>
                <div class="form-group">
                    <label class="form-label">臀围</label>
                    <input type="number" class="form-input" id="bodyHip" value="${m.hip || ''}" placeholder="如 95" step="0.1">
                </div>
                <div class="form-group">
                    <label class="form-label">大腿围</label>
                    <input type="number" class="form-input" id="bodyThigh" value="${m.thigh || ''}" placeholder="如 50" step="0.1">
                </div>
                <div class="form-group">
                    <label class="form-label">手臂围</label>
                    <input type="number" class="form-input" id="bodyArm" value="${m.arm || ''}" placeholder="如 30" step="0.1">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">保存数据</button>
            </form>
        `;
        App.openModal('记录身体数据', html);
    },

    saveBody(event) {
        event.preventDefault();

        const record = {
            id: Storage.generateId(),
            date: document.getElementById('bodyDate').value,
            weight: parseFloat(document.getElementById('bodyWeight').value) || null,
            measurements: {
                chest: parseFloat(document.getElementById('bodyChest').value) || null,
                waist: parseFloat(document.getElementById('bodyWaist').value) || null,
                hip: parseFloat(document.getElementById('bodyHip').value) || null,
                thigh: parseFloat(document.getElementById('bodyThigh').value) || null,
                arm: parseFloat(document.getElementById('bodyArm').value) || null
            },
            createdAt: Date.now()
        };

        const bodyData = this.getBodyData();
        bodyData.push(record);
        this.saveBodyData(bodyData);

        App.closeModal();
        App.showToast('身体数据已保存', 'success');
        App.loadModule('fitness');
    },

    delete(id) {
        if (!confirm('确定删除这条记录吗？')) return;
        let records = this.getRecords();
        records = records.filter(r => r.id !== id);
        this.saveRecords(records);
        App.showToast('已删除', 'success');
        App.loadModule('fitness');
    },

    calculateWeekStats(records) {
        const now = new Date();
        const dayOfWeek = now.getDay() || 7;
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayOfWeek + 1);
        monday.setHours(0, 0, 0, 0);

        // 排除休息日，只统计真正的运动记录
        const weekRecords = records.filter(r => new Date(r.date) >= monday && r.type !== 'rest');

        const count = weekRecords.length;
        const duration = weekRecords.reduce((s, r) => s + (parseInt(r.duration) || 0), 0);
        const calories = weekRecords.reduce((s, r) => s + (parseInt(r.calories) || 0), 0);

        // 本月运动天数（排除休息日）
        const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const monthDays = new Set(
            records.filter(r => r.date.startsWith(monthPrefix) && r.type !== 'rest').map(r => r.date)
        ).size;

        return { count, duration, calories, monthDays };
    },

    // 根据运动类型集合生成日期格子的圆形背景样式
    getFillStyle(types) {
        const colors = types.map(t => this.typeColors[t] || '#88C6ED');
        if (colors.length === 1) return `background:${colors[0]};`;
        // 多类型：用渐变拼接，一眼看出当天有多种运动
        return `background:linear-gradient(135deg, ${colors.join(', ')});`;
    },

    // 根据底色亮度返回可读的文字颜色（浅底用深色字，深底用白色字）
    getContrast(hex) {
        const h = (hex || '#88C6ED').replace('#', '');
        const r = parseInt(h.substr(0, 2), 16);
        const g = parseInt(h.substr(2, 2), 16);
        const b = parseInt(h.substr(4, 2), 16);
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return lum > 0.8 ? '#5D4037' : '#FFFFFF';
    },

    /**
     * ===== 日历视图（整格圆形背景版）=====
     * 游泳=蓝色#88C6ED · 居家=奶油黄#FFFACD · 休息日=薄荷绿#A8E6CF
     * 有打卡的日期用对应颜色的圆形背景填充，比小圆点更醒目
     */
    renderCalendar(records) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = Storage.formatDate();

        // 按日期分组记录，取每种类型的第一个
        const dateTypeMap = {}; // dateStr -> Set of types
        records.forEach(r => {
            if (!dateTypeMap[r.date]) dateTypeMap[r.date] = new Set();
            dateTypeMap[r.date].add(r.type);
        });

        let html = `
            <div class="card" style="margin-top:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <button class="action-btn" onclick="FitnessModule.prevMonth()">‹ 上月</button>
                    <h3 style="font-size:16px; font-weight:700;">${year}年${month + 1}月</h3>
                    <div style="display:flex; gap:4px;">
                        <button class="action-btn" onclick="FitnessModule.nextMonth()">下月 ›</button>
                        <button class="btn btn-sm" style="background:var(--primary-bg); color:var(--primary); font-size:11px;" onclick="FitnessModule.goToday()">回到今天</button>
                    </div>
                </div>
                <div class="calendar-grid">
                    <div class="calendar-header">日</div>
                    <div class="calendar-header">一</div>
                    <div class="calendar-header">二</div>
                    <div class="calendar-header">三</div>
                    <div class="calendar-header">四</div>
                    <div class="calendar-header">五</div>
                    <div class="calendar-header">六</div>
        `;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();

        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<div class="calendar-day other-month">${prevMonthDays - i}</div>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = dateStr === today ? 'today' : '';
            const isSelected = dateStr === this.selectedDate ? 'selected' : '';

            // 有打卡记录的日期：整格圆形背景填充对应颜色
            if (dateTypeMap[dateStr]) {
                const types = Array.from(dateTypeMap[dateStr]);
                const bg = this.getFillStyle(types);
                const txt = this.getContrast(types[0]);
                const inner = `<div class="cal-fill" style="${bg}"><span style="color:${txt};">${d}</span></div>`;
                html += `<div class="calendar-day has-fill ${isToday} ${isSelected}"
                              onclick="FitnessModule.selectDate('${dateStr}')">${inner}</div>`;
            } else {
                html += `<div class="calendar-day ${isToday} ${isSelected}"
                              onclick="FitnessModule.selectDate('${dateStr}')"><span class="cal-num">${d}</span></div>`;
            }
        }

        const totalCells = firstDay + daysInMonth;
        const remaining = (7 - (totalCells % 7)) % 7;
        for (let d = 1; d <= remaining; d++) {
            html += `<div class="calendar-day other-month">${d}</div>`;
        }

        // 图例
        html += `
                </div>
                <div style="display:flex; justify-content:center; gap:16px; margin-top:10px; font-size:11px; color:var(--text-secondary);">
                    <span style="display:flex; align-items:center; gap:4px;"><span class="cal-dot" style="background:#88C6ED;"></span>游泳</span>
                    <span style="display:flex; align-items:center; gap:4px;"><span class="cal-dot" style="background:#FFFACD; border:1px solid #E0E0E0;"></span>居家</span>
                    <span style="display:flex; align-items:center; gap:4px;"><span class="cal-dot" style="background:#A8E6CF;"></span>休息</span>
                </div>
            </div>
        `;

        if (this.selectedDate) {
            const dayRecords = records.filter(r => r.date === this.selectedDate);
            html += this.renderDayDetail(this.selectedDate, dayRecords);
        }

        return html;
    },

    selectDate(date) {
        this.selectedDate = date;
        App.loadModule('fitness');
    },

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.selectedDate = null;
        App.loadModule('fitness');
    },

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.selectedDate = null;
        App.loadModule('fitness');
    },

    goToday() {
        this.currentDate = new Date();
        this.selectedDate = Storage.formatDate();
        App.loadModule('fitness');
    },

    renderDayDetail(date, dayRecords) {
        const d = new Date(date);
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        const today = Storage.formatDate();
        const isToday = date === today;

        const totalDuration = dayRecords.reduce((s, r) => s + (parseInt(r.duration) || 0), 0);
        const totalCalories = dayRecords.reduce((s, r) => s + (parseInt(r.calories) || 0), 0);
        const totalCount = dayRecords.reduce((s, r) => s + (parseInt(r.count) || 0), 0);

        const typeNames = { swim: '🏊 游泳', home: '🏠 居家锻炼', rest: '😴 休息日' };

        let html = `
            <div class="card" style="margin-top:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-size:16px; font-weight:700;">
                        ${d.getMonth() + 1}月${d.getDate()}日 周${weekDays[d.getDay()]}
                        ${isToday ? '<span class="tag tag-info" style="margin-left:6px;">今天</span>' : ''}
                    </h3>
                    <button class="btn btn-primary btn-sm" onclick="FitnessModule.showAddFormForDate('${date}')">➕ 打卡</button>
                </div>
        `;

        if (dayRecords.length === 0) {
            html += '<div class="empty-state" style="padding:16px;"><div class="empty-state-text">当天没有运动记录</div></div>';
        } else {
            html += `
                <div style="display:flex; gap:12px; margin-bottom:12px; flex-wrap:wrap;">
                    <div style="flex:1; min-width:80px; text-align:center; padding:10px; background:var(--primary-bg); border-radius:8px;">
                        <div style="font-size:20px; font-weight:700; color:var(--primary);">${totalDuration}</div>
                        <div style="font-size:11px; color:var(--text-light);">总时长（分）</div>
                    </div>
                    <div style="flex:1; min-width:80px; text-align:center; padding:10px; background:#FFE3E3; border-radius:8px;">
                        <div style="font-size:20px; font-weight:700; color:var(--danger);">${totalCalories}</div>
                        <div style="font-size:11px; color:var(--text-light);">消耗热量（kcal）</div>
                    </div>
                    ${totalCount > 0 ? `
                    <div style="flex:1; min-width:80px; text-align:center; padding:10px; background:#D3F9D8; border-radius:8px;">
                        <div style="font-size:20px; font-weight:700; color:var(--success);">${totalCount}</div>
                        <div style="font-size:11px; color:var(--text-light);">总次数/趟</div>
                    </div>` : ''}
                </div>
            `;

            dayRecords.forEach(r => {
                html += `
                    <div class="list-item">
                        <span style="font-size:24px;">${r.type === 'swim' ? '🏊' : r.type === 'home' ? '🏠' : '😴'}</span>
                        <div style="flex:1;">
                            <div style="font-weight:500;">${typeNames[r.type] || r.type}</div>
                            <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">
                                ${r.type !== 'rest' ? `⏱ ${r.duration || 0}分钟 · 🔥 ${r.calories || 0}kcal` : '好好休息~'}
                                ${r.count && r.type !== 'rest' ? ` · ✅ ${r.count}次/趟` : ''}
                            </div>
                            ${r.note ? `<div style="font-size:12px; color:var(--text-light); margin-top:2px;">${this.escapeHtml(r.note)}</div>` : ''}
                            ${r.mood ? `<div style="margin-top:6px;">${App.renderSticker(r.mood)}</div>` : ''}
                        </div>
                        <div class="action-buttons">
                            <button class="action-btn danger" onclick="FitnessModule.delete('${r.id}')">删除</button>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';
        return html;
    },

    showAddFormForDate(date) {
        this.selectedDate = date;
        this.showAddForm();
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};
