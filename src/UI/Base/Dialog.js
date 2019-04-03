import { DEFAULT_CONFIG } from "../Manager/Dialog";

class Dialog extends Laya.Dialog {
    constructor () {
        super();
        this._$config = Object.assign({}, DEFAULT_CONFIG);
    }

    loadScene (path) {
        this._$needWaitForData = true;
		var url = path.indexOf(".") > -1 ? path : `${path}.scene`;
		var view = Laya.loader.getRes(url);
		if (view){
			this.createView(view);
        } else {
            // loader.showLoadingPage("Dialog");
            var loader = null;
			Laya.loader.resetProgress();
			var dialogLoader = new Laya.SceneLoader();
			// dialogLoader.on(/*laya.events.Event.PROGRESS*/"progress", loader, loader.onLoadProgress, ["Dialog", url]);
			dialogLoader.on(/*laya.events.Event.COMPLETE*/"complete", this, this._onSceneLoaded, [url]);
			dialogLoader.load(url);
		}
    }

    set config (config) {
        this._$config = Object.assign(this._$config, config);
    }

    onMounted () {}

    onResize (width, height) {}
}

Laya["Dialog"] = laya.ui["Dialog"] = Dialog;
export default Dialog;