import { ui } from "../ui/layaMaxUI";


let ICON_MAP = {
    D : 0,
    C : 1,
    H : 2,
    S : 3
};
class CardBase extends ui.views.Room.CardUI {
    constructor (index) {
        super();

        this.init(index);
    }

    init (index) {
        this.reset();
        this.x = index * 30;
    }

    update (value) {
        let icon = value.substring(0, 1);
        let num = value.substring(1);

        if(icon == "G"){
            this.joker.visible = true;
            this.icon.visible = false;
            this.num.visible = false;

            this.joker.skin = `res/room/g${num}.png`;
        }else{
            this.joker.visible = false;
            this.icon.visible = true;
            this.num.visible = true;

            if(icon == "S" || icon == "C"){
                this.num.skin = "res/room/poker_red.png";
            }else{
                this.num.skin = "res/room/poker_black.png";
            }

            this.num.index = (num | 0) - 1;
            this.icon.index = ICON_MAP[icon];
        }
    }

    showBack (index) {
        Laya.timer.once(index * 200, this, function () {
            this.back.visible = true;
        });
    }

    showFront () {
        this.back.visible = false;
        this.front.visible = true;
    }

    reset () {
        this.back.visible = false;
        this.front.visible = false;
    }
}




let TYPE_MAP = {
    "CARD_TYPE_NIU_NULL"    : "niu_0",
    "CARD_TYPE_NIU_ONE"     : "niu_1",
    "CARD_TYPE_NIU_TWO"     : "niu_2",
    "CARD_TYPE_NIU_THREE"   : "niu_3",
    "CARD_TYPE_NIU_FOUR"    : "niu_4",
    "CARD_TYPE_NIU_FIVE"    : "niu_5",
    "CARD_TYPE_NIU_SIX"     : "niu_6",
    "CARD_TYPE_NIU_SEVEN"   : "niu_7",
    "CARD_TYPE_NIU_ENGHT"   : "niu_8",
    "CARD_TYPE_NIU_NIE"     : "niu_9",
    "CARD_TYPE_NIU_NIU"     : "niu_niu",
    "CARD_TYPE_SI_HUA"      : "sihua",
    "CARD_TYPE_WU_HUA"      : "wuhua",
    "CARD_TYPE_ZHA_DANG"    : "zhadan"
};
let SOUND_MAP = {
    "CARD_TYPE_NIU_NULL"    : "wu_niu",
    "CARD_TYPE_NIU_ONE"     : "niu_one",
    "CARD_TYPE_NIU_TWO"     : "niu_two",
    "CARD_TYPE_NIU_THREE"   : "niu_three",
    "CARD_TYPE_NIU_FOUR"    : "niu_four",
    "CARD_TYPE_NIU_FIVE"    : "niu_five",
    "CARD_TYPE_NIU_SIX"     : "niu_six",
    "CARD_TYPE_NIU_SEVEN"   : "niu_seven",
    "CARD_TYPE_NIU_ENGHT"   : "niu_enght",
    "CARD_TYPE_NIU_NIE"     : "niu_nie",
    "CARD_TYPE_NIU_NIU"     : "niu_niu",
    // "CARD_TYPE_SI_HUA"      : "aaaaa",
    "CARD_TYPE_WU_HUA"      : "wu_hua",
    "CARD_TYPE_ZHA_DANG"    : "si_zha"
};
class CardType extends Laya.Box {
    private type:Laya.Skeleton = null;
    private cardType:string = null;
    constructor () {
        super();

        this.init();
    }

    init () {
        this.visible = false;
        this.pos(90, 52);

        let type = Honor.Utils.createSkeleton("res/room/card_type");
            type.pos(this.width / 2, this.height / 2);
            type.on(Laya.Event.COMPLETE, this, function () {
                this.type.play(`${TYPE_MAP[this.cardType]}_s`, true);
            });

        this.type = type;
        this.addChild(type);
    }

    update (type) {
        this.cardType = type;
    }

    show () {
        this.type.play(TYPE_MAP[this.cardType], false);
        this.visible = true;
        if(SOUND_MAP[this.cardType]){
            Laya.SoundManager.playSound(`sound/${SOUND_MAP[this.cardType]}.mp3`);
        }
    }

    reset () {
        this.visible = false;
        this.type.stop();
        this.cardType = null;
    }
}



class CardSet extends Laya.Box {
    private cards:CardBase[] = [];
    private card_type:CardType = null;
    constructor () {
        super();

        this.init();
    }

    init () {
        this.size(186, 89);
        for(let i = 0; i < 5; i++){
            let card = new CardBase(i);
            this.addChild(card);
            this.cards.push(card);
        }

        this.card_type = new CardType();
        this.addChild(this.card_type);
    }

    dealer (data) {
        for(let i in this.cards){
            this.cards[i].update(data.num[i]);
            this.cards[i].showBack(i);
        }

        this.card_type.update(data.type);
    }

    turn () {
        for(let i in this.cards){
            this.cards[i].showFront();
        }
        this.card_type.show();
    }

    reset () {
        for(let i in this.cards){
            this.cards[i].reset();
        }
        this.card_type.reset();
    }
}

export default CardSet;