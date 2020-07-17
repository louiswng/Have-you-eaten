let num = 0
let ID = '5ff7cf4b-f4d8-4ce3-95a4-3c09a310eb93'
let thisprice = 0
let thisrating = 0
let comment = []
Page({
  data: {
    cafeterias: ["学一", "学二", "学三", "学四", "学五", "教一", "教二", "教三","教四"],
    cafeteriaIndex: 0,
    content: '',
    star: 5
  },
  //获取评论
  getComment: function(e) {
    this.setData({
      content: e.detail.value,
    })
    //console.log(e.detail.value)
  },

  //获取价格
  getPrice: function(e) {
    thisprice = parseInt(e.detail.value)
    //console.log(thisprice)
  },

  //获取食堂
  bindCafeteriaChange: function(e) {
    this.setData({
      cafeteriaIndex: parseInt(e.detail.value)
    })
  },

  //获取评分
  change_rating: function(e) {
    thisrating = e.detail.index
    this.setData({
      'star':e.detail.index
    })
  },

  //提交
  submit: function() {
    let content = this.data.content;
    if (content.length < 4) {
      wx.showToast({
        title: '评论太短',
        icon: 'none',
      })
      return
    }


    //获取该食堂人数
    const db = wx.cloud.database();
    let cafeteriaIndex = this.data.cafeteriaIndex + 1;
    let price = 0;
    let rating = 0;
    ID = ID + cafeteriaIndex;
    console.log("id:", ID);
    let commentItem = {};
    commentItem.name = getApp().globalData.nickname;
    commentItem.avatar = getApp().globalData.useravatar;
    commentItem.rating = thisrating;
    commentItem.price = thisprice;
    commentItem.content = content;
    commentItem.favor = false;
    db.collection('c1_comment').doc('5ff7cf4b-f4d8-4ce3-95a4-3c09a310eb93' + cafeteriaIndex).get().then(res => {
        console.log("res.data", res.data)
        num = res.data.num;
        price = (res.data.price * num + thisprice) / (num + 1);
        rating = (res.data.rating * num + thisrating) / (num + 1);
        console.log("price;rating", price, rating)
        comment = res.data.comment;
        comment.push(commentItem)
        console.log("comment:", comment)

        wx.showLoading({
          title: '发表中',
        })
        num++
        wx.cloud.callFunction({
            name: "update_info",
            data: {
              action: 'comment',
              id: ID,
              comment: comment,
              rating: rating,
              price: price,
              num: num
            }
          })
          .then(res => { //update_info
            console.log('上传评论成功', res)
            //数据清零
            this.setData({
              content: ''
            })
            ID = '5ff7cf4b-f4d8-4ce3-95a4-3c09a310eb93';
            comment = [];
            //
            wx.showModal({
              title: '评价成功',
              content: '您的评论已上传至餐厅主页',
              confirmText: '回到主页',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }).catch(res => { //update_info
            console.log('上传评论失败', res)
            wx.showToast({
              title: '上传评论失败',
              icon: 'none',
              duration: 1500
            })
          })
        wx.hideLoading()
      })
      .catch(res => { //db.collection
        console.log("详情页失败", res)
      })
    //更新评论部分


  },

});