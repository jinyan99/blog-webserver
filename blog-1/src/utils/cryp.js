const crypto = require('crypto')// crypto是nodejs自身提供的一个加密的库

// 密匙 -- 我们密码要和这个密匙一块配合做个加密，如果黑客不知道这个密钥他就解不出来加密后的密码
const SECRET_KEY = 'WJiol_8776#'

// 然后使用我们常见的 md5 加密方式
function md5(content) { // content就是需要加密的内容
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex') // digest就是把我们的输出变成个16进制的方式
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

module.exports = {
    genPassword
}