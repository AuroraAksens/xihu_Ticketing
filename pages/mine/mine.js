var app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    // loginType登录状态   0表示未授权，1表示已授权
    loginType: null,
    //  AuthType授权状态  0表示已授权 1表示未授权
    AuthType: null,

    //用户数据
    userInfo: '',

    //判断是否登录
    to: 0
  },



  methods: {
    //登录限制
    checkLogin() {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    },

    //渲染我的页面
    showMine() {
      let that = this;
      let token = wx.getStorageSync('token')
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.src + 'user', //仅为示例，并非真实的接口地址
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
              userInfo: res.data.data,
              to: 1
            })
          } else if (res.data.code == 401) {
            wx.setStorageSync('token', '')
            that.zdyShow()
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

    zdyShow() {
      var that = this
      let token = wx.getStorageSync('token')
      if (token) {
        // 已登录状态
        that.setData({
          loginType: 1,
          AuthType: 0
        })
        this.showMine()
      } else {
        // 未登录
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  that.setData({
                    AuthType: 0
                  })
                  wx.setStorageSync('userinfo', res.userInfo)
                }
              })
            } else {
              // 未授权
              that.setData({
                AuthType: 1
              })
            }
          }
        })
        that.setData({
          loginType: 0
        })
      }
    },

    login(e) {
      var that = this
      // 用户信息
      let userInfo = wx.getStorageSync('userinfo')
      // 手机号iv等，加密数据
      let phone = e
      wx.login({
        success(res) {
          if (res.code) {
            var code = res.code
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: app.globalData.src + 'login',
              method: 'POST',
              data: {
                name: userInfo.nickName,
                // gender: userInfo.gender,
                image: userInfo.avatarUrl,
                code: code,
                iv: phone.iv,
                encryptedData: phone.encryptedData
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                wx.hideLoading()
                if (res.data.code == 200) {
                  wx.setStorageSync('token', res.data.data.token)
                  that.setData({
                    loginType: 1
                  })
                  that.showMine()
                  wx.showToast({
                    title: '登录成功',
                    icon: 'none'
                  })

                  wx.navigateBack()
                } else {
                  console.log(res)
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              },
              fail(res) {
                wx.showToast({
                  title: '服务器繁忙',
                  icon: 'none'
                })
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },

    // 获取用户信息数据
    bindGetUserInfo(e) {
      var that = this
      if (e.detail.errMsg == "getUserInfo:ok") {
        that.setData({
          AuthType: 0
        })
        wx.setStorageSync('userinfo', e.detail.userInfo)
      } else {
        that.setData({
          AuthType: 1
        })
      }
    },

    // 获取用户手机号登录
    getPhoneNumber(e) {
      var that = this
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        that.login(e.detail)
      } else {
        that.setData({
          loginType: 0
        })
      }
    },

    goOrderDetails(e) {
      let id = e.currentTarget.dataset.index
      // 调用navbar页面的方法，也就是父组件的方法
      this.triggerEvent('mineJumps', id)
    },


    //跳转平台公告
    goNotice() {
      wx.navigateTo({
        url: '/pages/subpage/Notice/Notice',
      })
    },

    //跳转关于我们
    goAboutUs() {
      wx.navigateTo({
        url: '/pages/subpage/AboutUs/AboutUs',
      })
    },


    //跳转核销员
    goCheck() {
      wx.navigateTo({
        url: '/pages/subpage/checkQRcode/checkQRcode',
      })
    }

  }
})