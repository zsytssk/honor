declare module GM {
    var is_jiankangjin_user:boolean;
    var user_id:string;
    var userLogged:boolean;
    var newUser:boolean;
    var userLoginUrl:string;
    var isCall_out:number;
    var backHomeUrl:string;
    var isShowBtnBack_out:string;
    var shareImgUrl:string;
    var qudaoUserFlag:number;
    var qudaoChangeUrl:string;
    var appStorePay:number;
    var gameId:string;

    function whereYxb();
    function showInvitePop();
    function isShowInvite();
    function btnBackCall_out();
    function popBalanceShow_out();
    function btnBackCall_out();
    function jumpToHomePage(url:string);
    function accredit();
    function addict(data:any);
    function gameShareToWxCall(data:any);
    
    class muteAudio {
        static getMuteState ();
    }

    class loseRemind {
        static pop(level, endTime);
    }

    class socket_RJ {
        static pop(type:string, val:any);
        static exec();
    }
}