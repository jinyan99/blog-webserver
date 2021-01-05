const http = require('http')

// 聚合中间件
function compose(middlewareList) {
    return function (ctx) {
        function dispatch(i) {
            const fn = middlewareList[i]
            try {
                return Promise.resolve( // 一般fn结果就是个promise，在这还要用Promise.resolve包装一层就是为了防止用户注册中间件时没写成async函数直接写成普通函数，这样最后这块得到的都是
                    fn(ctx, dispatch.bind(null, i + 1))  // promise
                )
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return dispatch(0)
    }
}

class LikeKoa2 {
    constructor() {
        this.middlewareList = []
    }

    use(fn) {
        this.middlewareList.push(fn)
        return this // koa2支持的链式调用写法，即支持app.use().use()这种写法
    }

    createContext(req, res) {
        const ctx = {
            req,
            res
        }
        ctx.query = req.query
        return ctx
    }

    handleRequest(ctx, fn) {
        return fn(ctx)// 在这开始执行了dispatch[0]
    }

    callback() {
        const fn = compose(this.middlewareList)

        return (req, res) => {
            const ctx = this.createContext(req, res)
            return this.handleRequest(ctx, fn)
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = LikeKoa2
