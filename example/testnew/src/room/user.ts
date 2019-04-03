import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS, USER_AVATAR, TBNN_USER_NAME } from "../define";
import Utils from "../libs/utils";

let ACTIONS = {
    [GAME_CMDS.GET_ROOM_INFO] (data) {
        let baseInfo = data.baseInfo;
        if(baseInfo){
            if(baseInfo.avater){
                Laya.loader.load(baseInfo.avater, Laya.Handler.create(this, function (skin, texture) {
                    if(texture){
                        this.avatar.skin = skin;
                    }else{
                        this.avatar.skin = Utils.getAvatar(GM.user_id);
                    }
                }, [baseInfo.avater]))
                USER_AVATAR = baseInfo.avater;
            }else{
                this.avatar.skin = Utils.getAvatar(GM.user_id);
            }
        }
        this.userName.text = Utils.cutStr(baseInfo.userName, 8);
        TBNN_USER_NAME = baseInfo.userName;
    },
    [GAME_CMDS.USE_INFO] (data) {
        this.userScore.text = data.gameAmount;
    },
    [GAME_CMDS.BET_CALL] (data) {
        this.userScore.text = data.leftAmount;
    }
}
class User extends ui.views.Room.UserUI {
    constructor () {
        super();
        
        this.init();
    }

    destroy () {
        Honor.io.unregister(ACTIONS);
    }

    init () {
        this.y = 50;

        this.btnRecharge.on(Laya.Event.CLICK, this, function () {
            // Honor.director.popScene(new Alert.Recharge);
            Utils.recharge();
        });

        Honor.io.register(ACTIONS, this);
        Honor.io.emit(GAME_CMDS.USE_INFO, {type : "game"});
    }

    publishPos () {
        this.callLater(function () {
            Honor.io.publish("user.pos", this.avatar.localToGlobal({x : this.avatar.width / 2, y : this.avatar.height / 2}, true));
        });
    }

    enter () {
        this.publishPos();
    }

    resize () {
        this.publishPos();
    }
}

export default User;