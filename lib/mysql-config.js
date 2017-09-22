var connection;
//正式环境数据
connection = {
    database: 'ts-weibo', // 使用哪个数据库
    username: 'root', // 用户名
    password: '123456', // 口令
    host: '127.0.0.1', // 主机名
    port: 3308 // 端口号，MySQL默认3306
}

module.exports = connection;