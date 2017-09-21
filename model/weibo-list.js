var api = require("../lib/api");
var axios = require("axios");
var headers = require('../lib/header');
var weiboList = (uid, page) => {

    return axios({
        url: api.getUrl(api.weiboUser.url, {
            uid: uid || '2014433131',
            luicode: 10000011,
            lfid: '100103type=1&q=唐史主任司马迁',
            type: 'uid',
            value: 2014433131,
            containerid: 1076032014433131,
            page: page
        }),
        method: 'get',
        headers: headers

    })

};

module.exports = weiboList;