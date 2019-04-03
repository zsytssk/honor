import Table from "./table";
import Banker from "./banker";
import CountDown from "./countdown";
import Pool from "./pool";
import BetTotal from "./bettotal";
import BetArea from "./betarea";
import User from "./user";
import Chat from "../alert/chat";
import Bet from "./bet";
import PropSet from "./prop";
import { GAME_CONFIG, GAME_CMDS } from "../define";

class Room extends Laya.Scene {
    private table:Table = null;
    private banker:Banker = null;
    private countDown:CountDown = null;
    private awardPool:Pool = null;
    private betTotal:BetTotal = null;
    private betArea:BetArea = null;
    private user:User = null;
    private chat:Chat = null;
    private bet:Bet = null;
    private propSet:PropSet = null;
    private headerArea:Laya.Box = null;
    private bottomArea:Laya.Box = null;
    private ACTIONS:object = null;
    constructor () {
        super();
        

        this.init();
    }

    destroy () {
        super.destroy();
        Honor.io.unregister(this.ACTIONS);
    }

    init () {
        let rate = Laya.stage.height / GAME_CONFIG.HEIGHT;
        let headerArea = new Laya.Box;
            headerArea.size(990, 240);
            headerArea.centerX = 0;
            headerArea.mouseEnabled = true;
            headerArea.mouseThrough = true;
        let bottomArea = new Laya.Box;
            bottomArea.size(1110, 167);
            bottomArea.centerX = -14;
            bottomArea.bottom = 0;

        this.table = new Table;
        this.banker = new Banker;
        this.countDown = new CountDown;
        this.awardPool = new Pool;
        this.betTotal = new BetTotal;
        this.betArea = new BetArea;
        // this.players = new Players;
        this.user = new User;
        this.chat = new Chat;
        this.bet = new Bet;
        this.propSet = new PropSet;

        this.headerArea = headerArea;
        this.bottomArea = bottomArea;

        this.betArea.addChild(this.countDown);
        this.headerArea.addChildren(this.banker, this.awardPool, this.betTotal);
        this.bottomArea.addChildren(this.chat, this.bet, this.user);
        // this.addChildren(this.table, this.headerArea, this.players, this.betArea, this.bottomArea, this.propSet);
        this.addChildren(this.table, this.headerArea, this.betArea, this.bottomArea, this.propSet);

        this.table.resize(GAME_CONFIG.WIDTH, Laya.stage.height, rate);
        if(rate <= 1){
            this.headerArea.scale(rate, rate);
            this.bottomArea.scale(rate, rate);
            // this.players.resize(GAME_CONFIG.WIDTH, Laya.stage.height, rate);
            this.betArea.resize(GAME_CONFIG.WIDTH, Laya.stage.height, rate);
        }

        this.ACTIONS = {
            [GAME_CMDS.OUT_ROOM] : this.outRoom,
            [GAME_CMDS.KICK] : this.outRoom
        };
        Honor.io.register(this.ACTIONS, this);
        Honor.io.emit(GAME_CMDS.GET_ROOM_INFO);
    }

    outRoom (data) {
        Honor.director.runScene("Hall/Scene.scene");
        // if(ASSETS.Hall.Finished){
        //     Honor.director.runScene(new Scene.Hall());
        // }else{
        //     Honor.director.runScene(new Scene.Load(ASSETS.Hall, () => {
        //         Honor.director.runScene(new Scene.Hall);
        //     }));
        // }
    }

    onEnter () {
        this.table.enter();
        this.banker.enter();
        this.countDown.enter();
        this.awardPool.enter();
        this.betTotal.enter();
        this.betArea.enter();
        // this.players.enter();
        this.user.enter();
        this.bet.enter();
    }

    onExit () {
        this.table = null;
        this.banker = null;
        this.countDown = null;
        this.awardPool = null;
        this.betTotal = null;
        this.betArea = null;
        // this.players = null;
        this.user = null;
        this.chat = null;
        this.bet = null;
        this.propSet = null;

        this.headerArea = null;
        this.bottomArea = null;
    }

    onResize (width, height) {
        let rate = height / GAME_CONFIG.HEIGHT;
        this.table.resize(width, height, rate);
        if(rate <= 1){
            this.headerArea.scale(rate, rate);
            this.bottomArea.scale(rate, rate);
        }else{
            this.headerArea.scale(1, 1);
            this.bottomArea.scale(1, 1);
        }
        this.betArea.resize(width, height, rate);
        // this.players.resize(width, height, rate);
        this.banker.resize();
        this.user.resize();
    }
}

export default Room;