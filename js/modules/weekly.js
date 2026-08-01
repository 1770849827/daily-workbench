/**
 * 周报 / 月报 共用计算与渲染工具
 * 周报(weekly.js) 与 月报(monthly.js) 都依赖本文件中的 ReportCommon。
 * 注意：weekly.js 必须在 monthly.js 之前加载。
 *
 * 各模块真实 storage key（与现有模块保持一致）：
 *   todo        -> 'todos'
 *   english     -> 'english_records'
 *   calligraphy -> 'calligraphy_records'
 *   fitness     -> 'fitness_records'
 *   meal        -> 'meal_records'
 *   savings     -> 'savings_plan'
 *   accounting  -> 'acc_records'
 *   places      -> 'places_records'
 */
const ReportCommon = {
    KEYS: {
        todo: 'todos',
        english: 'english_records',
        calligraphy: 'calligraphy_records',
        fitness: 'fitness_records',
        meal: 'meal_records',
        savings: 'savings_plan',
        accounting: 'acc_records'
    },

    /**
     * 本周（周一 ~ 周日）范围，返回 'YYYY-MM-DD' 字符串
     */
    getWeekRangeStr: function () {
        var now = new Date();
        var day = now.getDay() || 7; // 周日为 0，转成 7
        var monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1);
        var sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 7);
        return { start: Storage.formatDate(monday), end: Storage.formatDate(sunday) };
    },

    /**
     * 本月（自然月）范围，返回 'YYYY-MM-DD' 字符串
     */
    getMonthRangeStr: function () {
        var now = new Date();
        var start = new Date(now.getFullYear(), now.getMonth(), 1);
        var end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start: Storage.formatDate(start), end: Storage.formatDate(end) };
    },

    /**
     * 依据时间范围汇总各模块数据
     * @param {string} rangeType 'week' | 'month'
     */
    compute: function (rangeType) {
        var range = rangeType === 'month' ? this.getMonthRangeStr() : this.getWeekRangeStr();
        var startStr = range.start;
        var endStr = range.end;
        var self = this;

        function inRange(ds) {
            return ds && ds >= startStr && ds <= endStr;
        }

        // ===== 每日计划 =====
        var todos = Storage.get(this.KEYS.todo, []);
        var todosIn = todos.filter(function (t) { return inRange(t.date); });
        var todoTotal = todosIn.length;
        var todoDone = todosIn.filter(function (t) { return t.completed; }).length;
        var todoRate = todoTotal > 0 ? Math.round(todoDone / todoTotal * 100) : 0;

        // ===== 英语学习 =====
        var eng = Storage.get(this.KEYS.english, []);
        var engIn = eng.filter(function (r) { return inRange(r.date); });
        var engWords = engIn.reduce(function (s, r) { return s + (parseInt(r.words, 10) || 0); }, 0);
        var engSpell = engIn.reduce(function (m, r) { return Math.max(m, parseInt(r.spellingBest, 10) || 0); }, 0);
        var engTrans = engIn.reduce(function (m, r) { return Math.max(m, parseInt(r.translationBest, 10) || 0); }, 0);

        // ===== 硬笔练字 =====
        var cal = Storage.get(this.KEYS.calligraphy, []);
        var calIn = cal.filter(function (r) { return inRange(r.date); });
        var calCount = calIn.length;
        var calDuration = calIn.reduce(function (s, r) { return s + (parseInt(r.duration, 10) || 0); }, 0);

        // ===== 游泳健身 =====
        var fit = Storage.get(this.KEYS.fitness, []);
        var fitIn = fit.filter(function (r) { return inRange(r.date); });
        var fitCount = fitIn.length;
        var fitDuration = fitIn.reduce(function (s, r) { return s + (parseInt(r.duration, 10) || 0); }, 0);
        var fitCalories = fitIn.reduce(function (s, r) { return s + (parseInt(r.calories, 10) || 0); }, 0);

        // ===== 记录饮食 =====
        var meal = Storage.get(this.KEYS.meal, []);
        var mealIn = meal.filter(function (r) { return inRange(r.date); });
        var mealDays = {};
        var waterByDay = {};
        mealIn.forEach(function (r) {
            mealDays[r.date] = true;
            if (r.mealType === 'water') {
                waterByDay[r.date] = (waterByDay[r.date] || 0) + (parseInt(r.waterAmount, 10) || 0);
            }
        });
        var mealDayCount = Object.keys(mealDays).length;
        var waterOkDays = 0;
        for (var d in waterByDay) {
            if (waterByDay[d] >= 2000) waterOkDays++;
        }

        // ===== 存钱计划 =====
        var plan = Storage.get(this.KEYS.savings, { saved: 0, totalGoal: 0, monthlyGoal: 0, history: [] });
        var saved = parseFloat(plan.saved) || 0;
        var totalGoal = parseFloat(plan.totalGoal) || 0;
        var now = new Date();
        var monthPrefix = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        var monthSaved = (plan.history || []).filter(function (h) {
            return h.date && h.date.indexOf(monthPrefix) === 0;
        }).reduce(function (s, h) { return s + (parseFloat(h.amount) || 0); }, 0);
        var savingsRate = totalGoal > 0 ? Math.min(Math.round(saved / totalGoal * 100), 100) : 0;

        // ===== 每日记账 =====
        var acc = Storage.get(this.KEYS.accounting, []);
        var accIn = acc.filter(function (r) { return inRange(r.date); });
        var accIncome = accIn.filter(function (r) { return r.type === 'income'; })
            .reduce(function (s, r) { return s + (parseFloat(r.amount) || 0); }, 0);
        var accExpense = accIn.filter(function (r) { return r.type === 'expense'; })
            .reduce(function (s, r) { return s + (parseFloat(r.amount) || 0); }, 0);

        // ===== 综合评分 =====
        var active = 0;
        if (engWords > 0) active++;
        if (calCount > 0) active++;
        if (fitCount > 0) active++;
        if (mealDayCount > 0) active++;
        var score = Math.round(todoRate * 0.3 + (active / 4) * 70);

        var hasData = todoTotal > 0 || engWords > 0 || calCount > 0 || fitCount > 0 ||
            mealDayCount > 0 || accIncome > 0 || accExpense > 0 ||
            monthSaved > 0 || saved > 0;

        return {
            rangeType: rangeType,
            startStr: startStr,
            endStr: endStr,
            todoTotal: todoTotal,
            todoDone: todoDone,
            todoRate: todoRate,
            engWords: engWords,
            engSpell: engSpell,
            engTrans: engTrans,
            calCount: calCount,
            calDuration: calDuration,
            fitCount: fitCount,
            fitDuration: fitDuration,
            fitCalories: fitCalories,
            mealDayCount: mealDayCount,
            waterOkDays: waterOkDays,
            saved: saved,
            totalGoal: totalGoal,
            monthSaved: monthSaved,
            savingsRate: savingsRate,
            accIncome: accIncome,
            accExpense: accExpense,
            score: score,
            hasData: hasData
        };
    },

    /**
     * 单个模块数据卡片（带实线/虚线边框 + 暹罗厘普贴纸）
     */
    card: function (title, items) {
        // 判断是否有数据：任一 value 不为 0 / 空 即视为已填写
        var hasData = items.some(function (it) {
            var v = String(it.value || '').replace(/[^0-9.]/g, '');
            return parseFloat(v) > 0;
        });
        // 根据标题匹配贴纸（每张卡片不同角色）
        var stickerMap = {
            '📋 每日计划': 'g1_cat_duck_slide',
            '🌍 英语学习': 'g1_dog_mirror',
            '✍️ 硬笔练字': 'g1_dog_cool_lie',
            '💪 游泳健身': 'g1_dog_fries',
            '🥄 记录饮食': 'g1_duck_carrot_gun',
            '💰 存钱计划': 'g1_rabbit_cry_stack',
            '🧾 每日记账': 'g1_rabbit_cat_sleep'
        };
        var stickerName = stickerMap[title] || 'duck';
        var borderStyle = App.cardBorderStyle(hasData);
        var stickerHtml = '<div style="position:absolute; top:-6px; right:-4px; opacity:1; transform:rotate(-10deg); z-index:2;">' + App.renderSticker(stickerName) + '</div>';

        var rows = items.map(function (it) {
            var color = it.color || 'var(--text)';
            return '<div style="display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px dashed var(--border-light); font-size:14px;">'
                + '<span style="color:var(--text-secondary);">' + it.label + '</span>'
                + '<span style="font-weight:600; color:' + color + ';">' + it.value + '</span></div>';
        }).join('');
        return '<div class="card" style="margin-bottom:14px; position:relative; ' + borderStyle + '">'
            + stickerHtml
            + '<h3 style="font-size:15px; margin-bottom:8px; color:var(--text);">' + title + '</h3>'
            + rows
            + '</div>';
    },

    fmtMoney: function (n) {
        return '¥' + (parseFloat(n) || 0).toFixed(2);
    },

    /**
     * 生成总结文案 + 鼓励性点评
     * @param {object} data compute() 的返回结果
     * @param {string} type 'week' | 'month'
     */
    getComment: function (data, type) {
        var score = data.score;
        var period = type === 'week' ? '本周' : '本月';

        var levels, messages;

        if (type === 'week') {
            if (score >= 90) {
                levels = ['全勤模范 🏆', '周度之星 ⭐'];
                messages = [
                    '这一周你几乎把所有习惯都安排得满满当当，执行力爆表！保持节奏，下周继续领跑。',
                    '全勤的一周！你的自律已经成了生活的底色，给自己一个大大的赞。'
                ];
            } else if (score >= 75) {
                levels = ['表现优秀 👍', '稳步向前 💪'];
                messages = [
                    '本周完成度很高，几个核心习惯都坚持下来了，再补上小缺口就是满分周。',
                    '不错的节奏！保持这份专注，下周把计划完成率再拉高一点就更完美了。'
                ];
            } else if (score >= 60) {
                levels = ['良好 🌿', '渐入佳境 🌱'];
                messages = [
                    '本周有在认真生活，但还有提升空间。挑一两个最容易坚持的习惯先固定下来。',
                    '良好开局！把每日计划拆细一点，完成率上来整体评分会明显提升。'
                ];
            } else {
                levels = ['需努力 🔥', '蓄势待发 🌅'];
                messages = [
                    '这一周稍微松懈了些，没关系，周末重新规划，从明天的第一个小目标开始。',
                    '万事开头难，先让习惯"发生"比追求完美更重要，明天就打卡一个小项目吧！'
                ];
            }
        } else {
            if (score >= 90) {
                levels = ['月度传奇 🏅', '自律王者 👑'];
                messages = [
                    '整月几乎全勤，你已经把自律活成了日常。这份坚持，时间会给出复利。',
                    '了不起的一月！每个模块都留下了你的足迹，下个月向更高目标进发。'
                ];
            } else if (score >= 75) {
                levels = ['月度优秀 🌟', '稳健成长 📈'];
                messages = [
                    '本月整体完成度很高，多个习惯已形成闭环。下个月试着把薄弱项也点亮。',
                    '扎实的一个月！你的坚持正在悄悄改变生活质感，继续保持这份节奏。'
                ];
            } else if (score >= 60) {
                levels = ['月度良好 🌿', '持续积累 🪴'];
                messages = [
                    '本月有起有伏，但总体在向前。把波动最大的习惯固定成每日提醒会更好。',
                    '良好但不满足，下个月我们瞄准"全模块打卡"，让每个月都有迹可循。'
                ];
            } else {
                levels = ['需加把劲 💡', '重新出发 🌅'];
                messages = [
                    '这个月有些断断续续，别气馁，新月份就是全新的开始，先定一个最小目标。',
                    '积累需要时间，哪怕本月只点亮一两个习惯，也是通往更好自己的第一步。'
                ];
            }
        }

        var level = levels[Math.floor(Math.random() * levels.length)];
        var msg = messages[Math.floor(Math.random() * messages.length)];

        return { period: period, level: level, message: msg };
    },

    /**
     * 组装完整 HTML
     */
    buildHtml: function (data, comment) {
        if (!data.hasData) {
            return '<div class="page-header">'
                + '<div><h2 class="page-title">' + (data.rangeType === 'week' ? '📊 周报' : '📅 月报') + '</h2>'
                + '<p class="page-subtitle">' + this.rangeText(data) + '</p></div></div>'
                + '<div class="empty-state"><div class="empty-state-icon">' + (data.rangeType === 'week' ? '📊' : '📅') + '</div>'
                + '<div class="empty-state-text">这一' + (data.rangeType === 'week' ? '周' : '月') + '还没有任何打卡记录<br>去各个模块留下第一个足迹吧～</div></div>';
        }

        var period = comment.period;

        var html = ''
            + '<div class="page-header"><div>'
            + '<h2 class="page-title">' + (data.rangeType === 'week' ? '📊 周报' : '📅 月报') + '</h2>'
            + '<p class="page-subtitle">' + this.rangeText(data) + '</p>'
            + '</div></div>';

        // 每日计划
        html += this.card('📋 每日计划', [
            { label: '完成率', value: data.todoRate + '%', color: data.todoRate === 100 ? 'var(--success)' : 'var(--primary)' },
            { label: '完成情况', value: data.todoDone + ' / ' + data.todoTotal }
        ]);

        // 英语学习
        html += this.card('🌍 英语学习', [
            { label: '背单词总数', value: data.engWords + ' 个', color: 'var(--primary)' },
            { label: '拼写最佳', value: data.engSpell + ' / 10' },
            { label: '互译最佳', value: data.engTrans + ' / 10' }
        ]);

        // 硬笔练字
        html += this.card('✍️ 硬笔练字', [
            { label: '练习次数', value: data.calCount + ' 次', color: 'var(--primary)' },
            { label: '总时长', value: data.calDuration + ' 分钟' }
        ]);

        // 游泳健身
        html += this.card('💪 游泳健身', [
            { label: '运动次数', value: data.fitCount + ' 次', color: 'var(--info)' },
            { label: '总时长', value: data.fitDuration + ' 分钟' },
            { label: '总消耗热量', value: data.fitCalories + ' kcal', color: 'var(--danger)' }
        ]);

        // 记录饮食
        html += this.card('🥄 记录饮食', [
            { label: '打卡天数', value: data.mealDayCount + ' 天', color: 'var(--primary)' },
            { label: '喝水达标天数', value: data.waterOkDays + ' 天', color: 'var(--info)' }
        ]);

        // 存钱计划
        html += this.card('💰 存钱计划', [
            { label: '最新进度', value: data.savingsRate + '%', color: 'var(--success)' },
            { label: '已存金额', value: this.fmtMoney(data.saved) },
            { label: '本月存入', value: this.fmtMoney(data.monthSaved), color: 'var(--success)' }
        ]);

        // 每日记账
        html += this.card('🧾 每日记账', [
            { label: period + '收入', value: this.fmtMoney(data.accIncome), color: 'var(--success)' },
            { label: period + '支出', value: this.fmtMoney(data.accExpense), color: 'var(--danger)' }
        ]);

        // ===== 总结文案 + 点评 =====
        var summary = this.buildSummaryText(data, period);

        html += '<div class="card" style="background:linear-gradient(135deg, var(--primary), var(--primary-light)); color:#fff; border:none;">'
            + '<h3 style="font-size:15px; margin-bottom:10px; opacity:.95;">📝 ' + period + '总结</h3>'
            + '<p style="font-size:14px; line-height:1.8; opacity:.97;">' + summary + '</p>'
            + '</div>';

        html += '<div class="card" style="text-align:center; margin-top:14px;">'
            + '<div style="display:inline-block; padding:4px 14px; border-radius:20px; font-size:13px; font-weight:700; background:var(--primary-bg); color:var(--primary); margin-bottom:10px;">综合评分 ' + data.score + ' 分 · ' + comment.level + '</div>'
            + '<p style="font-size:14px; line-height:1.8; color:var(--text-secondary);">' + comment.message + '</p>'
            + '</div>';

        return html;
    },

    rangeText: function (data) {
        if (data.rangeType === 'week') {
            var s = data.startStr.split('-');
            var e = data.endStr.split('-');
            return s[1] + '月' + s[2] + '日 - ' + e[1] + '月' + e[2] + '日';
        }
        var m = data.startStr.split('-');
        return m[0] + '年' + m[1] + '月';
    },

    buildSummaryText: function (data, period) {
        var parts = [];
        if (data.todoTotal > 0) parts.push('完成计划 ' + data.todoDone + '/' + data.todoTotal + '（' + data.todoRate + '%）');
        if (data.engWords > 0) parts.push('背单词 ' + data.engWords + ' 个');
        if (data.calCount > 0) parts.push('练字 ' + data.calCount + ' 次');
        if (data.fitCount > 0) parts.push('运动 ' + data.fitCount + ' 次');
        if (data.mealDayCount > 0) parts.push('记录饮食 ' + data.mealDayCount + ' 天');
        if (data.monthSaved > 0) parts.push('存钱 ' + this.fmtMoney(data.monthSaved));

        if (parts.length === 0) {
            return period + '你已开启了记录之旅，更多精彩数据正在路上，继续保持打卡吧！';
        }
        return period + '你' + parts.join('，') + '。每一个坚持的瞬间，都在悄悄塑造更好的自己。';
    }
};

/**
 * 周报模块
 */
const WeeklyModule = {
    STORAGE_KEY: 'weekly_report',

    render: function (container) {
        var data = ReportCommon.compute('week');
        var comment = ReportCommon.getComment(data, 'week');
        container.innerHTML = ReportCommon.buildHtml(data, comment);
    }
};
