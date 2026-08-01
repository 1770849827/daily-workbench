/**
 * 我的足迹模块（空白中国地图风格）
 * 只保留「城市 + 五星推荐」，去掉省份维度。
 */
const PlacesModule = {
    STORAGE_KEY: 'places_records',

    // 品牌色（粉色系）
    COLOR_VISITED: '#EC407A',
    COLOR_VISITED_DARK: '#C2185B',
    COLOR_UNVISITED: '#CFCFCF',
    COLOR_BG: '#F5F0FA',

    // 中国主要城市坐标 (800x600 画布，相对坐标)
    CITIES: [
        { name: '北京', x: 580, y: 220 },
        { name: '上海', x: 680, y: 382 },
        { name: '广州', x: 560, y: 490 },
        { name: '深圳', x: 560, y: 502 },
        { name: '成都', x: 400, y: 380 },
        { name: '重庆', x: 450, y: 400 },
        { name: '杭州', x: 668, y: 378 },
        { name: '南京', x: 650, y: 340 },
        { name: '武汉', x: 550, y: 380 },
        { name: '西安', x: 470, y: 320 },
        { name: '长沙', x: 540, y: 422 },
        { name: '郑州', x: 560, y: 320 },
        { name: '济南', x: 600, y: 290 },
        { name: '沈阳', x: 680, y: 200 },
        { name: '哈尔滨', x: 700, y: 140 },
        { name: '长春', x: 680, y: 170 },
        { name: '太原', x: 540, y: 280 },
        { name: '石家庄', x: 570, y: 292 },
        { name: '兰州', x: 400, y: 290 },
        { name: '西宁', x: 370, y: 280 },
        { name: '乌鲁木齐', x: 220, y: 200 },
        { name: '拉萨', x: 300, y: 380 },
        { name: '昆明', x: 420, y: 470 },
        { name: '贵阳', x: 470, y: 440 },
        { name: '南宁', x: 480, y: 490 },
        { name: '海口', x: 530, y: 550 },
        { name: '福州', x: 630, y: 450 },
        { name: '厦门', x: 630, y: 462 },
        { name: '南昌', x: 590, y: 420 },
        { name: '合肥', x: 620, y: 360 },
        { name: '台北', x: 660, y: 470 },
        { name: '天津', x: 590, y: 232 },
        { name: '银川', x: 440, y: 272 },
        { name: '呼和浩特', x: 520, y: 230 },
        { name: '香港', x: 566, y: 508 },
        { name: '澳门', x: 544, y: 513 },
        // 新增城市
        { name: '苏州', x: 696, y: 366 },
        { name: '无锡', x: 678, y: 358 },
        { name: '宁波', x: 700, y: 398 },
        { name: '青岛', x: 632, y: 282 },
        { name: '大连', x: 706, y: 214 },
        { name: '三亚', x: 538, y: 576 },
        { name: '桂林', x: 500, y: 478 },
        { name: '丽江', x: 378, y: 452 },
        { name: '大理', x: 402, y: 462 }
    ],

    getRecords() {
        return Storage.get(this.STORAGE_KEY, []);
    },

    saveRecords(records) {
        Storage.set(this.STORAGE_KEY, records);
    },

    render(container) {
        const records = this.getRecords();
        const visitedCities = new Set(records.map(r => r.city));
        const fiveStarCount = records.filter(r => r.rating === 5).length;

        let html = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">我的足迹</h2>
                    <p class="page-subtitle">走过的每一步都是风景</p>
                </div>
                <button class="btn btn-primary" onclick="PlacesModule.showForm(null, '', false)">➕ 添加足迹</button>
            </div>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-value" style="color:${this.COLOR_VISITED};">${visitedCities.size}</div>
                    <div class="stat-label">已去城市</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color:${this.COLOR_VISITED_DARK};">${fiveStarCount}</div>
                    <div class="stat-label">五星推荐</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.CITIES.length}</div>
                    <div class="stat-label">地图城市</div>
                </div>
            </div>

            <!-- 空白中国地图 -->
            <div class="card" style="margin-bottom:16px; overflow-x:auto; background:${this.COLOR_BG}; border-radius:16px;">
                <h3 style="font-size:15px; margin-bottom:12px;">🗺️ 中国足迹地图</h3>
                <div style="position:relative; min-width:700px;">
                    ${this.renderMap(records, visitedCities)}
                </div>
                <div style="display:flex; gap:16px; justify-content:center; margin-top:12px; font-size:12px; color:var(--text-light);">
                    <span style="display:flex; align-items:center; gap:4px;">
                        <span style="width:10px; height:10px; border-radius:50%; background:#FFF; border:1.5px solid ${this.COLOR_UNVISITED};"></span>未去过
                    </span>
                    <span style="display:flex; align-items:center; gap:4px;">
                        <span style="width:12px; height:12px; border-radius:50%; background:${this.COLOR_VISITED};"></span>已去过
                    </span>
                </div>
                <p style="text-align:center; font-size:11px; color:var(--text-light); margin-top:6px;">点击地图上的城市即可标记「去过 + 评星」</p>
            </div>

            <!-- 已去城市列表 -->
            <h3 style="margin:16px 0 10px; font-size:15px; color:var(--text-secondary);">已去过的城市（${visitedCities.size}）</h3>
        `;

        if (records.length === 0) {
            html += `<div class="empty-state"><div class="empty-state-icon">📍</div><div class="empty-state-text">还没有足迹<br>点击地图上的城市或右上角添加吧</div></div>`;
        } else {
            // 按打卡时间倒序
            const sorted = records.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            sorted.forEach(r => {
                const stars = this.renderStars(r.rating || 0);
                html += `
                    <div class="list-item" style="cursor:pointer; border-radius:12px;" onclick="PlacesModule.showForm('${r.id}', '', true)">
                        ${r.imageId ? `<img src="" id="place-img-${r.imageId}" style="width:50px; height:50px; border-radius:10px; object-fit:cover;">` : '<span style="font-size:24px;">📍</span>'}
                        <div style="flex:1;">
                            <div style="font-weight:600;">${this.escapeHtml(r.city)}</div>
                            ${r.date ? `<div style="font-size:12px; color:var(--text-light);">📅 ${r.date}</div>` : ''}
                            <div style="font-size:13px; color:${this.COLOR_VISITED};">${stars}</div>
                        </div>
                        <div class="action-buttons">
                            <button class="action-btn danger" onclick="event.stopPropagation(); PlacesModule.delete('${r.id}')">删除</button>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = html;

        // 加载图片
        records.forEach(r => { if (r.imageId) this.loadImage(r.imageId); });
    },

    renderMap(records, visitedCities) {
        // 构建记录索引（按城市名）
        const recordByCity = {};
        records.forEach(r => {
            if (!recordByCity[r.city]) recordByCity[r.city] = r;
        });

        let svg = `<svg viewBox="0 0 800 600" style="width:100%; height:auto; display:block;" xmlns="http://www.w3.org/2000/svg">`;

        // 背景留白（淡色）
        svg += `<rect width="800" height="600" fill="${this.COLOR_BG}" rx="16"/>`;

        // 极简淡色中国轮廓（省界不显示，仅作底图定位）
        svg += `<path d="M 180,160 Q 200,130 250,120 L 350,110 Q 450,100 550,95 L 680,100 Q 720,110 740,150 L 750,200 Q 745,250 730,280 L 720,330 Q 710,380 690,420 L 660,470 Q 620,510 570,530 L 520,545 Q 480,555 440,550 L 400,540 Q 360,530 330,510 L 290,480 Q 260,450 250,410 L 240,370 Q 230,330 220,290 L 200,250 Q 185,210 180,160 Z" fill="#EDE6F2" stroke="#E0D4EC" stroke-width="1.5" opacity="0.7"/>`;

        // 海南岛
        svg += `<ellipse cx="530" cy="552" rx="25" ry="12" fill="#EDE6F2" stroke="#E0D4EC" stroke-width="1" opacity="0.7"/>`;
        // 台湾岛
        svg += `<ellipse cx="662" cy="475" rx="8" ry="18" fill="#EDE6F2" stroke="#E0D4EC" stroke-width="1" opacity="0.7"/>`;

        // 城市圆点 + 名称
        this.CITIES.forEach(city => {
            const visited = visitedCities.has(city.name);
            const rec = recordByCity[city.name];
            const fillColor = visited ? this.COLOR_VISITED : '#FFFFFF';
            const strokeColor = visited ? this.COLOR_VISITED_DARK : this.COLOR_UNVISITED;
            const radius = visited ? 8 : 5;
            const textColor = visited ? this.COLOR_VISITED_DARK : '#9A9A9A';

            // 已去过的城市：粉色呼吸光晕
            if (visited) {
                svg += `<circle cx="${city.x}" cy="${city.y}" r="${radius + 4}" fill="${this.COLOR_VISITED}" opacity="0.18">
                    <animate attributeName="r" values="${radius+3};${radius+7};${radius+3}" dur="2.4s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.18;0.4;0.18" dur="2.4s" repeatCount="indefinite"/>
                </circle>`;
            }

            svg += `<circle cx="${city.x}" cy="${city.y}" r="${radius}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5" style="cursor:pointer;" onclick="PlacesModule.toggleCity('${city.name}')">
                <title>${city.name}${visited ? ' · ' + (rec && rec.rating ? rec.rating + '星' : '已去过') : ' 点击标记去过'}</title>
            </circle>`;

            // 城市名标签（始终显示）
            svg += `<text x="${city.x}" y="${city.y - 11}" text-anchor="middle" font-size="11" fill="${textColor}" font-weight="${visited ? '600' : '400'}" style="pointer-events:none; cursor:pointer;" onclick="PlacesModule.toggleCity('${city.name}')">${city.name}</text>`;
        });

        svg += `</svg>`;
        return svg;
    },

    toggleCity(cityName) {
        const record = this.getRecords().find(r => r.city === cityName);
        // 无论是否已去过，都打开「标记去过 + 评星」表单
        this.showForm(record ? record.id : null, cityName, true);
    },

    renderStars(rating) {
        rating = rating || 0;
        let s = '';
        for (let i = 1; i <= 5; i++) {
            s += i <= rating ? '⭐' : '☆';
        }
        return s;
    },

    async showForm(existingId, presetCity, lockCity) {
        let record = null;
        if (existingId) {
            record = this.getRecords().find(r => r.id === existingId);
        }
        const isEdit = !!record;
        const cityVal = isEdit ? record.city : (presetCity || '');
        const dateVal = isEdit ? record.date : Storage.formatDate();
        const ratingVal = isEdit ? (record.rating || 0) : 0;
        const noteVal = isEdit ? record.note : '';
        const imageIdVal = isEdit ? record.imageId : null;

        const starsHtml = [1, 2, 3, 4, 5].map(n => {
            const active = n <= ratingVal;
            return `<span class="rating-star" data-rating="${n}" onclick="PlacesModule.selectRating(${n})" style="cursor:pointer; opacity:${active ? 1 : 0.3};">⭐</span>`;
        }).join('');

        const html = `
            <form onsubmit="PlacesModule.save(event, ${isEdit ? "'" + existingId + "'" : 'null'})">
                <div class="form-group">
                    <label class="form-label">城市 *</label>
                    <input type="text" class="form-input" id="placeCity" required value="${this.escapeHtml(cityVal)}" placeholder="如：杭州" ${lockCity ? 'readonly style="background:var(--bg);"' : ''}>
                </div>
                <div class="form-group">
                    <label class="form-label">去过日期</label>
                    <input type="date" class="form-input" id="placeDate" value="${dateVal}">
                </div>
                <div class="form-group">
                    <label class="form-label">五星推荐</label>
                    <div style="display:flex; gap:8px; font-size:28px;" id="ratingStars">${starsHtml}</div>
                    <input type="hidden" id="placeRating" value="${ratingVal}">
                    <div style="font-size:12px; color:var(--text-light); margin-top:4px;">点击星星设置 1-5 星评分</div>
                </div>
                <div class="form-group">
                    <label class="form-label">游记 / 感受</label>
                    <textarea class="form-textarea" id="placeNote" placeholder="记录这次旅行的感受...">${this.escapeHtml(noteVal)}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">照片</label>
                    <input type="file" class="form-input" id="placeImage" accept="image/*" onchange="PlacesModule.previewImage(this)">
                    <img id="placeImagePreview" style="display:${imageIdVal ? 'block' : 'none'}; width:100%; max-height:200px; object-fit:cover; border-radius:12px; margin-top:8px;">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; background:${this.COLOR_VISITED};">${isEdit ? '保存修改' : '标记去过'}</button>
            </form>
        `;
        App.openModal(isEdit ? '编辑足迹' : '添加足迹', html);

        // 编辑模式：载入已有照片
        if (imageIdVal) {
            const data = await Storage.getImage(imageIdVal);
            const img = document.getElementById('placeImagePreview');
            if (data && img) img.src = data;
        }
    },

    selectRating(rating) {
        const input = document.getElementById('placeRating');
        if (!input) return;
        input.value = rating;
        const stars = document.querySelectorAll('.rating-star');
        for (let i = 0; i < stars.length; i++) {
            const val = parseInt(stars[i].dataset.rating);
            stars[i].style.opacity = val <= rating ? 1 : 0.3;
        }
    },

    _previewImageBase64: null,

    async previewImage(input) {
        const file = input.files[0];
        if (!file) return;
        const compressed = await Storage.compressImage(file, 600, 0.7);
        this._previewImageBase64 = compressed;
        const img = document.getElementById('placeImagePreview');
        if (img) {
            img.src = compressed;
            img.style.display = 'block';
        }
    },

    async save(event, id) {
        event.preventDefault();
        const city = (document.getElementById('placeCity').value || '').trim();
        const date = document.getElementById('placeDate').value;
        const rating = parseInt(document.getElementById('placeRating').value) || 0;
        const note = document.getElementById('placeNote').value;

        if (!city) {
            App.showToast('请填写城市名称', 'error');
            return;
        }

        const records = this.getRecords();

        if (id) {
            const index = records.findIndex(r => r.id === id);
            if (index !== -1) {
                records[index] = {
                    id: records[index].id,
                    city: city,
                    date: date,
                    rating: rating,
                    note: note,
                    imageId: records[index].imageId,
                    createdAt: records[index].createdAt
                };
                if (this._previewImageBase64) {
                    if (records[index].imageId) await Storage.deleteImage(records[index].imageId);
                    records[index].imageId = Storage.generateId();
                    await Storage.saveImage(records[index].imageId, this._previewImageBase64);
                    this._previewImageBase64 = null;
                }
            }
        } else {
            // 同一城市已存在则更新，避免重复
            const exist = records.find(r => r.city === city);
            if (exist) {
                exist.date = date;
                exist.rating = rating;
                exist.note = note;
                if (this._previewImageBase64) {
                    if (exist.imageId) await Storage.deleteImage(exist.imageId);
                    exist.imageId = Storage.generateId();
                    await Storage.saveImage(exist.imageId, this._previewImageBase64);
                    this._previewImageBase64 = null;
                }
            } else {
                const newRecord = {
                    id: Storage.generateId(),
                    city: city,
                    date: date,
                    rating: rating,
                    note: note,
                    imageId: null,
                    createdAt: Date.now()
                };
                if (this._previewImageBase64) {
                    newRecord.imageId = Storage.generateId();
                    await Storage.saveImage(newRecord.imageId, this._previewImageBase64);
                    this._previewImageBase64 = null;
                }
                records.push(newRecord);
            }
        }

        this.saveRecords(records);
        App.closeModal();
        App.showToast(id ? '修改成功' : '足迹已点亮！', 'success');
        App.loadModule('places');
    },

    async loadImage(imageId) {
        const img = document.getElementById(`place-img-${imageId}`);
        if (!img) return;
        const data = await Storage.getImage(imageId);
        if (data) img.src = data;
    },

    delete(id) {
        if (!confirm('确定删除这条足迹吗？地图上的点亮也会取消。')) return;
        let records = this.getRecords();
        const record = records.find(r => r.id === id);
        if (record && record.imageId) Storage.deleteImage(record.imageId);
        records = records.filter(r => r.id !== id);
        this.saveRecords(records);
        App.closeModal();
        App.showToast('已删除', 'success');
        App.loadModule('places');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};
