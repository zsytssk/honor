import { ui } from "../ui/layaMaxUI";
import Utils from "../libs/utils";

class Result extends ui.views.Alert.ResultUI {
    constructor (data) {
        super();

        this['CONFIG'] = {autoClose : 3500};
        
        this.init(data);
    }

    init (data) {
        let myResult = data.myResult && Object.keys(data.myResult).length != 0 ? data.myResult : {amount : 0, userName : TBNN_USER_NAME, avator : USER_AVATAR, ticketFlag : 1, ticketAmount : 0}
        this.updateMineInfo(myResult);
        this.updateAmountAndUI(myResult);
        this.updateUserList(data.preFive || []);
    }

    updateMineInfo (data) {
        if(data.avator){
            Laya.loader.load(data.avator, Laya.Handler.create(this, function (skin, texture) {
                if(texture){
                    this.avatar.skin = skin;
                }else{
                    this.avatar.skin = Utils.getAvatar(GM.user_id);
                }
            }, [data.avator]))
        }else{
            this.avatar.skin = Utils.getAvatar(GM.user_id);
        }

        if(data.ticketFlag == 1){
            this.ticket.text = `（对局费：${data.ticketAmount}）`;
            this.ticket.visible = true;
        }

        this.userName.text = Utils.cutStr(data.userName, 8);
    }

    updateUserList (data) {
        for(let i = 0; i < data.length; i++){
            data[i].rank = i + 1;
            data[i].avatar = Utils.getAvatar(data[i].userId);
            data[i].userName = Utils.cutStr(data[i].userName, 8);
        }

        this.userList.array = data;
    }

    updateAmountAndUI (data) {
        if(data.amount >= 0){
            this.amount.font = "font_result_win";
            this.amount.text = `+${data.amount}`;

            let WIN_TITLE_ANI = Utils.createSkeleton("res/alert/result/win_title");
                WIN_TITLE_ANI.pos(382, 81);
            let WIN_LIGHT_ANI = Utils.createSkeleton("res/alert/result/win_light");
                WIN_LIGHT_ANI.pos(382, 218);
                WIN_LIGHT_ANI.on(Laya.Event.STOPPED, WIN_LIGHT_ANI, WIN_LIGHT_ANI.removeSelf);

            this.addChildren(WIN_TITLE_ANI, WIN_LIGHT_ANI);
            WIN_TITLE_ANI.play(0, true);
            WIN_LIGHT_ANI.play(0, false);
            Laya.SoundManager.playSound('sound/win.mp3');
        }else{
            this.amount.font = "font_result_lose";
            this.amount.text = data.amount;
            this.loseTitile.visible = true;

            let LOSE_LIGHT_ANI = Utils.createSkeleton("res/alert/result/lose_light");
                LOSE_LIGHT_ANI.pos(382, 218);
                LOSE_LIGHT_ANI.on(Laya.Event.STOPPED, LOSE_LIGHT_ANI, LOSE_LIGHT_ANI.removeSelf);

            this.addChild(LOSE_LIGHT_ANI);
            LOSE_LIGHT_ANI.play(0, false);
            Laya.SoundManager.playSound('sound/lose.mp3');
        }
    }
}

export default Result;