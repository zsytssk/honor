import { ui } from "../ui/layaMaxUI";

export default class Dialog1 extends ui.dialog.TestDialog1UI{
    constructor () {
        super();
    }

    onMounted (data) {
        console.log(`内嵌模式对话框 onMounted.${data}`);
    }

    onEnable () {
        console.log("内嵌模式对话框 onEnable.");
    }

    onOpened () {
        console.log("内嵌模式对话框 onOpened.");
    }
}