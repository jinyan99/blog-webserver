const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    const query = querystring.parse(url.split('?')[1])

    // 设置返回格式为 JSON(注意设的是resend的字符串格式) ---- 设置响应头头
    res.setHeader('Content-type', 'application/json')

    // 返回的数据
    const resData = {
        method,
        url,
        path,
        query
    }

    // 返回
    if (method === 'GET') {
        res.end(
            JSON.stringify(resData)
        )
    }
    if (method === 'POST') {
      // 这个是异步的，我们应该用异步的方式来解决，异步若用普通的方式写会比较费劲，所以我们用promise的方式写
        let postData = ''
        // 监听传输过来的数据一直流，每次流都会触发这个事件，不是数据整个一大块传过来的，是一块一块流过来的
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        // 直到流完了触发end事件结束
        req.on('end', () => {
            resData.postData = postData
            // 返回
            res.end(
                JSON.stringify(resData)
            )
        })
    }
})

server.listen(8000)
console.log('OK')
