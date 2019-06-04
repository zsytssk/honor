import { HonorScene, DirectorView } from '../View';
import { SceneCtor, LoaderManager } from './Loader';

export type SceneChangeListener = (
    cur1: string,
    cur2: string
) => boolean | void;
export type SceneChangeData = { cur: string; prev: string };
export const SceneManager = {
    sceneChangeBeforeListener: [] as SceneChangeListener[],
    sceneChangeAfterListener: [] as SceneChangeListener[],
    sceneClassMap: {},
    _curScene: null,
    __init__() {},

    onResize(width, height) {
        if (this._curScene) {
            this._curScene.size(width, height);
            if (this._curScene.onResize) {
                this._curScene.onResize(width, height);
            }
        }
    },

    switchScene(params: any[], scene: HonorScene): SceneChangeData {
        const { width, height } = Laya.stage;
        scene.size(width, height);
        if (scene.onMounted) {
            scene.onMounted.apply(scene, params);
        }
        DirectorView.addView('Scene', scene);
        const old_scene = this._curScene;
        const prev = old_scene ? old_scene.url : null;
        if (old_scene) {
            if (old_scene.onClosed) {
                old_scene.onClosed();
            }
            old_scene.destroy();
        }
        this._curScene = scene;
        const cur = scene.url;
        return {
            cur,
            prev,
        };
    },
    callChangeListener(type: 'after' | 'before', ...params: string[]): boolean {
        let listener;
        if (type === 'before') {
            listener = this.sceneChangeBeforeListener;
        } else if (type === 'after') {
            listener = this.sceneChangeAfterListener;
        }

        for (const fn of listener) {
            const result = fn(...params);
            if (result) {
                return result;
            }
        }
    },
    /** 运行场景 */
    runScene(url, ...params): Promise<Laya.Scene> {
        return new Promise(async (resolve, reject) => {
            /** 场景切换前执行, 如果被截取 就不进入场景 */
            const before_handle = this.callChangeListener(
                'before',
                this._curScene && this._curScene.url,
                url
            );
            if (before_handle) {
                return reject();
            }

            let scene = DirectorView.getViewByPool(url);
            let change_data: { cur: string; prev: string };
            if (scene) {
                change_data = this.switchScene(params, scene);
            } else if (typeof url === 'string') {
                const ctor = await new Promise((_resolve, _reject) => {
                    LoaderManager.loadScene(
                        'Scene',
                        url,
                        (_ctor: SceneCtor) => {
                            _resolve(_ctor);
                        }
                    );
                });
                scene = await this.runSceneByCtor(url, ctor);
                change_data = this.switchScene(params, scene);
            } else if (typeof url === 'function') {
                scene = new url();
                await new Promise((resolve, reject) => {
                    scene.once('onViewCreated', this, () => {
                        return resolve();
                    });
                });
                change_data = this.switchScene(params, scene);
            }

            this.callChangeListener('after', change_data.cur, change_data.prev);
            return resolve(scene);
        });
    },

    runSceneByCtor(url, obj) {
        return new Promise((resolve, reject) => {
            if (!obj) {
                throw new Error(`Can not find "Scene":${url}`);
            }
            if (!obj.props) {
                throw new Error(`"Scene" data is error:${url}`);
            }

            const runtime = obj.props.runtime ? obj.props.runtime : obj.type;
            const ctor = Laya.ClassUtils.getClass(runtime);
            this.sceneClassMap[url] = ctor;

            DirectorView.createView(obj, ctor, url).then(scene => {
                resolve(scene);
            });
        });
    },
};

export default SceneManager;
