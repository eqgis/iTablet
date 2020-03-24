#Modules
> ####FunctionToolbar和Toolbar功能模块
  包含地图界面右侧工具栏和底部弹出工具栏的功能和界面
> ####目录结构
* index.js
* Action.js
* Data.js
* utils.js
* customView (Dir，option)


#####index.js
```jsx harmony
// 
async function action(type) {
  const params = ToolbarModule.getParams()             // Toolbar中的属性和方法
  const orientation = params.device.orientation        // 获取设备横竖屏
  const layout = utils.getLayout(type, orientation)    // 获取底部内容框中高度和列数
  params.showFullMap && params.showFullMap(true)       // 显示全屏（option，根据弹出底部后，地图是否出现透明遮罩）
  ToolbarModule.setData({                              // 设置当前被选中侧边栏模块的数据，可在外部调用该模块方法和数据
    type: type,
    getData: StartData.getData,
    actions: StartAction,
  })
  params.setToolbarVisible(true, type, {               // 弹出底部界面
    containerType: ToolbarType.table,                  // 底部内容界面类型
    column: layout.column,
    height: layout.height,
    // data: _data.data,                               // 其余内容可参照Toolbar setVisible中的参数进行设置
    // buttons: _data.buttons,
    // customView: customView,                         // 自定义内容界面
  })
}


// 侧边栏设置
export default function(type, title, customAction) {
  return {
    key: title,
    title: title,                    // 侧边栏标题
    action: () => {                  // 点击事件
      if (customAction === false) {
        return
      } else if (typeof customAction === 'function') {
        customAction(type)           // 自定义点击事件
      } else {
        action(type)
      }
    },
    size: 'large',                   // 图片大小
    image: require('../../../../../../assets/function/icon_function_start.png'),
                                     // 自定义图片（option）
    getData: StartData.getData,      // 自定义点击右侧工具栏后，底部弹出对应弹窗的界面（含内容data，底部按钮）
    actions: StartAction,            // 底部内容中的点击事件
    getLayout: utils.getLayout,      // 底部内容高度及列数
  }
}
```

#####Data.js
```jsx
...
export default {
  getData,        // 获取ToolbarContentView 数据和底部按钮
  getMenuData,    // 获取指滑菜单数据（option）
  getDatasets,
  // ...自定义数据获取
}
```

#####Action.js
```jsx 
...
export default {
  commit,
  close,
  tableAction,
  layerListAction,
  menu,
  // ...自定义数据获取
}
```