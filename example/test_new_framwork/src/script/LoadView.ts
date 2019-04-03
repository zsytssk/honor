import { ui } from "../ui/layaMaxUI";

export default class LoadView extends ui.loadViewUI{
    constructor(){
        super();
        this.on("progress", this, this.onLoadProgress);
    }

    onLoadProgress(val:number){
        this.loading.value = val;
    }
}