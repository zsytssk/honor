import { GAME_CMDS } from "../define";


let Pool = [];
class Prop extends Laya.Clip {
    constructor (url, startPos, endPos) {
        super();
        
        this.init(url, startPos, endPos);
    }

    init (url, startPos, endPos) {
        this.clipX = 1;
        this.clipY = 7;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.interval = 180;
        this.visible = false;

        this.on(Laya.Event.COMPLETE, this, this.recover);

        this.reset(url, startPos, endPos);
    }

    reset (url, startPos, endPos) {
        this.skin = url;
        this.x = startPos.x;
        this.y = startPos.y;
        this.visible = true;

        Laya.Tween.to(this, {x : endPos.x, y : endPos.y}, 1100, null, Laya.Handler.create(this, function () {
            this.play(0, this.total);
        }));

        return this;
    }

    recover () {
        this.removeSelf();
        this.visible = false;
        Pool.push(this);
    }

    static create (url, startPos, endPos) {
        if(Pool.length){
            return Pool.pop().reset(url, startPos, endPos)
        }else{
            return new this(url, startPos, endPos);
        }
    }
}



class PropSet extends Laya.Box {
    private ACTIONS:object = null;
    private seatsPos:object = null;
    private bankerPos:Laya.Point = null;
    private userPos:Laya.Point = null;
    private playsPos:Laya.Point = null;
    constructor () {
        super();
        
        this.init();
    }

    destroy () {
        super.destroy();
        Honor.io.unregister(this.ACTIONS);
    }

    init () {
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;

        this.ACTIONS = {
            [GAME_CMDS.SENDPROP] : this.sendProp,
            "seats.pos" (data) {
                console.log("seats.pos", data);
                this.seatsPos = data;
            },
            "banker.pos" (data) {
                console.log("banker.pos", data);
                this.bankerPos = data;
            },
            "user.pos" (data) {
                console.log("user.pos", data);
                this.userPos = data;
            },
            "plays.pos" (data) {
                console.log("plays.pos", data);
                this.playsPos = data;
            }
        };

        Honor.io.register(this.ACTIONS, this);
    }
    
    sendProp (data) {
        let startPoint = null;
        let bottom = this.bottom;
        let top = this.top;
        if(GM.user_id == data.originUid){
            startPoint = this.userPos;
        }else if(data.originSeat == 0){
            startPoint = this.playsPos;
        }else if(data.originSeat == 9){
            startPoint = this.bankerPos;
        }else{
            startPoint = this.seatsPos[data.originSeat];
        }
        if(Array.isArray(data.target)){
            data.target.forEach((item, index) => {
                this.addChild(Prop.create(data.animation, startPoint, this.seatsPos[item]));
            });
        }
    }
}

export default PropSet;