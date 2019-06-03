import SceneManager from './Manager/Scene';
import LoaderManager, { SceneCtor } from './Manager/Loader';
import DirectorView from './View';
import { HonorDialogConfig } from './Base/Dialog';
import { DialogManager } from 'honor/state';

const Director = {
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

    runScene(url, ...params): Promise<Laya.Scene | void> {
        return SceneManager.runScene(url, ...params).catch(err => {
            console.error('runScene interrupt');
        });
    },

    get runningScene() {
        return SceneManager._curScene;
    },

    openDialog(
        url,
        params?: any[],
        config?: HonorDialogConfig,
        use_exist = false,
    ) {
        return DialogManager.openDialog(url, params, config, use_exist);
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

    setLoadPageForScene(url, callback) {
        DirectorView.setLoadView('Scene', url, callback);
    },

    setLoadPageForDialog(url, callback) {
        DirectorView.setLoadView('Dialog', url, callback);
    },
};

export default Director;
