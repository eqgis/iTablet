### 导航采集 左上角 路况与室内采集按钮（室内采集需要合并到采集模块）
* 说明
    - 从 `导航采集 -> 左上角按键` 进入
    - 室外地图状态下，点击按钮通过`SNavigation.openTrafficMap、SNavigation.removeTrafficMap`开启/关闭路况功能
    - 室内地图状态下，显示增量路网，选择增量方式（默认手绘）后点击绘制，进入室内增量路网模块
        `注：室内增量的逻辑还在toolModule中，需要拆分出来，与incrementModule合并`
