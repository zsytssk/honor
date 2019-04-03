import { ui } from "../ui/layaMaxUI";

export default class Dialog3 extends ui.dialog.TestDialog3UI{
    constructor () {
        super();

    }

    onMounted (data) {
        console.log(`分离模式Class onMounted.${data}`);
    }

    onEnable () {
        console.log("分离模式Class onEnable.");
    }

    onOpened () {
        console.log("分离模式Class onOpened.");
    }
}