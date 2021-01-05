const router = require('koa-router')()

router.prefix('/users') // 加路由前缀 ，要访问下面的/bar，必须是/users/bar才会匹配成功

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
