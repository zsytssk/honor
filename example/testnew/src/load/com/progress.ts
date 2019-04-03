
class Progress extends Laya.Box {
    private tips:Laya.Label = null;
    private proBg:Laya.Image = null;
    private proBar:Laya.Image = null;
    constructor () {
        super();
        
        this.init();
    }

    destroy () {
        super.destroy();
        this.tips = null;
        this.proBg = null;
        this.proBar = null;
    }

    init () {
        this.size(390, 34);

        this.createUI();
    }

    createUI () {
        let tips = new Laya.Label("游戏加载中...0%");
            tips.fontSize = 22;
            tips.color = "#ffffff";
            tips.centerX = 0;
            tips.top = -46;

        let proBg = new Laya.Image("res/load/pro_bg.png");
            proBg.centerX = 0;
            proBg.centerY = 4;

        let proBar = new Laya.Image("res/load/pro_bar.png");
            proBar.sizeGrid = "20,25,20,25";
            proBar.size(0, this.height);

        this.tips = tips;
        this.proBg = proBg;
        this.proBar = proBar;
        this.addChildren(tips, proBg, proBar);
    }

    onFinished (assets, callback) {
        assets.Finished = true;
        callback && callback();
    }

    onProgress (value) {
        this.tips.text = `游戏加载中...${value * 100 | 0}%`;
        this.proBar.width = value * this.width;
    }

    load (name, callback) {
        Laya.loader.load(name.Res, Laya.Handler.create(this, this.onFinished, [name, callback]), Laya.Handler.create(this, this.onProgress, null, false));
    }
}

export default Progress;