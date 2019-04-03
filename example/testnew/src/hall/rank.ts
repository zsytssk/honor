import { ui } from "../ui/layaMaxUI";
import Utils from "../libs/utils";
import { GAME_CMDS, GAME_CONFIG } from "../define";

let getAvatar = Utils.getAvatar;

class HallRank extends ui.views.Hall.RankUI {
    constructor () {
        super();

        this.init();
    }

    destroy () {
        super.destroy();
        Honor.io.unregister(GAME_CMDS.RANK, this.update);
    }

    init () {
        let rate = Laya.stage.height / GAME_CONFIG.HEIGHT;
        if(rate <= 1){
            this.scale(rate, rate);
        }
        this.x = 30;
        this.centerY = 75;

        this.rankTab.selectHandler = this.rankCon.setIndexHandler;
        this.rankPlayer.renderHandler = new Laya.Handler(this, this.onRankPlayerRender);
        this.rankPlayer.array = [];
        this.rankMine.array = [];
        this.btnNoLogin.on(Laya.Event.CLICK, this, function () {
            location.href = GM.userLoginUrl;
        })

        Honor.io.register(GAME_CMDS.RANK, this, this.update);
        Honor.io.emit(GAME_CMDS.RANK);
    }

    onRankPlayerRender (item, index) {
        let icon = item.getChildByName("icon");
        let rank = item.getChildByName("rank");
        let pic = item.getChildByName("avatar").getChildByName("pic");
        let skin = this.rankPlayer.array[index].avatar;
        
        if(index < 3){
            icon.visible = true;
            icon.index = index;
            rank.visible = false;
        }else{
            icon.visible = false;
            rank.visible = true;
        }

        Laya.loader.load(skin, Laya.Handler.create(pic, function (skin, texture) {
            if (texture) {
                this.skin = skin;
            }
        }, [skin]));
    }

    update (data) {
        this.updatePlayer(data.tycoons);
        this.updateMine(data.myRecod);
    }

    updatePlayer (data) {
        if(data instanceof Array && data.length != 0){
            data.map((val, i) => {
                data[i].rank = i + 1;
                data[i].avatar = data[i].avater ? data[i].avater : getAvatar(data[i].userId);
            });

            this.rankPlayer.array = data;
        }else{
            this.playerNoData.visible = true;
        }
    }

    updateMine (data) {
        if(!GM.userLogged){
            this.btnNoLogin.visible = true;
            return;
        }
        if(data instanceof Array && data.length != 0){
            this.rankMine.array = data;
        }else{
            this.mineNoData.visible = true;
        }
    }

    enter () {
        Laya.Tween.from(this, {x : this.x - this.width}, 200, Laya.Ease.backOut);
    }

    resize (width, height, rate) {
        if(rate < 1){
            this.scale(rate, rate);
        }else{
            this.scale(1, 1);
        }
    }
}

export default HallRank;