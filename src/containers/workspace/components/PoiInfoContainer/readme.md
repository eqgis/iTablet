### Poi搜索相关组件
   * ####PoiTopSearchBar
      - 说明
        + `任意模块 -> 🔍 -> 存在搜索结果返回地图` 显示此组件
        + 搜索框内显示当前搜索关键字
        + 搜索框内可输入关键字进行搜索，`x`按钮为清除当前关键字
        + 左侧返回按钮 返回到`PointAnalyst`页面
   * ####PoiInfoContainer
      - 说明
        + `任意模块 -> 🔍 -> 存在搜索结果返回地图` 显示此组件
        + 此组件有以下几种状态：
            1. `this.state.showMore `为true 当前状态为搜索结果列表隐藏状态，存在搜索结果列表，但是由于用户单击了地图，列表被隐藏，界面显示为一个`查看更多结果按钮`
            2. `this.state.showList` 为false 当前为显示单个地点详细信息的状态，其他模块底部只存在一个`搜周边按钮`，导航模块多一个 `到这去按钮`
            3. `this.state.showList` 为true 但是 `this.state.resultList.length` 为 0，此时，显示搜索icon列表，由用户点击`搜周边按钮`显示
            4. `this.state.showList` 为true 并且 `this.state.resultList.length` 不为0 并且 `this.state.showMore` 为false，此时，显示搜索结果列面，由`PointAnalyst`页面跳转过来，或者用户点击了搜周边进行搜索显示此结果