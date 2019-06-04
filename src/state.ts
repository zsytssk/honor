import { DialogManager as DialogManagerCtor } from './UI/Manager/Dialog';
import { DirectorView } from './UI/View';
import { SceneManager } from './UI/Manager/Scene';
import { LoaderManager } from './UI/Manager/Loader';
import { Director } from './UI/Director';

export let DialogManager: DialogManagerCtor;

/** 一切初始化+全局变量都在这里 */
export function initState() {
    DirectorView.init();
    SceneManager.__init__();
    LoaderManager.__init__();
    DialogManager = new DialogManagerCtor();
    DialogManager.init();
    Director.init();
}
