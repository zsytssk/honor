import { GAME_CMDS } from "../define";

let tpl = [
    '{{if userName}}<span>【用户】</span><span style="color:#fffc00">{{userName}}</span><span>说：</span>{{/if}}',
    '{{if content}}',
        '<span style="{{if userName}}color:#ff003c{{else}}color:#ffffff{{/if}}">{{content}}</span>',
    '{{else}}',
        '<img style="width:45px;height:45px;" src="{{url}}" />',
    '{{/if}}'
].join("");
let ACTIONS = {
    [GAME_CMDS.SENDEXPRESS] (data) {
        Laya.Tween.to(this, {alpha : 1}, 300);
        this.notify.add(data);
    },
    [GAME_CMDS.SENDLANGUAGE] (data) {
        Laya.Tween.to(this, {alpha : 1}, 300);
        this.notify.add(data);
    },
    [GAME_CMDS.NOTICE_MAIN] (data) {
        Laya.Tween.to(this, {alpha : 1}, 300);
        this.notify.add(data);
    }
}
class Chat extends Laya.Image {
    private notify:any = null;
    constructor () {
        super();

        this.init();
    }

    destroy () {
        super.destroy();
        Honor.io.unregister(ACTIONS);
    }

    init () {
        this.x = 108;
        this.skin = "res/room/notify_bg.png";
        this.alpha = 0;

        let config = {
            "width" : this.width,
            "fontSize" : 36,
            "tpl" : tpl,
            "speed" : 150,
            "complete" : function () {
                Laya.Tween.to(this, {alpha : 0}, 300);
            }.bind(this)
        };

        this.notify = new Honor.Notify(config);
        this.addChild(this.notify);

        Honor.io.register(ACTIONS, this);
    }

    enter () {}
}

export default Chat;