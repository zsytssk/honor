import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS } from "../define";
import Utils from "../libs/utils";

class Prop extends ui.views.Alert.PropUI {
    private seatId:number = null;
    constructor (data) {
        super();

        this.init(data);
    }

    init (data) {
        this.initEvent();
        this.update(data);
    }

    initEvent () {
        this.btnSitdown.on(Laya.Event.CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");   
            Honor.io.emit(GAME_CMDS.SIT_DOWN_USER,{seatId : this.seatId});
            this.close();
        });

        this.propList.selectHandler = Laya.Handler.create(this, function (index) {
            Laya.SoundManager.playSound("sound/btn.mp3");  

            Honor.io.emit(GAME_CMDS.SENDPROP, {
                sendAll : this.sendToAll.selected ? 1 : 0,
                seatId : this.seatId,
                itemId : this.propList.array[index].id
            });

            this.close();
        });
    }

    update (data) {
        let userInfo = data.userInfo;
        this.seatId = userInfo.seatId;
        if(userInfo.avater){
            Laya.loader.load(userInfo.avater, Laya.Handler.create(this, function (skin, texture) {
                if(texture){
                    this.avatar.skin = skin;
                }else{
                    this.avatar.skin = Utils.getAvatar(userInfo.userId);
                }
            }, [userInfo.avater]))
        }else{
            this.avatar.skin = Utils.getAvatar(userInfo.userId);
        }
        this.userName.text = Utils.cutStr(userInfo.userName, 8);
        this.userScore.text = userInfo.amount;
        this.propList.array = data.propList;
    }
}

export default Prop;