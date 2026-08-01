const EnglishModule = {
    STORAGE_KEY: 'english_records',

    // 内置单词库（按日期轮换，每天5-8个）
    WORD_BANK: [
        { word: 'persevere', phonetic: '/ˌpɜːsɪˈvɪə(r)/', meaning: '坚持，不屈不挠', example: 'You must persevere even when things get difficult.' },
        { word: 'resilient', phonetic: '/rɪˈzɪliənt/', meaning: '有韧性的，能迅速恢复的', example: 'She is a resilient person who never gives up.' },
        { word: 'flourish', phonetic: '/ˈflʌrɪʃ/', meaning: '繁荣，茁壮成长', example: 'The business began to flourish after the new investment.' },
        { word: 'eloquent', phonetic: '/ˈeləkwənt/', meaning: '雄辩的，有口才的', example: 'He gave an eloquent speech at the ceremony.' },
        { word: 'diligent', phonetic: '/ˈdɪlɪdʒənt/', meaning: '勤奋的，勤勉的', example: 'She is a diligent student who always finishes her homework on time.' },
        { word: 'gratitude', phonetic: '/ˈɡrætɪtjuːd/', meaning: '感激，感恩', example: 'I want to express my gratitude for your generous help.' },
        { word: 'ambitious', phonetic: '/æmˈbɪʃəs/', meaning: '有雄心的，野心勃勃的', example: 'He has an ambitious plan to start his own company.' },
        { word: 'curiosity', phonetic: '/ˌkjʊəriˈɒsəti/', meaning: '好奇心', example: 'Curiosity is the engine of learning and discovery.' },
        { word: 'enthusiasm', phonetic: '/ɪnˈθjuːziæzəm/', meaning: '热情，热忱', example: 'Her enthusiasm for teaching inspires all her students.' },
        { word: 'patience', phonetic: '/ˈpeɪʃns/', meaning: '耐心', example: 'Learning a new language requires time and patience.' },
        { word: 'adventure', phonetic: '/ədˈventʃə(r)/', meaning: '冒险，奇遇', example: 'Life is an adventure — embrace every moment of it.' },
        { word: 'brilliant', phonetic: '/ˈbrɪliənt/', meaning: '杰出的，明亮的', example: 'That was a brilliant idea that solved our problem.' },
        { word: 'compassion', phonetic: '/kəmˈpæʃn/', meaning: '同情，怜悯', example: 'A good leader shows compassion for their team members.' },
        { word: 'determined', phonetic: '/dɪˈtɜːmɪnd/', meaning: '坚决的，有决心的', example: 'She is determined to achieve her goals this year.' },
        { word: 'generous', phonetic: '/ˈdʒenərəs/', meaning: '慷慨的，大方的', example: 'It was very generous of you to share your notes with us.' },
        { word: 'harmony', phonetic: '/ˈhɑːməni/', meaning: '和谐，融洽', example: 'The team works in harmony to complete the project.' },
        { word: 'innovative', phonetic: '/ˈɪnəveɪtɪv/', meaning: '创新的，革新的', example: 'The company is known for its innovative products.' },
        { word: 'optimistic', phonetic: '/ˌɒptɪˈmɪstɪk/', meaning: '乐观的', example: 'Stay optimistic — better days are coming.' },
        { word: 'perspective', phonetic: '/pəˈspektɪv/', meaning: '视角，观点', example: 'Try to see the problem from a different perspective.' },
        { word: 'remarkable', phonetic: '/rɪˈmɑːkəbl/', meaning: '非凡的，引人注目的', example: 'She has made remarkable progress in her English.' },
        { word: 'sophisticated', phonetic: '/səˈfɪstɪkeɪtɪd/', meaning: '精密的，老练的', example: 'This is a highly sophisticated piece of technology.' },
        { word: 'tenacious', phonetic: '/təˈneɪʃəs/', meaning: '坚韧的，顽强的', example: 'Her tenacious spirit helped her overcome all obstacles.' },
        { word: 'versatile', phonetic: '/ˈvɜːsətaɪl/', meaning: '多才多艺的，多功能的', example: 'He is a versatile musician who plays five instruments.' },
        { word: 'wisdom', phonetic: '/ˈwɪzdəm/', meaning: '智慧', example: 'Experience is the mother of wisdom.' },
        { word: 'accomplish', phonetic: '/əˈkʌmplɪʃ/', meaning: '完成，实现', example: 'We can accomplish anything if we work together.' },
        { word: 'benevolent', phonetic: '/bəˈnevələnt/', meaning: '仁慈的，慈善的', example: 'The benevolent donor helped build the new library.' },
        { word: 'courageous', phonetic: '/kəˈreɪdʒəs/', meaning: '勇敢的', example: 'It was a courageous decision to speak up for what is right.' },
        { word: 'discipline', phonetic: '/ˈdɪsəplɪn/', meaning: '纪律，自制力', example: 'Discipline is the bridge between goals and accomplishment.' },
        { word: 'endeavor', phonetic: '/ɪnˈdevə(r)/', meaning: '努力，尽力', example: 'We wish you success in all your future endeavors.' },
        { word: 'fascinating', phonetic: '/ˈfæsɪneɪtɪŋ/', meaning: '迷人的，极有趣的', example: 'The documentary was absolutely fascinating.' },
        { word: 'genuine', phonetic: '/ˈdʒenjuɪn/', meaning: '真正的，真诚的', example: 'She has a genuine interest in helping others.' },
        { word: 'humble', phonetic: '/ˈhʌmbl/', meaning: '谦虚的', example: 'Despite his success, he remains a humble person.' },
        { word: 'integrity', phonetic: '/ɪnˈteɡrəti/', meaning: '正直，诚信', example: 'A person of integrity always keeps their promises.' },
        { word: 'motivate', phonetic: '/ˈməʊtɪveɪt/', meaning: '激励，激发', example: 'Good teachers know how to motivate their students.' },
        { word: 'navigate', phonetic: '/ˈnævɪɡeɪt/', meaning: '导航，应对', example: 'Learning how to navigate difficult situations is a key life skill.' },
        { word: 'opportunity', phonetic: '/ˌɒpəˈtjuːnəti/', meaning: '机会', example: 'Every challenge is an opportunity in disguise.' },
        { word: 'profound', phonetic: '/prəˈfaʊnd/', meaning: '深奥的，意义深远的', example: 'The book had a profound impact on my thinking.' },
        { word: 'resilience', phonetic: '/rɪˈzɪliəns/', meaning: '韧性，恢复力', example: 'Building resilience helps you bounce back from setbacks.' },
        { word: 'strategy', phonetic: '/ˈstrætədʒi/', meaning: '策略，战略', example: 'A good strategy is essential for success in business.' },
        { word: 'thrive', phonetic: '/θraɪv/', meaning: '茁壮成长，兴旺', example: 'With the right environment, every child can thrive.' },
        { word: 'ultimate', phonetic: '/ˈʌltɪmət/', meaning: '最终的，根本的', example: 'The ultimate goal is to become a better version of yourself.' },
        { word: 'vivid', phonetic: '/ˈvɪvɪd/', meaning: '生动的，鲜明的', example: 'I still have a vivid memory of our first meeting.' },
        { word: 'worthwhile', phonetic: '/ˌwɜːθˈwaɪl/', meaning: '值得的', example: 'Learning English is a worthwhile investment of your time.' },
    ],

    // 口语跟读模板
    SPEAKING_TEMPLATES: [
        {
            title: '自我介绍',
            text: 'Hello, my name is [Name]. I am from [City], China. I work as a [Job] and I enjoy [Hobby] in my free time. I have been learning English for [Number] years and I hope to become fluent one day.',
            tip: '注意语调自然，不要逐词朗读，尝试连读（如 "I am" → "I\'m"）'
        },
        {
            title: '日常对话 - 点餐',
            text: 'A: Good evening! Table for two, please.\nB: Certainly. Would you like to sit inside or on the terrace?\nA: Inside, please. Can I see the menu?\nB: Of course. Here you are. Our special today is grilled salmon.\nA: That sounds great! I\'ll have the salmon, please.',
            tip: '注意语调升降：问句用升调↗，陈述句用降调↘'
        },
        {
            title: '职场沟通 - 会议发言',
            text: 'Thank you for having me today. I\'d like to share some thoughts on our project progress. First, let me highlight what we have achieved so far. Then, I will address the challenges we are facing. Finally, I will propose some solutions for moving forward.',
            tip: '注意停顿（pause）：每句话之间停顿1-2秒，让听众有时间消化'
        },
        {
            title: '旅行对话 - 问路',
            text: 'A: Excuse me, could you tell me how to get to the museum?\nB: Sure! Go straight ahead for two blocks, then turn left at the traffic light. The museum will be on your right.\nA: Thank you so much! Is it within walking distance?\nB: Yes, it\'s about a 10-minute walk from here.',
            tip: '练习连读：could you → "couldja"；got to → "gotta"'
        },
        {
            title: '表达观点',
            text: 'In my opinion, learning a language is not just about memorizing words. It is about understanding a new culture and a new way of thinking. The best way to improve is to practice every day — even if it is just for 15 minutes. Consistency is more important than intensity.',
            tip: '强调关键词（bold words）重读，让表达更有力量'
        },
        {
            title: '面试场景',
            text: 'I believe I am a strong candidate for this position because I have three years of experience in this field. I am a quick learner and I work well under pressure. In my previous role, I successfully led a team of five people to complete a major project ahead of schedule.',
            tip: '自信但不自大，语速适中，重点词放慢'
        },
        {
            title: '电话沟通',
            text: 'A: Hello, this is [Name] speaking. May I speak to Mr. Johnson, please?\nB: I\'m afraid he\'s in a meeting right now. Can I take a message?\nA: Yes, please. Could you ask him to call me back at 555-0123?\nB: Of course. I\'ll make sure he gets the message.',
            tip: '电话用语比面对面更正式，发音要格外清晰'
        },
        {
            title: '每日小故事',
            text: 'Yesterday, I decided to take a different route to work. I walked through a small park that I had never noticed before. There were beautiful flowers everywhere and people were jogging and walking their dogs. It made me realize that sometimes, changing your routine can lead to wonderful discoveries.',
            tip: '讲故事时注意节奏变化，描述部分放慢，转折处稍微加速'
        }
    ],

    // 日常对话模板（生活中常用的简单英语对话）
    DAILY_CONVERSATIONS: [
        {
            title: '问候与自我介绍',
            en: "Hi! My name is Xiao Ming. Nice to meet you!\nI'm from Beijing. I work in an office.\nWhat about you? Where are you from?",
            zh: '嗨！我叫小明。很高兴认识你！\n我来自北京，在一家公司工作。\n你呢？你来自哪里？',
            tip: '注意：Nice to meet you 是初次见面的标准用语'
        },
        {
            title: '点餐',
            en: "A: Hi! A table for two, please.\nB: Sure. Here's the menu.\nA: I'd like a cup of coffee and a sandwich, please.\nB: Anything else?\nA: That's all. Thank you!",
            zh: 'A: 嗨！请给我一张双人桌。\nB: 好的，这是菜单。\nA: 我想要一杯咖啡和一个三明治。\nB: 还要别的吗？\nA: 就这些，谢谢！',
            tip: "I'd like = 我想要（比 I want 更礼貌）"
        },
        {
            title: '问路',
            en: 'Excuse me, how can I get to the subway station?\nGo straight, then turn left at the second crossing.\nIs it far?\nNo, it is about a 5-minute walk. You can not miss it.',
            zh: '请问，地铁站在怎么走？\n直走，然后在第二个路口左转。\n远吗？\n不远，步行大约5分钟。你肯定能找到。',
            tip: 'You can not miss it = 你肯定能找到（很常用！）'
        },
        {
            title: '购物',
            en: "How much is this shirt?\nIt's 99 yuan. But it's on sale today — 20% off!\nGreat! Can I try it on?\nOf course! The fitting room is over there.",
            zh: '这件衬衫多少钱？\n99元。但今天打折——八折！\n太好了！我能试穿一下吗？\n当然可以！试衣间在那边。',
            tip: 'on sale = 打折；try it on = 试穿'
        },
        {
            title: '看医生',
            en: 'Doctor, I have a headache and I feel tired.\nHow long have you felt this way?\nSince yesterday.\nOK, let me check... You have a cold. Take this medicine three times a day.',
            zh: '医生，我头疼而且感觉很累。\n这种感觉持续多久了？\n从昨天开始。\n好的，让我检查一下……你感冒了。这个药一天吃三次。',
            tip: 'headache = 头疼；three times a day = 一天三次'
        },
        {
            title: '打电话',
            en: "Hello, this is May speaking. Is Tom there?\nThis is Tom. Hi May! What's up?\nDo you want to see a movie tonight?\nSure! What time? Let's meet at 7.",
            zh: '喂，我是May。Tom在吗？\n我是Tom。嗨May！有什么事？\n今晚想去看电影吗？\n好啊！几点？我们7点见吧。',
            tip: 'this is ... speaking = 我是……（电话用语）'
        },
        {
            title: '谈论天气',
            en: "Beautiful weather today, isn't it?\nYes, it's sunny and warm. Perfect for a walk!\nI heard it will rain tomorrow.\nReally? I should bring my umbrella then.",
            zh: '今天天气真好，不是吗？\n是的，阳光明媚又温暖。perfect 散步！\n我听说明天会下雨。\n真的吗？那我得带伞了。',
            tip: '...is not it? = 反意疑问句，用于确认对方同意'
        },
        {
            title: '表达感谢与道歉',
            en: 'Thank you so much for your help!\nYou are welcome. Anytime!\nSorry I am late. The traffic was bad.\nNo problem. I just got here too.',
            zh: '非常感谢你的帮助！\n不客气，随时乐意效劳！\n抱歉我迟到了，路上堵车。\n没关系，我也刚到。',
            tip: 'You are welcome = 不客气；Anytime = 随时乐意'
        }
    ],

    getRecords() {
        return Storage.get(this.STORAGE_KEY, []);
    },

    saveRecords(records) {
        Storage.set(this.STORAGE_KEY, records);
    },

    getTodayRecord() {
        const today = Storage.formatDate();
        return this.getRecords().find(r => r.date === today);
    },

    /**
     * 根据日期获取当天单词
     */
    getDailyWords() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const count = 5 + (dayOfYear % 4); // 5-8个

        const startIndex = (dayOfYear * count) % this.WORD_BANK.length;
        const words = [];
        for (let i = 0; i < count; i++) {
            words.push(this.WORD_BANK[(startIndex + i) % this.WORD_BANK.length]);
        }
        return words;
    },

    /**
     * 获取当天的口语模板
     */
    getDailySpeakingTemplate() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        return this.SPEAKING_TEMPLATES[dayOfYear % this.SPEAKING_TEMPLATES.length];
    },

    /**
     * 获取当天的日常对话
     */
    getDailyConversation() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        return this.DAILY_CONVERSATIONS[dayOfYear % this.DAILY_CONVERSATIONS.length];
    },

    /**
     * 显示今日日常对话（弹窗）
     */
    showDailyConversation() {
        const conv = this.getDailyConversation();
        const html = `
            <div style="padding: 8px 0;">
                <div style="font-weight:700; font-size:16px; margin-bottom:12px; color:var(--primary);">💬 ${conv.title}</div>
                <div style="background:#E8F5E9; border-radius:10px; padding:14px; margin-bottom:12px;">
                    <div style="font-size:11px; color:var(--text-light); margin-bottom:6px; font-weight:600;">🔤 English</div>
                    <div style="font-size:14px; line-height:1.9; color:var(--text); white-space:pre-line;">${this.escapeHtml(conv.en)}</div>
                    <button class="btn btn-sm" style="margin-top:8px; background:#E3F2FD; color:var(--info);" onclick="EnglishModule.speak('${this.escapeJs(conv.en)}')">🔊 听朗读</button>
                </div>
                <div style="background:#FFF3E0; border-radius:10px; padding:14px; margin-bottom:12px;">
                    <div style="font-size:11px; color:var(--text-light); margin-bottom:6px; font-weight:600;">📖 中文释义</div>
                    <div style="font-size:14px; line-height:1.9; color:var(--text-secondary); white-space:pre-line;">${this.escapeHtml(conv.zh)}</div>
                </div>
                <div style="background:var(--primary-bg); border-radius:10px; padding:12px;">
                    <div style="font-size:12px; color:var(--primary);">
                        💡 <b>小贴士：</b>${conv.tip}
                    </div>
                </div>
            </div>
        `;
        App.openModal('💬 ' + conv.title, html);
    },

    /**
     * 渲染日常对话区（页面内嵌卡片）
     */
    renderDailyConversation() {
        const conv = this.getDailyConversation();
        return `
            <h3 style="margin: 20px 0 10px; font-size: 15px; color: var(--text-secondary);">💬 今日日常对话</h3>
            <div class="card" style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: 700; font-size: 15px;">${conv.title}</span>
                    <button class="btn btn-sm" style="background: #E3F2FD; color: var(--info);" onclick="EnglishModule.speak('${this.escapeJs(conv.en)}')">🔊 听朗读</button>
                </div>
                <div style="background: #E8F5E9; border-radius: 8px; padding: 12px; margin-bottom: 10px; font-size: 13px; line-height: 1.8; white-space: pre-line; color: var(--text);">
                    ${this.escapeHtml(conv.en)}
                </div>
                <div style="background: #FFF3E0; border-radius: 8px; padding: 12px; margin-bottom: 10px; font-size: 13px; line-height: 1.8; white-space: pre-line; color: var(--text-secondary);">
                    ${this.escapeHtml(conv.zh)}
                </div>
                <div style="font-size: 12px; color: var(--primary); background: var(--primary-bg); padding: 6px 10px; border-radius: 6px;">
                    💡 ${conv.tip}
                </div>
            </div>
        `;
    },


    render(container) {
        const records = this.getRecords();
        const today = Storage.formatDate();
        const todayRecord = records.find(r => r.date === today);

        const streak = this.calculateStreak(records);
        const totalWords = records.reduce((s, r) => s + (parseInt(r.words) || 0), 0);
        const totalDuration = records.reduce((s, r) => s + (parseInt(r.speakingDuration) || 0), 0);

        const now = new Date();
        const weekStart = new Date(now);
        const day = now.getDay() || 7;
        weekStart.setDate(now.getDate() - day + 1);
        const weekCount = records.filter(r => new Date(r.date) >= weekStart).length;

        let html = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">🌍 英语学习</h2>
                    <p class="page-subtitle">每天进步一点点</p>
                </div>
            </div>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-value" style="color: var(--success);">${streak}</div>
                    <div class="stat-label">连续打卡（天）</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalWords}</div>
                    <div class="stat-label">累计单词</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalDuration}</div>
                    <div class="stat-label">学习时长（分）</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${weekCount}</div>
                    <div class="stat-label">本周打卡</div>
                </div>
            </div>
        `;

        // === 每日单词学习 ===
        html += this.renderWordSection(todayRecord);

        // === 今日打卡区 ===
        const gameBest = todayRecord && todayRecord.gameBest || 0;
        const translationBest = todayRecord && todayRecord.translationBest || 0;
        html += `
            <h3 style="margin: 20px 0 10px; font-size: 15px; color: var(--text-secondary);">今日打卡</h3>
            <div class="card-grid card-grid-3" style="margin-bottom:8px;">
                <div class="card" style="text-align:center; cursor:pointer; position:relative; ${App.cardBorderStyle((todayRecord && todayRecord.words) > 0)}" onclick="EnglishModule.addWords()">
                    <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g2_cat_maid_gold')}</div>
                    <div style="font-size:32px; margin-bottom:8px;">📖</div>
                    <div style="font-weight:600;">单词打卡</div>
                    <div style="font-size:12px; color:var(--text-light); margin-top:4px;">
                        今日：${todayRecord && todayRecord.words || 0} 个
                    </div>
                </div>
                <div class="card" style="text-align:center; cursor:pointer; position:relative; ${App.cardBorderStyle((todayRecord && todayRecord.speakingDuration) > 0)}" onclick="EnglishModule.addSpeaking()">
                    <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g4_rabbit_red_bow')}</div>
                    <div style="font-size:32px; margin-bottom:8px;">🎤</div>
                    <div style="font-weight:600;">口语跟读</div>
                    <div style="font-size:12px; color:var(--text-light); margin-top:4px;">
                        今日：${todayRecord && todayRecord.speakingDuration || 0} 分钟
                    </div>
                </div>
                <div class="card" style="text-align:center; cursor:pointer; position:relative;" onclick="EnglishModule.showDailyConversation()">
                    <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g1_cat_rabbit_love')}</div>
                    <div style="font-size:32px; margin-bottom:8px;">💬</div>
                    <div style="font-weight:600;">日常对话</div>
                    <div style="font-size:12px; color:var(--text-light); margin-top:4px;">
                        生活中常用的英语对话
                    </div>
                </div>
            </div>
            <div class="card-grid card-grid-2">
                <div class="card" style="text-align:center; cursor:pointer; position:relative; ${App.cardBorderStyle(gameBest > 0)}" onclick="EnglishModule.startGame()">
                    <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g3_duck')}</div>
                    <div style="font-size:32px; margin-bottom:8px;">🎮</div>
                    <div style="font-weight:600;">单词游戏</div>
                    <div style="font-size:12px; color:var(--text-light); margin-top:4px;">
                        ${gameBest > 0 ? `今日最佳：${gameBest}/10` : '抓大鹅·贪吃蛇拼词'}
                    </div>
                </div>
                <div class="card" style="text-align:center; cursor:pointer; position:relative; ${App.cardBorderStyle(translationBest > 0)}" onclick="EnglishModule.startTranslation()">
                    <div style="position:absolute; top:-6px; left:-4px; opacity:1; transform:rotate(10deg); z-index:2;">${App.renderSticker('g1_rabbit_cat_wink')}</div>
                    <div style="font-size:32px; margin-bottom:8px;">🔄</div>
                    <div style="font-weight:600;">中英互译</div>
                    <div style="font-size:12px; color:var(--text-light); margin-top:4px;">
                        ${translationBest > 0 ? `今日最佳：${translationBest}/10` : '中↔英翻译，检验掌握'}
                    </div>
                </div>
            </div>
        `;

        // === 口语跟读模板 ===
        html += this.renderSpeakingTemplate();

        // === 今日日常对话 ===
        html += this.renderDailyConversation();

        html += '<h3 style="margin: 20px 0 10px; font-size: 15px; color: var(--text-secondary);">历史记录</h3>';

        if (records.length === 0) {
            html += '<div class="empty-state"><div class="empty-state-icon">🌍</div><div class="empty-state-text">还没有学习记录<br>开始今天的英语学习吧</div></div>';
        } else {
            const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
            const groups = {};
            sorted.forEach(r => {
                if (!groups[r.date]) groups[r.date] = [];
                groups[r.date].push(r);
            });

            for (const [date, items] of Object.entries(groups)) {
                const d = new Date(date);
                const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
                html += `<div style="margin-bottom: 12px;">
                    <div style="font-size: 12px; color: var(--text-light); margin-bottom: 6px;">
                        ${d.getMonth() + 1}月${d.getDate()}日 周${weekDays[d.getDay()]} ${date === today ? '· 今天' : ''}
                    </div>`;

                items.forEach(r => {
                    const tags = [];
                    if (r.words > 0) tags.push(`<span class="tag tag-info">📖 ${r.words}词</span>`);
                    if (r.speakingDuration > 0) tags.push(`<span class="tag tag-info">🎤 ${r.speakingDuration}分</span>`);
                    
                    
                    if (r.spellingBest > 0) tags.push(`<span class="tag tag-info">🔤 拼写${r.spellingBest}/10</span>`);
                    if (r.translationBest > 0) tags.push(`<span class="tag tag-info">🔄 互译${r.translationBest}/10</span>`);
                    if (r.gameBest > 0) tags.push(`<span class="tag tag-info">🎮 游戏${r.gameBest}/10</span>`);

                    html += `
                        <div class="list-item">
                            <span style="font-size:24px;">🌍</span>
                            <div style="flex:1;">
                                <div style="display:flex; gap:4px; flex-wrap:wrap;">${tags.join('')}</div>
                                ${r.speakingContent ? `<div style="font-size:13px; color:var(--text-light); margin-top:4px;">跟读：${this.escapeHtml(r.speakingContent)}</div>` : ''}
                            </div>
                            <div class="action-buttons">
                                <button class="action-btn danger" onclick="EnglishModule.delete('${r.id}')">删除</button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
        }

        container.innerHTML = html;
    },

    /**
     * 每日单词区
     */
    renderWordSection(todayRecord) {
        const words = this.getDailyWords();
        const todayRecordWords = todayRecord && todayRecord.words || 0;
        const ttsLabel = '🔊 朗读全部';

        let html = `
            <h3 style="margin: 16px 0 10px; font-size: 15px; color: var(--text-secondary);">
                📖 今日单词（${words.length}个）
                ${todayRecordWords > 0 ? `<span class="tag tag-info" style="margin-left:8px;">已打卡 ${todayRecordWords}词</span>` : ''}
                <button class="btn btn-sm" style="margin-left:8px; background:var(--primary-bg); color:var(--primary); font-size:12px;" onclick="EnglishModule.speakAllWords()">${ttsLabel}</button>
            </h3>
            <div style="font-size:11px; color:var(--text-light); margin-bottom:8px; padding:4px 10px; background:#FFF8E1; border-radius:6px;">💡 朗读功能需要联网（服务端实时合成语音）</div>
        `;

        words.forEach((w, i) => {
            const wordIdx = `word_${i}`;
            html += `
                <div class="card" style="margin-bottom: 8px; position: relative;">
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <div style="background: var(--primary-bg); color: var(--primary); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0;">
                            ${i + 1}
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <span style="font-size: 18px; font-weight: 700; color: var(--text);">${w.word}</span>
                                <span style="font-size: 13px; color: var(--text-light);">${w.phonetic}</span>
                                <button class="btn btn-sm" style="background:#E3F2FD; color:var(--info); font-size:11px; padding:3px 8px; border-radius:12px;" onclick="EnglishModule.speak('${this.escapeHtml(w.word)}')" title="朗读单词">🔊</button>
                            </div>
                            <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
                                <span style="color: var(--primary); font-weight: 600;">释义：</span>${w.meaning}
                            </div>
                            <div style="font-size: 12px; color: var(--text-light); margin-top: 4px; font-style: italic; padding: 6px 10px; background: var(--bg); border-radius: 6px; border-left: 3px solid var(--primary-light); position: relative;">
                                ${w.example}
                                <button style="position:absolute; right:6px; top:50%; transform:translateY(-50%); background:var(--primary-bg); color:var(--primary); border:none; border-radius:10px; padding:2px 6px; font-size:11px; cursor:pointer;" onclick="EnglishModule.speak('${this.escapeJs(w.example)}')" title="朗读例句">🔊</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        return html;
    },

    /**
     * 口语跟读模板区
     */
    renderSpeakingTemplate() {
        const template = this.getDailySpeakingTemplate();

        let html = `
            <h3 style="margin: 20px 0 10px; font-size: 15px; color: var(--text-secondary);">🎤 今日口语模板</h3>
            <div class="card" style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: 700; font-size: 15px;">${template.title}</span>
                    <div style="display:flex; gap:6px;">
                        <button class="btn btn-sm" style="background: #E3F2FD; color: var(--info);" onclick="EnglishModule.speak('${this.escapeJs(template.text)}')">🔊 听示范</button>
                        <button class="btn btn-sm" style="background: var(--primary-bg); color: var(--primary);" onclick="EnglishModule.addSpeaking()">🎤 去跟读</button>
                    </div>
                </div>
                <div style="background: var(--bg); padding: 14px; border-radius: 8px; font-size: 13px; line-height: 1.8; white-space: pre-line; color: var(--text);">
                    ${this.escapeHtml(template.text)}
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: var(--primary); background: var(--primary-bg); padding: 6px 10px; border-radius: 6px;">
                    💡 ${template.tip}
                </div>
            </div>
        `;

        return html;
    },

    addWords() {
        const todayRecord = this.getTodayRecord();
        const dailyWords = this.getDailyWords();

        const html = `
            <form onsubmit="EnglishModule.saveWords(event)">
                <div style="margin-bottom: 12px; font-size: 13px; color: var(--text-secondary);">
                    今日推荐学习 ${dailyWords.length} 个单词，请记录你背诵的数量
                </div>
                <div class="form-group">
                    <label class="form-label">今日背单词数量</label>
                    <input type="number" class="form-input" id="wordCount" required placeholder="如 ${dailyWords.length}" min="1" value="${todayRecord && todayRecord.words || dailyWords.length}">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">记录</button>
            </form>
        `;
        App.openModal('📖 单词打卡', html);
    },

    saveWords(event) {
        event.preventDefault();
        const words = parseInt(document.getElementById('wordCount').value) || 0;
        const records = this.getRecords();
        const today = Storage.formatDate();
        const existing = records.find(r => r.date === today);

        if (existing) {
            existing.words = words;
        } else {
            records.push({
                id: Storage.generateId(),
                date: today,
                words: words,
                speakingDuration: 0,
                speakingContent: '',
                reading: false,
                listening: false,
                createdAt: Date.now()
            });
        }

        this.saveRecords(records);
        App.closeModal();
        App.showToast('单词打卡成功！', 'success');
        App.loadModule('english');
    },

    addSpeaking() {
        const todayRecord = this.getTodayRecord();
        const template = this.getDailySpeakingTemplate();

        const html = `
            <form onsubmit="EnglishModule.saveSpeaking(event)">
                <div class="form-group">
                    <label class="form-label">练习时长（分钟）</label>
                    <input type="number" class="form-input" id="speakingDuration" required placeholder="如 15" min="1" value="${todayRecord && todayRecord.speakingDuration || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">跟读内容</label>
                    <textarea class="form-textarea" id="speakingContent" placeholder="记录跟读的内容..." style="min-height:100px;">${this.escapeHtml(todayRecord && todayRecord.speakingContent || '')}</textarea>
                </div>
                <details style="margin-bottom: 12px;">
                    <summary style="font-size: 13px; font-weight: 600; color: var(--primary); cursor: pointer;">💡 今日推荐模板：${template.title}</summary>
                    <div style="background: var(--bg); padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.8; white-space: pre-line; margin-top: 8px; color: var(--text);">
                        ${this.escapeHtml(template.text)}
                    </div>
                    <div style="font-size: 12px; color: var(--primary); background: var(--primary-bg); padding: 6px 10px; border-radius: 6px; margin-top: 8px;">
                        💡 ${template.tip}
                    </div>
                </details>
                <button type="submit" class="btn btn-primary" style="width:100%;">记录</button>
            </form>
        `;
        App.openModal('🎤 口语跟读', html);
    },

    saveSpeaking(event) {
        event.preventDefault();
        const duration = parseInt(document.getElementById('speakingDuration').value) || 0;
        const content = document.getElementById('speakingContent').value;
        const records = this.getRecords();
        const today = Storage.formatDate();
        const existing = records.find(r => r.date === today);

        if (existing) {
            existing.speakingDuration = duration;
            existing.speakingContent = content;
        } else {
            records.push({
                id: Storage.generateId(),
                date: today,
                words: 0,
                speakingDuration: duration,
                speakingContent: content,
                reading: false,
                listening: false,
                createdAt: Date.now()
            });
        }

        this.saveRecords(records);
        App.closeModal();
        App.showToast('口语跟读记录成功！', 'success');
        App.loadModule('english');
    },

    toggleTask(type) {
        const records = this.getRecords();
        const today = Storage.formatDate();
        let existing = records.find(r => r.date === today);

        if (existing) {
            existing[type] = !existing[type];
        } else {
            const newRecord = {
                id: Storage.generateId(),
                date: today,
                words: 0,
                speakingDuration: 0,
                speakingContent: '',
                reading: false,
                listening: false,
                createdAt: Date.now()
            };
            newRecord[type] = true;
            records.push(newRecord);
        }

        this.saveRecords(records);
        const names = { reading: '阅读', listening: '听力' };
        App.showToast(`${names[type]}任务已更新`, 'success');
        App.loadModule('english');
    },

    delete(id) {
        if (!confirm('确定删除这条记录吗？')) return;
        let records = this.getRecords();
        records = records.filter(r => r.id !== id);
        this.saveRecords(records);
        App.showToast('已删除', 'success');
        App.loadModule('english');
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

    /**
     * 语音朗读（完全离线优先）
     * 朗读策略：
     * 1. 如果文本是单个单词且本地有离线音频 → 直接播放本地音频（无需联网）
     * 2. 否则尝试浏览器原生 Web Speech API（Chrome/Edge 等）
     * 3. 再不行走 TTS 代理（需联网）
     * @param {string} text - 要朗读的文本
     */
    speak(text) {
        if (!text) return;

        const trimmed = (text || '').trim();

        // 单个单词优先用本地离线音频（完全离线，vivo 等也能朗读）
        if (typeof WORD_AUDIO_MAP !== 'undefined' && WORD_AUDIO_MAP[trimmed.toLowerCase()]) {
            this._playLocalAudio(WORD_AUDIO_MAP[trimmed.toLowerCase()], trimmed);
            return;
        }

        // 不支持 Web Speech API 直接走 TTS 代理
        if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
            this._speakWithOnlineTTS(text);
            return;
        }

        // 尝试 Web Speech API，带超时保护（防 vivo 浏览器不发声假死）
        let usedFallback = false;
        let timer = null;
        const fallback = () => {
            if (usedFallback) return;
            usedFallback = true;
            if (timer) { clearTimeout(timer); timer = null; }
            try { window.speechSynthesis.cancel(); } catch (e) {}
            this._speakWithOnlineTTS(text);
        };

        timer = setTimeout(fallback, 3000); // 3 秒超时

        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => {
                if (timer) { clearTimeout(timer); timer = null; }
            };
            utterance.onend = () => {
                if (timer) { clearTimeout(timer); timer = null; }
            };
            utterance.onerror = () => {
                fallback();
            };

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            fallback();
        }
    },

    /**
     * 播放本地离线音频（base64 data URI）
     */
    _playLocalAudio(base64Data, word) {
        this.stopTTS();
        // 关键：vivo 等浏览器需先在用户交互中播放一次音频解锁播放上下文
        this._unlockAudio();
        try {
            const audio = new Audio('data:audio/mp3;base64,' + base64Data);
            this._ttsAudio = audio;
            audio.onended = () => { this._ttsAudio = null; };
            audio.onerror = () => {
                this._ttsAudio = null;
                // 本地音频播放失败，尝试 Web Speech / TTS 代理
                this._speakWithOnlineTTS(word);
            };
            const p = audio.play();
            if (p && p.catch) {
                p.catch(() => {
                    this._speakWithOnlineTTS(word);
                });
            }
        } catch (e) {
            this._speakWithOnlineTTS(word);
        }
    },

    /**
     * 语音支持状态（仅用于 UI 提示）
     * null=未知, true=原生支持, false=需用 TTS 代理
     */
    _speechSupported: null,

    checkSpeechSupport() {
        if (this._speechSupported !== null) return this._speechSupported;
        if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
            this._speechSupported = false;
            return false;
        }
        // 存在对象但不保证能发声，标记为 true（实际由超时降级处理）
        this._speechSupported = true;
        return true;
    },

    /**
     * 使用 Web Speech API 朗读（保留备用，主要由 speak() 智能调度）
     */
    _speakWithWebSpeech(text) {
        this._speakWithOnlineTTS(text);
    },

    /**
     * 使用在线 TTS 朗读（Google TTS 免费接口）
     * 适用于不支持 Web Speech API 的浏览器（如 vivo 自带浏览器）
     * 使用 fetch 获取音频 blob → object URL 播放（绕过 CORS 跨域音频限制）
     */
    _speakWithOnlineTTS(text) {
        // 停止当前播放
        this.stopTTS();
        // 解锁音频上下文（vivo 等浏览器的自动播放限制）
        this._unlockAudio();

        // Google TTS：将文本分段，每段最多 180 字符
        const chunks = [];
        const sentences = text.split(/(?<=[.!?])\s+/);
        let currentChunk = '';

        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            if ((currentChunk + ' ' + sentence).length > 180 && currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = sentence;
            } else {
                currentChunk += (currentChunk ? ' ' : '') + sentence;
            }
        }
        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }

        // 如果分句后片段过长，按长度分割
        const finalChunks = [];
        for (let i = 0; i < chunks.length; i++) {
            const c = chunks[i];
            if (c.length <= 180) {
                finalChunks.push(c);
            } else {
                for (let j = 0; j < c.length; j += 180) {
                    finalChunks.push(c.substring(j, j + 180));
                }
            }
        }

        let currentIdx = 0;
        let playedAny = false;

        const playNext = () => {
            if (currentIdx >= finalChunks.length) {
                this._ttsAudio = null;
                if (!playedAny) {
                    App.showToast('网络朗读失败，请检查网络或使用 Chrome 浏览器', 'error');
                }
                return;
            }

            const chunk = finalChunks[currentIdx];
            const url = '/tts?text=' + encodeURIComponent(chunk);

            // 方式1：通过 fetch 获取 blob 后播放（绕过 CORS）
            this._fetchAndPlay(url, chunk, () => {
                playedAny = true;
                currentIdx++;
                playNext();
            }, (err) => {
                console.warn('TTS fetch failed:', err);
                if (currentIdx < finalChunks.length - 1) {
                    currentIdx++;
                    playNext();
                } else {
                    App.showToast('网络朗读失败，请检查网络或使用 Chrome 浏览器', 'error');
                }
            });
        };

        playNext();
    },

    /**
     * fetch 获取音频 blob 后用 object URL 播放
     */
    _fetchAndPlay(url, chunk, onSuccess, onError) {
        if (typeof fetch === 'undefined') {
            // 不支持 fetch，降级到直接 Audio
            this._playDirect(url, onSuccess, onError);
            return;
        }

        fetch(url, { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                return response.blob();
            })
            .then(blob => {
                const objUrl = URL.createObjectURL(blob);
                const audio = new Audio(objUrl);
                this._ttsAudio = audio;

                let done = false;
                const finish = () => {
                    if (done) return;
                    done = true;
                    URL.revokeObjectURL(objUrl);
                    this._ttsAudio = null;
                    if (onSuccess) onSuccess();
                };

                audio.onended = finish;
                audio.onerror = () => {
                    URL.revokeObjectURL(objUrl);
                    if (onError) onError(new Error('playback error'));
                };

                const p = audio.play();
                if (p && p.catch) {
                    p.catch(err => {
                        URL.revokeObjectURL(objUrl);
                        if (onError) onError(err);
                    });
                }
            })
            .catch(err => {
                // fetch 失败（CORS/网络），降级到直接 Audio
                this._playDirect(url, onSuccess, onError);
            });
    },

    /**
     * 降级：直接 new Audio(url).play()（某些浏览器支持）
     */
    _playDirect(url, onSuccess, onError) {
        try {
            const audio = new Audio(url);
            this._ttsAudio = audio;
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                this._ttsAudio = null;
                if (onSuccess) onSuccess();
            };
            audio.onended = finish;
            audio.onerror = () => {
                if (onError) onError(new Error('direct play error'));
            };
            const p = audio.play();
            if (p && p.catch) {
                p.catch(err => {
                    if (onError) onError(err);
                });
            }
        } catch (e) {
            if (onError) onError(e);
        }
    },

    /**
     * 解锁音频播放上下文
     * 部分移动浏览器（如 vivo）要求必须在用户交互事件中至少播放一次音频，
     * 之后异步生成的音频才能正常 play()。这里同步播放一段极短静音来"解锁"。
     */
    _unlockAudio() {
        // 方式一：播放一段极短静音 WAV 解锁音频上下文
        try {
            const silentWav = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
            const a = new Audio(silentWav);
            a.volume = 0;
            const p = a.play();
            if (p && p.catch) p.catch(() => {});
        } catch (e) { /* ignore */ }

        // 方式二：通过 Web Audio API resume 解锁（部分浏览器需要）
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (AC) {
                const ctx = new AC();
                if (ctx.state === 'suspended') {
                    ctx.resume().then(() => { try { ctx.close(); } catch (e) {} }).catch(() => {});
                } else {
                    try { ctx.close(); } catch (e) {}
                }
            }
        } catch (e) { /* ignore */ }
    },

    /**
     * 停止 TTS 播放
     */
    stopTTS() {
        if (this._ttsAudio) {
            this._ttsAudio.pause();
            this._ttsAudio = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    },

    /**
     * 朗读全部单词
     */
    speakAllWords() {
        const words = this.getDailyWords();
        const text = words.map(w => `${w.word}. ${w.example}`).join(' ... ');
        this.speak(text);
    },

    /**
     * 转义JS字符串中的特殊字符
     */
    escapeJs(text) {
        return (text || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    },

    /**
     * 单词游戏入口 — 选择小游戏
     */
    startGame() {
        const html = `
            <div style="text-align:center; padding: 8px 0;">
                <p style="font-size:13px; color:var(--text-secondary); margin-bottom:20px;">选择一个单词小游戏，边玩边记单词！</p>
                <div style="display:flex; flex-direction:column; gap:14px;">
                    <button class="btn btn-primary" style="font-size:17px; padding:18px; border-radius:14px;" onclick="EnglishModule.startCatchGoose()">🐤 抓大鹅（看释义抓词）</button>
                    <button class="btn" style="font-size:17px; padding:18px; border-radius:14px; background:var(--success); color:#fff;" onclick="EnglishModule.startSnake()">🐍 贪吃蛇（拼单词）</button>
                </div>
                <button class="btn" style="margin-top:18px; background:var(--bg);" onclick="App.closeModal();">返回</button>
            </div>
        `;
        App.openModal('🎮 单词游戏', html);
    },

    /**
     * 抓大鹅 — 看释义抓词
     */
    startCatchGoose() {
        const daily = this.getDailyWords();
        const pool = daily.slice();
        const questions = [];
        const limit = Math.min(10, pool.length);
        for (let i = 0; i < limit; i++) {
            const idx = Math.floor(Math.random() * pool.length);
            questions.push(pool.splice(idx, 1)[0]);
        }
        let currentIdx = 0;
        let correctCount = 0;
        const total = questions.length;

        const renderQuestion = () => {
            const q = questions[currentIdx];
            const options = [q.word];
            const distractors = this.WORD_BANK.filter(function (w) { return w.word !== q.word; });
            const optCount = 4 + Math.floor(Math.random() * 3); // 4-6 个选项
            while (options.length < optCount && distractors.length > 0) {
                const di = Math.floor(Math.random() * distractors.length);
                const dw = distractors.splice(di, 1)[0].word;
                if (options.indexOf(dw) === -1) options.push(dw);
            }
            options.sort(function () { return Math.random() - 0.5; });

            const optHtml = options.map(function (w) {
                const speakAttr = "event.stopPropagation(); EnglishModule.speak('" + EnglishModule.escapeJs(w) + "')";
                return '<div class="game-word-card" data-word="' + EnglishModule.escapeHtml(w) + '" ' +
                    'onclick="EnglishModule._catchGoosePick(\'' + EnglishModule.escapeJs(w) + '\')" ' +
                    'style="padding:14px 10px; border:2px solid var(--border); border-radius:12px; text-align:center; font-size:18px; font-weight:700; cursor:pointer; background:#fff; user-select:none; position:relative;">' +
                    EnglishModule.escapeHtml(w) +
                    '<button class="btn btn-sm" style="position:absolute; top:4px; right:4px; background:#E3F2FD; color:var(--info); font-size:11px; padding:2px 6px; border-radius:10px;" onclick="' + speakAttr + '" title="朗读">🔊</button>' +
                    '</div>';
            }).join('');

            const modalBody = document.getElementById('gameContainer');
            if (!modalBody) return;
            modalBody.innerHTML = `
                <div style="padding: 8px 0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size:12px; color:var(--text-light);">第 ${currentIdx + 1} / ${total} 题</span>
                        <span style="font-size:12px; color:var(--primary); font-weight:700;">得分：${correctCount}</span>
                    </div>
                    <div style="text-align:center; background:var(--primary-bg); border-radius:12px; padding:18px; margin-bottom:16px;">
                        <div style="font-size:12px; color:var(--text-light); margin-bottom:6px;">中文释义</div>
                        <div style="font-size:20px; font-weight:700; color:var(--text);">${this.escapeHtml(q.meaning)}</div>
                    </div>
                    <div id="catchGooseGrid" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        ${optHtml}
                    </div>
                </div>
            `;
            this._catchState = { q: q, currentIdx: currentIdx, correctCount: correctCount, total: total, questions: questions };
        };

        const showResult = () => {
            const todayRecord = this.getTodayRecord();
            const prevBest = (todayRecord && todayRecord.gameBest) || 0;
            const newBest = Math.max(prevBest, correctCount);

            const records = this.getRecords();
            const today = Storage.formatDate();
            let existing = records.find(function (r) { return r.date === today; });
            if (existing) {
                existing.gameBest = newBest;
                existing.gameCount = (existing.gameCount || 0) + 1;
            } else {
                records.push({
                    id: Storage.generateId(),
                    date: today,
                    words: 0,
                    speakingDuration: 0,
                    speakingContent: '',
                    reading: false,
                    listening: false,
                    spellingBest: 0,
                    spellingCount: 0,
                    translationBest: 0,
                    translationCount: 0,
                    gameBest: newBest,
                    gameCount: 1,
                    createdAt: Date.now()
                });
            }
            this.saveRecords(records);

            const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
            let emoji = '🌟';
            let comment = '太棒了，满分过关！';
            if (pct < 100 && pct >= 80) { emoji = '👍'; comment = '很不错，继续加油！'; }
            else if (pct < 80 && pct >= 60) { emoji = '💪'; comment = '还需努力，再练一次吧！'; }
            else { emoji = '📖'; comment = '多背背单词，下次一定更好！'; }

            const modalBody = document.getElementById('gameContainer');
            if (!modalBody) return;
            modalBody.innerHTML = `
                <div style="text-align:center; padding: 20px 0;">
                    <div style="font-size: 64px; margin-bottom: 12px;">${emoji}</div>
                    <div style="font-size: 28px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">
                        ${correctCount} / ${total}
                    </div>
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px;">
                        正确率 ${pct}%
                    </div>
                    <div style="font-size: 13px; color: var(--text-light); margin-bottom: 8px;">
                        ${comment}
                    </div>
                    ${newBest > prevBest ? `<div style="font-size: 12px; color: var(--success); margin-bottom: 16px;">🎉 刷新今日最佳：${prevBest} → ${newBest}</div>` : ''}
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="btn btn-primary" onclick="EnglishModule.startCatchGoose()">再来一次</button>
                        <button class="btn" style="background: var(--bg);" onclick="App.closeModal(); App.loadModule('english');">完成</button>
                    </div>
                </div>
            `;
        };

        this._catchGoosePick = (word) => {
            const st = this._catchState;
            if (!st) return;
            const q = st.q;
            const grid = document.getElementById('catchGooseGrid');
            if (!grid) return;
            const cards = grid.querySelectorAll('.game-word-card');
            const isCorrect = (word === q.word);
            if (isCorrect) {
                correctCount++;
            }
            cards.forEach(function (c) {
                const cw = c.getAttribute('data-word');
                if (cw === q.word) {
                    c.style.borderColor = 'var(--success)';
                    c.style.background = '#E8F5E9';
                } else if (cw === word && !isCorrect) {
                    c.style.borderColor = 'var(--danger)';
                    c.style.background = '#FFEBEE';
                    c.style.color = 'var(--danger)';
                }
                c.onclick = null;
                c.style.cursor = 'default';
            });
            currentIdx++;
            setTimeout(function () {
                if (currentIdx < total) {
                    renderQuestion();
                } else {
                    showResult();
                }
            }, isCorrect ? 600 : 1100);
        };

        App.openModal('🐤 抓大鹅', '<div id="gameContainer"></div>');
        renderQuestion();
    },

    /**
     * 贪吃蛇 — 拼单词
     */
    startSnake() {
        const daily = this.getDailyWords();
        if (!daily || daily.length === 0) {
            App.showToast('暂无单词，无法开始', 'error');
            return;
        }
        this._snake = {
            grid: 14,
            cell: 20,
            snake: [{ x: 7, y: 7 }],
            dir: { x: 1, y: 0 },
            nextDir: { x: 1, y: 0 },
            food: null,
            daily: daily,
            wordIndex: 0,
            letterIndex: 0,
            score: 0,
            alive: true,
            timer: null
        };

        const html = `
            <div style="text-align:center;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span id="snakeTarget" style="font-size:14px;"></span>
                    <span style="font-size:12px; color:var(--text-light);">拼对：<strong id="snakeScore" style="color:var(--primary);">0</strong></span>
                </div>
                <canvas id="snakeCanvas" width="280" height="280" style="background:#f5f5f5; border-radius:10px; max-width:100%; touch-action:none;"></canvas>
                <div style="font-size:12px; color:var(--text-light); margin-top:8px;">方向键 / 滑动 控制蛇头，吃对字母拼出单词</div>
            </div>
        `;
        App.openModal('🐍 贪吃蛇拼单词', html);

        this._snakePlaceFood();
        this._snakeRender();
        this._snakeSetupTouch();

        if (this._snakeKeyHandler) {
            document.removeEventListener('keydown', this._snakeKeyHandler);
        }
        this._snakeKeyHandler = (e) => this._snakeKey(e);
        document.addEventListener('keydown', this._snakeKeyHandler);

        this._snake.timer = setInterval(() => this._snakeStep(), 150);
    },

    _snakePlaceFood() {
        const g = this._snake;
        if (!g) return;
        const occupied = {};
        g.snake.forEach(function (s) { occupied[s.x + ',' + s.y] = true; });
        const free = [];
        for (let x = 0; x < g.grid; x++) {
            for (let y = 0; y < g.grid; y++) {
                if (!occupied[x + ',' + y]) free.push({ x: x, y: y });
            }
        }
        if (free.length === 0) { g.food = null; return; }
        const cell = free[Math.floor(Math.random() * free.length)];
        const w = g.daily[g.wordIndex % g.daily.length];
        cell.letter = (w.word[g.letterIndex]) || '';
        g.food = cell;
    },

    _snakeRender() {
        const g = this._snake;
        if (!g) return;
        const canvas = document.getElementById('snakeCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = 280;
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, size, size);
        g.snake.forEach(function (s, i) {
            ctx.fillStyle = i === 0 ? '#2E7D32' : '#66BB6A';
            ctx.fillRect(s.x * g.cell, s.y * g.cell, g.cell - 1, g.cell - 1);
        });
        if (g.food) {
            ctx.fillStyle = '#FF7043';
            ctx.fillRect(g.food.x * g.cell, g.food.y * g.cell, g.cell - 1, g.cell - 1);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(g.food.letter, g.food.x * g.cell + g.cell / 2, g.food.y * g.cell + g.cell / 2);
        }
        const w = g.daily[g.wordIndex % g.daily.length];
        const targetEl = document.getElementById('snakeTarget');
        if (targetEl) {
            const letters = w.word.split('').map(function (ch, i) {
                const isCur = i === g.letterIndex;
                const style = isCur
                    ? 'color:var(--primary); font-weight:700; background:var(--primary-bg); border-radius:6px; padding:0 3px;'
                    : 'color:var(--text-light);';
                return '<span style="' + style + '">' + ch + '</span>';
            }).join(' ');
            targetEl.innerHTML = '拼出：<span style="letter-spacing:2px;">' + letters + '</span>';
        }
        const scoreEl = document.getElementById('snakeScore');
        if (scoreEl) scoreEl.textContent = g.score;
    },

    _snakeStep() {
        const g = this._snake;
        if (!g || !g.alive) return;
        if (!document.getElementById('snakeCanvas')) { this._snakeGameOver(''); return; }
        g.dir = g.nextDir;
        const head = g.snake[0];
        const nx = head.x + g.dir.x;
        const ny = head.y + g.dir.y;
        if (nx < 0 || ny < 0 || nx >= g.grid || ny >= g.grid) {
            this._snakeRender();
            this._snakeGameOver('撞到墙壁啦！');
            return;
        }
        if (g.snake.some(function (s) { return s.x === nx && s.y === ny; })) {
            this._snakeRender();
            this._snakeGameOver('撞到自己啦！');
            return;
        }
        const newHead = { x: nx, y: ny };
        g.snake.unshift(newHead);
        if (g.food && nx === g.food.x && ny === g.food.y) {
            const w = g.daily[g.wordIndex % g.daily.length];
            const expected = (w.word[g.letterIndex]) || '';
            if (g.food.letter === expected) {
                g.letterIndex++;
                if (g.letterIndex >= w.word.length) {
                    g.score++;
                    g.wordIndex++;
                    g.letterIndex = 0;
                }
                this._snakePlaceFood();
            } else {
                this._snakeRender();
                this._snakeGameOver('吃错字母！要拼的是「' + expected + '」');
                return;
            }
        } else {
            g.snake.pop();
        }
        if (!g.food) { this._snakeRender(); this._snakeGameOver('蛇填满棋盘，太强了！'); return; }
        this._snakeRender();
    },

    _snakeGameOver(msg) {
        const g = this._snake;
        if (!g) return;
        g.alive = false;
        if (g.timer) { clearInterval(g.timer); g.timer = null; }
        if (this._snakeKeyHandler) {
            document.removeEventListener('keydown', this._snakeKeyHandler);
            this._snakeKeyHandler = null;
        }
        const modalBody = document.getElementById('gameContainer');
        if (!modalBody) return;
        modalBody.innerHTML = `
            <div style="text-align:center; padding: 20px 0;">
                <div style="font-size: 56px; margin-bottom: 12px;">🐍</div>
                <div style="font-size: 22px; font-weight: 700; color: var(--danger); margin-bottom: 4px;">游戏结束</div>
                ${msg ? '<div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">' + msg + '</div>' : ''}
                <div style="font-size: 16px; margin-bottom: 16px;">拼对单词数：<strong style="color:var(--primary);">' + g.score + '</strong></div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn btn-primary" onclick="EnglishModule.startSnake()">再来一次</button>
                    <button class="btn" style="background: var(--bg);" onclick="App.closeModal();">完成</button>
                </div>
            </div>
        `;
    },

    _snakeKey(e) {
        const g = this._snake;
        if (!g || !g.alive) return;
        let handled = true;
        if (e.key === 'ArrowUp') { if (g.dir.y === 0) g.nextDir = { x: 0, y: -1 }; }
        else if (e.key === 'ArrowDown') { if (g.dir.y === 0) g.nextDir = { x: 0, y: 1 }; }
        else if (e.key === 'ArrowLeft') { if (g.dir.x === 0) g.nextDir = { x: -1, y: 0 }; }
        else if (e.key === 'ArrowRight') { if (g.dir.x === 0) g.nextDir = { x: 1, y: 0 }; }
        else { handled = false; }
        if (handled) e.preventDefault();
    },

    _snakeSetupTouch() {
        const g = this._snake;
        const canvas = document.getElementById('snakeCanvas');
        if (!canvas || !g) return;
        let tsx = 0, tsy = 0;
        canvas.addEventListener('touchstart', function (e) {
            const t = e.touches[0];
            tsx = t.clientX; tsy = t.clientY;
        }, { passive: true });
        canvas.addEventListener('touchmove', function (e) {
            const t = e.touches[0];
            const dx = t.clientX - tsx, dy = t.clientY - tsy;
            if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (g.dir.x === 0) g.nextDir = { x: dx > 0 ? 1 : -1, y: 0 };
            } else {
                if (g.dir.y === 0) g.nextDir = { x: 0, y: dy > 0 ? 1 : -1 };
            }
            tsx = t.clientX; tsy = t.clientY;
        }, { passive: true });
    },

    /**
     * 中英互译 — 随机出题
     */
    startTranslation() {
        const words = this.getDailyWords();
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        const questions = shuffled.slice(0, Math.min(10, shuffled.length));
        // 随机决定每道题是 中→英 还是 英→中
        const quiz = questions.map(q => ({
            ...q,
            direction: Math.random() < 0.5 ? 'zh2en' : 'en2zh'
        }));
        let currentIdx = 0;
        let correctCount = 0;
        const total = quiz.length;

        const renderQuestion = () => {
            const q = quiz[currentIdx];
            const modalBody = document.getElementById('translationModalBody');
            const isZh2En = q.direction === 'zh2en';

            modalBody.innerHTML = `
                <div style="text-align:center; padding: 16px 0;">
                    <div style="font-size: 12px; color: var(--text-light); margin-bottom: 8px;">
                        第 ${currentIdx + 1} / ${total} 题 &nbsp;·&nbsp;
                        <span class="tag ${isZh2En ? 'tag-warning' : 'tag-info'}">${isZh2En ? '中→英' : '英→中'}</span>
                    </div>
                    <div style="font-size: ${isZh2En ? '20px' : '22px'}; font-weight: 700; color: var(--text); margin-bottom: 4px; padding: 12px;">
                        ${isZh2En ? this.escapeHtml(q.meaning) : this.escapeHtml(q.word)}
                    </div>
                    ${!isZh2En ? `<div style="font-size: 13px; color: var(--text-light); margin-bottom: 12px;">${q.phonetic}</div>` : ''}
                    <input type="text" id="translationInput" class="form-input" placeholder="${isZh2En ? '输入对应的英文单词...' : '输入中文释义...'}" autocomplete="off"
                           style="text-align:center; font-size:18px; width:85%; max-width:300px; margin: 0 auto;">
                    <div id="translationFeedback" style="margin-top: 12px; min-height: 24px;"></div>
                </div>
            `;
            window._translationCurrent = { q, currentIdx, correctCount, total, quiz };
        };

        const showResult = () => {
            const todayRecord = this.getTodayRecord();
            const prevBest = todayRecord && todayRecord.translationBest || 0;
            const newBest = Math.max(prevBest, correctCount);

            const records = this.getRecords();
            const today = Storage.formatDate();
            let existing = records.find(r => r.date === today);
            if (existing) {
                existing.translationBest = newBest;
                existing.translationCount = (existing.translationCount || 0) + 1;
            } else {
                records.push({
                    id: Storage.generateId(),
                    date: today,
                    words: 0,
                    speakingDuration: 0,
                    speakingContent: '',
                    reading: false,
                    listening: false,
                    spellingBest: 0,
                    spellingCount: 0,
                    translationBest: newBest,
                    translationCount: 1,
                    createdAt: Date.now()
                });
            }
            this.saveRecords(records);

            const pct = Math.round((correctCount / total) * 100);
            let emoji = '🌟';
            let comment = '太棒了，满分过关！';
            if (pct < 100 && pct >= 80) { emoji = '👍'; comment = '很不错，继续加油！'; }
            else if (pct < 80 && pct >= 60) { emoji = '💪'; comment = '还需努力，再练一次吧！'; }
            else { emoji = '📖'; comment = '多练练翻译，下次一定更好！'; }

            const modalBody = document.getElementById('translationModalBody');
            modalBody.innerHTML = `
                <div style="text-align:center; padding: 20px 0;">
                    <div style="font-size: 64px; margin-bottom: 12px;">${emoji}</div>
                    <div style="font-size: 28px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">
                        ${correctCount} / ${total}
                    </div>
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px;">
                        正确率 ${pct}%
                    </div>
                    <div style="font-size: 13px; color: var(--text-light); margin-bottom: 8px;">
                        ${comment}
                    </div>
                    ${newBest > prevBest ? `<div style="font-size: 12px; color: var(--success); margin-bottom: 16px;">🎉 刷新今日最佳：${prevBest} → ${newBest}</div>` : ''}
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="btn btn-primary" onclick="EnglishModule.startTranslation()">再来一次</button>
                        <button class="btn" style="background: var(--bg);" onclick="App.closeModal(); App.loadModule('english');">完成</button>
                    </div>
                </div>
            `;
        };

        const checkAnswer = () => {
            const input = document.getElementById('translationInput');
            const feedback = document.getElementById('translationFeedback');
            const q = window._translationCurrent.q;
            const userAnswer = input.value.trim();
            const isZh2En = q.direction === 'zh2en';

            if (!userAnswer) {
                feedback.innerHTML = '<span style="color: var(--warning);">请输入答案</span>';
                return;
            }

            let isCorrect = false;
            if (isZh2En) {
                // 中→英：比较单词（忽略大小写）
                isCorrect = userAnswer.toLowerCase() === q.word.toLowerCase();
            } else {
                // 英→中：比较释义（包含匹配即可）
                isCorrect = q.meaning.includes(userAnswer) || userAnswer.includes(q.meaning.substring(0, Math.min(q.meaning.length, 4)));
            }

            if (isCorrect) {
                window._translationCurrent.correctCount++;
                feedback.innerHTML = `
                    <div style="color: var(--success); font-weight: 700; font-size: 16px;">✅ 正确！</div>
                    <div style="font-size: 13px; color: var(--text); margin-top: 4px;">
                        ${isZh2En ? `<strong>${q.word}</strong> ${q.phonetic}` : `<strong>${this.escapeHtml(q.meaning)}</strong>`}
                    </div>
                `;
            } else {
                feedback.innerHTML = `
                    <div style="color: var(--danger); font-weight: 700; font-size: 16px;">❌ 错误</div>
                    <div style="font-size: 13px; margin-top: 4px;">
                        <span style="color: var(--text-light); text-decoration: line-through;">${this.escapeHtml(userAnswer)}</span>
                        &nbsp;→&nbsp;
                        <span style="color: var(--success); font-weight: 700;">${isZh2En ? q.word : this.escapeHtml(q.meaning)}</span>
                        ${isZh2En ? `<span style="color: var(--text-light);"> ${q.phonetic}</span>` : ''}
                    </div>
                `;
            }

            input.disabled = true;
            const btnRow = document.createElement('div');
            btnRow.style.textAlign = 'center';
            btnRow.style.marginTop = '12px';
            const nextIdx = window._translationCurrent.currentIdx + 1;
            btnRow.innerHTML = nextIdx < window._translationCurrent.total
                ? `<button class="btn btn-primary" onclick="EnglishModule._nextTranslation()">下一题 ▶</button>`
                : `<button class="btn btn-primary" onclick="EnglishModule._finishTranslation()">查看结果 🎯</button>`;
            feedback.appendChild(btnRow);
        };

        window._translationCheckAnswer = checkAnswer;
        window._translationShowResult = showResult;
        window._translationRenderQuestion = renderQuestion;

        const html = `
            <div id="translationModalBody">
                <div style="text-align:center; padding: 40px 0;">
                    <div style="font-size: 48px; margin-bottom: 12px;">🔄</div>
                    <div style="font-size: 16px; font-weight: 700;">中英互译</div>
                    <div style="font-size: 13px; color: var(--text-secondary); margin-top: 8px;">
                        共 ${total} 题，随机中→英或英→中
                    </div>
                    <button class="btn btn-primary" style="margin-top: 20px;" onclick="EnglishModule._startTranslationRound()">开始挑战</button>
                </div>
            </div>
        `;
        App.openModal('🔄 中英互译', html);
    },

    _startTranslationRound() {
        window._translationRenderQuestion();
        setTimeout(() => {
            const input = document.getElementById('translationInput');
            if (input) {
                input.focus();
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') window._translationCheckAnswer();
                });
            }
        }, 300);
    },

    _nextTranslation() {
        window._translationCurrent.currentIdx++;
        window._translationRenderQuestion();
        setTimeout(() => {
            const input = document.getElementById('translationInput');
            if (input) {
                input.focus();
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') window._translationCheckAnswer();
                });
            }
        }, 300);
    },

    _finishTranslation() {
        window._translationShowResult();
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};