const TAG = "intbird_behavior_paging"

const intbird_behavior_paging = {
  behaviors: [],
  properties: {},
  data: {
    loadingWrapper: {
      pagingId: '',
      lastPagingIdCache: '',

      pageArray: [],
      pageIndex: 0,
      pageSize: 10,

      refresh: false, // 非下拉刷新导致的数据刷新,比如切换pagingId
      loading: false, // 加载更多中...
      finished: false // 已加载完毕
    },
  },
  methods: {
    pagingPager() {
        return  {
          pageId: this.data.loadingWrapper.pagingId,
          pageIndex: this.data.loadingWrapper.pageIndex,
          pageSize: this.data.loadingWrapper.pageSize,
          pageArray: this.data.loadingWrapper.pageArray
        }
    },
    pagingArray(index) {
        return this.data.loadingWrapper.pageArray
    },
    pagingReplaceItem(index, item){
      this.data.loadingWrapper.pageArray.splice(index, 1, item)
      this.setData({
        'loadingWrapper.pageArray': this.data.loadingWrapper.pageArray
      })
    },
    pagingLoadInitial(startIndex, pageSize, pageArray) {
      if(pageArray) this.data.loadingWrapper.pageArray = pageArray
      if(startIndex) this.data.loadingWrapper.pageIndex = pageIndex
      if(pageSize) this.data.loadingWrapper.pageSize = pageSize
      console.log(TAG, "pagingLoadInitial", this.data.loadingWrapper)
      this.pagingLoadFirst()
    },
    pagingLoadFirst() {
      console.log(TAG, "pagingLoadFirst", this.data.loadingWrapper)
      //系统UI变更
      wx.showNavigationBarLoading({
        success: (res) => {},
      })
      //自定义UI变更
      this.setData({
        'loadingWrapper.refresh': true, //reset 下拉刷新的效果自带, 自用的refresh不用再次处理
        'loadingWrapper.loading': false,
        'loadingWrapper.finished': false
      })
      //强刷页面强制请求第一页
      this.data.loadingWrapper.pageIndex = 0
      //在请求结束后刷新页面,防止页面抖动,当前不启用
      //this.data.loadingWrapper.pageArray = []
      this.pagingRequestStarter(true)
    },
    pagingLoadNext() {
      console.log(TAG, "pagingLoadNext", this.data.loadingWrapper)
      // keyId相同, 不允许继续加载(加载中,已结束)
      if(this.data.loadingWrapper.loading == true
        ||this.data.loadingWrapper.finished == true) {
        return false
      }
       //系统UI变更
       wx.showNavigationBarLoading({
        success: (res) => {},
      })
      //自定义UI变更
      this.setData({
        'loadingWrapper.refresh': false,
        'loadingWrapper.loading': true,
        'loadingWrapper.finished': false
      })
      //再请求结束后增加index, 防止页面错误时index增加
      //this.data.loadingWrapper.pageIndex++
      //在请求结束后刷新页面,防止页面抖动,当前不启用
      //this.data.loadingWrapper.pageArray = this.data.loadingWrapper.pageArray
      //请求数据
      this.pagingRequestStarter(false)
    },
    pagingLoadPagingId(pagingId) {
      console.log(TAG, "pagingLoadPagingId", this.data.loadingWrapper)
     
      if(this.data.loadingWrapper.pagingId == pagingId) {
         // keyId相同, 加载中,已结束不允许继续加载 + 当前typeKey已经展示了数据时
        if(this.data.loadingWrapper.refresh == true 
          || this.data.loadingWrapper.finished == true
          || this.data.loadingWrapper.lastPagingIdCache == pagingId) return
      } else {
         // key不同,默认加载
      }

      //自定义UI变更
      this.setData({
        'loadingWrapper.refresh': true, //reset 下拉刷新的效果自带, 自用的refresh不用再次处理
        'loadingWrapper.loading': false,
        'loadingWrapper.finished': false
      })
      this.data.loadingWrapper.pagingId = pagingId
      //强刷页面强制请求第一页
      this.data.loadingWrapper.pageIndex = 0
      //在请求结束后刷新页面,防止页面抖动,当前不启用
      //this.data.loadingWrapper.pageArray = []
      
      //请求数据
      this.pagingRequestStarter(true)
    },
    pagingRequestStarter(needRefresh) {
      console.log(TAG, "pagingRequestStarter", needRefresh, this.data.loadingWrapper)
    },
    pagingRequestStoper(needRefresh, newArray) {
      console.log(TAG, "pagingRequestStoper", needRefresh, newArray)
      //停止刷新
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      //停止刷新效果
      wx.hideNavigationBarLoading({
        success: (res) => {},
      })
      //填充新数据
      if(needRefresh) {
        //重置数据
        this.data.loadingWrapper.pageArray = newArray
      } else {
        //填充数据
        newArray.forEach((feed, index) => {
          this.data.loadingWrapper.pageArray.push(feed)
        })
      }
      
      //下一页页码(进行网络请求前,必须先赋值PageIndex=0, 所以在请求完成后只自增就可以)
      this.data.loadingWrapper.pageIndex++

      //如果数据不足一页, 则已加载全部
      const isFinished =  newArray && newArray.length < this.data.loadingWrapper.pageSize
      
      //通知ui
      this.setData({
        'loadingWrapper.refresh': false,
        'loadingWrapper.loading': false,
        'loadingWrapper.finished': isFinished,
        'loadingWrapper.pageArray': this.data.loadingWrapper.pageArray,
      })
      //多次load去重
      this.data.loadingWrapper.lastPagingIdCache = this.data.loadingWrapper.pagingId
      
      // 回调给页面自己继续处理
      this.pagingFinishedCallback(this.data.loadingWrapper.pageArray)
    },
    pagingFinishedCallback(pageArray) {
      console.log(TAG, "pagingFinishedCallback", needRefresh, this.data.loadingWrapper)
    }
  }
}

module.exports = Behavior(intbird_behavior_paging)
