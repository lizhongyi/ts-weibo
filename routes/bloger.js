var express = require('express');
var router = express.Router();
var weboLogin = require("../lib/weibo-login");

var weibo = require("../lib/model").weibo;
var weibocom = require("../lib/model").weibocom;
var weiboer = require("../lib/model").weiboer;
var weiboer = require("../lib/model").weiboer;
var _fun = require("../lib/fun")



/* GET bloger page. */

router.get('/', function(req, res, next) {

    (async() => {
        var lists = await weiboer.findAll({ limit: 30, order: 'id desc' });

        lists.map(function(item) {
            item.profile = JSON.parse(item.profile)
            return item;
        })

        res.render('bloger', { title: '一些博主', weiboerList: lists });
    })();

})


/* get blog/:id*/

router.get('/:uid?', function(req, res, next) {

    (async() => {
        var lists = await weibo.findAll({
            limit: 30,
            order: 'id desc',
            where: {
                uid: req.query.uid
            }
        });
        var items = [];

        for (item of lists) {
            var content = JSON.parse(item.content);
            var cmts = [];
            var comments = await weibocom.findAll({
                where: {
                    title: content.id
                }
            });

            console.log(comments.length);
            for (itemx of comments) {
                cmts.push(JSON.parse(itemx.content));
            }
            content.cmts = cmts;
            items.push(content);
        }

        res.render('bloger', { title: '我们来爬一很好的微博', lists: items });
    })();


})

module.exports = router;