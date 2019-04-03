import { ui } from "../ui/layaMaxUI";
import Utils from "../libs/utils";
import { GAME_CMDS } from "../define";

let modifyNumber = Utils.modifyNumber;
let ACTIONS = {
    [GAME_CMDS.GET_ROOM_INFO] (data) {
        let allChips = data.allChips;
        let chipsData = [];
        let defaultIndex = 0;
        allChips.map((val, index) => {
            if(val == data.defaultChip){defaultIndex = index};
            chipsData.push({
                value : val,
                betText : modifyNumber(val)
            });
        });

        this.betList.array = chipsData;
        this.scrollBarMax = this.betList.scrollBar.max - 60;

        this.betList.selectedIndex = defaultIndex;
        this.betList.tweenTo(defaultIndex - 2, 300);
        if(defaultIndex == 0){
            this.leftMask.visible = false;
        }
        if(defaultIndex == chipsData.length - 1){
            this.rightMask.visible = false;
        }
        if(data.showRepeat == 1){
            this.btnRepeat.disabled = false;
        }else{
            this.btnRepeat.disabled = true;
        }
    },
    [GAME_CMDS.COUNTDOWN] () {
        this.btnRepeat.disabled = true;
    },
    [GAME_CMDS.REPEATBETCALL] (data) {
        this.btnRepeat.disabled = true;
    },
    [GAME_CMDS.SHOWREPEATBET] () {
        this.btnRepeat.disabled = false;
    },

    "countdown.waitingfordeal" () {
        this.btnRepeat.disabled = true;
    }
}
class Bet extends ui.views.Room.BetUI {
    private prevSelectedIndex:number = -1;
    private scrollBarMax:number = 0;
    constructor () {
        super();
        
        this.init();
    }

    destroy () {
        super.destroy();
        Honor.io.unregister(ACTIONS);
    }

    init () {
        this.pos(191, 61);
        this.betList.array = [];
        this.betList.selectHandler = new Laya.Handler(this, this.onBetListSelect);
        this.betList.scrollBar.changeHandler = new Laya.Handler(this, this.onScrollBarChange);
        this.btnRepeat.on(Laya.Event.CLICK, this, function () {
            Honor.io.emit(GAME_CMDS.REPEATBETCALL);
            this.btnRepeat.disabled = true;
        });

        Honor.io.register(ACTIONS, this);
    }

    onBetListSelect (index) {
        let total = this.betList.length;
        for(let i = 0; i < total; i++){
            let data = this.betList.getItem(i);
            if(i === index){
                data.bg = 1;
            }else{
                data.bg = 0;
            }
            this.betList.changeItem(i, data);
        }

        Honor.io.publish("bet.change", this.betList.array[index].value);
        console.log(`当前押注额：${this.betList.array[index].value}`);
    }

    onScrollBarChange (value) {
        if(value < 60){
            this.leftMask.visible = false;
        }else{
            this.leftMask.visible = true;
        }

        if(value > this.scrollBarMax){
            this.rightMask.visible = false;
        }else{
            this.rightMask.visible = true;
        }
    }

    enter () {
        
    }
}

export default Bet;