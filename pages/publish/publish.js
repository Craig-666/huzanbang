// pages/publish/publish.js
import Bmob from '../../dist/Bmob-1.6.4.min.js'
import util from '../../utils/util.js'
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
    this.myToast = this.selectComponent(".myToast")
  },
  publish:function(e){
    let userInfo = util.getUserInfo()
    if(!userInfo.nickName){
      this.myToast.show('登录后才能发布互赞哦')
      return
    }
    let that = this
    let value = e.detail.value
    if(value.title == ''){
      this.myToast.show('请输入互赞标题')
      return
    }
    if (value.description == '') {
      this.myToast.show('请输入互赞要求')
      return
    }
    if (value.link == '') {
      this.myToast.show('请输入互赞链接')
      return
    }
    const query = Bmob.Query('requirement');
    query.set("title", value.title)
    query.set("description", value.description)
    query.set("link", value.link)
    query.set('createUserId',util.getUserId())
    query.set('createUserNick', userInfo.nickName)
    query.set('createUserPic', userInfo.userPic)
    query.save().then(res => {
      that.myToast.show('发布成功')
    }).catch(err => {
      that.myToast.show('发布失败')
    })
  }
})