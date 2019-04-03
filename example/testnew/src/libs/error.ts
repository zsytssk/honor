{
    let io = Honor.io;
    // let tipCode = ['103','104','105','108','112','116','200','201','203','204','205','206','207','208','210','211','212','213','214',
    // '300','301','302','303','305','306','307','308','309','310','311','312','313','315','316','317','318','319','320','321','322','323','324',
    // '325','326','327','328','329','330','331','332','333','334','335','336','339','341',
    // ]
    let ignore_code = [1000];
    let ingore_cmd = [GAME_CMDS.BANKER_UP, GAME_CMDS.IS_IN_ROOM, GAME_CMDS.USER_LOGOUT, GAME_CMDS.GET_USER_SOURCE];

    class Error {
        constructor () {
            //输分提醒
            Honor.io.register(GAME_CMDS.LOSEREMIND, null, function(data){
                // tbnn.data.firstbet = true;
                // tbnn.dom.table.betInternal = false;
                if(window.GM && GM.loseRemind && GM.loseRemind.pop){
                    GM.loseRemind.pop(data.level, data.endTime);
                    if(data.amount > 0){
                        Honor.io.emit(GAME_CMDS.USE_INFO, {type : "game"});
                    }
                }
            });
            // 输分禁用
            Honor.io.register(GAME_CMDS.CAUTION, null, function(data){
                if(data.code == "1000"){
                    // tbnn.data.firstbet = true;
                    // tbnn.dom.table.betInternal = false;
                    GM.jumpToHomePage && GM.jumpToHomePage("blacklist_disable");
                }else if(data.code == "1001"){
                    GM.accredit && GM.accredit();
                }
            });

            //不中险
            // Honor.io.register(GAME_CMDS.BUZHONGXIAN,this,function(data){
            //     if( data != null && data != undefined){
            //         if(window.GM && GM.socket_RJ && GM.socket_RJ.pop){
            //             // data.buzhongxian.prizePoint   data值
            //             GM.socket_RJ.pop('buzhongxian', data.rep.buzhongxian.prizePoint);
            //         }
            //         //需要更新余额
            //         Honor.io.emit(GAME_CMDS.USE_INFO);
            //     }
            // });
            Honor.io.register(GAME_CMDS.AUTOCHARGEIN, null, function(data){
                let msg = "已为您带入:" + data.changeAmount + "游戏币！";
                if(data.promptMsg){
                    Honor.director.popScene(new Alert.Tips(msg), {
                        onClosed () {
                            let config = {
                                name : "wlt_prompt",
                                msg : data.promptMsg.content,
                                type : 1,
                                onConfirm (selected) {
                                    Honor.io.emit(GAME_CMDS.UPDATAPROMPT, {rpcId : selected ? 1 : 0});
                                }
                            }
                            Honor.director.popScene(new Alert.Public(config));
                        }
                    });
                }else{
                    Honor.director.popScene(new Alert.Tips(msg));
                }
            });
        }

        checkError (cmd, data, code, errormsg, type) {
            if(ingore_cmd.indexOf(cmd) != -1){
                return false;
            }
            if(type == "ajax"){
                //ajax网络异常，包含超时和所有异常
                if(cmd == "xhr.error"){
                    this.dispathError("xhrError",cmd);
                    return true;
                }

                //系统维护
                if(data.maintain_code == 1){
                    this.dispathError("maintain",cmd);
                    return true;
                }

                //防沉迷
                if(window.GM && GM.addict && GM.addict(data)){
                    this.dispathError("addict",cmd);
                    return true;
                }

                //根据不同的错误码处理不同的异常
                let statusCode = data.statusCode;
                if(statusCode && statusCode != "000"){
                    //error
                    this.dispathError(statusCode,cmd,errormsg,data);
                    return true;
                }
            }
            //socket错误
            else{
                // if(cmd == GAME_CMDS.REPEATBETCALL && code =='000'){
                //     Honor.io.publish(GAME_CMDS.REPBETSUCC);
                // }
                if(code && code != "000"){
                    this.dispathError(code,cmd,errormsg,data);
                    return true;
                }
            }

            return false;
        }

        dispathError (code, cmd, msg?, data?) {
            if(ignore_code.indexOf(code) != -1){
                return;
            }
            
            switch(code.toString()){
                //通比牛牛
                // case "316"://成功进入操盘队列
                //     tbnn.dom.top.inBankerList();
                //     break;
                case "111"://长时间未操作
                case "110"://房间维护
                    Honor.director.popScene(new Alert.Tips(msg), {
                        onClosed () {
                            if(ASSETS.Hall.Finished){
                                Honor.director.runScene(new Scene.Hall());
                            }else{
                                Honor.director.runScene(new Scene.Load(ASSETS.Hall, () => {
                                    Honor.director.runScene(new Scene.Hall);
                                }));
                            }
                        }
                    });
                    break;
                //系统维护
                case "maintain" :
                    location.reload(true);
                    // Honor.Utils.set_param('t', new Date().getTime());
                    break;
                //未登录或token丢失
                case "100" : 
                case "003" :
                case "121" : 
                case "101" : 
                    // location.href = GM.userLoginUrl;
                    USER_LOGIN_STATUS = false;
                    break;
                //otp
                case "81" :
                    location.href = "/?act=otp&st=otpPage";
                    break;
                //防沉迷
                case "addict" : 
                    //todo 清理游戏结果
                    break;
                //黑名单输分禁用
                case "99999" :
                    //todo 清理游戏结果
                    GM.jumpToHomePage && GM.jumpToHomePage("blacklist_disable"); 
                    break;            
                //异地登录
                case "1002" : 
                    Honor.io.end();
                    Honor.director.popScene(new Alert.Public({msg : "您的账号已在别处登录，请刷新重试！"}), {
                        onClosed () {
                            location.reload();
                        }
                    });
                    //todo 提示异地登录，并且关闭当前连接
                    break;
                //余额不足
                case "109" : 
                    //todo 提示余额不足，之后是否要弹出充值框请自行决定
                    Honor.director.popScene(new Alert.Public({msg : "您的余额不足，请充值后继续。"}), {
                        onClosed () {
                            // Honor.director.popScene(new Alert.Recharge);
                            Honor.Utils.recharge();
                        }
                    });
                    break;
                //积分达到单笔上限提示
                case "113" : 
                    //todo 提示土豪，您投币金额达到万里通单笔限额，请往万里通设置！
                    Honor.director.popScene(new Alert.Tips('土豪，您投币金额达到万里通单笔限额，请往万里通设置！'));
                    break;
                //积分达到当日上限提示
                case "114" :
                    //todo 提示积分或欢乐值超过当日最大使用额度，若要继续游戏，请充值欢乐豆！
                    Honor.director.popScene(new Alert.Tips('您积分或欢乐值超过当日最大使用额度，若要继续游戏，请充值欢乐豆'));
                    break;
            
                case "115" : 
                    //todo 提示用户 很抱歉！经系统检测，您的账号存在异常，无法进行该游戏。如有疑问，请联系客服：4001081768。
                    Honor.director.popScene(new Alert.Tips('很抱歉！经系统检测，您的账号存在异常，无法进行该游戏。如有疑问，请联系客服：4001081768'));
                    break;
                case "116" :
                    Honor.director.popScene(new Alert.Tips('很抱歉！经系统检测，您的账号存在异常，无法进行该游戏。如有疑问，请联系客服：4001081768'));
                    break
                //ajax网络异常，包含超时和所有异常
                case "xhrError" : 
                    //todo 一般弹窗提示 网络异常，请检查您的网络！
                    Honor.director.popScene(new Alert.Tips( '网络异常，请检查您的网络!'));           
                    break;
                case "200" :
                    if(cmd == GAME_CMDS.BUZHONGXIAN){
                        if(data){
                            if(window.GM && GM.socket_RJ && GM.socket_RJ.pop){
                                // data.buzhongxian.prizePoint   data值
                                GM.socket_RJ.pop('buzhongxian', data.buzhongxian.prizePoint);
                            }
                            //需要更新余额
                            Honor.io.emit(GAME_CMDS.USE_INFO);
                        }
                    }else{
                        Honor.director.popScene(new Alert.Tips(msg));
                    }
                    break;
                // case "205" :
                //     Honor.director.popScene(new Alert.Tips(msg));
                //     break;
                //输分禁用
                // case "1000" :
                //     if(cmd == GAME_CMDS.CAUTION){
                //          GM.jumpToHomePage && GM.jumpToHomePage("blacklist_disable");
                //     }
                //     break;
                // case "1001" :
                //     if(cmd == GAME_CMDS.CAUTION){
                //         GM.accredit && GM.accredit();
                //     }
                //     break;
                default : 
                    Honor.director.popScene(new Alert.Tips(msg));
                    //todo 提示默认的错误信息
                    break;
            }
        }
    }
    Honor.class(Error, "Honor.Error");
}