import { ui } from "../ui/layaMaxUI";
import Utils from "../libs/utils";
import Tips from "./tips";
import { GAME_CMDS, GAME_CONFIG } from "../define";

let EVENT_CLICK = Laya.Event.CLICK;

class SharePrize extends ui.views.Alert.SharePrizeUI {
    private shareContentText:string = null;
    private shareSubContentText:string = null;
    private shareCode:string = null;
    constructor (data) {
        super();

        this.shareContentText = `<span style="color:#faedc3;">恭喜瓜分</span><span style="color:#fff109;">${data.award_amount}</span><span style="color:#faedc3;">奖励</span>`;
        this.shareSubContentText = `<span style="color:#e0a400;">分享成功即可额外获得</span><span style="color:#ffe828;">${data.amount}</span><span style="color:#e0a400;">奖励</span>`;
        
        this.shareCode = data.share_code;
        
        this.initUI();
        this.initEvent();
    }

    initUI () {
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        
        this.shareContent.style.fontSize = 70;
        this.shareContent.style.align = "center";
        this.shareSubContent.style.fontSize = 30;
        this.shareSubContent.style.align = "center";

        this.shareContent.innerHTML = this.shareContentText;
        this.shareSubContent.innerHTML = this.shareSubContentText;

        let TITLE_ANI = Utils.createSkeleton("res/alert/share_prize/share_prize");
            TITLE_ANI.pos(382, 65).play(0, true);

        this.addChild(TITLE_ANI);


        if(window.WeixinJSBridge){
            this.sharePrizeCon.selectedIndex = 0;
        }else if((window.PAG_JS && PAG_JS.shareToWX) || (window.wltgame && wltgame.shareToWX)){
            this.sharePrizeCon.selectedIndex = 1;
        }else{
            this.sharePrizeCon.selectedIndex = 2;
            this.height = 635;
        }
    }

    initEvent () {
        this.btnShareInWX.on(EVENT_CLICK, this, function () {
            this.close();

            this.shareToFriend(-1);
            // Honor.io.emit(GAME_CMDS.SHARE_REWARD, {shareCode : this.shareCode, shareType : 3});
        });

        this.btnShareToWX.on(EVENT_CLICK, this, function () {
            this.close();
            this.shareToFriend(1);
        });

        this.btnShareToCircle.on(EVENT_CLICK, this, function () {
            this.close();
            this.shareToFriend(2);
        });
        this.btnShareToQQ.on(EVENT_CLICK, this, function () {
            this.close();
            this.shareToFriend(3);
        });
        this.btnShareToQZONE.on(EVENT_CLICK, this, function () {
            this.close();
            this.shareToFriend(4);
        });
        this.btnShareToWeibo.on(EVENT_CLICK, this, function () {
            this.close();
            this.shareToFriend(5);
        });

        this.canNotShare.on(EVENT_CLICK, this, this.onCanNotShareClicked);
        this.btnDownload.on(EVENT_CLICK, this, this.download);
        this.btnDownloadIOS.on(EVENT_CLICK, this, this.download, ["ios"]);
        this.btnDownloadAndroid.on(EVENT_CLICK, this, this.download, ["android"]);
    }

    download (platform, forceClose = true) {
        forceClose && this.close();

        switch (platform) {
            case "ios":
                Laya.Browser.onIOS && (location.href = "/?act=syplatform&st=syplatform_download");
                break;
            case "android":
                Laya.Browser.onAndroid && (location.href = "/?act=download");
                break;
            default:
                this.download(Laya.Browser.onIOS ? "ios" : "android", false);
        }
    }

    onCanNotShareClicked () {
        Honor.director.openDialog(Tips, ["分享功能只能在1768客户端中使用"], {
            onClosed : () => {
                if(Laya.Browser.onIOS){
                    this.download("ios");
                }else{
                    this.download("android");
                }
            }
        });
    }

    /**
     * 微信分享
     * @param {Number} type 分享类型，-1：在微信内分享，1：微信好友，2：微信朋友圈，3：QQ，4：QQ空间，5：微博
     */
    shareToFriend (type) {
        Honor.io.emit(GAME_CMDS.SHARE_REWARD, {shareCode : this.shareCode, shareType : type});
    }

    onOpened () {
        let rate = Laya.stage.height / GAME_CONFIG.HEIGHT;
        if(rate <= 1){
            this.scale(rate, rate);
        }else{
            this.scale(1, 1);
        }
    }
}

export default SharePrize;
/**
var data = {"amount":60,"award_amount":531,"share_code":"a014aa28e0bcba822aa9b8d33ede663a"};
Honor.director.popScene(new Alert.SharePrize(data))
 */