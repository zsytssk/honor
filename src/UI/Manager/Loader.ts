import { ViewType, DirectorView } from '../View';
import { loadRes, ResItem } from '../../Utils/load';

export type SceneCtor = typeof Laya.Scene | Laya.Dialog;
type LoadSceneCompleteFn = (scene: SceneCtor) => void;
const state = {
    is_loading: false,
};
export const LoaderManager = {
    __init__() {},
    loadScene(type: ViewType, url: string, complete_fn: LoadSceneCompleteFn) {
        const sceneData = Laya.Loader.getRes(url);
        if (sceneData) {
            return complete_fn(sceneData);
        }
        this.toggleLoading(type, true);

        Laya.loader.resetProgress();
        const loader = new Laya.SceneLoader();
        loader.on(Laya.Event.PROGRESS, this, this.onLoadProgress, [type]);
        loader.once(Laya.Event.COMPLETE, this, this.onLoadComplete, [
            type,
            url,
            loader,
            complete_fn,
        ]);
        loader.load(url);
    },
    load(res: ResItem[] | string[], type?: ViewType) {
        return new Promise(async (resolve, reject) => {
            this.toggleLoading(type, true);

            let load_progress_fn;
            if (type) {
                load_progress_fn = (val: number) => {
                    DirectorView.setLoadProgress(type, val);
                };
            }
            state.is_loading = true;
            await loadRes(res, load_progress_fn);

            /** 如果显示loading, 最少显示500ms */
            this.toggleLoading(type, false);
            state.is_loading = false;
            return resolve();
        });
    },

    onLoadProgress(type: ViewType, val: number) {
        if (type) {
            DirectorView.setLoadProgress(type, val);
        }
    },

    onLoadComplete(
        type: ViewType,
        url: string,
        loader: Laya.SceneLoader,
        complete_fn: LoadSceneCompleteFn
    ) {
        loader.off(Laya.Event.PROGRESS, null, this.onLoadProgress);
        const obj = Laya.Loader.getRes(url);

        complete_fn(obj);
        if (type) {
            this.toggleLoading(type, false);
        }
    },
    toggleLoading(type: ViewType, status: boolean) {
        if (!type) {
            return;
        }
        let time = 0;
        if (status === false) {
            time = 500;
        }
        clearTimeout(this[`${type}_timeout`]);
        this[`${type}_timeout`] = setTimeout(() => {
            DirectorView.setLoadViewVisible(type, status);
        }, time);
    },
};
