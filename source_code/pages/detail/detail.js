let ID = ''
let favor = []
let datalist = []
let favor_no = 'http://m.qpic.cn/psc?/931299a0-15dc-449d-9b43-71d170fd1e7a/zkoezU7GGNbZGOF.DPhgQY.2LusOumeD5FiFL4s9o.1xfGyJnWIsJs6phx4MIvqBb5AoeiNi8Tmi8MJVxTOL567kssDzRfHSXkID.tQm5D0!/b&bo=yADIAAAAAAADByI!&rf=viewer_4&t=5'
let favor_yes = 'http://m.qpic.cn/psc?/931299a0-15dc-449d-9b43-71d170fd1e7a/zkoezU7GGNbZGOF.DPhgQW4GR7co.g*vywLXPnUi097QT8xA.kHhohKOakQmt9Agh39FOR6yowoEJ56LwodLFpMJfPwGBzK2tvByA7m8dLw!/b&bo=yADIAAAAAAADByI!&rf=viewer_4&t=5'
//每个食堂评论页的照片
let cafeteria_image = [
  "https://i.loli.net/2020/03/10/7VlJnqWhKazGM89.jpg", //教1_麻辣拌
  "https://i.loli.net/2020/03/10/ikQhjs6ITy78vut.jpg", //教1_热干面
  "https://i.loli.net/2020/03/10/AVclShWMPTDe9Z2.jpg", //教2_鲇鱼豆腐
  "https://i.loli.net/2020/03/10/pfZVYmi5M3aDHnC.jpg", //教2_蒜蓉西兰花
  "https://i.loli.net/2020/03/10/GIr6Rc3xLbQAfwK.png", //教3_炸酱面
  "https://i.loli.net/2020/03/10/SmlNeLPxXRdt6up.jpg", //教4_小火锅
  "https://i.loli.net/2020/03/10/c6ah514w37WYrIO.jpg", //教4_烤鸭饭
  "https://i.loli.net/2020/03/10/geukMJwNishmLAZ.jpg", //学1_牛排
  "https://i.loli.net/2020/03/10/N4MEDpeGfolZtnI.jpg", //学1_脆皮鸡拌饭
  "https://i.loli.net/2020/03/10/XKMOuvWC2ebxhsV.jpg", //学2_拉面
  "https://i.loli.net/2020/03/10/L28QCJoWkz3K1gN.png", //学2_米线
  "https://i.loli.net/2020/03/10/Rps2MSb6XJzln3c.jpg", //学3_餐盘
  "https://i.loli.net/2020/03/10/kuY8BV7WIdsjNwo.png", //学3_鸭腿
  "https://i.loli.net/2020/03/10/7jrpKORHWtcL623.jpg", //学4_麻辣烫
  "https://i.loli.net/2020/03/10/95nhLMVZ28JxboY.jpg", //学4_锡纸花甲粉
  "https://i.loli.net/2020/03/10/MDLuWF3YI29mJrd.jpg", //学5_螺狮粉 
  "https://i.loli.net/2020/03/10/hwLvWGF7aVYlic2.jpg"  //学5_铁板牛
]
Page({
  data: {
    swiperImg: [],
    favorUrl: [],
    detail: '',
    comment: [],
    content: '',
    comment_png: 'https://wx3.sinaimg.cn/mw690/db753c2ely1gc4dbe0ilzj206l05ka9y.jpg'
  },
  click_favor: function(event) {
    let favorUrl = this.data.favorUrl;
    let index = event.currentTarget.dataset.index;
    var this_url = 'favorUrl[' + index + ']';
    this.setData({
      [this_url]: favor[index] ? favor_no : favor_yes
    })
    favor[index] = !favor[index];
    wx.cloud.callFunction({
        name: 'update_info',
        data: {
          id: ID,
          //根据content在找位置
          content: datalist[index].content,
          favor: favor[index],
          action: 'favor'
        }
      }).then(res => {
        console.log("改变favor状态成功", res)

      })
      .catch(res => {
        console.log("改变favor状态失败", res)
      })
  },
  //获取用户输入内容
  getInput: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit: function() {
    let content = this.data.content;
    if (content.length < 4) {
      wx.showToast({
        title: '评论太短',
        icon: 'none',
      })
      return
    }
    let commentItem = {};
    commentItem.name = getApp().globalData.nickname;
    commentItem.content = content;
    commentItem.favor = false;
    let commentArr = this.data.comment;
    commentArr.push(commentItem)
    //console.log(commentArr)
    wx.showLoading({
      title: '发表中',
    })
    wx.cloud.callFunction({
        name: "update_info",
        data: {
          action: 'comment',
          id: ID,
          comment: commentArr
        }
      })
      .then(res => {
        console.log('上传评论成功', res)
        this.setData({
          comment: commentArr,
          content: ''
        })
      }).catch(res => {
        console.log('上传评论失败', res)
      })
    wx.hideLoading()
  },
  onLoad: function(options) {
    console.log("options:", options)
    const db = wx.cloud.database();
    db.collection('c1_comment').doc(options.id).get().then(res => {
        //console.log("详情页成功", res);
        ID = options.id
        //获取每一个评论点赞信息
        var i;
        for (i = 0; i < res.data.comment.length; i++) {
          favor[i] = res.data.comment[i].favor
        }
        //获取所有评论
        datalist = res.data.comment;
        //设定每一个点赞图标的初始状态
        let favorUrl = [];
        for (i = 0; i < res.data.comment.length; i++) {
          favorUrl[i] = favor[i] ? "../../assets/favor_yes.png" : "../../assets/favor_no.png"
        }

        //获取该食堂的编号
        let cafeteriaNum = options.id[options.id.length - 1]
        let detailImg = [{src:cafeteria_image[2*(cafeteriaNum-1)]},{src:cafeteria_image[2*cafeteriaNum-1]}]
        this.setData({
          id: ID,
          detail: res.data,
          favorUrl: favorUrl,
          comment: res.data.comment,
          swiperImg: detailImg
        })
      })
      .catch(res => {
        console.log("详情页失败", res)
      })
  },


})