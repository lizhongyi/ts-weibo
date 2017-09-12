var express = require('express');
var router = express.Router();
var config = require("../lib/mysql");
var Sequelize = require('sequelize');
var checkLogin = require("../lib/checkLogin");
var weboLogin = require("../lib/weibo-login");
var weiboList = require('../model/weibo-list');
var weiboComment = require('../model/weibo-comment');

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});
/* GET home page. */
router.get('/', function(req, res, next) {

    // if (!checkLogin(req, res, next)) {
    //     res.end("<script>window.location='/login';</script>");
    //     return;
    // } else {
    //     console.log(req.session);
    // }

    var weibo = sequelize.define('weibo', {
        title: Sequelize.STRING(200),
        content: Sequelize.STRING(9000),
        create_time: Sequelize.BIGINT,
        remark: Sequelize.STRING(700)

    }, {
        timestamps: false
    });
    //查询一条数据

    (async() => {
        var lists = await weiboList();
        var comments = [];
        var cmts = [];
        for (var i = 3; i < lists.data.cards.length; i++) {

            if (lists.data.cards[i].mblog) {
                //取得所有微博id  默认显示第一页，需要计算页码
                var page = lists.data.cards[i].mblog.comments_count;
                var pageCount = Math.ceil(page / 9);

                for (j = 0; j < pageCount; j++) {
                    cmts.push(weiboComment(lists.data.cards[i].mblog.id, j));
                }
            }
        }


        comments = await Promise.all(cmts);

        var cmtlists = [];
        var show_reply = function(data, id) {
                for (item of data) {
                    if (item.id == id) {
                        return item.text;
                    }
                }
            }
            //博主回复的人
        for (let i = 0; i < comments.length; i++) {
            if (typeof comments[i] == 'object') {



                for (var j = 0; j < comments[i].data.data.length; j++) {
                    if (comments[i].data.data[j].user.screen_name == '唐史主任司马迁'
                        //|| comments[i].data.data[j].text.indexOf("唐史主任司马迁") > -1
                    ) {

                        var reply_id = comments[i].data.data[j].reply_id;
                        var rep_text = show_reply(comments[i].data.data, reply_id);
                        comments[i].data.data[j].text += "<hr/>" + rep_text;
                        console.log(comments[i].data.data[j]);
                        cmtlists.push(comments[i].data.data[j]);

                        //下一步从请求是hader里面取 微博ID









                        // var reg = /@(.*?)\<\/a>/;
                        // var sb = comments[i].data.data[j].text;
                        // sb.replace(reg, function(s, value) {
                        //     console.log(value);
                        // });
                        //console.log(comments[i].data.data);
                    }

                }



            }
        }


        //console.log(comments[0].data.data[0].user);
        // console.log(cmtlists);
        res.render('index', { title: '我们来爬一很好的微博', lists: cmtlists });

    })();

    var now = Date.now();

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

module.exports = router;