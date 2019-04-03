import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS } from "../define";
import Utils from "../libs/utils";
import Award from "../alert/award";

let formatMoney = Utils.formatMoney;
let totalTime = 1000;
let speed = 50;
let Inited = false;
let ACTIONS = {
    [GAME_CMDS.GET_ROOM_INFO] (data) {
        this.update(data.poolAmount);
    },
    [GAME_CMDS.POOL_INFO] (data) {
        Honor.director.openDialog(Award, [data]);
    },
    [GAME_CMDS.ROUND_OVER] (data) {
        Laya.timer.once(10000, this, function (poolAmount) {
            poolAmount && this.update(poolAmount);
        }, [data.poolAmount]);
    }
}
class Pool extends ui.views.Room.PoolUI {
    private prevScore = 0;
    private prizeScore = 0;
    private diff = 0;
    private startCount = 0;
    constructor () {
        super();
        
        this.init();
    }

    destroy () {
        super.destroy();
        Honor.io.unregister(ACTIONS);
    }

    init () {
        this.y = 110;

        this.initUI();

        this.on(Laya.Event.CLICK, this, function () {
            Honor.io.emit(GAME_CMDS.POOL_INFO);
        });

        Honor.io.register(ACTIONS, this);
    }

    initUI () {
        let light = Utils.createSkeleton("res/room/pool_light");
            light.pos(this.poolLightBox.width / 2, this.poolLightBox.height / 2);
            light.play("normal", false);

        this.poolLightBox.addChild(light);
    }

    loop () {
        this.startCount += this.diff;
        this.poolTotal.text = formatMoney(this.startCount + this.prevScore);

        if(this.startCount + this.prevScore >= this.prizeScore){
            this.prevScore = this.prizeScore;
            this.poolTotal.text = formatMoney(this.prevScore);
        }else{
            Laya.timer.once(speed, this, this.loop);
        }
    }

    update (data) {
        Laya.timer.clear(this, this.loop);
        console.log(`Pool update:${data}, cur:${this.prevScore}`);
        this.prizeScore = data;
        this.startCount = 0;
        this.diff = (data - this.prevScore) / totalTime * speed | 0;
        if(this.diff == 0){
            this.diff = 1;
        }
        this.loop();
    }

    enter () {}
}

export default Pool;