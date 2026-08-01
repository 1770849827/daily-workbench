/**
 * 每日计划模块
 */
const TodoModule = {
    STORAGE_KEY: 'todos',

    getTodos() {
        return Storage.get(this.STORAGE_KEY, []);
    },

    saveTodos(todos) {
        Storage.set(this.STORAGE_KEY, todos);
    },

    render(container) {
        const todos = this.getTodos();
        const today = Storage.formatDate();

        const todayTodos = todos.filter(t => t.date === today);
        const todayCompleted = todayTodos.filter(t => t.completed).length;
        const todayTotal = todayTodos.length;
        const todayRate = todayTotal > 0 ? Math.round(todayCompleted / todayTotal * 100) : 0;

        const weekStats = this.getWeekStats(todos);
        const weekRate = weekStats.total > 0 ? Math.round(weekStats.completed / weekStats.total * 100) : 0;

        let html = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">每日计划</h2>
                    <p class="page-subtitle">今日 ${todayCompleted}/${todayTotal} 已完成 · 本周完成率 ${weekRate}%</p>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-secondary btn-sm" onclick="Sync.sync()" title="云端同步">☁️</button>
                    <button class="btn btn-primary" onclick="TodoModule.showAddForm()">➕ 新建计划</button>
                </div>
            </div>

            <div class="stat-grid">
                <div class="stat-card" style="${App.cardBorderStyle(todayTotal > 0)} position:relative; overflow:visible;">
                    <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g2_cat_fish')}</div>
                    <div class="stat-value">${todayTotal}</div>
                    <div class="stat-label">今日计划</div>
                </div>
                <div class="stat-card" style="${App.cardBorderStyle(todayCompleted > 0)} position:relative; overflow:visible;">
                    <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g1_cat_dog_dance')}</div>
                    <div class="stat-value" style="color:var(--success);">${todayCompleted}</div>
                    <div class="stat-label">已完成</div>
                </div>
                <div class="stat-card" style="${App.cardBorderStyle(todayTotal > 0)} position:relative; overflow:visible;">
                    <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g1_dog_carrot_run')}</div>
                    <div class="stat-value" style="color:var(--primary);">${todayRate}%</div>
                    <div class="stat-label">完成率</div>
                </div>
            </div>

            <!-- 今日完成率进度条 -->
            <div class="card" style="margin-bottom:16px; ${App.cardBorderStyle(todayTotal > 0)}">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span style="font-size:14px; font-weight:600;">今日完成率</span>
                    <span style="font-size:14px; color:var(--text-secondary);">${todayCompleted}/${todayTotal}</span>
                </div>
                <div class="progress-bar" style="height:10px;">
                    <div class="progress-fill" style="width:${todayRate}%; background:${todayRate === 100 ? 'var(--success)' : 'var(--primary)'};"></div>
                </div>
            </div>

            <!-- 本周完成率环形图 -->
            <div class="card" style="margin-bottom:16px; ${App.cardBorderStyle(weekStats.total > 0)}">
                <div style="font-size:14px; font-weight:600; margin-bottom:12px;">本周完成率</div>
                <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
                    <div style="width:100px; height:100px; border-radius:50%;
                                background: conic-gradient(var(--primary) 0% ${weekRate}%, var(--border-light) ${weekRate}% 100%);
                                display:flex; align-items:center; justify-content:center; position:relative; flex-shrink:0;">
                        <div style="width:70px; height:70px; border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; flex-direction:column;">
                            <div style="font-size:20px; font-weight:700; color:var(--primary);">${weekRate}%</div>
                            <div style="font-size:10px; color:var(--text-light);">完成率</div>
                        </div>
                    </div>
                    <div style="flex:1; min-width:120px;">
                        <div style="font-size:13px; color:var(--text-secondary); margin-bottom:4px;">本周完成 ${weekStats.completed} 项</div>
                        <div style="font-size:13px; color:var(--text-secondary); margin-bottom:4px;">总计划 ${weekStats.total} 项</div>
                        <div style="font-size:13px; color:var(--text-light);">加油，你已完成${weekRate}%！</div>
                    </div>
                </div>
            </div>

            <!-- 周进度 -->
            <div class="card" style="margin-bottom:16px; ${App.cardBorderStyle(weekStats.total > 0)}">
                <div style="font-size:14px; font-weight:600; margin-bottom:12px;">周进度</div>
                ${this.renderWeekProgress(todos)}
            </div>

            <!-- 待办列表 -->
            <h3 style="margin: 16px 0 10px; font-size: 15px; color: var(--text-secondary);">计划列表</h3>
        `;

        if (todos.length === 0) {
            html += `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div class="empty-state-text">还没有计划<br>点击右上角添加第一个吧</div>
                </div>
            `;
        } else {
            // 按日期分组，今日优先
            const todayItems = todos.filter(t => t.date === today);
            const otherItems = todos.filter(t => t.date !== today)
                .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

            if (todayItems.length > 0) {
                html += '<div style="font-size:12px; color:var(--text-light); margin-bottom:6px;">今天</div>';
                html += this.renderTodoList(todayItems);
            }

            if (otherItems.length > 0) {
                const groups = {};
                otherItems.forEach(t => {
                    const date = t.date || '未安排';
                    if (!groups[date]) groups[date] = [];
                    groups[date].push(t);
                });

                for (const [date, items] of Object.entries(groups)) {
                    const d = new Date(date);
                    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
                    const label = isNaN(d.getTime()) ? date : `${d.getMonth() + 1}月${d.getDate()}日 周${weekdays[d.getDay()]}`;
                    html += `<div style="margin-top:12px; font-size:12px; color:var(--text-light); margin-bottom:6px;">${label}</div>`;
                    html += this.renderTodoList(items);
                }
            }
        }

        container.innerHTML = html;
    },

    /**
     * 渲染周进度（7天横条）
     */
    renderWeekProgress(todos) {
        const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
        const today = Storage.formatDate();
        let html = '<div style="display:flex; gap:6px; justify-content:space-between;">';

        for (let i = 0; i < 7; i++) {
            const date = this.getWeekDate(i);
            const dayTodos = todos.filter(t => t.date === date);
            const completed = dayTodos.filter(t => t.completed).length;
            const total = dayTodos.length;
            const rate = total > 0 ? Math.round(completed / total * 100) : 0;
            const isToday = date === today;

            html += `
                <div style="flex:1; text-align:center;">
                    <div style="font-size:11px; color:var(--text-light); margin-bottom:4px;">${weekdays[i]}</div>
                    <div style="height:60px; background:var(--border-light); border-radius:6px; position:relative; overflow:hidden;">
                        <div style="position:absolute; bottom:0; left:0; right:0; height:${rate}%;
                                    background:${rate === 100 ? 'var(--success)' : 'var(--primary)'};
                                    border-radius:6px; transition:height 0.3s;"></div>
                    </div>
                    <div style="font-size:10px; color:${isToday ? 'var(--primary)' : 'var(--text-light)'};
                                margin-top:4px; font-weight:${isToday ? '700' : '400'};">
                        ${total > 0 ? completed + '/' + total : '-'}
                    </div>
                </div>
            `;
        }

        html += '</div>';
        return html;
    },

    /**
     * 获取本周某天的日期（i=0是周一）
     */
    getWeekDate(i) {
        const now = new Date();
        const dayOfWeek = now.getDay() || 7; // 周日是0，转为7
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayOfWeek + 1 + i);
        return Storage.formatDate(monday);
    },

    /**
     * 获取本周统计
     */
    getWeekStats(todos) {
        let total = 0;
        let completed = 0;
        for (let i = 0; i < 7; i++) {
            const date = this.getWeekDate(i);
            const dayTodos = todos.filter(t => t.date === date);
            total += dayTodos.length;
            completed += dayTodos.filter(t => t.completed).length;
        }
        return { total, completed };
    },

    /**
     * 渲染待办列表
     */
    renderTodoList(todos) {
        let html = '';
        todos.forEach(todo => {
            const priorityTag = todo.priority === 'high'
                ? '<span class="tag tag-high">高</span>'
                : todo.priority === 'medium'
                ? '<span class="tag tag-medium">中</span>'
                : '<span class="tag tag-low">低</span>';

            html += `
                <div class="list-item">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}
                           onchange="TodoModule.toggle('${todo.id}')"
                           style="width:20px; height:20px; cursor:pointer; accent-color: var(--primary);">
                    <div style="flex:1; ${todo.completed ? 'opacity:0.5; text-decoration:line-through;' : ''}">
                        <div style="font-weight:500;">${this.escapeHtml(todo.title)}</div>
                        ${todo.description ? `<div style="font-size:13px; color:var(--text-light); margin-top:4px;">${this.escapeHtml(todo.description)}</div>` : ''}
                        <div style="margin-top:4px;">${priorityTag}</div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="TodoModule.showEditForm('${todo.id}')">编辑</button>
                        <button class="action-btn danger" onclick="TodoModule.delete('${todo.id}')">删除</button>
                    </div>
                </div>
            `;
        });
        return html;
    },

    showAddForm() {
        const html = `
            <form onsubmit="TodoModule.save(event, null)">
                <div class="form-group">
                    <label class="form-label">标题 *</label>
                    <input type="text" class="form-input" id="todoTitle" required placeholder="输入计划标题">
                </div>
                <div class="form-group">
                    <label class="form-label">描述</label>
                    <textarea class="form-textarea" id="todoDesc" placeholder="可选描述"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">日期</label>
                    <input type="date" class="form-input" id="todoDate" value="${Storage.formatDate()}">
                </div>
                <div class="form-group">
                    <label class="form-label">优先级</label>
                    <select class="form-select" id="todoPriority">
                        <option value="low">低</option>
                        <option value="medium" selected>中</option>
                        <option value="high">高</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">添加</button>
            </form>
        `;
        App.openModal('新建计划', html);
    },

    showEditForm(id) {
        const todo = this.getTodos().find(t => t.id === id);
        if (!todo) return;

        const html = `
            <form onsubmit="TodoModule.save(event, '${id}')">
                <div class="form-group">
                    <label class="form-label">标题 *</label>
                    <input type="text" class="form-input" id="todoTitle" value="${this.escapeHtml(todo.title)}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">描述</label>
                    <textarea class="form-textarea" id="todoDesc">${this.escapeHtml(todo.description || '')}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">日期</label>
                    <input type="date" class="form-input" id="todoDate" value="${todo.date || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">优先级</label>
                    <select class="form-select" id="todoPriority">
                        <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>低</option>
                        <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>中</option>
                        <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>高</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">保存</button>
            </form>
        `;
        App.openModal('编辑计划', html);
    },

    save(event, id) {
        event.preventDefault();
        const title = document.getElementById('todoTitle').value;
        const description = document.getElementById('todoDesc').value;
        const date = document.getElementById('todoDate').value;
        const priority = document.getElementById('todoPriority').value;

        let todos = this.getTodos();

        if (id) {
            const index = todos.findIndex(t => t.id === id);
            if (index !== -1) {
                todos[index] = { ...todos[index], title, description, date, priority };
            }
        } else {
            todos.push({
                id: Storage.generateId(),
                title,
                description,
                date,
                priority,
                completed: false,
                createdAt: Date.now()
            });
        }

        this.saveTodos(todos);
        App.closeModal();
        App.showToast(id ? '修改成功' : '添加成功', 'success');
        App.loadModule('todo');
    },

    toggle(id) {
        const todos = this.getTodos();
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos(todos);
            App.loadModule('todo');
        }
    },

    delete(id) {
        if (!confirm('确定删除这条计划吗？')) return;
        let todos = this.getTodos();
        todos = todos.filter(t => t.id !== id);
        this.saveTodos(todos);
        App.showToast('已删除', 'success');
        App.loadModule('todo');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};
