// 基础模型
class BaseModel {
    constructor(data, message) {
      // data是个对象，message是个消息字符串
      if (typeof data === 'string') {
          this.message = data
          data = null
          message = null
      }
      if (data) {
          this.data = data
      }
      if (message) {
          this.message = message
      }
    }
}

// 成功的数据模型
class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}

// 失败的数据模型名
class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}