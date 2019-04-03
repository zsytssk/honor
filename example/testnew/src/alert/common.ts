import { ui } from "../ui/layaMaxUI";

/**
    Honor.director.popScene(new Alert.Public({
        name : "recharge_tips",
        type : 1,  //1:万里通提示 2:普通提示框
        msg : "余额不足，请先充值！",
        onConfirm : function () {
            console.log("onConfirm")
        }
    }));

    Honor.director.closeByName("recharge_tips");
 */
let EVENT_CLICK = Laya.Event.CLICK;
class Common extends ui.views.Alert.CommonUI {
    constructor (config) {
        super();
        
        this.name = config.name || "public";
        this.group = "public";
        this.init(config);
    }

    init (config) {
        this.tipsText.text = config.msg || "";
        config.type = config.type || 2;
        switch (config.type) {
            case 1:
                this.noticeAgain.visible = true;
                break;
            case 2:
                this.height = 500;
                break;
        }
        this.btnConfirm.on(EVENT_CLICK, this, function (callback) {
            callback && callback(this.noticeAgain.selected);
            this.close();
        }, [config.onConfirm]);
    }
}

export default Common;