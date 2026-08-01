/**
 * 记账模块（完整记账本）
 * 功能：收支记录、多账户、预算设置、月度报表、分类图表
 */
const AccountingModule = {
    STORAGE_RECORDS: 'acc_records',
    STORAGE_ACCOUNTS: 'acc_accounts',
    STORAGE_BUDGET: 'acc_budget',
    currentTab: 'records',
    currentMonth: new Date(),

    getRecords() {
        return Storage.get(this.STORAGE_RECORDS, []);
    },

    saveRecords(records) {
        Storage.set(this.STORAGE_RECORDS, records);
    },

    getAccounts() {
        return Storage.get(this.STORAGE_ACCOUNTS, [
            { id: 'default', name: '默认账户', balance: 0, icon: '💰' }
        ]);
    },

    saveAccounts(accounts) {
        Storage.set(this.STORAGE_ACCOUNTS, accounts);
    },

    getBudget() {
        return Storage.get(this.STORAGE_BUDGET, { monthly: 0, categories: {} });
    },

    saveBudget(budget) {
        Storage.set(this.STORAGE_BUDGET, budget);
    },

    render(container) {
        const tab = this.currentTab;

        let html = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">记账</h2>
                    <p class="page-subtitle">记录每一笔收支</p>
                </div>
                <button class="btn btn-primary" onclick="AccountingModule.showAddForm()">➕ 记一笔</button>
            </div>

            <div class="tabs">
                <div class="tab ${tab === 'records' ? 'active' : ''}" onclick="AccountingModule.switchTab('records')">明细</div>
                <div class="tab ${tab === 'summary' ? 'active' : ''}" onclick="AccountingModule.switchTab('summary')">报表</div>
                <div class="tab ${tab === 'budget' ? 'active' : ''}" onclick="AccountingModule.switchTab('budget')">预算</div>
                <div class="tab ${tab === 'accounts' ? 'active' : ''}" onclick="AccountingModule.switchTab('accounts')">账户</div>
            </div>
        `;

        if (tab === 'records') html += this.renderRecordsTab();
        else if (tab === 'summary') html += this.renderSummaryTab();
        else if (tab === 'budget') html += this.renderBudgetTab();
        else if (tab === 'accounts') html += this.renderAccountsTab();

        container.innerHTML = html;
    },

    /**
     * 明细标签
     */
    renderRecordsTab() {
        const records = this.getRecords().sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

        const monthRecords = records.filter(r => r.date.startsWith(monthPrefix));
        const income = monthRecords.filter(r => r.type === 'income').reduce((s, r) => s + parseFloat(r.amount), 0);
        const expense = monthRecords.filter(r => r.type === 'expense').reduce((s, r) => s + parseFloat(r.amount), 0);
        const balance = income - expense;

        let html = `
            <!-- 月度统计 -->
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--success);">+${income.toFixed(2)}</div>
                    <div class="stat-label">本月收入</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--danger);">-${expense.toFixed(2)}</div>
                    <div class="stat-label">本月支出</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: ${balance >= 0 ? 'var(--primary)' : 'var(--danger)'};">${balance >= 0 ? '+' : ''}${balance.toFixed(2)}</div>
                    <div class="stat-label">本月结余</div>
                </div>
            </div>

            <!-- 月份切换 -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin: 16px 0 10px;">
                <button class="action-btn" onclick="AccountingModule.prevMonth()">‹</button>
                <strong style="font-size:16px;">${year}年${month + 1}月</strong>
                <button class="action-btn" onclick="AccountingModule.nextMonth()">›</button>
            </div>
        `;

        if (monthRecords.length === 0) {
            html += `
                <div class="empty-state">
                    <div class="empty-state-icon">💰</div>
                    <div class="empty-state-text">本月还没有记录</div>
                </div>
            `;
        } else {
            // 按日期分组
            const groups = {};
            monthRecords.forEach(r => {
                if (!groups[r.date]) groups[r.date] = [];
                groups[r.date].push(r);
            });

            const categoryIcons = this.getCategoryIcons();

            for (const [date, items] of Object.entries(groups)) {
                const d = new Date(date);
                const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
                const dayIncome = items.filter(r => r.type === 'income').reduce((s, r) => s + parseFloat(r.amount), 0);
                const dayExpense = items.filter(r => r.type === 'expense').reduce((s, r) => s + parseFloat(r.amount), 0);

                html += `<div style="margin-bottom: 12px;">
                    <div style="display:flex; justify-content:space-between; font-size: 12px; color: var(--text-light); margin-bottom: 6px;">
                        <span>${d.getMonth() + 1}月${d.getDate()}日 周${weekDays[d.getDay()]}</span>
                        <span>${dayIncome > 0 ? `收${dayIncome.toFixed(2)} ` : ''}支${dayExpense.toFixed(2)}</span>
                    </div>`;

                items.forEach(r => {
                    const isIncome = r.type === 'income';
                    html += `
                        <div class="list-item">
                            <span style="font-size:24px;">${categoryIcons[r.category] || '📝'}</span>
                            <div style="flex:1;">
                                <div style="font-weight:500;">${this.getCategoryName(r.category, r.type)}</div>
                                ${r.note ? `<div style="font-size:13px; color:var(--text-light);">${this.escapeHtml(r.note)}</div>` : ''}
                                ${r.accountName ? `<div style="font-size:12px; color:var(--text-light);">💳 ${this.escapeHtml(r.accountName)}</div>` : ''}
                            </div>
                            <div style="font-weight:700; color: ${isIncome ? 'var(--success)' : 'var(--danger)'};">
                                ${isIncome ? '+' : '-'}${parseFloat(r.amount).toFixed(2)}
                            </div>
                            <div class="action-buttons">
                                <button class="action-btn" onclick="AccountingModule.showEditForm('${r.id}')">编辑</button>
                                <button class="action-btn danger" onclick="AccountingModule.delete('${r.id}')">删除</button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
        }

        return html;
    },

    /**
     * 报表标签
     */
    renderSummaryTab() {
        const records = this.getRecords();
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

        const monthRecords = records.filter(r => r.date.startsWith(monthPrefix));
        const expenseRecords = monthRecords.filter(r => r.type === 'expense');
        const incomeRecords = monthRecords.filter(r => r.type === 'income');

        const totalExpense = expenseRecords.reduce((s, r) => s + parseFloat(r.amount), 0);
        const totalIncome = incomeRecords.reduce((s, r) => s + parseFloat(r.amount), 0);

        // 按分类统计
        const expenseByCategory = {};
        expenseRecords.forEach(r => {
            expenseByCategory[r.category] = (expenseByCategory[r.category] || 0) + parseFloat(r.amount);
        });

        const incomeByCategory = {};
        incomeRecords.forEach(r => {
            incomeByCategory[r.category] = (incomeByCategory[r.category] || 0) + parseFloat(r.amount);
        });

        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin: 16px 0 10px;">
                <button class="action-btn" onclick="AccountingModule.prevMonth()">‹</button>
                <strong style="font-size:16px;">${year}年${month + 1}月报表</strong>
                <button class="action-btn" onclick="AccountingModule.nextMonth()">›</button>
            </div>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--success);">${totalIncome.toFixed(2)}</div>
                    <div class="stat-label">总收入</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--danger);">${totalExpense.toFixed(2)}</div>
                    <div class="stat-label">总支出</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${monthRecords.length}</div>
                    <div class="stat-label">交易笔数</div>
                </div>
            </div>
        `;

        if (monthRecords.length === 0) {
            html += `<div class="empty-state"><div class="empty-state-icon">📊</div><div class="empty-state-text">本月没有数据</div></div>`;
            return html;
        }

        // 支出分类图表（饼图）
        if (Object.keys(expenseByCategory).length > 0) {
            html += '<div class="chart-container">';
            html += '<div class="chart-title">支出分类</div>';
            html += this.renderPieChart(expenseByCategory, totalExpense);
            html += '</div>';
        }

        // 支出分类列表
        if (Object.keys(expenseByCategory).length > 0) {
            html += '<div class="chart-container">';
            html += '<div class="chart-title">支出明细</div>';

            const sorted = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
            const categoryIcons = this.getCategoryIcons();

            for (const [category, amount] of sorted) {
                const percentage = ((amount / totalExpense) * 100).toFixed(1);
                html += `
                    <div style="margin-bottom:12px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span>${categoryIcons[category] || '📝'} ${this.getCategoryName(category, 'expense')}</span>
                            <span>¥${amount.toFixed(2)} (${percentage}%)</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${percentage}%;"></div>
                        </div>
                    </div>
                `;
            }
            html += '</div>';
        }

        // 收入分类
        if (Object.keys(incomeByCategory).length > 0) {
            html += '<div class="chart-container">';
            html += '<div class="chart-title">收入分类</div>';
            const sorted = Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1]);
            const categoryIcons = this.getCategoryIcons();

            for (const [category, amount] of sorted) {
                const percentage = ((amount / totalIncome) * 100).toFixed(1);
                html += `
                    <div style="margin-bottom:12px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span>${categoryIcons[category] || '📝'} ${this.getCategoryName(category, 'income')}</span>
                            <span>¥${amount.toFixed(2)} (${percentage}%)</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${percentage}%; background:var(--success);"></div>
                        </div>
                    </div>
                `;
            }
            html += '</div>';
        }

        // 近6月趋势
        html += this.renderTrendChart();

        return html;
    },

    /**
     * 简易饼图（CSS实现）
     */
    renderPieChart(data, total) {
        const colors = ['#FF6B6B', '#4DABF7', '#51CF66', '#FFD43B', '#845EF7', '#FF922B', '#20C997', '#F06595', '#748FFC'];
        let cumulative = 0;
        let gradientParts = [];

        const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

        sorted.forEach(([category, amount], i) => {
            const percentage = (amount / total) * 100;
            gradientParts.push(`${colors[i % colors.length]} ${cumulative}% ${cumulative + percentage}%`);
            cumulative += percentage;
        });

        let html = `
            <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
                <div style="width:120px; height:120px; border-radius:50%;
                            background: conic-gradient(${gradientParts.join(', ')});
                            display:flex; align-items:center; justify-content:center;
                            position:relative; flex-shrink:0;">
                    <div style="width:60px; height:60px; border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;">
                        ¥${total.toFixed(0)}
                    </div>
                </div>
                <div style="flex:1; min-width:120px;">
        `;

        sorted.forEach(([category, amount], i) => {
            const percentage = ((amount / total) * 100).toFixed(1);
            html += `
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px; font-size:13px;">
                    <div style="width:10px; height:10px; border-radius:2px; background:${colors[i % colors.length]};"></div>
                    <span style="flex:1;">${this.getCategoryName(category, 'expense')}</span>
                    <span style="color:var(--text-light);">${percentage}%</span>
                </div>
            `;
        });

        html += '</div></div>';
        return html;
    },

    /**
     * 趋势图
     */
    renderTrendChart() {
        const records = this.getRecords();
        const now = new Date();
        const months = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const monthRecords = records.filter(r => r.date.startsWith(prefix));

            const income = monthRecords.filter(r => r.type === 'income').reduce((s, r) => s + parseFloat(r.amount), 0);
            const expense = monthRecords.filter(r => r.type === 'expense').reduce((s, r) => s + parseFloat(r.amount), 0);

            months.push({
                label: `${d.getMonth() + 1}月`,
                income, expense
            });
        }

        const maxVal = Math.max(...months.map(m => Math.max(m.income, m.expense)), 1);

        let html = '<div class="chart-container">';
        html += '<div class="chart-title">近6月趋势</div>';
        html += '<div style="display:flex; gap:8px; align-items:flex-end; height:120px; padding:0 10px;">';

        months.forEach(m => {
            const incomeHeight = (m.income / maxVal) * 100;
            const expenseHeight = (m.expense / maxVal) * 100;

            html += `
                <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <div style="display:flex; gap:3px; align-items:flex-end; height:80px;">
                        <div style="width:8px; height:${incomeHeight}%; background:var(--success); border-radius:2px 2px 0 0;" title="收入: ${m.income.toFixed(2)}"></div>
                        <div style="width:8px; height:${expenseHeight}%; background:var(--danger); border-radius:2px 2px 0 0;" title="支出: ${m.expense.toFixed(2)}"></div>
                    </div>
                    <div style="font-size:11px; color:var(--text-light);">${m.label}</div>
                </div>
            `;
        });

        html += '</div>';
        html += '<div>';
        html += '<div style="display:flex; gap:16px; justify-content:center; margin-top:8px; font-size:12px;">';
        html += '<span style="display:flex; align-items:center; gap:4px;"><span style="width:10px; height:10px; background:var(--success); border-radius:2px;"></span>收入</span>';
        html += '<span style="display:flex; align-items:center; gap:4px;"><span style="width:10px; height:10px; background:var(--danger); border-radius:2px;"></span>支出</span>';
        html += '</div></div>';

        return html;
    },

    /**
     * 预算标签
     */
    renderBudgetTab() {
        const budget = this.getBudget();
        const records = this.getRecords();
        const now = new Date();
        const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const monthExpense = records.filter(r => r.date.startsWith(monthPrefix) && r.type === 'expense')
            .reduce((s, r) => s + parseFloat(r.amount), 0);

        const percentage = budget.monthly > 0 ? (monthExpense / budget.monthly * 100).toFixed(0) : 0;
        const remaining = budget.monthly - monthExpense;

        let html = `
            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-size:16px;">本月总预算</h3>
                    <button class="btn btn-secondary btn-sm" onclick="AccountingModule.showBudgetForm()">设置</button>
                </div>

                <div style="text-align:center; margin:20px 0;">
                    <div style="font-size:32px; font-weight:700; color: var(--primary);">¥${budget.monthly.toFixed(2)}</div>
                    <div style="font-size:13px; color:var(--text-light); margin-top:4px;">预算金额</div>
                </div>

                <div class="progress-bar" style="height:12px; margin-bottom:8px;">
                    <div class="progress-fill" style="width:${Math.min(percentage, 100)}%; background:${percentage > 90 ? 'var(--danger)' : percentage > 70 ? 'var(--warning)' : 'var(--success)'};"></div>
                </div>

                <div style="display:flex; justify-content:space-between; font-size:13px;">
                    <span>已支出 ¥${monthExpense.toFixed(2)}</span>
                    <span style="color:${remaining >= 0 ? 'var(--success)' : 'var(--danger)'};">
                        ${remaining >= 0 ? '剩余' : '超支'} ¥${Math.abs(remaining).toFixed(2)}
                    </span>
                </div>
            </div>

            <div class="card" style="margin-top:16px;">
                <h3 style="font-size:16px; margin-bottom:12px;">分类预算</h3>
        `;

        const categories = this.getCategories('expense');
        const categoryIcons = this.getCategoryIcons();

        for (const cat of categories) {
            const catBudget = budget.categories[cat.id] || 0;
            const catExpense = records.filter(r =>
                r.date.startsWith(monthPrefix) && r.type === 'expense' && r.category === cat.id
            ).reduce((s, r) => s + parseFloat(r.amount), 0);

            const catPercent = catBudget > 0 ? (catExpense / catBudget * 100).toFixed(0) : 0;

            html += `
                <div style="margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span>${categoryIcons[cat.id]} ${cat.name}</span>
                        <span style="font-size:13px; color:var(--text-light);">
                            ${catBudget > 0 ? `¥${catExpense.toFixed(0)}/¥${catBudget.toFixed(0)}` : '未设置'}
                        </span>
                    </div>
                    ${catBudget > 0 ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${Math.min(catPercent, 100)}%; background:${catPercent > 90 ? 'var(--danger)' : 'var(--primary)'};"></div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        html += '</div>';
        return html;
    },

    /**
     * 账户标签
     */
    renderAccountsTab() {
        const accounts = this.getAccounts();
        const records = this.getRecords();

        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin: 16px 0 10px;">
                <strong style="font-size:16px;">我的账户</strong>
                <button class="btn btn-primary btn-sm" onclick="AccountingModule.showAccountForm()">➕ 添加账户</button>
            </div>
        `;

        let totalBalance = 0;

        accounts.forEach(acc => {
            // 计算账户余额
            const income = records.filter(r => r.accountId === acc.id && r.type === 'income').reduce((s, r) => s + parseFloat(r.amount), 0);
            const expense = records.filter(r => r.accountId === acc.id && r.type === 'expense').reduce((s, r) => s + parseFloat(r.amount), 0);
            const balance = acc.balance + income - expense;
            totalBalance += balance;

            html += `
                <div class="list-item" style="cursor:pointer;" onclick="AccountingModule.showAccountForm('${acc.id}')">
                    <span style="font-size:32px;">${acc.icon || '💰'}</span>
                    <div style="flex:1;">
                        <div style="font-weight:600;">${this.escapeHtml(acc.name)}</div>
                        <div style="font-size:13px; color:var(--text-light);">${records.filter(r => r.accountId === acc.id).length} 笔交易</div>
                    </div>
                    <div style="font-weight:700; font-size:18px; color: ${balance >= 0 ? 'var(--primary)' : 'var(--danger)'};">
                        ¥${balance.toFixed(2)}
                    </div>
                </div>
            `;
        });

        html = `
            <div class="card" style="text-align:center; margin-bottom:16px; background: linear-gradient(135deg, var(--primary), var(--primary-light)); color:white; border:none;">
                <div style="font-size:13px; opacity:0.9; margin-bottom:4px;">总资产</div>
                <div style="font-size:32px; font-weight:700;">¥${totalBalance.toFixed(2)}</div>
            </div>
        ` + html;

        return html;
    },

    /**
     * 添加/编辑记录表单
     */
    showAddForm() {
        const accounts = this.getAccounts();
        const html = `
            <form onsubmit="AccountingModule.save(event, null)">
                <div class="form-group">
                    <label class="form-label">类型</label>
                    <div style="display:flex; gap:8px;">
                        <label style="flex:1; padding:10px; border:2px solid var(--border); border-radius:8px; text-align:center; cursor:pointer;">
                            <input type="radio" name="type" value="expense" checked onchange="AccountingModule.onTypeChange('expense')" style="display:none;">
                            <span id="typeExpense">💸 支出</span>
                        </label>
                        <label style="flex:1; padding:10px; border:2px solid var(--border); border-radius:8px; text-align:center; cursor:pointer;">
                            <input type="radio" name="type" value="income" onchange="AccountingModule.onTypeChange('income')" style="display:none;">
                            <span id="typeIncome">💰 收入</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">金额 *</label>
                    <input type="number" class="form-input" id="accAmount" required placeholder="0.00" step="0.01" min="0.01">
                </div>
                <div class="form-group">
                    <label class="form-label">分类</label>
                    <div id="categoryGrid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px;">
                        ${this.renderCategoryOptions('expense')}
                    </div>
                    <input type="hidden" id="accCategory" value="food">
                </div>
                <div class="form-group">
                    <label class="form-label">账户</label>
                    <select class="form-select" id="accAccount">
                        ${accounts.map(a => `<option value="${a.id}">${a.icon} ${a.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">日期</label>
                    <input type="date" class="form-input" id="accDate" value="${Storage.formatDate()}">
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <input type="text" class="form-input" id="accNote" placeholder="可选备注">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">保存</button>
            </form>
        `;
        App.openModal('记一笔', html);
        // 默认选中第一个分类
        this.selectCategory('food');
    },

    showEditForm(id) {
        const record = this.getRecords().find(r => r.id === id);
        if (!record) return;

        const accounts = this.getAccounts();
        const html = `
            <form onsubmit="AccountingModule.save(event, '${id}')">
                <div class="form-group">
                    <label class="form-label">类型</label>
                    <div style="display:flex; gap:8px;">
                        <label style="flex:1; padding:10px; border:2px solid ${record.type === 'expense' ? 'var(--danger)' : 'var(--border)'}; border-radius:8px; text-align:center; cursor:pointer;">
                            <input type="radio" name="type" value="expense" ${record.type === 'expense' ? 'checked' : ''} onchange="AccountingModule.onTypeChange('expense')" style="display:none;">
                            <span>💸 支出</span>
                        </label>
                        <label style="flex:1; padding:10px; border:2px solid ${record.type === 'income' ? 'var(--success)' : 'var(--border)'}; border-radius:8px; text-align:center; cursor:pointer;">
                            <input type="radio" name="type" value="income" ${record.type === 'income' ? 'checked' : ''} onchange="AccountingModule.onTypeChange('income')" style="display:none;">
                            <span>💰 收入</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">金额 *</label>
                    <input type="number" class="form-input" id="accAmount" required value="${record.amount}" step="0.01" min="0.01">
                </div>
                <div class="form-group">
                    <label class="form-label">分类</label>
                    <div id="categoryGrid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px;">
                        ${this.renderCategoryOptions(record.type)}
                    </div>
                    <input type="hidden" id="accCategory" value="${record.category}">
                </div>
                <div class="form-group">
                    <label class="form-label">账户</label>
                    <select class="form-select" id="accAccount">
                        ${accounts.map(a => `<option value="${a.id}" ${record.accountId === a.id ? 'selected' : ''}>${a.icon} ${a.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">日期</label>
                    <input type="date" class="form-input" id="accDate" value="${record.date}">
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <input type="text" class="form-input" id="accNote" value="${this.escapeHtml(record.note || '')}">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">保存</button>
            </form>
        `;
        App.openModal('编辑记录', html);
        this.selectCategory(record.category);
    },

    renderCategoryOptions(type) {
        const categories = this.getCategories(type);
        const icons = this.getCategoryIcons();

        return categories.map(cat => `
            <div onclick="AccountingModule.selectCategory('${cat.id}')"
                 id="cat-${cat.id}"
                 style="padding:8px; border:2px solid var(--border); border-radius:8px; text-align:center; cursor:pointer; font-size:12px;">
                <div style="font-size:20px;">${icons[cat.id] || '📝'}</div>
                <div>${cat.name}</div>
            </div>
        `).join('');
    },

    selectCategory(catId) {
        // 清除所有选中
        document.querySelectorAll('[id^="cat-"]').forEach(el => {
            el.style.borderColor = 'var(--border)';
            el.style.background = 'transparent';
        });

        // 选中当前
        const el = document.getElementById(`cat-${catId}`);
        if (el) {
            el.style.borderColor = 'var(--primary)';
            el.style.background = 'var(--primary-bg)';
        }

        document.getElementById('accCategory').value = catId;
    },

    onTypeChange(type) {
        const grid = document.getElementById('categoryGrid');
        grid.innerHTML = this.renderCategoryOptions(type);

        // 更新类型按钮样式
        document.querySelector('label:nth-child(1)').style.borderColor = type === 'expense' ? 'var(--danger)' : 'var(--border)';
        document.querySelector('label:nth-child(2)').style.borderColor = type === 'income' ? 'var(--success)' : 'var(--border)';

        // 选中第一个分类
        const cats = this.getCategories(type);
        if (cats.length > 0) this.selectCategory(cats[0].id);
    },

    save(event, id) {
        event.preventDefault();

        const type = document.querySelector('input[name="type"]:checked').value;
        const amount = parseFloat(document.getElementById('accAmount').value);
        const category = document.getElementById('accCategory').value;
        const accountId = document.getElementById('accAccount').value;
        const date = document.getElementById('accDate').value;
        const note = document.getElementById('accNote').value;

        const accounts = this.getAccounts();
        const account = accounts.find(a => a.id === accountId);
        const accountName = account ? account.name : '';

        let records = this.getRecords();

        if (id) {
            const index = records.findIndex(r => r.id === id);
            if (index !== -1) {
                records[index] = { ...records[index], type, amount, category, accountId, accountName, date, note };
            }
        } else {
            records.push({
                id: Storage.generateId(),
                type, amount, category, accountId, accountName, date, note,
                createdAt: Date.now()
            });
        }

        this.saveRecords(records);
        App.closeModal();
        App.showToast(id ? '修改成功' : '记录成功', 'success');
        App.loadModule('accounting');
    },

    delete(id) {
        if (!confirm('确定删除这条记录吗？')) return;
        let records = this.getRecords();
        records = records.filter(r => r.id !== id);
        this.saveRecords(records);
        App.showToast('已删除', 'success');
        App.loadModule('accounting');
    },

    /**
     * 预算设置
     */
    showBudgetForm() {
        const budget = this.getBudget();
        const categories = this.getCategories('expense');

        const html = `
            <form onsubmit="AccountingModule.saveBudget(event)">
                <div class="form-group">
                    <label class="form-label">月度总预算</label>
                    <input type="number" class="form-input" id="budgetMonthly" value="${budget.monthly}" step="0.01" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label class="form-label">分类预算</label>
                    ${categories.map(cat => `
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                            <span style="width:80px; font-size:13px;">${this.getCategoryName(cat.id, 'expense')}</span>
                            <input type="number" class="form-input" id="budget_${cat.id}" value="${budget.categories[cat.id] || ''}" step="0.01" placeholder="0.00" style="flex:1;">
                        </div>
                    `).join('')}
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">保存预算</button>
            </form>
        `;
        App.openModal('设置预算', html);
    },

    saveBudget(event) {
        event.preventDefault();
        const monthly = parseFloat(document.getElementById('budgetMonthly').value) || 0;
        const categories = {};
        this.getCategories('expense').forEach(cat => {
            const val = parseFloat(document.getElementById(`budget_${cat.id}`).value);
            if (val > 0) categories[cat.id] = val;
        });

        this.saveBudget2({ monthly, categories });
        App.closeModal();
        App.showToast('预算已更新', 'success');
        App.loadModule('accounting');
    },

    // 避免方法名冲突
    saveBudget2(budget) {
        Storage.set(this.STORAGE_BUDGET, budget);
    },

    /**
     * 账户管理
     */
    showAccountForm(id) {
        const accounts = this.getAccounts();
        const account = id ? accounts.find(a => a.id === id) : null;

        const icons = ['💰', '🏦', '💳', '📱', '💵', '💴', '💶', '💷'];
        const iconOptions = icons.map(ic =>
            `<option value="${ic}" ${account && account.icon === ic ? 'selected' : ''}>${ic}</option>`
        ).join('');

        const html = `
            <form onsubmit="AccountingModule.saveAccount(event, ${id ? `'${id}'` : 'null'})">
                <div class="form-group">
                    <label class="form-label">图标</label>
                    <select class="form-select" id="accIcon">${iconOptions}</select>
                </div>
                <div class="form-group">
                    <label class="form-label">账户名称 *</label>
                    <input type="text" class="form-input" id="accName" required value="${account && account.name || ''}" placeholder="如：微信钱包">
                </div>
                <div class="form-group">
                    <label class="form-label">初始余额</label>
                    <input type="number" class="form-input" id="accBalance" value="${account && account.balance || 0}" step="0.01" ${id ? 'readonly' : ''} placeholder="0.00">
                    ${id ? '<div style="font-size:12px; color:var(--text-light); margin-top:4px;">编辑模式下不可修改初始余额</div>' : ''}
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">保存</button>
                ${id ? `<button type="button" class="btn btn-danger" style="width:100%; margin-top:8px;" onclick="AccountingModule.deleteAccount('${id}')">删除账户</button>` : ''}
            </form>
        `;
        App.openModal(id ? '编辑账户' : '添加账户', html);
    },

    saveAccount(event, id) {
        event.preventDefault();
        const icon = document.getElementById('accIcon').value;
        const name = document.getElementById('accName').value;
        const balance = parseFloat(document.getElementById('accBalance').value) || 0;

        let accounts = this.getAccounts();

        if (id) {
            const index = accounts.findIndex(a => a.id === id);
            if (index !== -1) {
                accounts[index].icon = icon;
                accounts[index].name = name;
            }
        } else {
            accounts.push({
                id: Storage.generateId(),
                name, icon, balance,
                createdAt: Date.now()
            });
        }

        this.saveAccounts(accounts);
        App.closeModal();
        App.showToast('账户已保存', 'success');
        App.loadModule('accounting');
    },

    deleteAccount(id) {
        if (!confirm('删除账户将无法恢复，确定删除吗？')) return;
        let accounts = this.getAccounts();
        accounts = accounts.filter(a => a.id !== id);
        this.saveAccounts(accounts);
        App.closeModal();
        App.showToast('账户已删除', 'success');
        App.loadModule('accounting');
    },

    /**
     * 月份切换
     */
    prevMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
        App.loadModule('accounting');
    },

    nextMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
        App.loadModule('accounting');
    },

    switchTab(tab) {
        this.currentTab = tab;
        App.loadModule('accounting');
    },

    /**
     * 分类配置
     */
    getCategories(type) {
        if (type === 'expense') {
            return [
                { id: 'food', name: '餐饮' },
                { id: 'grocery', name: '生鲜' },
                { id: 'transport', name: '交通' },
                { id: 'shopping', name: '购物' },
                { id: 'entertainment', name: '娱乐' },
                { id: 'housing', name: '住房' },
                { id: 'medical', name: '医疗' },
                { id: 'education', name: '教育' },
                { id: 'social', name: '社交' },
                { id: 'phone', name: '通讯' },
                { id: 'sport', name: '运动' },
                { id: 'other_expense', name: '其他' }
            ];
        } else {
            return [
                { id: 'salary', name: '工资' },
                { id: 'bonus', name: '奖金' },
                { id: 'investment', name: '理财' },
                { id: 'redpacket', name: '红包' },
                { id: 'refund', name: '退款' },
                { id: 'other_income', name: '其他' }
            ];
        }
    },

    getCategoryName(categoryId, type) {
        const categories = this.getCategories(type);
        const cat = categories.find(c => c.id === categoryId);
        return cat ? cat.name : categoryId;
    },

    getCategoryIcons() {
        return {
            food: '🍔', grocery: '🥬', transport: '🚗', shopping: '🛍️',
            entertainment: '🎮', housing: '🏠', medical: '💊', education: '📚',
            social: '🍻', phone: '📱', sport: '🏊', other_expense: '📝',
            salary: '💼', bonus: '🎁', investment: '📈', redpacket: '🧧',
            refund: '↩️', other_income: '💰'
        };
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};
