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
  const _data = StartData.getData(type, params)        // 获取指定类型的数据
  const containerType = ToolbarType.table              // Toolbar内容界面类型
  const data = ToolBarHeight.getToolbarSize(containerType, {data: _data.data})
                                                       // Toolbar内容高度和列数
  setModuleData(type)
  params.setToolbarVisible(true, type, {               // 弹出底部界面
    containerType,                                     // 底部内容界面类型
    column: data.column,
    height: data.height,
    data: _data.data,
    buttons: _data.buttons,
  })
}
// 设置ToolbarModule临时数据
function setModuleData(type) {
  ToolbarModule.setData({
    type,
    getData: StartData.getData,
    actions: StartAction,
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
    setModuleData,
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