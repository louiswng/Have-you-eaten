let priceIndex = 0
let ratingIndex = 0
let min_price = 0
let max_rating = 0
let datalist = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    showModal: false,
    imglist: [
      "https://www.bupt.edu.cn/images/18/08/17/1ngdm02sdk/C997CD699908860F802BEE003DA_92E7D630_2711B.jpg",
      "https://www.bupt.edu.cn/images/18/08/17/1ngdm02sdk/C520753EA3BD262F2BFF0ED554F_5401D08F_2E235.jpg",
      "https://www.bupt.edu.cn/images/18/08/17/1ngdm02sdk/D36427DFDA9D6D5B4E2D75A2084_35817036_25831.jpg"
    ],
    array: [{
      titlelist: "省时模式",
      englishlist: "Time Mode",
      imagelist: "https://wx2.sinaimg.cn/mw690/db753c2ely1gc4dwxelt9j205k05k0sw.jpg"
    }, {
      titlelist: "经济模式",
      englishlist: "Money Mode",
        imagelist: "https://wx3.sinaimg.cn/mw690/db753c2ely1gc4ejejoknj205k05kq2y.jpg"
    }, {
      titlelist: "美食模式",
      englishlist: "Food Mode",
        imagelist: "https://wx1.sinaimg.cn/mw690/db753c2ely1gc4e2los6cj205k05k0su.jpg"
    }],
    floor: "学生食堂一层",
    priceIndex: 0,
    ratingIndex: 0,
    min_price: 0,
    max_rating: 0
  },

  comment: function() {
    wx.navigateTo({
      url: '/pages/comment/home',
    })
  },

  mode: function(e) {
    console.log(e.currentTarget.dataset.mode)
    if (e.currentTarget.dataset.mode == "省时模式") {
      wx.navigateTo({
        url: '/pages/detect_num/home/home',
      })
    } else if (e.currentTarget.dataset.mode == "经济模式") {
      let cafeteria = '';
      if (priceIndex == 0) {
        cafeteria = '学一';
      } else if (priceIndex == 1) {
        cafeteria = '学二';
      } else if (priceIndex == 2) {
        cafeteria = '学三';
      } else if (priceIndex == 3) {
        cafeteria = '学四';
      } else if (priceIndex == 4) {
        cafeteria = '学五';
      } else if (priceIndex == 5) {
        cafeteria = '教一';
      } else if (priceIndex == 6) {
        cafeteria = '教二';
      } else if (priceIndex == 7) {
        cafeteria = '教三';
      }  else if (priceIndex == 8) {
        cafeteria = '教四';
      }
      wx.showModal({
        title: '经济模式',
        content: '最省钱的食堂是：' + cafeteria,
        cancelText: '取消',
        cancelColor: 'skyblue',
        confirmText: '详细信息',
        confirmColor: 'skyblue',
        success: function(res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            //点击详细信息
            console.log(datalist);
            wx.navigateTo({
              url: '/pages/detail/detail?id=' + datalist[priceIndex]._id,
            })
          }
        }
      })
    } else if (e.currentTarget.dataset.mode == "美食模式") {
      let cafeteria = '';
      if (priceIndex == 0) {
        cafeteria = '学一';
      } else if (priceIndex == 1) {
        cafeteria = '学二';
      } else if (priceIndex == 2) {
        cafeteria = '学三';
      } else if (priceIndex == 3) {
        cafeteria = '学四';
      } else if (priceIndex == 4) {
        cafeteria = '学五';
      } else if (priceIndex == 5) {
        cafeteria = '教一';
      } else if (priceIndex == 6) {
        cafeteria = '教二';
      } else if (priceIndex == 7) {
        cafeteria = '教三';
      } else if (priceIndex == 8) {
        cafeteria = '教四';
      }
      
      wx.showModal({
        title: '美食模式',
        content: '最好吃的食堂是：' + cafeteria,
        cancelText: '取消',
        cancelColor: 'skyblue',
        confirmText: '详细信息',
        confirmColor: 'skyblue',
        success: function(res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            //点击详细信息
            //console.log(datalist);
            wx.navigateTo({
              url: '/pages/detail/detail?id=' + datalist[ratingIndex]._id,
            })
          }
        }
      })
    }
  },
  onLoad: function() {

    //GetUserInfo
    var app = getApp();
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          console.log("用户已授权")
          wx.getUserInfo({
            success: function(res) {
              app.globalData.nickname = res.userInfo.nickName;
              app.globalData.useravatar = res.userInfo.avatarUrl
              //console.log(res.userInfo)
            },
          })
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          // that.setData({
          //   isHide: true
          // });
          wx.navigateTo({
            url: '/pages/login/login',
          })
          console.log("用户未授权")
        }
      },
    })
  },
  onShow: function() {
    const db = wx.cloud.database();
    db.collection('c1_comment').get().then(res => {
      console.log(res)

      var i;
      min_price = res.data[0].price;
      max_rating = res.data[0].rating;
      for (i = 1; i < 9; i++) {
        if (min_price > res.data[i].price) {
          min_price = res.data[i].price;
          priceIndex = i;
        }
        if (max_rating < res.data[i].rating) {
          max_rating = res.data[i].rating;
          ratingIndex = i;
        }
      }
      datalist = res.data;
      this.setData({
        priceIndex: priceIndex,
        ratingIndex: ratingIndex,
        min_price: min_price,
        max_rating: max_rating
      })
    })
  }
})