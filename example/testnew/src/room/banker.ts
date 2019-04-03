import { ui } from "../ui/layaMaxUI";
import CardSet from "./card";
import { GAME_CMDS } from "../define";
import Tips from "../alert/tips";
import OperateSetup from "../alert/operatesetup";
import OperateList from "../alert/operatelist";
import Utils from "../libs/utils";

let EVENT_CLICK = Laya.Event.CLICK;
let OPERATE_MAP = {
    operate : "res/room/btn_operate.png",
    dequeue : "res/room/btn_dequeue.png",
    quit : "res/room/btn_quit.png",
};
let ACTIONS = {
    [GAME_CMDS.BANKER_LIST] (data) {
        Honor.director.openDialog(OperateList, [data]);
    },
    [GAME_CMDS.GET_ROOM_INFO] (data) {
        if(data.bankerId){
            this.update(data);
        }
    },
    [GAME_CMDS.BANKER_UP_INIT] (data) {
        Honor.director.openDialog(OperateSetup, [data]);
    },
    [GAME_CMDS.BANKER_UP] (data, code, msg) {
        Honor.director.closeDialogByName("operate_setup");
        if(code != "000"){
            Honor.director.openDialog(Tips, [msg]);
        }
        if(code == "316"){
            this.btnOperate.skin = OPERATE_MAP["dequeue"];
        }
    },
    [GAME_CMDS.BANKER_DOWN_ROOM] (data) {
        this.userScore.text = "--";
        this.userName.text = "虚位以待";
        this.avatar.skin = "res/avatar/default_avatar.png";
        
        this.bankerName = null;
        this.bankerAvatar = null;

        if(data.bankerId == GM.user_id){
            this.btnOperate.skin = OPERATE_MAP["operate"];
        }

        this.card.reset();
    },
    [GAME_CMDS.OUT_BANKER_LIST] (data) {
        this.btnOperate.skin = OPERATE_MAP["operate"];
        Honor.director.openDialog(Tips, ["已退出操盘队列"]);
    },
    [GAME_CMDS.ROUND_OVER] (data) {
        this.dealer(data);
    },
    [GAME_CMDS.ROUND_START] (data) {
        this.update(data);
    }
}
class Banker extends ui.views.Room.BankerUI {
    private bankerName:string = null;
    private bankerAvatar:string = null;
    private card:CardSet = null;
    constructor () {
        super();

        this.init();
    }

    destroy () {
        super.destroy();

        this.bankerName = null;
        this.bankerAvatar = null;
        this.card = null;

        Honor.io.unregister(ACTIONS);
    }

    init () {
        this.x = 295;

        this.card = new CardSet;
        this.card.centerX = 3;
        this.card.y = 126;
        this.addChild(this.card);

        this.btnOperateList.on(EVENT_CLICK, this, function () {
            Honor.io.emit(GAME_CMDS.BANKER_LIST);
        });

        this.btnOperate.on(EVENT_CLICK, this.btnOperate, this.onBtnOperateClicked);

        Honor.io.register(ACTIONS, this);
    }

    onBtnOperateClicked () {
        Laya.SoundManager.playSound("sound/btn.mp3");
        switch (this['skin']) {
            case OPERATE_MAP["operate"]:
                Honor.io.emit(GAME_CMDS.BANKER_UP_INIT);
                break;
            case OPERATE_MAP["dequeue"]:
                Honor.io.emit(GAME_CMDS.OUT_BANKER_LIST);
                break;
            case OPERATE_MAP["quit"]:
                // let config = {
                //     msg : "是否要退出操盘？",
                //     btn : ["cancel", "confirm"],
                //     onConfirm () {
                        Honor.io.emit(GAME_CMDS.BANKER_DOWN_USER);
                //     }
                // };
                // Honor.director.popScene(new Alert.Public(config));
                break;
        }
    }

    update (data) {
        this.userScore.text = data.gameAmount;
        (this.bankerName != data.bankerName) && (this.userName.text = Utils.cutStr(data.bankerName, 8));
        if(this.bankerAvatar !== data.bankerAvater){
            if(data.bankerAvater){
                Laya.loader.load(data.bankerAvater, Laya.Handler.create(this, function (skin, texture) {
                    if(texture){
                        this.avatar.skin = skin;
                    }else{
                        this.avatar.skin = Utils.getAvatar(data.bankerId);
                    }
                }, [data.bankerAvater]))
            }else{
                this.avatar.skin = Utils.getAvatar(data.bankerId);
            }
        }

        if(data.bankerId == GM.user_id){
            this.btnOperate.skin = OPERATE_MAP["quit"];
        }

        if(data.inBankerList == 1){
            this.btnOperate.skin = OPERATE_MAP["dequeue"];
        }

        // this.bankerId = data.bankerId;
        this.bankerName = data.bankerName;
        this.bankerAvatar = data.bankerAvater;

        this.card.reset();
    }

    dealer (data) {
        this.card.dealer(data.cardInfo.zhuangCard);
        Laya.timer.once(600 + 5000, this.card, this.card.turn);
    }

    publishPos () {
        this.callLater(function () {
            Honor.io.publish("banker.pos", this.avatar.localToGlobal({x : this.avatar.width / 2, y : this.avatar.height / 2}, true));
        });
    }

    enter () {
        this.publishPos();
    }

    resize () {
        this.publishPos();
    }
}

export default Banker;