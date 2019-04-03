import Common from "../alert/common";
import { GAME_CMDS, USER_SOURCE_DESCRIPTION } from "../define";
import Utils from "./utils";

const SHARE_TYPE_MAP = {
    1 : 1,
    2 : 2,
    3 : "qqfriend",
    4 : "qqzone",
    5 : "weibo"
};

function shareToFriend(type, title, desc, pic, link) {
    switch (type) {
        case 1:
        case 2:
            Client.shareDocToWX(SHARE_TYPE_MAP[type], title, desc, pic, link);
            break;
        case 3:
        case 4:
        case 5:
            if(window.ShareComponent && ShareComponent.share) {
                ShareComponent.share({
                    shareType : SHARE_TYPE_MAP[type],
                    title : title,
                    url : link,
                    pic : pic,
                    summary : desc,
                    appkey : ""
                });
            }
            break;
    }
}
let ACTIONS = {
    "stage.visible" (visible) {
        console.log("stage.visible", visible);
        if(visible){
            if(Honor.director.getDialogByName("allready_logged")){return;}
            Honor.io.end();

            let config = {
                name : "allready_logged",
                msg : "网络不稳定，请刷新再试！"
            }
            Honor.director.openDialog(Common, [config], {
                onClosed () {
                    location.reload();
                }
            });
        }
    },

    "io.open" (data, code, msg) {
        Honor.io.emit(GAME_CMDS.IS_IN_ROOM);
        Honor.io.emit(GAME_CMDS.GET_USER_SOURCE, null, "ajax", "get");
    },
    [GAME_CMDS.IS_IN_ROOM] (data, code, msg) {
        switch (code) {
            case "000":
                if(data.inRoom === 1){
                    Honor.director.runScene("Room/Scene.scene");
                    // Honor.director.runScene(new Scene.Load(ASSETS.Room, function () {
                    //     Honor.director.runScene(new Scene.Room);
                    // }));
                }else{
                    Honor.director.runScene("Hall/Scene.scene");
                    // Honor.director.runScene(new Scene.Load(ASSETS.Hall, function () {
                    //     Honor.director.runScene(new Scene.Hall);
                    // }));
                }
                break;
            default:
                Honor.director.runScene("Hall/Scene.scene");
                // Honor.director.runScene(new Scene.Load(ASSETS.Hall, function () {
                //     Honor.director.runScene(new Scene.Hall);
                // }));
                break;
        }
    },
    [GAME_CMDS.GET_USER_SOURCE] (data, code) {
        if(code == "success") {
            data.data = data.data || {};
            USER_SOURCE_DESCRIPTION = data.data.userSourceDescription || "";
        }
    },
    [GAME_CMDS.USER_LOGOUT] (data, code) {
        if(code == "success"){
            if(window.WeixinJSBridge){
                location.hash = "norefreshed";
                location.href = `/?act=selectlogin&go_url=%2f%3fact%3d${Utils.getUrlParam("act")}`;
            }else{
                location.reload(true);
            }
        }
    },
    [GAME_CMDS.SHARE_REWARD] (data, code) {
        if(code == "000"){
            let config = {
                msg : `恭喜您分享成功，获得${data.amount}`
            };
            let totleReward = data.awardAmount + data.amount;
            let fare = totleReward / 500 | 0;
            let shareTitle = `我在【逗棋牌】中分得了${totleReward}大奖${fare != 0 ? `(可兑换${fare}元话费)` : ""}，快来一起玩吧！`;
            let shareDesc = "邀请好友一起玩游戏，娱乐赚钱两不误！";
            let shareLink = `${location.origin}/?act=gamewxshare&nickname=${TBNN_USER_NAME}&price=${fare}&user_id=${GM.user_id}&invite=1`;


            if(window.Client && window.Client.shareDocToWX && data.shareType == -1){
                $(".tbnn_share_in_wx").show();

                Laya.timer.once(3000, null, function () {
                    $(".tbnn_share_in_wx").hide();
                    Honor.director.openDialog(Common, [config]);
                });

                window.GM && GM.gameShareToWxCall({
                    shareTitle : shareTitle,
                    shareDesc : shareDesc,
                    shareUrl : shareLink,
                    sharePicUrl : GM.shareImgUrl
                });
            }else{
                Honor.io.unregister("stage.visible");
                Honor.io.end();

                Laya.timer.once(8000, null, function () {
                    Honor.director.openDialog(Common, [config], {
                        onClosed : function () {
                            location.reload();
                        }
                    });
                });

                shareToFriend(data.shareType, shareTitle, shareDesc, GM.shareImgUrl, shareLink);
                // Client.shareDocToWX(data.shareType, shareTitle, shareDesc, GM.shareImgUrl, shareLink);
            }
        }
    }
}

Honor.io.register(ACTIONS);
