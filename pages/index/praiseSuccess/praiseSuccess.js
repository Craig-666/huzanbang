// pages/index/praiseSuccess/praiseSuccess.js
let Bmob = require('../../../dist/Bmob-1.6.4.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selIndex:'aa'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myToast = this.selectComponent(".myToast")

    let item = JSON.parse(options.item)
    this.setData({
      item
    },()=>{
      this.getPublishList()
    })
  },
  getPublishList:function(){
    let that = this
    const query = Bmob.Query("requirement");
    query.equalTo('createUserId', '==', util.getUserId())
    query.equalTo('createdAt','>=',util.getBeforeDays())
    query.limit(1000)
    query.find().then(res=>{
      if(res.length > 0){
        let qlist = []
        let plist = []
        res.map(item=>{
          const pquery = Bmob.Query("praise");
          pquery.equalTo('requirementId', '==', that.data.item.objectId)
          pquery.select('praiseUserId')
          qlist.push(pquery.find())

          const qquery = Bmob.Query("waiting");
          qquery.equalTo('requirementId', '==', item.objectId)
          qquery.equalTo('waitingUserId', '==', that.data.item.createUserId)
          plist.push(qquery.count())
        })
        Promise.all(qlist).then(qres=>{
          console.log(qres)
          res.map((re,index)=>{
            let priase = qres[index]
            let praised = false
            for(let i = 0;i<priase.length;i++){
              let pra = priase[i]
              if (pra.praiseUserId == that.data.item.createUserId) {
                praised = true
                break
              }
            }
            re.praised = praised
          })
          Promise.all(plist).then(ares => {
            console.log(ares)
            res.map((re, index) => {
              let count = ares[index]
              if (count>0){
                re.assigned = true
              }
            })
            that.setData({
              list: res
            })
          })
        })
      }else{
        that.setData({
          list:[]
        })
      }
      
    })
  },

  choose:function(e){
    let dataset = e.currentTarget.dataset
    let index = parseInt(dataset.index)
    this.setData({
      selIndex:index
    })
  },

  save:function(){
    if(this.data.selIndex == 'aa'){
      this.myToast.show('先选择需点赞内容')
      return
    }
    let that = this
    let index = this.data.selIndex
    let item = this.data.list[index]
    const query = Bmob.Query('waiting');
    query.set("waitingUserId", this.data.item.createUserId)
    query.set("requirementId", item.objectId)
    query.save().then(res=>{
      that.myToast.show('发布成功', () => {
        wx.reLaunch({
          url: '../index',
        })
      })
    })
  },

  publish: function (e) {
    let userInfo = util.getUserInfo()
    let that = this
    let value = e.detail.value
    if (value.title == '') {
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
    query.set('createUserId', util.getUserId())
    query.set('createUserNick', userInfo.nickName)
    query.set('createUserPic', userInfo.userPic)
    query.save().then(res => {
      const query = Bmob.Query('waiting');
      query.set("waitingUserId", this.data.item.createUserId)
      query.set("requirementId", res.objectId)
      query.save().then(res => {
        that.myToast.show('发布成功',()=>{
          wx.reLaunch({
            url: '../index',
          })
        })
      })
    }).catch(err => {
      that.myToast.show('发布失败')
    })
  }
})