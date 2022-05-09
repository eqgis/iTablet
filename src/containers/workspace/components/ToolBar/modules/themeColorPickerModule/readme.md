### 专题图颜色设置模块
* 流程说明
    - 从 `专题制图 -> 风格（单值标签和单值风格专题图）-> 颜色方案 -> 用户自定义 -> 点击单值后面的色块` 进入
    - 默认拖动条形势，拖动拖动条，设置当前单值颜色到地图
    - 顶部切换色盘 可拖动色盘选择当前单值颜色，设置当前颜色到地图
#
* [PreviewColorPicker](./customView/PreViewColorPicker.js)组件说明
    - 此组件分为拖动条和色盘两种状态，顶部按钮切换
    - 更改颜色值后，通过`_setAttrToMap`实时设置到地图
    - 返回 返回到[CustomModePage](./../../../../../../containers/CustomModePage/CustomModePage.js)
    - 提交 显示地图 隐藏Toolbar 退出全幅