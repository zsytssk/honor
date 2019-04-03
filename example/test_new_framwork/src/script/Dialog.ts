import { ui } from "../ui/layaMaxUI";

export default class TestDialog extends ui.test.testDialogUI{
    constructor(){
        super();
        window["TestDialog"] = this;
        console.log("testDialog extends script");
        console.trace(this);

        // this.btnBack.on(Laya.Event.CLICK, this, function () {
        //     // Laya.Scene.open("test/HallScene.scene");
        //     Honor.director.runScene("test/HallScene.scene");
        // })
    }

    onOpened () {
        console.log("Dialog onOpened");
    }
}