// pages/subpage/checkQRcode/checkQRcode.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //跳转核销记录
  goQRcodeLog() {
    wx.navigateTo({
      url: '/pages/subpage/QRcodeLog/QRcodeLog',
    })
  },

  //拉起扫码
  checkCode() {
    wx.scanCode({
      success(res) {
        let result = res.result
        if (res.errMsg = 'scanCode:ok') {
          wx.showModal({
            title: '提示',
            content: '是否确认核销',
            success(res) {
              if (res.confirm) {
                let that = this;
                let token = wx.getStorageSync('token')
                wx.showLoading({
                  title: '加载中',
                })
                wx.request({
                  url: app.globalData.src + 'order/cancellation',
                  method: 'POST',
                  header: {
                    'token': token,
                    'content-type': 'application/json' // 默认值
                  },
                  data: {
                    qr_number: result,
                    code: 0
                  },
                  success(res) {
                    wx.hideLoading()
                    console.log(res)
                    if (res.data.code == 200) {
                      console.log(res.data.code)
                      wx.showToast({
                        title: '扫码核销成功',
                        icon: 'none',
                        duration: 2000
                      })
                    } else {
                      console.log(res)
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  },
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        } else {
          console.log(222)
        }
      }
    })
  },
  postHexiao(e) {
    this.setData({
      qr_number: e.detail.value
    })
  },
  postQd() {
    let qr_number = this.data.qr_number
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'order/cancellation',
      method: 'POST',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      data: {
        qr_number: qr_number,
        code: 1
      },
      success(res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.code == 200) {
          console.log(res.data.code)
          wx.showToast({
            title: '手动核销成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          console.log(res)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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