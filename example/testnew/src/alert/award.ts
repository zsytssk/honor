
import { ui } from "../ui/layaMaxUI";
import Utils from "../libs/utils";
const CARD_TYPE = {
    "CARD_TYPE_ZHA_DANG" : "炸弹",
    "CARD_TYPE_WU_HUA" : "五花",
    "CARD_TYPE_SI_HUA" : "四花",
};
class Award extends ui.views.Alert.AwardUI {
    constructor (data) {
        super();
        
        this.init(data);
    }

    init (data) {
        this.btnFaq.on(Laya.Event.CLICK, this, function () {
            // Honor.director.openDialog(new ui.views.Alert.PoolRuleUI);
            Honor.director.openDialog("Alert/PoolRule");
        });
        
        this.award.text = data.totalAmount;
        this.updateAwardType(data.awardType);
        this.updateWinnerList(data.userList);
    }

    updateAwardType (data) {
        let award_type = [];
        data.map((val, index) => {
            if(val["card_type"] == "CARD_TYPE_ZHA_DANG"){
                //产品要求分奖弹层只显示炸弹
                award_type.push({
                    type : CARD_TYPE[val["card_type"]],
                    rate : `${val["percent"]}%`,
                });
            }
        });

        this.awardType.array = award_type;
    }

    updateWinnerList (data) {
        data.map((val, index) => {
            val["userName"] = Utils.cutStr(val.user_name);
            val["avatar"] = Utils.getAvatar(val.user_id);
        });
        this.winnerList.array = data;
    }
}

export default Award;