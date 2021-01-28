import CN from '../CN'

// 制图
const Map_Label: typeof CN.Map_Label = {
  // 地图底部导航
  MAP: 'خريطة',
  LAYER: 'طبقة',
  ATTRIBUTE: 'جدول البيانات',
  SETTING: 'إعدادات',
  SCENE: 'مشهد',
  NAME: 'اسم',
  TOOL_BOX: 'صندوق الأدوات',
  ARMAP: 'مشهد',
  NAVIGATION: 'ملاحى',
  INCREMENT: 'زيادة',
  ENCLOSURE: 'نسيج',
}

// 地图、场景主菜单
const Map_Main_Menu: typeof CN.Map_Main_Menu = {
  CURRENT_MAP: 'الخريطة الحالية',
  CURRENT_SCENCE: 'الوضع الحالى',
  CURRENT_MODEL: 'الوضع الحالى',
  // 地图制图及公共 开始
  START: 'أبدء',
  START_OPEN_MAP: 'فتح الخريطة',
  START_NEW_MAP: 'خريطة جديدة',
  START_RECENT: 'حديث',
  START_SAVE_MAP: 'حفظ الخريطة',
  START_SAVE_AS_MAP: 'حفظ الخريطة كا',
  START_OPEN_SENCE: 'فتح المشهد',
  START_NEW_SENCE: 'مشهد جديد',
  START_SAVE_SENCE: 'حفظ المشهد',
  START_SAVE_AS_SENCE: 'ححفظ كا',
  PLOT_SAVE_ANIMATION: 'حفظ الرسوم المتحركة',
  ANIMATION_NODE_NAME: 'اسم عقدة الرسوم المتحركة',

  PLOT: 'رسم بيانى',

  // 地图制图及公共 添加
  OPEN: 'إضافة',
  OPEN_DATASOURCE: 'مجموعة بيانات',
  OPEN_MAP: 'خريطة',
  OPEN_BACK: 'عودة',

  NAVIGATION_START: 'ملاحى',
  NETWORK_MODEL: 'نموذج',
  NETWORK_MODEL_FILE: 'ملفات نموذج الطرق',
  NAVIGATION_WORKSPACE: 'مساحة عمل التنقل',
  NAVIGATION_MAP: 'خريطة الملاحة',
  NETWORK: 'شبكه الطرق',
  NETWORK_MODULE: 'شبكات',
  NETMODEL: 'نموذج شبكه',
  NETDATA: 'شبكه البيانات',
  INDOORDATA: 'البيانات الداخلية',
  INDOOR_DATASOURCE: 'مصادر البيانات الداخلية',
  OUTDOOR_DATASETS: 'مصادر البيانات الخارجية',
  SWITCH_DATA: 'تبديل البيانات',
  DATASET: 'مجموعة بيانات',
  Traffic: 'المرور',

  ANALYSIS: 'تحليلات',
  PROCESS: 'معالجة',

  NEW_DATASOURCE: 'مجموعة بيانات جديدة',
  // 图例设置
  LEGEND_COLUMN: 'رقم العمود',
  LEGEND_WIDTH: 'العرض',
  LEGEND_HEIGHT: 'الإرتفاع',
  LEGEND_FONT: 'حجم الخط',
  LEGEND_ICON: 'حجم الصورة',
  LEGEND_COLOR: 'اللون',
  LEGEND_POSITION: 'موقع مفتاح الرسم',
  TOP_LEFT: 'محاذاة أعلى لليسار',
  TOP_RIGHT: 'محاذاة أعلى لليمين',
  LEFT_BOTTOM: 'محاذاة تحت لليسار',
  RIGHT_BOTTOM: 'محاذاة تحت لليمين',

  // 地图制图及公共 风格
  STYLE: 'الأنماط',
  STYLE_EDIT: 'تعديل الأنماط',
  STYLE_SYMBOL: 'الرمز',
  STYLE_SIZE: 'الحجم',
  STYLE_SYMBOL_SIZE: 'حجم الرمز',
  STYLE_COLOR: 'اللون',
  STYLE_ROTATION: 'الدوران',
  STYLE_TRANSPARENCY: 'الشفافية',
  STYLE_LINE_WIDTH: 'عرض الخط ',
  STYLE_FOREGROUND: 'المقدمة',
  STYLE_BACKGROUND: 'الخلفية',
  STYLE_BORDER: 'لون الحدود',
  STYLE_BORDER_WIDTH: 'عرض الحدود',
  STYLE_GRADIENT_FILL: 'تعبئة متدرجة',
  STYLE_FRAME_COLOR: 'لون الإطار',
  STYLE_FRAME_SYMBOL: 'رمز الإطار',
  STYLE_FONT: 'الخط',
  STYLE_FONT_SIZE: 'حجم الخط',
  STYLE_ALIGNMENT: 'محاذاة',
  STYLE_FONT_STYLE: 'نمط الخط',
  STYLE_CONTRAST: 'درجة اللون',
  STYLE_BRIGHTNESS: 'السطوع',
  STYLE_BOLD: 'غامق',
  STYLE_ITALIC: 'مائل',
  STYLE_UNDERLINE: 'أسفله خطا',
  STYLE_STRIKEOUT: 'يتوسطه خطا',
  STYLE_OUTLINE: 'خطوط عريضة',
  STYLE_SHADOW: 'ظل',
  SATURATION: 'صفاء اللون',
  CONTRAST: 'التباين',

  ROTATE_LEFT: 'دوران لليسار',
  ROTATE_RIGHT: 'دوران لليمين',
  VERTICAL_FLIP: 'انعكاس عمودي',
  HORIZONTAL_FLIP: 'انعكاس أفقي',

  // 地图制图及公共 工具
  TOOLS: 'الأدوات',
  TOOLS_DISTANCE_MEASUREMENT: 'قياس المسافة',
  TOOLS_AREA_MEASUREMENT: 'المساحة/القياس',
  TOOLS_AZIMUTH_MEASUREMENT: 'قياس السمت',
  TOOLS_SELECT: 'أختر',
  TOOLS_RECTANGLE_SELECT: 'حدد المستطيل',
  TOOLS_ROUND_SELECT: 'حدد المستدير',
  FULL_SCREEN: 'الشاشة كاملة',

  // 标注
  PLOTS: 'علامة',
  DOT_LINE: 'نقطة خط',
  FREE_LINE: 'خط حر',
  DOT_REGION: 'نقطة مساحة',
  FREE_REGION: 'مساحة حرة',
  TOOLS_3D_CREATE_POINT: 'أنشاء نقطة',
  TOOLS_CREATE_POINT: 'أنشاء نقطة ',
  TOOLS_CREATE_LINE: 'أنشاء خط',
  TOOLS_CREATE_REGION: 'أنشاء مساحة',
  TOOLS_CREATE_TRACK: 'أنشاء مسار',
  TOOLS_CREATE_TEXT: 'أنشاء نص',

  TOOLS_NAME: 'أسم',
  TOOLS_REMARKS: 'ملاحظات',
  TOOLS_HTTP: 'عنوان http',
  TOOLS_PICTURES: 'صور',
  COLLECT_TIME: 'وقت',
  COORDINATE: 'إحداثيات',

  // 裁剪
  TOOLS_RECTANGLE_CLIP: 'قطع مستطيل',
  TOOLS_CIRCLE_CLIP: 'قطع دائرة',
  TOOLS_POLYGON_CLIP: 'قطع مساحة',
  TOOLS_SELECT_OBJECT_AREA_CLIP: 'حدد المنطقة المستهدفة للقطع',
  TOOLS_CLIP_INSIDE: 'داخل القطع',
  TOOLS_ERASE: 'مسح',
  TOOLS_EXACT_CLIP: 'القطع بالظبط',
  TOOLS_TARGET_DATASOURCE: 'مجموعة البيانات المستهدفة',
  TOOLS_UNIFIED_SETTING: 'إعداد موحد',
  MAP_CLIP: 'قطع الخريطة',
  CLIP: 'قطع',

  CAMERA: 'كاميرا',
  TOUR: 'جولة',
  TOUR_NAME: 'اسم الجولة',

  STYLE_TRANSFER: 'رسم الخرائط والذكاء الاصطناعي',
  OBJ_EDIT: 'تحرير الكائن',

  TOOLS_MAGNIFIER: 'المكبر',
  TOOLS_SELECT_ALL: 'تحديد الكل',
  TOOLS_SELECT_REVERSE: 'حدد العكس',

  // 三维 工具
  TOOLS_SCENE_SELECT: 'تحديد',
  TOOLS_PATH_ANALYSIS: 'مسار التحليلات',
  TOOLS_VISIBILITY_ANALYSIS: 'التحليلات المرئية',
  TOOLS_CLEAN_PLOTTING: 'تنظيف التوقيع',
  TOOLS_BOX_CLIP: 'صندوق القطع',
  TOOLS_PLANE_CLIP: 'طائرة القطع',
  TOOLS_CROSS_CLIP: 'عبر القطع',
  // 三维 飞行
  FLY: 'طيران',
  FLY_ROUTE: 'مسار الطيران',
  FLY_ADD_STOPS: 'إضافة وقفات',
  FLY_AROUND_POINT: 'طيران حول النقطة',

  // 三维裁剪
  CLIP_LAYER: 'طبقة',
  CLIP_AREA_SETTINGS: 'إعدادات',
  CLIP_AREA_SETTINGS_WIDTH: 'عرض القاع',
  CLIP_AREA_SETTINGS_LENGTH: 'طول القاع',
  CLIP_AREA_SETTINGS_HEIGHT: 'الإرتفاع',
  CLIP_AREA_SETTINGS_XROT: 'دوران س',
  CLIP_AREA_SETTINGS_YROT: 'دوران ص',
  CLIP_AREA_SETTINGS_ZROT: 'دوران 0',
  POSITION: 'وضع',
  CLIP_SETTING: 'إعدادات القطع',
  CLIP_INNER: 'قطع داخلى',
  LINE_COLOR: 'لون الخط',
  LINE_OPACITY: 'ظلمه الخط',
  SHOW_OTHER_SIDE: 'أظهر الجانب الآخر',
  ROTATE_SETTINGS: 'دوران الإعدادات',
  CLIP_SURFACE_SETTING: 'إعدادات قطع السطح',
  CUT_FIRST: 'من فضلك أقطع الخريطة أولا',
  // 专题制图 专题图
  THEME: 'أنشاء',
  THEME_UNIFORM_MAP: 'خريطة موحدة',
  THEME_UNIQUE_VALUES_MAP: 'القيم الفريدة  في الخريطة',
  THEME_RANGES_MAP: 'خريطة النطاقات',
  THEME_UNIFORM_LABLE: 'تسمية موحدة',
  THEME_UNIQUE_VALUE_LABLE_MAP: 'قيمة فريدة/اسسم الخريطة',
  THEME_RANGES_LABLE_MAP: 'النطاقات/اسم الخريطة',
  THEME_AREA: 'مساحه',
  THEME_STEP: 'خطوه',
  THEME_LINE: 'خط',
  THEME_POINT: 'نقطة',
  THEME_COLUMN: 'عمود',
  THEME_3D_COLUMN: 'عمود ثلالثى الابعاد',
  THEME_PIE: 'دائرة',
  THEME_3D_PIE: 'دائرة ثلاثية الابعاد',
  THEME_ROSE: 'وردة',
  THEME_3D_ROSE: 'وردة ثلاثية الابعاد',
  THEME_STACKED_BAR: 'شريط مقسم',
  THEME_3D_STACKED_BAR: 'شريط مقسم ثلاثى الابعاد',
  THEME_RING: 'حلقة',
  THEME_DOT_DENSITY_MAP: 'كثافة النقاط/على الخريطة',
  THEME_GRADUATED_SYMBOLS_MAP: 'التدرج/على خريطة الرموز',
  THEME_HEATMAP: 'خريطة الحرارة',
  THEME_CRID_UNIQUE: 'شبكة فريدة',
  THEME_CRID_RANGE: 'نطاق الشبكة',

  THEME_ALL_SELECTED: 'اختيار الكل',
  THEME_ALL_CANCEL: 'الغاء الكل',
  THEME_HIDE_SYSTEM_FIELDS: 'إخفاء حقول النظام',
  THEME_EXPRESSION: 'مصطلح',
  THEME_UNIQUE_EXPRESSION: 'مصطلح موحد',
  THEME_RANGE_EXPRESSION: 'نطاق المصطلح',
  THEME_COLOR_SCHEME: 'نظام الالوان',
  THEME_FONT_SIZE: 'حجم الخط',
  THEME_FONT: 'الخط',
  THEME_ROTATION: 'دوران',
  THEME_COLOR: 'اللون',

  THEME_METHOD: 'طريقة',
  THEME_EQUAL_INTERVAL: 'فاصل متساوى',
  THEME_SQURE_ROOT_INTERVAL: 'الجذر التربيعى/على الفاصل',
  THEME_STANDARD_DEVIATION_INTERVAL: 'الفاصل الزمني للانحراف المعياري',
  THEME_LOGARITHMIC_INTERVAL: 'الفاصل اللوغاريتمي',
  THEME_QUANTILE_INTERVAL: 'الفاصل الكمي',
  THEME_MANUAL: 'يدوى',

  THEME_BACK_SHAPE: 'شكل الخلف',
  THEME_DEFAULT: 'محدد',
  THEME_RECTANGLE: 'مستطيل',
  THEME_ROUND_RECTANGLE: 'مستطيل مستدير',
  THEME_ELLIPSE: 'الشكل البيضاوي',
  THEME_DIAMOND: 'الماس',
  THEME_TRIANGLE: 'مثلث',
  THEME_MARKER_SYMBOL: 'رمز العلامة',

  THEME_HEATMAP_RADIUS: 'نصف القطر',
  THEME_HEATMAP_COLOR: 'نظام الالوان',
  THEME_HEATMAP_FUZZY_DEGREE: 'درجة اللون ضبابي',
  THEME_HEATMAP_MAXCOLOR_WEIGHT: 'أقصى وزن للون',

  THEME_GRANDUATE_BY: 'تدرج بواسطة',
  THEME_CONSTANT: 'مستمر',
  THEME_LOGARITHM: 'لوغاريتم',
  THEME_SQUARE_ROOT: 'الجذر التربيعى',
  THEME_MAX_VISIBLE_SIZE: 'أقصى حجم مرئي',
  THEME_MIN_VISIBLE_SIZE: 'أقصى حجم مرئي',

  // 自定义专题图设置
  THEME_RANGES_LABEL_MAP_TITLE: 'خريطة تسمية النطاقات',
  THEME_RANGES_MAP_TITLE: 'خريطة النطاقات',
  THEME_UNIQUE_VALUES_MAP_TITLE: 'خريطة القيم الفريدة',
  THEME_UNIQUE_VALUE_LABEL_MAP_TITLE: 'خريطة تسمية القيمة الفريدة',
  RANGE: 'نطاقات',
  PREVIEW: 'معاينة',
  CUSTOM_THEME_MAP: 'خريطة موضوعية مخصصة',
  COLOR_PICKER: 'محكم الألوان',
  USER_DEFINE: 'تحديد المستخدم',

  DOT_VALUE: 'قيممة النقطة',
  GRADUATE_BY: 'تدرج بواسطة',
  DATUM_VALUE: 'قيمة البيان',
  RANGE_COUNT: 'عدد النطاق',

  // 外业采集 采集
  CREATE_WITH_SYMBOLS: 'أنشاء عرض الرمز',
  CREATE_WITH_TEMPLATE: 'أنشاء مع القالب',
  POINT_SYMBOL_LIBRARY: 'Marker Libarary', // Libarary => Library
  LINE_SYMBOL_LIBRARY: 'Line Libarary',
  REGION_SYMBOL_LIBRARY: 'Fill Libarary',

  COLLECTION: 'جمع',
  COLLECTION_RECENT: 'حديث',
  COLLECTION_SYMBOL: 'رمز',
  COLLECTION_GROUP: 'مجموعة',
  COLLECTION_UNDO: 'إلغاء التحميل',
  COLLECTION_REDO: 'إعادة',
  COLLECTION_CANCEL: 'إلغاء',
  COLLECTION_SUBMIT: 'إرسال',
  COLLECTION_METHOD: 'طريقة الجمع',
  COLLECTION_POINTS_BY_GPS: 'جمع النقاط بواسطةنظام تحديد المواقع',
  COLLECTION_LINE_BY_GPS: 'جمع الخط بواسطة نظام تحديد المواقع',
  COLLECTION_POINT_DRAW: 'رسم النقطة',
  COLLECTION_FREE_DRAW: 'رسم حر',
  COLLECTION_ADD_POINT: 'إضافة النقاط',
  COLLECTION_START: 'بدء',
  COLLECTION_PAUSE: 'توقف',
  COLLECTION_STOP: 'توقف',

  // 外业采集 编辑
  EDIT: 'تعديل',
  EDIT_ADD_NODES: 'إضافة عقدة',
  EDIT_NODES: 'تعديل عقدة',
  EDIT_DELETE: 'حذف',
  EDIT_DELETE_NODES: 'حذف عقدة',
  EDIT_DELETE_OBJECT: 'حذف عنصر',
  EDIT_ERASE: 'مسح',
  EDIT_SPLIT: 'تقسيم',
  EDIT_UNION: 'اتحاد',
  EDIT_DRAW_HOLLOW: 'رسم تجويف',
  EDIT_PATCH_HOLLOW: 'الحاق تجويف',
  EDIT_FILL_HOLLOW: 'ملىء تجويف',
  EDIT_CANCEL_SELECTION: 'الغاء الاختيار',
  MOVE: 'حرك',
  OBJMOVE: 'Move',  //objevt move or jest move
  FREE_DRAW_ERASE: 'مسح رسم الحر',

  // 标绘
  PLOTTING: 'توقيع النقاط',
  PLOTTING_LIB_CHANGE: 'تغيير مكتبة توقيع النقاط',
  PLOTTING_LIB: 'مكتبه توقيع النقاط',
  PLOTTING_ANIMATION: 'استنتج',
  PLOTTING_ANIMATION_DEDUCTION: 'رسم الرسوم المتحركة',
  PLOTTING_ANIMATION_RESET: 'إعادة تعيين',

  // 分享
  SHARE: 'مشاركة',
  SHARE_WECHAT: 'مشاركة بويشات',
  SHARE_FRIENDS: 'مشاركة مع أصدقاء',
  SHARE_EXPLORE: 'استكشف',

  MAO_ROAD_DISTRIBUTION: 'شبكة/الطرق',

  MAP_AR_DONT_SUPPORT_DEVICE: ' لا ندعم هذا الجهاز',
  MAP_AR_DONT_SUPPORT_DEVICE_SEVEN: 'Don not support this device,Higher than android7',//待翻译

  MAP_AR_MEASURE: 'قياس الواقع المعزز', //need to be translated  AR Measure = Augmented Reality Measurement
  MAP_AR_ANALYZE: 'تحليل الواقع المعزز', //need to be translated
  MAP_AR_MAPPING: ' خرائط الواقع المعزز',
  MAP_AR_TOOL: 'ادوات الواقع المعزز', //need to be translated
  MAP_AR_CAMERA_EXCEPTION: 'الكاميرا غير طبيعية ، يرجى التحقق مما إذا كان الإذن مفتوحًا',
  MAP_AR_AI_ASSISTANT: 'AI\nCollect',   //  AI\nCollect =AI Collect
  MAP_AR_AI_ASSISTANT_CUSTOM_COLLECT: 'Custom Collect',
  MAP_AR_AI_ASSISTANT_MUNICIPAL_COLLECT: 'Municipal Collect',
  MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT: 'Violation Collect',
  MAP_AI_POSE_ESTIMATION: 'تقدير الوضع', //need to be translated
  MAP_AI_GESTURE_BONE: 'Gesture Bone', //need to be translated
  MAP_AR_AI_ASSISTANT_ROAD_COLLECT: 'جمع الطرق',
  MAP_AR_AI_ASSISTANT_POI_COLLECT: 'خريطة نقاط الاهتمام',
  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT: 'قياس الذكاء الاصطناعى',
  MAP_AR_AI_ASSISTANT_CLASSIFY: 'تصنيف الهدف',
  MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT: 'التجميع الكلي',
  MAP_AR_AI_ASSISTANT_TARGET_COLLECT: 'جمع الهدف',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT: 'AR Track', //待翻译
  MAP_AR_AI_ASSISTANT_ILLEGALLY_PARK_COLLECT: 'تجميع المتنزهات غير القانونية',
  MAP_AR_AI_ASSISTANT_CAST_MODEL_OPERATE: 'Cast Model',
  MAP_AR_AI_ASSISTANT_MEASURE_AREA: 'منطقة AR',
  MAP_AR_AI_ASSISTANT_MEASURE_LENGTH: 'تنظيم',
  MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE: 'رسم خط الواقع المعزز',
  MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA: 'صورة الواقع المعزز',
  MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT: 'نقاط رسم AR',
  MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT: 'نقاط رسم AR',

  MAP_AR_VIDEO: 'فيديو للواقع المعزز', //need to be translated
  MAP_AR_IMAGE: 'صور للواقع المعزز',
  MAP_AR_EFFECT: 'تاثير للواقع المعزز',
  MAP_AR_WEBVIEW: ' مواقع الويب للواقع المعزز',
  MAP_AR_TEXT: 'نص للواقع المعزز',
  MAP_AR_SELECT_EFFECT: 'تحديد التاثير',
  MAP_AR_PIPELINE: 'PipeLine',
  MAP_AR_AI_ASSISTANT_NEWDATA: 'بيانات جديدة',
  MAP_AR_AI_ASSISTANT_SCENE_NEW_DATANAME: 'ادخل الاسم',
  MAP_AR_TO_CURRENT_POSITION: 'إلى الحالي', //need to be translated
  MAP_AR_SELECT_POINT_PLANE: 'إلى المستوى',
  MAP_AR_ADD_TO_CURRENT_POSITION: 'إلى الحالي',
  MAP_AR_ADD_TO_PLANE: 'تحديد النقطة',
  MAP_AR_MOVE_TO_CURRENT_POSITION: 'إلى الحالي',
  MAP_AR_MOVE_TO_PLANE: 'تحديد النقطة',

  MAP_AR_AI_ASSISTANT_LEFT_ROTATE: 'انعطف لليسار',
  MAP_AR_AI_ASSISTANT_RIGHT_ROTATE: 'انعطف يمينا',
  MAP_AR_AI_ASSISTANT_SAND_TABLE: 'طاولة رمل',
  MAP_AR_AI_ASSISTANT_SAND_TABLE_HIDE: 'إخفاء طاولة الرمل',
  MAP_AR_AI_ASSISTANT_SAND_TABLE_MODEL: 'نموذج',
  MAP_AR_AI_ASSISTANT_OPREATE_MODEL: 'نموذج الإسقاط',
  MAP_AR_AI_ASSISTANT_OPREATE_MODEL_ARCHITECTURE: 'بناء',
  MAP_AR_AI_ASSISTANT_OPREATE_MODEL_PATH: 'طريق',
  MAP_AR_AI_ASSISTANT_OPREATE_MODEL_MARKER: 'صرخ',

  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_CHOOSE_MODEL: 'اختر النموذج',
  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_SEARCHING: 'جارى بحث السطح',
  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_VIEW_DISTANCE: 'رؤيه المسافة',

  MAP_AR_AI_ASSISTANT_LAYOUT_CLOSE:'Stay Away',//待翻译
  MAP_AR_AI_ASSISTANT_LAYOUT_DARK:'Too Dim,Take More Light',//待翻译
  MAP_AR_AI_ASSISTANT_LAYOUT_FAST:'Too Fast,Please Slow Down',//待翻译
  MAP_AR_AI_ASSISTANT_LAYOUT_NOFEATURE:'Move Device To Find Feature',//待翻译

  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOTALLENGTH: 'اجمالى الطول',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOLASTLENGTH: 'اجمالى الطول',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_HISTORY: 'اجمع التاريخ',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NAME: 'ادخل الاسم',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY: 'لايوجد تاريخ',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_START: 'بدء التسجيل',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_STOP: 'وقف التسجيل',
  MAP_AR_AI_ASSISTANT_SAVE_LINE: 'خط',
  MAP_AR_AI_ASSISTANT_SAVE_POINT: 'نقطة',
  MAP_AR_AI_SAVE_SUCCESS: 'حفظ بنجاح',
  MAP_AR_AI_SAVE_POINT: 'حفظ النقطة',
  MAP_AR_AI_SAVE_LINE: 'حفظ الخط',
  MAP_AR_AI_CHANGE: 'تغيير',
  MAP_AR_AI_CLEAR: 'مسح',
  MAP_AR_AI_NEW_ROAD: 'من فضلك انشاء خط جديد',

  // need to be translated
  MAP_AR_AI_SAVE_REGION: 'حفظ المنطقة',
  MAP_AR_AI_SCENE_TRACK_COLLECT: 'تجميع المسار',
  MAP_AR_AI_SCENE_POINT_COLLECT: 'تجميع النقاط',
  MAP_AR_AI_SCENE_POINT_COLLECT_CLICK_HINT: 'انقر فوق الشاشة لتحديد النقطة الحالية',

  MAP_AR_AI_MEASURE_LENGTH: 'قياس الطول',
  MAP_AR_AI_MEASURE_AREA: 'منطقة القياس',
  MAP_AI_POSE_ESTIMATION_ZOOM: 'Pose Zoom', //need to be translated
  MAP_AI_POSE_ESTIMATION_PAN: 'Pose Pan', //need to be translated
  MAP_AI_POSE_ESTIMATION_OVERLOOK: 'Pose Overlook', //need to be translated
  MAP_AI_POSE_ESTIMATION_LOOK: 'Pose Look', //need to be translated
  MAP_AI_POSE_ESTIMATION_SWITCH_CAMERA: 'تبديل الكاميرا', //need to be translated
  MAP_AI_POSE_ESTIMATION_ASSOCIATION: 'خريطة الترابط', //need to be translated
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_CANCEL: 'إلغاء الترابط', //need to be translated
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_UP: 'أعلى', //need to be translated
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_DOWN: 'أسفل', //need to be translated
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_LEFT: 'يسار', //need to be translated
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_RIGHT: 'يمين', //need to be translated
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_SHRINK: 'تقليص', //need to be translated
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_MAGNIFY: 'تكبير', //need to be translated
  MAP_AI_GESTURE_BONE_DETAIL: 'تفاصيل الإيماءة', //need to be translated
  MAP_AI_GESTURE_BONE_CLOSE: 'إغلاق', //need to be translated

  MAP_AR_AI_ASSISTANT_CLASSIFY_LOADING: 'تصنيف التحميل',
  MAP_AR_AI_ASSISTANT_CLASSIFY_FAILED: 'فشل التصنيف,حاول مرة اخرى',
  MAP_AR_AI_ASSISTANT_CLASSIFY_NOPICS: 'لم يتم اخنيار الصورة',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT: 'النتيجة',
  MAP_AR_AI_ASSISTANT_CLASSIFY_CONFIDENCE: 'الثقة',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_NAME: 'اسم الهدف',

  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_TIME: 'تصنيف الوقت',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_REMARKS: 'ملاحظات',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_PLEA_REMARKS: 'ادخل الملاحظة',
  MAP_AR_AI_ASSISTANT_CLASSIFY_SAVE: 'حفظ',

  MAP_AR_AI_CANCEL: 'الغاء',
  MAP_AR_AI_CONFIRM: 'تأكيد',

  // 智能配图
  FILL: 'ملىء',
  BORDER: 'حدود',
  LINE: 'خط',
  MARK: 'علامة',

  // 地图导航
  START_POINT: 'نقطة البداية',
  END_POINT: 'المكان المقصود',
  DRAW: 'رسم',
  ROAD_DETAILS: 'تفاصيل الطريق',
  ROUTE_THROUGH: 'عبر الطريق',
  DISTANCE: 'مسافة',
  METERS: 'متر',
  KILOMETERS: 'كيلومتر',
  DISPLAY_MAP: 'عرض الخريطة',
  START_FROM_START_POINT: 'بدءا من النقطة الأولية',
  ARRIVE_AT_THE_DESTINATION: 'الوصول الى المكان المقصود',
  REAL_NAVIGATION: 'بدء التنقل',
  SIMULATED_NAVIGATION: 'التنقل المحاكي',
  GO_STRAIGHT: 'الذهاب مباشرة',
  SELECT_START_POINT: 'اختر البداية',
  SELECT_DESTINATION: 'اختر المكان المقصود',
  SET_AS_START_POINT: 'تعيين كبداية',
  SET_AS_DESTINATION: 'تعيين كالمكان المقصود',
  CLEAR_NAV_HISTORY: 'مسح التاريخ',
  ROUTE_ANALYST: 'تحليل المسار',
  SELECT_POINTS: 'اختر النقاط',
  LONG_PRESS_SELECT_POINTS: 'ضغط طويل لاختيار النقطة',
  INCREMENT_ROAD: 'زيادة الطريق',
  TRACK: 'عن طريق المسار',
  HAND_PAINTED: 'باليد',
  NETWORK_DATASET: 'مجموعة بيانات شبكة الطرق',
  MODEL_FILE: 'ملفات نموذج التنقل',
  MY_LOCATION: 'موقعى',

  //导航采集
  MAP_INDOOR_NETWORK: 'داخلي', //need to be translated
  MAP_OUTDOOR_NETWORK: 'خارجي',

  MAP_INCREMENT_START: 'ابدأ',
  MAP_INCREMENT_STOP: 'إيقاف',
  MAP_INCREMENT_ADD_POINT: 'إضافة نقطة',
  MAP_INCREMENT_CANCEL: 'إلغاء',
  MAP_INCREMENT_COMMIT: 'الالتزام',

  MAP_INCREMENT_GPS_POINT: 'اجمع النقاط بواسطة GPS',
  MAP_INCREMENT_GPS_TRACK: 'تجميع الخط بواسطة GPS',
  MAP_INCREMENT_POINTLINE: 'رسم النقاط',
  MAP_INCREMENT_FREELINE: 'الرسم الحر',

  MAP_TOPO_ADD_NODE: 'إضافة عقدة',
  MAP_TOPO_EDIT_NODE: 'تعديل العقدة',
  MAP_TOPO_DELETE_NODE: 'حذف العقدة',
  MAP_TOPO_DELETE_OBJECT: 'حذف الكائن',
  MAP_TOPO_SMOOTH: 'سلس',
  MAP_TOPO_SPLIT_LINE: 'تقسيم الخط',
  MAP_TOPO_SPLIT: 'مقاطعة',
  MAP_TOPO_EXTEND: 'تمديد',
  MAP_TOPO_TRIM: 'تقليم',
  MAP_TOPO_RESAMPLE: 'إعادة أخذ العينات',
  MAP_TOPO_CHANGE_DIRECTION: 'تغيير الاتجاه',
  ADD_DATASET: 'إلحاق مجموعة البيانات',
  SELECT_ROADNAME_FIELD: 'حدد حقل اسم الطريق',
  SELECT_FIELD: 'تحديد حقل',
  MERGE_CANCEL: 'إلغاء',
  MERGE_CONFIRM: 'تأكيد',
  MERGE_SELECT_ALL: 'تحديد الكل',
  MERGE_ADD: 'إلحاق',
  MERGE_DATASET: 'دمج مجموعات البيانات',

  // 专题制图加载/输出xml 待翻译
  MAP_OUTPUT_XML: 'Output',
  MAP_LOAD_XML: 'Load',
}

// 推演动画
const Map_Plotting: typeof CN.Map_Plotting = {
  PLOTTING_ANIMATION_MODE: 'وضع الرسوم المتحركة',
  PLOTTING_ANIMATION_OPERATION: 'نتيجة العملية',
  PLOTTING_ANIMATION_START_MODE: 'بدء',

  PLOTTING_ANIMATION_WAY: 'طريق',
  PLOTTING_ANIMATION_BLINK: 'وضع رابط للرسوم المتحركة',
  PLOTTING_ANIMATION_ATTRIBUTE: 'جدول بيانات',
  PLOTTING_ANIMATION_SHOW: 'عرض',
  PLOTTING_ANIMATION_ROTATE: 'دوران',
  PLOTTING_ANIMATION_SCALE: 'مقياس',
  PLOTTING_ANIMATION_GROW: 'نمو الرسوم المتحركة',

  PLOTTING_ANIMATION_START_TIME: 'وقت البدء',
  PLOTTING_ANIMATION_DURATION: 'المدة الزمنية',
  PLOTTING_ANIMATION_FLLOW_LAST: 'اتبع تشغيل الرسوم المتحركة الأخيرة',
  PLOTTING_ANIMATION_CLICK_START: 'انقر فوق ابدأ',
  PLOTTING_ANIMATION_TOGETHER_LAST: 'معا الرسوم المتحركة الأخيرة',
  PLOTTING_ANIMATION_CONTINUE: 'تابع إنشاء',
  PLOTTING_ANIMATION_WAY_SET: 'تعيين طريقة الرسوم المتحركة',
  PLOTTING_ANIMATION_SAVE: 'حفظ',
  PLOTTING_ANIMATION_BACK: 'عودة',

  ANIMATION_ATTRIBUTE_STR: 'جدول بيانات الرسوم المتحركة',
  ANIMATION_WAY: 'طريقة الرسوم المتحركة',
  ANIMATION_BLINK: 'وميض الرسوم المتحركة',
  ANIMATION_ATTRIBUTE: 'جدول بيانات الرسوم المتحركة',
  ANIMATION_SHOW: 'عرض الرسوم المتحركة',
  ANIMATION_ROTATE: 'دوران الرسوم المتحركة',
  ANIMATION_SCALE: 'مقياس الرسوم المتحركة',
  ANIMATION_GROW: 'نمو الرسوم المتحركة',

  ANIMATION_SCALE_START_SCALE: 'بدء المقياس',
  ANIMATION_SCALE_END_SCALE: 'نهاية المقياس',

  ANIMATION_SHOW_STATE: 'عرض الحالة',
  ANIMATION_SHOW_EFFECT: 'عرض التأثير',

  ANIMATION_BLINK_INTERVAL: 'الفاصل الزمني للرسوم المتحركة',
  ANIMATION_BLINK_NUMBER: 'رقم رابط الرسوم المتحركة',
  ANIMATION_BLINK_REPLACE: 'استبدال رابط الرسوم المتحركة',
  ANIMATION_BLINK_START_COLOR: 'بدءاللون لرسوم المتحركة',
  ANIMATION_BLINK_REPLACE_COLOR: 'تغيير اللون لرسوم المتحركة',

  ANIMATION_ROTATE_DIRECTION: 'اتجاه الدوران',
  ANIMATION_ROTATE_CLOCKWISE: 'اتجاه عقارب الساعه',
  ANIMATION_ROTATE_ANTICLOCKWISE: 'عكس عقارب الساعة',
  ANIMATION_ROTATE_START_ANGLE: 'بدء الزاوية',
  ANIMATION_ROTATE_END_ANGLE: 'نهاية الزاوية',

  ANIMATION_ATTRIBUTE_LINE_WIDTH: 'عرض الخط',
  ANIMATION_ATTRIBUTE_LINE_WIDTH_START: 'بداية عرض الخط',
  ANIMATION_ATTRIBUTE_LINE_WIDTH_END: 'نهاية عرض الخط',
  ANIMATION_ATTRIBUTE_LINE_COLOR: 'لون الخط',
  ANIMATION_ATTRIBUTE_LINE_COLOR_START: 'بداية لون الخط',
  ANIMATION_ATTRIBUTE_LINE_COLOR_END: 'نهاية لون الخط',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH: 'عرض الخط المحيط',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH_START: 'بداية عرض الخط المحيط',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH_END: 'نهاية عرض الخط المحيط',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR: 'لون الخط المحيط',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR_START: 'بداية لون الخط المحيط',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR_END: 'نهاية لون الخط المحيط',

  ANIMATION_NODE_EDIT: 'تعديل الرسوم المتحركة',
}

// 图层
const Map_Layer: typeof CN.Map_Layer = {
  PLOTS: 'علامة',
  PLOTS_IMPORT: 'استيراد علامات',
  PLOTS_DELETE: 'حذف علامات',
  PLOTS_EDIT: 'Edit Marks',
  PLOTS_SET_AS_CURRENT: 'تعيين كالعلامات الحالية',

  LAYERS: 'طبقاتى',
  LAYERS_MOVE_UP: 'تحرك لاعلى',
  LAYERS_MOVE_DOWN: 'تحرك للاسفل',
  LAYERS_TOP: 'اعلى',
  LAYERS_BOTTOM: 'اسفل',
  LAYERS_LONG_PRESS: 'اضغط مع الاستمرارطويلا واسحب للترتيب',
  LAYERS_SET_AS_CURRENT_LAYER: 'تعيين كطبقة الحالية',
  LAYERS_FULL_VIEW_LAYER: 'عرض هذه الطبقة بالكامل',
  LAYERS_LAYER_STYLE: 'شكل الطبقة',
  LAYERS_FULL_EXTENT: 'المدى الكامل',
  LAYERS_SET_VISIBLE_SCALE: 'تعيين مقياس مرئي',
  LAYERS_RENAME: 'اعادة تسمية',
  LAYERS_COPY: 'نسخ',
  LAYERS_PASTE: 'لصق',
  LAYERS_LAYER_PROPERTIES: 'خصائص الطبقة',
  LAYERS_REMOVE: 'ازالة',
  LAYERS_COLLECT: 'اجمع على الطبقة الحالية',
  LAYERS_MAXIMUM: 'أقصى مقياس مرئي',
  LAYERS_MINIMUM: 'مقياس الحد الأدنى المرئي',
  LAYERS_UER_DEFINE: 'تحديد المستخدم',
  LAYER_NONE: 'لا شيء',
  LAYERS_SET_AS_CURRENT_SCALE: 'تعيين كمقياس حالى',
  LAYERS_CLEAR: 'مسح',
  LAYERS_LAYER_NAME: 'اسمم الطبقة',
  LAYERS_COMPLETE_LINE: 'خط كامل',
  LAYERS_OPTIMIZE_CROSS: 'تحسين التقاطعات',
  LAYERS_ANTIALIASING: 'الحواف',
  LAYERS_SHOW_OVERLAYS: 'عرض التداخل',
  LAYERS_SCALE_SYMBOL: 'مقياس الرمز',
  LAYERS_SCALE: 'مقياس',
  LAYERS_MIN_OBJECT_SIZE: 'اصغر حجم للعنصر',
  LAYERS_FILTER_OVERLAPPING_SMALL_OBJECTS: 'تصفية الكائنات المتداخلة الصغيرة',
  LAYERS_SHARE: 'مشاركة',
  SELECT_LAYSER_SCALE: 'من فضلك اختر المقياس',
  LAYER_SCALE_RANGE_WRONG: 'يجب أن يكون المقياس المرئي الأقصى أكبر من المقياس المرئي الحد الأدنى',

  VISIBLE: 'مرئي',
  NOT_VISIBLE: 'غير مرئي',
  OPTIONAL: 'اختيارى',
  NOT_OPTIONAL: 'اجبارى',
  EDITABLE: 'تعديل الجدول',
  NOT_EDITABLE: 'غير قابل لتعديل الجدول',
  SNAPABLE: 'قابل للانزلاق',
  NOT_SNAPABLE: 'غير قابل للانزلاق',
  // 专题图图层
  LAYERS_CREATE_THEMATIC_MAP: 'أنشاء خريطة موضوعية',
  LAYERS_MODIFY_THEMATIC_MAP: 'تعديل خريطة موضوعية',

  BASEMAP: 'خريطة الأساس الخاصة بي',
  BASEMAP_SWITH: 'تبديل خريطة الأساس',
  MY_TERRAIN: 'تضاريس بلادي',

  //need to be translated
  SCALE_TO_CURRENT_LAYER: 'تحجيم الطبقة الحالية',
  ADD_A_TERRAIN_LAYER: 'إضافة طبقة تضاريس',
  ADD_A_IMAGE_LAYER: 'إضافة طبقة صورة',
  REMOVE_THE_CURRENT_LAYER: 'إزالة الطبقة الحالية',
  ONLINE_BASE_MAP: 'خريطة اساس من الانترنت',
  ADD_LAYER_URL: 'اضافة طبقة من Url',
  TERRAIN: 'تضاريس',
  IMAGE: 'صورة',
  IS_ADD_NOTATION_LAYER: 'هل تريد إضافة طبقة الرموز', //need to be translated

  LAYER_SETTING_IMAGE_DISPLAY_MODE: 'وضع العرض', //need to be translated
  LAYER_SETTING_IMAGE_STRETCH_TYPE: 'نوع التمدد',
  DISPLAY_MODE_COMPOSITE: 'مركب',
  DISPLAY_MODE_STRETCHED: 'ممتدة',
  STRETCH_TYPE_NONE: 'لا شئ',
  STRETCH_TYPE_STANDARDDEVIATION: 'الانحراف المعياري',
  STRETCH_TYPE_MINIMUMMAXIMUM: 'الحد الأدنى-الحد الأقصى', // Minimum-Maximum
  STRETCH_TYPE_HISTOGRAMEQUALIZATION: 'معادلة المدرج التكراري',
  STRETCH_TYPE_HISTOGRAMSPECIFICATION: 'مواصفات المدرج التكراري',
  STRETCH_TYPE_GAUSSIAN: 'غاوسي',
}

// 属性
const Map_Attribute: typeof CN.Map_Attribute = {
  ATTRIBUTE_SORT: 'ترتيب',
  ATTRIBUTE_LOCATION: 'موقع',
  ATTRIBUTE_CANCEL: 'إلغاء',
  ATTRIBUTE_EDIT: 'تعديل',
  ATTRIBUTE_STATISTIC: 'احصائى',
  ATTRIBUTE_ASSOCIATION: 'اتحاد',
  ATTRIBUTE_NO: 'لا',
  ATTRIBUTE_CURRENT: 'حالى',
  ATTRIBUTE_FIRST_RECORD: 'اول تسجيل',
  ATTRIBUTE_LAST_RECORD: 'اخر تسجيل',
  ATTRIBUTE_RELATIVE: 'نسبيا',
  ATTRIBUTE_ABSOLUTE: 'غير نسبى',
  ATTRIBUTE_UNDO: 'الغاء تحميل',
  ATTRIBUTE_REDO: 'إعادة',
  ATTRIBUTE_REVERT: 'العودة',
  ATTRIBUTE_FIELD_ADD: 'اضافة',
  ATTRIBUTE_ADD: 'إضافة صفة',
  ATTRIBUTE_DETAIL: 'تفاصيل الصفة',
  REQUIRED: 'مطلوب',
  NAME: 'اسم',
  TYPE: 'نوع',
  LENGTH: 'طول',
  DEFAULT: 'افتراضي',
  CONFIRM_ADD: 'إضافة',

  DETAIL: 'تفاصبل',
  // 统计模式
  MAX: 'اعلى قيمة',
  MIN: 'ادنى قيمة',
  AVERAGE: 'متوسط',
  SUM: 'مجموع',
  VARIANCE: 'فرق',
  STANDARD_DEVIATION: 'الانحراف المعياري',
  COUNT_UNIQUE: 'عدد',
  FIELD_TYPE: 'نوع الحقل',
  ALIAS: 'الاسم الاخر',
  ASCENDING: 'تصاعدي',
  DESCENDING: 'تنازلى',
}

// 地图设置
const Map_Setting: typeof CN.Map_Setting = {
  BASIC_SETTING: 'الاعدادات الاساسية',
  ROTATION_GESTURE: 'إيماءة الدوران',
  PITCH_GESTURE: 'Pitch Gesture',
  THEME_LEGEND: 'عنوان تفسيرى للموضوع',
  COLUMN_NAV_BAR: 'شريط التنقل العمودي عند الأفقي',
  REAL_TIME_SYNC: 'مزامنة في الوقت الفعلي',

  // 效果设置
  EFFECT_SETTINGS: 'اعدات التاثير',
  ANTI_ALIASING_MAP: 'ANTI-ALIASING MAP',
  SHOW_OVERLAYS: 'عرض التداخل',

  // 范围设置
  BOUNDS_SETTING: 'إعدادات الحدود',
  FIX_SCALE: 'مقياس ثابت',

  // 三维场景设置
  SCENE_NAME: 'اسم المشهد',
  FOV: 'FOV',
  SCENE_OPERATION_STATUS: 'حالة تشغيل المشهد',
  VIEW_MODE: 'نمط العرض',
  TERRAIN_SCALE: 'مقياس التضاريس',
  SPHERICAL: 'كروي',
}

// 地图设置菜单
const Map_Settings: typeof CN.Map_Settings = {
  THEME_LEGEND: 'عنوان تفسيرى للموضوع',
  // 一级菜单
  BASIC_SETTING: 'الاعدادات الاساسية',
  RANGE_SETTING: 'إعدادات الحدود',
  COORDINATE_SYSTEM_SETTING: 'اعدادات نظام الاحداثيات',
  ADVANCED_SETTING: 'اعدادات متقدمة',
  LEGEND_SETTING: 'اعدادات العنوان التفسيرى',
  ENCLOSURE_NAME: 'اسم النسيج',
  START_TIME: 'وقت البدية',
  END_TIME: 'وقت النهاية',
  REMARKS: 'ملاحظات',
  DRAWING_RANGE: 'نطاق الرسم',

  //目标识别二级菜单
  Beta: '(تجربة وظيفة)',

  // 视频地图设置	一级菜单
  POI_SETTING: 'اعدادات نقاط الاهتمام',
  DETECT_TYPE: 'كشف الأنواع',
  DETECT_STYLE: 'كشف الشكل',

  POI_SETTING_PROJECTION_MODE: 'وضع الإسقاط',
  POI_SETTING_OVERLAP_MODE: 'وضع التداخل',
  POI_SETTING_POLYMERIZE_MODE: 'وضع البلمرة',

  DETECT_TYPE_PERSON: 'شخص',
  DETECT_TYPE_BICYCLE: 'دراجة',
  DETECT_TYPE_CAR: 'سيارة',
  DETECT_TYPE_MOTORCYCLE: 'دراجة نارية',
  DETECT_TYPE_BUS: 'أتوبيس',
  DETECT_TYPE_TRUCK: 'شاحنة نقل',
  DETECT_TYPE_TRAFFICLIGHT: 'اشارة المرور',
  DETECT_TYPE_FIREHYDRANT: 'صنبور الاطفاء',
  DETECT_TYPE_CUP: 'كأس',
  DETECT_TYPE_CHAIR: 'كرسي',
  DETECT_TYPE_BIRD: 'طائر',
  DETECT_TYPE_CAT: 'سيارة',
  DETECT_TYPE_DOG: 'كلب',
  DETECT_TYPE_POTTEDPLANT: 'النبات المحفوظ بوعاء',
  DETECT_TYPE_TV: 'تليفزيون',
  DETECT_TYPE_LAPTOP: 'حاسوب محمول',
  DETECT_TYPE_MOUSE: 'فأره',
  DETECT_TYPE_KEYBOARD: 'لوحة المفاتيح',
  DETECT_TYPE_CELLPHONE: 'الهاتف الخلوي',
  DETECT_TYPE_BOOK: 'كتاب',
  DETECT_TYPE_BOTTLE: 'زجاجة',

  DETECT_STYLE_IS_DRAW_TITLE: 'Draw Tiele',
  DETECT_STYLE_IS_DRAW_CONFIDENCE: 'Diaw Conifidence',
  DETECT_STYLE_IS_SAME_COLOR: 'نفس اللون ',
  DETECT_STYLE_SAME_COLOR: 'نفس قيمة اللون',
  DETECT_STYLE_STROKE_WIDTH: 'Stroke Width',
  COUNTRACKED: 'عدد المسار',

  // 二级菜单 基本设置
  MAP_NAME: 'اسم الخريطة',
  SHOW_SCALE: 'عرض المقياس',
  SHOW_LOCATION: 'اعرض الموقع',//need to be translated
  ROTATION_GESTURE: 'إيماءة الدوران',
  PITCH_GESTURE: 'Pitch Gesture',
  ROTATION_ANGLE: 'زاوية الدوران',
  COLOR_MODE: 'وضع اللون',
  BACKGROUND_COLOR: 'لون الخلفية',
  MAP_ANTI_ALIASING: 'Map Anti-aliasing',
  FIX_SYMBOL_ANGLE: 'إصلاح زاوية الرمز',
  FIX_TEXT_ANGLE: 'إصلاح زاوية النص',
  FIX_TEXT_DIRECTION: 'إصلاح اتجاه النص',
  SHOW_OVERLAYS: 'عرض التداخل',
  ENABLE_MAP_MAGNIFER: 'تمكين مكبر الخريطة',

  // 二级菜单 范围设置
  MAP_CENTER: 'مركز الخريطة',
  MAP_SCALE: 'مقياس الخريطة',
  FIX_SCALE_LEVEL: 'تحديد مستوى المقياس',
  CURRENT_VIEW_BOUNDS: 'حدود العرض الحالي',

  // 二级菜单 坐标系设置
  COORDINATE_SYSTEM: 'نظام الاحداثيات',
  COPY_COORDINATE_SYSTEM: 'نسخ نظام الاحداثيات',
  DYNAMIC_PROJECTION: 'تمكين الاسقاط الديناميكى',
  TRANSFER_METHOD: 'طريقة التحويل',

  // 二级菜单 高级设置
  FLOW_VISIUALIZATION: 'تصور التدفق',
  SHOW_NEGATIVE_DATA: 'إظهار البيانات السلبية',
  AUTOMATIC_AVOIDANCE: 'تجنب تلقائي',
  ZOOM_WITH_MAP: 'تكبير مع الخريطة',
  SHOW_TRACTION_LINE: 'إظهار خط الجر',
  GLOBAL_STATISTICS: 'الإحصائيات العالمية',
  CHART_ANNOTATION: 'الرسم المتحرك للرسم البيانى',
  SHOW_AXIS: 'عرض المحور',
  HISTOGRAM_STYLE: 'نمط الرسم البياني',
  ROSE_AND_PIE_CHART_STYLE: 'شكل الرسم البيانى للدائرة&الوردة',

  // 三级菜单 颜色模式
  DEFAULT_COLOR_MODE: 'وضع اللون الافتراضي',
  BLACK_AND_WHITE: 'اسود وابيض',
  GRAY_SCALE_MODE: 'وضع المقياس الرمادي',
  ANTI_BLACK_AND_WHITE: 'مكافحة الابيض والاسود',
  ANTI_BLACK_AND_WHITE_2: 'مكافحة الأسود والأبيض ، ألوان أخرى دون تغيير',

  // 三级菜单 窗口四至范围
  LEFT: 'يسار',
  RIGHT: 'يمين',
  TOP: 'اعلى',
  BOTTOM: 'اسفل',

  // 三级菜单 坐标系设置
  PLAN_COORDINATE_SYSTEM: 'نظام الاحداثيات المخطط',
  GEOGRAPHIC_COORDINATE_SYSTEM: 'نظام الاحداثيات الجغرافى',
  PROJECTED_COORDINATE_SYSTEM: 'نظام الاحداثيات المسقط',

  // 三级菜单 复制坐标系
  FROM_DATASOURCE: 'من مصدر البيانات',
  FROM_DATASET: 'من مصدر البيانات',
  FROM_FILE: 'من الملف',

  // 四级菜单 转换方法参数设置
  BASIC_PARAMS: 'معاملات اساسية',
  OFFSET: 'تعويض',
  PROPORTIONAL_DIFFERENCE: 'الفرق النسبي',
  ROTATION_ANGLE_SECONDS: 'زاوية الدوران (بالثواني)',

  // 四级菜单 和复制提示
  DATASOURCES: 'مصدر البيانات',
  DATASETS: 'مجموعات البيانات',
  TYPE: 'نوع',
  FORMAT: 'تنسيق',
  ALL_COORD_FILE: 'ملف نظام الإحداثيات المدعوم',
  SHAPE_COORD_FILE: 'شكل ملف نظام الاحداثيات',
  MAPINFO_FILE: 'تغيير ملف ماب انفو',
  MAPINFO_TAB_FILE: 'ملف التبويب ماب انفو',
  IMG_COORD_FILE: 'صورة ملف نظام الاحداثيات',
  COORD_FILE: 'ملف نظام الاحداثيات',

  // 设置的一些参数
  PERCENT: 'نسبه مئويه',
  OFF: 'إيقاف',
  CONFIRM: 'تأكيد',
  CANCEL: 'الغاء',
  COPY: 'نسخ',

  CONFIDENCE: 'Confidence', //need to be translated
}

// 地图工具
const Map_Tools: typeof CN.Map_Tools = {
  VIDEO: 'فيديو',
  PHOTO: 'صورة',
  AUDIO: 'صوت',

  TAKE_PHOTO: 'التقاط الصورة',
  FROM_ALBUM: 'اختر من الالبوم',
  VIEW: 'عرض',
}

// POI title
const Map_PoiTitle: typeof CN.Map_PoiTitle = {
  FOOD: 'طعام',
  SCENE: 'مشهد',
  BANK: 'بنك',
  SUPERMARKET: 'سوق',
  HOTEL: 'فندق',
  TOILET: 'مرحاض',
  BUS_STOP: 'حافلة',
  PARKING_LOT: 'حديقة عامه',
  HOSPITAL: 'مستشفى',
  GAS_STATION: 'محطة بنزين',
  MARKET: 'مول',
  SUBWAY: 'مترو الانفاق',
}

// 采集模板
const Template: typeof CN.Template = {
  COLLECTION_TEMPLATE_MANAGEMENT: 'إدارة النماذج',
  COLLECTION_TEMPLATE_CREATE: 'إنشاء نموذج',
  COLLECTION_TEMPLATE_NAME: 'اسم النموذج',
  ELEMENT_SETTINGS: 'إعدادات العنصر',
  ELEMENT_STORAGE: 'تخزين العناصر',
  ATTRIBUTE_SETTINGS: 'إعدادات الصفات',
  CURRENT_TEMPLATE: 'النموذج الحالى',
  DEFAULT_TEMPLATE: 'النموذج الافتراضي',

  ELEMENT_NAME: 'اسم العنصر',
  ELEMENT_CODE: 'رمز العنصر',

  CREATE_ROOT_NODE: 'إنشاء عقدة جذر',
  CREATE_CHILD_NODE: 'إنشاء عقدة ابن',
  INSERT_NODE: 'إدراج عقدة',

  TEMPLATE_ERROR: 'لا يمكن استخدام النموذج اذا لم يتم حفظ الخريطة',
}

export { Map_Main_Menu, Map_Label, Map_Layer, Map_Plotting, Map_Attribute, Map_Setting, Map_Settings, Map_Tools, Map_PoiTitle, Template }
