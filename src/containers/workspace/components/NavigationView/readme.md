### 导航路径分析页面
* 流程说明
    - 从` 导航采集 -> 导航 `进入该页面
    - 选择起点，跳转到`MapView`页面点选，设为起点后返回该界面
    - 选择终点，跳转到`MapView`页面点选，设为终点后返回该界面
    - 点击路径分析，开始根据已选择的点和当前路网进行路径分析，成功后返回`MapView`，显示相关组件
* 功能说明
    - 选择起点：点击后跳转到`MapView`，通过`MapSelectPointButton`组件的逻辑，选择起点
    - 选择终点：逻辑同上
    - 点击历史记录的任意一条：将该条记录的起点/终点等信息设置为当前
    - 路径分析：进行导航路径分析

* 路径分析功能详细说明
    1. 首先在起点、终点 都存在的情况下，调用`SNavigation.getPointBelongs`获取当前点所在的室外数据集和室内数据源
    2. 获取到的数据进行处理，找到起点和终点的公共室内数据源和公共室外数据集
    3. 将上一步公共数据再和用户已选择的数据求公共部分，如果有公共部分，则可进行导航，继续往下进行，如果此时没有公共部分，则代表用户选择的点，不在用户选择的数据范围内，无法进行导航
    4. 设置当前公共数据到`MapView`（使用`this.setNavigationDatas`设置）
    5. 根据刚才得到的数据，依次判断哪种导航：
        1. 存在公共室内数据源 -> 室内导航
        2. 存在公共室外数据集：
            + 存在不同的室内数据源 -> 三段室内外一体化导航，室内->室外->室内（注：由于楼层控件可能会出问题，暂未实现）
            + 起点有室内数据源 -> 两段室内外一体化导航，室内->室外
            + 终点有室内数据源 -> 两段室内外一体化导航，室外->室内
            + 无室内数据源 -> 室外导航
        3. 不存在公共室内/室外数据 -> 在线路径分析
    6. `SNavigation.getStartPoint`设置起点，`SNavigation.getEndPoint`设置终点，根据不同的导航类型，再设置相应的导航参数，然后进行路径分析
    7. 分析完成后，使用`this.changeNavPathInfo`改变`MapView`的路径信息，显示`MapView`中的相关组件，然后把当前导航记录存入
       导航的history，跳转回`MapView`
     ```
        注：两段以上的室内外导航，都应将导航参数所需要的数据存储在GLOBAL.NAV_PARAMS数组内；
        一段导航完成后，MapView内的导航结束监听会根据GLOBAL.NAV_PARAMS处理下一段导航的逻辑
        参数项如下：
        室外参数:
         {
            startX: 起点经度
            startY: 起点纬度
            endX: 终点经度
            endY: 终点纬度
            isIndoor: 是否室内 false
            hasNaved: 是否已导航（global.NAV_PARAMS[0]的此项需要设置为true，后面的设置为false）
            datasourceName: 数据源名称
            datasetName: 数据集名称
            modelFileName: 模型文件名称
         }
        室内参数:
         {
            startX: 起点经度
            startY: 起点纬度
            startFloor: 起点楼层ID
            endX: 终点经度
            endY: 终点纬度
            endFloor: 终点楼层ID
            datasourceName: 数据源名称
            isIndoor: 是否室内 true
            hasNaved: 是否已导航（global.NAV_PARAMS[0]的此项需要设置为true，后面的设置为false）
         }
     ```