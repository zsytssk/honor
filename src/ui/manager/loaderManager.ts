import { ViewType } from '../directorView';
import { loadRes, ResItem } from '../../utils/loadRes';
import { directorView } from '../../state';
import { tmpAsyncTask } from '../../utils/tmpAsyncTask';

export type SceneCtor = typeof Laya.Scene | Laya.Dialog;
type TmpTask = {
    [key: string]: Array<Promise<any>>;
};
export class LoaderManagerCtor {
    private scene_loader: Laya.SceneLoader;
    private tmp_task: TmpTask = {};
    constructor() {
        this.scene_loader = new Laya.SceneLoader();
    }
    /** 等待所有的加载任务都完成才关闭加载页面... */
    private tmpLoadTask(type: ViewType, async_task: Promise<any>) {
        let task_list = this.tmp_task[type];
        if (!task_list) {
            task_list = [];
            this.tmp_task[type] = task_list;
        }

        if (type) {
            clearTimeout(this[`${type}_timeout`]);
            directorView.setLoadViewVisible(type, true);
        }
        tmpAsyncTask(task_list, async_task).then(remain_num => {
            if (type && remain_num === 0) {
                /* 500ms 后关闭loading*/
                this[`${type}_timeout`] = setTimeout(() => {
                    directorView.setLoadViewVisible(type, false);
                }, 500);
            }
        });
    }
    public async loadScene(type: ViewType, url: string) {
        const { scene_loader } = this;
        const sceneData = Laya.Loader.getRes(url);
        if (sceneData) {
            return sceneData;
        }

        // @todo 这个代码可能要删除
        Laya.loader.resetProgress();
        const load_task = new Promise((_resolve, _reject) => {
            scene_loader.on(Laya.Event.PROGRESS, this, this.onLoadProgress, [
                type,
            ]);
            scene_loader.once(Laya.Event.COMPLETE, this, () => {
                scene_loader.off(
                    Laya.Event.PROGRESS,
                    null,
                    this.onLoadProgress
                );
                const obj = Laya.Loader.getRes(url);
                _resolve(obj);
            });
            scene_loader.load(url);
        });
        this.tmpLoadTask(type, load_task);

        return await load_task;
    }
    public load(
        res: ResItem[] | string[],
        type?: ViewType,
        after_close?: Promise<any>
    ) {
        const load_task = new Promise(async (resolve, reject) => {
            let load_progress_fn;
            if (type) {
                load_progress_fn = (val: number) => {
                    this.onLoadProgress(type, val);
                };
            }
            await loadRes(res, load_progress_fn);

            /** 如果显示loading, 最少显示500ms */
            if (after_close) {
                await after_close;
            }
            return resolve();
        });
        this.tmpLoadTask(type, load_task);
        return load_task;
    }

    private onLoadProgress(type: ViewType, val: number) {
        if (type) {
            directorView.setLoadProgress(type, val);
        }
    }
}
