//app.js
import Bmob from './dist/Bmob-1.6.4.min.js'
App({
  onLaunch: function () {
  
    Bmob.initialize("fcb90d772b36f3a6a19ad8b17ed33a12", "b215bb6c77fa9e2e30bf2345c037d792");
    Bmob.User.auth()
  },
  onShow:function(){
    
  }
})