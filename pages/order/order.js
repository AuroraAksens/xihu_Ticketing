var app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    value: {
      type: String,
      value: '0'
    }
  },
  data: {
    TabCur: '',
    scrollLeft: 0,
    item: ['全部', '待入场', '已入场', '已出场', '已取消'],
    listData: [],

    //取消订单
    clearOrder: 0,

    // 订单id
    id: '',

    //退款状态
    refundOrder: 0,

    //退款
    time: '',
    price: '',
    consumption: '',

    // yunzhihui 预约时间
    reserve_date: null,
    start_date: null,
    end_date: null,
  },

  ready: function () {
    let that = this
    // yunzhihui 更新配置
    setTimeout(function () {
      that.updateDate()
    }, 1000)
  },

  methods: {

    tabSelect(e) {
      let index = e.currentTarget.dataset.id
      this.setData({
        TabCur: index == 0 ? '' : index,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
      this.showOrder()
    },

    getData(e) {
      this.setData({
        TabCur: e == 0 ? '' : e
      })
      this.showOrder()
    },

    // yunzhihui 修改预约使用日期
    bindDateChange(e) {
      let that = this
      //console.log(e)
      let order_id = e.currentTarget.dataset.id;
      let reserve_date = e.detail.value;
      that.modifyReserveDate(order_id, reserve_date)
    },

    // yunzhihui 修改预约日期
    modifyReserveDate(order_id, reserve_date) {
      let that = this;
      let token = wx.getStorageSync('token')
      let id = that.data.id
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.src + 'order/order_reserve', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          order_id: order_id,
          reserve_date: reserve_date
        },
        header: {
          'token': token,
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          wx.hideLoading()
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
            that.showOrder()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
        },
      })
    },

    //跳转订单详情
    goorderDetails(e) {
      let id = e.currentTarget.dataset.id
      let type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: '/pages/subpage/orderTimeDetails/orderTimeDetails?order_id=' + id + '&type=' + type,
      })
    },

    //重新下单
    gobyorder(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/subpage/details/details?id=' + id,
      })
    },

    //入场二维码
    showQRcode(e) {
      const id = e.currentTarget.dataset.id
      const status = e.currentTarget.dataset.status

      // 预约时间
      const reservedate = e.currentTarget.dataset.reservedate
      // 预约时间时间戳
      const dateReserve = new Date(reservedate);
      const timestampReserve = dateReserve.getTime(dateReserve)
      // 获取当前时间时间戳
      const dateNow = new Date();
      const timestampNow = dateNow.getTime(dateNow)

      if (timestampNow < timestampReserve) {
        wx.showToast({
          title: '尚未到预约时间！',
          icon: "none"
        })
      } else {
        wx.navigateTo({
          url: '/pages/subpage/showQRcode/showQRcode?id=' + id + '&status=' + status,
        })
      }

    },

    /**
     * 获取当前时间
     * @return {Array}
     */
    getDateNow() {
      const date = new Date();
      let arr = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
      return arr;
    },

    //确认入场
    postApply(e) {
      let that = this;
      let token = wx.getStorageSync('token')
      let id = e.currentTarget.dataset.id

      // 预约时间
      const reservedate = e.currentTarget.dataset.reservedate
      // 预约时间时间戳
      const dateReserve = new Date(reservedate);
      const timestampReserve = dateReserve.getTime(dateReserve)
      // 获取当前时间时间戳
      const dateNow = new Date();
      const timestampNow = dateNow.getTime(dateNow)

      if (timestampNow < timestampReserve) {
        wx.showToast({
          title: '尚未到预约时间！',
          icon: "none"
        })
      } else {
        wx.showModal({
          title: '确认入场提示',
          content: '入场后将不得退款',
          success(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '加载中',
              })
              if (token) {
                wx.request({
                  url: app.globalData.src + 'order/apply', //仅为示例，并非真实的接口地址
                  method: 'POST',
                  header: {
                    'token': token,
                    'content-type': 'application/json' // 默认值
                  },
                  data: {
                    order_id: id
                  },
                  success(res) {
                    console.log(res)
                    wx.hideLoading()
                    wx.stopPullDownRefresh()
                    if (res.data.code == 200) {
                      that.showOrder()
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  },
                  fail(err) {
                    console.log(err)
                  }
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '请先登录',
                  icon: 'none',
                  duration: 2000
                })
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }


    },

    //渲染订单列表
    showOrder(index) {
      let that = this;
      let token = wx.getStorageSync('token')
      let TabCur = that.data.TabCur
      wx.showLoading({
        title: '加载中',
      })
      if (token) {
        wx.request({
          url: app.globalData.src + 'order?status=' + TabCur, //仅为示例，并非真实的接口地址
          method: 'GET',
          header: {
            'token': token,
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            wx.hideLoading()
            wx.stopPullDownRefresh()
            if (res.data.code == 200) {
              that.setData({
                listData: res.data.data
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
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }

          }
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        })
      }
    },


    //取消订单
    clearOrder() {
      let that = this;
      let token = wx.getStorageSync('token')
      let id = that.data.id
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.src + 'order/deposit_refund', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          order_id: id
        },
        header: {
          'token': token,
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
            that.setData({
              clearOrder: 0,
              refundOrder: 0
            })
            setTimeout(function () {
              that.showOrder()
            }, 1000)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
      })
    },

    clearOrder1(e) {
      let id = e.currentTarget.dataset.id
      if (this.data.clearOrder == 1) {
        this.setData({
          clearOrder: 0,
        })
      } else {
        this.setData({
          clearOrder: 1,
          id: id
        })
      }
    },

    refundOrder(e) {
      let id = e.currentTarget.dataset.id
      let time = e.currentTarget.dataset.time
      let price = e.currentTarget.dataset.price
      let consumption = e.currentTarget.dataset.consumption
      this.setData({
        time,
        price,
        consumption
      })
      if (this.data.refundOrder == 1) {
        this.setData({
          refundOrder: 0,
        })
      } else {
        this.setData({
          refundOrder: 1,
          id: id
        })
      }
    },

    // yunzhihui 更新picker组件日期
    updateDate() {
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
      if (app.globalData.systemconfig.reserve_today != undefined) {
        reserve_today = app.globalData.systemconfig.reserve_today
      }
      if (app.globalData.systemconfig.reserve_today == 'yes') {
        that.setData({
          start_date: start_date
        })
      } else {
        that.setData({
          start_date: start_date_tomorrow
        })
      }
      that.setData({
        end_date: end_date
      })
    },

  }
})