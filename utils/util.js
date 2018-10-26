const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getToday = () => {
  let date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-') + ' ' + ['00', '00', '00'].map(formatNumber).join(':')
}

const getBeforeDays = (num) => {
  let days = num || 7
  let curTimeStamp = new Date().getTime()
  let beforeTimeStamp = curTimeStamp - days * 24 * 60 * 60 * 1000
  let beforeDate = new Date(beforeTimeStamp)
  let year = beforeDate.getFullYear()
  let month = beforeDate.getMonth() + 1
  let day = beforeDate.getDate()
  return [year, month, day].map(formatNumber).join('-') + ' ' + ['00', '00', '00'].map(formatNumber).join(':')
}

const getUserInfo = () => {
  return JSON.parse(wx.getStorageSync('bmob'))
}

const getUserId = () => {
  return getUserInfo().objectId
}
// 无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
}

module.exports = {
  formatTime: formatTime,
  getUserInfo,
  getUserId,
  getBeforeDays,
  getToday
}
