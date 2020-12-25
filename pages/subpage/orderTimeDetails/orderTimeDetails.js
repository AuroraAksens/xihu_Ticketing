// pages/subpage/orderTimeDetails/orderTimeDetails.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    h: "00",
    m: "00",
    s: "00",
    setInter: null,
    order_id: '',
    listData: '',
    time: null,
    status: 0,
    type: 0,
    order_number:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_id: options.order_id,
      type: options.type
    })
    this.getOrderList(options.order_id)
  },
  /**
   * 生命周期函数--监听页面显示
   */


  onShow: function () {

  },


  // 返回格式为xx天xx小时xx分钟
  getRemainderTime(startTime) {
    var s1 = new Date(startTime.replace(/-/g, "/")),
      s2 = new Date(),
      runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
    var year = Math.floor(runTime / 86400 / 365);
    runTime = runTime % (86400 * 365);
    var month = Math.floor(runTime / 86400 / 30);
    runTime = runTime % (86400 * 30);
    var day = Math.floor(runTime / 86400);
    runTime = runTime % 86400;
    var hour = Math.floor(runTime / 3600);
    runTime = runTime % 3600;
    var minute = Math.floor(runTime / 60);
    runTime = runTime % 60;
    var second = runTime;
    this.setData({
      h: hour,
      m: minute,
      s: second
    })
  },

  //获取订单详情数据
  getOrderList(id) {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'order/order_details?order_id=' + id,
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          let numOrder = res.data.data.order_number
          let time =  numOrder.substr(numOrder.length-6)
          that.setData({
            listData: res.data.data,
            time: res.data.data.admission_time,
            order_number:time
          })

          if (that.data.type == 0) {
            // 后端时间
            let timestamp = that.data.time;
            let h = that.data.listData.min_times;
            let m = that.data.listData.min_time;
            clearInterval(that.data.setInter)
            that.data.setInter = setInterval(
              function () {
                that.getRemainderTime(timestamp)
                if (that.data.h > h || that.data.m > m) {
                  that.setData({
                    status: 1
                  })
                  console.log('已超时')
                } else {
                  console.log('正常游玩')
                }
              }, 1000);
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: '2000'
          })
        }
      },
    })
  },

  //跳转计费规则
  goRule(e){
    let id = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/subpage/orderDetails/orderDetails?index=' + id,
    })
  },

  //返回
  goBack(){
    wx.redirectTo({
      url: '/pages/navbar/navbar?current=' + 1,
    })
  },

  //一键拨打
  markPhone(){
    wx.showModal({
      title: '救援电话',
      content: '是否拨打救援电话',
      success (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '13553426155' 
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    let that = this
    clearInterval(that.data.setInter)
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