import { ui } from "../ui/layaMaxUI";

export default class extends ui.dialog.TestDialog2UI{
    constructor () {
        super();

    }

    onMounted (data) {
        console.log(`分离模式URL onMounted.${data}`);
    }

    onEnable () {
        console.log("分离模式URL onEnable.");
    }

    onOpened () {
        console.log("分离模式URL onOpened.");
    }
}