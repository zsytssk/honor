import Utils from "../libs/utils";
import { GAME_CMDS, GAME_CONFIG } from "../define";
import Exchange from "../alert/exchange";

let EVENT_CLICK = Laya.Event.CLICK;

class RoomEntrace extends Laya.Button {
    private ani:Laya.Skeleton = null;
    private roomId:number = null;
    private level:number = null;
    constructor (index, data) {
        super();

        this.roomId = data.roomId;
        this.level = data.level;

        this.init(index);
    }

    destroy () {
        super.destroy();
        this.ani = null;
        this.roomId = null;
    }

    init (index) {
        this.setup(index);
        this.initEvent();
        this.initUI(index);
        this.enter(index);
    }

    setup (index) {
        this.size(475, 155);
        this.x = this.width;
        this.y = index * 160;
        this.alpha = 0;
    }

    initEvent () {
        this.on(EVENT_CLICK, this, function () {
            if(!Utils.checkLogin()){return;}
            Laya.SoundManager.playSound("sound/btn.mp3");

            Honor.io.emit(GAME_CMDS.INROOM, {roomId : this.roomId});
        });
    }

    initUI (index) {
        let ani = Utils.createSkeleton(`res/hall/room_${this.level}`);
            // ani.scale(2, 2);
            ani.pos(this.width / 2, this.height / 2);
            ani.play(0, true);

        this.ani = ani;
        this.addChild(ani);
    }

    enter (index) {
        Laya.Tween.to(this, {x : 0, alpha : 1}, 300, Laya.Ease.backOut, null, index * 50);
    }
}

class BtnExchange extends Laya.Button {
    private ani:Laya.Skeleton = null;
    constructor () {
        super();

        this.init();
    }

    destroy () {
        super.destroy();
        this.ani = null;
    }

    init () {
        this.setup();
        this.initEvent();
        this.initUI();
    }

    setup () {
        this.size(200, 110);
        this.y = 600;
        this.alpha = 0;
    }

    initEvent () {
        this.on(EVENT_CLICK, this, function () {
            if(!Utils.checkLogin()){return;}
            Laya.SoundManager.playSound("sound/btn.mp3");
            Honor.director.openDialog(Exchange);
        });
    }

    initUI () {
        let ani = Utils.createSkeleton(`res/hall/exchange`);
            ani.pos(this.width / 2, this.height / 2);
            ani.play(0, true);

        this.ani = ani;
        this.addChild(ani);
    }

    enter () {
        Laya.Tween.to(this, {y : 485, alpha : 1}, 200, null, null, 500);
    }
}

class BtnQuickStart extends Laya.Button {
    private ani:Laya.Skeleton = null;
    constructor () {
        super();

        this.init();
    }

    destroy () {
        super.destroy();
        this.ani = null;
    }

    init () {
        this.setup();
        this.initEvent();
        this.initUI();
    }

    setup () {
        this.size(245, 120);
        this.pos(225, 600);
        this.alpha = 0;
    }

    initEvent () {
        this.on(EVENT_CLICK, this, function () {
            if(!Utils.checkLogin()){return;}
            Laya.SoundManager.playSound("sound/btn.mp3");
            Honor.io.emit(GAME_CMDS.INROOM);
        });
    }

    initUI () {
        let ani = Utils.createSkeleton(`res/hall/quick_start`);
            ani.pos(this.width / 2, this.height / 2);
            // ani.scale(2, 2);
            ani.play(0, true);

        this.ani = ani;
        this.addChild(ani);
    }

    enter () {
        Laya.Tween.to(this, {y : 480, alpha : 1}, 200, null, null, 300);
    }
}

class Entrace extends Laya.Box {
    private btnPortrait:Laya.Button = null;
    private btnQuickStart:BtnQuickStart = null;
    private btnExchange:BtnExchange = null;
    constructor () {
        super();

        this.btnPortrait = null;
        this.btnQuickStart = null;
        this.btnExchange = null;

        this.init();
    }

    destroy () {
        super.destroy();
        this.btnPortrait = null;
        this.btnQuickStart = null;
        this.btnExchange = null;
        Honor.io.unregister(GAME_CMDS.ROOM_LIST, this.updateRoomEntrace);
    }

    init () {
        this.setup();
        this.createUI();

        Honor.io.emit(GAME_CMDS.ROOM_LIST);
    }

    setup () {
        let rate = Laya.stage.height / GAME_CONFIG.HEIGHT;

        this.anchorX = 1;
        this.anchorY = 0.5;
        this.size(475, 600);
        this.right = 70;
        this.centerY = 70;

        if(rate <= 1){
            this.scale(rate, rate);
        }

        Honor.io.register(GAME_CMDS.ROOM_LIST, this, this.updateRoomEntrace);
        Honor.io.register(GAME_CMDS.CHANGESKIN, this, function (data, code) {
            if(code == "success" && (data && data.code == 0)){
                location.reload();
            }
        });
    }

    createUI () {
        let btnPortrait = new Laya.Button("res/hall/btn_portrait.png");
            btnPortrait.stateNum = 1;
            btnPortrait.pos(-150, 15);
            btnPortrait.on(EVENT_CLICK, this, function () {
                Honor.io.ajaxGet(GAME_CMDS.CHANGESKIN);
            });

        this.btnPortrait = btnPortrait;
        this.btnQuickStart = new BtnQuickStart();
        this.btnExchange = new BtnExchange();
        this.addChildren(this.btnPortrait, this.btnQuickStart, this.btnExchange);
    }

    updateRoomEntrace (data) {
        // data = [{"roomId":2,"userCount":2,"type":"fluent","level":3},{"roomId":4,"userCount":0,"type":"fluent","level":2},{"roomId":6,"userCount":0,"type":"fluent","level":1},{"roomId":8,"userCount":0,"type":"fluent"}];
        data.map((val, index) => {
            if(index > 2){return;}
            this.addChild(new RoomEntrace(index, val));
        });
    }

    enter () {
        this.btnExchange.enter();
        this.btnQuickStart.enter();
    }

    resize (width, height, rate) {
        if(rate < 1){
            this.scale(rate, rate);
        }else{
            this.scale(1, 1);
        }
    }
}

export default Entrace;