var moment = require("moment");
moment.locale('zh-cn');
var _fun = {};
_fun.real_time = (time1, time2) => {
    var real = null;
    if (time1.indexOf("小时前") > -1) {
        real = moment(time2).subtract(parseInt(time1), "hour").format("MMDDHmm");
    }
    if (time1.indexOf("分钟前") > -1) {
        real = moment(time2).subtract(parseInt(time1), "minute").format("MMDDHmm");
    }
    if (time1.indexOf("昨天") > -1) {
        real = moment(time2).subtract(parseInt(24), "minute").format("MMDDHmm");
    }
    //这是有日期的了
    if (time1.indexOf("-") > -1) {
        real = time1.replace("-", "") + "1200";
        return moment(real, "MMDDHmm").fromNow();
    }
    // return real;
    return moment(real, "MMDDHmm").fromNow();
}

_fun.unix_time = (time1) => {
    if (time1.indexOf("小时前") > -1) {
        real = moment().subtract(parseInt(time1), "hour").format("x");
    }
    if (time1.indexOf("分钟前") > -1) {
        real = moment().subtract(parseInt(time1), "minute").format("x");
    }
    if (time1.indexOf("昨天") > -1) {
        real = moment(time2).subtract(parseInt(24), "minute").format("x");
    }
    //这是有日期的了
    if (time1.indexOf("-") > -1) {
        real = time1.replace("-", "") + "1200";
        return moment(real, "MMDDHmm").format("x");
    }
    return real;
};
module.exports = _fun;