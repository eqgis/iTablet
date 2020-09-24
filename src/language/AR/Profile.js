// 我的、发现
const Profile = {
  // 我的  主页面
  LOGIN_NOW: 'تسجيل الدخول',
  IMPORT: 'استيراد',
  DATA: 'البيانات',
  MARK: 'علامة',
  MAP: 'خريطة',
  SCENE: 'مشهد',
  BASEMAP: 'خريطة الأساس',
  SYMBOL: 'رمز',
  SETTINGS: 'إعدادات',
  COLOR_SCHEME: 'نظام الألوان',
  TEMPLATE: 'تنسيق الملف',
  AIMODEL: 'AI Model', //待翻译
  COLLECTION_TEMPLATE: 'تنسيق ملف مسح الاراضى',
  PLOTTING_TEMPLATE: 'تنسيق ملف توقيع النقاط',
  NAVIGATION: 'ملاحى',
  INCREMENT: 'زيادة',
  ENCLOSURE: 'نسيج',

  MY_COLOR_SCHEME: 'My Color Scheme', //待翻译
  MY_MODEL: 'My Model', //待翻译

  SELECT_MODEL: 'Select Model', //待翻译

  // 我的——登录
  LOGIN: 'تسجيل الدخول',
  LOGIN_TIMEOUT: 'نفذ وقت تسجيل الدخول,يرجى إعادة المحاولة لاحقا',
  LOGIN_CURRENT: 'تم تسجيل دخول المستخدم الحالي بالفعل',
  LOGIN_INVALID: 'انتهت صلاحية تسجيل الدخول. الرجاد الدخول على الحساب من جديد',
  MOBILE_LOGIN: 'تسجيل الدخول للجوال',
  EMAIL_LOGIN: 'تسجيل الدخول للبريد الإلكترونى',
  ENTER_EMAIL_OR_USERNAME: 'من فضلك أدخل أسم المستخدم أو البريد الإلكترونى',
  ENTER_MOBILE: 'من فضلك أدخل رقم هاتفك المحمول',
  USERNAME_ALL: 'phone number/email/nickname', //待翻译
  ENTER_USERNAME_ALL: 'Please enter your phone number, email or nickname', //待翻译
  ENTER_PASSWORD: 'من فضلك أدخل رقمك السري',
  RE_ENTER_PASSWORD: 'Please re-enter your password', //待翻译
  PASSWORD_DISMATCH: 'The passwords are different, please check again',
  REGISTER: 'تسجيل',
  FORGET_PASSWORD: 'هل نسيت كلمة المرور؟',
  RESET_PASSWORD: 'إعادة تعيين كلمة المرور',
  MOBILE_REGISTER: 'سجل الجوال',
  EMAIL_REGISTER: 'تسجيل البريد الإلكتروني',
  ENTER_USERNAME: 'الرجاء إدخال اسم المستخدم',
  ENTER_USERNAME2: 'الرجاء إدخال اسم المستخدم',
  ENTER_CODE: 'يرجى إدخال الرمز الخاص بك',
  GET_CODE: 'الحصول على رمز',
  ENTER_EMAIL: 'من فضلك أدخل بريدك الإلكتروني',
  ENTER_SERVER_ADDRESS: 'من فضلك أدخل عنوان السيرفر',
  ENTER_VALID_SERVER_ADDRESS: 'من فضلك أدخل سيرفر صالح',
  ENTER_REALNAME: 'من فضلم أدخل أسم حقيقى',
  ENTER_COMPANY: 'من فضلك أدخل شركتك',
  REGISTER_READ_PROTOCAL: 'لقد قرات ووافقت على ال',
  REGISTER_ONLINE_PROTOCAL: 'شروط خدمة سوبرماب وسياسة الخصوصية',
  CONNECTING: 'توصيل',
  CONNECT_SERVER_FAIL: 'فشل الاتصال بالسيرفر ، يرجى التحقق من عنوان الشبكة أو السيرفر',
  NEXT: 'التالى',

  SWITCH_ACCOUNT: 'تبديل الحساب',
  LOG_OUT: 'تسجيل خروج',

  SWITCH: 'Switch', //待翻译
  SWITCH_CURRENT: 'لقد قمت بتسجيل الدخول بالفعل مع هذا المستخدم',
  SWITCHING: 'جاري التبديل ...',
  SWITCH_FAIL: 'فشل التبديل ، يرجى محاولة تسجيل الدخول مع هذا المستخدم مرة أخرى',

  // 地图服务地址
  SERVICE_ADDRESS: 'عنوان الخدمة',
  MAP_NAME: 'أسم الخريطة',
  ENTER_SERVICE_ADDRESS: 'من فضلك أدخل عنوان الخدمة',
  SAVE: 'حفظ',

  // 我的服务
  SERVICE: 'خدمة',
  MY_SERVICE: 'خدمة',
  PRIVATE_SERVICE: 'خدمة خاصة',
  PUBLIC_SERVICE: 'خدمة عامة',

  // 个人主页
  MY_ACCOUNT: 'حسابى',
  PROFILE_PHOTO: 'صورة الملف الشخصى',
  USERNAME: 'اسم المستخدم',
  PHONE: 'رقم الهاتف',
  E_MAIL: 'البريد الإلكترونى',
  CONNECT: 'اتصال',
  MANAGE_ACCOUNT: 'إدارة الحساب',
  ADD_ACCOUNT: 'إضافة حساب',
  DELETE_ACCOUNT: 'حذف حساب',
  UNABLE_DELETE_SELF: 'لا يمكن حذف المستخدم الحالى',

  DELETE: 'حذف',
  SELECT_ALL: 'تحديد الكل',
  DESELECT_ALL: 'إلغاء تحديد الكل',

  // 数据删除导出
  SHARE: 'مشاركة',
  PATH: 'مسار',

  LOCAL: 'محلى',
  SAMPLEDATA: 'بيانات تجريبية',
  ON_DEVICE: 'بيانات المستخدم',
  EXPORT_DATA: 'تصدير البيانات',
  IMPORT_DATA: 'إستيراد البيانات',
  UPLOAD_DATA: 'مشاركة البيانات',
  DELETE_DATA: 'حذف البيانات',
  OPEN_DATA: 'فتح البيانات',
  NEW_DATASET: 'إنشاء مجموعه بيانات',
  UPLOAD_DATASET: 'مشاركة مجموعة بيانات',
  DELETE_DATASET: 'حذف مجموعة بيانات',
  UPLOAD_MAP: 'مشاركة الخريطة',
  EXPORT_MAP: 'تصدير الخريطة',
  DELETE_MAP: 'حذف الخريطة',
  UPLOAD_SCENE: 'مشاركة المشهد',
  DELETE_SCENE: 'حذف المشهد',
  UPLOAD_SYMBOL: 'مشاركة الرمز',
  DELETE_SYMBOL: 'حذف الرمز',
  UPLOAD_TEMPLATE: 'مشاركة تنسيق الملف',
  DELETE_TEMPLATE: 'حذف تنسيق الملف',
  UPLOAD_MARK: 'مشاركة العلامة',
  DELETE_MARK: 'حذف العلامة',
  UPLOAD_COLOR_SCHEME: 'مشاركة نظتم الألوان',
  DELETE_COLOR_SCHEME: 'حذف نظام الألوان',
  BATCH_SHARE: 'مشاركة الدفعة',
  BATCH_DELETE: 'حذف الدفعة',
  BATCH_ADD: 'Batch Add', // 待翻译
  BATCH_OPERATE: 'عمليات الدفعة',

  // 待翻译
  MY_APPLET: 'My Applet',
  UN_DOWNLOADED_APPLET: 'Undownloaded Applet',
  DELETE_APPLET: 'Delete Applet',
  ADD_APPLET: 'Add Applet',
  MOVE_UP: 'Move Up',
  MOVE_DOWN: 'Move Down',

  DELETE_SERVICE: 'حذف الخدمة',
  PUBLISH_SERVICE: 'نشر',
  SET_AS_PRIVATE_SERVICE: 'تعيين كخدمة خاصة',
  SET_AS_PUBLIC_SERVICE: 'تعيين كخدمة عامة',
  SET_AS_PRIVATE_DATA: 'تعييت كبياناتخاصة',
  SET_AS_PUBLIC_DATA: 'تعيين كبيانات عامة',
  NO_SERVICE: 'لاتوجد خدمة',

  GET_DATA_FAILED: 'فشل الحصول على البيانات',

  // 关于
  ABOUT: 'حول',
  SERVICE_HOTLINE: 'خدمة الخط الساخن',
  SALES_CONSULTATION: 'استشارات المبيعات',
  BUSINESS_WEBSITE: 'موقع الأعمال',
  SERVICE_AGREEMENT: 'اتفاقية خدمات',
  PRIVACY_POLICY: 'سياسة الخصوصية',
  HELP_MANUAL: 'دليل المساعدة',

  MAP_ONLINE: 'خريطة عبر الإنترنت',
  MAP_2D: 'خريطة ثنائية الأبعاد',
  MAP_3D: 'خريطة ثلاثية الأبعاد',
  BROWSE_MAP: 'تصفح',

  // 创建数据集
  PLEASE_ADD_DATASET: 'من فضلك أضف مجموعة البيانات',
  ADD_DATASET: 'أضف مجموعة البيانات',
  ENTER_DATASET_NAME: 'من فضلك أضف أسم مجوعة البيانات',
  SELECT_DATASET_TYPE: 'من فضلك أختر نوع مجموعة البيانات',
  DATASET_NAME: 'اسم مجموعة البيانات',
  DATASET_TYPE: 'نوع مجموعة البيانات',
  DATASET_TYPE_POINT: 'نقطة',
  DATASET_TYPE_LINE: 'خط',
  DATASET_TYPE_REGION: 'منطقة',
  DATASET_TYPE_TEXT: 'نص',
  CLEAR: 'مسح',
  CREATE: 'أنشاء',
  DATASET_BUILD_PYRAMID: 'Build Pyramid', //待翻译
  DATASET_BUILD_STATISTICS: 'Statistics Model',
  TIME_SPEND_OPERATION: 'This operation may take some time, would you like to continue?',
  IMPORT_BUILD_PYRAMID: 'Do you want to build image pyramid(may take some time)？',
  BUILDING: 'Building',
  BUILD_SUCCESS: 'Build Sucessfully',
  BUILD_FAILED: 'Build Failed',

  // 创建数据源
  NEW_DATASOURCE: 'أنشاء مجموعه بيانات',
  SET_DATASOURCE_NAME: 'تعيين اسم محموعه بيانات',
  ENTER_DATASOURCE_NAME: 'من فضلك ادخل اسم مجموعه البيانات',
  OPEN_DATASROUCE_FAILED: 'فشل فتح مجموعه البيانات',
  DATASOURCE_TYPE: 'Datasource type', //待翻译
  SERVICE_TYPE: 'Service type',

  SELECT_DATASET_EXPORT_TYPE: 'أختر شكل التصدير',
  DATASET_EXPORT_NOT_SUPPORTED: 'تصدير مجموعة البيانات هذه غير متاح حتى الآن',

  // 搜索
  SEARCH: 'بحث',
  NO_SEARCH_RESULT: 'لاتوجد نتائج للبحث',

  // 设置
  STATUSBAR_HIDE: 'إخفاء شريط المعلومات',
  SETTING_LICENSE: 'رخصة',
  SETTING_ABOUT_ITABLET: 'حول التابلت الذكى',
  SETTING_ABOUT: 'About ', //待翻译
  SETTING_ABOUT_AFTER: '',
  SETTING_CHECK_VERSION: 'تحقق من الإصدار',
  SETTING_SUGGESTION_FEEDBACK: 'Suggestion Feedback', //待翻译
  SETTING_LANGUAGE: 'اللغة',
  SETTING_LANGUAGE_AUTO: 'تلقائى',
  SETTING_LOCATION_DEVICE: 'Location Device', //待翻译
  SETTING_LOCATION_LOCAL: 'This device', //待翻译

  // 许可
  LICENSE: 'License', //待翻译
  LICENSE_CURRENT: 'الرخصة الحالية',
  LICENSE_TYPE: 'نوع الرخصة',
  LICENSE_TRIAL: 'رخصة تجريبية',
  LICENSE_OFFICIAL: 'الرخصة الرسمية',
  LICENSE_STATE: 'حالة الرخصة',
  LICENSE_SURPLUS: 'فائض ارخصة',
  LICENSE_YEAR: 'YEAR', //待翻译
  LICENSE_DAY: 'يوم',
  LICENSE_PERMANENT: 'Permanent', //待翻译
  LICENSE_CONTAIN_MODULE: 'ترخيص يحتوي على وحدة',
  LICENSE_CONTAIN_EXPAND_MODULE: 'License Contain Expand Module', //待翻译
  LICENSE_USER_NAME: 'User Name', //待翻译
  LICENSE_REMIND_NUMBER: 'License Remind Number', //待翻译
  LICENSE_OFFICIAL_INPUT: 'إدخال الرخصة الرسمية',
  LICENSE_TRIAL_APPLY: 'تطبيق الرخصة التجريبية',
  LICENSE_OFFICIAL_CLEAN: 'مسح الرخصة الرسمية',
  LICENSE_OFFICIAL_RETURN: 'License Return', //待翻译
  LICENSE_CLEAN_CANCLE: 'إلغاء المسح',
  LICENSE_CLEAN_CONTINUE: 'أستمرار المسح',
  LICENSE_CLEAN_ALERT: 'سيتم خصم عدد الرخيص من التنشيط التالي بعد مسح الرخص. رقم الرخص المتبقي الحالي',
  INPUT_LICENSE_SERIAL_NUMBER: 'أدخل الرقم التسلسلى لرخصة',
  PLEASE_INPUT_LICENSE_SERIAL_NUMBER: 'من فضلك أدخل الرقم التسلسلى لرخصة',
  PLEASE_INPUT_LICENSE_SERIAL_NUMBER_NOT_CORRECT: 'الرقم التسلسلى المدخل لرخصة غير صحيح',
  LICENSE_SERIAL_NUMBER_ACTIVATION_SUCCESS: 'تم تنشيط الرقم التسلسلى بنجاح',
  LICENSE_REGISTER_BUY: 'شراء التسجيك',
  LICENSE_HAVE_REGISTER: 'لديك تسجيل',
  LICENSE_NOT_CONTAIN_MODULE: 'لا تحتوي على وحدة',
  LICENSE_MODULE_REGISTER_SUCCESS: 'تسجيل الوحدة بنجاح',
  LICENSE_MODULE_REGISTER_FAIL: 'Module Register Fail', //待翻译
  LICENSE_EXIT: 'خروج',
  LICENSE_EXIT_FAILED: 'فشل الخروج',
  LICENSE_EXIT_CLOUD_ACTIVATE: 'Do you want recycle cloud license and activate?', //待翻译
  LICENSE_EXIT_CLOUD_LOGOUT: 'Do you want recycle cloud license and logout?', //待翻译
  LICENSE_CURRENT_EXPIRE: 'الرخصة الحالية غير صالحة',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE: 'لم يتم تضمين هذه الوحدة بموجب الترخيص الحالي',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE_SUB: 'هذه الوحدة ليست مدرجة تحت الترخيص الحالي ، وبعض وظائفها لن تكون متاحة ！！！',
  LICENSE_NO_NATIVE_OFFICAL: 'لا يوجد ملف ترخيص رسمي أصلي ، يرجى إضافة ملف الترخيص/إلى الرخصة الرسمية/التابلت الذكى/لرخصة/الملف ',
  LICENSE_NOT_ITABLET_OFFICAL: 'لم يتم تفعيل هذا الترخيص الرسمي على التابلت الذكى، يرجى الانتقال إلى صفحة الترخيص لمسح الترخيص وإعادة تنشيطه   ',
  LICENSE_NATIVE_EXPIRE: 'رخصة أصلية غير صالحة',

  // 待翻译
  LICENSE_LONG_EFFECTIVE: 'Long Effective',
  LICENSE_OFFLINE: 'License OffLine',
  LICENSE_CLOUD: 'License Cloud',
  LICENSE_PRIVATE_CLOUD: 'License Private Cloud',
  LICENSE_NONE: 'None',
  LICENSE_EDITION: 'License Edition',
  LICENSE_EDITION_CURRENT: 'Current Edition',
  LICENSE_IN_TRIAL: 'in Trial',
  LICENSE_TRIAL_END: 'Trial End',
  LICENSE_MODULE: 'Expand Module',
  LICENSE_ACTIVATE: 'Activate',
  LICENSE_ACTIVATING: 'Activating',
  LICENSE_ACTIVATION_SUCCESS: 'Activate Success',
  LICENSE_ACTIVATION_FAIL: 'Activate Failed',
  LICENSE_SELECT_LICENSE: 'Select License',
  LICENSE_REAMIN_DAYS: 'Remain Days',
  LICENSE_SHOW_DETAIL: 'Show details',
  LICENSE_QUERY_NONE: 'Unable to get license information',
  LICENSE_PRIVATE_CLOUD_SERVER: 'Private Cloud Server',

  LICENSE_EDUCATION: 'رخصة تعليمية',
  LICENSE_EDUCATION_CONNECT_FAIL: 'فشل اتصال الخدمة',

  // 待翻译
  LICENSE_QUERY: 'Query License',
  LICENSE_QUERYING: 'Quering',
  LICENSE_QUERY_FAIL: 'Query failed. Please check the server setting',
  LICENSE_SELECT_MODULE: 'Select Module',
  LICENSE_SELECT_EDITION: 'Select Edition',
  LICENSE_TOTAL_NUM: 'Total Numbers',
  LICENSE_REMIAN_NUM: 'Remain Numbers',
  LICENSE_DUE_DATE: 'Expire at',
  LICENSE_CLOUD_SITE_SWITCH: 'Switch',
  LICENSE_CLOUD_SITE_DEFAULT: 'Default Site',
  LICENSE_CLOUD_SITE_JP: 'Japan Site',
  // itablet许可版本
  LICENSE_EDITION_STANDARD: 'Standard Edition',
  LICENSE_EDITION_PROFESSIONAL: 'Professional Edition',
  LICENSE_EDITION_ADVANCED: 'Advanced Edition',

  // imobile许可模块
  Core_Dev: 'التطوير الاساسى',
  Core_Runtime: 'وقت التشغيل الأساسي',
  Navigation_Dev: 'تطوير التنقل',
  Navigation_Runtime: 'وقت التنقل',
  Realspace_Dev: 'Realspace Dev',
  Realspace_Runtime: 'Realspace Runtime',
  Plot_Dev: 'Plot Dev',
  Plot_Runtime: 'وقت تشغيل التوقيع',
  Industry_Navigation_Dev: 'Industry Navigation Dev',
  Industry_Navigation_Runtime: 'Industry Navigation Runtime',
  Indoor_Navigation_Dev: 'Indoor Navigation Dev',
  Indoor_Navigation_Runtime: 'Indoor Navigation Runtime',
  Plot3D_Dev: 'Plot3D Dev',
  Plot3D_Runtime: 'وقت تشغيل التوقيع ثلاثى الابعاد',
  Realspace_Analyst_Dev: 'Realspace Analyst Dev',
  Realspace_Analyst_Runtime: 'Realspace Analyst Runtime',
  Realspace_Effect_Dev: 'Realspace Effect Dev',
  Realspace_Effect_Runtime: 'Realspace Effect Runtime',

  // itablet许可模块 待翻译
  ITABLET_ARMAP: 'Ar Map',
  ITABLET_NAVIGATIONMAP: 'Navigation Map',
  ITABLET_DATAANALYSIS: 'Data Analysis',
  ITABLET_PLOTTING: 'Plotting',
  INVALID_MODULE: 'Invalid module. Unable to continue.',
  INVALID_LICENSE: 'Invalid license. Unable to continue.',
  GO_ACTIVATE: 'Go Activate',

  // 意见反馈 待翻译
  SUGGESTION_FUNCTION_ABNORMAL: 'Function Abnormal : Function abnormal or not can use',
  SUGGESTION_PRODUCT_ADVICE: 'Product Suggestion : I have a suggestion',
  SUGGESTION_OTHER_PROBLEMS: 'Other Problems',
  SUGGESTION_SELECT_PROBLEMS: 'Please select the problems',
  SUGGESTION_PROBLEMS_DETAIL: 'Please provide detailed problems and suggestion',
  SUGGESTION_PROBLEMS_DESCRIPTION: 'Plese input problem description',
  SUGGESTION_CONTACT_WAY: 'Contact Way',
  SUGGESTION_CONTACT_WAY_INPUT: 'Please input contact way',
  SUGGESTION_SUBMIT: 'Submit',
  SUGGESTION_SUBMIT_SUCCEED: 'Submit Succeed',
  SUGGESTION_SUBMIT_FAILED: 'Submit Failed',

  // ar地图校准 待翻译
  MAP_AR_DATUM_LONGITUDE: 'Longitude',
  MAP_AR_DATUM_LATITUDE: 'Latitude',
  MAP_AR_DATUM_ENTER_CURRENT_POSITION: 'Please enter current position',
  MAP_AR_DATUM_AUTO_LOCATION: 'Auto location',
  MAP_AR_DATUM_MAP_SELECT_POINT: 'Map select point',
  MAP_AR_DATUM_SURE: 'Sure',
  MAP_AR_DATUM_AUTO_LOCATIONING: 'Locationing',
  MAP_AR_DATUM_POSITION: 'Datum position',
  MAP_AR_DATUM_AUTO_LOCATION_SUCCEED: 'Auto location succeed',
  MAP_AR_DATUM_MAP_SELECT_POINT_SUCCEED: 'Map select point succeed',
  MAP_AR_DATUM_PLEASE_TOWARDS_SOUTH: 'Please place your mobile phone facing south click sure',
  MAP_AR_DATUM_SETTING: 'Setting',
  X_COORDINATE: 'X Coordinate',
  Y_COORDINATE: 'Y Coordinate',

  // ar地图 待翻译
  COLLECT_SCENE_RENAME: 'Rename',
  COLLECT_SCENE_RENAME_SUCCEED: 'Rename succeed',
  COLLECT_SCENE_ADD_REMARK: 'Add remark',
  COLLECT_SCENE_ADD_REMARK_SUCCEED: 'Add remark succeed',

  CHOOSE_COLOR: 'اختيار اللون',
  SET_PROJECTION: 'Set projection', //待翻译
}

export { Profile }
