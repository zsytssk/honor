import { dialogManager, directorView, sceneManager, untilInit } from '../state';
import { HonorDialogConfig } from './base/Dialog';
import { HonorScene, ViewType } from './directorView';
import { loaderManager } from '../state';
import { ResItem } from '../utils/loadRes';
import { DEBUG_MODE } from '../honor';
import { SceneChangeListener } from './manager/SceneManager';

export class DirectorCtor {
    public init() {
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        this.onResize();
    }

    private onResize() {
        const { width, height } = Laya.stage;
        directorView.onResize(width, height);
        sceneManager.onResize(width, height);
        dialogManager.onResize(width, height);
    }
    /**
     * 运行场景
     * @param url 场景的url
     * @param params 场景 onMounted 接收的参数
     */
    public runScene(url: string, ...params: any[]): Promise<Laya.Scene | void> {
        return sceneManager.runScene(url, ...params).catch(err => {
            if (DEBUG_MODE) {
                console.error(err);
            }
        });
    }
    /**
     * 获取当前正在运行场景
     * @param url 场景的url
     * @param params 场景 onMounted 接收的参数
     */
    get runningScene(): HonorScene {
        return sceneManager.getCurScene();
    }
    /**
     * 打开弹出层
     * @param url 弹出层
     * @param params 场景 onMounted 接收的参数
     * @param config 弹出层的配置
     */
    public openDialog(
        url,
        params?: any[],
        config?: HonorDialogConfig,
        use_exist = false,
    ) {
        return dialogManager.openDialog(url, params, config, use_exist);
    }
    public load(res: ResItem[] | string[], type?: ViewType) {
        return loaderManager.load(res, type);
    }

    public getDialogByName(name) {
        return dialogManager.getDialogByName(name);
    }

    public getDialogsByGroup(group) {
        return dialogManager.getDialogsByGroup(group);
    }

    public closeDialogByName(name) {
        dialogManager.closeDialogByName(name);
    }

    public closeDialogsByGroup(group) {
        dialogManager.closeDialogsByGroup(group);
    }

    public closeAllDialogs() {
        dialogManager.closeAll();
    }
    /** 设置场景切换的loading页面
     * @param url loading页面的url
     * @param callback 完成的callback
     */
    public setLoadPageForScene(url: string, callback: Laya.Handler) {
        directorView.setLoadView('Scene', url, callback);
    }

    public setLoadPageForDialog(url: string, callback: Laya.Handler) {
        directorView.setLoadView('Dialog', url, callback);
    }
    public async onSceneChangeBefore(fn: SceneChangeListener) {
        await untilInit();
        sceneManager.sceneChangeBeforeListener.push(fn);
    }
    public async onSceneChangeAfter(fn: SceneChangeListener) {
        await untilInit();
        sceneManager.sceneChangeAfterListener.push(fn);
    }
    public async clearListener(fn: SceneChangeListener) {
        await untilInit();
        sceneManager.sceneChangeBeforeListener = sceneManager.sceneChangeBeforeListener.filter(
            item => {
                return item !== fn;
            },
        );
        sceneManager.sceneChangeAfterListener = sceneManager.sceneChangeAfterListener.filter(
            item => {
                return item !== fn;
            },
        );
    }
}
