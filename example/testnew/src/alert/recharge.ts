import { ui } from "../ui/layaMaxUI";

let EVENT_CLICK = Laya.Event.CLICK;
let VALUES = ["10", "50", "100", "500"];

class Recharge extends ui.views.Alert.RechargeUI {
    private curRechargeValue:number = null;
    constructor () {
        super();

        this.name = "recharge";
        this.curRechargeValue = null;

        this.init();
    }
    init () {
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        
        this.rechargeContent.text = rechargeContent;
        this.btnShowKeyboard.on(EVENT_CLICK, this, this.showKeyboard);
        this.btnRecharge.on(EVENT_CLICK, this, this.recharge);
        this.rechargeTab.selectHandler = new Laya.Handler(this, function (index) {
            if(index == -1){return;}
            
            this.rechargeValue.text = `${VALUES[index]}元`;
            this.curRechargeValue = VALUES[index];
            Laya.SoundManager.playSound("sound/btn.mp3");
        });

        this.rechargeTab.selectedIndex = 2;
    }
    onKeyboardInput (value) {
        this.rechargeValue.text = `${value}元`;
        this.curRechargeValue = value;
        for(let i in VALUES){
            if(VALUES[i] == value){
                this.rechargeTab.selectedIndex = (i | 0);
                return;
            }
        }
        this.rechargeTab.selectedIndex = -1;
    }
    showKeyboard () {
        let KEYBOARD_CONFIG = {
            "length" : 8,
            "input" : this.onKeyboardInput.bind(this),
            "close" : function (type, value) {
                if(type === "confirm"){
                    this.onKeyboardInput(value);
                }
            }.bind(this)
        };
        Honor.keyboard.enter(this.curRechargeValue, KEYBOARD_CONFIG);
    }
    recharge () {
        if(!this.curRechargeValue){return;}
        Laya.SoundManager.playSound("sound/btn.mp3");

        let url = `/?act=payment&gameId=${gameId}&tradeName=${tradeName}&amount=${this.curRechargeValue}&platform=${platform}&redirect_uri=${redirect_uri}`;

        window.location.href = url;
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
        Honor.keyboard.close();
    }
}

export default Recharge;