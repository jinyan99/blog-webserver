// 标准输入输出
// process.stdin.pipe(process.stdout)

// const http = require('http')
// const server = http.createServer((req, res) => {
//     if (req.method === 'POST') {
//         req.pipe(res)  // 最主要
//     }
// })
// server.listen(8000)

// 1- 文件IO 用流方式读取文件
// // 复制文件 ---- 这种方式拷贝文件效率非常高
// const fs = require('fs')
// const path = require('path')

// const fileName1 = path.resolve(__dirname, 'data.txt')
// const fileName2 = path.resolve(__dirname, 'data-bak.txt')

// const readStream = fs.createReadStream(fileName1)
// const writeStream = fs.createWriteStream(fileName2)

// readStream.pipe(writeStream)

// readStream.on('data', chunk => {
//     console.log(chunk.toString())
// })
// readStream.on('end', () => {
//     console.log('copy done')
// })


// 2- 网络IO 用流方式读取文件：网络请求，这个请求想读取一个文件的内容，返回这个文件内容
const http = require('http')
const fs = require('fs')
const path = require('path')
const fileName1 = path.resolve(__dirname, 'data.txt')
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // 创建一个读取流，然后通过一个管道连到res中，这样数据会一点点刘过去  而且效率非常高，
        // 注意不是全部读取完文件 再去执行开始流操作，而是边读边流 效率很高
        const readStream = fs.createReadStream(fileName1)
        readStream.pipe(res)
    }
})
server.listen(8000)