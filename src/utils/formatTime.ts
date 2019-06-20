/**
 * @public
 * 将毫秒转换为`{h}小时{m}分钟{s}秒`的格式
 * @param total 毫秒数
 *
 * @return 格式化后的字符串
 */
export function formatTime(
    total: number,
    format: string | string[] = ['小时', '分钟', '秒'],
): string {
    let time = '';
    let h = 0;
    let m = 0;
    let s = total % 60;
    if (typeof format === 'string') {
        /** xx::xx::xx 最后不需要:: */
        format = [format, format, ''];
    }

    if (total > 60) {
        m = (total / 60) | 0;
    }
    if (m > 60) {
        h = (m / 60) | 0;
        m = m % 60;
    }

    if (s > 0) {
        time = s + format[2];
    }
    if (m > 0) {
        time = m + format[1] + time;
    }
    if (h > 0) {
        time = h + format[0] + time;
    }

    return time;
}
