/**
 * 存钱计划模块
 */
const SavingsModule = {
    STORAGE_KEY: 'savings_plan',

    getPlan() {
        return Storage.get(this.STORAGE_KEY, {
            totalGoal: 0,
            monthlyGoal: 0,
            saved: 0,
            subGoals: [],
            history: []
        });
    },

    savePlan(plan) {
        Storage.set(this.STORAGE_KEY, plan);
    },

    render(container) {
        const plan = this.getPlan();
        const today = new Date();
        const monthPrefix = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`;

        // 本月已存
        const monthSaved = plan.history
            .filter(h => h.date.startsWith(monthPrefix))
            .reduce((s, h) => s + (parseFloat(h.amount) || 0), 0);

        const totalProgress = plan.totalGoal > 0 ? Math.min(plan.saved / plan.totalGoal * 100, 100) : 0;
        const monthProgress = plan.monthlyGoal > 0 ? Math.min(monthSaved / plan.monthlyGoal * 100, 100) : 0;
        const difference = plan.totalGoal - plan.saved;

        // 预计完成时间
        let estimateText = '设置月度目标后可预估';
        if (plan.monthlyGoal > 0 && plan.saved < plan.totalGoal) {
            const monthsLeft = Math.ceil(difference / plan.monthlyGoal);
            if (monthsLeft > 0 && monthsLeft < 600) {
                const endDate = new Date(today.getFullYear(), today.getMonth() + monthsLeft, 1);
                estimateText = `预计 ${endDate.getFullYear()}年${endDate.getMonth()+1}月达成`;
            } else if (monthsLeft <= 0) {
                estimateText = '已达成目标！🎉';
            } else {
                estimateText = '需要较长时间';
            }
        }

        let html = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">存钱计划</h2>
                    <p class="page-subtitle">积少成多，聚沙成塔</p>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-secondary btn-sm" onclick="SavingsModule.showSetGoalForm()">⚙️ 设置</button>
                    <button class="btn btn-primary btn-sm" onclick="SavingsModule.showDepositForm()">💰 存入</button>
                </div>
            </div>

            <!-- 总目标 -->
            <div class="card" style="background:linear-gradient(135deg, var(--primary), var(--primary-light)); color:white; border:none; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <span style="font-size:14px; opacity:0.9;">🎯 总目标</span>
                    <span style="font-size:14px; opacity:0.9;">${estimateText}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:12px;">
                    <div>
                        <div style="font-size:32px; font-weight:700;">¥${plan.saved.toFixed(2)}</div>
                        <div style="font-size:13px; opacity:0.8;">已存金额</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:18px; font-weight:600;">¥${plan.totalGoal.toFixed(2)}</div>
                        <div style="font-size:13px; opacity:0.8;">目标</div>
                    </div>
                </div>
                <div style="background:rgba(255,255,255,0.3); height:10px; border-radius:5px; overflow:hidden; margin-bottom:8px;">
                    <div style="background:white; height:100%; width:${totalProgress}%; border-radius:5px; transition:width 0.3s;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px; opacity:0.9;">
                    <span>${totalProgress.toFixed(1)}% 完成</span>
                    <span>差额 ¥${difference > 0 ? difference.toFixed(2) : '0.00'}</span>
                </div>
            </div>

            <!-- 月度储蓄目标 -->
            <div class="card" style="margin-bottom:16px; ${App.cardBorderStyle(monthSaved > 0)} position:relative;">
                <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g3_rabbit_dress')}</div>
                <h3 style="font-size:15px; margin-bottom:12px;">📅 月度储蓄目标</h3>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span style="font-size:14px;">本月已存</span>
                    <span style="font-size:14px; font-weight:600; color:var(--success);">¥${monthSaved.toFixed(2)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span style="font-size:14px;">月度目标</span>
                    <span style="font-size:14px; font-weight:600;">¥${plan.monthlyGoal.toFixed(2)}</span>
                </div>
                <div class="progress-bar" style="height:10px; margin-bottom:8px;">
                    <div class="progress-fill" style="width:${monthProgress}%;"></div>
                </div>
                <div style="font-size:12px; color:var(--text-light); text-align:right;">
                    ${monthProgress.toFixed(1)}% · ${plan.monthlyGoal - monthSaved > 0 ? `还差 ¥${(plan.monthlyGoal-monthSaved).toFixed(2)}` : '已达标🎉'}
                </div>
            </div>

            <!-- 攒钱小目标拆分 -->
            <div class="card" style="margin-bottom:16px; ${App.cardBorderStyle(plan.subGoals.length > 0)}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-size:15px;">📌 攒钱小目标</h3>
                    <button class="btn btn-primary btn-sm" onclick="SavingsModule.showSubGoalForm()">➕ 添加</button>
                </div>
        `;

        if (plan.subGoals.length === 0) {
            html += '<div class="empty-state" style="padding:20px;"><div class="empty-state-text">还没有小目标<br>添加一个小目标开始攒钱吧</div></div>';
        } else {
            plan.subGoals.forEach(sg => {
                const sgProgress = sg.goal > 0 ? Math.min(sg.saved / sg.goal * 100, 100) : 0;
                const isComplete = sg.saved >= sg.goal;
                html += `
                    <div style="margin-bottom:12px; padding:12px; background:var(--bg); border-radius:8px; ${App.cardBorderStyle(isComplete)}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <span style="font-weight:600;">${isComplete ? '✅' : '🎯'} ${this.escapeHtml(sg.name)}</span>
                            <span style="font-size:13px;">¥${sg.saved.toFixed(0)} / ¥${sg.goal.toFixed(0)}</span>
                        </div>
                        <div class="progress-bar" style="height:8px; margin-bottom:6px;">
                            <div class="progress-fill" style="width:${sgProgress}%; background:${isComplete ? 'var(--success)' : 'var(--primary)'};"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:12px; color:var(--text-light);">${sgProgress.toFixed(0)}%</span>
                            <div class="action-buttons">
                                <button class="action-btn" onclick="SavingsModule.addToSubGoal('${sg.id}')">存入</button>
                                <button class="action-btn danger" onclick="SavingsModule.deleteSubGoal('${sg.id}')">删除</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';

        // 存钱记录
        html += `
            <div class="card" style="${App.cardBorderStyle(plan.history.length > 0)} position:relative;">
                <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g1_rabbit_dog_sit')}</div>
                <h3 style="font-size:15px; margin-bottom:12px;">📝 存钱记录</h3>
        `;

        if (plan.history.length === 0) {
            html += '<div class="empty-state" style="padding:20px;"><div class="empty-state-text">还没有存钱记录</div></div>';
        } else {
            const recent = [...plan.history].sort((a,b) => b.createdAt - a.createdAt).slice(0, 20);
            recent.forEach(h => {
                const d = new Date(h.date);
                html += `
                    <div class="list-item">
                        <span style="font-size:20px;">💰</span>
                        <div style="flex:1;">
                            <div style="font-weight:600; color:var(--success);">+¥${h.amount.toFixed(2)}</div>
                            ${h.note ? `<div style="font-size:13px; color:var(--text-light);">${this.escapeHtml(h.note)}</div>` : ''}
                            <div style="font-size:12px; color:var(--text-light);">${d.getMonth()+1}月${d.getDate()}日</div>
                        </div>
                        <div class="action-buttons">
                            <button class="action-btn danger" onclick="SavingsModule.deleteHistory('${h.id}')">删除</button>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';

        container.innerHTML = html;
    },

    showSetGoalForm() {
        const plan = this.getPlan();
        const html = `
            <form onsubmit="SavingsModule.saveGoal(event)">
                <div class="form-group">
                    <label class="form-label">总目标金额 (¥)</label>
                    <input type="number" class="form-input" id="totalGoal" value="${plan.totalGoal}" step="100" min="0" placeholder="如 50000">
                </div>
                <div class="form-group">
                    <label class="form-label">月度储蓄目标 (¥)</label>
                    <input type="number" class="form-input" id="monthlyGoal" value="${plan.monthlyGoal}" step="100" min="0" placeholder="如 3000">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">保存</button>
            </form>
        `;
        App.openModal('设置目标', html);
    },

    saveGoal(event) {
        event.preventDefault();
        const plan = this.getPlan();
        plan.totalGoal = parseFloat(document.getElementById('totalGoal').value) || 0;
        plan.monthlyGoal = parseFloat(document.getElementById('monthlyGoal').value) || 0;
        this.savePlan(plan);
        App.closeModal();
        App.showToast('目标已更新', 'success');
        App.loadModule('savings');
    },

    showDepositForm() {
        const html = `
            <form onsubmit="SavingsModule.saveDeposit(event)">
                <div class="form-group">
                    <label class="form-label">存入金额 (¥)</label>
                    <input type="number" class="form-input" id="depositAmount" required step="0.01" min="0.01" placeholder="如 500">
                </div>
                <div class="form-group">
                    <label class="form-label">日期</label>
                    <input type="date" class="form-input" id="depositDate" value="${Storage.formatDate()}">
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <input type="text" class="form-input" id="depositNote" placeholder="如：本月工资结余">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">存入</button>
            </form>
        `;
        App.openModal('💰 存入金额', html);
    },

    saveDeposit(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('depositAmount').value);
        const date = document.getElementById('depositDate').value;
        const note = document.getElementById('depositNote').value;

        const plan = this.getPlan();
        plan.saved += amount;
        plan.history.push({
            id: Storage.generateId(),
            amount, date, note,
            createdAt: Date.now()
        });
        this.savePlan(plan);
        App.closeModal();
        App.showToast(`存入 ¥${amount.toFixed(2)} 成功！`, 'success');
        App.loadModule('savings');
    },

    showSubGoalForm(id) {
        const plan = this.getPlan();
        const sg = id ? plan.subGoals.find(s => s.id === id) : null;

        const html = `
            <form onsubmit="SavingsModule.saveSubGoal(event, ${id ? `'${id}'` : 'null'})">
                <div class="form-group">
                    <label class="form-label">目标名称</label>
                    <input type="text" class="form-input" id="sgName" required value="${sg ? this.escapeHtml(sg.name) : ''}" placeholder="如：买新手机">
                </div>
                <div class="form-group">
                    <label class="form-label">目标金额 (¥)</label>
                    <input type="number" class="form-input" id="sgGoal" required step="100" min="1" value="${sg ? sg.goal : ''}" placeholder="如 5000">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">${id ? '保存' : '添加'}</button>
            </form>
        `;
        App.openModal(id ? '编辑小目标' : '添加小目标', html);
    },

    saveSubGoal(event, id) {
        event.preventDefault();
        const name = document.getElementById('sgName').value;
        const goal = parseFloat(document.getElementById('sgGoal').value);

        const plan = this.getPlan();

        if (id) {
            const idx = plan.subGoals.findIndex(s => s.id === id);
            if (idx !== -1) {
                plan.subGoals[idx].name = name;
                plan.subGoals[idx].goal = goal;
            }
        } else {
            plan.subGoals.push({
                id: Storage.generateId(),
                name, goal, saved: 0
            });
        }

        this.savePlan(plan);
        App.closeModal();
        App.showToast(id ? '修改成功' : '添加成功', 'success');
        App.loadModule('savings');
    },

    addToSubGoal(subGoalId) {
        const html = `
            <form onsubmit="SavingsModule.saveSubGoalDeposit(event, '${subGoalId}')">
                <div class="form-group">
                    <label class="form-label">存入金额 (¥)</label>
                    <input type="number" class="form-input" id="sgDepositAmount" required step="0.01" min="0.01" placeholder="如 200">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">存入</button>
            </form>
        `;
        App.openModal('向小目标存钱', html);
    },

    saveSubGoalDeposit(event, subGoalId) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('sgDepositAmount').value);

        const plan = this.getPlan();
        const sg = plan.subGoals.find(s => s.id === subGoalId);
        if (sg) {
            sg.saved += amount;
            plan.saved += amount;
            plan.history.push({
                id: Storage.generateId(),
                amount, date: Storage.formatDate(),
                note: `小目标：${sg.name}`,
                createdAt: Date.now()
            });
            this.savePlan(plan);
            App.closeModal();
            App.showToast(`存入 ¥${amount.toFixed(2)} 成功！`, 'success');
            App.loadModule('savings');
        }
    },

    deleteSubGoal(id) {
        if (!confirm('确定删除这个小目标吗？')) return;
        const plan = this.getPlan();
        plan.subGoals = plan.subGoals.filter(s => s.id !== id);
        this.savePlan(plan);
        App.showToast('已删除', 'success');
        App.loadModule('savings');
    },

    deleteHistory(id) {
        if (!confirm('确定删除这条记录吗？已存金额会相应减少。')) return;
        const plan = this.getPlan();
        const h = plan.history.find(x => x.id === id);
        if (h) {
            plan.saved -= h.amount;
            plan.history = plan.history.filter(x => x.id !== id);
            this.savePlan(plan);
        }
        App.showToast('已删除', 'success');
        App.loadModule('savings');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};
