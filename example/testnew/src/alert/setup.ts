import { ui } from "../ui/layaMaxUI";
import { USER_LOGIN_STATUS } from "../define";
import Guide from "./guide";
import SwitchPassPort from "./switchpassport";

let EVENT_CLICK = Laya.Event.CLICK;
let SOUND_STATUS = GM.muteAudio.getMuteState(); //默认返回为false，在未登录的时候使用

class SetUp extends ui.views.Alert.SetUpUI {
    constructor () {
        super();
        
        this['CONFIG'] = {
            "popupCenter" : false,
            "closeOnSide" : true
        };

        this.init();
    }

    init () {
        this.right = 10;
        this.top = 120;
        this.anchorX = 0.8;

        this.initView();
        this.initEvent();
    }

    initView () {
        // Laya 系统公告, 默认是隐藏的
        if(window.GM && GM.isCall_out === 1 && GM.noticeStatus_out){
            GM.noticeStatus_out(function(data){
                data = data || {};
                // 是否显示系统公告
                if(data.isShowNotice){
                    // 显示系统公告按钮
                    this.btnNotice.disabled = false;
                }

                // 是否需要显示小红点
                if(data.isShowRedPoint){
                    this.noticeDot.visible = true;
                }
            }.bind(this));
        }

        let isMute = GM.userLogged ? GM.muteAudio.getMuteState() : SOUND_STATUS;
        
        if(isMute){
            this.soundStatus.index = 1;
        }else{
            this.soundStatus.index = 0;
        }

        if(window.GM && GM.isShowInvite){
            this.btnInvite.disabled = !GM.isShowInvite();
        }

        this.btnSwitch.disabled = !USER_LOGIN_STATUS;
    }

    initEvent () {
        this.btnSound.on(EVENT_CLICK, this, function () {
            let isMute = GM.userLogged ? GM.muteAudio.getMuteState() : SOUND_STATUS;
            
            if(isMute){
                this.soundStatus.index = 0;
                GM.muteAudio.setMuteState(false);
            }else{
                this.soundStatus.index = 1;
                GM.muteAudio.setMuteState(true);
            }
            
            Laya.SoundManager.muted = SOUND_STATUS = !isMute;
            Laya.SoundManager.playMusic("sound/bgm.mp3");
            Laya.SoundManager.playSound("sound/btn.mp3");
        });

        this.btnFaq.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            this.close();
            Honor.director.openDialog(Guide);
        });
        
        this.btnNotice.on(EVENT_CLICK, this, function () {
            this.close();
            Laya.SoundManager.playSound("sound/btn.mp3");
            if(window.GM && GM.noticePopShow_out){
                GM.noticePopShow_out();
            }
        });

        this.btnSwitch.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            this.close();
            Honor.director.openDialog(SwitchPassPort);
        });

        this.btnInvite.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            this.close();

            window.GM && GM.showInvitePop && GM.showInvitePop();
        });
    }
}

export default SetUp;