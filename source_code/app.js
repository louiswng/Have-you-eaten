//app.js
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.cloud.init({
      env: "test-vhoyt"
    });
    var that = this;
    console.log('onLaunch')
    wx.cloud.init({});//初始化云开发
    const db = wx.cloud.database({});
    var i = 1;
    for (; i <= 9; i++) {

      db.collection("cafeteria" + i).doc("person_num" + i).get({
        //如果查询成功的话    
      }).then(res => {
        console.log(res.data)
        //因为从数据库请求数据有延迟，所以到这里时i已经变成4了，不能用i来判断数据
        if (res.data._id[10] == '1') that.globalData.cafeteria_num[0] = res.data.person_num;
        else if (res.data._id[10] == '2') that.globalData.cafeteria_num[1] = res.data.person_num;
        else if (res.data._id[10] == '3') that.globalData.cafeteria_num[2] = res.data.person_num;
        else if (res.data._id[10] == '4') that.globalData.cafeteria_num[3] = res.data.person_num;
        else if (res.data._id[10] == '5') that.globalData.cafeteria_num[4] = res.data.person_num;
        else if (res.data._id[10] == '6') that.globalData.cafeteria_num[5] = res.data.person_num;
        else if (res.data._id[10] == '7') that.globalData.cafeteria_num[6] = res.data.person_num;
        else if (res.data._id[10] == '8') that.globalData.cafeteria_num[6] = res.data.person_num;
        else if (res.data._id[10] == '9') that.globalData.cafeteria_num[6] = res.data.person_num;
      })
    }
  },
  globalData: {
    nickname:'',
    useravatar:'',
    this_detect: 1,
    cafeteria_num: [0,0,0,0,0,0,0,0,0],
    isHide:false
  }
})

