Page({
  data: {
    // 这个是判断现在再那个页面的参数
    current: 0,
    height: "calc(100vh - 100rpx)",

    sky: null,

    // bouy:false
  },

  onLoad(options) {
    var current = options.current
    var bouy = options.bouy
    if (current) {
      this.setData({
        current: current
      })
    }

    if(bouy == true){
      this.selectComponent('#order').getData(2)
    }
  },

  onShow() {
    this.onPullDownRefresh()
  },

  onPullDownRefresh() {
    let cur = this.data.current
    if (cur == 0) {
      this.selectComponent('#index').getSky()
      this.selectComponent('#index').getListData()
    } else if (cur == 1) {
      this.selectComponent('#order').showOrder()
    } else {
      this.selectComponent('#mine').zdyShow()
    }
  },

  mineJump(e) {
    let a = e.detail
    //自定义的页面切换事件，用来做特殊的自定义页面跳转的。
    this.setData({
      current: 1
    })
    this.selectComponent('#order').getData(a)
  },

  NavChange(e) {
    let cur = Number(e.currentTarget.dataset.cur)
    this.setData({
      current: cur
    })
  },

  cardSwiper(e) {
    let cur = Number(e.detail.current)
    console.log(cur)
    if (cur == 2) {
      // 调用子组件的方法，自定义的onshow方法
      this.selectComponent('#mine').zdyShow()
      this.setData({
        current: cur
      })
    } else if (cur == 1) {
      this.selectComponent('#order').showOrder()
      this.setData({
        height: "calc(100vh - 100rpx)",
        current: cur
      })
    } else {
      this.selectComponent('#index').getSky()
      this.selectComponent('#index').getListData()
      this.selectComponent('#index').getBJimg()
      this.setData({
        height: "calc(100vh - 100rpx)",
        current: cur
      })
    }
  },

})