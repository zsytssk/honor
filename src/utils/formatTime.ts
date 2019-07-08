/**
 * @public
 * 将毫秒转换为`{h}小时{m}分钟{s}秒`的格式
 * @param total 秒数
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

    const time_arr = [h, m, s];
    for (const [index, item] of time_arr.entries()) {
        time += formatTimeZone(item) + format[index];
    }
    return time;
}

function formatTimeZone(val: number): string {
    return val > 9 ? val + '' : '0' + val;
}
