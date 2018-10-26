let Bmob = require('../../dist/Bmob-1.6.4.min.js');
let util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    pageNo: 1,
    total: 0,
    limit: 10,
    list:[]
  },
  onLoad:function(){
    this.getList(true,false)
  },
  getList: function (loading, clear) {
    let that = this
    const query = Bmob.Query("requirement");
    query.equalTo('createUserId','!=',util.getUserId()) 
    query.limit(that.data.limit)
    query.skip(that.data.limit * (that.data.pageNo - 1))
    let dataSource = that.data.list
    if (clear) {
      dataSource = []
    }
    Promise.all([query.find(), query.count()]).then(res => {
      let reList = res[0]
      let alist = []
      let blist = []
      reList.map(item=>{
        const aa = Bmob.Query("praise");
        aa.equalTo('requirementId', '==', item.objectId) 
        alist.push(aa.find())
      })

      Promise.all(alist).then(count=>{
        reList.map((item,index) => {
          item.praiseList = count[index]
          let praised = false
          for(let i = 0;i<count[index].length;i++){
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
    }).finally(()=>{
      wx.stopPullDownRefresh()
    })
  },
  onPullDownRefresh:function(){
    this.setData({
      pageNo: 1
    },()=>{
      this.getList(true, true)
    })
    
  },
  onReachBottom:function(){
    if (this.data.total == this.data.employeeList.length) {
      return
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    },()=>{
      this.getList(true, false)
    })
  },
  handleTap:function(e){
    let dataset = e.currentTarget.dataset
    let id = e.currentTarget.id
    switch (id){
      case 'bangdian':{
        let index = dataset.index
        let item = this.data.list[index]
        wx.navigateTo({
          url: `./praise/praise?objectId=${item.objectId}`,
        })
      }break
    }
  }
})
