import { ui } from "../ui/layaMaxUI";
import HallRank from "./rank";
import Header from "./header";
import Entrace from "./entrace";
import { GAME_CMDS, GAME_CONFIG } from "../define";
import Guide from "../alert/guide";
import Utils from "../libs/utils";

let actions = {
    [GAME_CMDS.NEWUSER] (data) {
        if(data.isNewUser==1){
            Honor.director.openDialog(Guide); 
        }
    },
    [GAME_CMDS.INROOM] (data) {
        Honor.director.runScene("Hall/Scene.scene");
        // if(ASSETS.Room.Finished){
        //     Honor.director.runScene(new Scene.Room());
        // }else{
        //     Honor.director.runScene(new Scene.Load(ASSETS.Room, () => {
        //         Honor.director.runScene(new Scene.Room);
        //     }));
        // }
    }
};
class Hall extends ui.views.Hall.SceneUI {
    private bgImg:Laya.Image = null;
    private girlAni:Laya.Skeleton = null;
    private header:Header = null;
    private rank:HallRank = null;
    private entrace:Entrace = null;
    constructor () {
        super();
        console.log("Hall constructor")

        this.init();
    }

    init () {
        Honor.io.register(actions);
        let rate = Laya.stage.height / GAME_CONFIG.HEIGHT;
        
        let bgImg = new Laya.Image("res/hall/bg_hall.jpg");
            bgImg.scale(2, 2);
            bgImg.centerX = 0;
            bgImg.centerY = 0;
        
        let girlAni = Utils.createSkeleton("res/hall/girl");
            girlAni.pos(GAME_CONFIG.WIDTH / 2 - 50, Laya.stage.height + (rate <= 1 ? (1 - rate) * 800 : 0));
            girlAni.scale(2, 2);
            girlAni.play(0, true);

        let btnInvite = new Laya.Button("res/hall/btn_invite.png");
            btnInvite.stateNum = 1;
            btnInvite.centerX = -224;
            btnInvite.centerY = -206;
            btnInvite.on(Laya.Event.CLICK, this, function () {
                window.GM && GM.showInvitePop && GM.showInvitePop();
            });
        if(window.GM && GM.isShowInvite){
            btnInvite.visible = GM.isShowInvite();
        }else{
            btnInvite.visible = false;
        }

        this.bgImg = bgImg;
        this.girlAni = girlAni;
        this.header = new Header();
        this.rank = new HallRank();
        this.entrace = new Entrace();

        this.addChildren(bgImg, girlAni, this.rank, this.entrace, this.header, btnInvite);
    }

    onEnter () {
        this.header.enter();
        this.rank.enter();
        this.entrace.enter();

        if(GM.newUser){
            Honor.director.openDialog(Guide);
        }
    }

    onExit () {
        Honor.io.unregister(actions);
    }

    onResize (width, height) {
        let rate = height / GAME_CONFIG.HEIGHT;
        
        this.girlAni.y = height + (rate <= 1 ? (1 - rate) * 800 : 0);
        this.rank.resize(width, height, rate);
        this.entrace.resize(width, height, rate);
    }
}

export default Hall;