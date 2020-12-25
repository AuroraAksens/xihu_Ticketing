// pages/subpage/shipList/shipList.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //标题高亮
    status: -1,

    //船只类型
    navbar: [],

    //船源列表
    listData: [],

    //搜索数据
    search: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.id,
      search: options.data
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //高亮标题
  selectNav(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      status: index
    })
    if (this.data.status == -1) {
      this.getListData(0)
    } else {
      this.getListData(this.data.status)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTypeData()
    if (this.data.search) {
      this.getListDatSearch()
    } else if (this.data.status == -1) {
      this.getListData(0)
    } else {
      this.getListData(this.data.status)
    }
  },

  //获取船只类型数据
  getTypeData() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'product/vessel_type', //仅为示例，并非真实的接口地址
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
            navbar: res.data.data
          })
        } else {
          console.log(res)
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: '2000'
          })
        }
      },
    })
  },

  //获取船源列表数据
  getListData(e) {
    console.log('渲染首页')
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'product/get_product/' + e, //仅为示例，并非真实的接口地址
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
            title: res.data.message,
            icon: 'none',
            duration: '2000'
          })
        }
      },
    })
  },

  //搜索
  getListDatSearch() {
    console.log('搜索')
    console.log(this.data.search)
    let that = this;
    let data = this.data.search
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'product/get_product/0?search_text=' + data, //仅为示例，并非真实的接口地址
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

  //获取输入框数据
  getData(e) {
    var data = e.detail.value
    this.setData({
      search: data
    })
  },

  //跳转详情页
  goDetails(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/subpage/details/details?id=' + id,
    })
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