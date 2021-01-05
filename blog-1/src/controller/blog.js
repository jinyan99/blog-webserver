// 控制层blog相关的业务逻辑处理文件
const xss = require('xss')
const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
    // 方法参数是接口传入的参数
    // 未接登陆的情况下，先返回假数据必须保证格式是正确的
    // 如return [{id: 1, title: '标题A', content: '内容A', createTime: 154661049112(时间戳), author: 'zhangsan'}]

    // sql语句末尾要注意空格
    let sql = `select * from blogs where 1=1 `// 末尾要注意空格，1=1是提供一个占位的作用
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`//倒序排列

    // 返回 promise
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含 title content author 属性
    const title = xss(blogData.title)
    // console.log('title is', title)
    const content = xss(blogData.content)
    const author = blogData.author
    const createTime = Date.now()

    const sql = `
        insert into blogs (title, content, createtime, author)
        values ('${title}', '${content}', ${createTime}, '${author}');
    `

    return exec(sql).then(insertData => {
        // console.log('insertData is ', insertData)
        return {
            id: insertData.insertId // 表示新建博客，插入到数据表里的id
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    // id 就是要更新博客的 id
    // blogData 是一个博客对象，包含 title content 属性

    const title = xss(blogData.title)
    const content = xss(blogData.content)

    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `

    return exec(sql).then(updateData => {
        // console.log('updateData is ', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    // id 就是要删除博客的 id

    // 要两个参数能保证在执行删除的时候id是正确的，当前用户是正确的，避免了客户端故意随便发个id不传当前用户信息就来调接口删除别人的东西，必须得判断当前登陆
    // 状态的用户发出的id删除操作才能执行删除，否则外界随意传id就随意删了必须得一致当前登陆态
    const sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then(delData => {
        // console.log('delData is ', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}