// pages/subpage/showQRcode/showQRcode.js
import drawQrcode from '../../../common/dist/weapp.qrcode.esm'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    status: '',
    setInter: null,
    order_id: '',

    //控制是否同意
    sta: true,

    //控制弹框
    showTips: 1,
    showTi1: 0,
    showTi2: 0,
    showTi3: 0,

    showcode: "left: 10000rpx",

    screenBrightness: 0, // 屏幕亮度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let type = options.type
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      status: options.status,
      order_id: options.id
    })
    wx.request({
      url: app.globalData.src + 'order/qr_code?order_id=' + options.id,
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data,
            type: type
          })
          that.showCode(options.id)
          if (that.data.showTips == 3) {
            drawQrcode({
              width: 180,
              height: 170,
              canvasId: 'myQrcode',
              // ctx: wx.createCanvasContext('myQrcode'),
              text: res.data.data.qr_number2
            })
            // that.setData({
            //   showcode: "",
            // })
          }

        } else {
          clearInterval(that.data.setInter)
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })


  },

  // 调整屏幕亮度
  adjustScreenBrightest() {
    const that = this;
    wx.getScreenBrightness({
      complete: (res) => {
        console.log(res)
        that.setData({
          screenBrightness: res.value
        })
      },
    })

    wx.setScreenBrightness({
      value: 1,
    })
  },

  //使用说明
  goShowTips() {
    wx.navigateTo({
      url: '/pages/subpage/showTips/showTips?status=' + 0,
    })
  },

  //展示二维码
  showCode(id) {
    let that = this;
    let token = wx.getStorageSync('token')
    let order_id = that.data.order_id
    let type = that.data.status
    clearInterval(that.data.setInter)
    that.data.setInter = setInterval(
      function () {
        wx.request({
          url: app.globalData.src + 'order/qr_code?order_id=' + id, //仅为示例，并非真实的接口地址
          method: 'GET',
          header: {
            'token': token,
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            wx.hideLoading()
            if (res.data.code == 200) {
              if (that.data.showTips == 3) { // && that.data.showTi1 == 0 && that.data.showTi2 == 0 && that.data.showTi3 == 0
                that.setData({
                  list: res.data.data,
                  // showcode: "",
                })
                drawQrcode({
                  width: 180,
                  height: 170,
                  canvasId: 'myQrcode',
                  // ctx: wx.createCanvasContext('myQrcode'),
                  text: res.data.data.qr_number2
                })
                console.log(app.globalData.src)
                console.log('type:' + type)
                console.log('status: ' + res.data.data.status)
                if (type == 1) {
                  if (res.data.data.status == '2') {
                    console.log('入场成功')
                    // that.setData({
                    //   showTi1: 1
                    // })
                    wx.showModal({
                      title: '提示',
                      content: '入场核销成功，请将计时页面展示给工作人员安排对应船只上船',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                          that.goOrder2(0)
                        }
                      }
                    })
                    clearInterval(that.data.setInter)
                  }
                } else {
                  if (res.data.data.status == '3') {
                    console.log('出场成功')
                    // that.setData({
                    //   showTi2: 1
                    // })
                    wx.showModal({
                      title: '提示',
                      content: '出场核销成功，请在订单页进行退剩余押金操作。欢迎下次再来！',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                          that.goOrder2(1)
                        }
                      }
                    })
                    clearInterval(that.data.setInter)
                  }
                }
              }


            } else {
              clearInterval(that.data.setInter)
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: '2000'
              })
            }
          },
        })
      }, 2000);
  },

  //确认须知
  checkBox(e) {
    let sta = e.currentTarget.dataset.sta
    if (sta) {
      this.setData({
        sta: false
      })
    } else {
      this.setData({
        sta: true
      })
    }
  },

  //弹框
  close() {
    if (this.data.showTips == 1) {
      this.setData({
        showTips: 2
      })
    } else {
      this.setData({
        showTips: 3
      })
    }
  },

  // yunzhihui
  goOrder2(type) {
    let id = this.data.order_id
    let showTi1 = this.data.showTi1
    let showTi2 = this.data.showTi2
    if (showTi1 == 1) {
      this.setData({
        showTi1: 0
      })
    } else {
      this.setData({
        showTi2: 0
      })
    }
    wx.redirectTo({
      url: '/pages/subpage/orderTimeDetails/orderTimeDetails?order_id=' + id + '&type=' + type,
    })
  },

  goOrder(e) {
    let id = this.data.order_id
    let type = e.currentTarget.dataset.type
    let showTi1 = this.data.showTi1
    let showTi2 = this.data.showTi2
    if (showTi1 == 1) {
      this.setData({
        showTi1: 0
      })
    } else {
      this.setData({
        showTi2: 0
      })
    }
    wx.redirectTo({
      url: '/pages/subpage/orderTimeDetails/orderTimeDetails?order_id=' + id + '&type=' + type,
    })
  },

  goBack1() {
    let shiwTI3 = this.data.showTi3
    if (shiwTI3 == 1) {
      this.setData({
        showTi3: 0
      })
    } else {
      this.setData({
        showTi3: 1
      })
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 将屏幕调整最亮
    this.adjustScreenBrightest()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    clearInterval(that.data.setInter)

    wx.setScreenBrightness({
      value: that.data.screenBrightness,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})