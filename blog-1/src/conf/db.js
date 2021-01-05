// nodejs中的process就是进程中的一些信息，常用来设环境变量env
// NODE_ENV这个环境变量最开始初始设的时候是在npm scripts脚本命令中如"dev": "cross-env NODE_ENV=dev nodemon ./bin/www.js",中设置的
const env = process.env.NODE_ENV  // 环境参数

// 然后根据当前环境变量去分别判断设置链接数据库的参数，因为开发环境和线上环境域名啥的不一样数据库也不能一样

// 配置
let MYSQL_CONF
let REDIS_CONF // 项目接入redis的配置变量

if (env === 'dev') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'Mysql_2018',
        port: '3306',
        database: 'myblog'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if (env === 'production') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'Mysql_2018',
        port: '3306',
        database: 'myblog'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}