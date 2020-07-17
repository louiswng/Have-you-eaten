// pages/home/home.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imglist: {
      "学一": 'https://wx4.sinaimg.cn/mw690/db753c2ely1gc3xgt67o9j202h02amwy.jpg',
      "学二": 'https://wx1.sinaimg.cn/mw690/db753c2ely1gc3xgvytauj202k02c744.jpg',
      '学三': 'https://wx3.sinaimg.cn/mw690/db753c2ely1gc3xgyzyuxj202702e3ya.jpg',
      '学四': 'https://wx3.sinaimg.cn/mw690/db753c2ely1gc3xhmih5qj202e02dwec.jpg',
      '学五': 'https://i.loli.net/2020/03/03/i3gplBHAJhRD4dT.png',
      '教一': 'https://wx3.sinaimg.cn/mw690/db753c2ely1gc3xh3l0e3j202k02fdfn.jpg',
      '教二': 'https://wx4.sinaimg.cn/mw690/db753c2ely1gc3xhgw8jbj202d02d744.jpg',
      '教三': 'https://i.loli.net/2020/03/03/aEQThHWgA1GPR3J.png',
      '教四': 'https://i.loli.net/2020/03/03/i7vsQaKDX4kONbd.png'
    }
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  info: function() {
    wx.navigateTo({
      url: '/pages/info/info',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //获取title和desc
    const db = wx.cloud.database();
    db.collection('c1_comment')
      .get().then(res => {
        console.log("获取成功", res);
        this.setData({
          datalist: res.data
        })
      })
      .catch(res => {
        console.log("获取失败", res)
      })
  },

  gotoDetail: function(event) {
    console.log("event:", event)
    let ee = event.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + ee.item._id,
    })
    console.log(event.currentTarget.dataset.item)
  }


})