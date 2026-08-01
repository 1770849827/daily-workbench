/**
 * 数据存储层
 * 支持 localStorage（结构化数据）+ IndexedDB（图片数据）
 */

const Storage = {
    // localStorage 前缀
    PREFIX: 'dw_',

    // IndexedDB 配置
    DB_NAME: 'DailyWorkbenchDB',
    DB_VERSION: 1,
    IMAGE_STORE: 'images',
    _db: null,

    /**
     * 初始化 IndexedDB
     */
    async initDB() {
        return new Promise((resolve, reject) => {
            if (this._db) return resolve(this._db);

            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = () => reject(request.error);

            request.onsuccess = () => {
                this._db = request.result;
                resolve(this._db);
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.IMAGE_STORE)) {
                    db.createObjectStore(this.IMAGE_STORE, { keyPath: 'id' });
                }
            };
        });
    },

    /**
     * ===== localStorage 方法 =====
     */

    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(this.PREFIX + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },

    remove(key) {
        localStorage.removeItem(this.PREFIX + key);
    },

    /**
     * 获取所有数据（用于导出）
     */
    getAll() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.PREFIX)) {
                const cleanKey = key.substring(this.PREFIX.length);
                try {
                    data[cleanKey] = JSON.parse(localStorage.getItem(key));
                } catch (e) {
                    data[cleanKey] = localStorage.getItem(key);
                }
            }
        }
        return data;
    },

    /**
     * 导入所有数据
     */
    importAll(data) {
        // 清除旧数据
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));

        // 写入新数据
        for (const [key, value] of Object.entries(data)) {
            this.set(key, value);
        }
    },

    /**
     * ===== IndexedDB 图片存储方法 =====
     */

    /**
     * 保存图片
     * @param {string} id - 图片ID
     * @param {string} dataUrl - base64图片数据
     */
    async saveImage(id, dataUrl) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = this._db.transaction([this.IMAGE_STORE], 'readwrite');
            const store = tx.objectStore(this.IMAGE_STORE);
            const request = store.put({ id, data: dataUrl, createdAt: Date.now() });
            request.onsuccess = () => resolve(id);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * 获取图片
     */
    async getImage(id) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = this._db.transaction([this.IMAGE_STORE], 'readonly');
            const store = tx.objectStore(this.IMAGE_STORE);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result ? request.result.data : null);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * 删除图片
     */
    async deleteImage(id) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = this._db.transaction([this.IMAGE_STORE], 'readwrite');
            const store = tx.objectStore(this.IMAGE_STORE);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * 获取所有图片
     */
    async getAllImages() {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = this._db.transaction([this.IMAGE_STORE], 'readonly');
            const store = tx.objectStore(this.IMAGE_STORE);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * ===== 工具方法 =====
     */

    /**
     * 生成唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },

    /**
     * 格式化日期 YYYY-MM-DD
     */
    formatDate(date = new Date()) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * 格式化时间 HH:mm
     */
    formatTime(date = new Date()) {
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    },

    /**
     * 格式化日期时间
     */
    formatDateTime(date = new Date()) {
        return `${this.formatDate(date)} ${this.formatTime(date)}`;
    },

    /**
     * 将文件转为 base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    /**
     * 压缩图片
     */
    compressImage(file, maxWidth = 800, quality = 0.7) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
};
