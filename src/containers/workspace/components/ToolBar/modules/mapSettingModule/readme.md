### 地图设置模块（背景色、颜色模式设置）
* 说明
    - 从` MapView界面 -> 设置 -> 基本设置 -> 颜色模式/背景颜色 `返回到`MapView`进入此模块
    - 从颜色模式进入: 显示`SelectList`组件
    - 从背景颜色进入: 显示公共`ColorTable`组件，点击后通过`SMap.setMapBackgroundColor`设置地图背景颜色
    - 确定按钮: 确定更改，隐藏ToolBar
    - 返回按钮: 取消更改，使用`SMap.mapFromXml`恢复地图，隐藏Toolbar
#
* SelectList组件说明
    - 颜色模式点选列表组件，点选后，通过`SMap.setMapColorMode`设置颜色模式