pagingLoadInitial
pagingLoadNext

pagingRequestStarter
pagingRequestStoper

pagingFinishedCallback

const app = getApp()

const intbird_behavior_paging = require('../../../components/behavior/intbird_behavior_paging')

Component({
  behaviors:[ intbird_behavior_paging ],

  properties: {
  },
  data: { 
  },
  
  methods: {
    onUserPullRefresh() {
      getNetworkCache(ConfigStoreKeys.PAGE_DATA_CACHE.FeedFeeds,
        cache =>{
          this.pagingLoadInitial(0, 2, cache) //如果有缓存，默认从0页开启加载，一页加载2条数据，首次显示缓存
      },fail =>{
          this.pagingLoadInitial(0, 2)        //如果无缓存，默认从0页开启加载，一页加载2条数据
      })
    },
    onUserPullLoadMore() {
      this.pagingLoadNext()                   // 加载下一页
    },
    onUserPullNewKeyType(pagingId) {
      this.pagingLoadPagingId(pagingId)       // 切换加载key，这个key不一定是string,可以是个对象，用于将标示传回给业务方 
    },
    pagingRequestStarter(needRefresh){
      const { pageId, pageIndex, pageSize } = this.pagingPager()
      //请求数据                      
      requestUserIdFeeds({
        pageId: pageId,
        pageIndex: pageIndex,                // pageIndex 先默认为数字，如果需要，可以变更为string，或者使用内部map记录一下
        pageSize: pageSize, 
      }, result => {
        if (result.success) {
          const newArray = result['news']
        
          this.pagingRequestStoper(needRefresh, newArray)   //处理返回
        } else {
          this.pagingRequestStoper(needRefresh, [])         //请求结束
        }
      })
    },
    pagingFinishedCallback(pageArray){
      //放入缓存
      putNetworkCache(ConfigStoreKeys.PAGE_DATA_CACHE.FeedFeeds, pageArray)
    } 
})
