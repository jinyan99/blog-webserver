const { exec, escape } = require('../db/mysql')
// 获取加密方法
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {
    // 后端接到登陆请求后，肯定是要验证账号和密码的，所以作为参数
    username = escape(username) // 需要escape转义一下防止sql注入，还有个未处理前sql中需要加单引号(` username='${username}' `)，处理后就不用加单引号了

    // 生成加密密码
    password = genPassword(password)
    password = escape(password)//必须把escape函数放在最后调用 因为这样就可以sql语句中省略单引号

    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
    // 看通过当前登陆信息能不能拿到数据，拿到了就可以登陆成功，拿不到登陆不成功

    // console.log('sql is', sql)
    return exec(sql).then(rows => {
        // rows返回的是个数组，我们要数组的第一项就可以一个对象
        return rows[0] || {}
    })
}

module.exports = {
    login
}