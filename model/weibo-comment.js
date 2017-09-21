var api = require("../lib/api");
var axios = require("axios");
var headers = require('../lib/header');
var weiboComment = (cid, page) => {
    var cmts = [];
    headers['wid'] = cid.id;
    return axios({
        url: api.getUrl(api.weiboComment.url, {
            id: cid.id || 4149675521683834,
            page: page,
        }),
        method: 'get',
        headers: headers
    });



};

module.exports = weiboComment;