/**
 * @public
 * 将毫秒转换为`{h}小时{m}分钟{s}秒`的格式
 * @param {Number} total 毫秒数
 *
 * @return 格式化后的字符串
 */
export function formatTime(total) {
    var time = '';
    var h = 0;
    var m = 0;
    var s = total % 60;
    if (total > 60) {
        m = (total / 60) | 0;
    }
    if (m > 60) {
        h = (m / 60) | 0;
        m = m % 60;
    }

    if (s > 0) {
        time = s + '秒';
    }
    if (m > 0) {
        time = m + '分钟' + time;
    }
    if (h > 0) {
        time = h + '小时' + time;
    }

    return time;
}
