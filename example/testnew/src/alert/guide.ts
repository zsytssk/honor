import { ui } from "../ui/layaMaxUI";
import { GAME_CONFIG, GAME_CMDS } from "../define";

class Guide extends ui.views.Alert.GuideUI {
    constructor() {
        super();

        this.init();
    }

    init() {
        this.anchorX = 0.5;
        this.anchorY = 0.5;

        new zsySlider(this.helpWarp);

        Honor.io.register(GAME_CMDS.USER_RATE, this, this.uperRate)
        Honor.io.emit(GAME_CMDS.USER_RATE);

        this.btnSkip.on(Laya.Event.CLICK, this, function () {
            Laya.SoundManager.playSound("sound/btn.mp3");
            this.close();
        });
    }
    uperRate(data) {
        this.bomb.text = data.bomb + "倍";
        this.wu_hua.text = data.wu_hua + "倍";
        this.si_hua.text = data.si_hua + "倍";
        this.niu_niu.text = data.niu_niu + "倍";
        this.niu_ba.text = data.niu_ba + "倍";
        this.niu_yi.text = data.niu_yi + "倍";
        this.niu_lin.text = data.niu_lin + "倍";
    }
    onOpened () {
        let rate = Laya.stage.height / GAME_CONFIG.HEIGHT;
        if(rate <= 1){
            this.scale(rate, rate);
        }else{
            this.scale(1, 1);
        }
    }
    onClosed() {
        Honor.io.unregister(GAME_CMDS.USER_RATE, this, this.uperRate)
    }
}

export default Guide;