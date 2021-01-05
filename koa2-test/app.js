const Koa = require('koa');
const app = new Koa();

// logger 记录中间件自定义日志
app.use(async (ctx, next) => {
  console.log('第一层洋葱 - 开始')
  await next();// 这后面的代码是往外穿透圈执行时的逻辑
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.log('第一层洋葱 - 结束')
});

// x-response-time设置请求时间
app.use(async (ctx, next) => {
  console.log('第二层洋葱 - 开始')
  const start = Date.now();
  await next();// 这后面的代码是往外穿透圈执行时的逻辑
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log('第二层洋葱 - 结束')
});

// response 返回功能
app.use(async ctx => {// 这就是洋葱圈模型的最底部了
  console.log('第三层洋葱 - 开始')
  ctx.body = 'Hello World';
  console.log('第三层洋葱 - 结束')
});

app.listen(8000);