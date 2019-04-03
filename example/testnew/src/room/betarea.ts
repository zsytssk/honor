import { ui } from "../ui/layaMaxUI";
import CardSet from "./card";
import Utils from "../libs/utils";
import { GAME_CMDS } from "../define";
import Result from "../alert/result";
import Prize from "../alert/prize";
import SharePrize from "../alert/shareprize";

let extend = Utils.extend;
let getRandom = Utils.getRandom;
let BET_AREA_POS = [
    {x : 110, type : "shun"},
    {x : 373, type : "tian"},
    {x : 637, type : "di"},
    {x : 900, type : "xuan"}
];
    


let COIN_INDEX = 0;
let Pool = [];
class Coin extends Laya.Image {
    constructor () {
        super();
        
        this.name = `coin_${COIN_INDEX++}`;
        this.skin = "res/room/icon_coin.png";
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }

    reset (startPos, endPos, ani, recover) {
        if(!ani){
            this.x = endPos.x;
            this.y = endPos.y;
            return this;
        }
        this.fly(startPos, endPos, recover);

        return this;
    }

    fly (startPos, endPos, recover = false) {
        if(startPos){
            this.x = startPos.x;
            this.y = startPos.y;
        }

        if(recover){
            Laya.Tween.to(this, {x : endPos.x, y : endPos.y}, 300, null, Laya.Handler.create(this, this.recover));
        }else{
            Laya.Tween.to(this, {x : endPos.x, y : endPos.y}, 300);
        }
    }

    recover () {
        console.log("Coin recover", this.name);
        this.removeSelf();
        Pool.push(this);
    }

    static create (startPos, endPos, ani, recover) {
        let coin = null;
        if(Pool.length != 0){
            coin = Pool.pop().reset(startPos, endPos, ani, recover);
            console.log("Coin create from pool", ani, recover, coin.name);
            return coin;
        }else{
            coin = (new this).reset(startPos, endPos, ani, recover);
            console.log("Coin create", ani, recover, coin.name);
            return coin;
        }
    }
}




class Area extends ui.views.Room.BetAreaUI {
    private card:CardSet = null;
    private index:number = null;
    public type:string = null;
    private betValue:number = null;
    private betResult:{[key:string]:any} = null;
    private betFlag:boolean = false;
    private _enableBet:boolean = false;
    private betMineTotal:number = 0;
    private betRealValue:number = 0;
    constructor (index) {
        super();

        this.index = index;
        this.init(index);
    }

    init (index) {
        extend(this, BET_AREA_POS[index]);
        this.betIcon.skin = `res/room/game_icon_${index + 1}.png`;

        this.on(Laya.Event.CLICK, this, this.onBetClick);
        
        this.card = new CardSet;
        this.card.centerX = 3;
        this.card.y = 172;
        this.addChild(this.card);
    }

    sendBetData () {
        Honor.io.emit(GAME_CMDS.BET_CALL, {
            'areaId' : this.index + 1,
            'amount' : this.betRealValue
        });
        this.betRealValue = 0;
    }

    onBetClick () {
        if(!this._enableBet){return;}
        if(this.betRealValue == 0){
            Laya.timer.once(300, this, this.sendBetData);
        }

        this.betRealValue += this.betValue;
    }

    updateBetCall (data) {
        let diff = 0;
        if(data > 0){
            this.betFlag = true;
            diff = data - this.betMineTotal;

            this.betMine.text = data;
            this.betMineTotal = data;
            this.betMineBox.visible = true;
            return diff;
        }
        return diff;
    }

    updateBetInfo (data) {
        if(data > 0){
            this.betTotal.text = data;
        }
    }

    updateBetResult (betInfo) {
        this.betResult = betInfo;
    }

    dealer (cardInfo) {
        this.card.dealer(cardInfo);
    }

    turn () {
        if(this.betResult){
            this.betMine.text = `x${this.betResult.multiple}  ${this.betResult.betAmont}`;
        }else{
            this.betMine.text = "没有投币";
        }
        this.card.turn();
        this.betMineBox.visible = true;
    }

    changeBetValue (value) {
        this.betValue = value;
    }

    reset () {
        console.log(`BetArea reset, type : ${this.type}`);
        this.enableBet = true;
        this.betResult = null;
        this.betFlag = false;
        this.betMineTotal = 0;
        this.betRealValue = 0;

        this.card.reset();
        this.betMineBox.visible = false;
        this.betTotal.text = `${0}`;
        this.betMine.text = "--";
    }

    get enableBet () {
        return this._enableBet;
    }

    set enableBet (val) {
        // console.trace(val);
        this._enableBet = val;
    }
}

        
class BetArea extends Laya.Box {
    private betAreas:object = {};
    private coins = [[], [], [], []];
    private ACTIONS:object = null;
    private seatsPos:object = null;
    private bankerPos:Laya.Point = null;
    private userPos:Laya.Point = null;
    private playsPos:Laya.Point = null;
    private poolAwardData:any = null;
    constructor () {
        super();

        this.init();
    }

    destroy () {
        super.destroy();
        Honor.io.unregister(this.ACTIONS);
    }

    init () {
        this.size(1010, 285);
        this.centerX = 0;
        this.centerY = 34;

        for(let i = 0; i < 4; i++){
            let area = new Area(i);
            
            this.betAreas[area.type] = area;
            this.addChild(area);
        }

        this.ACTIONS = {
            [GAME_CMDS.GET_ROOM_INFO] : this.restore,
            [GAME_CMDS.ROUND_OVER] : this.roundOver,
            [GAME_CMDS.ROUND_START] : this.roundStart,
            [GAME_CMDS.SEAT_BET_CALL] : this.seatBetCall,
            [GAME_CMDS.BET_CALL] (data, code) {
                if(code != "000"){return;}
                this.betCall(data)
            },
            [GAME_CMDS.BET_INFO] (data) {this.betInfo(data)},
            [GAME_CMDS.AWARD_POOL] (data) {
                this.poolAwardData = data;
            },
            [GAME_CMDS.BANKER_DOWN_ROOM] (data) {
                for(let i in this.betAreas){
                    let betArea = this.betAreas[i];
                    betArea.reset();
                    // betArea.enableBet = false;
                }
                this.coins.map((item, index) => {
                    item.map((coin, index) => coin.recover());
                    item.splice(0, item.length);
                });
            },

            "countdown.waitingfordeal" () {
                for(let i in this.betAreas){
                    this.betAreas[i].enableBet = false;
                }
            },
            "bet.change" : this.changeBetValue,
            "seats.pos" (data) {
                console.log("seats.pos", data);
                let seatsPos = {};
                for(let i in data){
                    seatsPos[i] = this.globalToLocal(data[i], true);
                }
                this.seatsPos = seatsPos;
            },
            "banker.pos" (data) {
                console.log("banker.pos", data);
                this.bankerPos = this.globalToLocal(data, true);
            },
            "user.pos" (data) {
                console.log("user.pos", data);
                this.userPos = this.globalToLocal(data, true);
            },
            "plays.pos" (data) {
                console.log("plays.pos", data);
                this.playsPos = this.globalToLocal(data, true);
            }
        };
        Honor.io.register(this.ACTIONS, this);
    }

    betCoinFly (seatId, areaId, ani = true) {
        let startPos = null;
        let endPos = {x : getRandom(BET_AREA_POS[areaId - 1].x - 95, BET_AREA_POS[areaId - 1].x + 95), y : getRandom(55, 150)};
        let recover = this.coins[areaId - 1].length > 150 ? true : false;
        if(seatId <= 8){
            startPos = this.seatsPos[seatId];
        }else if(seatId == 9){
            startPos = this.userPos;
        }else if(seatId == 10){
            startPos = this.playsPos;
        }

        let coin = Coin.create(startPos, endPos, ani, recover);
        !recover && this.coins[areaId - 1].push(coin);
        console.log("BetArea betCoinFly", this.coins[areaId - 1].length);
        this.addChild(coin);
    }

    restore (data) {
        data.myInfo && this.betCall(data.myInfo, true)
        this.betInfo(data, true);
    }

    roundOver (data) {
        let cardInfo = data.cardInfo;
        let myResult = data.settlement.myResult;
        let multiple = (myResult && myResult.multiple) || [];

        for(let i = 0; i < multiple.length; i ++){
            this.betAreas[multiple[i].area].updateBetResult(multiple[i]);
        }

        for(let i in this.betAreas){
            let betArea = this.betAreas[i];
            let index = betArea.index;
            let _cardInfo = cardInfo[`${betArea.type}Card`];
            let coins = this.coins[index];
            
            if(_cardInfo.res == "lose"){
                for(let i = coins.length - 1; i >= 0; i--){
                    let coin = coins.splice(i, 1)[0];
                    
                    (function (_coin, i, pos) {
                        setTimeout(function() {
                            coin.fly(null, pos, true);
                        }, 10500 + i * 5);
                    })(coin, i, this.bankerPos);
                }
            }else{
                if(betArea.betFlag){
                    for(let i = coins.length - 1; i >= 0; i--){
                        let coin = coins.splice(i, 1)[0];
                        
                        (function (_coin, i, pos) {
                            setTimeout(function() {
                                coin.fly(null, pos, true);
                            }, 10500 + i * 5);
                        })(coin, i, this.userPos);
                    }
                }
            }

            Laya.timer.once((index + 1) * 1000, betArea, function (i, _info) {
                this.dealer(_info);
                Laya.timer.once(5500, this, this.turn);
            }, [index, _cardInfo]);
        }

        if(data.settlement && data.settlement.preFive && data.settlement.preFive.length != 0){
            Laya.timer.once(11000, this, function (settlement, poolAwardData) {
                Honor.io.emit(GAME_CMDS.USE_INFO, {type : "game"});
                Honor.director.openDialog(Result, [settlement], {
                    onClosed () {
                        if(poolAwardData){
                            console.log("RoundOver poolAwardData", data);
                            Honor.director.openDialog(Prize, [poolAwardData], {
                                onClosed () {
                                    if(myResult.shareCode){
                                        Honor.director.openDialog(SharePrize, [{award_amount : myResult.poolAmount, amount : myResult.shareAmount, share_code : myResult.shareCode}]);
                                    }
                                }
                            });
                        }

                        //救济金
                        if (window.GM && GM.socket_RJ && GM.socket_RJ.exec) {
                            GM.socket_RJ.exec();
                            //更新余额
                            Honor.io.emit(GAME_CMDS.USE_INFO);
                        }
                    }
                });
            }, [data.settlement, this.poolAwardData]);
        }
        this.poolAwardData = null;
    }

    roundStart (data) {
        for(let i in this.betAreas){
            this.betAreas[i].reset();
        }
        this.coins.map((item, index) => {
            item.map((coin, index) => coin.recover());
            item.splice(0, item.length);
        });
    }

    betCall (data, restore) {
        if(restore){
            for(let i in this.betAreas){
                let betArea = this.betAreas[i];
                let amount = data[`${betArea.type}Amount`];
                betArea.updateBetCall(amount);
                console.log("BetArea betCall restore", betArea.type, amount);
            }
        }else{
            let betArea = this.betAreas[BET_AREA_POS[data.areaId - 1].type];
            let amount = data[`${betArea.type}Amount`];
            console.log("BetArea betCall", betArea.type, amount);
            if(amount > 0){
                let betDiff = betArea.updateBetCall(amount);
                if(!restore && betDiff > 0){
                    let size = Math.ceil(betDiff / 300);
                    for(let i = 0; i < size; i++){
                        this.betCoinFly(9, data.areaId);
                    }
                }
            }
        }
    }

    betInfo (data, restore) {
        let enableBet = false;
        if(restore){
            if(data.leftTime > 0 && data.betTime){
                enableBet = true;
            }
        }
        for(let i in this.betAreas){
            let betArea = this.betAreas[i];
            let amount = data[`${betArea.type}Amount`];
            let size = Math.ceil(amount / 300) - this.coins[betArea.index].length;

            betArea.updateBetInfo(amount);
            restore && (betArea.enableBet = enableBet);

            for(let i = 0; i < size; i++){
                this.betCoinFly(10, betArea.index + 1, !restore);
            }
        }
    }

    seatBetCall (data) {
        if(data.userId != GM.user_id){
            // this.betCoinFly(data.seatId, data.areaId);
            this.betCoinFly(10, data.areaId);
        }
    }

    changeBetValue (value) {
        for(let i in this.betAreas){
            this.betAreas[i].changeBetValue(value);
        }
    }

    enter () {}
    resize (width, height, rate) {
        if(rate <= 1){
            this.scale(rate, rate);
        }else{
            this.scale(1, 1);
        }
    }
}

export default BetArea;
/*
____data = {
    "betUserList": [
        "86535486",
        "86547034",
        "2488910",
        "91271459",
        "12550662",
        "91271155",
        "86538986",
        "92054595",
        "92054351",
        "92054413"
    ],
    "cardInfo": {
        "zhuangCard": {
            "num": ["D12","D9","D1","C2","H11"],
            "type": "CARD_TYPE_NIU_TWO"
        },
        "tianCard": {
            "num": ["D8","C13","C12","H7","S9"],
            "type": "CARD_TYPE_NIU_NULL",
            "res": "lose"
        },
        "diCard": {
            "num": ["D2","D13","S8","H10","H6"],
            "type": "CARD_TYPE_NIU_SIX",
            "res": "win"
        },
        "shunCard": {
            "num": ["S13","S7","C3","C8","H13"],
            "type": "CARD_TYPE_NIU_ENGHT",
            "res": "win"
        },
        "xuanCard": {
            "num": ["C1","H2","D10","C10","H1"],
            "type": "CARD_TYPE_NIU_NULL",
            "res": "lose"
        }
    },
    "settlement": {
        "preFive": [
            {
                "userId": "12550662",
                "amount": 17480,
                "userName": "159****6290",
                "avator": ""
            },
            {
                "userId": "86547034",
                "amount": 570,
                "userName": "182****6008",
                "avator": ""
            },
            {
                "userId": "92054413",
                "amount": 280,
                "userName": "171****0371",
                "avator": ""
            },
            {
                "userId": "86535486",
                "amount": 180,
                "userName": "182****8478",
                "avator": ""
            },
            {
                "userId": "91271155",
                "amount": 180,
                "userName": "131****4512",
                "avator": ""
            }
        ],
        "myResult": {
            "amount": 6,
            "multiple": [
                {
                    "area": "tian",
                    "multiple": 1,
                    "betAmont": -30,
                    "feeAmont": 1
                },
                {
                    "area": "shun",
                    "multiple": 2,
                    "betAmont": 20,
                    "feeAmont": 1
                }
            ],
            "userName": "Jan2014",
            "avator": "",
            "ticketAmount": 4,
            "ticketFlag": 1,
            "poolAmount": 0
        }
    },
    "ticketFlag": 1,
    "poolAmount": 152373
}
*/

//{"cmd":"room::roundOver","code":"000","msg":"success","data":{"betUserList":["2037596098"],"cardInfo":{"zhuangCard":{"num":["G14","G15","C10","S3","S10"],"type":"CARD_TYPE_ZHA_DANG"},"tianCard":{"num":["D10","S8","S2","C13","S6"],"type":"CARD_TYPE_NIU_SIX","res":"lose"},"diCard":{"num":["D1","D6","C3","C2","C1"],"type":"CARD_TYPE_NIU_THREE","res":"lose"},"shunCard":{"num":["H12","S4","D9","S5","H2"],"type":"CARD_TYPE_NIU_NULL","res":"lose"},"xuanCard":{"num":["D3","C5","D8","H10","H13"],"type":"CARD_TYPE_NIU_NULL","res":"lose"}},"settlement":{"preFive":[{"userId":"2037587830","amount":92,"userName":"nihao","avator":""}],"myResult":{"amount":-100,"multiple":[{"area":"tian","multiple":5,"betAmont":-10,"feeAmont":1},{"area":"di","multiple":5,"betAmont":-10,"feeAmont":1}],"userName":"lan6","avator":"","ticketAmount":4,"ticketFlag":1,"poolAmount":0}},"ticketFlag":1,"poolAmount":224258}}


//{"cmd":"room::roundOver","code":"000","msg":"success","data":{"betUserList":["2037596098","2037596530"],"cardInfo":{"zhuangCard":{"num":["S12","D5","C5","D12","S8"],"type":"CARD_TYPE_NIU_ENGHT"},"tianCard":{"num":["C1","H8","S1","C3","H3"],"type":"CARD_TYPE_NIU_SIX","res":"lose"},"diCard":{"num":["H5","S5","C11","D3","H7"],"type":"CARD_TYPE_NIU_NIU","res":"win"},"shunCard":{"num":["C8","D10","H2","D8","H9"],"type":"CARD_TYPE_NIU_SEVEN","res":"lose"},"xuanCard":{"num":["S3","C4","D9","S2","H10"],"type":"CARD_TYPE_NIU_NULL","res":"lose"}},"settlement":{"preFive":[{"userId":"2037587830","amount":1298,"userName":"nihao","avator":""}],"myResult":{"amount":-324,"multiple":[{"area":"tian","multiple":2,"betAmont":-100,"feeAmont":4},{"area":"di","multiple":3,"betAmont":100,"feeAmont":6},{"area":"shun","multiple":2,"betAmont":-100,"feeAmont":4},{"area":"xuan","multiple":2,"betAmont":-100,"feeAmont":4}],"userName":"la*******g7","avator":"","ticketAmount":36,"ticketFlag":1,"poolAmount":0}},"ticketFlag":1,"poolAmount":193277}}

/*
Honor.io.publish("room::betInfo", {"tianAmount":0,"diAmount":0,"shunAmount":0,"xuanAmount":0,"leftAmount":13054}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":0,"diAmount":0,"shunAmount":50,"xuanAmount":0,"leftAmount":13004}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":50,"diAmount":50,"shunAmount":50,"xuanAmount":0,"leftAmount":12904}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":50,"diAmount":50,"shunAmount":50,"xuanAmount":50,"leftAmount":12854}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":50,"diAmount":100,"shunAmount":50,"xuanAmount":100,"leftAmount":12754}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":100,"diAmount":100,"shunAmount":50,"xuanAmount":100,"leftAmount":12704}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":100,"diAmount":100,"shunAmount":100,"xuanAmount":100,"leftAmount":12654}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":100,"diAmount":100,"shunAmount":150,"xuanAmount":100,"leftAmount":12604}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":150,"diAmount":100,"shunAmount":150,"xuanAmount":100,"leftAmount":12554}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":150,"diAmount":150,"shunAmount":150,"xuanAmount":150,"leftAmount":12454}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":150,"diAmount":150,"shunAmount":150,"xuanAmount":200,"leftAmount":12404}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":150,"diAmount":150,"shunAmount":150,"xuanAmount":350,"leftAmount":12254}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":150,"diAmount":150,"shunAmount":150,"xuanAmount":600,"leftAmount":12004}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":150,"diAmount":150,"shunAmount":150,"xuanAmount":650,"leftAmount":11954}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":0,"diAmount":0,"shunAmount":0,"xuanAmount":0,"leftAmount":13314}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":0,"diAmount":0,"shunAmount":0,"xuanAmount":0,"leftAmount":13314}, "000")

Honor.io.publish("room::betInfo", {"tianAmount":0,"diAmount":0,"shunAmount":0,"xuanAmount":0,"leftAmount":13314}, "000")
*/