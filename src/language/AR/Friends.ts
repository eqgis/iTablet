import CN from '../CN'

// 好友
const Friends: typeof CN.Friends = {
  LOCALE: 'en',

  LOGOUT: 'تسجيل الدخول إلى الخدمة عبر الإنترنت والبقاء على اتصال مع أصدقائك',
  MESSAGES: 'رسائل',
  FRIENDS: 'أصدقاء',
  GROUPS: 'مجموعات',
  ADD_FRIENDS: 'أضافة صديق',
  NEW_GROUP_CHAT: 'دردشة جماعية جديدة',
  RECOMMEND_FRIEND: 'أقتراح صديق',
  SELECT_MODULE: 'أختر الوحدة',
  SELECT_MAP: 'اختر الخريطة',
  // Friend
  MSG_SERVICE_FAILED: 'فشل الاتصال بخدمة الرسائل',
  MSG_SERVICE_NOT_CONNECT: 'تعذر الاتصال بخدمة الرسائل',
  SEND_SUCCESS: 'تم الإرسال بنجاح',
  SEND_FAIL: 'فشل إرسال الملف',
  SEND_FAIL_NETWORK: 'فشل إرسال الملف ,يرجى التحقق من شبكه الإنترنت',
  RECEIVE_SUCCESS: 'تم الإستلام بنجاح',
  RECEIVE_FAIL_EXPIRE: 'فشل الاستلام ، ربما انتهت صلاحية الملف',
  RECEIVE_FAIL_NETWORK: 'فشل الإستلام,يرجى التحقق من شبكة الإنترنت',
  // FriendMessage
  MARK_READ: 'وضع علامة كمقروء',
  MARK_UNREAD: 'ضع علامة كغير مقروءة',
  DEL: 'حذف',
  NOTIFICATION: 'إشعارات',
  CLEAR_NOTIFICATION: 'مسح الإشعارات',
  CONFIRM: 'تأكيد',
  CANCEL: 'إلغاء',
  ALERT_DEL_HISTORY: 'مسح سجل الدردشة هذا؟',
  // FriendList
  SET_MARK_NAME: 'تعيين اسم العلامة',
  DEL_FRIEND: 'حذف صديق',
  ALERT_DEL_FRIEND: 'حذف صديق وكذلك سجل الدردشة؟',
  TEXT_CONTENT: 'محتوى النص',
  INPUT_MARK_NAME: 'يرجى إدخال اسم علامة',
  INPUT_INVALID: 'إدخال غير صالح ، يرجى الإدخال مرة أخرى',
  // InformMessage
  TITLE_NOTIFICATION: 'إشعار',
  FRIEND_RESPOND: 'هل تريد قبول طلب الصداقة هذا؟',
  // CreateGroupChat
  CONFIRM2: 'موافق',
  TITLE_CHOOSE_GROUP: 'اختار المجموعة',
  TITLE_CHOOSE_FRIEND: 'أختر صديق',
  TOAST_CHOOSE_2: 'أضف أكثر من 2 صديق للدردشة في المجموعة',
  NO_FRIEND: 'عفوًا ، لا يوجد صديق بعد',
  // AddFriend
  ADD_FRIEND_PLACEHOLDER: 'البريد الإلكتروني / اللقب',
  SEARCHING: 'جارى البحث...',
  SEARCH: 'بحث',
  ADD_SELF: 'لا يمكنك إضافة نفسك كصديق',
  ADD_AS_FRIEND: 'إضافه هو/هى كصديق؟',
  // FriendGroup
  LOADING: 'جارى التحميل..',
  DEL_GROUP: 'حذف المجموعة',
  DEL_GROUP_CONFIRM: 'هل ترغب في مسح محفوظات الدردشة وترك هذه المجموعة؟',
  DEL_GROUP_CONFIRM2: 'هل ترغب في مسح محفوظات الدردشة وحل هذه المجموعة؟',
  // Chat
  INPUT_MESSAGE: 'رسالة الإدخال ...',
  SEND: 'إرسال',
  LOAD_EARLIER: 'تحميل الرسائل السابقة',
  IMPORT_DATA: 'استيراد البيانات ...',
  IMPORT_SUCCESS: 'تم الاستيراد بنجاح',
  IMPORT_FAIL: 'فشل الاستيراد',
  IMPORT_CONFIRM: 'هل تريد استيراد البيانات؟',
  RECEIVE_CONFIRM: 'هل تريد تنزيل البيانات',
  OPENCOWORKFIRST: 'من فضلك أفتح مساحة العمل  التعاونية أولا قبل أستيراد البيانات',
  LOCATION_COWORK_NOTIFY: 'ال الموقع فى وضع مساحة العمل الجماعية',
  LOCATION_SHARE_NOTIFY: 'لا يمكن فتح الموقع في المشاركة',
  WAIT_DOWNLOADING: 'يرجى الانتظار حتى اكتمال التنزيل',
  DATA_NOT_FOUND: 'لم يتم العثور على البيانات ، هل ترغب في تنزيلها مرة أخرى؟',
  LOAD_ORIGIN_PIC: 'تحميل الأصل',
  UNSUPPORTED_MESSAGE: 'رسالة غير معتمدة',
  // CustomActions
  MAP: 'خريطة',
  TEMPLATE: 'تنسيق الملف',
  LOCATION: 'الموقع',
  PICTURE: 'صوره',
  LOCATION_FAILED: 'فشل في تحديد الموقع',

  // Cowork
  COWORK_MESSAGE: 'رسالة مشاركة عمل',
  SEND_COWORK_INVITE: 'هل تريد إرسال دعوة للمشاركة في العمل؟',
  COWORK_INVITATION: 'دعوة للعمل المشترك',
  COWORK_MEMBER: 'أعضاء فريق العمل المشترك',
  COWORK_IS_END: 'إنتهى العمل المشترك',
  COWORK_JOIN_FAIL: 'يتعذر الانضمام إلى زميل العمل هذا الآن',
  COWORK_UPDATE: 'تحديث',
  COWORK_ADD: 'إضافة',
  COWORK_IGNORE: 'تجاهل',
  NEW_MESSAGE: 'رسالة جديدة',
  NEW_MESSAGE_SHORT: 'جديد',
  UPDATING: 'التحديث',
  SELECT_MESSAGE_TO_UPDATE: 'الرجاء تحديد رسالة لتحديثها',
  UPDATE_NOT_EXIST_OBJ: 'العلاقة الهندسية غير موجودة ، غير قادر على التحديث',
  ADD_DELETE_ERROR: 'غير قادر على إضافة العلاقةالهندسية المحذوفة',
  DELETE_COWORK_ALERT: 'هل تريد حذف دعوة العمل المشترك هذه؟',
  NO_SUCH_MAP: "لم يتم العثور على هذه الخريطة",
  SELF: 'انا',
  ONLINECOWORK_DISABLE_ADD: 'غير قادر على الإضافة عند العمل المشترك عبر الإنترنت',
  ONLINECOWORK_DISABLE_OPERATION: 'تعذر إجراء العملية عند العمل المشترك عبر الإنترنت',

  // RecommendFriend
  FIND_NONE: 'تعذر العثور على أصدقاء جدد من جهات الاتصال الخاصة بك',
  ALREADY_FRIEND: 'نحن بالفعل أصدقاء',
  PERMISSION_DENIED_CONTACT: 'يرجى تشغيل إذن تابلت لعرض جهات الإتصال',
  // ManageFriend/Group
  SEND_MESSAGE: 'إرسال رسالة',
  SET_MARKNAME: 'تعيين الاسم المستعار',
  SET_GROUPNAME: 'تعيين إسم المجموعة',
  PUSH_FRIEND_CARD: 'دفع بطاقة صديق',
  FRIEND_MAP: 'خريطة صديق',
  ADD_BLACKLIST: 'أضف إلى القائمة السوداء',
  DELETE_FRIEND: 'حذف صديق',
  LIST_MEMBERS: 'أعضاء القائمة',
  MEMBERS: 'الأعضاء',
  LEAVE_GROUP: 'غادر المجموعة',
  CLEAR_HISTORY: 'مسح تاريخ الدردشة',
  DISBAND_GROUP: 'حل المجموعة',
  DELETE_MEMBER: 'إزالة عضو من المجموعة',
  ADD_MEMBER: 'إضافة عضو فى المجموعة',
  COWORK: 'خريطة العمل التعاونية',
  EXIT_COWORK: 'خروج من مساحة العمل التعاونية',
  GO_COWORK: 'العمل التعاونى',
  ALERT_EXIT_COWORK: 'هل تريد غلق مساحة العمل التعاونية الحالية؟',
  SHARE_DATASET: 'شارك مجموعة البيانات',
  // system text
  SYS_MSG_PIC: 'صورة',
  SYS_MSG_MAP: 'خريطة',
  SYS_MSG_LAYER: 'طبقة',
  SYS_MSG_DATASET: 'مجموعة البيانات',
  SYS_MSG_ADD_FRIEND: 'إرسال طلب صداقة',
  SYS_MSG_REMOVED_FROM_GROUP: 'خروج من المجموعة',
  SYS_MSG_LEAVE_GROUP: 'الرحيل من المجموعة',
  SYS_MSG_ETC: '... ',
  SYS_MSG_REMOVE_OUT_GROUP: 'تم الإزالة',
  SYS_MSG_REMOVE_OUT_GROUP2: 'خارج المجموعة',
  SYS_MSG_ADD_INTO_GROUP: 'تم إضافته',
  SYS_MSG_ADD_INTO_GROUP2: 'داخل المجموعة',
  SYS_NO_SUCH_USER: 'المستخدم غير موجود',
  SYS_FRIEND_ALREADY_IN_GROUP: 'تم تحديد الأصدقاء بالفعل في المجموعة',
  EXCEED_NAME_LIMIT: 'يجب أن يكون الاسم في حدود 40 كلمة',
  SYS_MSG_MOD_GROUP_NAME: 'تم تغيير اسم المجموعة إلى',
  SYS_LOGIN_ON_OTHER_DEVICE: 'تم تسجيل حسابك على جهاز آخر',
  SYS_MSG_REJ: 'المقابل لم يضفك كصديق بعد',
  SYS_FRIEND_REQ_ACCEPT: 'أنتم أصدقاء الأن,استمتعو بالحديث',

  SYS_INVITE_TO_COWORK: ' يدعوك للانضمام إلى فريق العمل المشترك',
  SYS_MSG_GEO_ADDED: 'تمت الإضافة',
  SYS_MSG_GEO_DELETED: 'تم الحذف',
  SYS_MSG_GEO_UPDATED: 'تم التحديث',

  SYS_MSG_GEO_ADDED2: '',
  SYS_MSG_GEO_DELETED2: '',
  SYS_MSG_GEO_UPDATED2: '',

  ADDED: 'تمت الإضافة',

  // 创建群组
  JOIN: 'حضر',
  TITLE_CHOOSE_MEMBER: 'اختار العضو',
  VIEW_MORE_MEMBERS: 'عرض المزيد من الأعضاء',
  MY_GROUPS: 'مجموعاتي',
  JOINED_GROUPS: 'انضمت إلى المجموعات',
  GROUP_MESSAGE: 'رسالة جماعية',
  TASK: 'مهمة',
  TASK_DISTRIBUTION: 'مهمة جديدة',
  GROUP_CREATE: 'إنشاء مجموعة',
  GROUP_DELETE: 'حذف المجموعة',
  GROUP_APPLY: 'الانضمام إلى المجموعة',
  GROUP_EXIST: 'مغادرة المجموعة',
  GROUP_INVITE: 'إضافة عضو',
  GROUP_SETTING: 'إعدادات المجموعة',
  GROUP_MEMBER_MANAGE: 'إدارة الأعضاء',
  GROUP_MEMBER_DELETE: 'حذف العضو',
  GROUP_RESOURCE: 'إدارة المورد',
  GROUP_RESOURCE_UPLOAD: 'تحميل البيانات',
  GROUP_RESOURCE_DELETE: 'حذف البيانات',
  GROUP_MANAGE: 'الإدارة',
  GROUP_MEMBER: 'عضو',
  NAME: 'الاسم',
  GROUP_NAME_PLACEHOLDER: 'الرجاء إدخال 20 حرفًا بحد أقصى',
  GROUP_TAG: 'علامة',
  GROUP_TAG_PLACEHOLDER: '6 علامات على الأكثر تفصل كل منها بفاصلة',
  GROUP_REMARK: 'ملاحظة',
  GROUP_REMARK_PLACEHOLDER: 'الرجاء إدخال 100 حرف على الأكثر',
  RESOURCE_SHARER: 'مشارك',
  CREATOR: 'المنشئ',
  ALL_MEMBER: 'كل الأعضاء',
  GROUP_TYPE: 'النوع',
  GROUP_TYPE_PRIVATE: 'خاص',
  GROUP_TYPE_PRIVATE_INFO: 'المنشئ يدعو الأعضاء إلى المجموعة',
  GROUP_TYPE_PUBLIC: 'عام',
  GROUP_TYPE_PUBLIC_INFO: 'يدعو المنشئ الأعضاء إلى المجموعة. أو يمكن للأعضاء التقدم للانضمام إلى المجموعة',
  GROUP_TYPE_PUBLIC_CHECK_INFO: 'يحتاج المنشئ إلى تدقيق التطبيق الجديد',
  CREATE: 'إنشاء',
  GROUP_CREATE_SUCCUESS: 'تم إنشاء مجموعة بنجاح',
  GROUP_CREATE_FAILED: 'فشل إنشاء مجموعة',
  GROUP_TAG_NOT_EMPTY: 'الرجاء إدخال تسمية المجموعة',
  GROUP_NAME_NOT_EMPTY: 'يرجى تسمية المجموعة',
  GROUP_ALREADY_JOINED: 'انضم إلى المجموعة',
  GROUP_APPLY_REASON: 'السبب التطبيقي',
  APPLY: 'تطبيق',
  GROUP_APPLY_INFO: 'مطبق',
  GROUP_APPLY_AGREE: 'موافق',
  GROUP_APPLY_REFUSE: 'رفض',
  GROUP_APPLY_DISAGREE: 'غير موافق',
  GROUP_APPLY_ALREADY_AGREE: 'متفق عليه',
  GROUP_APPLY_ALREADY_DISAGREE: 'مرفوض',
  GROUP_APPLY_TO: 'تطبيق على المجموعة',
  GROUP_SELECT_MEMBER: 'الرجاء تحديد الأعضاء',
  GROUP_APPLY_TITLE: 'التقدم بطلب للانضمام إلى المجموعة',
  GROUP_APPLY_ALRADY_TITLE: 'تم تدقيق التطبيق',
  APPLICANT: 'مقدم الطلب',
  APPLY_REASON: 'سبب التطبيق',
  APPLY_TIME: 'وقت التطبيق',
  GROUP_NAME: 'اسم المجموعة',
  CHECK_RESULT: 'نتيجة المراجعة',
  CHECK_TIME: 'الوقت المدقق',
  APPLY_MESSAGE: 'تطبيق الرسالة',
  INVITE: 'دعوة',
  INVITE_MESSAGE: 'رسالة دعوة',
  INVITE_TO: 'أدعوك للانضمام',
  INVITE_REASON: 'سبب الدعوة',
  INVITE_SUCCESS: 'تم إرسال الدعوة بنجاح',
  INVITE_FAILED: 'فشل إرسال الدعوة',
  INVITE_SEARCH_PLACEHOLDER: 'الرجاء إدخال اللقب',

  RESOURCE_UPLOAD: 'تحميل',
  RESOURCE_UPLOAD_SUCCESS: 'تم التحميل بنجاح',
  RESOURCE_UPLOAD_FAILED: 'فشل التحميل',
  RESOURCE_EXPORT_FAILED: 'فشل التصدير',
  RESOURCE_EXPORTING: 'تصدير',
  RESOURCE_UPLOADING: 'تجميل',
  RESOURCE_DELETE_INFO: 'هل أنت متأكد أنك تريد حذف البيانات المحددة',
  RESOURCE_SELECT_MODULE: 'الرجاء تحديد قالب',
  RESOURCE_DOWNLOAD_INFO: 'الرجاء تنزيل المهمة',
  RESOURCE_NOT_EXIST: 'الموارد غير موجودة',

  TASK_DOWNLOAD: 'تنزيل المهمة',
  TASK_DOWNLOADING: 'تنزيل',
  TASK_TITLE: 'مهمة عمل مشترك',
  TASK_MAP: 'خريطة عمل مشترك',
  TASK_CREATOR: 'منشئ',
  TASK_TYPE: 'نوع البيانات',
  TASK_UPDATE_TIME: 'وقت التحديث',
  TASK_CREATE_TIME: 'وقت الانشاء',
  TASK_SEND_TIME: 'وقت الارسال',
  TASK_MODULE: 'وحدة',
  // 提示消息
  GROUP_EXIST_INFO: 'هل تريد مغادرة المجموعة',
  GROUP_DELETE_INFO: 'هل تريد حذف المجموعة',
  GROUP_DELETE_INFO2: 'وقد حلت المنظمة الحالية',
  GROUP_MEMBER_DELETE_INFO: 'هل تريد حذف المجموعة',
  GROUP_MEMBER_DELETE_INFO2: 'لقد حذفت من المجموعة',
  GROUP_TASK_DELETE_INFO: 'هل تريد حذف المهام؟',

  GROUP_MESSAGE_NULL: 'لا توجد رسالة',
  GROUP_DATA_NULL: 'لا توجد بيانات',
  GROUP_TASK_NULL: 'لا توجد مهمة',
  CREATE_FIRST_GROUP_TASK: 'أنشئ المهمة الأولى',

  INVITE_CORWORK_MEMBERS: 'دعوة اعضاء للعمل',
  DELETE_CORWORK_MEMBERS: 'حذف عضو',
  DELETE_CORWORK_TASK: 'حذف مهمة',

  INVITE_GROUP_MEMBERS: 'دعوة اعضاء للمجموعة',
  INVITE_GROUP_MEMBERS_INFO: 'إذا كنت تريد دعوة الأعضاء فورًا',
  INVITE_GROUP_MEMBERS_ERROR_1: 'المستخدم موجود بالفعل',
  INVITE_GROUP_MEMBERS_ERROR_2: 'قامت المجموعة بدعوة المستخدم',
}
export { Friends }
