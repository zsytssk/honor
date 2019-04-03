import { ui } from "../ui/layaMaxUI";
import Tips from "./tips";
import { GAME_CMDS, GAME_CONFIG } from "../define";

let EVENT_CLICK = Laya.Event.CLICK;

class Exchange extends ui.views.Alert.ExchangeUI {
    private limit:number = null;
    constructor () {
        super();

        this.init();
    }

    init () {
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        
        this.exchangeValue.on(EVENT_CLICK, this, this.showKeyboard);
        this.btnExchange.on(EVENT_CLICK, this, this.onBtnExchangeClick);

        Honor.io.register(GAME_CMDS.USE_INFO, this, this.update);
        Honor.io.emit(GAME_CMDS.USE_INFO);
    }

    showKeyboard () {
        let config = {
            caller : this,
            input (val) {
                this.exchangeValue.text = val;
            },
            close (type, val) {
                if(type === "confirm"){
                    this.exchangeValue.text = val;
                }
            }
        }
        Honor.keyboard.enter(0, config);
    }

    onBtnExchangeClick () {
        if(parseInt(this.exchangeValue.text) > 0 && parseInt(this.exchangeValue.text) <= this.limit){
            Honor.io.emit(GAME_CMDS.CHARGEIN, {amount : this.exchangeValue.text}); 
            this.close();     
        }else{
            Honor.director.openDialog(Tips, ['带入的游戏币不能大于余额或小于等于0']);
        }
    }

    update (data) {
        this.limit = data.platformAmount;
        this.balance.text = data.platformAmount;
    }

    onOpened () {
        let rate = Laya.stage.height / GAME_CONFIG.HEIGHT;
        if(rate <= 1){
            this.scale(rate, rate);
        }else{
            this.scale(1, 1);
        }
    }

    onClosed () {
        Honor.io.unregister(GAME_CMDS.USE_INFO, this.update);
    }
}

export default Exchange;