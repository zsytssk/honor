export type HonorDialogConfig = {
    /** 在弹窗模式为multiple时，是否在弹窗弹窗的时候关闭其他显示中的弹窗 */
    closeOther?: boolean;
    /** 模式窗口点击遮罩，是否关闭窗口，默认是关闭的 */
    closeOnSide?: boolean;
    /** 在弹窗模式为multiple时，是否在弹窗弹窗的时候关闭相同group属性的弹窗 */
    closeByGroup?: boolean;
    /** 在弹窗模式为multiple时，是否在弹窗弹窗的时候关闭相同name属性的弹窗 */
    closeByName?: boolean;
    /** 指定对话框是否居中弹。 如果值为true，则居中弹出，否则，则根据对象坐标显示，默认为true。 */
    shadowAlpha?: number;
    /** 弹出框背景透明度 */
    shadowColor?: string;
    /** 指定时间内自动关闭，单位为ms，默认不打开此功能 */
    autoClose?: boolean | number;
};

export const DEFAULT_CONFIG = {
    closeOther: false,
    closeOnSide: false,
    closeByGroup: false,
    closeByName: false,
    shadowAlpha: 0.5,
    shadowColor: '#000000',
    autoClose: false,
    useExit: true,
} as HonorDialogConfig;

/** Honor 中 dialog支持的接口 */
export interface HonorDialog extends Laya.Dialog {
    config?: HonorDialogConfig;
    /** 弹出层打开之前调用... */
    onMounted?(...params: any[]): void;
    onResize?(width?: number, height?: number): void;
}
