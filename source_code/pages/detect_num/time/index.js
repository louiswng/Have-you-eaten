//index.js
//获取应用实例
let access_token = ''
const app = getApp()
Page({
  data: {
    people_num:0,
    urlencode:'',
    backImg:'',
    originalImg:'',
    isDetect:false,
    current: 0
  },
  
  //上传图片
  uploadImage() {
    let target_cafeteria = 'cafeteria'.trim() + app.globalData.this_detect;
    console.log(target_cafeteria)
    let that = this;
    let openid = app.globalData.openid || wx.getStorageSync('openid');
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let filePath = res.tempFilePaths[0];
        const name = Math.random() * 1000000;
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,//云存储图片名字
          filePath,//临时路径
          success: res => {
            console.log('[上传图片] 成功：', res)
            let fileID = res.fileID;
            //把图片存到image集合表
            const db = wx.cloud.database();
            db.collection(target_cafeteria.trim()).add({
              data: {
                fileID: fileID
              },
              success: function () {
                wx.showToast({
                  title: '图片存储成功',
                  'icon': 'success',
                  duration: 3000
                })
              },
              fail: function () {
                wx.showToast({
                  title: '图片存储失败',
                  'icon': 'none',
                  duration: 3000
                })
              }
            });
          },
          fail: e => {
            console.error('[上传图片] 失败：', e)
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      }
    })
  },

  //步骤条函数
  handleClick() {
    const addCurrent = this.data.current + 1;
    const current = addCurrent > 2 ? 0 : addCurrent;
    this.setData({
      'current': current
    })
  },

  downloadImage:function(callback){
    if (this.data.current != 0) {
      wx.showToast({
        title: '已得到食堂图片！',
        icon: 'none'
      })
      return
    }
    var that = this;
    var this_fileID;
    //1、引用数据库   
    const db = wx.cloud.database({})
    wx.showLoading({
      title: '正在下载',
    })
    //2、开始查询数据了  
    //现假设只有三个餐厅
    db.collection("cafeteria" + app.globalData.this_detect).get({
      //如果查询成功的话    
      success: res => {

        console.log('下载成功：', res.data)
        //随机取该集合中一张照片，返回它的fileID
        //因为有一个数据是person_num，所以-1
        this_fileID = res.data[Math.floor(Math.random() * (res.data.length - 1))].fileID;
        if (this_fileID == undefined){
          wx.showToast({
            title: '请求失败,请再尝试一次',
            icon: 'none',
            duration: 2000
          })
          return
        }
        //将该图片下载到本地
        wx.cloud.downloadFile({
          fileID: this_fileID,
          success: res => {
            //console.log(res.tempFilePath)
            this.setData({
              originalImg:res.tempFilePath,
              isDetect:false
            })
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePath, //选择图片返回的相对路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调
                //console.log('data:image/png;base64,' + res.data);
                //将base64格式转为urlencode
                var code = encodeURI(res.data);
               
                that.setData({
                  urlencode:code
                })
                wx.showToast({
                  title: '下载成功',
                  icon:'success',
                  duration:2000
                })
                console.log('编码成功');
                //防止真机调试卡住
                wx.clearStorage();
                this.handleClick();
                this.detect();
              },
              fail: res => {
                console.log("base64编码失败")
              }
            })
          },
          fail: console.err
        })
        wx.hideLoading();
      }
    })
    
  },
  detect:function(){
    if (this.data.current != 1) {
      wx.showToast({
        title: '请先获取食堂图片',
        icon: 'none'
      })
      return
    }
    //百度的access_token，如果出现invalid的报错则需更新
    // var access_token = '24.f8aee83d449d15928e975623dcb61c04.2592000.1584926770.282335-18313391';
    var that=this;
    // //以下为获取access_token的POST请求

    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=avH0EQtYophzTs5lca0FlL3P&client_secret=CxN3xSDcqrYtE07DGMxPeMF1ibhl1eIb',
      method:'POST',
      success:function(res){
        access_token=res.data.access_token.trim();
        console.log(res);
        console.log("access_token:",access_token);

        //调用API
        console.log('开始检测')
        wx.clearStorage();
        wx.showLoading({
          title: '正在检测',
        })
        wx.request({
          url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/body_num?access_token=' + access_token,
          method: 'POST',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
            image: that.data.urlencode,
            show: true
          },
          success(res) {
            //console.log(res)
            that.setData({
              isDetect: true,
              backImg: 'data:image/png;base64,' + res.data.image,
              people_num: res.data.person_num
            })
            let i = app.globalData.this_detect;
            const db = wx.cloud.database({});
            db.collection("cafeteria" + i).doc("person_num" + i).update({
              //如果更新成功的话 

              data: { person_num: that.data.people_num },
              success: res => {

                console.log('成功更新：', "cafeteria" + i, "的人数", res.data.person_num);

              },
              fail: console.err
            })
            app.globalData.cafeteria_num[i - 1] = res.data.person_num;
            that.handleClick();

          },
          fail() {
            console.err;
          }

          //调用百度人流量统计API
        })
        wx.hideLoading();
      }
    })

    
  },

  onShow: function () {
    
    this.setData({
      isDetect:false
    })
  },
  
  onHide:function(){
    console.log(app.globalData.cafeteria_num)
  },

  onLoad:function(){
    this.downloadImage(this.detect);
  }
  
})
