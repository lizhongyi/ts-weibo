var axios = require("axios");
var weiboLogin = {};
weiboLogin.loginUrl = 'https://passport.weibo.cn/sso/login';
weiboLogin.login = function(user) {
    return axios({
        // `url` 是用于请求的服务器 URL
        url: weiboLogin.loginUrl,

        // `method` 是创建请求时使用的方法
        method: 'post', // 默认是 get

        // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
        // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
        baseURL: 'https://weibo.cn',
        transformRequest: [function(data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],

        // `transformRequest` 允许在向服务器发送前，修改请求数据
        // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
        // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream

        // `headers` 是即将被发送的自定义请求头
        headers: {
            'Referer': 'https://passport.weibo.cn/signin/login',
            'Host': 'passport.weibo.cn',
            'Content-Type': 'application/x-www-form-urlencoded'
        },

        // `data` 是作为请求主体被发送的数据
        // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
        // 在没有设置 `transformRequest` 时，必须是以下类型之一：
        // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
        // - 浏览器专属：FormData, File, Blob
        // - Node 专属： Stream
        data: {
            username: user.username,
            password: user.password,
            savestate: 1,
            entry: 'mweibo'
        }
    })
}
module.exports = weiboLogin;