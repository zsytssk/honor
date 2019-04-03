import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS } from "../define";

class CountDown extends ui.views.Room.CountDownUI {
    private ACTIONS:object = null;
    private leftTime:number = null;
    private totalTime:number = null;
    constructor () {
        super();
        
        this.init();
    }

    destroy () {
        super.destroy();
        Honor.io.unregister(this.ACTIONS);
    }

    init () {
        this.pos(308, -54);

        this.ACTIONS = {
            [GAME_CMDS.GET_ROOM_INFO] (data) {
                if(data.leftTime > 0 && data.betTime){
                    this.status(1);
                    this.start(data.leftTime / 1000 | 0, data.betTime / 1000 | 0);
                }else{
                    if(data.bankerId){
                        this.status(3);
                    }else{
                        this.status(4);
                    }
                }
            },
            [GAME_CMDS.ROUND_START] (data) {
                this.status(1);
                this.start(data.betTime / 1000 | 0, data.betTime / 1000 | 0);
            },
            [GAME_CMDS.ROUND_OVER] (data) {
                this.status(0);
            },
            [GAME_CMDS.BANKER_DOWN_ROOM] (data) {
                this.status(4);
            },
        };

        Honor.io.register(this.ACTIONS, this);
    }

    start (leftTime, totalTime) {
        this.leftTime = leftTime;
        this.totalTime = totalTime;

        this.clock.text = leftTime < 10 ? `0${leftTime}` : leftTime;
        this.proBar.width = this.width * leftTime / totalTime;
        this.countDown.visible = true;
        this.waitForNext.visible = false;

        Laya.timer.once(1000, this, this.loop);
    }

    loop () {
        console.log("countdown loop", this.leftTime)
        this.leftTime--;
        if(this.leftTime < 0){
            this.status(2);
            return;
        }
        if(this.leftTime <= 5){
            Laya.SoundManager.playSound('sound/countdown.mp3');
        }
        this.clock.text = this.leftTime < 10 ? `0${this.leftTime}` : `${this.leftTime}`;
        Laya.Tween.to(this.proBar, {width : this.width * this.leftTime / this.totalTime}, 1000, null, Laya.Handler.create(this, this.loop));
    }

    status (type) {
        console.log("countdown status", type);
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this.proBar);
        Laya.SoundManager.stopAllSound();
        this.countDown.visible = false;
        this.waitForNext.visible = false;
        switch (type) {
            case 1:
                this.countDown.visible = true;
                break;
            case 2:
                Honor.io.publish("countdown.waitingfordeal");
                this.waitTips.text = "等待发牌...";
                this.waitForNext.visible = true;
                break;
            case 3:
                this.waitTips.text = "等待下局开始...";
                this.waitForNext.visible = true;
                break;
            case 4:
                this.waitTips.text = "等待玩家操盘...";
                this.waitForNext.visible = true;
                break;
        }
    }

    enter () {}
}

export default CountDown;