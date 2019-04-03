
import { ui } from "../ui/layaMaxUI";
import Utils from "../libs/utils";
import { GAME_CONFIG } from "../define";

class OperateList extends ui.views.Alert.OperateListUI {
    constructor (data) {
        super();

        this.operateList.array = [];
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        
        this.init(data);
    }

    init (data) {
        if(!data || data.length === 0){
            this.noData.visible = true;
            return;
        }
        for(let i in data){
            let _data = data[i];
            _data["bg"] = {};
            _data.rank = (i | 0) + 1;
            _data.user_name = Utils.cutStr(_data.name, 8);
            if(i % 2){
                _data["bg"].visible = true;
            }else{
                _data["bg"].visible = false;
            }
        }
        this.operateList.array = data;
    }
    
    onOpened () {
        let rate = Laya.stage.height / GAME_CONFIG.HEIGHT;
        if(rate <= 1){
            this.scale(rate, rate);
        }else{
            this.scale(1, 1);
        }
    }
}

export default OperateList;