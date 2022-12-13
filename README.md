# wechat-app-paging
微信小程序分页组件

```js
pagingLoadInitial(startIndex, defaultPageSize, defaultCacheData)
pagingLoadNext()

const { pageIndex, pageSize } = pagingPager()
pagingRequestStarter() //requestNetwork
pagingRequestStoper() 

pagingFinishedCallback
```



```
<view wx:for="{{paging.pageArray}}" 
wx:key="unique"
wx:for-index="index"
wx:for-item="item">
  <view>{{item}}</view>
</view>

<loading 
  refresh="{{paging.refresh}}"
  loading="{{paging.loading}}"
  finished="{{paging.finished}}"
></loading>

```

paging.gif
[![paging.gif](https://github.com/intbird/wechat-app-paging/blob/main/paging.gif)](https://github.com/intbird/wechat-app-paging/blob/main/paging.gif)
