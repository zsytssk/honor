import DirectorView from "../View";

const LoaderManager = {
    __init__ () {},
    load (type, url, complete) {
        let sceneData = Laya.Loader.getRes(url);
        if(sceneData){
            return complete.runWith(sceneData);
        }
        type && DirectorView.setLoadViewVisible(type, true);

        Laya.loader.resetProgress();
		var loader = new Laya.SceneLoader();
		loader.on(/*laya.events.Event.PROGRESS*/"progress", this, this.onLoadProgress, [type]);
		loader.once(/*laya.events.Event.COMPLETE*/"complete", this, this.onLoadComplete, [type, url, loader, complete]);
		loader.load(url);
    },

    onLoadProgress (type, val) {
        type && DirectorView.setLoadProgress(type, val);
    },

    onLoadComplete (type, url, loader, complete) {
        loader.off(/*laya.events.Event.PROGRESS*/"progress", null, this.onLoadProgress);
        var obj = Laya.Loader.getRes(url);
        
        complete.runWith(obj);
        type && DirectorView.setLoadViewVisible(type, false);
    }
}

export default LoaderManager;