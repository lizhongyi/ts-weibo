var express = require('express');
var router = express.Router();
var config = require("../lib/mysql");
var Sequelize = require('sequelize');
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



var weiboer = sequelize.define('weiboer', {
    uid: { type: Sequelize.BIGINT, unique: true },
    nick: Sequelize.STRING(200),
    face: Sequelize.STRING(200),
    created_at: Sequelize.BIGINT,
}, {
    timestamps: false
});
/* GET bloger page. */

router.get('/', function(req, res, next) {

    (async() => {
        var lists = await weiboer.findAll({ limit: 30, order: 'id desc' });

        res.render('index', { title: '一些博主', weiboerList: lists });
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

        res.render('index', { title: '我们来爬一很好的微博', lists: items });
    })();


})


/* post add a user*/