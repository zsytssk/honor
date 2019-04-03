import { ui } from "../ui/layaMaxUI";
import { GAME_CMDS } from "../define";

class BetTotal extends ui.views.Room.BetTotalUI {
    private ACTIONS:object = null;
    constructor () {
        super();
        
        this.init();
    }

    destroy () {
        super.destroy();
        Honor.io.unregister(this.ACTIONS);
    }

    init () {
        this.pos(721, 110);

        this.ACTIONS = {
            [GAME_CMDS.GET_ROOM_INFO] (data) {
                this.betTotal.text = data.leftAmount || 0;
            },
            [GAME_CMDS.BET_INFO] (data) {
                this.betTotal.text = data.leftAmount || 0;
            },
            [GAME_CMDS.BANKER_DOWN_ROOM] () {
                this.betTotal.text = 0;
            }
        };

        Honor.io.register(this.ACTIONS, this);
    }

    enter () {}
}

export default BetTotal;