import CN from '../CN'

const Analyst_Modules: typeof CN.Analyst_Modules = {
  BUFFER_ANALYSIS: 'تحليلات الحرم',
  BUFFER_ANALYSIS_2: 'تحليلات الحرم',
  BUFFER_ANALYST_SINGLE: 'تحليلات الحرم',
  BUFFER_ANALYST_MULTIPLE: 'تحليلات الحرم المتعدد',
  OVERLAY_ANALYSIS: 'تحليلات التداخل',
  THIESSEN_POLYGON: 'منطقة سيسن',
  MEASURE_DISTANCE: 'قياس المسافة',
  ONLINE_ANALYSIS: 'التحليل عبر الإنترنت',
  INTERPOLATION_ANALYSIS: 'تحليل الاستيفاء',

  OPTIMAL_PATH: 'المسار الأمثل',
  CONNECTIVITY_ANALYSIS: 'تحليل الاتصال',
  FIND_TSP_PATH: 'البحث عن مسار مشكلة بائع متجول',
  TRACING_ANALYSIS: 'تحليل التتبع',

  REGISTRATION_CREATE: 'تسجيل جديد',
  REGISTRATION_SPEEDINESS: 'التسجيل السريع',
  PROJECTION_TRANSFORMATION: 'تحويل الإسقاط',
}

const Analyst_Methods: typeof CN.Analyst_Methods = {
  CLIP: 'قطع',
  UNION: 'اتحاد',
  ERASE: 'مسح',
  INTERSECT: 'تقاطع',
  IDENTITY: 'تطابق',
  XOR: 'فرق متماثل',
  UPDATE: 'تحديث',

  DENSITY: 'تحليل الكثافة',
  AGGREGATE_POINTS_ANALYSIS: 'تحليل النقاط المجمعة',
}

const Analyst_Labels: typeof CN.Analyst_Labels = {
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
  INTERPOLATION_METHOD: 'تحليل الاستيفاء',
  INTERPOLATION_FIELD: 'نظرية الاستيفاء',
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
  EXPONENT: 'الأس',
  HISTOGRAM: 'الرسم البياني',
  FUNCTION: 'وظيفة',
  SHOW_STATISTICS: 'عرض الاحصائيات',
  EXPORT_TO_ALBUM: 'تصدير الى الالبوم',

  REGISTRATION_DATASET: 'تسجيل مجموعة بيانات ',
  REGISTRATION_REFER_DATASET_ADD: 'يشير التسجيل إلى إضافة مجموعة البيانات',
  REGISTRATION: 'التسجيل',
  REGISTRATION_ARITHMETIC: 'خوارزمية التسجيل',
  REGISTRATION_LINE: 'خط التسجيل 4 نقاط تحكم على الأقل',
  REGISTRATION_QUADRATIC: 'تسجيل تربيعي 7 نقاط تحكم على الأقل',
  REGISTRATION_RECTANGLE: 'مستطيل التسجيل نقطتا تحكم',
  REGISTRATION_OFFSET: 'تعويض التسجيل نقطة تحكم واحدة',
  REGISTRATION_LINE_: 'خط التسجيل',
  REGISTRATION_QUADRATIC_: 'التسجيل التربيعي',
  REGISTRATION_RECTANGLE_: 'مستطيل التسجيل',
  REGISTRATION_OFFSET_: 'تعويض التسجيل',
  REGISTRATION_ASSOCIATION: 'إرتباط',

  REGISTRATION_ASSOCIATION_CLOCE: 'إلغاء الإرتباط',
  REGISTRATION_EXECUTE: 'تشغيل',
  REGISTRATION_EXECUTE_SUCCESS: 'نجاح التنفيذ',
  REGISTRATION_EXECUTE_FAILED: 'فشل التنفيذ',
  REGISTRATION_SAVE_AS: 'حفظ باسم',
  REGISTRATION_RESAMPLE: 'نتيجة إعادة التشكيل',
  REGISTRATION_SAMPLE_MODE: 'وضع أخذ العينات',
  REGISTRATION_SAMPLE_MODE_NO: 'لا',
  REGISTRATION_SAMPLE_MODE_NEAR: 'طريقة المجاور',
  REGISTRATION_SAMPLE_MODE_BILINEARITY: 'استيفاء ثنائي الخطي',
  REGISTRATION_SAMPLE_MODE_CUBIC_SONVOLUTION: 'استيفاء التواء مكعب',
  REGISTRATION_SAMPLE_PIXEL: 'نموذج بكسل',
  REGISTRATION_RESULT_DATASET: 'مجموعة البيانات الناتجة',
  REGISTRATION_RESULT_DATASOURCE: 'مصدر البيانات الناتج',
  REGISTRATION_ORIGINAL_DATASOURCE: 'مجموعة البيانات الأصلية',
  REGISTRATION_POINTS_DETAIL: 'التفاصيل',
  REGISTRATION_EXECUTING: 'قيد التقدم',
  REGISTRATION_ENUMBER: 'الرقم التسلسلي',
  REGISTRATION_ORIGINAL: 'المصدر',
  REGISTRATION_TAREGT: 'الهدف',
  REGISTRATION_RESELECT_POINT: 'إعادة تحديد النقطة',
  REGISTRATION_EXPORT: 'تصدير',
  REGISTRATION_EXPORT_SUCCESS: 'نجاح التصدير',
  REGISTRATION_EXPORT_FAILED: 'فشل التصدير',
  REGISTRATION_EXPORT_FILE_NAME: 'اسم الملف التصدير',
  REGISTRATION_EXPORT_FILE: 'ملف معلومات التسجيل',
  REGISTRATION_PLEASE_SELECT: 'الرجاء التحديد',
  REGISTRATION_NOT_SETLECT_DATASET: 'الرجاء تحديد مجموعة بيانات التسجيل',
  REGISTRATION_NOT_SETLECT_REFER_DATASET: 'الرجاء تحديد مجموعة بيانات مرجعية',
  //投影转换
  PROJECTION_SOURCE_COORDS: 'نظام تنسيق المصدر',
  PROJECTION_COORDS_NAME: 'تنسيق اسم النظام',
  PROJECTION_COORDS_UNIT: 'وحدة نظام التنسيق',
  PROJECTION_GROUND_DATUM: 'تنسيق بيانات النظام',
  PROJECTION_REFERENCE_ELLIPSOID: 'المرجع Ellipsoid',

  PROJECTION_CONVERT_SETTING: 'إعدادات تحويل النظام المرجعية',
  PROJECTION_CONVERT_MOTHED: 'طريقة التحويل',
  PROJECTION_PARAMETER_SETTING: 'إعداد المعاملات',
  BASIC_PARAMETER: 'المعاملات الأساسية',
  ROTATION_ANGLE_SECOND: 'زاوية الدوران (ثانية)',
  OFFSET: 'تعويض',
  RATIO_DIFFERENCE: 'فرق النسبة',
  TARGET_COORDS: 'نظام تنسيق الهدف',
  COPY: 'نسخ',
  RESETING: 'إعادة تعيين',
  GEOCOORDSYS: 'نظام الإحداثيات الجغرافية',
  PRJCOORDSYS: 'نظام الإحداثيات الاسقاط',
  COMMONCOORDSYS: 'نظام الإحداثيات الشائع',
  CONVERTTING: 'التحويل',
  CONVERT_SUCCESS: 'نجاح التحويل',
  CONVERT_FAILED: 'فشل التحويل',
  ARITHMETIC: 'خوارزمية',
  COORDSYS:'نظام الإحداثيات',
}

const Convert_Unit: typeof CN.Convert_Unit = {
  ///  毫米。
  MILIMETER: 'ميليمتر',
  /// 平方毫米。
  SQUAREMILIMETER: 'ممملليمتر مربع',
  ///  厘米。
  CENTIMETER: 'سم',
  /// 平方厘米。
  SQUARECENTIMETER: 'سنتيمتر مربع',
  /// 英寸。
  INCH: 'بوصة',
  /// 平方英寸。
  SQUAREINCH: 'بوصة مربعة',
  /// 分米。
  DECIMETER: 'ديسيمتر',
  /// 平方分米。
  SQUAREDECIMETER: 'ديسيميتر مربع',
  ///  英尺。
  FOOT: 'قدم',
  ///  平方英尺。
  SQUAREFOOT: 'قدم مربع',
  ///  码。
  YARD: 'ياردة',
  ///  平方码。
  SQUAREYARD: 'ياردة مربعة',
  ///  米。
  METER: 'متر',
  ///  平方米。
  SQUAREMETER: 'متر مربع',
  /// 千米。
  KILOMETER: 'كيلومتر',
  /// 平方千米。
  SQUAREKILOMETER: 'كيلوميتر مربع',
  /// 平方英里。
  MILE: 'ميل',
  /// 英里。
  SQUAREMILE: 'ميل مربع',
  ///  秒。
  SECOND: 'ثانية',
  ///  分。
  MINUTE: 'دقيقة',
  ///  度。
  DEGREE: 'درجة',
  /// 弧度。
  RADIAN: 'راديان',
}

const Analyst_Params: typeof CN.Analyst_Params = {
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
  IDW: 'المسافة العكسية الترجيح',
  SPLINE: 'خدد منحنى',
  ORDINARY_KRIGING: 'كريجين',
  SIMPLE_KRIGING: 'طريقة بسيطة كريغ',
  UNIVERSAL_KRIGING: 'بان طريقة كريغ',

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
  GAUSSIAN: 'غاوسي',
}

const Analyst_Prompt: typeof CN.Analyst_Prompt = {
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
  REGISTRATION_LINE_POINTS: 'يرجى تعيين 4 نقاط تحكم على الأقل',
  REGISTRATION_QUADRATIC_POINTS: 'الرجاء تعيين 7 نقاط تحكم على الأقل',
  REGISTRATION_RECTANGLE_POINTS: 'الرجاء تعيين نقطتي تحكم',
  REGISTRATION_OFFSET_POINTS: 'الرجاء تعيين نقطة تحكم واحدة',
  REGISTRATION_POINTS_NUMBER_ERROR: 'عدد نقاط التحكم غير مطابق',
  ANALYSIS_SUCCESS_TOWATCH: 'تم التحليل بنجاح لمشاهدة',
}

export { Analyst_Modules, Analyst_Methods, Analyst_Labels, Analyst_Params, Analyst_Prompt, Convert_Unit }
