import { LoaderManager } from './Manager/Loader';

const VIEW_MAP = [
    'SceneManager',
    'DialogManager',
    'LoadManager',
    'AlertManager',
];

export interface HonorLoadScene {
    /** 关闭前调用 */
    onReset(): void;
    /** 打开调用 */
    onShow(): void;
    /** 设置进度 */
    onProgress(val: number): void;
}
export interface HonorScene extends Laya.Scene {
    onMounted(...param: any[]): void;
}
export type ViewType = 'Scene' | 'Dialog' | 'Alert';
const LOAD_VIEW_MAP = {
    Scene: null,
    Dialog: null,
};
const POOL = {};

export const DirectorView = {
    init() {
        for (const name of VIEW_MAP) {
            const view = new Laya.Sprite();
            view.name = `_$${name}`;
            this[view.name] = view;
            console.log(name);

            Laya.stage.addChild(view);
        }
    },

    onResize(width, height) {
        for (const name of VIEW_MAP) {
            this[`_$${name}`].size(width, height);
        }

        for (const load_type in LOAD_VIEW_MAP) {
            if (!LOAD_VIEW_MAP.hasOwnProperty(load_type)) {
                continue;
            }
            const view = LOAD_VIEW_MAP[load_type];
            if (view) {
                view.size(width, height);
                if (view.onResize) {
                    view.onResize(width, height);
                }
            }
        }
    },

    _createLoadViewByClass(loadType, callback, view) {
        const { width, height } = Laya.stage;
        view.size(width, height);
        if (view.onReset) {
            view.onReset();
        }
        this.addView('Load', view);
        LOAD_VIEW_MAP[loadType] = view;
        if (callback) {
            callback.run();
        }
    },

    _createLoadViewByData(type, url, callback, obj) {
        if (!obj) {
            throw new Error(`Can not find "Scene":${url}`);
        }
        if (!obj.props) {
            throw new Error(`"Scene" data is error:${url}`);
        }

        const runtime = obj.props.runtime ? obj.props.runtime : obj.type;
        const ctor = Laya.ClassUtils.getClass(runtime);

        this.createView(obj, ctor, url).then(view => {
            this._createLoadViewByClass(type, callback, view);
        });
    },

    recoverView(view) {
        const key = view.url || view.constructor.name;
        if (!POOL[key]) {
            POOL[key] = [];
        }
        POOL[key].push(view);
    },

    getViewByPool(url) {
        if (POOL[url]) {
            return POOL[url].pop();
        }
        return null;
    },
    /** 通过 view 的 ui 数据创建 view  */
    createView(data, ctor, url: string, params?: any[]) {
        return new Promise((resolve, reject) => {
            let scene = new ctor();
            if (params && scene.onMounted) {
                scene.onMounted.apply(scene, params);
            }

            if (data.props.renderType === 'instance') {
                scene = ctor.instance || (ctor.instance = scene);
            }
            if (
                scene &&
                (scene instanceof Laya.Scene || scene instanceof Laya.Dialog)
            ) {
                scene.url = url;
                if (!scene._getBit(/*laya.Const.NOT_READY*/ 0x08)) {
                    resolve(scene);
                } else {
                    scene.on('onViewCreated', null, () => {
                        resolve(scene);
                    });
                    scene.createView(data);
                }
                return;
            }
            throw new Error(`Can not find Scene:${url}`);
        });
    },

    setLoadView(type: ViewType, url: string, callback) {
        LoaderManager.loadScene(null, url, obj => {
            this._createLoadViewByData(type, url, callback, obj);
        });
    },

    setLoadViewVisible(type: ViewType, visible: boolean) {
        const view = LOAD_VIEW_MAP[type];
        if (view && !view.destroyed) {
            view.visible = visible;
            if (visible) {
                if (view.onShow) {
                    view.onShow();
                }
            } else {
                if (view.onReset) {
                    view.onReset();
                }
            }
        }
    },

    setLoadProgress(type, val) {
        const view = LOAD_VIEW_MAP[type];
        if (view && view.onProgress) {
            view.onProgress(val);
        }
    },

    getView(type) {
        return this[`_$${type}Manager`];
    },

    setViewVisible(type, visible) {
        this[`_$${type}Manager`].visible = visible;
    },

    addView(type, view) {
        this[`_$${type}Manager`].addChild(view);
    },

    addViewAt(type, view, index) {
        this[`_$${type}Manager`].addChildAt(view, index);
    },
};
