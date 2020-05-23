# 顶部进度条组件
 * 说明：此组件需要重构，目前[MarkModule](./../ToolBar/modules/markModule/MarkAction.js)已重构完成
 * 需要使用此组件的module的Action需要暴露以下三个方法
    1. getTouchProgressInfo： 获取TouchProgress的初始化信息
    * 返回值如下
     ```
        {
         value: Number,     当前值
         tips: String,      当前信息
         step: Number,      步长 最小改变单位,默认值1
         range: Array,      数值范围 
        }
     ```
    2. setTouchProgressInfo： 设置进度条相关信息到题图
    * 参数如下：
    ```
    value:Number      当前值
    ```
    3. getTouchProgressTips： 获取TouchProgress的当前信息
    * 参数如下：
     ```
     value:Number    当前值
     ```
    * 返回值如下
     ```
     tips:String   当前顶部tips信息
     ```