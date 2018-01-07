var express = require('express');
var router = express.Router();
var card = require("../lib/model").card;
router.get('/:orderid', function(req, res, next) {

  (async() => {
    //需要一个秘钥参数  用户名+密码的
    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    var sign1 = md5.update(req.params.orderid + 'nimalanzi').digest('hex');
    console.log(sign1);
    var sign = req.query.sign;
    if (sign1 != sign) {

      res.render('order', { msg: "签名错误" });
      return false;
    }
    try {

      var cards = await card.findOne({
        where: {
          orderid: req.params.orderid
        },
        limit: 1
      });
    } catch (e) {
      console.log(e.errors)
    }
    var msg = "";

    if (cards) {
      msg = "";
    } else {
      msg = "没有找到数据"
    }
    res.render('order', { msg: msg, cards: cards });
  })();
})
module.exports = router;