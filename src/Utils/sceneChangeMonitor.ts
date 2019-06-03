import SceneManager, { SceneChangeListener } from '../UI/Manager/Scene';

export function onSceneChangeBefore(fn: SceneChangeListener) {
    SceneManager.sceneChangeBeforeListener.push(fn);
}
export function onSceneChangeAfter(fn: SceneChangeListener) {
    SceneManager.sceneChangeAfterListener.push(fn);
}

export function clearListener(fn: SceneChangeListener) {
    SceneManager.sceneChangeBeforeListener = SceneManager.sceneChangeBeforeListener.filter(item => {
        return item !== fn;
    });
    SceneManager.sceneChangeAfterListener = SceneManager.sceneChangeAfterListener.filter(item => {
        return item !== fn;
    });
}
