// 制图
const Map_Label = {
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
const Map_Main_Menu = {
  CURRENT_MAP: 'الخريطة الحالية',
  CURRENT_SCENCE: 'Current', // 待翻译
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
  NETWORK_MODULE: '路网',
  NETMODEL: 'نموذج شبكه',
  NETDATA: 'شبكه البيانات',
  INDOORDATA: 'البيانات الداخلية',
  INDOOR_DATASOURCE: '室内数据源',
  OUTDOOR_DATASETS: '室外数据集',
  SWITCH_DATA: '导航数据切换',
  DATASET: 'مجموعة بيانات',
  Traffic: 'المرور',

  ANALYSIS: 'تحليلات',
  PROCESS: '处理',

  NEW_DATASOURCE: 'مجموعة بيانات جديدة',
  // 图例设置
  LEGEND_COLUMN: 'رقم العمود',
  LEGEND_WIDTH: 'العرض',
  LEGEND_HEIGHT: 'الإرتفاع',
  LEGEND_FONT: '字体大小',
  LEGEND_ICON: '图标大小',
  LEGEND_COLOR: 'اللون',
  LEGEND_POSITION: '图例位置',
  TOP_LEFT: '左上对齐',
  TOP_RIGHT: '右上对齐',
  LEFT_BOTTOM: '左下对齐',
  RIGHT_BOTTOM: '右下对齐',

  // 地图制图及公共 风格
  STYLE: 'الأنماط',
  STYLE_EDIT: '风格编辑',
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
  OBJ_EDIT: '对象编辑',

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
  THEME_CRID_UNIQUE: '栅格单值专题图',
  THEME_CRID_RANGE: '栅格分段专题图',

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
  THEME_RANGES_LABEL_MAP_TITLE: '分段标签专题图',
  THEME_RANGES_MAP_TITLE: '分段风格专题图',
  THEME_UNIQUE_VALUES_MAP_TITLE: '单值风格专题图',
  THEME_UNIQUE_VALUE_LABEL_MAP_TITLE: '单值标签专题图',
  RANGE: '段数',
  PREVIEW: '预览',
  CUSTOM_THEME_MAP: '自定义专题图',
  COLOR_PICKER: '色盘',
  USER_DEFINE: '用户自定义',

  DOT_VALUE: 'قيممة النقطة',
  GRADUATE_BY: 'تدرج بواسطة',
  DATUM_VALUE: 'قيمة البيان',
  RANGE_COUNT: 'عدد النطاق',

  // 外业采集 采集
  CREATE_WITH_SYMBOLS: 'أنشاء عرض الرمز',
  CREATE_WITH_TEMPLATE: 'أنشاء مع القالب',
  POINT_SYMBOL_LIBRARY: '点符号库',
  LINE_SYMBOL_LIBRARY: '线型符号库',
  REGION_SYMBOL_LIBRARY: '填充符号库',

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
  OBJMOVE: '对象平移',
  FREE_DRAW_ERASE: 'مسح رسم الحر',

  // 标绘
  PLOTTING: 'توقيع النقاط',
  PLOTTING_LIB_CHANGE: 'تغيير مكتبة توقيع النقاط',
  PLOTTING_LIB: 'مكتبه توقيع النقاط',
  PLOTTING_ANIMATION: 'استنتج',
  PLOTTING_ANIMATION_DEDUCTION: 'رسم الرسوم المتحركة',
  PLOTTING_ANIMATION_RESET: 'عادة تعيين',

  // 分享
  SHARE: 'مشاركة',
  SHARE_WECHAT: 'دردشة',
  SHARE_FRIENDS: 'أصدقاء',
  SHARE_EXPLORE: 'استكشف',

  MAO_ROAD_DISTRIBUTION: 'شبكة/الطرق',

  MAP_AR_DONT_SUPPORT_DEVICE: ' لا ندعم هذا الجهاز',
  MAP_AR_MEASURE: 'AR Measure', //待翻译
  MAP_AR_ANALYZE: 'AR Analyze', //待翻译
  MAP_AR_MAPPING: 'AR Mapping',
  MAP_AR_TOOL: 'AR Tool', //待翻译
  MAP_AR_CAMERA_EXCEPTION: 'الكاميرا غير طبيعية ، يرجى التحقق مما إذا كان الإذن مفتوحًا',
  MAP_AR_AI_ASSISTANT: 'AI\nCollect',
  MAP_AR_AI_ASSISTANT_CUSTOM_COLLECT: 'Custom Collect',
  MAP_AR_AI_ASSISTANT_MUNICIPAL_COLLECT: 'Municipal Collect',
  MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT: 'Violation Collect',
  MAP_AI_POSE_ESTIMATION: 'Pose Estimation', //待翻译
  MAP_AI_GESTURE_BONE: 'Gesture Bone', //待翻译
  MAP_AR_AI_ASSISTANT_ROAD_COLLECT: 'جمع الطرق',
  MAP_AR_AI_ASSISTANT_POI_COLLECT: 'خريطة نقاط الاهتمام',
  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT: 'قياس الذكاء الاصطناعى',
  MAP_AR_AI_ASSISTANT_CLASSIFY: 'تصنيف الهدف',
  MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT: 'Aggregate Collect',
  MAP_AR_AI_ASSISTANT_TARGET_COLLECT: 'جمع الهدف',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT: 'جمع عالي الدقة',
  MAP_AR_AI_ASSISTANT_ILLEGALLY_PARK_COLLECT: 'Illegally-Park Collect',
  MAP_AR_AI_ASSISTANT_CAST_MODEL_OPERATE: 'Cast Model',
  MAP_AR_AI_ASSISTANT_MEASURE_AREA: 'منطقة AR',
  MAP_AR_AI_ASSISTANT_MEASURE_LENGTH: 'تنظيم',
  MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE: 'رسم خط الواقع المعزز',
  MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA: 'صورة الواقع المعزز',
  MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT: 'نقاط رسم AR',
  MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT: 'نقاط رسم AR',
  MAP_AR_VIDEO: 'AR Video', //待翻译
  MAP_AR_IMAGE: 'AR Picture',
  MAP_AR_EFFECT: 'AR Effect',
  MAP_AR_WEBVIEW: 'AR WebPage',
  MAP_AR_TEXT: 'AR Text',
  MAP_AR_SELECT_EFFECT: 'Select Effect',
  MAP_AR_AI_ASSISTANT_NEWDATA: 'بيانات جديدة',
  MAP_AR_AI_ASSISTANT_SCENE_NEW_DATANAME: 'ادخل الاسم',
  MAP_AR_TO_CURRENT_POSITION: 'to Current', //待翻译
  MAP_AR_SELECT_POINT_PLANE: 'to Plane',
  MAP_AR_ADD_TO_CURRENT_POSITION: 'to Current',
  MAP_AR_ADD_TO_PLANE: 'Select Point',
  MAP_AR_MOVE_TO_CURRENT_POSITION: 'to Current',
  MAP_AR_MOVE_TO_PLANE: 'Select Point',

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

  // 待翻译
  MAP_AR_AI_SAVE_REGION: 'Save Region',
  MAP_AR_AI_SCENE_TRACK_COLLECT: 'Track Collect',
  MAP_AR_AI_SCENE_POINT_COLLECT: 'Point Collect',
  MAP_AR_AI_SCENE_POINT_COLLECT_CLICK_HINT: 'Click the screen to determine the current point',

  MAP_AR_AI_MEASURE_LENGTH: 'قياس الطول',
  MAP_AR_AI_MEASURE_AREA: 'منطقة القياس',
  MAP_AI_POSE_ESTIMATION_ZOOM: 'Pose Zoom', //待翻译
  MAP_AI_POSE_ESTIMATION_PAN: 'Pose Pan', //待翻译
  MAP_AI_POSE_ESTIMATION_OVERLOOK: 'Pose Overlook', //待翻译
  MAP_AI_POSE_ESTIMATION_LOOK: 'Pose Look', //待翻译
  MAP_AI_POSE_ESTIMATION_SWITCH_CAMERA: 'Switch Camera', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION: 'Association Map', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_CANCEL: 'Association Cancel', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_UP: 'Up', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_DOWN: 'Down', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_LEFT: 'Left', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_RIGHT: 'Right', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_SHRINK: 'Shrink', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_MAGNIFY: 'Magnify', //待翻译
  MAP_AI_GESTURE_BONE_DETAIL: 'Gesture detail', //待翻译
  MAP_AI_GESTURE_BONE_CLOSE: 'Close', //待翻译

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
  MAP_INDOOR_NETWORK: 'Indoor', //待翻译
  MAP_OUTDOOR_NETWORK: 'Outdoor',

  MAP_INCREMENT_START: 'Start',
  MAP_INCREMENT_STOP: 'Stop',
  MAP_INCREMENT_ADD_POINT: 'Add point',
  MAP_INCREMENT_CANCEL: 'Cancel',
  MAP_INCREMENT_COMMIT: 'Commit',

  MAP_INCREMENT_GPS_POINT: 'Collect Points by GPS',
  MAP_INCREMENT_GPS_TRACK: 'Collect Line by GPS',
  MAP_INCREMENT_POINTLINE: 'Point Draw',
  MAP_INCREMENT_FREELINE: 'Free Draw',

  MAP_TOPO_ADD_NODE: 'Add Node',
  MAP_TOPO_EDIT_NODE: 'Edit node',
  MAP_TOPO_DELETE_NODE: 'Delete node',
  MAP_TOPO_DELETE_OBJECT: 'Delete object',
  MAP_TOPO_SMOOTH: 'Smooth',
  MAP_TOPO_SPLIT_LINE: 'Line Split',
  MAP_TOPO_SPLIT: 'Interrupt',
  MAP_TOPO_EXTEND: 'Extend',
  MAP_TOPO_TRIM: 'Trim',
  MAP_TOPO_RESAMPLE: 'Re-sampling',
  MAP_TOPO_CHANGE_DIRECTION: 'Change Direction',
  ADD_DATASET: 'Append Dataset',
  SELECT_ROADNAME_FIELD: 'Select the Road Name Field',
  SELECT_FIELD: 'Select Field',
  MERGE_CANCEL: 'Cancel',
  MERGE_CONFIRM: 'Confirm',
  MERGE_SELECT_ALL: 'Select All',
  MERGE_ADD: 'Append',
  MERGE_DATASET: 'Merge Datasets',
}

// 推演动画
const Map_Plotting = {
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
const Map_Layer = {
  PLOTS: 'علامة',
  PLOTS_IMPORT: 'استيراد علامات',
  PLOTS_DELETE: 'حذف علامات',
  PLOTS_EDIT: '编辑标注',
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
  LAYER_NONE: '无',
  LAYERS_SET_AS_CURRENT_SCALE: 'تعيين كمقياس حالى',
  LAYERS_CLEAR: 'مسح',
  LAYERS_LAYER_NAME: 'اسمم الطبقة',
  LAYERS_COMPLETE_LINE: 'خط كامل',
  LAYERS_OPTIMIZE_CROSS: 'Optimize Cross',
  LAYERS_ANTIALIASING: 'Antialiasing',
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
  SNAPABLE: 'Snapable',
  NOT_SNAPABLE: 'Not Snapable',
  // 专题图图层
  LAYERS_CREATE_THEMATIC_MAP: 'أنشاء خريطة موضوعية',
  LAYERS_MODIFY_THEMATIC_MAP: 'تعديل خريطة موضوعية',

  BASEMAP: 'خريطة الأساس الخاصة بي',
  BASEMAP_SWITH: 'تبديل خريطة الأساس',
  MY_TERRAIN: 'تضاريس بلادي',

  //待翻译
  SCALE_TO_CURRENT_LAYER: 'Scale to the current layer',
  ADD_A_TERRAIN_LAYER: 'Add a terrain layer',
  ADD_A_IMAGE_LAYER: 'Add a image layer',
  REMOVE_THE_CURRENT_LAYER: 'Remove the current layer',
  ONLINE_BASE_MAP: 'Online BaseMap',
  ADD_LAYER_URL: 'Add Layer Url',
  TERRAIN: 'Terrain',
  IMAGE: 'Image',
  IS_ADD_NOTATION_LAYER: 'Do you want to add the notation layer', //待翻译

  LAYER_SETTING_IMAGE_DISPLAY_MODE: 'Display Mode', //待翻译
  LAYER_SETTING_IMAGE_STRETCH_TYPE: 'Stretch Type',
  DISPLAY_MODE_COMPOSITE: 'Composite',
  DISPLAY_MODE_STRETCHED: 'Stretched',
  STRETCH_TYPE_NONE: 'None',
  STRETCH_TYPE_STANDARDDEVIATION: 'Standard Deviation',
  STRETCH_TYPE_MINIMUMMAXIMUM: 'Minimun Maximum',
  STRETCH_TYPE_HISTOGRAMEQUALIZATION: 'Histogram Equalization',
  STRETCH_TYPE_HISTOGRAMSPECIFICATION: 'Histogram Specification',
  STRETCH_TYPE_GAUSSIAN: 'Gaussian',
}

// 属性
const Map_Attribute = {
  ATTRIBUTE_SORT: 'ترتيب',
  ATTRIBUTE_LOCATION: 'موقع',
  ATTRIBUTE_CANCEL: '取消',
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
  ATTRIBUTE_ADD: '添加属性',
  ATTRIBUTE_DETAIL: '属性详情',
  REQUIRED: '必填',
  NAME: 'اسم',
  TYPE: 'نوع',
  LENGTH: '长度',
  DEFAULT: '缺省值',
  CONFIRM_ADD: '确认',

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
const Map_Setting = {
  BASIC_SETTING: 'الاعدادات الاساسية',
  ROTATION_GESTURE: 'Rotation Gesture',
  PITCH_GESTURE: 'Pitch Gesture',
  THEME_LEGEND: 'عنوان تفسيرى للموضوع',
  COLUMN_NAV_BAR: '横屏时纵向显示导航栏',
  REAL_TIME_SYNC: '实时同步',

  // 效果设置
  EFFECT_SETTINGS: 'اعدات التاثير',
  ANTI_ALIASING_MAP: 'Anti-aliasing Map',
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
const Map_Settings = {
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

  // 视频地图设置	一级菜单
  POI_SETTING: 'اعدادات نقاط الاهتمام',
  DETECT_TYPE: 'كشف الأنواع',
  DETECT_STYLE: 'كشف الشكل',

  POI_SETTING_PROJECTION_MODE: 'وضع الإسقاط',
  POI_SETTING_OVERLAP_MODE: 'وضع التداخل',
  POI_SETTING_POLYMERIZE_MODE: 'Polymerize Mode',

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
  ROTATION_GESTURE: 'Rotation Gesture',
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
  LEFT: 'شمال',
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
  BASIC_PARAMS: 'Basic Params',
  OFFSET: 'Offset',
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
}

// 地图工具
const Map_Tools = {
  VIDEO: 'فيديو',
  PHOTO: 'صورة',
  AUDIO: 'صوت',

  TAKE_PHOTO: 'التقاط الصورة',
  FROM_ALBUM: 'اختر من الالبوم',
  VIEW: 'عرض',
}

// POI title
const Map_PoiTitle = {
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
const Template = {
  COLLECTION_TEMPLATE_MANAGEMENT: 'Template Management', // 待翻译
  COLLECTION_TEMPLATE_CREATE: 'Create Template',
  COLLECTION_TEMPLATE_NAME: 'Template Name',
  ELEMENT_SETTINGS: 'Element Settings',
  ELEMENT_STORAGE: 'Element Storage',
  ATTRIBUTE_SETTINGS: 'Attribute Settings',
  CURRENT_TEMPLATE: 'Current',
  DEFAULT_TEMPLATE: 'Default Template',

  ELEMENT_NAME: 'Element Name',
  ELEMENT_CODE: 'Element Code',

  CREATE_ROOT_NODE: 'Create Root Node',
  CREATE_CHILD_NODE: 'Create Chile Node',
  INSERT_NODE: 'Insert Node',

  TEMPLATE_ERROR: 'Can not use the Template while the map not be saved',
}

export { Map_Main_Menu, Map_Label, Map_Layer, Map_Plotting, Map_Attribute, Map_Setting, Map_Settings, Map_Tools, Map_PoiTitle, Template }
