// 用户接口开发文件
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST

    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        // 数据库验证登陆 返回的promise
        const result = login(username, password)
        return result.then(data => {
          // data就是那个对象
            if (data.username) {
                // 如果登陆成功的话

                // 设置 session(不往cookie存真实的用户信息改存session更好，cookie就村个userid即可)
                req.session.username = data.username
                req.session.realname = data.realname
                // 同步到 redis
                set(req.sessionId, req.session)

                // 操作cookie   -- 其中加httpOnly就可以禁止用户在浏览器端修改cookie，只能由后端改
                // res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly`)

                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }

    // 登录验证的测试 (特别简单的逻辑只要req的session即cookie中只要存在用户名就算作已登陆状态)
    // if (method === 'GET' && req.path === '/api/user/login-test') {
    //     if (req.session.username) {
    //         return Promise.resolve(
    //             new SuccessModel({
    //                 session: req.session
    //             })
    //         )
    //     }
    //     return Promise.resolve(
    //         new ErrorModel('尚未登录')
    //     )
    // }
}

module.exports = handleUserRouter
