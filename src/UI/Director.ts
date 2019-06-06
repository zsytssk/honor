import { DialogManager } from '../state';
import { HonorDialogConfig } from './Base/Dialog';
import { SceneManager } from './Manager/Scene';
import { DirectorView, HonorScene, ViewType } from './View';
import { LoaderManager } from './Manager/Loader';
import { ResItem } from 'honor/utils/loadRes';

export const Director = {
    init() {
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        this.onResize();
    },

    onResize() {
        const { width, height } = Laya.stage;
        DirectorView.onResize(width, height);
        SceneManager.onResize(width, height);
        DialogManager.onResize(width, height);
    },
    /**
     * 运行场景
     * @param url 场景的url
     * @param params 场景 onMounted 接收的参数
     */
    runScene(url: string, ...params: any[]): Promise<Laya.Scene | void> {
        return SceneManager.runScene(url, ...params).catch(err => {
            console.error('runScene interrupt');
        });
    },
    /**
     * 获取当前正在运行场景
     * @param url 场景的url
     * @param params 场景 onMounted 接收的参数
     */
    get runningScene(): HonorScene {
        return SceneManager._curScene;
    },
    /**
     * 打开弹出层
     * @param url 弹出层
     * @param params 场景 onMounted 接收的参数
     * @param config 弹出层的配置
     */
    openDialog(
        url,
        params?: any[],
        config?: HonorDialogConfig,
        use_exist = false,
    ) {
        return DialogManager.openDialog(url, params, config, use_exist);
    },
    load(res: ResItem[] | string[], type?: ViewType) {
        return LoaderManager.load(res, type);
    },

    getDialogByName(name) {
        return DialogManager.getDialogByName(name);
    },

    getDialogsByGroup(group) {
        return DialogManager.getDialogsByGroup(group);
    },

    closeDialogByName(name) {
        DialogManager.closeDialogByName(name);
    },

    closeDialogsByGroup(group) {
        DialogManager.closeDialogsByGroup(group);
    },

    closeAllDialogs() {
        DialogManager.closeAll();
    },
    /** 设置场景切换的loading页面
     * @param url loading页面的url
     * @param callback 完成的callback
     */
    setLoadPageForScene(url: string, callback: Laya.Handler) {
        DirectorView.setLoadView('Scene', url, callback);
    },

    setLoadPageForDialog(url: string, callback: Laya.Handler) {
        DirectorView.setLoadView('Dialog', url, callback);
    },
};
