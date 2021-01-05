const Koa = require('koa')
const app = new Koa()// 创造一个app实例
const views = require('koa-views')
const json = require('koa-json')// json格式处理方法
const onerror = require('koa-onerror')// 错误处理
const bodyparser = require('koa-bodyparser')// post Data相关的，给它数据放到req.body里
const logger = require('koa-logger')// 1.在开发环境中打印的console格式更加可读性优美 2. 并没有记录日志文件的作用 3. 所有并没有记录日志文件的作用
// morgan这个东西

// 实现登陆逻辑相关插件
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const index = require('./routes/index')// 下面是引用相关路由
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')

const { REDIS_CONF } = require('./conf/db')// redis配置

// error handler -- app的错误监测
onerror(app)

// middlewares -- 使用中间件
app.use(bodyparser({ // 处理postdata数据的 下面是允许接受的类型
  enableTypes:['json', 'form', 'text']
}))
app.use(json()) // 把post data json化
app.use(logger())// 使用日志中间件
app.use(require('koa-static')(__dirname + '/public')) // 静态资源目录的创建

app.use(views(__dirname + '/views', { // 前端页面的模版引擎处理
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()// 请求来了后先把起始时间记一下
  await next()// 然后执行下next 等他后续的中间件执行完后，在执行下面ms逻辑，得到一个中间耗时
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`) // 当前服务器耗时 也记录在日志里
})

const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境 / 测试环境
  app.use(morgan('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }));
}

// session 配置 --- 一定要在注册路由之前来写session相关的配置，注册这个中间件也会自动的把session值放到req.session中，在路由文件中ctx.session就可以拿到
app.keys = ['WJiol#23123_']// 设置个密钥
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置 redis
  store: redisStore({
    // all: '127.0.0.1:6379'   // 写死本地的 redis server 即本地redis的一个端口
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}` // 根据本地不同环境，自动配本地或配线上的
  })
}))

// routes -- 路由处理，allowedMethods方法也是捕获错误处理，404 或路由报错
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
