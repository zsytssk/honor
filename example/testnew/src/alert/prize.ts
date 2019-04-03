import { ui } from "../ui/layaMaxUI";
import Utils from "../libs/utils";


let INDEX_POS = ['操盘手','顺门','天门','地门','玄门'];
let TYPE_TEXT = {
    CARD_TYPE_ZHA_DANG : '炸弹',
    CARD_TYPE_WU_HUA : '五花',
    CARD_TYPE_SI_HUA : '四花'
};

class Prize extends ui.views.Alert.PrizeUI {
    private pooltext: any = null;
    private amount: any = null;
    constructor (data) {
        super();

        this['CONFIG'] = {autoClose : 2000};

        this.init(data);
    }

    init (data) {
        let awardpool = data || [];   
        this.textBox.height = 60 * awardpool.length;
        awardpool.forEach((item, index)=>{
            let span = new Laya.HTMLDivElement();
            span.size(570, 46);
            span.style.align = "center";
            span.style.fontSize = 26;
            let pos = INDEX_POS[item.areaId];
            span.innerHTML = '<span style="color:#f7e98a;"> '+ pos +' </span><span style="color:#ffffff">开出</span><span style="color:#f7e98a;">'+ TYPE_TEXT[item.cardType] +'</span><span style="color:#ffffff;">奖励</span><span style="color:#f7e98a;">'+item.amount+'</span><span style="color:#ffffff;">,恭喜'+ pos +'玩家!</span>';
            span.y = 60 * index;
            this.textBox.addChild(span);
        });

        let TITLE_ANI = Utils.createSkeleton("res/alert/result/prize_title");
            TITLE_ANI.pos(382, 65);

        let LIGHT_ANI = Utils.createSkeleton("res/alert/result/prize_light");
            LIGHT_ANI.pos(382, 218);

        TITLE_ANI.play(0, true);
        LIGHT_ANI.play(0, false);
        this.addChildren(TITLE_ANI, LIGHT_ANI);
    }
}

export default Prize;

/**
var data = [{"areaId":0,"cardType":"CARD_TYPE_WU_HUA","amount":240},{"areaId":3,"cardType":"CARD_TYPE_ZHA_DANG","amount":451},{"areaId":4,"cardType":"CARD_TYPE_SI_HUA","amount":99},{"areaId":1,"cardType":"CARD_TYPE_SI_HUA","amount":99},{"areaId":2,"cardType":"CARD_TYPE_SI_HUA","amount":99}];
Honor.director.popScene(new Alert.Prize(data))
 */