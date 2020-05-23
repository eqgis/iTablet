### 弹窗组件
* CustomAlertDialog说明
    - 全局弹窗提醒组件
    - MapView上已添加
* 用法
```javascript
  GLOBAL.AlertDialog.setDialogVisible(true, {
    title: String,              //弹窗标题 可选 建议不传
    value: String,              //弹出内容 必选 在图片下方的文字
    confirmBtnTitle: String,    //确定按钮文字 必选
    cancelBtnTitle: String,     //取消按钮文字 必选
    contentStyle:{},            //弹出内容的样式 可选
    contentHeight:Number,       //弹出内容的高度 可选
    confirmAction: ()=>{},      //确定事件 可选
    cancelAction: ()=>{},       //取消事件 可选
  })
```
#
* CustomInputDialog说明
    - 全局弹窗组件 带输入框
    - MapView上已添加
* 用法
```javascript
GLOBAL.InputDialog.setDialogVisible(true, {
          title: String,            //标题 必填 默认为空
          value: String,            //初始值 可选 默认为空
          confirmBtnTitle: String,  //确定按钮文字 可选 默认为 是
          cancelBtnTitle: String,   //取消按钮文字 可选 默认为 否
          placeholder: String,      //placeholder 可选 默认为空
          returnKeyType: String,    //input的returnkeyType 可选 默认为done
          keyboardAppearance: String,//input的keyboardAppearance 可选 默认为 dark
          keyboardType: String,      //input的keyboardType 可选 默认为 default
          confirmAction: () => {},  // 确定事件 返回true 弹窗消失 返回 false 不消失
          cancelAction: () => {},   //取消事件 可选
        })
```