import { ui } from "../ui/layaMaxUI";
import Tips from "./tips";
import { GAME_CMDS, GAME_CONFIG } from "../define";

let EVENT_CLICK = Laya.Event.CLICK;

class OperateSetup extends ui.views.Alert.OperateSetupUI {
    private data:{[key:string]:any} = null;
    constructor (data) {
        super();

        this.name = "operate_setup";
        this.group = "operate_setup";
        this.data = data;//{"defaultTimes":5,"leastAmount":500000,"maxTime":180,"isContinue":1}
        
        this.init(data);
    }
    init (data) {
        this.anchorX = 0.5;
        this.anchorY = 0.5;

        this.tips_2.style.align = "center";
        this.tips_2.style.fontSize = 24;

        this.bindEvent();
        this.initData(data);
    }
    bindEvent () {
        this.operateAmount.on(EVENT_CLICK, this, this.onAmountClicked);
        this.operateTimes.on(EVENT_CLICK, this, this.onTimesClicked);
        this.btnOperate.on(EVENT_CLICK, this, this.onBtnOperateClicked);
    }

    initData (data) {
        let tips1Text, tips1Value = data[data.scheme];
        if(tips1Value != 0){
            switch (data.scheme) {
                case "maxTime":
                    tips1Text = `每次最长操盘时间${tips1Value}分钟`;
                    break;
                case "maxCount":
                    tips1Text = `操盘手每次最长可操盘${tips1Value}局`;
                    break;
            }
            this.tips_1.text = tips1Text;
            this.autoQueue.selected = !!data.isContinue;
            this.tips_1.visible = true;
            this.autoQueue.visible = true;
        }

        this.operateAmount.text = data.leastAmount;
        this.operateTimes.text = data.defaultTimes;
        this.tips_2.innerHTML = `<span style="color:#e0a400">操盘时游戏币至少需要</span><span style="color:#ffe828">${data.leastAmount}</span><span style="color:#e0a400">，至多为</span><span style="color:#ffe828">${data.mostAmount}</span>`;
    }

    onAmountClicked () {
        let config = {
            caller : this,
            input (value) {
                this.operateAmount.text = value;
            },
            close (type, value) {
                if(type === "confirm"){
                    if(value < this.data.leastAmount){
                        Honor.director.openDialog(Tips, `操盘金额不能低于${this.data.leastAmount}`);
                        this.operateAmount.text = this.data.leastAmount;
                        return;
                    }
                    if(value > this.data.mostAmount){
                        Honor.director.openDialog(Tips, `操盘金额最多为${this.data.mostAmount}`);
                        this.operateAmount.text = this.data.mostAmount;
                        return;
                    }
                    this.operateAmount.text = value;
                }
            }
        };
        Honor.keyboard.enter(this.operateAmount.text, config);
    }

    onTimesClicked () {
        let config = {
            caller : this,
            zero : true,
            length : 2,
            input (value) {
                this.operateTimes.text = value;
            },
            close (type, value) {
                if(type === "confirm"){
                    if(!value){
                        value = 1;
                    }
                    if(value > 99){
                        value = 99;
                    }
                    this.operateTimes.text = value;
                }
            }
        };
        Honor.keyboard.enter(this.operateTimes.text, config);
    }

    onBtnOperateClicked () {
        Laya.SoundManager.playSound("sound/btn.mp3");
        if((this.operateAmount.text | 0) < this.data.leastAmount){
            Honor.director.openDialog(Tips, `操盘金额不能低于${this.data.leastAmount}`);
            return;
        }
        let params = {
            amount : this.operateAmount.text,
            times : this.userConfig.selectedIndex === 0 ? this.operateTimes.text : -1,
            goon : this.autoQueue.selected ? 1 : 0,
        }
        Honor.io.emit(GAME_CMDS.BANKER_UP, params);
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

export default OperateSetup;