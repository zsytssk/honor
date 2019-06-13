import { DialogManagerCtor } from './ui/manager/DialogManager';
import { DirectorViewCtor } from './ui/directorView';
import { SceneManagerCtor } from './ui/manager/SceneManager';
import { LoaderManagerCtor } from './ui/manager/LoaderManager';
import { DirectorCtor } from './ui/director';

export let dialogManager: DialogManagerCtor;
export let loaderManager: LoaderManagerCtor;
export let directorView: DirectorViewCtor;
export let sceneManager: SceneManagerCtor;
export let director = new DirectorCtor();

let init_resolve: () => void;
let is_init = false;
/** 等到所有的组件都初始化之后 resolve */
export function untilInit() {
    return new Promise((resolve, reject) => {
        if (is_init) {
            return resolve();
        }
        init_resolve = resolve;
    });
}
/** 一切初始化+全局变量都在这里 */
export function initState() {
    directorView = new DirectorViewCtor();
    sceneManager = new SceneManagerCtor();
    loaderManager = new LoaderManagerCtor();
    dialogManager = new DialogManagerCtor();
    director.init();

    if (init_resolve) {
        init_resolve();
        is_init = true;
        init_resolve = undefined;
    }
}
