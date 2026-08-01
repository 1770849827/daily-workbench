/**
 * 月报模块
 * 依赖 weekly.js 中定义的 ReportCommon（weekly.js 必须先于本文件加载）。
 * 汇总本月（自然月）各模块打卡情况，并给出更宏观的月度点评。
 */
const MonthlyModule = {
    STORAGE_KEY: 'monthly_report',

    render: function (container) {
        var data = ReportCommon.compute('month');
        var comment = ReportCommon.getComment(data, 'month');
        container.innerHTML = ReportCommon.buildHtml(data, comment);
    }
};
