
import { ui } from "../ui/layaMaxUI";
import { GAME_CONFIG } from "../define";
import Utils from "../libs/utils";

class PlayerList extends ui.views.Alert.PlayerListUI {
    constructor (data) {
        super();
        
        this.init(data);
    }
    init (data) {
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        
        this.playerList.renderHandler = new Laya.Handler(this, this.onPlayerListRender);
        this.update(data);
    }

    onPlayerListRender (item, index) {
        item.getChildByName("bg").visible = index % 2 ? true : false;
    }

    update (data) {
        this.online.text = `总人数：${data.length}`;
        for(let i = 0; i < data.length; i++){
            data[i].rank = i + 1;
            data[i].user_name = Utils.cutStr(data[i].userName, 8);
        }
        this.playerList.array = data;
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

export default PlayerList;