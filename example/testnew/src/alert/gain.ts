import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS, GAME_CONFIG } from "../define";

let EVENT_CLICK = Laya.Event.CLICK;
let _name = {"1" : "欢乐值", "2" : "万里通积分", "3" : "欢乐豆", "4" : "彩金", "5" : "挺豆", "9" : "彩分", "10" : "健康金余额", "11" : "流量余额"};

class Gain extends ui.views.Alert.GainUI {
    constructor (data) {
        super();
        
        this.init();
        this.update(data);
    }

    init () {
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        
        this.detailsList.array = [];

        this.btnGain.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            this.close();
            Honor.io.emit(GAME_CMDS.CHANGROUT);
        });
        this.btnShowOther.on(EVENT_CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            this.close();
            if(window.GM && GM.whereYxb){
                GM.whereYxb();
            };
        });
    }

    update (data) {
        let gameCoin = data.amount;

        if(gameCoin == 0){
            this.gainBox.visible = false;
            this.noData.visible = true;
            this.btnShowOther.y = 454;
            return;
        }
        let _data = [];
        let details = data.details || [];
        let size = details.length;

        this.gameCoin.text = gameCoin;

        for(let i in details){
            let text = details[i].amountAvailable;
            if(details[i].accountType == 10){
                if(GM && GM.is_jiankangjin_user == true){
                    //text = text == 0 ? "0 前往好医生APP获取更多健康金" : text;
                    text = text == 0 ? "0  前往好医生APP..." : text;
                }
            }
            _data.push({type : _name[details[i].accountType], text : text});
        }

        this.detailsList.array = _data;
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

export default Gain;