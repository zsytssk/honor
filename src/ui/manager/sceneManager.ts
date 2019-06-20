import { HonorScene } from '../directorView';
import { SceneCtor } from './loaderManager';
import { loaderManager, directorView } from '../../state';

export type SceneChangeListener = (
    cur1: string,
    cur2: string,
) => boolean | void;
export type SceneChangeData = { cur: string; prev: string };
export type SceneClassMap = { [key: string]: HonorScene };

export class SceneManagerCtor {
    public sceneChangeBeforeListener = [] as SceneChangeListener[];
    public sceneChangeAfterListener = [] as SceneChangeListener[];
    public sceneClassMap: SceneClassMap = {};
    private cur_scene: HonorScene;

    public onResize(width, height) {
        if (this.cur_scene) {
            this.cur_scene.size(width, height);
            if (this.cur_scene.onResize) {
                this.cur_scene.onResize(width, height);
            }
        }
    }

    public getCurScene() {
        return this.cur_scene;
    }

    public switchScene(params: any[], scene: HonorScene): SceneChangeData {
        const { width, height } = Laya.stage;
        scene.size(width, height);
        if (scene.onMounted) {
            scene.onMounted.apply(scene, params);
        }
        directorView.addView('Scene', scene);
        const old_scene = this.cur_scene;
        const prev = old_scene ? old_scene.url : null;
        if (old_scene) {
            if (old_scene.onClosed) {
                old_scene.onClosed();
            }
            old_scene.destroy();
        }
        this.cur_scene = scene;
        const cur = scene.url;
        return {
            cur,
            prev,
        };
    }
    private callChangeListener(
        type: 'after' | 'before',
        ...params: string[]
    ): boolean {
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
    }
    /** 运行场景 */
    public runScene(url, ...params): Promise<Laya.Scene> {
        return new Promise(async (resolve, reject) => {
            /** 场景切换前执行, 如果被截取 就不进入场景 */
            const before_handle = this.callChangeListener(
                'before',
                this.cur_scene && this.cur_scene.url,
                url,
            );
            if (before_handle) {
                return reject(
                    `has callChangeListener interrupt open:> ${url} `,
                );
            }

            let scene = directorView.getViewByPool(url);
            let change_data: { cur: string; prev: string };
            if (scene) {
                change_data = this.switchScene(params, scene);
            } else if (typeof url === 'string') {
                const ctor = await loaderManager.loadScene('Scene', url);
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
    }

    private runSceneByCtor(url, obj) {
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

            directorView.createView(obj, ctor, url).then(scene => {
                resolve(scene);
            });
        });
    }
}
