/**
 * 云端同步模块
 * 当沙箱服务器可用时，进行数据同步
 */

const Sync = {
    // 同步服务器地址（沙箱启动后可配置）
    serverUrl: '',

    /**
     * 执行同步
     */
    async sync() {
        // 如果未配置服务器地址，提示用户
        if (!this.serverUrl) {
            const url = prompt('请输入同步服务器地址（留空则跳过）：\n例如：http://your-server:3000');
            if (!url) return;
            this.serverUrl = url.trim().replace(/\/$/, '');
        }

        App.showToast('正在同步...');

        try {
            // 上传本地数据
            await this.upload();
            // 下载服务器数据
            await this.download();

            App.showToast('同步成功！', 'success');
            // 刷新当前页面
            App.loadModule(App.currentModule);
        } catch (err) {
            console.error('Sync error:', err);
            App.showToast('同步失败：' + err.message, 'error');
        }
    },

    /**
     * 上传本地数据到服务器
     */
    async upload() {
        const data = Storage.getAll();
        const images = await Storage.getAllImages();

        const response = await fetch(`${this.serverUrl}/api/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: data,
                images: images
            })
        });

        if (!response.ok) throw new Error('上传失败');
    },

    /**
     * 从服务器下载数据
     */
    async download() {
        const response = await fetch(`${this.serverUrl}/api/sync`);
        if (!response.ok) throw new Error('下载失败');

        const result = await response.json();

        // 合并数据（服务器优先）
        if (result.data) {
            Storage.importAll(result.data);
        }

        // 合并图片
        if (result.images && result.images.length > 0) {
            for (const img of result.images) {
                await Storage.saveImage(img.id, img.data);
            }
        }
    }
};
