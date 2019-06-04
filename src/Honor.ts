import { Director } from './UI/Director';
import { LoaderManager } from './UI/Manager/Loader';
import * as sceneChangeMonitor from './Utils/sceneChangeMonitor';
import { initState } from './state';
import { DirectorView } from './UI/View';

const name = 'Honor';
const version = '0.0.1-beta';
const load = (...params: [any, any?]) => {
    return LoaderManager.load(...params);
};
let DEBUG_MODE = false;

declare global {
    interface Window {
        Laya3D: any;
    }
}

/** 运行游戏
 * @param GameConfig 是Laya自动生成的游戏配置 src/GameConfig
 * @param callback 游戏运行完成之后执行函数
 */
function run(GameConfig, callback) {
    if (!callback) {
        console.error('需要引擎启动以后的回调函数，用来启动起始页等');
        return;
    }
    if (!Laya.View) {
        console.error('需要laya.ui库');
        return;
    }
    // 根据IDE设置初始化引擎
    if (window.Laya3D) {
        Laya3D.init(GameConfig.width, GameConfig.height);
    } else {
        Laya.init(GameConfig.width, GameConfig.height, Laya.WebGL);
    }
    if (Laya.Physics) {
        Laya.Physics.enable();
    }
    if ((Laya as any).DebugPanel) {
        (Laya as any).DebugPanel.enable();
    }
    Laya.stage.scaleMode = GameConfig.scaleMode;
    Laya.stage.screenMode = GameConfig.screenMode;
    Laya.stage.alignV = GameConfig.alignV;
    Laya.stage.alignH = GameConfig.alignH;
    // 兼容微信不支持加载scene后缀场景
    Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    // 打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    if (GameConfig.debug || Laya.Utils.getQueryString('debug') == 'true') {
        DEBUG_MODE = true;
        Laya.enableDebugPanel();
    } else {
        DEBUG_MODE = false;
    }
    if (GameConfig.physicsDebug && Laya.PhysicsDebugDraw) {
        Laya.PhysicsDebugDraw.enable();
    }
    // if (GameConfig.stat) Laya.Stat.show();
    Laya.alertGlobalError = false;

    // 激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    Laya.AtlasInfoManager.enable(
        'fileconfig.json',
        Laya.Handler.create(null, () => {
            initState();
            callback();
        })
    );
}
export const Honor = {
    name,
    version,
    run,
    director: Director,
    load,
    sceneChangeMonitor,
    DEBUG_MODE,
};

export {
    name,
    version,
    run,
    Director as director,
    load,
    sceneChangeMonitor,
    DEBUG_MODE,
};
