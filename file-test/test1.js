const fs = require('fs')
const path = require('path')
// 为什么用path路径模块呢？直接写根路径拼写不行吗
// 因为mac根路径和window根路径是不一样的，如mac是/usr/local/etc/...  而window是C:\\sdffff\fffdfdfd\fdfd
// 所以用path模块更通用话适配一些

// 获取日志文件目录 --- __dirname是nodejs自带的一个全局变量，是当前目录的路径，后接一个data.txt具体文件
const fileName = path.resolve(__dirname, 'data.txt')

// // 读取文件内容 --- 都是异步的所以是二参回调
// fs.readFile(fileName, (err, data) => {
//     if (err) {
//         console.error(err)
//         return
//     }
//     // data 是二进制buffer类型，需要转换为字符串
//     console.log(data.toString())
// })
// 单纯用这个方法去读取文件是不可以的，万一他文件很大5个g左右，那拿到的data也是一次性5个g大小，他肯定超过单进程最大内存限制了不行 具体解决方式见nodejs stream方案

// // 写入文件
// const content = '这是新写入的内容\n'
// // opt是writeFile方法的写入配置选项
// const opt = {
//     flag: 'a'  // 追加写入。覆盖用 'w'
// }
// fs.writeFile(fileName, content, opt, (err) => {
//     if (err) {
//         console.error(err)
//     }
// })
// 若每次都写入一行数据执行这个方法太频繁老写入执行这个方法 (每次执行都会重新打开文件进行操作也是很耗内存性能的)。。
// 而且我们想要写入一个很大的3g 4g的内容 ，你的content是js变量，需要通过js进程跑起来的 易内存泄漏


// // 判断文件是否存在
// fs.exists(fileName, (exist) => {
    // exist是是否存在的一个bool值
//  console.log('exist', exist)
// })
