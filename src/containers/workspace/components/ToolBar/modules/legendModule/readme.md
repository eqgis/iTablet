### 图例设置模块 `配合RNLegendView使用`
* 流程说明
    - 从` 任意模块 -> 设置 -> 图例设置 `进入此模块
    - 设置信息更新到redux，实时更改图例状态
* 功能说明
    - button1 退出 退出此模块
    - button2 切换图例显隐 更改redux对应模块下图例的`isShow`属性
    - button3 切换指划菜单/ToolbarContentView
    - button4 切换ToolbarContentView显隐
    - button5 确定 `注：由于属性是实时更新到redux的，所以确定不做任何操作，只需要退出模块`
    
* 指划菜单功能说明
    - 填充色 更改对应模块redux中存储的图例的`backgroundColor`属性
    - 列数 更改`column`属性，更改完成后，`RNLegendView`的state中的`flatListKey++`，否则FlatList会报错
    - 宽度 更改`widthPercent`属性
    - 高度 更改`heightPercent`属性
    - 字体大小 更改 `fontSize`属性
    - 图标大小 更改 `imageSize`属性
    - 图例位置 弹出`MultiPicker`选择栏，设置完成更改`legendPosition`属性