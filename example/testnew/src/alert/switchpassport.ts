import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS, USER_SOURCE_DESCRIPTION } from "../define";

let EVENT_CLICK = Laya.Event.CLICK;
let SOUND_STATUS = GM.muteAudio.getMuteState(); //默认返回为false，在未登录的时候使用

class SwitchPassPort extends ui.views.Alert.SwitchPassPortUI {
    constructor () {
        super();

        this.initEvent();
        this.update();
    }

    initEvent () {
        this.btnConfirm.on(EVENT_CLICK, this, function () {
            Honor.io.emit(GAME_CMDS.USER_LOGOUT, null, "ajax", "get");
        })
    }

    update () {
        let userSource = "";
        if(USER_SOURCE_DESCRIPTION){
            userSource = `（${USER_SOURCE_DESCRIPTION}）`;
        }
        
        this.userId.text = `当前账号：${GM.user_id}`;
        this.userSource.text = userSource;
    }
}

export default SwitchPassPort;