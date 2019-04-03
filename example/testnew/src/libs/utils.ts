import { USER_LOGIN_STATUS } from "../define";
import Recharge from "../alert/recharge";

var isPlainObject = (function () {
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);

    function isPlainObject (obj) {
        var proto, Ctor;

        if(!obj || toString.call(obj) !== "[object Object]"){
            return false;
        }

        proto = Object.getPrototypeOf(obj);

        if(!proto){
            return true;
        }

        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    };

    return isPlainObject;
})();

const Utils = {
    /**
     * @public
     * 创建骨骼动画
     * @param {String} path 骨骼动画路径
     * @param {Number} rate 骨骼动画帧率，引擎默认为30，一般传24
     * @param {Number} type 动画类型 0,使用模板缓冲的数据，模板缓冲的数据，不允许修改	（内存开销小，计算开销小，不支持换装） 1,使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装） 2,使用动态方式，去实时去画	（内存开销小，计算开销大，支持换装,不建议使用）
     * 
     * @return 骨骼动画
     */
    createSkeleton (path, rate = 30, type = 0) : Laya.Skeleton {
        var png = Laya.loader.getRes(path + ".png");
        var sk  = Laya.loader.getRes(path + ".sk");
        if(!png || !sk){return null;}

        var templet = new Laya.Templet();
            templet.parseData(png, sk, rate);

        return templet.buildArmature(type);
    },

    /**
     * @public
     * 获取字符串长度，支持中文
     * @param {String} str 要获取长度的字符串
     * 
     * @return 字符串长度
     */
    getStringLength (str){
        return ("" + str.replace(/[^\x00-\xff]/gi,"ox")).length;
    },
    /**
     * @public
     * 按指定长度截取字符串
     * @param {String} str 要截取长度的字符串
     * @param {Number} length 字符串长度
     * 
     * @return 截取长度后的字符串
     */
    cutStr (text, length?) {
        text = text + "";
        var reg = /[^\x00-\xff]/g;
        if(text.replace(reg, "mm").length <= length){return text;}
        var m = Math.floor(length / 2);
        for(var i = m; i < text.length; i++){
            if(text.substr(0, i).replace(reg, "mm").length >= length){
                return text.substr(0, i) + "...";
            }
        }
        return text;
    },
    /**
     * @public
     * 获取URL中指定参数的值
     * @param {String} name 参数名
     * 
     * @return 参数值
     */
    getUrlParam(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        
        if(r != null){
            return unescape(r[2]);
        }
        
        return null;
    },

    /**
     * @public
     * 将两个或更多对象的内容合并到第一个对象。使用方式见Jquery.extend
     * 调用方式
     * Sail.Utils.extend( [deep ], target, object1 [, objectN ] )
     * Sail.Utils.extend( target [, object1 ] [, objectN ] )
     * 
     * @return 合并后的对象
     */
    extend (...args) {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if(typeof target === "boolean"){deep = target;target = arguments[i] || {};i++;}
        if(typeof target !== "object" && !(typeof target !== "function")){target = {};}
        if(i === length){target = this;i--;}

        for (;i < length; i++){
            if( (options = arguments[i]) != null){
                for (name in options){
                    src = target[name];
                    copy = options[name];
                    if(target === copy){continue;}
                    if(deep && copy && (isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy) ) ) ){
                        if(copyIsArray){
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[name] = Utils.extend(deep, clone, copy);
                    } else if(copy !== undefined){
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    },

    /**
     * @public
     * 将毫秒转换为`{h}小时{m}分钟{s}秒`的格式
     * @param {Number} total 毫秒数
     * 
     * @return 格式化后的字符串
     */
    formatTime (total) {
        var time = "";
        var h = 0;
        var m = 0;
        var s = total % 60;
        if(total > 60) {
            m = total / 60 | 0;
        }
        if(m > 60){
            h = m / 60 | 0;
            m = m % 60;
        }
        
        if(s > 0){
            time = s + "秒";
        }
        if(m > 0){
            time = m + "分钟" + time;
        }
        if(h > 0){
            time = h + "小时" + time;
        }

        return time;
    },
    cookieStore : {
        get: function (name) {
            let cookieName = encodeURIComponent(name) + "=",
                cookieStart = document.cookie.indexOf(cookieName),
                cookieValue = null;

            if (cookieStart > -1) {
                let cookieEnd = document.cookie.indexOf(";", cookieStart)
                if (cookieEnd == -1) {
                    cookieEnd = document.cookie.length;
                }
                cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
            }

            return cookieValue;
        },
        set: function (name, value, expires, path, domain, secure) {
            let cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);

            if (expires instanceof Date) {
                cookieText += "; expires=" + expires.toGMTString();
            }

            if (path) {
                cookieText += "; path=" + path;
            }

            if (domain) {
                cookieText += "; domain=" + domain;
            }

            if (secure) {
                cookieText += "; secure";
            }

            document.cookie = cookieText;
        },
        unset: function (name, path, domain, secure) {
            this.set(name, "", new Date(0), path, domain, secure);
        }
    },

    getAvatar : function(userId){
        let self = userId == GM.user_id;
        let coockieName = 'avatar';
        let avatarId = null;
        let expire = null;
        let date = null;
        if(window.localStorage && localStorage.getItem){
            avatarId = localStorage.getItem(`${coockieName}:${userId}`);
        }
        if(!avatarId){
            avatarId = (Math.random() * 14 | 0) + 1;
            if(window.localStorage && localStorage.setItem){
                localStorage.setItem(`${coockieName}:${userId}`, avatarId);
            }
        }
        
        return `res/avatar/avtar${avatarId}.png`;
    },

    /**
     * @public
     * 数值转化为万单位
     * @param {String} num 原数值
     * @param {boolean} flag 是否舍弃小数位
     */
    transferNumberToK : function(num, flag = false){
        if(num==0){return "0";}
        if(!num || num === ""){return "";}
        num = parseInt(num);
        if(num < 10000){
            return num;
        }else if(num >= 10000 &&　num < 100000000){
            let strNum = flag ? String(Math.floor(num/10000)) :String(num/10000);
            num = Number(strNum.slice(0,5)) + "万";
            return num;
        }else if(num >= 100000000){
            let strNum = String(num/100000000);
            num = Number(strNum.slice(0,5)) + "亿";
            return num;
        }
    },
    modifyNumber : function(num){
        if(isNaN(num)){
            return;
        }
        if(num >= 10000){
            num = num/10000 + '万';
        }else if(num >= 1000){
            num = num/1000 + '千';
        }
        return num;
    },
    formatMoney : function (number, decimal = 0, isround = false){
        let _number = number + "";
        //判断是否是负数
        let smallthanzero = _number.indexOf("-") == -1 ? false : true;
        //去除负号
        let na = smallthanzero ? _number.replace(/-/ig,"").split(".") : _number.split(".");
        let result = [];
        
        //处理整数部分
        let n = 0;
        for(let i = na[0].length - 1; i >= 0; i--){
            if(n % 3 == 0 && n != 0){
                result.push(",");
            }
            result.push(na[0][i]);
            n++;
        }
        
        //反转数组
        result.reverse();
        
        //判断是否要加回负号
        let s = smallthanzero ? "-" : "";

        //小数部分处理
        let _d = na[1];
        if(_d && decimal){
            _d = na[1].substring(0,decimal);
        }
        
        return _d ? s + result.join("") + "." + _d : s + result.join("");
    },
    /**
     * 获取m到n的随机数，包含m,n
     */
    getRandom : function (m, n) {
        return Math.floor(Math.random() * (m - n) + n);
    },
    checkLogin : function () {
        if(!USER_LOGIN_STATUS){
            location.href = GM.userLoginUrl;
            return false;
        }else{
            return true;
        }
    },
    recharge : function () {
        if(this.checkLogin()){
            if(GM.qudaoUserFlag == 1){
                location.href = GM.qudaoChangeUrl;
                return;
            }
            if(GM.appStorePay == 1 && (window.wltgame && wltgame.suportStorePay == 1) || GM.appStorePay == 2){
                location.href = "/?act=ios_applepay&st=applepay_game_vertical&gameId=" + GM.gameId + "&redirect_uri=" + redirect_uri;
            }else{
                Honor.director.openDialog(Recharge);
            }
        }
    }
}

export default Utils;