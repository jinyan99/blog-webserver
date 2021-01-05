const fs = require('fs')
const path = require('path')

// 写日志
function writeLog(writeStream, log) {
    // 创建的写入流具有write功能 追加方式
    writeStream.write(log + '\n')  // 关键代码
}

// 生成 write Stream
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a'
    })
    return writeStream
}

// 写访问日志
const accessWriteStream = createWriteStream('access.log')
function access(log) {
    // 在这还可以加个当前环境判断逻辑process.ENV来判断， 开发环境不打日志，线上环境打日志
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}