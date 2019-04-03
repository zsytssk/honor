declare module Honor{
    var DEBUG_MODE:boolean;
    function run(GameConfig:any, callback:Function):void
}

declare module Honor.director{
    function runScene(urlOrClass:string | typeof Laya.Scene, args?:any[])
    function openDialog(urlOrClass:string | typeof Laya.Dialog, args?:any[], dialogConfig?:any)
}
declare module Honor.loader{
    function setLoadPageForScene(page)
    function setLoadPageForDialog(page)
    function load(type:string, url:string, complete:Laya.Handler)
}
declare module Honor.Utils{
    /**
     * @public
     * 创建骨骼动画
     * @param {String} path 骨骼动画路径
     * @param {Number} rate 骨骼动画帧率，引擎默认为30，一般传24
     * @param {Number} type 动画类型 0,使用模板缓冲的数据，模板缓冲的数据，不允许修改	（内存开销小，计算开销小，不支持换装） 1,使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装） 2,使用动态方式，去实时去画	（内存开销小，计算开销大，支持换装,不建议使用）
     * 
     * @return 骨骼动画
     */
    function createSkeleton(path:string, rate?:number, type?:number):Laya.Skeleton
    /**
     * @public
     * 获取字符串长度，支持中文
     * @param {String} str 要获取长度的字符串
     * 
     * @return 字符串长度
     */
    function getStringLength(str:string):number
    /**
     * @public
     * 按指定长度截取字符串
     * @param {String} str 要截取长度的字符串
     * @param {Number} length 字符串长度
     * 
     * @return 截取长度后的字符串
     */
    function cutStr(text:string, length:number):string
    /**
     * @public
     * 将两个或更多对象的内容合并到第一个对象。使用方式见Jquery.extend
     * 调用方式
     * Sail.Utils.extend( [deep ], target, object1 [, objectN ] )
     * Sail.Utils.extend( target [, object1 ] [, objectN ] )
     * 
     * @return 合并后的对象
     */
    function extend(...args):object
    /**
     * @public
     * 将毫秒转换为`{h}小时{m}分钟{s}秒`的格式
     * @param {Number} total 毫秒数
     * 
     * @return 格式化后的字符串
     */
    function formatTime(total):string
}