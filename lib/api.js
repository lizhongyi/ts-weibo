var api = {};
api.followFeed = 'https://m.weibo.cn/feed/friends?version=v4';
api.weiboUser = {
    url: 'https://m.weibo.cn/api/container/getIndex?uid={uid}&luicode={luicode}&lfid={lfid}&type=uid&value={value}&containerid={containerid}&page={page}'
};
api.weiboComment = {
    url: 'https://m.weibo.cn/api/comments/show?id={id}&page={page}&text'
}
api.getUrl = function(apiUrl, apiParams) {
    var url = apiUrl
        // 替换ApiUrl中的参数
    for (let i in apiParams) {
        url = url.replace('{' + i + '}', apiParams[i])
    }
    // console.log(url);
    return url
}
module.exports = api;