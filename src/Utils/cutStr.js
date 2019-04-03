/**
 * @public
 * 按指定长度截取字符串
 * @param {String} str 要截取长度的字符串
 * @param {Number} length 字符串长度
 * 
 * @return 截取长度后的字符串
 */
function cutStr (text, length) {
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
}

export default cutStr;