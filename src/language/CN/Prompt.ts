// 提示语
const Prompt = {
  YES: '是',
  NO: '否',
  SAVE_TITLE: '是否保存当前地图',
  SAVE_DATA_TITLE: '是否保存数据?',
  SAVE_YES: '保存',
  SAVE_NO: '不保存',
  CANCEL: '取消',
  COMMIT: '提交',
  REDO: '重做',
  UNDO: '撤销',
  SHARE: '分享',
  DELETE: '删除',
  WECHAT: '微信',
  BEGIN: '开始',
  STOP: '停止',
  FIELD_TO_PAUSE: '暂停失败',
  WX_NOT_INSTALLED: '未检测到微信',
  WX_SHARE_FAILED: '微信分享失败，请检查是否安装微信',
  RENAME: '重命名',
  BATCH_DELETE: '批量删除',
  PREPARING: '准备中',

  DOWNLOAD_SAMPLE_DATA: '是否下载样例数据？',
  DOWNLOAD_DATA: '数据下载',
  DOWNLOAD: '下载',
  DOWNLOADING: '下载中',
  DOWNLOAD_SUCCESSFULLY: '已下载',
  DOWNLOAD_FAILED: '下载失败',
  UNZIPPING: '解压中',
  ONLINE_DATA_ERROR: '网络数据已损坏，无法正常使用',

  NO_REMINDER: '下次不再提醒',

  LOG_OUT: '是否退出登录？',
  FAILED_TO_LOG: '登录失败',
  INCORRECT_USER_INFO: '用户名或用户密码错误',
  INCORRECT_IPORTAL_ADDRESS: '请检查服务器地址是否正确',

  DELETE_STOP: '确认删除站点？',
  DELETE_OBJECT: '确定要永久删除该对象吗?',
  DELETE_LAYER: '删除图层后，数据无法恢复，确认删除?',
  PLEASE_ADD_STOP: '请添加站点',
  IMAGE_LAYER_CANNOT_BE_CURRENT_LAYER: '影像图层不能被设为当前图层',

  CONFIRM: '确定',
  COMPLETE: '完成',

  NO_PERMISSION: '应用缺少运行所需的权限!',
  NO_PERMISSION_ALERT: '应用缺少运行所需的权限,\n会导致部分功能不能正常使用！',
  EXIT: '退出',
  CONTINUE: '继续',
  REQUEST_PERMISSION: '申请权限',

  OPENING: '正在打开',

  QUIT: '确认退出SuperMap iTablet?',
  MAP_LOADING: '地图加载中',
  LOADING: '加载中',
  OPEN_MAP_CONFIRM: '是否打开此地图',
  THE_MAP_IS_OPENED: '该地图已打开',
  THE_MAP_IS_NOTEXIST: '该地图不存在',
  OPEN_MAP_FAILED: '打开地图失败',
  THE_SCENE_IS_OPENED: '该场景已打开',
  NO_SCENE_LIST: '无场景列表',
  NO_SCENE_SELECTED: '未选择场景',
  SWITCHING: '正在切换地图',
  CLOSING: '正在关闭地图',
  CLOSING_3D: '正在关闭场景',
  SAVING: '正在保存地图',
  SWITCHING_SUCCESS: '切换成功',
  ADD_SUCCESS: '添加成功',
  ADD_FAILED: '添加失败',
  ADD_MAP_FAILED: '不能添加当前地图',
  CREATE_THEME_FAILED: '创建专题图失败',
  PLEASE_ADD_DATASET: '请先选择要添加的数据集',
  PLEASE_SELECT_OBJECT: '请选择编辑对象',
  SWITCHING_PLOT_LIB: '正在切换标绘库',
  NON_SELECTED_OBJ: '没有选择对象',
  CHANGE_BASE_MAP: '当前底图为空，请先切换底图',
  OVERRIDE_SYMBOL: '存在相同id的符号，请选择添加方式',
  OVERWRITE: '覆盖',
  CHOOSE_DATASET: '请选择数据集',

  PLEASE_SUBMIT_EDIT_GEOMETRY: '请先提交当前绘制对象后查看属性',

  SET_ALL_MAP_VISIBLE: '全部显示',
  SET_ALL_MAP_INVISIBLE: '全部隐藏',
  LONG_PRESS_TO_SORT: '（长按排序）',

  PUBLIC_MAP: '公共地图',
  SUPERMAP_FORUM: '超图论坛',
  SUPERMAP_KNOW: '超图知道',
  SUPERMAP_GROUP: '超图集团',
  INSTRUCTION_MANUAL: '使用帮助',
  THE_CURRENT_LAYER: '当前图层为',
  NO_BASE_MAP: '无底图可移除',
  ENTER_KEY_WORDS: '请输入搜索关键字',
  SEARCHING: '搜索中',
  SEARCHING_DEVICE_NOT_FOUND: '未能搜索到外部设备',
  READING_DATA: '读取数据中',
  CREATE_SUCCESSFULLY: '创建成功',
  SAVE_SUCCESSFULLY: '保存成功',
  NO_NEED_TO_SAVE: '不需要保存',
  SAVE_FAILED: '保存失败',
  ENABLE_DYNAMIC_PROJECTION: '是否开启动态投影',
  TURN_ON: '是',
  CREATE_FAILED: '创建失败',
  INVALID_DATASET_NAME: '数据集名称不合法或重名',
  SAVE_FAIL_POINT:'非法点集合长度,点集合对象长度必须大于等于1',
  SAVE_LINE_FAIL: '非法点集合长度,点集合对象长度必须大于等于2',
  SAVE_REGION_FAIL: '非法点集合长度,点集合对象长度必须大于等于3',

  PLEASE_CHOOSE_POINT_LAYER: '请先选择点图层采集',
  PLEASE_CHOOSE_LINE_LAYER: '请先选择线图层采集',
  PLEASE_CHOOSE_REGION_LAYER: '请先选择面图层采集',

  NO_PLOTTING_DEDUCTION: '当前地图没有推演列表',
  NO_FLY: '当前场景无飞行轨迹',
  PLEASE_OPEN_SCENE: '请打开场景',
  NO_SCENE: '无场景显示',
  ADD_ONLINE_SCENE: '添加在线三维场景',

  PLEASE_ENTER_TEXT: '请输入文本内容',
  PLEASE_SELECT_THEMATIC_LAYER: '请先选择专题图层',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED: '当前图层无法设置风格，请重新选择图层',

  PLEASE_SELECT_PLOT_LAYER: '请选择或新建标注图层',
  DONOT_SUPPORT_ARCORE: '此设备不支持AR功能',
  GET_SUPPORTED_DEVICE_LIST: '获取受支持的设备列表',
  PLEASE_NEW_PLOT_LAYER: '请新建标注图层',
  DOWNLOADING_PLEASE_WAIT: '下载中请稍等',
  DOWNLOADING_OTHERS_PLEASE_WAIT: '其他文件正在下载，请稍等',
  SELECT_DELETE_BY_RECTANGLE: '请框选删除对象',

  CHOOSE_LAYER: '选择图层',

  COLLECT_SUCCESS: '采集成功',

  SELECT_TWO_MEDIAS_AT_LEAST: '至少选中两个多媒体文件',
  DELETE_OBJ_WITHOUT_MEDIA_TIPS: '该对象已经没有多媒体文件，是否删除？',

  NETWORK_REQUEST_FAILED: '网络请求失败',

  SAVEING: '正在保存',
  CREATING: '正在创建',
  PLEASE_ADD_DATASOURCE: '请先添加数据源',
  NO_ATTRIBUTES: '暂无属性',
  NO_SEARCH_RESULTS: '无搜索记录',

  READING_TEMPLATE: '正在读取模板',
  SWITCHED_TEMPLATE: '已为您切换模板',
  THE_CURRENT_SELECTION: '当前选择为 ',
  THE_LAYER_DOES_NOT_EXIST: '该图层不存在',

  IMPORTING_DATA: '正在导入数据',
  DATA_BEING_IMPORT: '数据正在导入',
  IMPORTING: '导入中...',
  IMPORTED_SUCCESS: '导入成功',
  FAILED_TO_IMPORT: '导入失败',
  IMPORTED_3D_SUCCESS: '导入3D成功',
  FAILED_TO_IMPORT_3D: '导入3D失败',
  DELETING_DATA: '删除数据中',
  DELETING_SERVICE: '删除服务中',
  DELETED_SUCCESS: '删除成功',
  FAILED_TO_DELETE: '删除失败',
  PUBLISHING: '发布服务中',
  PUBLISH_SUCCESS: '发布成功',
  PUBLISH_FAILED: '发布失败',
  PUBLISH_FAILED_INFO_1: '已发布过服务',
  DELETE_CONFIRM: '是否删除当前数据？',
  BATCH_DELETE_CONFIRM: '是否删除当前所选数据？',

  SELECT_AT_LEAST_ONE: '请至少选择一个数据',
  DELETE_MAP_RELATE_DATA: '删除数据将影响以下地图\n是否继续删除？',

  LOG_IN: '登录中',
  ENTER_MAP_NAME: '请输入地图名字',
  CLIP_ENTER_MAP_NAME: '请输入地图名字',
  ENTER_SERVICE_ADDRESS: '请输入服务地址',
  ENTER_ANIMATION_NAME: '请输入动画名字',
  ENTER_ANIMATION_NODE_NAME: '请输入动画节点名字',
  PLEASE_SELECT_PLOT_SYMBOL: '请选择标绘符号',

  ENTER_NAME: '请输入名称',
  ENTER_CAPTION: '请输入别名',
  CHOICE_TYPE: '请选择类型',
  INPUT_LENGTH: '请输入长度',
  DEFAULT_VALUE_EROROR: '缺省值输入错误',
  SELECT_REQUIRED: '请选择是否必选',

  CLIPPING: '地图裁剪中',
  CLIPPED_SUCCESS: '裁剪成功',
  CLIP_FAILED: '裁剪失败',

  LAYER_CANNOT_CREATE_THEMATIC_MAP: '不支持由该图层创建专题图',

  ANALYSING: '分析中',
  CHOOSE_STARTING_POINT: '请输入起点',
  CHOOSE_DESTINATION: '请输入终点',

  LATEST: '最后修改时间: ',
  GEOGRAPHIC_COORDINATE_SYSTEM: '地理坐标系: ',
  PROJECTED_COORDINATE_SYSTEM: '投影坐标系: ',
  FIELD_TYPE: '字段类型: ',

  PLEASE_LOGIN_AND_SHARE: '请登录后再分享',
  PLEASE_LOGIN: '请登录',
  SHARING: '分享中',
  SHARE_SUCCESS: '分享成功',
  SHARE_FAILED: '分享失败',
  SHARE_PREPARE: '准备分享',
  SHARE_START: '开始分享',
  SHARE_WX_FILE_SIZE_LIMITE: '文件大小不超过10M',

  EXPORTING: '导出中',
  EXPORT_SUCCESS: '导出成功',
  EXPORT_FAILED: '导出失败',
  EXPORT_TO: '数据已导出到：',
  REQUIRE_PRJ_1984: '数据集投影坐标系必须为WGS_1984',
  EXPORT_TEMP_FAILED: '普通地图不支持导出为模板',

  UNDO_FAILED: '撤销失败',
  REDO_FAILED: '恢复失败',
  RECOVER_FAILED: '还原失败',

  SETTING_SUCCESS: '设置成功',
  SETTING_FAILED: '设置失败',
  NETWORK_ERROR: '网络错误',
  NO_NETWORK: '未连接到网络',
  CHOOSE_CLASSIFY_MODEL: '选择分类模型',
  USED_IMMEDIATELY: '立即使用',
  USING: '使用中',
  DEFAULT_MODEL: '默认模型',
  DUSTBIN_MODEL: '城市垃圾模型',
  PLANT_MODEL: '植物模型',
  CHANGING: '切换中',
  CHANGE_SUCCESS: '切换成功',
  CHANGE_FAULT: '切换失败',
  DETECT_DUSTBIN_MODEL: '垃圾箱模型',
  ROAD_MODEL: '道路模型',

  LICENSE_EXPIRED: '试用许可已过期,是否继续试用?',
  APPLY_LICENSE: '申请许可',
  APPLY_LICENSE_FIRST: '请先获取有效许可',

  GET_LAYER_GROUP_FAILD: '获取图层组失败',
  TYR_AGAIN_LATER: '请稍后再试',

  LOCATING: '定位中',
  CANNOT_LOCATION: '无法定位',
  INDEX_OUT_OF_BOUNDS: '位置越界',
  PLEASE_SELECT_LICATION_INFORMATION: '请选择定位信息',
  OUT_OF_MAP_BOUNDS: '不在地图范围内',
  CANT_USE_TRACK_TO_INCREMENT_ROAD: '当前位置不在路网数据集范围内，无法使用轨迹增量路网',
  AFTER_COLLECT: '请先拍照采集后查看',

  POI: '兴趣点',

  ILLEGAL_DATA: '无效数据',

  UNSUPPORTED_LAYER_TO_SHARE: '暂不支持此图层的分享',
  SELECT_DATASET_TO_SHARE: '请选择要分享的数据集',
  ENTER_DATA_NAME: '请输入数据名称',
  SHARED_DATA_10M: '所分享文件超过10MB',

  PHIONE_HAS_BEEN_REGISTERED: '手机号已注册',
  NICKNAME_IS_EXISTS: '昵称已存在',
  VERIFICATION_CODE_ERROR: '短信验证码错误',
  VERIFICATION_CODE_SENT: '验证码已发送',
  EMAIL_HAS_BEEN_REGISTERED: '邮箱已注册',
  REGISTERING: '注册中',
  REGIST_SUCCESS: '注册成功',
  REGIST_FAILED: '注册失败',
  GOTO_ACTIVATE: '请前往邮箱激活',
  ENTER_CORRECT_MOBILE: '请输入正确的手机号',
  ENTER_CORRECT_EMAIL: '请输入正确的邮箱号',

  // 设置菜单提示信息
  ROTATION_ANGLE_ERROR: '旋转角度应在-360°到360°之间',
  MAP_SCALE_ERROR: '比例输入错误!请输入一个数字',
  VIEW_BOUNDS_ERROR: '范围输入错误!请输入一个数字',
  VIEW_BOUNDS_RANGE_ERROR: '参数错误!窗口宽高不能小于0',
  MAP_CENTER_ERROR: '坐标输入错误!x,y都应该为数字',
  COPY_SUCCESS: '复制成功',
  // 复制坐标系
  COPY_COORD_SYSTEM_SUCCESS: '坐标系复制成功',
  COPY_COORD_SYSTEM_FAIL: '坐标系复制失败',
  ILLEGAL_COORDSYS: '所选文件不是支持的坐标系文件',
  COPY_COORD_SYSTEM_FAIL_NO_COORD: '坐标系复制失败,无可复制坐标系',

  TRANSFER_PARAMS: '参数错误!请输入一个数字',
  PLEASE_ENTER: '请输入',

  REQUEST_TIMEOUT: '请求超时',

  IMAGE_RECOGNITION_ING: '识别中',
  IMAGE_RECOGNITION_FAILED: '图片识别失败',

  ERROR_INFO_INVALID_URL: '无效的URL',
  ERROR_INFO_NOT_A_NUMBER: '不为数字',
  ERROR_INFO_START_WITH_A_LETTER: '首字母必须为字母或汉字',
  ERROR_INFO_ILLEGAL_CHARACTERS: '不能包含特殊字符',
  ERROR_INFO_EMPTY: '不能为空',

  OPEN_LOCATION: '请在系统设置中开启定位服务',
  REQUEST_LOCATION: 'iTablet需要获取定位权限',
  LOCATION_ERROR: '位置获取异常，请稍后尝试',

  OPEN_THRID_PARTY: '即将跳转到第三方应用，是否继续？',

  FIELD_ILLEGAL: '字段不合法',
  PLEASE_SELECT_A_RASTER_LAYER: '请选择栅格图层',

  PLEASE_ADD_DATASOURCE_BY_UNIFORM: '请先添加数据源',
  CURRENT_LAYER_DOSE_NOT_SUPPORT_MODIFICATION: '提示:当前图层暂不支持修改',

  FAILED_TO_CREATE_POINT: '点绘线失败',
  FAILED_TO_CREATE_TEXT: '添加文字失败',
  FAILED_TO_CREATE_LINE: '点绘线失败',
  FAILED_TO_CREATE_REGION: '点绘面失败',
  CLEAR_HISTORY: '清除搜索记录',
  // 导航相关
  SEARCH_AROUND: '搜周边',
  GO_HERE: '到这去',
  SHOW_MORE_RESULT: '查看更多结果',
  PLEASE_SET_BASEMAP_VISIBLE: '请设置底图可见',
  NO_NETWORK_DATASETS: '当前工作空间无网络数据集',
  NO_LINE_DATASETS: '当前工作空间无线数据集',
  NETWORK_DATASET_IS_NOT_AVAILABLE: '当前路网数据集不可用',
  POINT_NOT_IN_BOUNDS: '当前选点不在所选路网数据集范围内',
  POSITION_OUT_OF_MAP: '当前位置不在地图导航范围内，请使用模拟导航',
  SELECT_DATASOURCE_FOR_NAVIGATION: '请选择用于导航路径分析的数据',
  PLEASE_SELECT_NETWORKDATASET: '请选择网络数据集',
  PLEASE_SELECT_A_POINT_INDOOR: '请在室内选点',
  PATH_ANALYSIS_FAILED: '路径分析失败请重新选择起终点',
  ROAD_NETWORK_UNLINK: '起点、终点路网未连通，路径分析失败',
  CHANGE_TO_OUTDOOR: '是否切换到室外？',
  CHANGE_TO_INDOOR: '是否切换到室内？',
  SET_START_AND_END_POINTS: '请先设置起点和终点',
  SELECT_LAYER_NEED_INCREMENTED: '请选择需要增量的图层',
  SELECT_THE_FLOOR: '请选择图层所在楼层',
  LONG_PRESS_ADD_START: '请长按添加起点',
  LONG_PRESS_ADD_END: '请长按添加终点',
  TOUCH_TO_ADD_END: '请点击添加终点',
  ROUTE_ANALYSING: '路径分析中',
  DISTANCE_ERROR: '当前起始点距离太近，请重新选点',
  USE_ONLINE_ROUTE_ANALYST: '起始点不在路网数据集范围内或起始点附近无路网，是否使用在线路径分析？',
  NOT_SUPPORT_ONLINE_NAVIGATION: '在线导航暂不支持',
  CREATE: '新建',
  NO_DATASOURCE: '当前工作空间无数据源，请先新建数据源',
  FLOOR: '楼层',
  AR_NAVIGATION: 'AR导航',
  ARRIVE_DESTINATION: '抵达目的地',
  DEVIATE_NAV_PATH: '偏离规划路线',

  //导航增量路网
  SELECT_LINE_DATASET: '请先选择一个线数据集',
  CANT_UNDO: '无法撤销',
  CANT_REDO: '无法重做',
  DATASET_RENAME_FAILED: '数据集名称只能包含字母、数字和"_"、"@"、"#"',
  SWITCH_LINE: '切换数据',
  HAS_NO_ROADNAME_FIELD_DATA: '该数据集不包含道路名称字段',
  MERGE_SUCCESS: '合并成功',
  MERGE_FAILD: '合并失败',
  NOT_SUPPORT_PRJCOORDSYS: '以下数据集的坐标系不支持合并',
  MERGEING: '合并中',
  NEW_NAV_DATA: '创建导航数据',
  INPUT_MODEL_FILE_NAME: '请输入模型文件名称',
  SELECT_DESTINATION_DATASOURCE: '请选择目标数据源',
  FILENAME_ALREADY_EXIST: '文件已存在,请重新输入文件名',
  NETWORK_BUILDING: '构网中...',
  BUILD_SUCCESS: '路网构建成功',
  SELECT_LINE_SMOOTH: '请选择需要平滑的线',
  SELECT_A_POINT_INLINE: '请选择一个线上点',
  LINE_DATASET: '线数据集',
  DESTINATION_DATASOURCE: '目标数据源',
  SMOOTH_FACTOR: '请输入平滑系数',
  SELECT_EXTEND_LINE: '请选择需要延长的线',
  SELECT_SECOND_LINE: '请选择第二条线',
  SELECT_TRIM_LINE: '请选择需要修剪的线',
  SELECT_BASE_LINE: '请选择基线',
  SELECT_RESAMPLE_LINE: '请选择需要重采样的线',
  SELECT_CHANGE_DIRECTION_LINE: '请选择需要变方向的线',
  EDIT_SUCCESS: '操作成功',
  EDIT_FAILED: '操作失败',
  SMOOTH_NUMBER_NEED_BIGGER_THAN_2: '平滑系数应为2~10的整数',
  CONFIRM_EXIT: '是否确定退出?',
  TOPO_EDIT_END: '是否编辑完成并退出？',
  // 自定义专题图
  ONLY_INTEGER: '只能输入整数！',
  ONLY_INTEGER_GREATER_THAN_2: '只能输入大于2的整数！',
  PARAMS_ERROR: '参数错误，设置失败！',

  SPEECH_TIP: '您可以说:\n"放大"，"缩小"，"定位"，"关闭"，"搜索"或者地名',
  SPEECH_ERROR: '识别出错，请稍后再试',
  SPEECH_NONE: '您好像没有说话哦',
  SPEECH_KEYWORD: '您可以说:\n"地名","特征"等关键字',

  NOT_SUPPORT_STATISTIC: '该字段不支持统计',
  ATTRIBUTE_DELETE_CONFIRM: '确定删除所选字段？',
  ATTRIBUTE_DELETE_TIPS: '删除属性后，不可恢复',
  ATTRIBUTE_DELETE_SUCCESS: '属性字段删除成功',
  ATTRIBUTE_DELETE_FAILED: '属性字段删除失败',
  ATTRIBUTE_ADD_SUCCESS: '属性添加成功',
  ATTRIBUTE_ADD_FAILED: '属性添加失败',
  ATTRIBUTE_DEFAULT_VALUE_IS_NULL: '缺省值为空',

  CANNOT_COLLECT_IN_THEMATIC_LAYERS: '专题图层不能采集',
  CANNOT_COLLECT_IN_CAD_LAYERS: 'CAD图层不能采集',
  CANNOT_COLLECT_IN_TEXT_LAYERS: '文本图层不能采集',
  HEAT_MAP_DATASET_TYPE_ERROR: '只有点数据集可以创建',

  INVALID_DATA_SET_FAILED: '数据类型不合法，设置失败',
  INVISIBLE_LAYER_CAN_NOT_BE_SET_CURRENT: '图层不可见，不能设置为当前图层',

  //三维AR管线相关
  FILE_NOT_EXISTS: '数据不存在，请先下载样例数据',
  MOVE_PHONE_ADD_SCENE: '请缓慢移动手机，识别出平面后点击屏幕添加场景',
  IDENTIFY_TIMEOUT: '识别图片超时，是否重试？',
  TRACKING_LOADING: '识别中...',
  UNSELECTED_OBJECT: '未选中对象！',

  // 专题制图加载/输出xml
  SUCCESS: '操作成功',
  FAILED: '操作失败',
  NO_TEMPLATE: '没有可用模板',
  CONFIRM_LOAD_TEMPLATE: '确定加载地图模板？',
  CONFIRM_OUTPUT_TEMPLATE: '确定输出地图模板？',

  SHOW_AR_SCENE_NOTIFY: '显示场景检测提示',

  CANT_PICTURE:'无法继续采集，最多可添加9张图片',
}

export { Prompt }
