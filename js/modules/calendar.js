/**
 * 日历打卡模块（含游泳记录）
 */
const CalendarModule = {
    STORAGE_KEY: 'calendar_records',
    currentDate: new Date(),
    selectedDate: null,

    getRecords() {
        return Storage.get(this.STORAGE_KEY, {});
    },

    saveRecords(records) {
        Storage.set(this.STORAGE_KEY, records);
    },

    render(container) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const records = this.getRecords();

        // 统计连续打卡天数
        const streak = this.calculateStreak(records);
        // 本月打卡天数
        const monthCount = this.countMonthRecords(records, year, month);
        // 游泳次数
        const swimCount = this.countSwim(records, year, month);

        let html = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">锻炼</h2>
                    <p class="page-subtitle">坚持锻炼，健康生活</p>
                </div>
            </div>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--success);">${streak}</div>
                    <div class="stat-label">连续打卡（天）</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${monthCount}</div>
                    <div class="stat-label">本月打卡（天）</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--info);">${swimCount}</div>
                    <div class="stat-label">本月游泳（次）</div>
                </div>
            </div>

            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <button class="action-btn" onclick="CalendarModule.prevMonth()">‹ 上月</button>
                    <h3 style="font-size:18px; font-weight:700;">${year}年${month + 1}月</h3>
                    <button class="action-btn" onclick="CalendarModule.nextMonth()">下月 ›</button>
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

        // 生成日历
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        const today = Storage.formatDate();

        // 上月填充
        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<div class="calendar-day other-month">${prevMonthDays - i}</div>`;
        }

        // 本月
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const hasRecord = records[dateStr] ? 'has-record' : '';
            const isToday = dateStr === today ? 'today' : '';
            const isSelected = dateStr === this.selectedDate ? 'selected' : '';

            html += `<div class="calendar-day ${hasRecord} ${isToday} ${isSelected}"
                          onclick="CalendarModule.selectDate('${dateStr}')">${d}</div>`;
        }

        // 下月填充
        const totalCells = firstDay + daysInMonth;
        const remaining = (7 - (totalCells % 7)) % 7;
        for (let d = 1; d <= remaining; d++) {
            html += `<div class="calendar-day other-month">${d}</div>`;
        }

        html += `
                </div>
            </div>
        `;

        // 选中日期详情
        if (this.selectedDate) {
            const record = records[this.selectedDate] || {};
            html += this.renderDateDetail(this.selectedDate, record);
        }

        container.innerHTML = html;
    },

    renderDateDetail(date, record) {
        const today = Storage.formatDate();
        const isToday = date === today;
        const d = new Date(date);
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

        let html = `
            <div class="card" style="margin-top:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-size:18px;">
                        ${d.getMonth() + 1}月${d.getDate()}日 周${weekDays[d.getDay()]}
                        ${isToday ? '<span class="tag tag-info" style="margin-left:8px;">今天</span>' : ''}
                    </h3>
                    <button class="btn btn-primary btn-sm" onclick="CalendarModule.showCheckinForm('${date}')">
                        ${record.checked ? '编辑打卡' : '➕ 打卡'}
                    </button>
                </div>
        `;

        if (record.checked) {
            html += `
                <div style="padding:12px; background:var(--primary-bg); border-radius:var(--radius-sm); margin-bottom:12px;">
                    ✅ 已打卡
                </div>
            `;

            if (record.note) {
                html += `<div style="margin-bottom:12px;">
                    <strong>今日笔记：</strong><br>${this.escapeHtml(record.note)}
                </div>`;
            }

            // 游泳记录
            if (record.swim) {
                html += `
                    <div style="padding:12px; background:#E3F2FD; border-radius:var(--radius-sm); margin-bottom:12px;">
                        <strong>🏊 游泳记录</strong><br>
                        <div style="margin-top:8px; display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:14px;">
                            <div>时间：${record.swim.time || '-'}</div>
                            <div>时长：${record.swim.duration || '-'} 分钟</div>
                            <div>距离：${record.swim.distance || '-'} 米</div>
                            <div>泳姿：${record.swim.style || '-'}</div>
                        </div>
                        ${record.swim.feeling ? `<div style="margin-top:8px;">感受：${this.escapeHtml(record.swim.feeling)}</div>` : ''}
                    </div>
                `;
            }
        } else {
            html += '<div class="empty-state"><div class="empty-state-text">今天还没有打卡</div></div>';
        }

        html += '</div>';
        return html;
    },

    selectDate(date) {
        this.selectedDate = date;
        App.loadModule('calendar');
    },

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        App.loadModule('calendar');
    },

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        App.loadModule('calendar');
    },

    showCheckinForm(date) {
        const records = this.getRecords();
        const record = records[date] || {};

        const d = new Date(date);
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

        const html = `
            <form onsubmit="CalendarModule.saveCheckin(event, '${date}')">
                <div style="text-align:center; margin-bottom:16px; color:var(--text-secondary);">
                    <strong>${d.getMonth() + 1}月${d.getDate()}日 周${weekDays[d.getDay()]}</strong>
                </div>

                <div class="form-group">
                    <label class="form-label">📝 今日笔记</label>
                    <textarea class="form-textarea" id="checkinNote" placeholder="记录今天的感受...">${this.escapeHtml(record.note || '')}</textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="swimToggle" ${record.swim ? 'checked' : ''}
                               onchange="CalendarModule.toggleSwimForm()" style="cursor:pointer; accent-color: var(--info);">
                        🏊 游泳打卡
                    </label>
                </div>

                <div id="swimForm" style="${record.swim ? '' : 'display:none;'} padding:12px; background:#E3F2FD; border-radius:var(--radius-sm);">
                    <div class="form-group">
                        <label class="form-label">游泳时间</label>
                        <input type="time" class="form-input" id="swimTime" value="${record.swim?.time || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">时长（分钟）</label>
                        <input type="number" class="form-input" id="swimDuration" value="${record.swim?.duration || ''}" placeholder="如 60">
                    </div>
                    <div class="form-group">
                        <label class="form-label">距离（米）</label>
                        <input type="number" class="form-input" id="swimDistance" value="${record.swim?.distance || ''}" placeholder="如 1000">
                    </div>
                    <div class="form-group">
                        <label class="form-label">泳姿</label>
                        <select class="form-select" id="swimStyle">
                            <option value="">选择泳姿</option>
                            <option value="自由泳" ${record.swim?.style === '自由泳' ? 'selected' : ''}>自由泳</option>
                            <option value="蛙泳" ${record.swim?.style === '蛙泳' ? 'selected' : ''}>蛙泳</option>
                            <option value="仰泳" ${record.swim?.style === '仰泳' ? 'selected' : ''}>仰泳</option>
                            <option value="蝶泳" ${record.swim?.style === '蝶泳' ? 'selected' : ''}>蝶泳</option>
                            <option value="混合" ${record.swim?.style === '混合' ? 'selected' : ''}>混合</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">感受</label>
                        <textarea class="form-textarea" id="swimFeeling" placeholder="游泳后的感受..." style="min-height:60px;">${this.escapeHtml(record.swim?.feeling || '')}</textarea>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width:100%;">保存打卡</button>
            </form>
        `;
        App.openModal('日历打卡', html);
    },

    toggleSwimForm() {
        const toggle = document.getElementById('swimToggle');
        const form = document.getElementById('swimForm');
        form.style.display = toggle.checked ? 'block' : 'none';
    },

    saveCheckin(event, date) {
        event.preventDefault();
        const note = document.getElementById('checkinNote').value;
        const hasSwim = document.getElementById('swimToggle').checked;

        const records = this.getRecords();
        records[date] = {
            checked: true,
            note: note
        };

        if (hasSwim) {
            records[date].swim = {
                time: document.getElementById('swimTime').value,
                duration: document.getElementById('swimDuration').value,
                distance: document.getElementById('swimDistance').value,
                style: document.getElementById('swimStyle').value,
                feeling: document.getElementById('swimFeeling').value
            };
        }

        this.saveRecords(records);
        App.closeModal();
        App.showToast('打卡成功！', 'success');
        App.loadModule('calendar');
    },

    calculateStreak(records) {
        let streak = 0;
        let date = new Date();

        while (true) {
            const dateStr = Storage.formatDate(date);
            if (records[dateStr] && records[dateStr].checked) {
                streak++;
                date.setDate(date.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    },

    countMonthRecords(records, year, month) {
        let count = 0;
        const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
        for (const [date, record] of Object.entries(records)) {
            if (date.startsWith(prefix) && record.checked) count++;
        }
        return count;
    },

    countSwim(records, year, month) {
        let count = 0;
        const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
        for (const [date, record] of Object.entries(records)) {
            if (date.startsWith(prefix) && record.swim) count++;
        }
        return count;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};
