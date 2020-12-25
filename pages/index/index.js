//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    //天气数据
    sky: null,

    //商品列表
    listData: [],

    //浮标数据
    buoy:false

  },


  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },


  onLoad: function () {

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },


  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //跳转船源列表
  goShipList(e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/subpage/shipList/shipList?id=' + id,
    })
  },

  //跳转详情页
  goDetails(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/subpage/details/details?id=' + id,
    })
  },

  //跳转关于我们
  goAboutUs() {
    wx.navigateTo({
      url: '/pages/subpage/AboutUs/AboutUs',
    })
  },

  //跳转平台公告
  goNotice(){
    wx.navigateTo({
      url: '/pages/subpage/Notice/Notice',
    })
  },

  //浮标跳转订单页
  getOrder2(){
    wx.navigateTo({
      url: '/pages/navbar/navbar?current=1&bouy=true',
    })
  },

  //天气
  getSky() {
    var that = this
    wx.request({
      url: 'https://tianqiapi.com/api?version=v6&appid=65226661&appsecret=H2mmf415&city=惠州',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('获取天气')
        that.setData({
          sky: res.data
        })
      }
    })
  },

  //获取浮标信息
  // getBuoy() {
  //   let that = this;
  //   let token = wx.getStorageSync('token')
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   wx.request({
  //     url: app.globalData.src + 'underway_order',
  //     method: 'GET',
  //     header: {
  //       'token': token,
  //       'content-type': 'application/json' 
  //     },
  //     success(res) {
  //       wx.hideLoading()
  //       wx.stopPullDownRefresh()
  //         console.log(res.data)
  //         this.setData({
  //           bouy:res.data
  //         })
  //         app.globalData.bouy = rea.data
  //     },
  //   })
  // },

  //获取商品列表数据
  getListData() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'product', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.data.code == 200) {
          that.setData({
            listData: res.data.data
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

  searchInput(e) {
    console.log(e)
    var data = e.detail.value
    wx.navigateTo({
      url: '/pages/subpage/shipList/shipList?data=' + data,
    })
  }

})