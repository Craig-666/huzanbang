// pages/index/bangdian/bangdian.js
let Bmob = require('../../../dist/Bmob-1.6.4.min.js');
let util = require('../../../utils/util.js')
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
    let objectId = options.objectId
    this.setData({
      objectId
    },()=>{
      this.getDetail()
    })
  },
  getDetail:function(){
    let that = this
    const query = Bmob.Query('requirement');
    query.get(this.data.objectId).then(res => {

      const aa = Bmob.Query("praise");
      aa.equalTo('requirementId', '==', that.data.objectId)
      aa.find().then(pre=>{
        let praised = false
        for (let i = 0; i < pre.length; i++) {
          let dddd = pre[i]
          if (dddd.praiseUserId == util.getUserId()) {
            praised = true
            break
          }
        }
        res.praised = praised
        if(!praised){
          wx.setClipboardData({
            data: res.link,
          })
        }
        that.setData({
          item: res
        })
      })
      
    }).catch(err => {
      console.log(err)
    })
  },
  chooseImage:function(){
    let that = this
    wx.chooseImage({
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          tempUrl : tempFilePaths[0]
        })
      },
    })
  },
  upload:function(){
    let userInfo = util.getUserInfo()
    if (!userInfo.nickName) {
      this.myToast.show('登录后才能帮点赞哦')
      return
    }

    if(!this.data.tempUrl){
      this.myToast.show('先上传点赞图片')
      return
    }
    wx.showLoading({
      title: '上传中',
      mask:true
    })
    let that = this
    let file = Bmob.File(new Date().valueOf() + 'bang.jpg',this.data.tempUrl)
    file.save().then(res=>{
      console.log(res)
      const query = Bmob.Query('praise');
      query.set('praiseUserId', util.getUserId())
      query.set("requirementId", that.data.objectId)
      query.set("praiseImgUrl", res[0].url)
      query.save().then(res => {
        wx.hideLoading()
        wx.redirectTo({
          url: `../praiseSuccess/praiseSuccess?item=${JSON.stringify(that.data.item)}`,
        })
      }).catch(err => {
        wx.hideLoading()
      })
    },(err)=>{
      console.log('err',err)
    })
  }
})