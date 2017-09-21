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

var weibo = sequelize.define('weibo', {
    title: Sequelize.STRING(200),
    content: Sequelize.STRING(9000),
    create_time: Sequelize.BIGINT,
    remark: Sequelize.STRING(700),
    wei_id: { type: Sequelize.BIGINT, unique: true }

}, {
    timestamps: false
});
//查询一条数据

var weibocom = sequelize.define('weibocom', {
    title: Sequelize.STRING(200),
    content: Sequelize.STRING(9000),
    create_time: Sequelize.BIGINT,
    remark: Sequelize.STRING(700),
    wei_id: { type: Sequelize.BIGINT, unique: true }

}, {
    timestamps: false
});
/* GET home page. */

router.get('/', function(req, res, next) {

    (async() => {
        var lists = await weibo.findAll({ limit: 30, order: 'id asc' });
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

        res.render('index', { title: '我们来爬一很好的微博', lists: items });
    })();


})
router.get('/tszysmq', function(req, res, next) {

    // if (!checkLogin(req, res, next)) {
    //     res.end("<script>window.location='/login';</script>");
    //     return;
    // } else {
    //     console.log(req.session);
    // }


    //查询一条数据

    (async() => {



        var now = Date.now();
        var lists = [];
        var weibos = [];

        try {
            for (var i = 1; i < 3; i++) {
                lists.push(await weiboList(2014433131, i));
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
        for (let i = 0; i < comments.length; i++) {
            if (typeof comments[i].data.data == 'object') {
                var allData = comments[i].data.data;
                if (comments[i].data.hot_data != undefined) {
                    allData = allData.concat(comments[i].data.hot_data);
                }



                for (var j = 0; j < allData.length; j++) {



                    if (allData[j].user.screen_name == '唐史主任司马迁'
                        // || comments[i].data.data[j].text.indexOf("唐史主任司马迁") > -1
                    ) {

                        //获取原微博

                        var wid = comments[i].config.headers.wid;

                        var weiboItem = show_reply(weibos, wid);


                        try {


                            var dog = await weibo.create({
                                title: weiboItem.text.substr(0, 10),
                                content: JSON.stringify(weiboItem),
                                remark: 'heheh',
                                create_time: now,
                                wei_id: weiboItem.id
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
                        }
                        //把这俩评论都入库评

                        console.log("插入完成" + j + ":" + i);
                        //return;
                    }

                }

                console.log("一共有" + allData.length + "条评论")

            }
        }

        res.end(0);

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

module.exports = router;