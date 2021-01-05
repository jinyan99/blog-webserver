const redis = require('redis')

// 创建客户端
const redisClient = redis.createClient(6379, '127.0.0.1')// 这个你要是连的外网，127就需要换成你的外网的主机地址
redisClient.on('error', err => {
    console.error(err)
})

// 测试
redisClient.set('myname', 'zhangsan2', redis.print) //传了第三个参数后会set完后打印出结果是否是正确
redisClient.get('myname', (err, val) => {
    if (err) {
        console.error(err)
        return
    }
    console.log('val ', val)

    // 退出
    redisClient.quit()
})