class FlowError {
  constructor(msg = '错误', funcName = '', action = '') {
    this.msg = msg
    this.funcName = funcName
    this.action = action
  }
}
export default FlowError
