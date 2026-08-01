/**
 * 我的衣柜模块
 */
const WardrobeModule = {
    STORAGE_KEY: 'wardrobe_items',

    getItems() {
        return Storage.get(this.STORAGE_KEY, []);
    },

    saveItems(items) {
        Storage.set(this.STORAGE_KEY, items);
    },

    render(container) {
        const items = this.getItems();
        const filter = this._filter || 'all';

        let filtered = items;
        if (filter !== 'all') {
            filtered = items.filter(i => i.season === filter || i.occasion === filter);
        }

        let html = `
            <div class="page-header">
                <div>
                    <h2 class="page-title">我的衣柜</h2>
                    <p class="page-subtitle">${items.length} 套搭配</p>
                </div>
                <button class="btn btn-primary" onclick="WardrobeModule.showAddForm()">➕ 添加搭配</button>
            </div>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-value">${items.length}</div>
                    <div class="stat-label">总搭配数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${items.filter(i => i.season === 'spring').length + items.filter(i => i.season === 'autumn').length}</div>
                    <div class="stat-label">春秋装</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${items.filter(i => i.season === 'summer').length}</div>
                    <div class="stat-label">夏装</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${items.filter(i => i.season === 'winter').length}</div>
                    <div class="stat-label">冬装</div>
                </div>
            </div>

            <!-- 筛选标签 -->
            <div class="tabs">
                <div class="tab ${filter === 'all' ? 'active' : ''}" onclick="WardrobeModule.setFilter('all')">全部</div>
                <div class="tab ${filter === 'spring' ? 'active' : ''}" onclick="WardrobeModule.setFilter('spring')">春</div>
                <div class="tab ${filter === 'summer' ? 'active' : ''}" onclick="WardrobeModule.setFilter('summer')">夏</div>
                <div class="tab ${filter === 'autumn' ? 'active' : ''}" onclick="WardrobeModule.setFilter('autumn')">秋</div>
                <div class="tab ${filter === 'winter' ? 'active' : ''}" onclick="WardrobeModule.setFilter('winter')">冬</div>
            </div>
        `;

        if (filtered.length === 0) {
            html += `
                <div class="empty-state">
                    <div class="empty-state-icon">👗</div>
                    <div class="empty-state-text">还没有添加搭配<br>点击右上角添加第一套吧</div>
                </div>
            `;
        } else {
            html += '<div class="image-grid">';
            for (const item of filtered) {
                html += `
                    <div style="position:relative; cursor:pointer;" onclick="WardrobeModule.showDetail('${item.id}')">
                        <img id="wardrobe-img-${item.id}" src="" alt="${this.escapeHtml(item.name)}">
                        <div style="position:absolute; bottom:0; left:0; right:0; padding:8px; background:linear-gradient(transparent,rgba(0,0,0,0.7)); color:white; border-radius:0 0 8px 8px; font-size:13px;">
                            ${this.escapeHtml(item.name)}
                        </div>
                    </div>
                `;
            }
            html += '</div>';
        }

        container.innerHTML = html;

        // 异步加载图片
        filtered.forEach(item => this.loadImage(item.id));
    },

    async loadImage(itemId) {
        const img = document.getElementById(`wardrobe-img-${itemId}`);
        if (!img) return;
        const data = await Storage.getImage(`wardrobe_${itemId}`);
        if (data) {
            img.src = data;
        } else {
            img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23ccc" font-size="14">无图片</text></svg>';
        }
    },

    setFilter(filter) {
        this._filter = filter;
        App.loadModule('wardrobe');
    },

    showAddForm() {
        const html = `
            <form onsubmit="WardrobeModule.save(event, null)">
                <div class="form-group">
                    <label class="form-label">搭配名称 *</label>
                    <input type="text" class="form-input" id="wardrobeName" required placeholder="如：夏日休闲装">
                </div>
                <div class="form-group">
                    <label class="form-label">季节</label>
                    <select class="form-select" id="wardrobeSeason">
                        <option value="spring">春季</option>
                        <option value="summer">夏季</option>
                        <option value="autumn">秋季</option>
                        <option value="winter">冬季</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">场合</label>
                    <select class="form-select" id="wardrobeOccasion">
                        <option value="casual">日常休闲</option>
                        <option value="work">上班</option>
                        <option value="formal">正式</option>
                        <option value="party">聚会</option>
                        <option value="sport">运动</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">照片</label>
                    <input type="file" class="form-input" id="wardrobeImage" accept="image/*" onchange="WardrobeModule.previewImage(this)" required>
                    <img id="wardrobeImagePreview" style="display:none; width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-top:8px;">
                </div>
                <div class="form-group">
                    <label class="form-label">备注</label>
                    <textarea class="form-textarea" id="wardrobeNote" placeholder="搭配说明..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">添加</button>
            </form>
        `;
        App.openModal('添加搭配', html);
    },

    _previewImageBase64: null,

    async previewImage(input) {
        const file = input.files[0];
        if (!file) return;
        const compressed = await Storage.compressImage(file, 600, 0.7);
        this._previewImageBase64 = compressed;
        const img = document.getElementById('wardrobeImagePreview');
        img.src = compressed;
        img.style.display = 'block';
    },

    async save(event, id) {
        event.preventDefault();

        const name = document.getElementById('wardrobeName').value;
        const season = document.getElementById('wardrobeSeason').value;
        const occasion = document.getElementById('wardrobeOccasion').value;
        const note = document.getElementById('wardrobeNote').value;

        const items = this.getItems();

        if (id) {
            const index = items.findIndex(i => i.id === id);
            if (index !== -1) {
                items[index] = { ...items[index], name, season, occasion, note };
            }
        } else {
            const newItem = {
                id: Storage.generateId(),
                name, season, occasion, note,
                createdAt: Date.now()
            };

            if (this._previewImageBase64) {
                await Storage.saveImage(`wardrobe_${newItem.id}`, this._previewImageBase64);
                this._previewImageBase64 = null;
            }

            items.push(newItem);
        }

        this.saveItems(items);
        App.closeModal();
        App.showToast(id ? '修改成功' : '添加成功', 'success');
        App.loadModule('wardrobe');
    },

    async showDetail(id) {
        const item = this.getItems().find(i => i.id === id);
        if (!item) return;

        const seasonNames = { spring: '春季', summer: '夏季', autumn: '秋季', winter: '冬季' };
        const occasionNames = { casual: '日常休闲', work: '上班', formal: '正式', party: '聚会', sport: '运动' };

        const imageData = await Storage.getImage(`wardrobe_${id}`);

        const html = `
            ${imageData ? `<img src="${imageData}" style="width:100%; border-radius:8px; margin-bottom:16px;">` : ''}

            <div style="margin-bottom:12px;">
                <h3 style="font-size:20px; font-weight:700;">${this.escapeHtml(item.name)}</h3>
            </div>

            <div style="display:flex; gap:8px; margin-bottom:12px;">
                <span class="tag tag-info">${seasonNames[item.season]}</span>
                <span class="tag tag-info">${occasionNames[item.occasion]}</span>
            </div>

            ${item.note ? `<div style="padding:12px; background:var(--bg); border-radius:8px; margin-bottom:16px;">
                <strong>备注：</strong><br>${this.escapeHtml(item.note)}
            </div>` : ''}

            <div style="display:flex; gap:8px;">
                <button class="btn btn-danger" style="flex:1;" onclick="WardrobeModule.delete('${item.id}')">删除</button>
                <button class="btn btn-secondary" style="flex:1;" onclick="App.closeModal()">关闭</button>
            </div>
        `;
        App.openModal('搭配详情', html);
    },

    delete(id) {
        if (!confirm('确定删除这套搭配吗？')) return;
        let items = this.getItems();
        items = items.filter(i => i.id !== id);
        this.saveItems(items);
        Storage.deleteImage(`wardrobe_${id}`);
        App.closeModal();
        App.showToast('已删除', 'success');
        App.loadModule('wardrobe');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
};
