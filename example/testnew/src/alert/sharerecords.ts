import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS, GAME_CONFIG } from "../define";
import SharePrize from "./shareprize";

class ShareRecords extends ui.views.Alert.ShareRecordsUI {
    constructor () {
        super();

        this.anchorX = 0.5;
        this.anchorY = 0.5;
        
        this.rewardsList.array = [];
        this.recordsList.array = [];

        Honor.io.register(GAME_CMDS.SHARE_RECORD, this, this.updateRecords);

        this.rewardsList.renderHandler = new Laya.Handler(this, this.onRewardsRender);
        this.shareTab.selectHandler = new Laya.Handler(this, this.onTabChangeed);
        this.shareTab.selectedIndex = 0;
    }

    onRewardsBtnClicked (shareData) {
        console.log(shareData);
        this.close();
        Honor.director.openDialog(SharePrize, [shareData]);
    }

    onRewardsRender (item, index) {
        item.getChildByName("btn_share").off(Laya.Event.CLICK, this, this.onRewardsBtnClicked).on(Laya.Event.CLICK, this, this.onRewardsBtnClicked, [item.dataSource]);
    }

    onTabChangeed (index) {
        this.noRecords.visible = false;
        this.rewardsList.array = [];
        this.recordsList.array = [];

        Honor.io.emit(GAME_CMDS.SHARE_RECORD, {type : index + 1});
    }

    updateRecords (data, code, msg){
        if(code != "000"){return;}
        
        if(!data.length){
            this.noRecords.visible = true;
            return;
        }
        data.forEach(function(value, index) {
            value.bg = {visible : index % 2};
        }, this);

        switch (this.shareTab.selectedIndex) {
            case 0:
                this.rewardsList.array = data;
                break;
            case 1:
                this.recordsList.array = data;
                break;
        }
        this.shareCon.selectedIndex = this.shareTab.selectedIndex;
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

export default ShareRecords;