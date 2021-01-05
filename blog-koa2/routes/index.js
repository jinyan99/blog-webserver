const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {// 这是对应的views模版引擎文件，直接渲染该index.pug模版文件给前端显示，然后,传title参数给那文件使用
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'// 若返回数据不用express的res.json了，直接ctx.body就能返回给前端数据了
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
