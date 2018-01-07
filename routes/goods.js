var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('goods', { title: '商品选择' });
});

module.exports = router;