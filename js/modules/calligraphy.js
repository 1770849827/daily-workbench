/**
 * 硬笔练字模块
 */
const CalligraphyModule = {
    STORAGE_KEY: 'calligraphy_records',

    getRecords() {
        return Storage.get(this.STORAGE_KEY, []);
    },

    saveRecords(records) {
        Storage.set(this.STORAGE_KEY, records);
    },

    render(container) {
        const records = this.getRecords().sort((a, b) => b.date.localeCompare(a.date));
        const today = Storage.formatDate();
        const todayRecord = records.find(r => r.date === today);

        // 统计
        const streak = this.calculateStreak(records);
        const totalChars = records.reduce((s, r) => s + (parseInt(r.charCount) || 0), 0);
        const totalMinutes = records.reduce((s, r) => s + (parseInt(r.duration) || 0), 0);

        let html = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">✍️ 硬笔练字</h2>
                    <p class="page-subtitle">每日一练，修身养性</p>
                </div>
                <button class="btn btn-primary" onclick="CalligraphyModule.showAddForm()">➕ 练字打卡</button>
            </div>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--success);">${streak}</div>
                    <div class="stat-label">连续（天）</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalChars}</div>
                    <div class="stat-label">累计字数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalMinutes}</div>
                    <div class="stat-label">累计时长（分）</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${records.length}</div>
                    <div class="stat-label">打卡次数</div>
                </div>
            </div>

            <!-- 每日好字区 -->
            <h3 style="margin: 16px 0 10px; font-size: 15px; color: var(--text-secondary);">今日好字</h3>
            <div class="card" style="text-align:center; ${App.cardBorderStyle(todayRecord && todayRecord.bestImageId)} position:relative;">
                <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g2_cat_maid_blue')}</div>
        `;

        if (todayRecord && todayRecord.bestImageId) {
            html += `
                <img src="" id="best-img-${todayRecord.bestImageId}" style="max-width:100%; max-height:200px; border-radius:8px; margin-bottom:12px; cursor:pointer;" onclick="CalligraphyModule.viewImage('${todayRecord.bestImageId}')">
                <div style="font-size:13px; color:var(--text-light); margin-bottom:12px;">✨ 今日最佳作品</div>
                <button class="btn btn-secondary btn-sm" onclick="CalligraphyModule.showBestImageForm()">更换照片</button>
            `;
        } else {
            html += `
                <div style="padding:20px; color:var(--text-light);">
                    <div style="font-size:36px; margin-bottom:8px;">✍️</div>
                    <div style="margin-bottom:12px;">还没有上传今日好字</div>
                    <button class="btn btn-primary btn-sm" onclick="CalligraphyModule.showBestImageForm()">📷 上传好字</button>
                </div>
            `;
        }

        html += `
            </div>

            <!-- 时长统计 -->
            <h3 style="margin: 20px 0 10px; font-size: 15px; color: var(--text-secondary);">本周练字时长</h3>
            <div class="chart-container">
                <div class="chart-title">每日练习时长（分钟）</div>
                ${this.renderWeekChart(records)}
            </div>

            <!-- 历史记录 -->
            <h3 style="margin: 20px 0 10px; font-size: 15px; color: var(--text-secondary);">练习记录</h3>
        `;

        if (records.length === 0) {
            html += `
                <div class="empty-state">
                    <div class="empty-state-icon">✍️</div>
                    <div class="empty-state-text">还没有练字记录<br>开始你的第一次练字打卡吧</div>
                </div>
            `;
        } else {
            const fontNames = { kaishu: '楷书', xingshu: '行书', lishu: '隶书', caoshu: '草书' };

            // 按日期分组
            const groups = {};
            records.forEach(r => {
                if (!groups[r.date]) groups[r.date] = [];
                groups[r.date].push(r);
            });

            for (const [date, items] of Object.entries(groups)) {
                const d = new Date(date);
                const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
                const isToday = date === today;

                html += `<div style="margin-bottom: 12px;">
                    <div style="font-size: 12px; color: var(--text-light); margin-bottom: 6px;">
                        ${d.getMonth() + 1}月${d.getDate()}日 周${weekDays[d.getDay()]} ${isToday ? '· 今天' : ''}
                    </div>`;

                items.forEach(r => {
                    html += `
                        <div class="list-item">
                            ${r.bestImageId ? `<img src="" id="call-thumb-${r.bestImageId}" style="width:50px; height:50px; border-radius:8px; object-fit:cover; cursor:pointer;" onclick="CalligraphyModule.viewImage('${r.bestImageId}')">` : '<span style="font-size:24px;">✍️</span>'}
                            <div style="flex:1;">
                                <div style="font-weight:500;">
                                    ${r.fontType ? `<span class="tag tag-info">${fontNames[r.fontType] || r.fontType}</span>` : ''}
                                    ${r.duration ? ` · ${r.duration}分钟` : ''}
                                    ${r.charCount ? ` · ${r.charCount}字` : ''}
                                </div>
                                ${r.content ? `<div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">练习：${this.escapeHtml(r.content)}</div>` : ''}
                                ${r.note ? `<div style="font-size:13px; color:var(--text-light); margin-top:4px;">${this.escapeHtml(r.note)}</div>` : ''}
                            </div>
                            <div class="action-buttons">
                                <button class="action-btn danger" onclick="CalligraphyModule.delete('${r.id}')">删除</button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
        }

        container.innerHTML = html;

        // 异步加载图片
        records.forEach(r => {
            if (r.bestImageId) {
                this.loadImage(r.bestImageId, `best-img-${r.bestImageId}`);
                this.loadImage(r.bestImageId, `call-thumb-${r.bestImageId}`);
            }
        });
    },

    renderWeekChart(records) {
        const now = new Date();
        const day = now.getDay() || 7;
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - day + 1);

        const days = [];
        const weekDayLabels = ['一', '二', '三', '四', '五', '六', '日'];

        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            const dateStr = Storage.formatDate(d);
            const dayRecords = records.filter(r => r.date === dateStr);
            const duration = dayRecords.reduce((s, r) => s + (parseInt(r.duration) || 0), 0);
            days.push({ label: weekDayLabels[i], duration, isToday: dateStr === Storage.formatDate() });
        }

        const maxDuration = Math.max(...days.map(d => d.duration), 30);

        let html = '<div style="display:flex; gap:8px; align-items:flex-end; height:120px; padding:0 10px;">';
        days.forEach(d => {
            const height = (d.duration / maxDuration) * 100;
            html += `
                <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <div style="font-size:11px; color:var(--text-secondary);">${d.duration}</div>
                    <div style="width:100%; height:80px; display:flex; align-items:flex-end; justify-content:center;">
                        <div style="width:60%; height:${Math.max(height, 2)}%; background:${d.isToday ? 'var(--primary)' : 'var(--primary-light)'}; border-radius:4px 4px 0 0; min-height:4px;"></div>
                    </div>
                    <div style="font-size:11px; color:${d.isToday ? 'var(--primary)' : 'var(--text-light)'}; font-weight:${d.isToday ? '700' : '400'};">${d.label}</div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    },

    showAddForm() {
        const html = `
            <form onsubmit="CalligraphyModule.save(event)">
                <div class="form-group">
                    <label class="form-label">字体</label>
                    <select class="form-select" id="callFont">
                        <option value="kaishu">楷书</option>
                        <option value="xingshu">行书</option>
                        <option value="lishu">隶书</option>
                        <option value="caoshu">草书</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">练习时长（分钟）</label>
                    <input type="number" class="form-input" id="callDuration" placeholder="如 30" min="1">
                </div>
                <div class="form-group">
                    <label class="form-label">字数</label>
                    <input type="number" class="form-input" id="callCharCount" placeholder="如 100" min="1">
                </div>
                <div class="form-group">
                    <label class="form-label">练习内容</label>
                    <input type="text" class="form-input" id="callContent" placeholder="如：临摹《兰亭序》">
                </div>
                <div class="form-group">
                    <label class="form-label">心得</label>
                    <textarea class="form-textarea" id="callNote" placeholder="练习心得..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">好字照片（可选）</label>
                    <input type="file" class="form-input" id="callImage" accept="image/*" onchange="CalligraphyModule.previewImage(this)">
                    <img id="callImagePreview" style="display:none; width:100%; max-height:200px; object-fit:cover; border-radius:8px; margin-top:8px;">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">保存</button>
            </form>
        `;
        App.openModal('练字打卡', html);
    },

    _previewImageBase64: null,

    async previewImage(input) {
        const file = input.files[0];
        if (!file) return;
        const compressed = await Storage.compressImage(file, 600, 0.7);
        this._previewImageBase64 = compressed;
        const img = document.getElementById('callImagePreview');
        img.src = compressed;
        img.style.display = 'block';
    },

    async save(event) {
        event.preventDefault();

        const record = {
            id: Storage.generateId(),
            date: Storage.formatDate(),
            fontType: document.getElementById('callFont').value,
            duration: document.getElementById('callDuration').value,
            charCount: document.getElementById('callCharCount').value,
            content: document.getElementById('callContent').value,
            note: document.getElementById('callNote').value,
            bestImageId: null,
            createdAt: Date.now()
        };

        if (this._previewImageBase64) {
            record.bestImageId = Storage.generateId();
            await Storage.saveImage(record.bestImageId, this._previewImageBase64);
            this._previewImageBase64 = null;
        }

        const records = this.getRecords();
        records.push(record);
        this.saveRecords(records);

        App.closeModal();
        App.showToast('练字打卡成功！', 'success');
        App.loadModule('calligraphy');
    },

    /**
     * 单独上传今日好字照片
     */
    showBestImageForm() {
        const html = `
            <form onsubmit="CalligraphyModule.saveBestImage(event)">
                <div class="form-group">
                    <label class="form-label">选择好字照片</label>
                    <input type="file" class="form-input" id="bestImage" accept="image/*" onchange="CalligraphyModule.previewBestImage(this)" required>
                    <img id="bestImagePreview" style="display:none; width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-top:8px;">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">上传</button>
            </form>
        `;
        App.openModal('📷 上传好字', html);
    },

    _bestImageBase64: null,

    async previewBestImage(input) {
        const file = input.files[0];
        if (!file) return;
        const compressed = await Storage.compressImage(file, 600, 0.7);
        this._bestImageBase64 = compressed;
        const img = document.getElementById('bestImagePreview');
        img.src = compressed;
        img.style.display = 'block';
    },

    async saveBestImage(event) {
        event.preventDefault();

        if (!this._bestImageBase64) {
            App.showToast('请选择照片', 'error');
            return;
        }

        const imageId = Storage.generateId();
        await Storage.saveImage(imageId, this._bestImageBase64);
        this._bestImageBase64 = null;

        const records = this.getRecords();
        const today = Storage.formatDate();
        let todayRecord = records.find(r => r.date === today);

        if (todayRecord) {
            todayRecord.bestImageId = imageId;
        } else {
            records.push({
                id: Storage.generateId(),
                date: today,
                fontType: '',
                duration: 0,
                charCount: 0,
                content: '',
                note: '',
                bestImageId: imageId,
                createdAt: Date.now()
            });
        }

        this.saveRecords(records);
        App.closeModal();
        App.showToast('好字已上传！', 'success');
        App.loadModule('calligraphy');
    },

    async loadImage(imageId, elementId) {
        const img = document.getElementById(elementId || `call-img-${imageId}`);
        if (!img) return;
        const data = await Storage.getImage(imageId);
        if (data) img.src = data;
    },

    async viewImage(imageId) {
        const data = await Storage.getImage(imageId);
        if (data) {
            App.openModal('查看作品', `<img src="${data}" style="width:100%; border-radius:8px;">`);
        }
    },

    delete(id) {
        if (!confirm('确定删除这条记录吗？')) return;
        let records = this.getRecords();
        const record = records.find(r => r.id === id);
        if (record && record.bestImageId) {
            Storage.deleteImage(record.bestImageId);
        }
        records = records.filter(r => r.id !== id);
        this.saveRecords(records);
        App.showToast('已删除', 'success');
        App.loadModule('calligraphy');
    },

    calculateStreak(records) {
        if (records.length === 0) return 0;
        const dates = [...new Set(records.map(r => r.date))].sort().reverse();
        let streak = 0;
        let date = new Date();

        while (true) {
            const dateStr = Storage.formatDate(date);
            if (dates.includes(dateStr)) {
                streak++;
                date.setDate(date.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};
