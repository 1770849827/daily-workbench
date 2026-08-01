/**
 * 饮食记录模块（含喝水记录、热量记录）
 */
const MealModule = {
    STORAGE_KEY: 'meal_records',

    getRecords() {
        return Storage.get(this.STORAGE_KEY, []);
    },

    saveRecords(records) {
        Storage.set(this.STORAGE_KEY, records);
    },

    render(container) {
        const records = this.getRecords();
        const today = Storage.formatDate();
        const todayRecords = records.filter(r => r.date === today);

        // 今日三餐
        const todayMeals = todayRecords.filter(r => r.mealType !== 'water');
        const todayCalories = todayMeals.reduce((s, r) => s + (parseFloat(r.calories) || 0), 0);
        const mealCount = todayMeals.length;

        // 今日喝水
        const todayWater = todayRecords.filter(r => r.mealType === 'water')
            .reduce((s, r) => s + (parseInt(r.waterAmount) || 0), 0);

        // 本周平均热量
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekMealRecords = records.filter(r => r.mealType !== 'water' && new Date(r.date) >= weekAgo);
        const weekDays = new Set(weekMealRecords.map(r => r.date)).size || 1;
        const weekAvgCalories = Math.round(weekMealRecords.reduce((s, r) => s + (parseFloat(r.calories) || 0), 0) / weekDays);

        const calorieGoal = 2000;

        let html = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">饮食记录</h2>
                    <p class="page-subtitle">记录每一餐，健康每一天</p>
                </div>
                <button class="btn btn-primary" onclick="MealModule.quickRecord('breakfast')">➕ 记录</button>
            </div>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--danger);">${todayCalories}</div>
                    <div class="stat-label">今日热量(kcal)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--info);">${todayWater}</div>
                    <div class="stat-label">今日喝水(ml)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${weekAvgCalories}</div>
                    <div class="stat-label">本周均热量</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--success);">${mealCount}/3</div>
                    <div class="stat-label">今日餐次</div>
                </div>
            </div>

            <!-- 喝水记录 -->
            <div class="card" style="margin-bottom:16px; ${App.cardBorderStyle(todayWater > 0)} position:relative;">
                <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g3_duck_alone')}</div>
                <h3 style="font-size:15px; margin-bottom:12px;">💧 喝水记录</h3>
                <div style="text-align:center; margin-bottom:12px;">
                    <div style="font-size:32px; font-weight:700; color:var(--info);">${todayWater}ml</div>
                    <div style="font-size:13px; color:var(--text-light);">目标 2000ml</div>
                </div>
                <div class="progress-bar" style="height:12px; margin-bottom:12px;">
                    <div class="progress-fill" style="width:${Math.min(todayWater/2000*100,100)}%; background:var(--info);"></div>
                </div>
                <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
                    <button class="btn btn-sm" style="background:#E3F2FD; color:var(--info);" onclick="MealModule.addWater(200)">💧 200ml</button>
                    <button class="btn btn-sm" style="background:#E3F2FD; color:var(--info);" onclick="MealModule.addWater(300)">💧 300ml</button>
                    <button class="btn btn-sm" style="background:#E3F2FD; color:var(--info);" onclick="MealModule.addWater(500)">💧 500ml</button>
                    <button class="btn btn-sm" style="background:#E3F2FD; color:var(--info);" onclick="MealModule.showWaterForm()">🔢 自定义</button>
                </div>
            </div>

            <!-- 三餐记录区 -->
            <h3 style="margin:16px 0 10px; font-size:15px; color:var(--text-secondary);">今日三餐</h3>
            <div class="card-grid card-grid-3">
                ${this.renderMealCard('breakfast', '🌅 早餐', todayMeals)}
                ${this.renderMealCard('lunch', '☀️ 午餐', todayMeals)}
                ${this.renderMealCard('dinner', '🌙 晚餐', todayMeals)}
            </div>

            <!-- 每日热量摄入 -->
            <div class="card" style="margin-top:16px; ${App.cardBorderStyle(todayCalories > 0)} position:relative;">
                <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g3_cat_chiikawa')}</div>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span style="font-size:14px; font-weight:600;">🔥 今日热量摄入</span>
                    <span style="font-size:14px;">${todayCalories} / ${calorieGoal} kcal</span>
                </div>
                <div class="progress-bar" style="height:10px;">
                    <div class="progress-fill" style="width:${Math.min(todayCalories/calorieGoal*100,100)}%; background:${todayCalories > calorieGoal ? 'var(--danger)' : 'var(--success)'};"></div>
                </div>
                ${todayCalories > calorieGoal ? '<div style="font-size:12px; color:var(--danger); margin-top:6px;">⚠️ 已超出今日热量目标</div>' : ''}
            </div>

            <!-- 历史记录 -->
            <h3 style="margin:20px 0 10px; font-size:15px; color:var(--text-secondary);">最近记录</h3>
        `;

        const allRecords = records.filter(r => r.mealType !== 'water');
        if (allRecords.length === 0 && todayRecords.filter(r => r.mealType === 'water').length === 0) {
            html += `<div class="empty-state"><div class="empty-state-icon">🍽️</div><div class="empty-state-text">还没有饮食记录</div></div>`;
        } else {
            const recent = [...records].sort((a, b) => b.createdAt - a.createdAt).slice(0, 30);
            const groups = {};
            recent.forEach(r => {
                if (!groups[r.date]) groups[r.date] = [];
                groups[r.date].push(r);
            });

            const mealNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', water: '喝水' };
            const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', water: '💧' };

            for (const [date, items] of Object.entries(groups)) {
                const d = new Date(date);
                const weekDays = ['日','一','二','三','四','五','六'];
                const dayCalories = items.filter(r => r.mealType !== 'water').reduce((s, r) => s + (parseFloat(r.calories) || 0), 0);
                html += `<div style="margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-light); margin-bottom:6px;">
                        <span>${d.getMonth()+1}月${d.getDate()}日 周${weekDays[d.getDay()]}</span>
                        ${dayCalories > 0 ? `<span>${dayCalories} kcal</span>` : ''}
                    </div>`;
                items.forEach(r => {
                    if (r.mealType === 'water') {
                        html += `
                            <div class="list-item">
                                <span style="font-size:24px;">💧</span>
                                <div style="flex:1;">
                                    <div style="font-weight:500;">喝水 ${r.waterAmount||0}ml</div>
                                    ${r.time ? `<div style="font-size:12px; color:var(--text-light);">⏰ ${r.time}</div>` : ''}
                                </div>
                                <div class="action-buttons">
                                    <button class="action-btn danger" onclick="MealModule.delete('${r.id}')">删除</button>
                                </div>
                            </div>`;
                    } else {
                        html += `
                            <div class="list-item">
                                <span style="font-size:24px;">${mealIcons[r.mealType]}</span>
                                <div style="flex:1;">
                                    <div style="font-weight:500;">${mealNames[r.mealType]} ${r.calories ? `<span class="tag tag-info">${r.calories}kcal</span>` : ''}</div>
                                    ${r.description ? `<div style="font-size:13px; color:var(--text-light); margin-top:4px;">${this.escapeHtml(r.description)}</div>` : ''}
                                    ${r.time ? `<div style="font-size:12px; color:var(--text-light);">⏰ ${r.time}</div>` : ''}
                                </div>
                                ${r.imageId ? `<img src="" id="meal-img-${r.imageId}" style="width:50px; height:50px; border-radius:8px; object-fit:cover; cursor:pointer;" onclick="MealModule.viewImage('${r.imageId}')">` : ''}
                                <div class="action-buttons">
                                    <button class="action-btn danger" onclick="MealModule.delete('${r.id}')">删除</button>
                                </div>
                            </div>`;
                    }
                });
                html += '</div>';
            }
        }

        container.innerHTML = html;

        if (records.length > 0) {
            records.forEach(r => { if (r.imageId) this.loadImage(r.imageId); });
        }
    },

    renderMealCard(mealType, label, todayMeals) {
        const record = todayMeals.find(r => r.mealType === mealType);
        const calories = record ? (record.calories || 0) : 0;
        const hasRecord = !!record;
        const stickerMap = { breakfast: 'g1_rabbit_carrot2', lunch: 'g3_carrot_standing', dinner: 'g1_cat_carrot_hold' };

        return `
            <div class="card" style="text-align:center; cursor:pointer; position:relative; ${App.cardBorderStyle(hasRecord)}"
                 onclick="MealModule.quickRecord('${mealType}')">
                <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker(stickerMap[mealType] || 'carrot')}</div>
                <div style="font-size:32px; margin-bottom:8px;">${hasRecord ? '✅' : label.split(' ')[0]}</div>
                <div style="font-weight:600;">${label.split(' ')[1]}</div>
                <div style="font-size:13px; margin-top:4px; color:${hasRecord ? 'var(--success)' : 'var(--text-light)'};">
                    ${hasRecord ? `${calories} kcal` : '点击记录'}
                </div>
            </div>
        `;
    },

    quickRecord(mealType) {
        const today = Storage.formatDate();
        const now = Storage.formatTime();
        const mealNames = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };

        const html = `
            <form onsubmit="MealModule.save(event)">
                <div class="form-group">
                    <label class="form-label">餐次</label>
                    <select class="form-select" id="mealType">
                        <option value="breakfast" ${mealType==='breakfast'?'selected':''}>🌅 早餐</option>
                        <option value="lunch" ${mealType==='lunch'?'selected':''}>☀️ 午餐</option>
                        <option value="dinner" ${mealType==='dinner'?'selected':''}>🌙 晚餐</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">日期</label>
                    <input type="date" class="form-input" id="mealDate" value="${today}">
                </div>
                <div class="form-group">
                    <label class="form-label">时间</label>
                    <input type="time" class="form-input" id="mealTime" value="${now}">
                </div>
                <div class="form-group">
                    <label class="form-label">食物描述</label>
                    <textarea class="form-textarea" id="mealDesc" placeholder="记录今天吃了什么..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">热量 (kcal)</label>
                    <input type="number" class="form-input" id="mealCalories" placeholder="如 500" min="0">
                </div>
                <div class="form-group">
                    <label class="form-label">照片</label>
                    <input type="file" class="form-input" id="mealImage" accept="image/*" onchange="MealModule.previewImage(this)">
                    <img id="mealImagePreview" style="display:none; width:100%; max-height:200px; object-fit:cover; border-radius:8px; margin-top:8px;">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">保存</button>
            </form>
        `;
        App.openModal(`记录${mealNames[mealType] || '饮食'}`, html);
    },

    addWater(amount) {
        const records = this.getRecords();
        records.push({
            id: Storage.generateId(),
            mealType: 'water',
            waterAmount: amount,
            date: Storage.formatDate(),
            time: Storage.formatTime(),
            createdAt: Date.now()
        });
        this.saveRecords(records);
        App.showToast(`喝水 ${amount}ml 记录成功！`, 'success');
        App.loadModule('meal');
    },

    showWaterForm() {
        const html = `
            <form onsubmit="MealModule.saveWater(event)">
                <div class="form-group">
                    <label class="form-label">喝水量 (ml)</label>
                    <input type="number" class="form-input" id="waterAmount" required placeholder="如 350" min="50" max="2000" value="250">
                </div>
                <div class="form-group">
                    <label class="form-label">时间</label>
                    <input type="time" class="form-input" id="waterTime" value="${Storage.formatTime()}">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">记录喝水</button>
            </form>
        `;
        App.openModal('💧 记录喝水', html);
    },

    saveWater(event) {
        event.preventDefault();
        const amount = parseInt(document.getElementById('waterAmount').value) || 250;
        const time = document.getElementById('waterTime').value;
        const records = this.getRecords();
        records.push({
            id: Storage.generateId(),
            mealType: 'water',
            waterAmount: amount,
            date: Storage.formatDate(),
            time: time,
            createdAt: Date.now()
        });
        this.saveRecords(records);
        App.closeModal();
        App.showToast(`喝水 ${amount}ml 记录成功！`, 'success');
        App.loadModule('meal');
    },

    _previewImageBase64: null,

    async previewImage(input) {
        const file = input.files[0];
        if (!file) return;
        const compressed = await Storage.compressImage(file, 600, 0.6);
        this._previewImageBase64 = compressed;
        const img = document.getElementById('mealImagePreview');
        img.src = compressed;
        img.style.display = 'block';
    },

    async save(event) {
        event.preventDefault();
        const mealType = document.getElementById('mealType').value;
        const date = document.getElementById('mealDate').value;
        const time = document.getElementById('mealTime').value;
        const description = document.getElementById('mealDesc').value;
        const calories = parseFloat(document.getElementById('mealCalories').value) || 0;

        const record = {
            id: Storage.generateId(),
            mealType, date, time, description, calories,
            imageId: null,
            createdAt: Date.now()
        };

        if (this._previewImageBase64) {
            record.imageId = Storage.generateId();
            await Storage.saveImage(record.imageId, this._previewImageBase64);
            this._previewImageBase64 = null;
        }

        const records = this.getRecords();
        records.push(record);
        this.saveRecords(records);
        App.closeModal();
        App.showToast('记录成功！', 'success');
        App.loadModule('meal');
    },

    async loadImage(imageId) {
        const img = document.getElementById(`meal-img-${imageId}`);
        if (!img) return;
        const data = await Storage.getImage(imageId);
        if (data) img.src = data;
    },

    async viewImage(imageId) {
        const data = await Storage.getImage(imageId);
        if (data) App.openModal('查看图片', `<img src="${data}" style="width:100%; border-radius:8px;">`);
    },

    delete(id) {
        if (!confirm('确定删除这条记录吗？')) return;
        let records = this.getRecords();
        const record = records.find(r => r.id === id);
        if (record && record.imageId) Storage.deleteImage(record.imageId);
        records = records.filter(r => r.id !== id);
        this.saveRecords(records);
        App.showToast('已删除', 'success');
        App.loadModule('meal');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};
