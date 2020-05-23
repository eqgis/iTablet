### 标注模块
* 流程说明
    - 从 `MapView界面 -> 标注` 进入此模块
    - 选择操作类型
    - 标注完成后提交

* 功能说明
    - 选择不同的操作后，通过`SMap.setAction`设置不同的Action，文字特殊处理，文字设置后更改TouchType，点击地图跳转到`InputPage`，输入文字信息后返回
    - 对象编辑：对标注对象进行操作，基本功能与其他模块对象编辑相同
    - `getTouchProgressInfo、setTouchProgressInfo、getTouchProgressTips`为[TouchProgress](./../../../TouchProgress/TouchProgress.js)重构后使用的方法，目前`MarkModule`的`TouchProgress`已重构完成，其他模块重构参照此模块