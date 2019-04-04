import DirectorView from "../View";

const SceneManager = {
    sceneClassMap : {},
    _curScene : null,
    __init__ () {
        
    },

    _onResize (width, height) {
        if(this._curScene){
            this._curScene.size(width, height);
            this._curScene.onResize(width, height);
        }
    },

    switchScene (params, scene) {
        const {width, height} = Laya.stage;
        scene.size(width, height);
        scene.onOpened && scene.onOpened.apply(scene, params);
        DirectorView.addView("Scene", scene);
    
        if(this._curScene){
            this._curScene.onClosed && this._curScene.onClosed();
            this._curScene.destroy();
        }
        this._curScene = scene;
    },

    runScene (url, params, obj) {
        if (!obj) {throw `Can not find "Scene":${url}`;}
        if (!obj.props) {throw `"Scene" data is error:${url}`;}
        
        var runtime = obj.props.runtime ? obj.props.runtime : obj.type;
        var clas = Laya.ClassUtils.getClass(runtime);
        this.sceneClassMap[url] = clas;

        DirectorView.createView(obj, clas, url, null, Laya.Handler.create(this, this.switchScene, [params]));
    }
}

export default SceneManager;