class DateUtil {
  /**
   * 例如:2017-06-28 10:48:46转成date类,
   * 可把- replace成/
   * @param dateString
   * @return Date
   */
  static parserDateString(dateString) {
    if (dateString) {
      const regEx = new RegExp('\\-', 'gi')
      const validDateStr = dateString.replace(regEx, '/')
      const milliseconds = Date.parse(validDateStr)
      return new Date(milliseconds)
    }
  }

  // timestamp时间戳(Date.getTime())  formater时间格式
  static formatDate(timestamp, formater) {
    const date = new Date()
    date.setTime(parseInt(timestamp))
    formater = formater != null ? formater : 'yyyy-MM-dd hh:mm'
    Date.prototype.Format = function(fmt) {
      const o = {
        'M+': this.getMonth() + 1, // 月
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds(), // 毫秒
      }

      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          `${this.getFullYear()}`.substr(4 - RegExp.$1.length),
        )
      }
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : `00${o[k]}`.substr(`${o[k]}`.length),
          )
        }
      }
      return fmt
    }
    return date.Format(formater)
  }
}
export default DateUtil
