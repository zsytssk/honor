import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS, IS_SHOW_SHARE_BUTTON } from "../define";
import PlayerList from "../alert/playerlist";
import Utils from "../libs/utils";
import Trend from "../alert/trend";
import SetUp from "../alert/setup";
import Chat from "../alert/chat";
import ShareRecords from "../alert/sharerecords";

let EVENT_CLICK = Laya.Event.CLICK;
let ACTIONS = {
    [GAME_CMDS.PLAYLIST] (data) {
        Honor.director.openDialog(PlayerList, [data]);
    },
    [GAME_CMDS.SHARE_RECORD] (data, code) {
        if(code != "000"){return;}

        if(data.length){
            this.shareAni.play("ani", true);
        }else{
            this.shareAni.play("static", false);
        }
    },
    [GAME_CMDS.ROUND_OVER] (data, code) {
        if(data.settlement && data.settlement.myResult) {
            let myResult = data.settlement.myResult;

            if(myResult.shareCode){
                this.shareAni.play("ani", true);
            }else{
                this.shareAni.play("static", false);
            }
        }
    }
}

class Table extends ui.views.Room.TableUI {
    private shareAni:Laya.Skeleton = null;
    constructor () {
        super();
        
        this.init();
    }

    destroy () {
        Honor.io.unregister(ACTIONS);
    }

    init () {
        this.height = Laya.stage.height;

        this.initEvent();
        
        this.shareAni = Utils.createSkeleton("res/load/btn_share");
        this.shareAni.scale(0.7, 0.7).pos(this.btnShare.width / 2, this.btnShare.height / 2).play("static", false);
        this.btnShare.addChild(this.shareAni);
        this.btnShare.visible = IS_SHOW_SHARE_BUTTON;

        Honor.io.register(ACTIONS, this);
        IS_SHOW_SHARE_BUTTON && Honor.io.emit(GAME_CMDS.SHARE_RECORD, {type : 1});
    }

    initEvent () {
        this.btnBack.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            Honor.io.emit(GAME_CMDS.OUT_ROOM);
        });
        this.btnTrend.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            Honor.director.openDialog(Trend);
        });
        this.btnSetup.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            Honor.director.openDialog(SetUp);
        });
        this.btnChat.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            Honor.director.openDialog(Chat);
        });
        this.btnShare.on(EVENT_CLICK, this, function () {
            if(!Utils.checkLogin()){return;}
            
            Laya.SoundManager.playSound("sound/btn.mp3");
            Honor.director.openDialog(ShareRecords);
        });
        // this.btnPlayerList.on(EVENT_CLICK, this, function () {
        //     Laya.SoundManager.playSound("sound/btn.mp3");
        //     Honor.io.emit(GAME_CMDS.PLAYLIST);
        // });
    }

    publishPos () {
        this.callLater(function () {
            Honor.io.publish("plays.pos", this.btnPlayerList.localToGlobal({x : this.btnPlayerList.width / 2, y : this.btnPlayerList.height / 2}, true));
        });
    }

    enter () {
        this.publishPos();
    }
    resize (width, height, rate) {
        this.height = height;

        if(rate <= 1){
            this.bankerBorder.scale(rate, rate);
            this.btnBack.scale(rate, rate);
            this.btnTrend.scale(rate, rate);
            this.btnSetup.scale(rate, rate);
            this.btnChat.scale(rate, rate);
            this.btnPlayerList.scale(rate, rate);
        }else{
            this.bankerBorder.scale(1, 1);
            this.btnBack.scale(1, 1);
            this.btnTrend.scale(1, 1);
            this.btnSetup.scale(1, 1);
            this.btnChat.scale(1, 1);
            this.btnPlayerList.scale(1, 1);
        }
        this.publishPos();
    }
}

export default Table;