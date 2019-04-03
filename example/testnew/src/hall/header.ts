import { ui } from "../ui/layaMaxUI";
import Utils from "../libs/utils";
import { GAME_CMDS, IS_SHOW_SHARE_BUTTON, USER_LOGIN_STATUS } from "../define";
import SetUp from "../alert/setup";
import ShareRecords from "../alert/sharerecords";
import Tips from "../alert/tips";
import Common from "../alert/common";
import Gain from "../alert/gain";

let EVENT_CLICK = Laya.Event.CLICK;
let transferNumberToK = Utils.transferNumberToK;
class Header extends ui.views.Hall.HeaderUI {
    private ACTIONS:object = null;
    private shareAni:Laya.Skeleton = null;
    constructor () {
        super();
        console.log("Header constructor")
        this.init();
    }

    destroy () {
        Honor.io.unregister(this.ACTIONS);
        super.destroy();
    }

    init () {
        this.initEvent();
        this.initUI();
        this.registerActions();

        Honor.io.emit(GAME_CMDS.USE_INFO);
        Honor.io.emit(GAME_CMDS.USER_NAME);
        IS_SHOW_SHARE_BUTTON && Honor.io.emit(GAME_CMDS.SHARE_RECORD, {type : 1});
    }

    initEvent () {
        this.btnBack.on(EVENT_CLICK, null, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            GM.btnBackCall_out();
        });

        this.btnRecharge.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            Utils.recharge();
        });

        this.btnGain.on(EVENT_CLICK, this, function () {
            if(!Utils.checkLogin()){return;}

            Laya.SoundManager.playSound("sound/btn.mp3");
            Honor.io.emit(GAME_CMDS.USERDETAIL);
        });

        this.btnLogin.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            location.href = GM.userLoginUrl;
        });

        // 豆哥按钮绑定事件
        this.showGameScore.on(EVENT_CLICK, this, function(){
            if(window.GM && GM.isCall_out === 1 && GM.popBalanceShow_out){
                Laya.SoundManager.playSound("sound/btn.mp3");
                GM.popBalanceShow_out();
            }
        });

        this.btnHome.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            location.href = GM.backHomeUrl;
        });

        this.btnSetup.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            Honor.director.openDialog(SetUp);
        });

        this.btnShare.on(EVENT_CLICK, this, function () {
            if(!Honor.Utils.checkLogin()){return;}

            Laya.SoundManager.playSound("sound/btn.mp3");
            Honor.director.openDialog(ShareRecords);
        });
    }

    initUI () {
        if(!USER_LOGIN_STATUS){
            this.btnLogin.visible = true;
        }
        this.avatar.skin = Utils.getAvatar(GM.user_id);
        if (window.GM && GM.isCall_out === 1 && GM.isShowBtnBack_out && GM.btnBackCall_out) {
            this.btnBack.visible = true; // 显示返回按钮
        }

        if(GM.backHomeUrl != ""){
            this.btnHome.visible = true; // 显示主页按钮
        }

        this.shareAni = Utils.createSkeleton("res/load/btn_share");
        this.shareAni.scale(0.7, 0.7).pos(this.btnShare.width / 2, this.btnShare.height / 2).play("static", false);
        this.btnShare.addChild(this.shareAni);
        this.btnShare.visible = IS_SHOW_SHARE_BUTTON;
    }

    registerActions () {
        this.ACTIONS = {
            [GAME_CMDS.USE_INFO]    : this.updateUserScore,
            [GAME_CMDS.USERDETAIL]  : this.showGainDetails,
            [GAME_CMDS.CHARGEIN]    : this.exchangeTips,
            [GAME_CMDS.CHANGROUT]   : this.gainTips,
            [GAME_CMDS.USER_NAME]   : this.updateUserInfo,
            [GAME_CMDS.SHARE_RECORD] (data, code) {
                if(code != "000"){return;}

                if(data.length){
                    this.shareAni.play("ani", true);
                }else{
                    this.shareAni.play("static", false);
                }
            }
        };
        Honor.io.register(this.ACTIONS, this);
    }

    updateUserScore (data) {
        this.platformScore.text = transferNumberToK(data.platformAmount);
        this.gameScore.text = transferNumberToK(data.gameAmount);
    }

    exchangeTips (data) {
        Honor.director.popScene(Tips, ["为您成功带入游戏币！"], {
            onClosed () {
                if(data.promptMsg){
                    let config = {
                        name : "wlt_prompt",
                        msg : data.promptMsg.content,
                        type : 1,
                        onConfirm (selected) {
                            Honor.io.emit(GAME_CMDS.UPDATAPROMPT, {rpcId : selected ? 1 : 0});
                        }
                    }
                    Honor.director.openDialog(Common, [config]);
                }
            }
        });
        this.platformScore.text = transferNumberToK(data.platformAmount);
        this.gameScore.text = transferNumberToK(data.gameAmount);
    }

    gainTips (data) {
        Honor.director.openDialog(Tips, ["为您成功收获游戏币！"]);
        this.platformScore.text = transferNumberToK(data.platformAmount);
        this.gameScore.text = transferNumberToK(data.gameAmount);
    }

    showGainDetails (data) {
        Honor.director.openDialog(Gain, [data]);
    }

    updateUserInfo (data) {
        this.userInfo.visible = true;

        this.userName.text = Utils.cutStr(data.userName, 12);
        this.userID.text = `ID:${GM.user_id}`;
        if(data.avater){
            Laya.loader.load(data.avater, Laya.Handler.create(this, function (skin, texture) {
                if(texture){
                    this.avatar.skin = skin;
                }else{
                    this.avatar.skin = Utils.getAvatar(GM.user_id);
                }
            }, [data.avater]))
        }else{
            this.avatar.skin = Utils.getAvatar(GM.user_id);
        }
    }

    enter () {
        Laya.Tween.from(this, {y : -100}, 200);
    }
}

export default Header;