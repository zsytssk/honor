import { DEBUG_MODE } from '../index';
import {
    dialogManager,
    loaderManager,
    sceneManager,
    untilInit,
} from '../state';
import { ResItem } from '../utils/loadRes';
import { DialogRefUrl } from './manager/DialogManager';
import { SceneChangeListener, SceneRefUrl } from './manager/SceneManager';
import { HonorDialogConfig, HonorScene, ViewType } from './view';

export class DirectorCtor {
    public init() {
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        this.onResize();
    }

    private onResize() {
        const { width, height } = Laya.stage;
        sceneManager.onResize(width, height);
    }
    /**
     * 运行场景
     * @param url 场景的url
     * @param params 场景 onMounted 接收的参数
     */
    public runScene(
        url: SceneRefUrl,
        ...params: any[]
    ): Promise<Laya.Scene | void> {
        return sceneManager.runScene(url, ...params).catch(err => {
            if (DEBUG_MODE) {
                console.error(err);
            }
        });
    }
    /**
     * 获取当前正在运行场景
     * @param url 场景的url
     * .3.3..
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
        url: DialogRefUrl,
        params: any[] = [],
        config: HonorDialogConfig = {},
        use_exist = false,
    ) {
        return dialogManager.openDialog(url, params, config, use_exist);
    }
    public load(res: ResItem[] | string[], type?: ViewType) {
        return loaderManager.load(res, type);
    }

    public getDialogByName(name: string) {
        return dialogManager.getDialogByName(name);
    }

    public getDialogsByGroup(group: string) {
        return dialogManager.getDialogsByGroup(group);
    }

    public closeDialogByName(name: string) {
        dialogManager.closeDialogByName(name);
    }

    public closeDialogsByGroup(group: string) {
        dialogManager.closeDialogsByGroup(group);
    }

    public closeAllDialogs() {
        dialogManager.closeAllDialogs();
    }
    /** 设置scene loading页面
     */
    public setLoadPageForScene(url: string) {
        return loaderManager.setLoadView('Scene', url);
    }
    /** 设置dialog loading 页面
     */
    public setLoadPageForDialog(url: string) {
        return loaderManager.setLoadView('Dialog', url);
    }
    public async clearDialog(fn: SceneChangeListener) {
        await untilInit();
        sceneManager.sceneChangeAfterListener.push(fn);
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
