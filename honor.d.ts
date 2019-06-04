declare module 'src/Utils/load' {
    export type FunProgress = (progress: number) => void;
    export type ResItem = {
        url: string;
        type: string;
    };
    /** 加载资源... */
    export function loadRes(
        res: ResItem[] | string[],
        on_progress?: FunProgress
    ): Promise<unknown>;
}
declare module 'src/UI/Manager/Loader' {
    import { ViewType } from 'src/UI/View';
    import { ResItem } from 'src/Utils/load';
    export type SceneCtor = typeof Laya.Scene | Laya.Dialog;
    type LoadSceneCompleteFn = (scene: SceneCtor) => void;
    export const LoaderManager: {
        __init__(): void;
        loadScene(
            type: ViewType,
            url: string,
            complete_fn: LoadSceneCompleteFn
        ): void;
        load(res: ResItem[] | string[], type?: ViewType): Promise<unknown>;
        onLoadProgress(type: ViewType, val: number): void;
        onLoadComplete(
            type: ViewType,
            url: string,
            loader: Laya.SceneLoader,
            complete_fn: LoadSceneCompleteFn
        ): void;
        toggleLoading(type: ViewType, status: boolean): void;
    };
    export default LoaderManager;
}
declare module 'src/UI/View' {
    export interface HonorLoadScene {
        /** 关闭调用 */
        onReset(): void;
        /** 打开调用 */
        onShow(): void;
        /** 设置进度 */
        onProgress(val: number): void;
    }
    export interface HonorScene extends Laya.Scene {
        onMounted(...param: any[]): void;
    }
    export type ViewType = 'Scene' | 'Dialog' | 'Alert';
    export const DirectorView: {
        init(): void;
        onResize(width: any, height: any): void;
        _createLoadViewByClass(loadType: any, callback: any, view: any): void;
        _createLoadViewByData(
            type: any,
            url: any,
            callback: any,
            obj: any
        ): void;
        recoverView(view: any): void;
        getViewByPool(url: any): any;
        /** 通过 view 的 ui 数据创建 view  */
        createView(
            data: any,
            ctor: any,
            url: string,
            params?: any[]
        ): Promise<unknown>;
        setLoadView(type: ViewType, url: string, callback: any): void;
        setLoadViewVisible(type: ViewType, visible: boolean): void;
        setLoadProgress(type: any, val: any): void;
        getView(type: any): any;
        setViewVisible(type: any, visible: any): void;
        addView(type: any, view: any): void;
        addViewAt(type: any, view: any, index: any): void;
    };
}
declare module 'src/UI/Manager/Scene' {
    import { HonorScene } from 'src/UI/View';
    export type SceneChangeListener = (
        cur1: string,
        cur2: string
    ) => boolean | void;
    export type SceneChangeData = {
        cur: string;
        prev: string;
    };
    export const SceneManager: {
        sceneChangeBeforeListener: SceneChangeListener[];
        sceneChangeAfterListener: SceneChangeListener[];
        sceneClassMap: {};
        _curScene: any;
        __init__(): void;
        onResize(width: any, height: any): void;
        switchScene(params: any[], scene: HonorScene): SceneChangeData;
        callChangeListener(
            type: 'after' | 'before',
            ...params: string[]
        ): boolean;
        /** 运行场景 */
        runScene(url: any, ...params: any[]): Promise<Laya.Scene>;
        runSceneByCtor(url: any, obj: any): Promise<unknown>;
    };
    export default SceneManager;
}
declare module 'src/UI/Base/Dialog' {
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
    export const DEFAULT_CONFIG: HonorDialogConfig;
    /** Honor 中 dialog支持的接口 */
    export interface HonorDialog extends Laya.Dialog {
        config?: HonorDialogConfig;
        /** 弹出层打开之前调用... */
        onMounted?(...params: any[]): void;
        onResize?(width?: number, height?: number): void;
    }
}
declare module 'src/type' {
    export type Ctor<T> = new (...args: any[]) => T;
}
declare module 'src/UI/Manager/Dialog' {
    import { HonorDialogConfig, HonorDialog } from 'src/UI/Base/Dialog';
    import { Ctor } from 'src/type';
    type DialogRefKey = string | Ctor<HonorDialog>;
    /**
     * <code>DialogManager</code> 对话框管理容器，所有的对话框都在该容器内，并且受管理器管理。
     * 任意对话框打开和关闭，都会触发管理类的open和close事件
     * 可以通过UIConfig设置弹出框背景透明度，模式窗口点击边缘是否关闭，点击窗口是否切换层次等
     * 通过设置对话框的zOrder属性，可以更改弹出的层次
     */
    export class DialogManager extends Laya.DialogManager {
        private viewContent;
        private maskLayerName;
        popupEffectHandler: Laya.Handler;
        closeEffectHandler: Laya.Handler;
        maskLayer: Laya.Sprite;
        private wait_open_dialog_map;
        /** dialog的缓存列表 @ques 在什么时候清除 */
        private dialog_list;
        init(): void;
        /** 获取dialog的配置  */
        private getDialogConfig;
        private closeOnSide;
        onResize(width?: number, height?: number): void;
        /** Dialog 居中 */
        private centerDialog;
        private clearDialogEffect;
        /** 发生层次改变后，重新检查遮罩层是否正确 */
        private checkMask;
        /** @todo 逻辑需要整理下 getViewByPool 不再使用... */
        openDialog(
            url: DialogRefKey,
            params?: any[],
            config?: HonorDialogConfig,
            use_exist?: boolean
        ): Promise<HonorDialog>;
        /** 通过dialog的配置来打开 dialog */
        private openDialogByData;
        private openDialogByClass;
        /**
         * 执行打开对话框。
         * @param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
         */
        doOpen(dialog: any): void;
        /**
         * 关闭对话框。
         * @param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
         */
        close(dialog: HonorDialog): void;
        /**
         * 执行关闭对话框。
         * @param dialog 需要关闭的对象框 <code>Dialog</code> 实例。
         */
        doClose(dialog: HonorDialog): void;
        /**
         * 关闭所有的对话框。
         */
        closeAll(): void;
        /**
         * 关闭指定name值的对话框。
         */
        closeDialogByName(name: string): void;
        /**
         * 根据组关闭所有弹出框
         * @param group 需要关闭的组名称
         */
        closeDialogsByGroup(group: string): void;
        /**
         * 根据组获取所有对话框
         * @param group 组名称
         * @return 对话框数组
         */
        getDialogsByGroup(group: string): any[];
        /**
         * 根据name获取所有对话框
         * @param name 对话框的name
         * @return 对话框
         */
        getDialogByName(name: string): laya.display.Node;
    }
    export {};
}
declare module 'src/state' {
    import { DialogManager as DialogManagerCtor } from 'src/UI/Manager/Dialog';
    export let DialogManager: DialogManagerCtor;
    /** 一切初始化+全局变量都在这里 */
    export function initState(): void;
}
declare module 'src/UI/Director' {
    import { HonorDialogConfig, HonorDialog } from 'src/UI/Base/Dialog';
    export const Director: {
        init(): void;
        onResize(): void;
        runScene(url: any, ...params: any[]): Promise<void | Laya.Scene>;
        readonly runningScene: any;
        openDialog(
            url: any,
            params?: any[],
            config?: HonorDialogConfig,
            use_exist?: boolean
        ): Promise<HonorDialog>;
        getDialogByName(name: any): laya.display.Node;
        getDialogsByGroup(group: any): any[];
        closeDialogByName(name: any): void;
        closeDialogsByGroup(group: any): void;
        closeAllDialogs(): void;
        setLoadPageForScene(url: any, callback: any): void;
        setLoadPageForDialog(url: any, callback: any): void;
    };
}
declare module 'src/Utils/sceneChangeMonitor' {
    import { SceneChangeListener } from 'src/UI/Manager/Scene';
    export function onSceneChangeBefore(fn: SceneChangeListener): void;
    export function onSceneChangeAfter(fn: SceneChangeListener): void;
    export function clearListener(fn: SceneChangeListener): void;
}
declare module 'src/Honor' {
    import { Director } from 'src/UI/Director';
    import * as sceneChangeMonitor from 'src/Utils/sceneChangeMonitor';
    import { DirectorView } from 'src/UI/View';
    const name = 'Honor';
    const version = '0.0.1-beta';
    const load: (params_0: any, params_1?: any) => Promise<unknown>;
    let DEBUG_MODE: boolean;
    global {
        interface Window {
            Laya3D: any;
        }
    }
    function run(GameConfig: any, callback: any): void;
    export const Honor: {
        name: string;
        version: string;
        run: typeof run;
        director: {
            init(): void;
            onResize(): void;
            runScene(url: any, ...params: any[]): Promise<void | Laya.Scene>;
            readonly runningScene: any;
            openDialog(
                url: any,
                params?: any[],
                config?: import('./UI/Base/Dialog').HonorDialogConfig,
                use_exist?: boolean
            ): Promise<import('./UI/Base/Dialog').HonorDialog>;
            getDialogByName(name: any): laya.display.Node;
            getDialogsByGroup(group: any): any[];
            closeDialogByName(name: any): void;
            closeDialogsByGroup(group: any): void;
            closeAllDialogs(): void;
            setLoadPageForScene(url: any, callback: any): void;
            setLoadPageForDialog(url: any, callback: any): void;
        };
        load: (params_0: any, params_1?: any) => Promise<unknown>;
        sceneChangeMonitor: typeof sceneChangeMonitor;
        DirectorView: {
            init(): void;
            onResize(width: any, height: any): void;
            _createLoadViewByClass(
                loadType: any,
                callback: any,
                view: any
            ): void;
            _createLoadViewByData(
                type: any,
                url: any,
                callback: any,
                obj: any
            ): void;
            recoverView(view: any): void;
            getViewByPool(url: any): any;
            createView(
                data: any,
                ctor: any,
                url: string,
                params?: any[]
            ): Promise<unknown>;
            setLoadView(
                type: import('./UI/View').ViewType,
                url: string,
                callback: any
            ): void;
            setLoadViewVisible(
                type: import('./UI/View').ViewType,
                visible: boolean
            ): void;
            setLoadProgress(type: any, val: any): void;
            getView(type: any): any;
            setViewVisible(type: any, visible: any): void;
            addView(type: any, view: any): void;
            addViewAt(type: any, view: any, index: any): void;
        };
        DEBUG_MODE: boolean;
    };
    export {
        name,
        version,
        run,
        Director as director,
        load,
        sceneChangeMonitor,
        DirectorView,
        DEBUG_MODE,
    };
}
declare module 'src/UI/Base/Scene' {
    /**  Honor中scene支持的接口 */
    export interface HonorScene {
        onMounted?(...params: any[]): void;
        onResize?(width?: number, height?: number): void;
    }
}
declare module 'src/Utils/createSkeleton' {
    /**
     * @public
     * 创建骨骼动画
     * @param {String} path 骨骼动画路径
     * @param {Number} rate 骨骼动画帧率，引擎默认为30，一般传24
     * @param {Number} type 动画类型 0,使用模板缓冲的数据，模板缓冲的数据，不允许修改	（内存开销小，计算开销小，不支持换装） 1,使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装） 2,使用动态方式，去实时去画	（内存开销小，计算开销大，支持换装,不建议使用）
     *
     * @return 骨骼动画
     */
    export function createSkeleton(
        path: any,
        rate?: any,
        type?: any
    ): laya.ani.bone.Skeleton;
}
