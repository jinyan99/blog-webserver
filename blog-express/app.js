var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');// 自动解析cookie的插件，在blog-1都是自己手写的解析cookie到req对象上
var logger = require('morgan');// 这个是自动写日志的插件 类似于blog-1项目中的appjs中的记录access log功能
const session = require('express-session') // 引入设置session的插件
const RedisStore = require('connect-redis')(session) // 引入链接redis的插件

// 下面是引用项目中路由
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog')
const userRouter = require('./routes/user')

// 开始初始化app应用：即本次http请求的一个实例
var app = express();

// // view engine setup --- 这是views模版引擎(前端页面)的设置，暂时先不涉及它
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 对logger日志中间件的不同环境设置 --- 不同环境下日志记录格式不同
const ENV = process.env.NODE_ENV// 获得当前环境变量(通过npm scripts预设的)
if (ENV !== 'production') {
  // 开发环境 / 测试环境
  app.use(logger('dev'));// 输入dev 官方文档有dev的默认日志记录格式，不写第二个参数默认就是process.stdout
  // app.use(logger('dev', {
  //   stream: process.stdout // 日志直接打印在控制台输出开发环境下打印在控制台就行了 线上时再写入文件存储吧
  // }));
}
else {
  // 线上环境
  // 创建日志文件的写入流
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  // 将logger的日志记录在定义好的文件写入流中 即记录日志在文件存储中
  app.use(logger('combined', {
    stream: writeStream //
  }));
}

// 当前http请求过来时要经过的下面所有被use的中间件处理一下
app.use(express.json());// 类似于blog-1 appjs中的getPostData方法即当有post传递的数据在路由处理中直接就可以通过req.body拿到post携带的数据 很方便
app.use(express.urlencoded({ extended: false }));// 和上express.json目的一样 只不过那个是兼容postData为json格式的，这个兼容postData为表单格式等其他的格式的赋到req.body上
app.use(cookieParser());// 使用这个中间件后，只要有请求过来，他就会自动把带来的cookie设到req的属性上，在routes路由文件中就能很轻松的req.cookies来访问到对应的cookie
// app.use(express.static(path.join(__dirname, 'public'))); 静态资源的设置 先不涉及 (返给前端的页面)

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
// session中间件的配置
app.use(session({
  secret: 'WJiol#23123_',// 密钥
  cookie: { // cookie的配置
    // path: '/',   // 默认配置
    // httpOnly: true,  // 默认配置 前端js没法访问cookie 只能后端写
    maxAge: 24 * 60 * 60 * 1000 // 设定24小时后失效过期比设置过期时间expreis方便
  },
  store: sessionStore // 这个store就是连接redis的store接口
}))

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter); // 注册路由功能的 中间件
app.use('/api/user', userRouter); // 注册路由

// 要是匹配不到路由就捕捉404 catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler错误处理 当程序运行有错误的时候 就捕捉错误 当开发环境时报错 线上环境时就不显示报错信息了
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
