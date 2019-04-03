import SceneManager from "./Manager/Scene";
import LoaderManager from "./Manager/Loader";
import DialogManager from "./Manager/Dialog";
import DirectorView from "./View";
import Scene from "./Base/Scene";
import Dialog from "./Base/Dialog";

const Director = {
    __init__ () {
        DirectorView.__init__();
        SceneManager.__init__();
        LoaderManager.__init__();
        DialogManager.__init__();

        Laya.stage.on(Laya.Event.RESIZE, this, this._onResize);
    },

    _onResize () {
        const {width, height} = Laya.stage;
        DirectorView._onResize(width, height);
        SceneManager._onResize(width, height);
        DialogManager._onResize(width, height);
    },

    runScene (url, params) {
        let scene = DirectorView.getViewByPool(url);
        if(scene){
            SceneManager.switchzScene(params, scene);
            return;
        }
        switch(typeof url){
			// case "function":
            //     let scene = new url;
            //     scene.once("onViewCreated", SceneManager, SceneManager.switchScene, [params, scene]);
			// 	break;
			case "string":
                LoaderManager.load("Scene", url, Laya.Handler.create(SceneManager, SceneManager.runScene, [url, params]));
				break;
		}
    },

    get runningScene () {
        return SceneManager._curScene;
    },

    openDialog (url, params, config) {
        let dialog = DirectorView.getViewByPool(typeof url === "function" ? url.name : url);
        if(dialog){
            params && dialog.onMounted.apply(dialog, params);
            DialogManager.openDialogByClass(config, dialog);
            return;
        }
        switch(typeof url){
			case "function":
                dialog = new url;
                params && dialog.onMounted.apply(dialog, params);
                if(!dialog._$needWaitForData){
                    DialogManager.openDialogByClass(config, dialog);
                }else{
                    dialog.once("onViewCreated", DialogManager, DialogManager.openDialogByClass, [config, dialog]);
                }
				break;
			case "string":
                LoaderManager.load("Dialog", url, Laya.Handler.create(DialogManager, DialogManager.openDialogByData, [url, params, config]));
				break;
		}
    },

    getDialogByName (name) {
        return DialogManager.getDialogByName(name);
    },

    getDialogsByGroup (group) {
        return DialogManager.getDialogsByGroup(group);
    },

    closeDialogByName (name) {
        DialogManager.closeDialogByName(name);
    },

    closeDialogsByGroup (group) {
        DialogManager.closeDialogsByGroup(group);
    },

    closeAllDialogs () {
        DialogManager.closeAll();
    },

    setLoadPageForScene (url) {
        DirectorView.setLoadView("Scene", url);
    },

    setLoadPageForDialog (url) {
        DirectorView.setLoadView("Dialog", url);
    }
}

export default Director;