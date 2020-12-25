// pages/subpage/details/details.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,

    //详情数据
    listData: '',

    //登录限制
    token: 0,

    // 游湖大船人数
    num: 1,

    // yunzhihui 预约时间
    reserve_date: null,
    start_date: null,
    end_date: null,

    // yunzhihui 是否可预约当天
    reserve_today: "no",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.getListData(options.id)
    // yunzhihui
    that.updateDate()
    setTimeout(function() {
      that.updateDate()
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //登录限制
  checkLogin() {
    wx.showModal({
      title: '您还未登录',
      content: '是否跳转登录页',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/navbar/navbar?current=' + 2
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // yunzhihui getOrder之前先预约使用日期
  bindDateChange(e){
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if(that.token != 0){
      that.reserve_date = e.detail.value;
      that.getOrder()
    }else{
      that.checkLogin()
    }
  },

  // yunzhihui 更新picker组件日期
  updateDate(){
    let that = this;
    // yunzhihui 获取当前日期，限定选择范围
    let date1 = new Date();
    var date2 = new Date(date1);
    var date3 = new Date(date1);
    date2.setDate(date1.getDate() + 40);
    date3.setDate(date1.getDate() + 1);
    let reserve_today = that.reserve_today
    let start_date = date1.getFullYear() + '-' + (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1) + '-' + date1.getDate();
    let start_date_tomorrow = date3.getFullYear() + '-' + (date3.getMonth() + 1 < 10 ? '0' + (date3.getMonth() + 1) : date3.getMonth() + 1) + '-' + date3.getDate();
    let end_date = date2.getFullYear() + '-' + (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) + '-' + date2.getDate();
    console.log(app.globalData.systemconfig)
    if(app.globalData.systemconfig.reserve_today != undefined){
      reserve_today = app.globalData.systemconfig.reserve_today
    }
    if(app.globalData.systemconfig.reserve_today == 'yes'){
      that.setData({
        start_date: start_date
      })
    }else{
      that.setData({
        start_date: start_date_tomorrow
      })
    }
    that.setData({
      end_date: end_date
    })
  },

  //跳转订单页并支付
  getOrder() {
    let that = this;
    let list = this.data.listData
    let token = wx.getStorageSync('token')

    if (this.data.status == 1) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.src + 'order/tickets',
        method: 'POST',
        header: {
          'token': token,
          'content-type': 'application/json' // 默认值
        },
        data: {
          product_id: Number(list.id), //商品ID
          vessel_type: list.vessel_type.name, //商品类型名称
          reserve_date: that.reserve_date, // yunzhihui 增加预约时间
        },
        success(res) {
          let order = res.data.data
          wx.hideLoading()
          if (res.data.code == 200) {
            wx.requestSubscribeMessage({
              tmplIds: ['slWqc7UOIGg6LVDa9CMuvjsCGQR1o66l2VGwYdp2-IA', 'CyAGeJdRtp1eI2nTMzYRNlpY5_aZjlYvtvnDf1Q0kwY'],
              success(res) {
                wx.requestPayment({
                  timeStamp: order.timeStamp,
                  nonceStr: order.nonceStr,
                  package: order.package,
                  signType: 'MD5',
                  paySign: order.paySign,
                  success(res) {
                    wx.showToast({
                      title: '购买成功',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(function () {
                      //要延时执行的代码
                      wx.navigateTo({
                        // url: '/pages/subpage/placeOrder/placeOrder',
                        url: '/pages/navbar/navbar?current=' + 1,
                      })
                    }, 1000)
                  },
                  fail(res) {
                    console.log(res)
                    wx.showToast({
                      title: '支付失败',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
              }
            })
          } else if (res.data.code === 401) {
            // token过期
            wx.showModal({
              title: "提示",
              content: "登录信息已经失效，请前往“我的”重新登录",
              success (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/navbar/navbar?current=' + 2
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
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

    } else {
      this.setData({
        status: 1
      })
    }
  },

  // 重新

  //游湖大船支付
  getOrder1() {
    let that = this;
    let list = this.data.listData
    let num = this.data.num
    let token = wx.getStorageSync('token')
    if (this.data.status == 1) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.src + 'order/tickets',
        method: 'POST',
        header: {
          'token': token,
          'content-type': 'application/json' // 默认值
        },
        data: {
          product_id: Number(list.id), //商品ID
          vessel_type: list.vessel_type.name, //商品类型名称
          num_people: num,
          reserve_date: that.reserve_date, // yunzhihui 增加预约时间
        },
        success(res) {
          let order = res.data.data
          wx.hideLoading()
          if (res.data.code == 200) {
            wx.requestPayment({
              timeStamp: order.timeStamp,
              nonceStr: order.nonceStr,
              package: order.package,
              signType: 'MD5',
              paySign: order.paySign,
              success(res) {
                wx.showToast({
                  title: '购买成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    // url: '/pages/subpage/placeOrder/placeOrder',
                    url: '/pages/navbar/navbar?current=' + 1,
                  })
                }, 1000)
              },
              fail(res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: '2000'
            })
          }
        },
      })

    } else {
      this.setData({
        status: 1
      })
    }
  },

  //渲染详情页
  getListData(e) {
    console.log(e)
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'product/details/' + e,
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
            listData: res.data.data
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

  //加号
  plus() {
    let num = this.data.num
    num++
    this.setData({
      num: num
    })
  },

  //减号
  reduce() {
    let num = this.data.num
    if (num == 1) {
      wx.showToast({
        title: '人数最少为1',
        icon: 'none'
      })
    } else {
      num--
      this.setData({
        num: num
      })
    }
  },

  //乘船须知
  goTips(e) {
    let id = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/subpage/orderDetails/orderDetails?index=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let login = wx.getStorageSync('token')
    if (login) {
      this.setData({
        token: 1
      })
    } else {
      this.setData({
        token: 0
      })
    }
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