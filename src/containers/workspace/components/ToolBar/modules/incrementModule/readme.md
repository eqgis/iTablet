### 导航采集 增量模块
* 流程说明
    - 从`导航采集 -> 采集 -> 室外路网 `进入此模块
    - 进入时，通过`SMap.createDefaultDataset`新建采集数据源/数据集，并且设置当前增量数据`global.INCREMENT_DATA`
    - 然后选择不同的采集方式进行采集，默认GPS轨迹式，采集完成提交后进入拓扑编辑模块
    - 若用户选择了退出，则判定当前数据集是否存在采集数据，若存在，则保留当前数据集，若不存在，则删除当前数据集
* 功能说明
    - button1 返回按钮 弹出退出提示框，确定后退出
    - button2 切换当前路网 通过`SMap.getLineDataset`获取采集数据源中的线数据集，并弹出`LineList`组件
    - button3 切换采集方式 默认GPS轨迹式，可切换为其它方式采集
    - button4 菜单栏显隐
    - button5 进入拓扑编辑模块
#
* LineList组件说明
    - 取消 返回采集模块
    - 点选列表项并确定 通过`SMap.setCurrentDataset`更改当前采集数据集，完成后同时更改`global.INCREMENT_DATA`
    - 列表项右侧改名按钮 通过`SMap.modifyDatasetName`修改当前数据集名称
    - 列表项右侧删除按钮 通过SMap.deleteDatasetAndLayer删除当前采集数据，并自动选中下一个数据集（若下一个存在）`注：删除后需要确定，否则无法重设当前采集数据`