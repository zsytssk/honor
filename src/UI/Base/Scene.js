class Scene extends Laya.View{
    constructor () {
        super();
        this._$libraryName = "Honor";
        this._$viewType = "Scene";
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
			dialogLoader.on(/*laya.events.Event.PROGRESS*/"progress", loader, loader.onLoadProgress, ["Dialog", url]);
			dialogLoader.on(/*laya.events.Event.COMPLETE*/"complete", this, this._onSceneLoaded, [url, loader, dialogLoader]);
			dialogLoader.load(url);
		}
    }

    createView (view) {
        super.createView(view);

        this.callLater(function () {
            this.event("DialogViewCreated");
        });
    }
    
    _onSceneLoaded (url, loader, dialogLoader) {
        // dialogLoader.off(/*laya.events.Event.PROGRESS*/"progress", loader, loader.onLoadProgress);
        this.createView(Laya.Loader.getRes(url));
        // loader.hideLoadingPage("Dialog");
    }

    onResize (width, height) {}
}

// delete Laya.Scene.open;
// delete Laya.Scene.load;
// delete Laya.Scene._onSceneLoaded;
// delete Laya.Scene.close;
// delete Laya.Scene.closeAll;
// delete Laya.Scene.destroy;
// delete Laya.Scene.setLoadingPage;
// delete Laya.Scene.showLoadingPage;
// delete Laya.Scene._showLoading;
// delete Laya.Scene._hideLoading;
// delete Laya.Scene.hideLoadingPage;
// delete Laya.Scene._root;
// delete Laya.Scene._loadPage;

Laya["Scene"] = laya.display["Scene"] = Scene;
export default Scene;