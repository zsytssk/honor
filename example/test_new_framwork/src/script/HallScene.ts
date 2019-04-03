import { ui } from "../ui/layaMaxUI";
import GameUI from "./GameUI";
import Dialog1 from "../dialog/Dialog1";
import Dialog3 from "../dialog/Dialog3";

const EVENT_CLICK = Laya.Event.CLICK;

class HallScene extends ui.test.HallSceneUI{
    constructor(){
        super();

        this.btnEnter.on(EVENT_CLICK, this, function () {
            // Laya.Scene.open("test/testScene.scene");
            // Honor.director.runScene("test/testScene.scene");
            Honor.director.runScene(GameUI);
        });

        this.btnShowDialogByUrl.on(EVENT_CLICK, this, function () {
            Honor.director.openDialog(Dialog1, ["test data1"]);
        });
        this.btnShowDialogByClass1.on(EVENT_CLICK, this, function () {
            Honor.director.openDialog("dialog/TestDialog2.scene", ["test data2"]);
        });
        this.btnShowDialogByClass2.on(EVENT_CLICK, this, function () {
            Honor.director.openDialog(Dialog3, ["test data3"]);
        });
    }

    onEnable () {
        console.log("HallScene onEnable")
    }
}

export default HallScene;