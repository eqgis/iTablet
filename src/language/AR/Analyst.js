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
  
  // 待翻译
  REGISTRATION_CREATE: 'New Registration',
  REGISTRATION_SPEEDINESS: 'Rapid Registration',
  PROJECTION_TRANSFORMATION: 'Projection Transformation',
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
  
  // 待翻译
  REGISTRATION_DATASET: 'Registration dataset',
  REGISTRATION_REFER_DATASET_ADD: 'Registration refer dataset add',
  REGISTRATION: 'Registration',
  REGISTRATION_ARITHMETIC: 'Registration arithmetic',
  REGISTRATION_LINE: 'Registration line (at least 4 control points)',
  REGISTRATION_QUADRATIC: 'Registration quadratic (at least 7 control points)',
  REGISTRATION_RECTANGLE: 'Registration rectangle (2 control points)',
  REGISTRATION_OFFSET: 'Registration offset (1 control points)',
  REGISTRATION_LINE_: 'Registration line',
  REGISTRATION_QUADRATIC_: 'Registration quadratic',
  REGISTRATION_RECTANGLE_: 'Registration rectangle',
  REGISTRATION_OFFSET_: 'Registration offset',
  REGISTRATION_ASSOCIATION: 'Association',
  
  REGISTRATION_ASSOCIATION_CLOCE: 'Cancel the associated',
  REGISTRATION_EXECUTE: 'Run',
  REGISTRATION_EXECUTE_SUCCESS: 'Execute success',
  REGISTRATION_EXECUTE_FAILED: 'Execute failed',
  REGISTRATION_SAVE_AS: 'Save as',
  REGISTRATION_RESAMPLE: 'Result resampling',
  REGISTRATION_SAMPLE_MODE: 'Sampling mode',
  REGISTRATION_SAMPLE_MODE_NO: 'No',
  REGISTRATION_SAMPLE_MODE_NEAR: 'The method of adjacent',
  REGISTRATION_SAMPLE_MODE_BILINEARITY: 'Bilinear interpolation',
  REGISTRATION_SAMPLE_MODE_CUBIC_SONVOLUTION: 'Cubic convolution interpolation',
  REGISTRATION_SAMPLE_PIXEL: 'Sample pixel',
  REGISTRATION_RESULT_DATASET: 'Result dataset',
  REGISTRATION_RESULT_DATASOURCE: 'Result datasource',
  REGISTRATION_ORIGINAL_DATASOURCE: 'Original dataset',
  REGISTRATION_POINTS_DETAIL: 'Detail',
  REGISTRATION_EXECUTING: 'In progress',
  REGISTRATION_ENUMBER: 'Serial number',
  REGISTRATION_ORIGINAL: 'Source',
  REGISTRATION_TAREGT: 'Target',
  REGISTRATION_RESELECT_POINT: 'Reselect point',
  REGISTRATION_EXPORT: 'Export',
  REGISTRATION_EXPORT_SUCCESS: 'Export success',
  REGISTRATION_EXPORT_FAILED: 'Export failed',
  REGISTRATION_EXPORT_FILE_NAME: 'Export file name',
  REGISTRATION_EXPORT_FILE: 'Registration info file',
  REGISTRATION_PLEASE_SELECT: 'Please select',
  REGISTRATION_NOT_SETLECT_DATASET: 'Please select a registration dataset',
  REGISTRATION_NOT_SETLECT_REFER_DATASET: 'Please select a reference dataset',
  //投影转换
  PROJECTION_SOURCE_COORDS: 'Source Coords',
  PROJECTION_COORDS_NAME: 'Coords Name',
  PROJECTION_COORDS_UNIT: 'Coords Unit',
  PROJECTION_GROUND_DATUM: 'Ground Datum',
  PROJECTION_REFERENCE_ELLIPSOID: 'Reference Ellipsoid',
  
  PROJECTION_CONVERT_SETTING: 'Reference system conversion settings',
  PROJECTION_CONVERT_MOTHED: 'Convert method',
  PROJECTION_PARAMETER_SETTING: 'Parameter Setting',
  BASIC_PARAMETER: 'Basic Parameter',
  ROTATION_ANGLE_SECOND: 'Rotation Angle (second)',
  OFFSET: 'Offset',
  RATIO_DIFFERENCE: 'Ratio Difference',
  TARGET_COORDS: 'Target Coords',
  COPY: 'Copy',
  RESETING: 'Reset',
  GEOCOORDSYS: 'Geographic coordinate system',
  PRJCOORDSYS: 'Projected coordinate system',
  CONVERTTING: 'Convertting',
  CONVERT_SUCCESS: 'Convert success',
  CONVERT_FAILED: 'Convert failed',
  ARITHMETIC: 'خوارزمية',
}

// 待翻译
const Convert_Unit = {
  ///  毫米。
  MILIMETER: 'Milimeter',
  /// 平方毫米。
  SQUAREMILIMETER: 'Mm2',
  ///  厘米。
  CENTIMETER: 'cm',
  /// 平方厘米。
  SQUARECENTIMETER: 'cm2',
  /// 英寸。
  INCH: 'inch',
  /// 平方英寸。
  SQUAREINCH: 'Square inch',
  /// 分米。
  DECIMETER: 'Dm',
  /// 平方分米。
  SQUAREDECIMETER: 'Square decimetres',
  ///  英尺。
  FOOT: 'Foot',
  ///  平方英尺。
  SQUAREFOOT: 'Square feet',
  ///  码。
  YARD: 'Yard',
  ///  平方码。
  SQUAREYARD: 'Square yard',
  ///  米。
  METER: 'Meter',
  ///  平方米。
  SQUAREMETER: 'Square meter',
  /// 千米。
  KILOMETER: 'km',
  /// 平方千米。
  SQUAREKILOMETER: 'square kilometer',
  /// 平方英里。
  MILE: 'Square mile',
  /// 英里。
  SQUAREMILE: 'mile',
  ///  秒。
  SECOND: 'second',
  ///  分。
  MINUTE: 'Minute',
  ///  度。
  DEGREE: 'degree',
  /// 弧度。
  RADIAN: 'radian',
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
  LOGIN_ISERVER_FAILED: 'فشل توصيل الخادم ، يرجى التحقق من عنوان اى بى واسم المستخدم وكلمة المرو',
  BEING_ANALYZED: 'قيد التحليل',
  ANALYZING_FAILED: 'فشل التحليل',
  LOADING_MODULE: 'تحميل الوحدة',
  LOADING_MODULE_FAILED: 'فشل تحميل الوحدة النمطية ، يرجى التحقق من مجموعة البيانات',
  TWO_NODES_ARE_CONNECTED: 'العقدتان متصلتان',
  TWO_NODES_ARE_NOT_CONNECTED: 'العقدتان غير متصلتين',
  NOT_FIND_SUITABLE_PATH: 'لم يجد المسار المناسب',
  SELECT_DATA_SOURCE_FIRST: 'الرجاء تحديد مصدر البيانات أولاً',
  SELECT_DATA_SET_FIRST: 'يرجى تحديد مجموعة البيانات أولاً',
  PLEASE_SELECT_A_REGION: 'يرجى تحديد منطقة',
  REGISTRATION_LINE_POINTS: 'Please set at least 4 control points', // 待翻译
  REGISTRATION_QUADRATIC_POINTS: 'Please set at least 7 control points',
  REGISTRATION_RECTANGLE_POINTS: 'Please set 2 control points',
  REGISTRATION_OFFSET_POINTS: 'Please set 1 control point',
  REGISTRATION_POINTS_NUMBER_ERROR: 'The number of control points does not match',
}

export { Analyst_Modules, Analyst_Methods, Analyst_Labels, Analyst_Params, Analyst_Prompt, Convert_Unit }
