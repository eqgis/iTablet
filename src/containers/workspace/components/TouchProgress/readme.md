# 顶部进度条组件
 * 需要使用此组件的module的Action需要暴露以下三个方法
    1. getTouchProgressInfo： 获取TouchProgress的初始化信息
    * 参数如下：
    ```
    title: String,     提示消息标题
    ```
    * 返回值如下
     ```
        {
         title: String,     提示消息标题
         value: Number,     当前值
         tips: String,      当前信息
         step: Number,      步长 最小改变单位,默认值1
         range: Array,      数值范围 
         range: Array [number,number],  步长 最小改变单位,默认值1
         unit: string,      单位（可选）
        }
     ```
    2. setTouchProgressInfo： 设置进度条相关信息到题图
    * 参数如下：
    ```
    title: String,     提示消息标题
    value: Number      当前值
    ```