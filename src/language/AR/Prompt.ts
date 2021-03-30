import CN from '../CN'

// 提示语
const Prompt: typeof CN.Prompt = {
  YES: 'نعم',
  NO: 'لا',
  SAVE_TITLE: 'هل تريد حفظ التغييرات على الخريطة الحالية؟',
  SAVE_YES: 'نعم',
  SAVE_NO: 'لا',
  CANCEL: 'الغاء',
  COMMIT: 'إرسال',
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
  PREPARING: 'خطة',

  DOWNLOAD_SAMPLE_DATA: 'تنزيل البيانات النموذجية؟',
  DOWNLOAD_DATA: 'تنزيل البيانات',
  DOWNLOAD: 'تنزيل',
  DOWNLOADING: 'تحميل',
  DOWNLOAD_SUCCESSFULLY: 'تم',
  DOWNLOAD_FAILED: 'فشل فى التنزيل',
  UNZIPPING: 'فك الضغط',
  ONLINE_DATA_ERROR: 'بيانات الشبكة تالفة ولا يمكن استخدامها بشكل طبيعي',

  NO_REMINDER: 'لا يوجد تذكير',

  LOG_OUT: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
  FAILED_TO_LOG: 'فشل فى تسجيل الدخول',
  INCORRECT_USER_INFO: 'الحساب غير موجود أو خطأ كلمة المرور',
  INCORRECT_IPORTAL_ADDRESS: 'فشل فى تسجيل الدخول,من فضلك تحقق من عنوان اليرفر الخاص بك',

  DELETE_STOP: 'هل أنت متأكد أنك تريد حذف التوقف؟',
  DELETE_OBJECT: 'هل أنت متأكد من أنك تريد حذف الكائن نهائيًا؟',
  PLEASE_ADD_STOP: 'الرجاء إضافة نقطة',

  CONFIRM: 'تأكيد',
  COMPLETE: 'اكتمال',

  NO_PERMISSION_ALERT: 'التطبيق ليس لديه أذونات كافية للتشغيل',
  EXIT: 'خروج',
  REQUEST_PERMISSION: 'طلب',

  OPENING: 'جارى الفتح',

  QUIT: 'الخروج من سوبر ماب تابلت',
  MAP_LOADING: 'تحميل',
  LOADING: 'تحميل',
  THE_MAP_IS_OPENED: 'تم فتح الخريطة',
  THE_MAP_IS_NOTEXIST: 'الخريطة غير موجودة',
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
  OVERRIDE_SYMBOL: 'يوجد رمز بنفس المعرف ، يرجى تحديد طريقة للإضافة',
  OVERWRITE: 'الكتابة فوق',
  CHOOSE_DATASET: 'الرجاء اختيار مجموعة البيانات',

  PLEASE_SUBMIT_EDIT_GEOMETRY: 'Please Submit Current Geometry',//need to translate

  SET_ALL_MAP_VISIBLE: 'كل شيء مرئي',
  SET_ALL_MAP_INVISIBLE: 'كل شىء غير مرئلى',
  LONG_PRESS_TO_SORT: '(اضط طويلا للترتيب)',

  PUBLIC_MAP: 'خريطة عامة',
  SUPERMAP_FORUM: 'منتدى سوبرماب',
  SUPERMAP_KNOW: 'تعرف على سوبرماب',
  SUPERMAP_GROUP: 'مجموعة سوبرماب',
  INSTRUCTION_MANUAL: 'كتيب التعليمات',
  THE_CURRENT_LAYER: 'الطبقة الحالية تكون',
  NO_BASE_MAP: 'No base map can be removed', // need to translate
  ENTER_KEY_WORDS: 'يرجى إدخال الكلمات الرئيسية',
  SEARCHING: 'جارى البحث',
  SEARCHING_DEVICE_NOT_FOUND: 'لا يوجد جهاز',
  READING_DATA: 'جارى قراءه البيانات',
  CREATE_SUCCESSFULLY: 'تم إنشاؤه بنجاح',
  SAVE_SUCCESSFULLY: 'حفظ بنجاح',
  NO_NEED_TO_SAVE: 'لا حاجة للحفظ',
  SAVE_FAILED: 'فشل الحفظ',
  ENABLE_DYNAMIC_PROJECTION: 'هل تريد تفعيل العرض الديناميكي؟',
  TURN_ON: 'شغل',
  CREATE_FAILED: 'فشل إنشاء',
  INVALID_DATASET_NAME: 'اسم مجموعة بيانات غير صالح أو الاسم موجود بالفعل',

  PLEASE_CHOOSE_POINT_LAYER: 'Please Choose Point Layer',//need to translate
  PLEASE_CHOOSE_LINE_LAYER: 'Please Choose Line Layer',//need to translate
  PLEASE_CHOOSE_REGION_LAYER: 'Please Choose Region Layer',//need to translate

  NO_PLOTTING_DEDUCTION: 'لا يوجد رسم تخطيطي في الخريطة الحالية',
  NO_FLY: 'لايوجد طيران فى المشهد الحالى',
  PLEASE_OPEN_SCENE: 'من فضلك افتح المشهد',
  NO_SCENE: 'لا يوجد مشهد',
  ADD_ONLINE_SCENE: 'أضف مشهدًا عبر الإنترنت',

  PLEASE_ENTER_TEXT: 'من فضلك ادخل النص',
  PLEASE_SELECT_THEMATIC_LAYER: 'من فضلك اختر طبقة موضوعية',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED: 'لا يمكن تصميم الطبقة الحالية ، والرجاء إعادة تحديد طبقة أخرى',

  PLEASE_SELECT_PLOT_LAYER: 'يرجى تحديد طبقة الرسم',
  DONOT_SUPPORT_ARCORE: 'وظائف AR غير متوفرة على هذا الجهاز',
  GET_SUPPORTED_DEVICE_LIST: 'عرض قائمة الأجهزة المدعومة',
  PLEASE_NEW_PLOT_LAYER: 'من فضلك أنشىء طبقة نقاط جديدة',
  DOWNLOADING_PLEASE_WAIT: 'من فضلك انتظر جارى التنزيل',
  DOWNLOADING_OTHERS_PLEASE_WAIT: 'Please wait while other files are being downloaded', // need to translate
  SELECT_DELETE_BY_RECTANGLE: 'الرجاء تحديد حذف العنصر عن طريق تحديد المستطيل',

  CHOOSE_LAYER: 'اختر الطبقة',

  COLLECT_SUCCESS: 'جمع ناجح',

  SELECT_TWO_MEDIAS_AT_LEAST: 'يجب عليك اختيار وسيلتين على الأقل',
  DELETE_OBJ_WITHOUT_MEDIA_TIPS: 'This object has no media files. Do you want to delete it?', // need to translate

  NETWORK_REQUEST_FAILED: 'فشل طلب الشبكة',

  SAVEING: 'جارى الحفظ',
  CREATING: 'جارى الانشاء',
  PLEASE_ADD_DATASOURCE: 'من فضلك اضف مجموعه البيانات',
  NO_ATTRIBUTES: 'لايوجد جدول بيانات',
  NO_SEARCH_RESULTS: 'لايوجد نتائج بحث',

  READING_TEMPLATE: 'قالب القراءة',
  SWITCHED_TEMPLATE: 'تبديل القالب',
  THE_CURRENT_SELECTION: 'الاختيار الحالى هو',
  THE_LAYER_DOES_NOT_EXIST: 'الطبقة غير موجودة',

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
  ENTER_CAPTION: 'Please input caption', // need to translate
  CHOICE_TYPE: 'Please choice type', // need to translate
  INPUT_LENGTH: 'Please input max length', // need to translate
  DEFAULT_VALUE_EROROR: 'Default value input error', // need to translate
  SELECT_REQUIRED: 'Please select required', // need to translate

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
  PLEASE_LOGIN: 'الرجاء تسجيل الدخول',
  SHARING: 'جارى المشاركة',
  SHARE_SUCCESS: 'تم المشاركة بنجاح',
  SHARE_FAILED: 'فشل فى المشاركة',
  SHARE_PREPARE: 'جارى التجهيز للمشاركة',
  SHARE_START: 'بدء المشاركة',

  EXPORTING: 'جارى التصدير',
  EXPORT_SUCCESS: 'تم التصدير بنجاح',
  EXPORT_FAILED: 'فشل التصدير',
  EXPORT_TO: 'تم تصدير البيانات إلى',
  REQUIRE_PRJ_1984: 'يجب أن يكون نظام إحداثيات مجموعة البيانات هو WGS_1984',

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
  PLANT_MODEL: 'نموذج النبات',
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
  AFTER_COLLECT: 'Please collect before viewing',//need to be translated

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
  CHANGE_TO_OUTDOOR: 'التبديل للخارج؟',
  CHANGE_TO_INDOOR: 'التبديل للداخل؟',
  SET_START_AND_END_POINTS: 'يرجى تعيين نقطتي البداية والنهاية أولاً',
  SELECT_LAYER_NEED_INCREMENTED: 'يرجى تحديد الطبقة التي تحتاج إلى زيادة',
  SELECT_THE_FLOOR: 'يرجى تحديد الطابق التي تقع فيها الطبقة',
  LONG_PRESS_ADD_START: 'يرجى الضغط لفترة طويلة لإضافة نقطة البداية',
  LONG_PRESS_ADD_END: 'يرجى الضغط لفترة طويلة لإضافة وجهة',
  ROUTE_ANALYSING: 'جارى التحليل',
  DISTANCE_ERROR: 'الوجهة قريبة جدًا من نقطة البداية ، يرجى إعادة التحديد',
  USE_ONLINE_ROUTE_ANALYST: 'النقاط خارج حدود مجموعة البيانات أو لا توجد مجموعة بيانات حول النقاط ، هل تريد استخدام محلل المسار عبر الإنترنت؟',
  NOT_SUPPORT_ONLINE_NAVIGATION: 'التنقل عبر الإنترنت غير متاح حتى الآن',
  CREATE: 'جديد',
  NO_DATASOURCE: 'لا يوجد مصدر بيانات في مساحة العمل الحالية ، يرجى إنشاء مصدر بيانات جديد أولاً',
  FLOOR: 'طابق',
  AR_NAVIGATION: 'AR Navi',
  ARRIVE_DESTINATION: 'وصلت إلى الوجهة',
  DEVIATE_NAV_PATH: 'انحرفت عن مسار التنقل',

  //导航增量路网
  SELECT_LINE_DATASET: 'لرجاء تحديد مجموعة بيانات السطر أولاً',
  CANT_UNDO: 'غير قابل للنقض',
  CANT_REDO: "لا يمكن الإعادة",
  DATASET_RENAME_FAILED: 'لا يمكن أن يحتوي اسم مجموعة البيانات إلا على أحرف وأرقام و" _ "،" @ "،" # "',
  SWITCH_LINE: 'تبديل مجموعة البيانات',
  HAS_NO_ROADNAME_FIELD_DATA: 'مجموعة بيانات بدون معلومات حقل اسم الطريق',
  MERGE_SUCCESS: 'تم الدمج بنجاح',
  MERGE_FAILD: 'فشل الدمج',
  NOT_SUPPORT_PRJCOORDSYS: 'لنظام الإحداثي لمجموعة البيانات التالية لا يدعم الدمج',
  MERGEING: 'الدمج',
  NEW_NAV_DATA: 'إنشاء بيانات التنقل',
  INPUT_MODEL_FILE_NAME: 'الرجاء إدخال اسم ملف نموذج',
  SELECT_DESTINATION_DATASOURCE: 'الرجاء تحديد مصدر البيانات الهدف',
  FILENAME_ALREADY_EXIST: 'الملف موجود بالفعل ، يرجى إعادة إدخال اسم الملف',
  NETWORK_BUILDING: 'جاري البناء...',
  BUILD_SUCCESS: 'تم بناؤه بنجاح',
  SELECT_LINE_SMOOTH: 'الرجاء تحديد الخط الذي يحتاج إلى تجانس',
  SELECT_A_POINT_INLINE: 'الرجاء تحديد نقطة على الإنترنت',
  LINE_DATASET: 'خط مجموعة البيانات',
  DESTINATION_DATASOURCE: 'مصدر البيانات الهدف',
  SMOOTH_FACTOR: 'الرجاء إدخال عامل التنعيم',
  SELECT_EXTEND_LINE: 'الرجاء تحديد السطر المراد تمديده',
  SELECT_SECOND_LINE: 'الرجاء تحديد السطر الثاني',
  SELECT_TRIM_LINE: 'الرجاء تحديد الخط المراد قصه',
  SELECT_BASE_LINE: 'الرجاء تحديد الخط الأساسي',
  SELECT_RESAMPLE_LINE: 'الرجاء تحديد السطر الذي تريد إعادة تشكيله',
  SELECT_CHANGE_DIRECTION_LINE: 'الرجاء تحديد الخط الذي يحتاج إلى تغيير الاتجاه',
  EDIT_SUCCESS: 'نجخت العملية',
  EDIT_FAILED: 'فشلت العملية',
  SMOOTH_NUMBER_NEED_BIGGER_THAN_2: 'يجب أن يكون معامل التنعيم 2 ~ 10 أعداد صحيحة',
  CONFIRM_EXIT: 'هل أنت متأكد من الخروج؟',
  TOPO_EDIT_END: 'هل انتهيت من التحرير والخروج؟',
  // 自定义专题图
  ONLY_INTEGER: 'يمكن إدخال الأعداد الصحيحة فقط!',
  ONLY_INTEGER_GREATER_THAN_2: 'يمكن إدخال الأعداد الصحيحة الأكبر من 2 فقط!',
  PARAMS_ERROR: 'خطاء فى المعاملات! فشل التعيين!',

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

  CANNOT_COLLECT_IN_THEMATIC_LAYERS: 'لا يمكن التجميع في الطبقات المواضيعية',
  CANNOT_COLLECT_IN_CAD_LAYERS: 'Cannot collect in CAD layers', //need to be translated
  CANNOT_COLLECT_IN_TEXT_LAYERS: 'Cannot collect in Text layers', //need to be translated
  HEAT_MAP_DATASET_TYPE_ERROR: 'يمكن إنشاء مجموعة بيانات النقاط فقط',


  //三维AR管线相关
  FILE_NOT_EXISTS: 'الملف غير موجود ، يرجى تحميل بيانات العينة',
  MOVE_PHONE_ADD_SCENE: 'الرجاء نقل الهاتف ببطء ، وتحديد واجهة انقر على الشاشة لإضافة مشاهد',

  INVALID_DATA_SET_FAILED: 'نوع البيانات غير صالح. فشل تعيين',
  INVISIBLE_LAYER_CAN_NOT_BE_SET_CURRENT: 'الطبقة غير مرئية ولا يمكن تعيينها على الطبقة الحالية',

  IDENTIFY_TIMEOUT: 'انتهاء مهلة تتبع الصورة ، حاول مرة أخرى؟',
  TRACKING_LOADING: 'تتبع...',

  // 专题制图加载/输出xml
  SUCCESS: 'عملية ناجحة',
  FAILED: 'فشلت العملية',
  NO_TEMPLATE: 'لا توجد قوالب متاحة',
  CONFIRM_LOAD_TEMPLATE: 'هل أنت متأكد من تحميل النموذج؟',
  CONFIRM_OUTPUT_TEMPLATE: 'هل أنت متأكد من إخراج الخريطة؟',
}

export { Prompt }
