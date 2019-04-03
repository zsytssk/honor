import { ui } from "../ui/layaMaxUI";
import Utils from "../libs/utils";
import { GAME_CMDS, GAME_CONFIG } from "../define";
import Prop from "../alert/prop";

let extend = Utils.extend;
let SEAT_POS = [
    {left : 0, top : 0},
    {left : 0, top : 130},
    {left : 0, top : 260},
    {left : 0, top : 390},
    {right : 0, top : 0},
    {right : 0, top : 130},
    {right : 0, top : 260},
    {right : 0, top : 390},
];
class Seat extends ui.views.Room.SeatUI {
    private userId:string = null;
    public seatId:string = null;
    constructor (index) {
        super();
        
        this.seatId = `${index + 1}`;

        this.init(index);
    }

    init (index) {
        extend(this, SEAT_POS[index]);

        this.on(Laya.Event.CLICK, this, function () {
            if(this.userId){
                Honor.io.emit(GAME_CMDS.GET_SEAT_USER_INFO , {seatId : this.seatId});
            }else{
                Honor.io.emit(GAME_CMDS.SIT_DOWN_USER , {seatId : this.seatId});
            }
        });
    }
    sitDown (data) {
        this.userId = data.userId;
        if(data.avater){
            Laya.loader.load(data.avater, Laya.Handler.create(this, function (skin, texture) {
                if(!this.userId){return;}
                if(texture){
                    this.avatar.skin = skin;
                }else{
                    this.avatar.skin = Utils.getAvatar(this.userId);
                }
            }, [data.avater]))
        }else{
            this.avatar.skin = Utils.getAvatar(this.userId);
        }

        this.updateScore(data.amount);
    }

    updateScore (score) {
        this.score.text = Utils.transferNumberToK(score);
    }

    standUp (data) {
        this.userId = null;
        this.avatar.skin = "res/avatar/default_seat_avatar.png";
        this.score.text = "虚位以待";
    }
}



class Players extends Laya.Box {
    private seats:object = {};
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
        this.size(1305, 510);
        this.height = 510;
        this.left = 15;
        this.right = 15;
        this.centerY = 0;
        this.mouseEnabled = true;
        this.mouseThrough = true;

        for(let i = 0; i < 8; i++){
            let seat = new Seat(i);
            this.seats[seat.seatId] = seat;
            this.addChild(seat);
        }

        this.ACTIONS = {
            [GAME_CMDS.GET_SEAT_USER_INFO] : this.showUserDetails,
            [GAME_CMDS.GET_ROOM_INFO] : this.initSeats,
            [GAME_CMDS.STAND_UP] : this.standUp,
            [GAME_CMDS.SIT_DOWN_ROOM] : this.sitDown,
            // [GAME_CMDS.SIT_DOWN_USER] : this.sitDownTips,
            [GAME_CMDS.SEAT_BET_CALL] : this.updateSeatInfo
        };
        Honor.io.register(this.ACTIONS, this);
    }

    showUserDetails (data) {
        Honor.director.openDialog(Prop, [data]);
    }

    initSeats (data) {
        let seatInfo = data.seatInfo;
        for(let i in seatInfo){
            this.seats[i].sitDown(seatInfo[i]);
        }
    }

    sitDown (data) {
        this.seats[data.seatId].sitDown(data);
    }

    standUp (data) {
        this.seats[data.seatId].standUp();
    }
    
    updateSeatInfo (data) {
        this.seats[data.seatId].updateScore(data.leftAmount);
    }

    publishPos () {
        let seatsPos = {};
        this.callLater(function () {
            for(let i in this.seats){
                let seat = this.seats[i];
                seatsPos[seat.seatId] = seat.localToGlobal({x : seat.width / 2 - 5, y : seat.height / 2 - 10}, true);
            }

            Honor.io.publish("seats.pos", seatsPos);
        });
    }

    enter () {
        this.publishPos();
    }
    resize (width, height, rate) {
        let border = 15 + (1 - rate) * 225;
        border = border > 45 ? 45 : border;
        if(rate < 1){
            this.scale(rate, rate);
            this.left = this.right = border;
        }else{
            this.scale(1, 1);
            this.left = this.right = 15;
        }

        this.publishPos();
    }
}

export default Players;