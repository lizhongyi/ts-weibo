var express = require('express');
var router = express.Router();
var weiboList = require('../model/weibo-list');
var weiboComment = require('../model/weibo-comment');
var weibo = require("../lib/model")
    .weibo;
var weibocom = require("../lib/model")
    .weibocom;
var weiboer = require("../lib/model")
    .weiboer;
var weiboer = require("../lib/model")
    .weiboer;
var _fun = require("../lib/fun")
var axios = require("axios")
var cheerio = require("cheerio")
    //查询一条数据
    /* GET home page. */
router.get('/', function(req, res, next) {
    (async() => {
        let { data } = await axios.get('https://cloud.189.cn/t/rmYZfu6NFjaa')
        var $ = cheerio.load(data)
        let client = 'https:' + $("input.downloadUrl")
            .val()
        let dlq = await axios.get('https://cloud.189.cn/t/rEvQzezUJzui')
        dlq = dlq.data
        var $ = cheerio.load(dlq)
        dlq = 'https:' + $("input.downloadUrl")
            .val()
        res.render('index', { title: '我们来爬一很好的微博', client: client, dlq: dlq });
        // return items
    })();
})
router.get('/ver', function(req, res, next) {
    (async() => {
        let { data } = await axios.get('https://cloud.189.cn/t/rmYZfu6NFjaa')
        var $ = cheerio.load(data)
        let client = 'https:' + $("input.downloadUrl")
            .val()
        let dlq = await axios.get('https://cloud.189.cn/t/rEvQzezUJzui')
        dlq = dlq.data
        var $ = cheerio.load(dlq)
        dlq = 'https:' + $("input.downloadUrl")
            .val()
        var infos = await axios.get("https://www.jianshu.com/p/3b14a4340d2a")
        var $ = cheerio.load(infos.data)
        let info = $('div.show-content')
            .html()
        res.render('index', { title: '我们来爬一很好的微博', client: client, dlq: dlq, info: info });
        // return items
    })();
})
router.get('/tszysmq/:uid?', function(req, res, next) {
    // if (!checkLogin(req, res, next)) {
    //     res.end("<script>window.location='/login';</script>");
    //     return;
    // } else {
    //     console.log(req.session);
    // }
    //查询一条数据
    (async() => {
        var uid = req.query.uid || 2014433131;
        var now = Date.now();
        var lists = [];
        var weibos = [];
        console.log(req.query.uid);
        try {
            for (var i = 1; i < 3; i++) {
                lists.push(await weiboList(uid, i));
            }
            for (var i = 0; i < lists.length; i++) {
                for (var j = 0; j < lists[i].data.cards.length; j++) {
                    weibos.push(lists[i].data.cards[j].mblog);
                }
            }
            console.log("一共有" + weibos.length + "条微博");
            var comments = [];
            var cmts = [];
            for (var i = 2; i < weibos.length; i++) {
                if (weibos[i] == undefined) {
                    continue;
                }
                //取得所有微博id  默认显示第一页，需要计算页码
                var page = weibos[i].comments_count || 1;
                var pageCount = Math.ceil(page / 9);
                for (j = 0; j < pageCount; j++) {
                    cmts.push(await weiboComment(weibos[i], j));
                    // weibos.push(lists.data.cards[i].mblog.text);
                }
            }
            //得到所有评论
            comments = cmts;
            var cmtlists = [];
            var show_reply = function(data, id) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i] == undefined) {
                        continue;
                    }
                    if (data[i].id == id) {
                        return data[i];
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
        var reply_count = 0;
        for (let i = 0; i < comments.length; i++) {
            if (typeof comments[i].data.data == 'object') {
                var allData = comments[i].data.data;
                if (comments[i].data.hot_data != undefined) {
                    allData = allData.concat(comments[i].data.hot_data);
                }
                for (var j = 0; j < allData.length; j++) {
                    if (allData[j].user.id == uid
                        // || comments[i].data.data[j].text.indexOf("唐史主任司马迁") > -1
                    ) {
                        //获取原微博
                        var wid = comments[i].config.headers.wid;
                        var weiboItem = show_reply(weibos, wid);
                        try {
                            var pig = weiboer.create({
                                nick: weiboItem.user.screen_name,
                                face: weiboItem.user.profile_image_url,
                                profile: JSON.stringify(weiboItem.user),
                                created_at: now,
                                uid: weiboItem.user.id
                            });
                            var dog = await weibo.create({
                                title: weiboItem.text.substr(0, 10),
                                content: JSON.stringify(weiboItem),
                                remark: 'heheh',
                                create_time: now,
                                wei_id: weiboItem.id,
                                uid: uid,
                                unix_time: _fun.unix_time(weiboItem.created_at)
                            });
                            var cat1 = await weibocom.create({
                                title: weiboItem.id,
                                content: JSON.stringify(comments[i].data.data[j]),
                                remark: 'heheh',
                                create_time: now,
                                wei_id: comments[i].data.data[j].id
                            });
                        } catch (e) {
                            console.log(e.errors);
                            reply_count--;
                        }
                        //把这俩评论都入库评
                        reply_count++;
                        //return;
                    }
                }
            }
        }
        console.log("得到" + reply_count + "条评论");
        res.end("result:" + reply_count);
    })();
    //插入一条数据
    // (async() => {
    //     var dog = await weibo.create({
    //         title: 'Odie',
    //         content: 'woshinidzi',
    //         remark: 'heheh',
    //         create_time: now
    //     });
    //     console.log('created: ' + JSON.stringify(dog));
    // })();
    //更新一条数据
    // (async() => {
    //     var dog = await weibo.update({
    //         title: 'nimalanzi',
    //     }, {
    //         where: {
    //             id: 1
    //         }
    //     })
    //     console.log('created: ' + JSON.stringify(dog));
    // })();
});
router.get('/weibo/:uid?', function(req, res, next) {})
module.exports = router;