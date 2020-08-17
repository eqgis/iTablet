// 提示语
const Prompt = {
  YES: 'نعم',
  NO: 'لا',
  SAVE_TITLE: 'هل تريد حفظ التغييرات على الخريطة الحالية؟',
  SAVE_YES: 'نعم',
  SAVE_NO: 'لا',
  CANCEL: 'الغاء',
  COMMIT: 'Commit',
  REDO: 'إعادة',
  UNDO: 'الغاء',
  SHARE: 'مشاركة',
  DELETE: 'حذف',
  WECHAT: 'دردشه',
  BEGIN: 'ابدأ',
  STOP: 'توقف',
  FIELD_TO_PAUSE: 'فشل الإيقاف المؤقت',
  WX_NOT_INSTALLED: 'دردشة غير مثبت',
  WX_SHARE_FAILED: 'فشلت مشاركة الدردشة,من فضلك تأكد من تثبيت الدردشة',
  RENAME: 'اعادة التسمية',
  BATCH_DELETE: 'حذف الدفعة',
  PREPARING: '准备中',

  DOWNLOAD_SAMPLE_DATA: 'تنزيل البيانات النموذجية؟',
  DOWNLOAD: 'تنزيل',
  DOWNLOADING: 'تحميل',
  DOWNLOAD_SUCCESSFULLY: 'تم',
  DOWNLOAD_FAILED: 'فشل فى التنزيل',
  UNZIPPING: '解压中',

  NO_REMINDER: 'لا يوجد تذكير',

  LOG_OUT: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
  FAILED_TO_LOG: 'فشل فى تسجيل الدخول',
  INCORRECT_USER_INFO: 'الحساب غير موجود أو خطأ كلمة المرور',
  INCORRECT_IPORTAL_ADDRESS: 'فشل فى تسجيل الدخول,من فضلك تحقق من عنوان اليرفر الخاص بك',

  DELETE_STOP: 'هل أنت متأكد أنك تريد حذف التوقف؟',
  DELETE_OBJECT: 'هل أنت متأكد من أنك تريد حذف الكائن نهائيًا؟',
  PLEASE_ADD_STOP: '请添加站点',

  CONFIRM: 'تأكيد',
  COMPLETE: 'اكتمال',

  OPENING: 'جارى الفتح',

  QUIT: 'الخروج من سوبر ماب تابلت',
  MAP_LOADING: 'تحميل',
  LOADING: 'تحميل',
  THE_MAP_IS_OPENED: 'تم فتح الخريطة',
  THE_SCENE_IS_OPENED: 'تم فتح المشهد',
  NO_SCENE_LIST: 'لاتوجد بيانات',
  SWITCHING: 'تبديل',
  CLOSING: 'إغلاق',
  CLOSING_3D: 'إغلاق',
  SAVING: 'حفظ',
  SWITCHING_SUCCESS: 'التبديل بنجاح',
  ADD_SUCCESS: 'اضيف بنجاح',
  ADD_FAILED: 'فشلت الاضافة',
  ADD_MAP_FAILED: 'لا يمكن إضافة الخريطة الحالية',
  CREATE_THEME_FAILED: 'فشل فى انشاء موضوع',
  PLEASE_ADD_DATASET: 'من فضلك اضف مجموعه البيانات',
  PLEASE_SELECT_OBJECT: 'من فضلك حدد الكائن لتعدديله',
  SWITCHING_PLOT_LIB: 'تبديل',
  NON_SELECTED_OBJ: 'لم يتم اختيار كائن',
  CHANGE_BASE_MAP: 'خريطة أساسية فارغة ، يرجى التغيير أولاً ',
  OVERRIDE_SYMBOL: 'Do you want to override the symbol with same id?', //待翻译

  SET_ALL_MAP_VISIBLE: 'كل شيء مرئي',
  SET_ALL_MAP_INVISIBLE: 'كل شىء غير مرئلى',
  LONG_PRESS_TO_SORT: '(اضط طويلا للترتيب)',

  PUBLIC_MAP: 'خريطة عامة',
  SUPERMAP_FORUM: 'منتدى سوبرماب',
  SUPERMAP_KNOW: 'تعرف على سوبرماب',
  SUPERMAP_GROUP: 'مجموعة سوبرماب',
  INSTRUCTION_MANUAL: 'كتيب التعليمات',
  THE_CURRENT_LAYER: 'الطبقة الحالية تكون',
  ENTER_KEY_WORDS: 'يرجى إدخال الكلمات الرئيسية',
  SEARCHING: 'جارى البحث',
  SEARCHING_DEVICE_NOT_FOUND: '未能搜索到外部设备',
  READING_DATA: 'جارى قراءه البيانات',
  CREATE_SUCCESSFULLY: 'تم إنشاؤه بنجاح',
  SAVE_SUCCESSFULLY: 'حفظ بنجاح',
  NO_NEED_TO_SAVE: 'لا حاجة للحفظ',
  SAVE_FAILED: 'فشل الحفظ',
  ENABLE_DYNAMIC_PROJECTION: 'هل تريد تفعيل العرض الديناميكي؟',
  TURN_ON: 'شغل',
  CREATE_FAILED: 'فشل إنشاء',
  INVALID_DATASET_NAME: 'اسم مجموعة بيانات غير صالح أو الاسم موجود بالفعل',

  NO_PLOTTING_DEDUCTION: 'لا يوجد رسم تخطيطي في الخريطة الحالية',
  NO_FLY: 'لايوجد طيران فى المشهد الحالى',
  PLEASE_OPEN_SCENE: 'من فضلك افتح المشهد',
  NO_SCENE: 'لا يوجد مشهد',
  ADD_ONLINE_SCENE: 'Add Online Scene', //待翻译

  PLEASE_ENTER_TEXT: 'من فضلك ادخل النص',
  PLEASE_SELECT_THEMATIC_LAYER: 'من فضلك اختر طبقة موضوعية',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED: 'لا يمكن تصميم الطبقة الحالية ، والرجاء إعادة تحديد طبقة أخرى',

  PLEASE_SELECT_PLOT_LAYER: 'يرجى تحديد طبقة الرسم',
  DONOT_SUPPORT_ARCORE: 'هذا الجهاز لايدعم كور عربى',
  PLEASE_NEW_PLOT_LAYER: 'من فضلك أنشىء طبقة نقاط جديدة',
  DOWNLOADING_PLEASE_WAIT: 'من فضلك انتظر جارى التنزيل',
  SELECT_DELETE_BY_RECTANGLE: 'الرجاء تحديد حذف العنصر عن طريق تحديد المستطيل',

  CHOOSE_LAYER: 'اختر الطبقة',

  COLLECT_SUCCESS: 'جمع ناجح',

  SELECT_TWO_MEDIAS_AT_LEAST: 'يجب عليك اختيار وسيلتين على الأقل',

  NETWORK_REQUEST_FAILED: 'فشل طلب الشبكة',

  SAVEING: 'جارى الحفظ',
  CREATING: 'جارى الانشاء',
  PLEASE_ADD_DATASOURCE: 'من فضلك اضف مجموعه البيانات',
  NO_ATTRIBUTES: 'لايوجد جدول بيانات',
  NO_SEARCH_RESULTS: 'لايوجد نتائج بحث',

  READING_TEMPLATE: 'قالب القراءة',
  SWITCHED_TEMPLATE: 'تبديل القالب',
  THE_CURRENT_SELECTION: 'الاختيار الحالى هو',
  THE_LAYER_DOES_NOT_EXIST: '该图层不存在',

  IMPORTING_DATA: 'استيراد البيانات',
  DATA_BEING_IMPORT: 'يتم استيراد البيانات',
  IMPORTING: 'جارى الاستيراد',
  IMPORTED_SUCCESS: 'تم الاستيراد بنجاح',
  FAILED_TO_IMPORT: 'فشل الاستيراد',
  IMPORTED_3D_SUCCESS: 'تم الاستيراد بنجاح',
  FAILED_TO_IMPORT_3D: 'فشل الاستيراد',
  DELETING_DATA: 'جارى حذف البيانات',
  DELETING_SERVICE: 'جارى حذف الخدمة',
  DELETED_SUCCESS: 'تم الحذف بنجاح',
  FAILED_TO_DELETE: 'فشل الحذف',
  PUBLISHING: 'جارى النشر',
  PUBLISH_SUCCESS: 'تم النشر بنجاج',
  PUBLISH_FAILED: 'فشل النشر',
  DELETE_CONFIRM: 'هل أنت متأكد أنك تريد حذف العنصر؟',
  BATCH_DELETE_CONFIRM: 'هل أنت متأكد من أنك تريد حذف العنصر (العناصر) المحددة؟',

  SELECT_AT_LEAST_ONE: 'يرجى تحديد عنصر واحد على الأقل',
  DELETE_MAP_RELATE_DATA: 'سوف تتأثر الخريطة (الخرائط) التالية ، هل تريد المتابعة؟',

  LOG_IN: 'جارى التحميل',
  ENTER_MAP_NAME: 'من فضلك ادخل اسم الخريطة',
  CLIP_ENTER_MAP_NAME: 'ادخل اسم الخريطة',
  ENTER_SERVICE_ADDRESS: 'من فضلك ادخل عنوان الخدمة',
  ENTER_ANIMATION_NAME: 'من فضلك ادخل اسم الرسوم المتحركة',
  ENTER_ANIMATION_NODE_NAME: 'من فضلك ادخل اسم عقدة الرسوم المتحركة',
  PLEASE_SELECT_PLOT_SYMBOL: 'من فضلك اختر رمز النقط',

  ENTER_NAME: 'من فضلك ادخل الاسم',

  CLIPPING: 'جارى القطع',
  CLIPPED_SUCCESS: 'تم القطع بنجاح',
  CLIP_FAILED: 'فشل فى القطع',

  LAYER_CANNOT_CREATE_THEMATIC_MAP: 'الخريطة الحالية لايمكن استخدمها فى امشاء خريطة موضوعية',

  ANALYSING: 'جارى التحليل',
  CHOOSE_STARTING_POINT: 'اختر نقطة البداية',
  CHOOSE_DESTINATION: 'اختر وجهة',

  LATEST: 'الاخير',
  GEOGRAPHIC_COORDINATE_SYSTEM: 'نظام الاحداثيات الجغرافية',
  PROJECTED_COORDINATE_SYSTEM: 'نظام الاحداثيات المسقط',
  FIELD_TYPE: 'نوع الحقل',

  PLEASE_LOGIN_AND_SHARE: 'من فضك ادخل وشارك',
  PLEASE_LOGIN: '请登录',
  SHARING: 'جارى المشاركة',
  SHARE_SUCCESS: 'تم المشاركة بنجاح',
  SHARE_FAILED: 'فشل فى المشاركة',
  SHARE_PREPARE: 'جارى التجهيز للمشاركة',
  SHARE_START: 'بدء المشاركة',

  EXPORTING: 'جارى التصدير',
  EXPORT_SUCCESS: 'تم التصدير بنجاح',
  EXPORT_FAILED: 'فشل التصدير',
  EXPORT_TO: 'تم تصدير البيانات إلى',
  REQUIRE_PRJ_1984: 'PrjCoordSys of the dataset must be WGS_1984',

  UNDO_FAILED: 'فشل التراجع',
  REDO_FAILED: 'فشل الإعادة',
  RECOVER_FAILED: 'فشل الاسترداد',

  SETTING_SUCCESS: 'تم التعيين بنجاح',
  SETTING_FAILED: 'فشل التعيين',
  NETWORK_ERROR: 'خطأ فى الشبكة',
  NO_NETWORK: 'لايوجد اتصال بالانترنت',
  CHOOSE_CLASSIFY_MODEL: 'اختر تصنيف النموذج',
  USED_IMMEDIATELY: 'تستخدم على الفور',
  USING: 'جارى الاستخدام',
  DEFAULT_MODEL: 'النموذج الافتراضي',
  DUSTBIN_MODEL: 'نموذج سلة المهملات',
  PLANT_MODEL: '植物模型',
  CHANGING: 'جارى التغيير',
  CHANGE_SUCCESS: 'تم التغيير بنجاح',
  CHANGE_FAULT: 'تغيير الخطأ',
  DETECT_DUSTBIN_MODEL: 'نموذج سلة المهملات',
  ROAD_MODEL: 'نموذج الطريق',

  LICENSE_EXPIRED: 'انتهت صلاحية الرخصة التجريبة.هل تريد متابعه التجريبى؟',
  APPLY_LICENSE: 'طبق الرخصة',
  APPLY_LICENSE_FIRST: 'يرجى تطبيق ترخيص صالح أولا',

  GET_LAYER_GROUP_FAILD: 'فشل في الحصول على مجموعة الطبقات',
  TYR_AGAIN_LATER: 'من فضلك حاول مره اخرى لاحقا',

  LOCATING: 'الموقع',
  CANNOT_LOCATION: 'فشل في تحديد الموقع',
  INDEX_OUT_OF_BOUNDS: 'مؤشر خارج الحدود',
  PLEASE_SELECT_LICATION_INFORMATION: 'يرجى إعداد الموقع',
  OUT_OF_MAP_BOUNDS: 'خارج حدود الخريطة',
  CANT_USE_TRACK_TO_INCREMENT_ROAD: 'الموقع الحالي خارج حدود الخريطة بحيث لا يمكنك استخدام التتبع لزيادة الطريق',

  POI: 'نقاط الاهتمام',

  ILLEGAL_DATA: 'بيانات غير قانونية',

  UNSUPPORTED_LAYER_TO_SHARE: 'لم يتم دعم مشاركة هذه الطبقة بعد',
  SELECT_DATASET_TO_SHARE: 'يرجى تحديد مجموعة البيانات للمشاركة',
  ENTER_DATA_NAME: 'يرجى إدخال اسم البيانات',
  SHARED_DATA_10M: 'لا يمكن مشاركة الملف الذي يزيد حجمه عن 10 ميغابايت',

  PHIONE_HAS_BEEN_REGISTERED: 'رقم الهاتف المحمول مسجل',
  NICKNAME_IS_EXISTS: 'اسم المستخدم موجود بالفعل',
  VERIFICATION_CODE_ERROR: 'رمز التحقق غير صحيح أو غير صالح',
  VERIFICATION_CODE_SENT: 'تم إرسال رمز التحقق',
  EMAIL_HAS_BEEN_REGISTERED: 'البريد الإلكتروني مسجل',
  REGISTERING: 'التسجيل',
  REGIST_SUCCESS: 'مسجل بنجاح',
  REGIST_FAILED: 'فشل في تسجيل',
  GOTO_ACTIVATE: 'يرجى تنزيل الترخيص التجريبي إلى صندوق البريد',
  ENTER_CORRECT_MOBILE: 'الرجاء إدخال رقم الهاتف المحمول الصحيح',
  ENTER_CORRECT_EMAIL: 'يرجى إدخال عنوان البريد الإلكتروني الصحيح',

  // 设置菜单提示信息
  ROTATION_ANGLE_ERROR: 'يجب أن تكون زاوية الدوران بين -360 ° و 360 °',
  MAP_SCALE_ERROR: 'خطأ في إدخال البيانات! الرجاء إدخال رقم',
  VIEW_BOUNDS_ERROR: 'خطأ في النطاق! الرجاء إدخال رقم',
  VIEW_BOUNDS_RANGE_ERROR: 'خطأ في القياسات! يجب أن يكون ارتفاع وعرض الرؤية أكبر من الصفر ',
  MAP_CENTER_ERROR: 'خطأ في التنسيق! يجب أن يكون كل من س و ص أرقامًا',
  COPY_SUCCESS: 'النسخ ناجح',
  // 复制坐标系
  COPY_COORD_SYSTEM_SUCCESS: 'تكرار نظام الاحداثيات بنجاح',
  COPY_COORD_SYSTEM_FAIL: 'فشل تكرار نظام الاحداثيات',
  ILLEGAL_COORDSYS: 'لا ندعم ملف نظام الاحداثيات',

  TRANSFER_PARAMS: 'خطأ قياس! الرجاء إدخال رقم',
  PLEASE_ENTER: 'من فضلك ادخل',

  REQUEST_TIMEOUT: 'طلب مهلة',

  IMAGE_RECOGNITION_ING: 'جارى التحميل',
  IMAGE_RECOGNITION_FAILED: 'فشل التعرف على الصورة',

  ERROR_INFO_INVALID_URL: 'عنوان غير صالح',
  ERROR_INFO_NOT_A_NUMBER: 'هذا ليس رقمًا',
  ERROR_INFO_START_WITH_A_LETTER: 'يمكن أن يبدأ الاسم بحرف فقط',
  ERROR_INFO_ILLEGAL_CHARACTERS: 'لا يمكن أن يحتوي الاسم على أحرف غير قانونية',
  ERROR_INFO_EMPTY: 'لا يمكن أن يكون الاسم فارغًا',

  OPEN_LOCATION: 'يرجى فتح خدمة الموقع في إعداد النظام',
  REQUEST_LOCATION: 'يحتاج التابلت الذكى إلى إذن الموقع لإكمال الإجراء',
  LOCATION_ERROR: 'فشل طلب الموقع ، يرجى المحاولة مرة أخرى في وقت لاحق',

  OPEN_THRID_PARTY: 'أنت ستفتح تطبيقًا من ثلاثين طرفًا ، هل تريد المتابعة؟',

  FIELD_ILLEGAL: 'الحقل غير قانونى',
  PLEASE_SELECT_A_RASTER_LAYER: 'يرجى تحديد طبقة البيانات النقطية',

  PLEASE_ADD_DATASOURCE_BY_UNIFORM: 'من فضلك اض مجموعه بيانات بشكل موحد',
  CURRENT_LAYER_DOSE_NOT_SUPPORT_MODIFICATION: 'لا تدعم الطبقة الحالية التعديل',

  FAILED_TO_CREATE_POINT: 'فشل في إنشاء نقطة',
  FAILED_TO_CREATE_TEXT: 'فشل إنشاء النص',
  FAILED_TO_CREATE_LINE: 'فشل إنشاء الخط',
  FAILED_TO_CREATE_REGION: 'فشل في إنشاء المنطقة',
  CLEAR_HISTORY: 'تاريخ واضح',
  // 导航相关
  SEARCH_AROUND: 'ابحث حولها',
  GO_HERE: 'اذهب الى هنا',
  SHOW_MORE_RESULT: 'إظهار المزيد من النتائج',
  PLEASE_SET_BASEMAP_VISIBLE: 'يرجى تعيين خريطة الأساس مرئية',
  NO_NETWORK_DATASETS: 'لا تحتوي مساحة العمل الحالية على مجموعة بيانات الشبكة',
  NO_LINE_DATASETS: 'لا تحتوي مساحة العمل الحالية على مجموعة بيانات الخط',
  NETWORK_DATASET_IS_NOT_AVAILABLE: 'محموعة بيانات الشبكة الحاليةغير متاحة',
  POINT_NOT_IN_BOUNDS: 'لا تحتوي حدود مجموعة بيانات الشبكة المحددة على النقطة',
  POSITION_OUT_OF_MAP: 'موقعك خارج حدود الخريطة ، يرجى استخدام محاكاة التنقل',
  SELECT_DATASOURCE_FOR_NAVIGATION: 'حدد البيانات للملاحة',
  PLEASE_SELECT_NETWORKDATASET: 'حدد مجموعة بيانات الشبكة أولاً',
  PLEASE_SELECT_A_POINT_INDOOR: 'يرجى تحديد نقطة داخلية',
  PATH_ANALYSIS_FAILED: 'فشل تحليل المسار! يرجى إعادة تحديد نقطتي البداية والنهاية',
  ROAD_NETWORK_UNLINK: 'فشل تحليل المسار بسبب انقطاع شبكة الطرق من نقطة البداية إلى نقطة النهاية',
  CHANGE_TO_OUTDOOR: '是否切换到室外？',
  CHANGE_TO_INDOOR: '是否切换到室内？',
  SET_START_AND_END_POINTS: 'يرجى تعيين نقطتي البداية والنهاية أولاً',
  SELECT_LAYER_NEED_INCREMENTED: 'يرجى تحديد الطبقة التي تحتاج إلى زيادة',
  SELECT_THE_FLOOR: 'يرجى تحديد الطابق التي تقع فيها الطبقة',
  LONG_PRESS_ADD_START: 'يرجى الضغط لفترة طويلة لإضافة نقطة البداية',
  LONG_PRESS_ADD_END: 'يرجى الضغط لفترة طويلة لإضافة وجهة',
  ROUTE_ANALYSING: 'جارى التحليل',
  DISTANCE_ERROR: 'الوجهة قريبة جدًا من نقطة البداية ، يرجى إعادة التحديد',
  USE_ONLINE_ROUTE_ANALYST: 'النقاط خارج حدود مجموعة البيانات أو لا توجد مجموعة بيانات حول النقاط ، هل تريد استخدام محلل المسار عبر الإنترنت؟',
  NOT_SUPPORT_ONLINE_NAVIGATION: 'التنقل عبر الإنترنت غير متاح حتى الآن',
  CREATE: '新建',
  NO_DATASOURCE: '当前工作空间无数据源，请先新建数据源',
  FLOOR: 'Floor', //待翻译
  AR_NAVIGATION: 'AR Navi',
  ARRIVE_DESTINATION: 'Arrived the destination',
  DEVIATE_NAV_PATH: 'Deviated from the navigation path',

  //导航增量路网
  SELECT_LINE_DATASET: '请先选择一个线数据集',
  CANT_UNDO: '无法撤销',
  CANT_REDO: '无法重做',
  DATASET_RENAME_FAILED: '数据集名称只能包含字母、数字和"_"、"@"、"#"',
  SWITCH_LINE: '切换数据',
  HAS_NO_ROADNAME_FIELD_DATA: '存在未选择道路名称字段信息的数据集',
  MERGE_SUCCESS: '合并成功',
  MERGE_FAILD: '合并失败',
  NOT_SUPPORT_PRJCOORDSYS: '以下数据集的坐标系不支持合并',
  MERGEING: '合并中',
  HAS_NO_ROADNAME_FIELD_DATA_DIALOG: '存在不包含RoadName字段的数据集,请选择以下数据集的道路名称字段',
  NEW_NAV_DATA: '创建导航数据',
  INPUT_MODEL_FILE_NAME: '请输入模型文件名称',
  INCREMENT_FIRST: '请先采集路网数据',
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

  SPEECH_TIP: 'يمكنك أن تقول',
  SPEECH_ERROR: 'التعرف على الخطأ ، يرجى المحاولة مرة أخرى في وقت لاحق',
  SPEECH_NONE: 'لا يبدو أنك تتحدث أي شيء',

  NOT_SUPPORT_STATISTIC: 'الحقل لا يدعم الإحصاء',
  ATTRIBUTE_DELETE_CONFIRM: 'هل تريد بالتأكيد حذف حقل البيانات  هذا؟',
  ATTRIBUTE_DELETE_TIPS: 'لا يمكن استرداده بعد حذف البيانات',
  ATTRIBUTE_DELETE_SUCCESS: 'تم حذف حقل البيانات بنجاح',
  ATTRIBUTE_DELETE_FAILED: 'فشل حذف حقل البيانات',
  ATTRIBUTE_ADD_SUCCESS: 'تم اضافه البيانات بنجاج',
  ATTRIBUTE_ADD_FAILED: 'فشل اضافه البيانات',
  ATTRIBUTE_DEFAULT_VALUE_IS_NULL: 'القيمة الافتراضية خالية',

  CANNOT_COLLECT_IN_THEMATIC_LAYERS: '专题图层不能采集',
  HEAT_MAP_DATASET_TYPE_ERROR: '只有点数据集可以创建',
}

export { Prompt }
