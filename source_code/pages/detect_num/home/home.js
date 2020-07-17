const app=getApp();

Page({
  data:{
    numPeople:[0,0,0,0,0,0,0,0,0],
    array: [{
      urllist: "../floor/floor", floorlist: "学生一层",
    }, {
      urllist: "../floor/floor", floorlist: "学生二层",
    }, {
      urllist: "../floor/floor", floorlist: "学生三层",
      },{
        urllist: "../floor/floor", floorlist: "学生四层",
      }, {
        urllist: "../floor/floor", floorlist: "学生五层",
      }, {
        urllist: "../floor/floor", floorlist: "教师一层",
      }, {
        urllist: "../floor/floor", floorlist: "教师二层",
      }, {
        urllist: "../floor/floor", floorlist: "教师三层",
      },{
        urllist: "../floor/floor", floorlist: "教师四层",
      },  ],
    yellow: "http://m.qpic.cn/psc?/931299a0-15dc-449d-9b43-71d170fd1e7a/zkoezU7GGNbZGOF.DPhgQQfYq6xqp3puWFcPPkj0WfJZjBwnMo70P6W2eE1tPnaBwUa2NjmyUcc5p00AdRjZunJLoD8DAmooD61wH8RxnEY!/b&bo=yADIAAAAAAADFzI!&rf=viewer_4&t=5",
    gray: "http://m.qpic.cn/psc?/931299a0-15dc-449d-9b43-71d170fd1e7a/zkoezU7GGNbZGOF.DPhgQa4C.cNBJeMwlANl6r1A90d8bLVPSRrNB1tBEKZdTCNxP3wI9ftBX43vGRRYiVaU8nz0mCQn8SC9cRPalw2SfFo!/b&bo=yADIAAAAAAADByI!&rf=viewer_4&t=5",
    red:"http://m.qpic.cn/psc?/931299a0-15dc-449d-9b43-71d170fd1e7a/zkoezU7GGNbZGOF.DPhgQYVt*zpkwH3y2w3t2omdtT4TWUCW8u2.B4c4QzYUYXrleGn4g7E10F5vBrTZ1FVcSlB4XlOlS8yS313dXsTKHqw!/b&bo=yADIAAAAAAADFzI!&rf=viewer_4&t=5",
    green: "http://m.qpic.cn/psc?/931299a0-15dc-449d-9b43-71d170fd1e7a/zkoezU7GGNbZGOF.DPhgQe7s12NTS9LC1bkr7WkFU2*jdi75twznJSD8GFQTZYoVzy7F5OWhW3TiFuM8rBiEo0hxW2SVicr8v5p77FuT9aM!/b&bo=yADIAAAAAAADByI!&rf=viewer_4&t=5"
  },
  onShow:function(){
    console.log(app.globalData.cafeteria_num)
    this.setData({
      numPeople: app.globalData.cafeteria_num,
    })
    console.log("从数据库读取数据")
  },
  detect: function (e) {
    console.log(e)
    app.globalData.this_detect = e.currentTarget.dataset.num;
    wx.navigateTo({
      url: '/pages/detect_num/time/index',
    })
  }
})