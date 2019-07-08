import { loaderManager } from '../state';
import { resolve } from 'url';

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
    onResize(width: number, height: number): void;
    onMounted(...param: any[]): void;
}
export type ViewType = 'Scene' | 'Dialog' | 'Alert';
const LOAD_VIEW_MAP = {
    Scene: null,
    Dialog: null,
};
const POOL = {};

export class DirectorViewCtor {
    constructor() {
        for (const name of VIEW_MAP) {
            const view = new Laya.Sprite();
            view.name = `_$${name}`;
            this[view.name] = view;
            console.log(name);

            Laya.stage.addChild(view);
        }
    }

    public onResize(width, height) {
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
    }

    public recoverView(view) {
        const key = view.url || view.constructor.name;
        if (!POOL[key]) {
            POOL[key] = [];
        }
        POOL[key].push(view);
    }

    public getViewByPool(url) {
        if (POOL[url]) {
            return POOL[url].pop();
        }
        return null;
    }
    /** 通过 view 的 ui 数据创建 view  */
    public createView(data, ctor, url: string, params?: any[]) {
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
            if (!scene) {
                throw new Error(`Can not find Scene:${url}`);
            } else {
                throw new Error(
                    `Scene:${url} is not instance of Laya.Scene | Laya.Dialog, maybe is set wrong runtime`,
                );
            }
        });
    }

    public setLoadView(type: ViewType, url: string) {
        return new Promise((resolve, reject) => {
            loaderManager.loadScene(null, url, obj => {
                this.createLoadViewByData(type, url, obj).then(() => {
                    resolve();
                });
            });
        });
    }

    private createLoadViewByData(type, url, obj) {
        if (!obj) {
            throw new Error(`Can not find "Scene":${url}`);
        }
        if (!obj.props) {
            throw new Error(`"Scene" data is error:${url}`);
        }

        const runtime = obj.props.runtime ? obj.props.runtime : obj.type;
        const ctor = Laya.ClassUtils.getClass(runtime);

        return this.createView(obj, ctor, url).then(view => {
            this.createLoadViewByClass(type, view);
        });
    }

    private createLoadViewByClass(loadType, view) {
        const { width, height } = Laya.stage;
        view.size(width, height);
        if (view.onReset) {
            view.onReset();
        }
        this.addView('Load', view);
        LOAD_VIEW_MAP[loadType] = view;
    }

    public setLoadViewVisible(type: ViewType, visible: boolean) {
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
    }

    public setLoadProgress(type, val) {
        const view = LOAD_VIEW_MAP[type];
        if (view && view.onProgress) {
            view.onProgress(val);
        }
    }

    public getView(type) {
        return this[`_$${type}Manager`];
    }

    public setViewVisible(type, visible) {
        this[`_$${type}Manager`].visible = visible;
    }

    public addView(type, view) {
        this[`_$${type}Manager`].addChild(view);
    }

    public addViewAt(type, view, index) {
        this[`_$${type}Manager`].addChildAt(view, index);
    }
}
