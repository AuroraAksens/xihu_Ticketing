// pages/subpage/logDetails/logDetails.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    listData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //渲染核销记录明细
  listDataLog(){
    let that = this;
    let token = wx.getStorageSync('token')
    let id = that.data.id
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'cancel/cancel_details?product_id=' + id,
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data)
          that.setData({
            listData:res.data.data
          })
        } else {
          console.log(res)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration:'2000'
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.listDataLog()
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