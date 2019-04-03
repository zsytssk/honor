import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS } from "../define";

let ACTIONS = {
    [GAME_CMDS.CHATLIST] (data) {
        this.chatTextList.array = data || [];
    }, //聊天语句列表
    [GAME_CMDS.EXPRESS] (data) {
        this.chatEmoList.array = data || [];
    }//表情列表
}; 
class Chat extends ui.views.Alert.ChatUI {
    constructor () {
        super();
        
        this["CONFIG"] = {
            "popupCenter" : false,
            "closeOnSide" : true
        };

        this.init();
    }

    init () {
        this.left = 110;
        this.bottom = 10;
        
        this.chatTab.selectHandler = this.chatCon.setIndexHandler;
        this.chatTextList.selectHandler = Laya.Handler.create(this, this.onTextSelect);
        this.chatEmoList.selectHandler = Laya.Handler.create(this, this.onEmoSelect);
        this.chatTextList.array = [];
        this.chatEmoList.array = [];
        this.chatTab.selectedIndex = 0;

        Honor.io.register(ACTIONS, this);
        Honor.io.emit(GAME_CMDS.CHATLIST);
        Honor.io.emit(GAME_CMDS.EXPRESS);
    }

    onTextSelect (index) {
        Honor.io.emit(GAME_CMDS.SENDLANGUAGE, {"langId" : this.chatTextList.array[index].id});

        this.close();
    }

    onEmoSelect (index) {
        Honor.io.emit(GAME_CMDS.SENDEXPRESS, {"icoId" : this.chatEmoList.array[index].id});

        this.close();
    }
}
export default Chat;