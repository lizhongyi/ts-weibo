var express = require('express');
var router = express.Router();
var weiboLogin = require("../lib/weibo-login");
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login', { title: '用户登陆' });
});

router.post('/', function(req, res, next) {

    (async() => {

        var userinfo = await weiboLogin.login({ username: req.body.username, password: req.body.password });

        if (userinfo.data.retcode == 20000000) {
            //登陆成功
            req.session.sign = true;
            req.session.cookie = userinfo.headers['set-cookie'];
            res.json(userinfo.data);
        } else {
            res.json(userinfo.data);
        }

    })();

});

module.exports = router;