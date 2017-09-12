var express = require('express');
var router = express.Router();
var weboLogin = require("../lib/weibo-login");
var weiboList = require("../model/weibo-list");
var weiboComment = require("../model/weibo-comment");
router.get('/', function(req, res, next) {

    res.json({ user: 1 });


});
/* GET users listing. */
router.get('/weibo-list/:id?', function(req, res, next) {
    (async() => {
        var list = await weiboList(req.params.id);
        res.json(list.data);
    })();
});

router.get('/weibo-comment/:id?', function(req, res, next) {
    (async() => {
        var list = await weiboComment(req.params.id);
        res.json(list.data);
    })();
});

module.exports = router;