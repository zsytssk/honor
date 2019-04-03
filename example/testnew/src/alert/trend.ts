import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS, GAME_CONFIG } from "../define";

const RATE_NAME_MAP = {
    "shun"  : "rateShun",
    "tian"  : "rateTian",
    "di"    : "rateDi",
    "xuan"  : "rateXuan",
    "count" : "rateCount",
};
const CMD_MAP = {
    0 : GAME_CMDS.HISTORY_CARD,
    1 : GAME_CMDS.RICH_LIST
};
const MASK_POS = [203, 490];

class Trend extends ui.views.Alert.TrendUI {
    private actions:object = null;
    constructor (data) {
        super();
        
        this.trendList.array = [];
        this.richList.array = [];

        this.anchorX = 0.5;
        this.anchorY = 0.5;

        for(let i = 0; i < MASK_POS.length; i++){
            let mask = new Laya.Image("res/alert/public/public_mask.png");
                mask.size(237, 10).pos(MASK_POS[i], 0);
                mask.blendMode = "destination-out";
            this.bgimg.addChild(mask);
        }

        this.actions = {
            [GAME_CMDS.HISTORY_CARD] (data) {
                let {list, percent} = data;

                this.updateTrendList(list, percent);
                this.updateRate(percent);

                this.trendCon.selectedIndex = this.trendTab.selectedIndex;
            },
            [GAME_CMDS.RICH_LIST] (data) {
                this.richList.array = data;
                this.trendCon.selectedIndex = this.trendTab.selectedIndex;
            }
        };
        Honor.io.register(this.actions, this);

        this.trendTab.selectHandler = new Laya.Handler(this, this.onTabChangeed);
        this.trendTab.selectedIndex = 0;
    }

    onTabChangeed (index) {
        Honor.io.emit(CMD_MAP[index]);
    }

    updateTrendList (list, showMaxList) {
        if(!list || list.length === 0){return;}

        showMaxList && (this.trendList.width = 670);

        list.reverse();
        list.forEach((val, index) => {
            val.shun = val.shun == "win" ? 1 : 0;
            val.tian = val.tian == "win" ? 1 : 0;
            val.di   = val.di   == "win" ? 1 : 0;
            val.xuan = val.xuan == "win" ? 1 : 0;
            if(index == list.length - 1){
                val.dot = "res/alert/trend/icon_dot_new.png";
                val.iconNew = {
                    visible : true
                };
            }else{
                val.dot = "res/alert/trend/icon_dot.png";
                val.iconNew = {
                    visible : false
                };
            }
        });

        this.trendList.array = list;
        this.trendList.scrollTo(list.length - 1);
    }

    updateRate (percent) {
        if(percent){
            for(let i in RATE_NAME_MAP){
                this[`${RATE_NAME_MAP[i]}`].text = i != "count" ? `${percent[i]}%` : `*统计近${percent[i]}局的胜负情况`;
            }
            this.rateBox.visible = true;
        }
    }

    onOpened () {
        let rate = Laya.stage.height / GAME_CONFIG.HEIGHT;
        if(rate <= 1){
            this.scale(rate, rate);
        }else{
            this.scale(1, 1);
        }
    }

    onClosed () {
        Honor.io.unregister(this.actions);
    }
}

export default Trend;