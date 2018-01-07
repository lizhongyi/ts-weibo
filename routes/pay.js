var express = require('express');
var router = express.Router();
var order = require("../lib/model").order;
var card = require("../lib/model").card;

var pay = {
    id: '100001',
    key: '29BD3CCC5359C8181FE76940216F965B',
    submiturl: 'http://api.paytt.com/Bank/',
    callback_url: "/pay/callback.php",
    hrefback_url: "/pay/hrefback",
  }
  /* GET users listing. */
router.post('/', function(req, res, next) {

  Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  var crypto = require('crypto');
  var md5 = crypto.createHash('md5');
  var orderid = new Date().Format("yyyyMMdd");
  console.log(orderid);
  var value = req.body.totalAmount
  var type = req.body.bankCode
  var callbackurl = req.body.callback_url
  var hrefbackurl = req.body.hrefback_url
  var payerIp = req.body.payerIp
  var attach = req.body.attach
  var sign = "parter=" + pay.id + "&type=" + type + "&value=" + value + "&orderid=" + orderid + "&callbackurl=" + pay.callbackurl;
  sign = md5.update(sign + key).digest('hex');


  var url = pay.submiturl + "?parter=" + parter + "&type=" + type + "&value=" + value + "&orderid=" + orderid + "&callbackurl=" + callbackurl + "&attach=" + attach + "&hrefbackurl=" + hrefbackurl + "&payerIp=" + payerIp + "&sign=" + sign;

  res.render('pay', { url: url });
});

router.post('/pay2', function(req, res, next) {

  (async() => {
    Date.prototype.Format = function(fmt) { //author: meizz 
      var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    var shop_id = 2098; //商户ID，商户在千应官网申请到的商户IDvar 
    var bank_Type = 102; //充值渠道，101表示支付宝快速到账通道var 
    var bank_payMoney = 1; //充值金额
    var goods = req.body.goods;
    var username = req.body.username;
    console.log(username);
    if (goods == '50' || goods == '100' || goods == '300' || goods == '1000') {
      if (!username) {
        res.render('pay2', { msg: "角色不能为空" });
        return false;
      }
    } else {
      res.render('pay2', { msg: "金额非法" });
      return false;
    }

    var orderid = new Date().Format("yyyyMMddhhmmssS"); //商户的订单ID，【请根据实际情况修改】
    var now = Date.now();;
    //此处要生成一个订单，角色名，订单好，支付的购卡金额

    try {
      var orders = order.create({
        username: username,
        orderid: orderid,
        goodsid: goods,
        created_at: new Date().Format("yyyy-MM-dd hh:mm:ss")
      });

    } catch (e) {
      console.log(e.errors);

    }

    var sign1 = md5.update(orderid + 'nimalanzi').digest('hex');
    var callbackurl = "http://118.31.8.17/pay/back"; //商户的回掉地址，【请根据实际情况修改】
    var gofalse = "http://www.qianyingnet.com/pay"; //订单二维码失效，需要重新创建订单时，跳到该页
    var gotrue = "http://118.31.8.17/order/" + orderid + "?sign=" + sign1; //支付成功后，跳到此页面
    var key = "0a4a7c0eccf5421b85cf48efba46da84"; //密钥
    var posturl = 'http://www.qianyingnet.com/pay/'; //千应api的post提交接口服务器地址

    var charset = "utf-8"; //字符集编码方式
    var token = "中文"; //自定义传过来的值 千应平台会返回原值
    var parma = 'uid=' + shop_id + '&type=' + bank_Type + '&m=' + bank_payMoney + '&orderid=' + orderid + '&callbackurl=' + callbackurl; //拼接var  param字符串

    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    var parma_key = md5.update(parma + key).digest('hex'); //md5加密


    var PostUrl = posturl + "?" + parma + "&sign=" + parma_key + "&gofalse=" + gofalse + "&gotrue=" + gotrue + "&charset=" + charset + "&token=" + token; //生成指定网址
    res.render('pay2', { url: PostUrl, orderid: orderid, goods: goods, username: req.body.username });
  })();
});

//回调地址
router.get('/back', function(req, res, next) {

  (async() => {
    var key = "0a4a7c0eccf5421b85cf48efba46da84"; //商户密钥，千应官网注册时密钥
    var orderid = req.query.oid //订单号
    var status = req.query.status; //处理结果：【1：支付完成；2：超时未支付，订单失效；4：处理失败，详情请查看msg参数；5：订单正常完成（下发成功）；6：退款】
    var money = req.query.m; //实际充值金额
    var sign = req.query.sign; //签名，用于校验数据完整性
    var orderidMy = req.query.oidMy; //千应录入时产生流水号，建议保存以供查单使用
    var orderidPay = req.query.oidPay; //收款方的订单号（例如支付宝交易号）; 
    var completiontime = req.query.time; //千应处理时间
    var attach = req.query.token; //上行附加信息; 
    var msg = req.query.msg; //千应返回订单处理消息，当status为4时，该值代表失败原因
    var param = "oid=" + orderid + "&status=" + status + "&m=" + money + key; //拼接$param
    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    var paramMd5 = md5.update(param).digest('hex'); //md后加密之后的$param

    console.log(req.query);


    if (sign.toLowerCase() == $paramMd5.toLowerCase()) {
      if (status == "1" || status == "5" || status == "6") {

        //可在此处增加操作数据库语句，实现自动下发，也可在其他文件导入该php，写入数据库

        //读出一条未售卡密的数据并更新订单号到字段
        var cards = await card.findOne({
          where: {
            orderid: null
          },
          limit: 1
        });
        var cardid = cards.id;
        if (cardid) {
          var param = {
            'updated_at': new Date().Format("yyyy-MM-dd hh:mm:ss"),
            'orderid': orderid
          }

          var param1 = {
            'updated_at': new Date().Format("yyyy-MM-dd hh:mm:ss"),
            'status': 1
          }
          try {
            var upcards = card.update({
              param,

              where: { 'id': { eq: cardid } }

            })

            var uporder = order.update({
              param1,
              where: { 'orderid': { eq: orderid } }

            })
          } catch (error) {

          }
        }
        console.log(cards.cardno);

        console.log("商户收款成功，订单正常完成！");
      } else if (status == "4") {
        console.log("订单处理失败，因为：" + msg);
      } else if ($status == "8") {
        console.log("订单已经退款！");
      }
    } else {
      console.log("签名无效，视为无效数据!");
    }
    res.send("0");
  })();
})
module.exports = router;