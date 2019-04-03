import Progress from "./com/progress";
import { GAME_CONFIG } from "../define";

class Load extends Laya.Scene {
    private bg:Laya.Image = null;
    private logo:Laya.Image = null;
    private loadPro:Progress = null;
    private noticeBox:Laya.Box = null;
    private noticeBG:Laya.Box = null;
    private notice:Laya.Image = null;
    constructor (name, callback) {
        super();
        
        this.init(name, callback);
    }

    init (name, callback) {
        this.createUI();
        this.loadPro.load(name, callback);
    }

    createUI () {
        let bg = new Laya.Image("res/load/bg.jpg");
            bg.scale(2, 2);
            bg.anchorX = 0.5;
            bg.anchorY = 0.5;
            bg.centerX = 0;
            bg.centerY = 0;
        
        // let aniLoad = Honor.Utils.createSkeleton("res/load/load");
        //     aniLoad.pos(bg.width / 2, bg.height / 2);
        //     aniLoad.play("load", true);

        let logo = new Laya.Image("res/load/logo.png");
            logo.right = 110;
            logo.top = 80;

        let loadPro = new Progress();
            loadPro.centerX = 0;
            loadPro.bottom = 180;

        let noticeBox = new Laya.Box();
            noticeBox.size(GAME_CONFIG.WIDTH, 115);
            noticeBox.centerX = 0;
            noticeBox.bottom = 20;
        
        let noticeBG = new Laya.Box();
            noticeBG.graphics.drawRect(0, 0, noticeBox.width, noticeBox.height, "#000000");
            noticeBG.alpha = 0.3;

        let notice = new Laya.Image("res/load/notice.png");
            notice.centerX = 0;
            notice.y = 3;

        // bg.addChild(aniLoad);
        noticeBox.addChildren(noticeBG, notice);

        let mask = new Laya.Image("res/load/mask.png");
            mask.left = 0;
            mask.right = 0;
            mask.top = 0;
            mask.bottom = 0;

        this.bg = bg;
        // this.aniLoad = aniLoad;
        this.logo = logo;
        this.loadPro = loadPro;
        this.noticeBox = noticeBox;
        this.noticeBG = noticeBG;
        this.notice = notice;
        this.addChildren(bg, logo, loadPro, noticeBox, mask);

        //资质信息
        if(laya.components && laya.components.Isbn){
            let isbn = new laya.components.Isbn();
            this.addChild(isbn);
        }
    }
}

export default Load;