//app.js
App({
  onLaunch: function () {
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    // yunzhihui 获取配置
    this.getSystemConfig();
  },
  globalData: {
    userInfo: null,
    // src: 'http://www.ticketing.com/api/',
    src: 'https://boat.yunzhihuikj.com/api/',
    // src: 'http://frp.penguinvip.com/api/',
    imgsrc: 'https://boat.yunzhihuikj.com/',
    systemconfig: null,
    bouy:true
  },
  // yunzhihui 获取系统配置
  getSystemConfig(){
    let that = this;
    wx.request({
      url: that.globalData.src + 'system/config', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 200) {
          console.log("获取系统配置参数：" + JSON.stringify(res.data.data))
          that.globalData.systemconfig = res.data.data
        } else {
          console.log(res)

        }
      },
    })
  },
})