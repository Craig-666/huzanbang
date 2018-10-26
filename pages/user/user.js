// pages/user/user.js
import Bmob from '../../dist/Bmob-1.6.4.min.js'
import util from '../../utils/util.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(util.getUserInfo())
    if (util.getUserInfo().userPic){
      this.setData({
        userInfo: util.getUserInfo(),
        hasUserInfo:true
      })
    }
  },
  getUserInfo: function (e) {
    let that = this
    Bmob.User.upInfo(e.detail.userInfo).then(res=>{
      that.setData({
        userInfo: util.getUserInfo(),
        hasUserInfo: true
      })
    })
  }
})