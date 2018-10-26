// pages/waiting/waiting.js
let Bmob = require('../../dist/Bmob-1.6.4.min.js');
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    total: 0,
    limit: 10,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(true, false)
  },
  getList: function (loading, clear) {
    let that = this
    const query = Bmob.Query("waiting");
    query.equalTo('waitingUserId', '==', util.getUserId())
    query.limit(that.data.limit)
    query.skip(that.data.limit * (that.data.pageNo - 1))
    let dataSource = that.data.list
    if (clear) {
      dataSource = []
    }
    Promise.all([query.find(), query.count()]).then(res => {
      let reList = res[0]
      let alist = []
      reList.map(item => {
        const aa = Bmob.Query("requirement");
        alist.push(aa.get(item.requirementId))
      })

      Promise.all(alist).then(count => {
        reList.map((item, index) => {
          item.praiseList = count[index]
          let praised = false
          for (let i = 0; i < count[index].length; i++) {
            let dddd = count[index][i]
            if (dddd.praiseUserId == util.getUserId()) {
              praised = true
              break
            }
          }
          item.praised = praised
        })

        let arr = dataSource.concat(reList)
        console.log(arr)
        that.setData({
          total: res[1],
          list: arr
        })
      })
    }).finally(() => {
      wx.stopPullDownRefresh()
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1
    }, () => {
      this.getList(true, true)
    })

  },
  onReachBottom: function () {
    if (this.data.total == this.data.employeeList.length) {
      return
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    }, () => {
      this.getList(true, false)
    })
  },
  handleTap: function (e) {
    let dataset = e.currentTarget.dataset
    let id = e.currentTarget.id
    switch (id) {
      case 'bangdian': {
        let index = dataset.index
        let item = this.data.list[index]
        wx.navigateTo({
          url: `./bangdian/bangdian?objectId=${item.objectId}`,
        })
      } break
    }
  }
})