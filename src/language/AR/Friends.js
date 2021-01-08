// 好友
const Friends = {
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
  // CustomActions
  MAP: 'خريطة',
  TEMPLATE: 'تنسيق الملف',
  LOCATION: 'الموقع',
  PICTURE: 'صوره',
  LOCATION_FAILED: 'فشل في تحديد الموقع',

  // Cowork need to be translated
  COWORK_MESSAGE: 'Cowork Message', // 待翻译
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

  // 创建群组 待翻译
  MY_GROUPS: 'My Groups',
  JOINED_GROUPS: 'Joined Groups',
  GROUP_MESSAGE: 'Group Message',
  TASK: 'Task',
  TASK_DISTRIBUTION: '新建任务',
  GROUP_CREATE: '创建群组',
  GROUP_DELETE: '解散群组',
  GROUP_APPLY: '申请入群',
  GROUP_EXIST: '退出群组',
  GROUP_INVITE: '邀请入群',
  GROUP_MEMBER_MANAGE: '成员管理',
  GROUP_MEMBER_DELETE: '删除成员',
  GROUP_RESOURCE: '资源管理',
  GROUP_RESOURCE_UPLOAD: '上传数据',
  GROUP_RESOURCE_DELETE: '删除数据',
  GROUP_MANAGE: '管理',
  GROUP_MEMBER: '成员',
  NAME: '名称',
  GROUP_NAME_PLACEHOLDER: '最多输入20字',
  GROUP_TAG: '标签',
  GROUP_TAG_PLACEHOLDER: '多个标签用逗号分隔，最多不超过6个',
  GROUP_REMARK: '备注',
  GROUP_REMARK_PLACEHOLDER: '最多输入100字',
  RESOURCE_SHARER: '资源共享者',
  CREATOR: '创建者',
  ALL_MEMBER: '所有成员',
  GROUP_TYPE: '类型',
  GROUP_TYPE_PRIVATE: '私有',
  GROUP_TYPE_PRIVATE_INFO: '由创建者邀请用户加入群组',
  GROUP_TYPE_PUBLIC: '共有',
  GROUP_TYPE_PUBLIC_INFO: '可有创建者邀请，或者用户申请加入群组',
  GROUP_TYPE_PUBLIC_CHECK_INFO: '用户申请加入该群组时需要审核',
  CREATE: '创建',
  GROUP_CREATE_SUCCUESS: '创建群组成功',
  GROUP_CREATE_FAILED: '创建群组失败',
  GROUP_TAG_NOT_EMPTY: '群组标签不能为空',
  GROUP_NAME_NOT_EMPTY: '群组名不能为空',
  GROUP_ALREADY_JOINED: '已加入该群组',
  GROUP_APPLY_REASON: '申请原因',
  APPLY: 'Apply',
  GROUP_APPLY_INFO: 'Applied',
  GROUP_APPLY_AGREE: 'Agree',
  GROUP_APPLY_REFUSE: 'Refuse',
  GROUP_APPLY_DISAGREE: 'Disagree',
  GROUP_APPLY_ALREADY_AGREE: 'Agreed',
  GROUP_APPLY_ALREADY_DISAGREE: 'Disagreed',
  GROUP_APPLY_TO: 'Apply to Group',
  GROUP_SELECT_MEMBER: '请选择成员',
  GROUP_APPLY_TITLE: '申请加入群组',
  GROUP_APPLY_ALRADY_TITLE: '你的群组申请已经审核',
  APPLICANT: '申请人',
  APPLY_REASON: 'Apply Reason',
  APPLY_TIME: '申请时间',
  GROUP_NAME: '群组名称',
  CHECK_RESULT: '审核结果',
  CHECK_TIME: '审核时间',
  INVITE: '邀请',
  INVITE_REASON: '邀请原因',
  INVITE_SUCCESS: '发送邀请成功',
  INVITE_FAILED: '发送邀请失败',
  INVITE_SEARCH_PLACEHOLDER: '请输入用户昵称',

  RESOURCE_UPLOAD: '开始上传',
  RESOURCE_UPLOAD_SUCCESS: '上传成功',
  RESOURCE_UPLOAD_FAILED: '上传失败',
  RESOURCE_EXPORT_FAILED: '导出失败',
  RESOURCE_EXPORTING: '导出中',
  RESOURCE_UPLOADING: '上传中',
  RESOURCE_DELETE_INFO: '是否删除被选中的数据',
  RESOURCE_SELECT_MODULE: '请选择模板',
  RESOURCE_DOWNLOAD_INFO: '请下载任务',

  TASK_DOWNLOAD: '下载任务',
  TASK_DOWNLOADING: '下载中',
  TASK_TITLE: '任务名称',
  TASK_CREATOR: '所有者',
  TASK_TYPE: '数据类型',
  TASK_UPDATE_TIME: '更新时间',
  TASK_CREATE_TIME: '创建时间',
  TASK_SEND_TIME: '发送时间',
  TASK_MODULE: '模块',
  // 提示消息
  GROUP_EXIST_INFO: '是否退出群组',
  GROUP_DELETE_INFO: '是否解散群组',
  GROUP_MEMBER_DELETE_INFO: '是否删除被选中的成员',

  // 待翻译
  GROUP_MESSAGE_NULL: 'No Message',
  GROUP_DATA_NULL: 'No Data',
  GROUP_TASK_NULL: 'No Task',
  CREATE_FIRST_GROUP_TASK: 'Create the first task',
}
export { Friends }
