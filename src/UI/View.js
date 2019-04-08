import LoaderManager from "./Manager/Loader";

const VIEW_MAP = ["SceneManager", "DialogManager", "LoadManager", "AlertManager"];
const LOAD_VIEW_MAP = {
    "Scene" : null,
    "Dialog" : null,
};
const POOL = {};

const DirectorView = {
    __init__ () {
        for(let name of VIEW_MAP){
            let view = new Laya.Sprite;
            view.name = `_$${name}`;
            this[view.name] = view;
            console.log(name);
            
            Laya.stage.addChild(view);
        }

        Laya.stage.on(Laya.Event.RESIZE, this, this._onResize);
        this._onResize();
    },

    _onResize (width, height) {
        for(let name of VIEW_MAP){
            this[`_$${name}`].size(width, height);
        }

        for(let i in LOAD_VIEW_MAP){
            let view = LOAD_VIEW_MAP[i];
            if(view){
                view.size(width, height);
                view.onResize && view.onResize(width, height);
            }
        }
    },

    _createLoadViewByClass (loadType, callback, view) {
        const {width, height} = Laya.stage;
        view.size(width, height);
        view.onReset && view.onReset();
        this.addView("Load", view);
        LOAD_VIEW_MAP[loadType] = view;
        callback && callback.run();
    },

    _createLoadViewByData (type, url, callback, obj) {
        if (!obj) {throw `Can not find "Scene":${url}`;}
        if (!obj.props) {throw `"Scene" data is error:${url}`;}
        
        var runtime = obj.props.runtime ? obj.props.runtime : obj.type;
        var clas = Laya.ClassUtils.getClass(runtime);

        this.createView(obj, clas, url, null, Laya.Handler.create(this, this._createLoadViewByClass, [type, callback]));
    },

    recoverView (view) {
        const key = view.url || view.constructor.name;
        if(!POOL[key]){
            POOL[key] = [];
        }
        POOL[key].push(view);
    },

    getViewByPool (url) {
        if(POOL[url]){
            return POOL[url].pop();
        }
        return null;
    },

    createView (data, clas, url, params, complete) {
        var scene = new clas();
        // var scene = params ? new clas(...params) : new clas();
        params && scene.onMounted && scene.onMounted.apply(scene, params);

        if (data.props.renderType == "instance"){
            scene = clas.instance || (clas.instance = scene);
        }
        if (scene && (scene instanceof laya.display.Node )){
            scene.url = url;
            if (!scene._getBit(/*laya.Const.NOT_READY*/0x08)){
                complete && complete.runWith(scene);
            }else {
                scene.on("onViewCreated", null, function(){
                    complete && complete.runWith(scene)
                })
                scene.createView(data);
            }
        }else {
            throw `Can not find "Scene":${runtime}`;
        }
    },

    setLoadView (type, url, callback) {
        // LoaderManager.load(null, url, Laya.Handler.create(this, (type, url, callback, obj) => {
        //     console.log(`${type} view loaded`);
        //     this._createLoadViewByData(type, url, obj, callback);
        // }, [type, url, callback]));
        LoaderManager.load(null, url, Laya.Handler.create(this, this._createLoadViewByData, [type, url, callback]));
        // switch(typeof url){
		// 	case "function":
        //         let view = new url;
        //         view.once("onViewCreated", this, this._createLoadViewByClass, [type]);
		// 		break;
		// 	case "string":
        //         LoaderManager.load(null, url, Laya.Handler.create(this, this._createLoadViewByData, [type, url]));
		// 		break;
		// }
    },

    setLoadViewVisible (type, visible) {
        let view = LOAD_VIEW_MAP[type];
        if(view && !view.destroyed){
            view.visible = visible;
            if(visible){
                view.onShow && view.onShow();
            }else{
                view.onReset && view.onReset();
            }
        }
    },

    setLoadProgress (type, val) {
        let view = LOAD_VIEW_MAP[type];
        view && view.onProgress && view.onProgress(val);
    },

    getView (type) {
        return this[`_$${type}Manager`];
    },

    setViewVisible (type, visible) {
        this[`_$${type}Manager`].visible = visible;
    },

    addView (type, view) {
        this[`_$${type}Manager`].addChild(view);
    },

    addViewAt(type, view, index) {
        this[`_$${type}Manager`].addChildAt(view, index);
    }
}

export default DirectorView;