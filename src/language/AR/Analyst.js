const Analyst_Modules = {
  BUFFER_ANALYSIS: 'تحليلات الحرم',
  BUFFER_ANALYSIS_2: 'تحليلات الحرم',
  BUFFER_ANALYST_SINGLE: 'تحليلات الحرم',
  BUFFER_ANALYST_MULTIPLE: 'تحليلات الحرم المتعدد',
  OVERLAY_ANALYSIS: 'تحليلات التداخل',
  THIESSEN_POLYGON: 'منطقة سيسن',
  MEASURE_DISTANCE: 'قياس المسافة',
  ONLINE_ANALYSIS: 'التحليل عبر الإنترنت',
  INTERPOLATION_ANALYSIS: 'Interpolation Analysis',

  OPTIMAL_PATH: 'المسار الأمثل',
  CONNECTIVITY_ANALYSIS: 'تحليل الاتصال',
  FIND_TSP_PATH: 'Find TSP Path',
  TRACING_ANALYSIS: 'تحليل التتبع',

  REGISTRATION_CREATE: '新建配准',
  REGISTRATION_SPEEDINESS: '快速配准',
  PROJECTION_TRANSFORMATION: '投影转换',
}

const Analyst_Methods = {
  CLIP: 'قطع',
  UNION: 'اتحاد',
  ERASE: 'مسح',
  INTERSECT: 'تقاطع',
  IDENTITY: 'تطابق',
  XOR: 'XOR',
  UPDATE: 'تحديث',

  DENSITY: 'تحليل الكثافة',
  AGGREGATE_POINTS_ANALYSIS: 'تحليل النقاط المجمعة',
}

const Analyst_Labels = {
  ANALYST: 'المحلل',
  CONFIRM: 'تاكيد',
  RESET: 'تعيين',
  CANCEL: 'الغاء',
  NEXT: 'التالى',
  PREVIOUS: 'السابق',
  ADD: 'اضافه',
  Edit: 'تعديل',

  // local
  USE_AN_EXISTING_NETWORK_DATASET: 'استخدم مجموعة بيانات الشبكة الحالية',
  BUILD_A_NETWORK_DATASET: 'بناء مجموعة بيانات الشبكة',
  CHOOSE_DATA: 'اختر البيانات',
  TOPOLOGY: 'طبولوجى',
  ADD_DATASET: 'اضف مجموعة بيانات',
  DONE: 'تم',
  RESULT_FIELDS: 'نتيجة الحقول',
  SPLIT_SETTINGS: 'تقسيم الإعدادات',
  SPLIT_LINE_BY_POINT: 'تقسيم الخط بواسطة النقطة',
  SPLIT_LINES_AT_INTERSECTION: 'تقسيم الخط عند التقاطع',

  SET_START_STATION: 'تعيين محطه البداية',
  MIDDLE_STATIONS: 'المحطات الوسطى',
  SET_END_STATION: 'تعيين محطه النهاية',
  LOCATION: 'الموقع',
  SET_AS_START_STATION: 'تعيين كمحطة بداية',
  SET_AS_END_STATION: 'تعيين كمحطة النهاية',
  ADD_STATIONS: 'اضافة محطات',
  ADD_BARRIER_NODES: 'إضافة عقد الحاجز',
  ADD_NODES: 'إضافة عقد',
  UPSTREAM_TRACKING: 'تتبع المنبع',
  DOWNSTREAM_TRACKING: 'تتبع المصب',
  CLEAR: 'مسح',
  START_STATION: 'بدء المحطة',
  MIDDLE_STATION: 'المحطة الوسطى',
  END_STATION: 'نهاية المحطة',
  BARRIER_NODE: 'عقدة الحاجز',
  NODE: 'عقدة',

  BUFFER_ZONE: 'حرم',
  MULTI_BUFFER_ZONE: 'حرم متعدد',
  DATA_SOURCE: 'مصدر البيانات',
  DATA_SET: 'مجموعة البيانات',
  SELECTED_OBJ_ONLY: 'الكائنات المختارة فقط',
  BUFFER_TYPE: 'نوع الحرم',
  BUFFER_ROUND: 'حول',
  BUFFER_FLAT: 'مسطح',
  BUFFER_RADIUS: 'نصف القطر',
  RESULT_SETTINGS: 'أعدادات النتيجة',
  BUFFER_UNION: 'اتحاد الحرم',
  KEEP_ATTRIBUTES: 'الحفاظ على جدول البيانات',
  DISPLAY_IN_MAP: 'عرض على الخريطة',
  DISPLAY_IN_SCENE: 'عرض المشهد',
  SEMICIRCLE_SEGMENTS: 'قطاعات نصف دائرة',
  RING_BUFFER: 'حرم حلقة',
  RESULT_DATA: 'نتيجة البيانات',
  BATCH_ADD: 'اضافة دفعه',
  START_VALUE: 'قيمة البداية',
  END_VALUE: 'قيمة النهاية',
  STEP: 'خطوة',
  RANGE_COUNT: 'عدد المدى',
  INSERT: 'إدراج',
  DELETE: 'حذف',
  INDEX: 'مؤشر',
  RADIUS: 'نصف القطر',
  RESULT_DATASET_NAME: 'اسم نتيجة مجموعة البيانات',
  GO_TO_SET: 'انتقل إلى مجموعة',

  SOURCE_DATA: 'مصدر البيانات',
  OVERLAY_DATASET: 'مجموعة بيانات التداخل',
  SET_FIELDS: 'تعيين الحقول',
  FIELD_NAME: 'اسم الحقل',

  ISERVER_LOGIN: 'تسجيل الدخول iServer',
  ISERVER: 'iServer URL',
  SOURCE_DATASET: 'مصدر مجموعة البيانات',

  ANALYSIS_PARAMS: 'تحليلات القياسات',
  ANALYSIS_METHOD: 'طريقة التحليل',
  Mesh_Type: 'نوع الشبكة',
  WEIGHT_FIELD: 'الحقل المرجح',
  ANALYSIS_BOUNDS: 'حدود التحليل',
  MESH_SIZE: 'حجم الشبكة',
  SEARCH_RADIUS: 'نصف القطر',
  AREA_UNIT: 'وحدات المساحة',
  STATISTIC_MODE: 'الوضع الإحصائي',
  NUMERIC_PRECISION: 'الدقة الرقمية',
  AGGREGATE_TYPE: 'النوع الكلي',

  THEMATIC_PARAMS: 'القياسات الموضوعية',
  INTERVAL_MODE: 'وضع الفاصل',
  NUMBER_OF_SEGMENTS: 'عدد القطع',
  COLOR_GRADIENT: 'وضع التدرج اللوني',

  Input_Type: 'نوع المدخل',
  Dataset: 'مجموعة البيانات',

  NOT_SET: 'غير مضبوط',
  ALREADY_SET: 'تم تعيينها بالفعل',

  ADD_WEIGHT_STATISTIC: 'إضافة حقل مرجح',

  // 方向
  LEFT: 'شمال',
  DOWN: 'أسفل',
  RIGHT: 'يمين',
  UP: 'أعلى',

  // 邻近分析
  DISPLAY_REGION_SETTINGS: 'عرض إعدادات المنطقة',
  CUSTOM_LOCALE: 'تخصيص موقع',
  SELECT_REGION: 'اختر المنطقة',
  DRAW_REGION: 'رسم المنطقة',
  MEASURE_DISTANCE: 'قياس المسافة',
  REFERENCE_DATASET: 'مجموعة البيانات المرجعية',
  PARAMETER_SETTINGS: 'إعدادات القياس',
  MEASURE_TYPE: 'نوع القياس',
  MIN_DISTANCE_2: 'أقل مسافة',
  DISTANCE_IN_RANGE: 'مسافة فى المدى ',
  QUERY_RANGE: 'مدى الاستعلام',
  MIN_DISTANCE: 'أقل مسافة',
  MAX_DISTANCE: 'أعلى مسافة',
  ASSOCIATE_BROWSING_RESULT: 'نتيجة المتصفح المساعد',

  // 插值分析
  INTERPOLATION_METHOD: 'Interpolation Analysis',
  INTERPOLATION_FIELD: 'Interpolation Methods',
  SCALE_FACTOR: 'عامل المقياس',
  RESOLUTION: 'الدقة',
  PIXEL_FORMAT: 'تنسيق الخلية',
  INTERPOLATION_BOUNDS: 'حدود',
  SAMPLE_POINT_SETTINGS: 'إعدادات نقطة العينة',
  SEARCH_MODE: 'وضع البحث',
  MAX_RADIUS: 'أعلى نطاق',
  SEARCH_RADIUS_2: 'نطاق البحث',
  SEARCH_POINT_COUNT: 'عدد النقاط',
  MIX_COUNT: 'أقل عدد',
  MOST_INVOLVED: 'الأكثر مشاركة',
  MOST_IN_BLOCK: 'الأكثر فى الحظر',
  OTHER_PARAMETERS: 'قياسات أخرى',
  POWER: 'الطاقة',
  TENSION: 'ضغط',
  SMOOTHNESS: 'نعومة',
  SEMIVARIOGRAM: 'شبه مخطط',
  ROTATION: 'دوران',
  SILL: 'Sill',
  RANGE: 'المدى',
  NUGGET_EFFECT: 'تأثير الكتلة',
  MEAN: 'متوسط',
  EXPONENT: 'Exponent',
  HISTOGRAM: 'الرسم البياني',
  FUNCTION: 'وظيفة',
  SHOW_STATISTICS: 'عرض الاحصائيات',
  EXPORT_TO_ALBUM: 'تصدير الى الالبوم',

  REGISTRATION_DATASET: '配准数据',
  REGISTRATION_REFER_DATASET_ADD: '添加参考数据',
  REGISTRATION: '配准',
  REGISTRATION_ARITHMETIC: '配准算法',
  REGISTRATION_LINE: '线性配准（至少4个控制点）',
  REGISTRATION_QUADRATIC: '二次多项式配准（至少7个控制点）',
  REGISTRATION_RECTANGLE: '矩形配准（2个控制点）',
  REGISTRATION_OFFSET: '偏移配准（1个控制点）',
  REGISTRATION_LINE_: '线性配准',
  REGISTRATION_QUADRATIC_: '二次多项式配准',
  REGISTRATION_RECTANGLE_: '矩形配准',
  REGISTRATION_OFFSET_: '偏移配准',
  REGISTRATION_ASSOCIATION: '关联浏览',

  REGISTRATION_ASSOCIATION_CLOCE: '取消关联',
  REGISTRATION_EXECUTE: '执行',
  REGISTRATION_EXECUTE_SUCCESS: '执行成功',
  REGISTRATION_EXECUTE_FAILED: '执行失败',
  REGISTRATION_SAVE_AS: '另存',
  REGISTRATION_RESAMPLE: '结果重采样',
  REGISTRATION_SAMPLE_MODE: '采样模式',
  REGISTRATION_SAMPLE_MODE_NO: '无',
  REGISTRATION_SAMPLE_MODE_NEAR: '最邻近法',
  REGISTRATION_SAMPLE_MODE_BILINEARITY: '双线性内插法',
  REGISTRATION_SAMPLE_MODE_CUBIC_SONVOLUTION: '三次卷积内插法',
  REGISTRATION_SAMPLE_PIXEL: '采样像素',
  REGISTRATION_RESULT_DATASET: '目标数据集',
  REGISTRATION_RESULT_DATASOURCE: '目标数据源',
  REGISTRATION_ORIGINAL_DATASOURCE: '原始数据',
  REGISTRATION_POINTS_DETAIL: '查看',
  REGISTRATION_EXECUTING: '执行中',
  REGISTRATION_ENUMBER: '序号',
  REGISTRATION_ORIGINAL: '源点',
  REGISTRATION_TAREGT: '目标点',
  REGISTRATION_RESELECT_POINT: '重新选点',
  REGISTRATION_EXPORT: '导出',
  REGISTRATION_EXPORT_SUCCESS: '导出成功',
  REGISTRATION_EXPORT_FAILED: '导出失败',
  REGISTRATION_EXPORT_FILE_NAME: '配准信息文件名称',
  REGISTRATION_EXPORT_FILE: '配准信息文件',
  REGISTRATION_PLEASE_SELECT: '请选择',
  REGISTRATION_NOT_SETLECT_DATASET: '请选择配准数据集',
  REGISTRATION_NOT_SETLECT_REFER_DATASET: '请选择参考数据集',
  //投影转换
  PROJECTION_SOURCE_COORDS: '源坐标系',
  PROJECTION_COORDS_NAME: '坐标系名称',
  PROJECTION_COORDS_UNIT: '坐标单位',
  PROJECTION_GROUND_DATUM: '大地基准面',
  PROJECTION_REFERENCE_ELLIPSOID: '参考椭球体',

  PROJECTION_CONVERT_SETTING: '参考系转换设置',
  PROJECTION_CONVERT_MOTHED: '转换方法',
  PROJECTION_PARAMETER_SETTING: '参数设置',
  BASIC_PARAMETER: '基本参数',
  ROTATION_ANGLE_SECOND: '旋转角度(秒)',
  OFFSET: '偏移量',
  RATIO_DIFFERENCE: '比例差',
  TARGET_COORDS: '目标坐标系',
  COPY: '复制',
  RESETING: '重设',
  GEOCOORDSYS: '地理坐标系',
  PRJCOORDSYS: '投影坐标系',
  CONVERTTING: '转换中',
  CONVERT_SUCCESS: '转换成功',
  CONVERT_FAILED: '转换失败',
  ARITHMETIC: 'خوارزمية',
}

const Convert_Unit = {
  ///  毫米。
  MILIMETER: '毫米',
  /// 平方毫米。
  SQUAREMILIMETER: '平方毫米',
  ///  厘米。
  CENTIMETER: '厘米',
  /// 平方厘米。
  SQUARECENTIMETER: '平方厘米',
  /// 英寸。
  INCH: '英寸',
  /// 平方英寸。
  SQUAREINCH: '平方英寸',
  /// 分米。
  DECIMETER: '分米',
  /// 平方分米。
  SQUAREDECIMETER: '平方分米',
  ///  英尺。
  FOOT: 'قدم',
  ///  平方英尺。
  SQUAREFOOT: '平方英尺',
  ///  码。
  YARD: 'ياردة',
  ///  平方码。
  SQUAREYARD: '平方码',
  ///  米。
  METER: 'متر',
  ///  平方米。
  SQUAREMETER: '平方米',
  /// 千米。
  KILOMETER: 'كيلومتر',
  /// 平方千米。
  SQUAREKILOMETER: '平方千米',
  /// 平方英里。
  MILE: 'ميل',
  /// 英里。
  SQUAREMILE: '英里',
  ///  秒。
  SECOND: '秒',
  ///  分。
  MINUTE: '分',
  ///  度。
  DEGREE: '度',
  /// 弧度。
  RADIAN: '弧度',
}

const Analyst_Params = {
  // 缓冲区分析
  BUFFER_LEFT_AND_RIGHT: 'شمال ويمين',
  BUFFER_LEFT: 'شمال',
  BUFFER_RIGHT: 'يمين',

  // 分析方法
  SIMPLE_DENSITY_ANALYSIS: 'تحليل الكثافة البسيطة',
  KERNEL_DENSITY_ANALYSIS: 'تحليل كثافة النواة',

  // 网格面类型
  QUADRILATERAL_MESH: 'شبكة رباعية',
  HEXAGONAL_MESH: 'شبكة سداسية',

  // 分段模式
  EQUIDISTANT_INTERVAL: 'الفاصل المتساوي',
  LOGARITHMIC_INTERVAL: 'الفاصل اللوغاريتمي',
  QUANTILE_INTERVAL: 'الفاصل الكمي',
  SQUARE_ROOT_INTERVAL: 'الفاصل الزمني الجذر التربيعي',
  STANDARD_DEVIATION_INTERVAL: 'الفاصل الزمني للانحراف المعياري',

  // 长度单位
  METER: 'متر',
  KILOMETER: 'كيلومتر',
  YARD: 'ياردة',
  FOOT: 'قدم',
  MILE: 'ميل',

  // 面积单位
  SQUARE_MILE: 'ميل مربع',
  SQUARE_METER: 'متر مربع',
  SQUARE_KILOMETER: 'يلو متر مربع',
  HECTARE: 'هكتار',
  ARE: 'are',
  ACRE: 'فدان',
  SQUARE_FOOT: 'قدم مربع',
  SQUARE_YARD: 'ياردة مربع',

  // 颜色渐变模式
  GREEN_ORANGE_PURPLE_GRADIENT: 'التدرج الأرجواني البرتقالي الأخضر',
  GREEN_ORANGE_RED_GRADIENT: 'التدرج الأحمر البرتقالي الأخضر',
  RAINBOW_COLOR: 'لون قوس قزح',
  SPECTRAL_GRADIENT: 'التدرج الطيفي',
  TERRAIN_GRADIENT: 'تدرج التضاريس',

  // 统计模式
  MAX: 'اعلى قيمة',
  MIN: 'أدنى قيمة',
  AVERAGE: 'متوسط',
  SUM: 'مجموع',
  VARIANCE: 'فرق',
  STANDARD_DEVIATION: 'الانحراف المعياري',

  // 聚合类型
  AGGREGATE_WITH_GRID: 'التجميع مع الشبكة',
  AGGREGATE_WITH_REGION: 'التجميع مع المنطقة',

  // 插值方法
  IDW: 'IDW',
  SPLINE: 'Spline',
  ORDINARY_KRIGING: 'Ordinary Kriging',
  SIMPLE_KRIGING: 'Simple Kriging',
  UNIVERSAL_KRIGING: 'Universal Kriging',

  // 像素格式
  UBIT1: 'حرف واحد',
  UBIT16: '16 حرف',
  UBIT32: '32 حرف',
  SINGLE: 'فردى',
  DOUBLE: 'عشرى',

  // 查找方法
  SEARCH_VARIABLE_LENGTH: 'طول متغير',
  SEARCH_FIXED_LENGTH: 'طول ثابت',
  SEARCH_BLOCK: 'حظر',

  // 半变异函数
  SPHERICAL: 'كروي',
  EXPONENTIAL: 'متسارع',
  GAUSSIAN: 'Gaussian',
}

const Analyst_Prompt = {
  ANALYSING: 'جارٍ التحليل',
  ANALYSIS_START: 'جارٍ التحليل',
  ANALYSIS_SUCCESS: 'نجح التحليل',
  ANALYSIS_FAIL: 'فشل التحليل',
  PLEASE_CONNECT_TO_ISERVER: 'يرجى الاتصال بـ iServer',
  PLEASE_CHOOSE_INPUT_METHOD: 'يرجى اختيار طريقة الإدخال',
  PLEASE_CHOOSE_DATASET: 'يرجى اختيار مجموعة البيانات',
  LOGIN_ISERVER_FAILED:
    'فشل توصيل الخادم ، يرجى التحقق من عنوان اى بى واسم المستخدم وكلمة المرو',
  BEING_ANALYZED: 'قيد التحليل',
  ANALYZING_FAILED: 'فشل التحليل',
  LOADING_MODULE: 'تحميل الوحدة',
  LOADING_MODULE_FAILED:
    'فشل تحميل الوحدة النمطية ، يرجى التحقق من مجموعة البيانات',
  TWO_NODES_ARE_CONNECTED: 'العقدتان متصلتان',
  TWO_NODES_ARE_NOT_CONNECTED: 'العقدتان غير متصلتين',
  NOT_FIND_SUITABLE_PATH: 'لم يجد المسار المناسب',
  SELECT_DATA_SOURCE_FIRST: 'الرجاء تحديد مصدر البيانات أولاً',
  SELECT_DATA_SET_FIRST: 'يرجى تحديد مجموعة البيانات أولاً',
  PLEASE_SELECT_A_REGION: 'يرجى تحديد منطقة',
  REGISTRATION_LINE_POINTS: '请设置至少4个控制点',
  REGISTRATION_QUADRATIC_POINTS: '请设置至少7个控制点',
  REGISTRATION_RECTANGLE_POINTS: '请设置2个控制点',
  REGISTRATION_OFFSET_POINTS: '请设置1个控制点',
  REGISTRATION_POINTS_NUMBER_ERROR: '控制点数量不匹配',
}

export {
  Analyst_Modules,
  Analyst_Methods,
  Analyst_Labels,
  Analyst_Params,
  Analyst_Prompt,
  Convert_Unit,
}
