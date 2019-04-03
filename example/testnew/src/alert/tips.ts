class Tips extends Laya.Dialog {
    private bg:Laya.Image = null;
    private text:Laya.Label = null;
    constructor (msg) {
        super();

        this.group = "tips";
        this['CONFIG'] = {
            "closeByGroup" : true,
            "isModal" : false,
            "autoClose" : 2000
        };
        
        this.init();
        this.update(msg);
    }

    init () {
        let bg = new Laya.Image("res/alert/public/bg_tips.png");
            bg.sizeGrid = "15,15,15,15";
            bg.left = -110;
            bg.right = -110;
            bg.top = -50;
            bg.bottom = -50;
        
        let text = new Laya.Label();
            text.fontSize = 30;
            text.color = "#ffffff";
            text.align = "center";
            text.leading = 15;
            text.centerX = 0;
            text.centerY = 0;

        this.bg = bg;
        this.text = text;

        this.addChildren(bg, text);
    }

    update (msg) {
        this.text.text = msg;
        if(this.text.width > 500){
            this.text.wordWrap = true;
            this.text.width = 500;
        }

        this.size(this.text.width, this.text.height);
    }
}

export default Tips;