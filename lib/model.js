var Sequelize = require('sequelize');
var config = require("./mysql-config");
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
var model = {};
//微博
model.weibo = sequelize.define('weibo', {
  title: Sequelize.STRING(200),
  content: Sequelize.STRING(9000),
  create_time: Sequelize.BIGINT,
  remark: Sequelize.STRING(700),
  uid: Sequelize.BIGINT,
  wei_id: { type: Sequelize.BIGINT, unique: true },
  unix_time: Sequelize.BIGINT,

}, {
  timestamps: false
});

//微博评论
model.weibocom = sequelize.define('weibocom', {
  title: Sequelize.STRING(200),
  content: Sequelize.STRING(9000),
  create_time: Sequelize.BIGINT,
  remark: Sequelize.STRING(700),
  wei_id: { type: Sequelize.BIGINT, unique: true }

}, {
  timestamps: false
});

//微博博主
model.weiboer = sequelize.define('weiboer', {
  uid: { type: Sequelize.BIGINT, unique: true },
  nick: Sequelize.STRING(200),
  face: Sequelize.STRING(200),
  profile: Sequelize.STRING(4000),
  created_at: Sequelize.BIGINT,
}, {
  timestamps: false
});


//订单
model.order = sequelize.define('order', {
  username: Sequelize.STRING(200),
  orderid: { type: Sequelize.BIGINT },
  goodsid: Sequelize.INTEGER,
  status: { type: Sequelize.BIGINT },
  created_at: Sequelize.STRING(30),
  updated_at: Sequelize.STRING(30)
}, {
  timestamps: false
});


//卡密

model.card = sequelize.define('card', {
  username: Sequelize.STRING(200),
  cardno: Sequelize.STRING(50),
  cardpass: Sequelize.STRING(20),
  status: Sequelize.INTEGER,
  updated_at: Sequelize.STRING(30),
  orderid: { type: Sequelize.BIGINT }
}, {
  timestamps: false
});
module.exports = model;