// pages/subpage/AboutUs/AboutUs.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAboutUs()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //渲染关于我们数据
  getAboutUs(e) {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'user/get_about/',
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          // console.log(res.data)
          // that.setData({
          //   listData: res.data.data
          // })
          let html = res.data.data
            .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
            .replace(/<p>/ig, '<p style="font-size: 15Px; line-height: 25Px;margin: 15px;">')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1 style="width: 100%; border-radius: 4Px;"');

          that.setData({

            listData: html
          })
        } else {
          console.log(res)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: '2000'
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