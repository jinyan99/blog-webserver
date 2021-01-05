// 这个promise练习文件夹，通过一个小需求来学习promsie
// 需求就是根据a.json内容去读取b.json内容，然后再根据bjson指针去读取cjson内容，因为每次读取文件都是异步操作，就是做一连串的异步操作
// 我们用3种方式来分别做下这个需求，并对比优缺点

const fs = require('fs')
const path = require('path')

// 1- callback 方式获取一个文件的内容 ---- 容易造成回调地狱
// function getFileContent(fileName, callback) {
//     const fullFileName = path.resolve(__dirname, 'files', fileName)
//     fs.readFile(fullFileName, (err, data) => {
//         if (err) {
//             console.error(err)
//             return
//         }
//         callback(
//             JSON.parse(data.toString())
//         )
//     })
// }

// // 测试 callback-hell
// getFileContent('a.json', aData => {
//     console.log('a data', aData)
//     getFileContent(aData.next, bData => {
//         console.log('b data', bData)
//         getFileContent(bData.next, cData => {
//             console.log('c data', cData)
//         })
//     })
// })





// 2- 用promise 获取文件内容(解决回调地狱问题)---主要体现在回调地狱的传callback参数现在改成return promise来代替就解决了回调地狱的问题
// 不过，多层嵌套回调会弱化成单层链式调用，也不是非常完美的链式调用调多了也很繁琐，后面出了第3版本

// 用promsie改进的另一大优点：一般在封装的函数中的二参成功回调拿到的结果没法给到外界使用，只能在成功回调里使用，这时候可以向上加个promsie，在
// 在回调中利用promise的resolve特点返回到外界使用
function getFileContent(fileName) {
    const promise = new Promise((resolve, reject) => {
        const fullFileName = path.resolve(__dirname, 'files', fileName)
        // 读取文件的方法(异步 默认读的是二进制形式)
        fs.readFile(fullFileName, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(
                JSON.parse(data.toString())
            )
        })
    })
    return promise
}

// getFileContent('a.json').then(aData => {
//     console.log('a data', aData)
//     return getFileContent(aData.next)
// }).then(bData => {
//     console.log('b data', bData)
//     return getFileContent(bData.next)
// }).then(cData => {
//     console.log('c data', cData)
// })



// 3- promsie的改进版本：async/await写法(避免了链式调用)
async function readFileData() {
    // 同步写法
    try {
        const aData = await getFileContent('a.json')
        console.log('a data', aData)
        const bData = await getFileContent(aData.next)
        console.log('b data', bData)
        const cData = await getFileContent(bData.next)
        console.log('c data', cData)
    } catch (err) {
        console.error(err)
    }
}

readFileData()

// async function readAData() {
//     const aData = await getFileContent('a.json')
//     return aData
// }
// async function test() {
//     const aData = await readAData()
//     console.log(aData)
// }
// test()

// async await 要点：
// 1. await 后面可以追加 promise 对象，获取 resolve 的值
// 2. await 必须包裹在 async 函数里面
// 3. async 函数执行返回的也是一个 promise 对象
// 4. try-catch 截获 promise 中 reject 的值
