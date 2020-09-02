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
  SELECT_MAP: '选择地图',
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
  MARK_READ: 'Mark read', //*
  MARK_UNREAD: 'Mark unread', //*
  DEL: 'Delete', //*
  NOTIFICATION: 'Notification', //*
  CLEAR_NOTIFICATION: 'Clear notification', //*
  CONFIRM: 'Yes', //*
  CANCEL: 'Cancel', //*
  ALERT_DEL_HISTORY: 'Clear this chat history?', //*
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
  ADD_FRIEND_PLACEHOLDER: 'البريد الإلكتروني / الهاتف / اللقب',
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
  
  // Cowork 待翻译
  SEND_COWORK_INVITE: 'Do you want to send the cowork invitation?',
  COWORK_INVITATION: 'Cowork Invitation',
  COWORK_MEMBER: 'Cowork Members',
  COWORK_IS_END: 'The cowork has ended',
  COWORK_JOIN_FAIL: 'Unable to join this cowork now',
  COWORK_UPDATE: 'Update',
  COWORK_ADD: 'Add',
  COWORK_IGNORE: 'Ignore',
  NEW_MESSAGE: 'New Message',
  NEW_MESSAGE_SHORT: 'New',
  UPDATING: 'Updating',
  SELECT_MESSAGE_TO_UPDATE: 'Please select a message to update',
  UPDATE_NOT_EXIST_OBJ: 'The geometry is not exist, unbale to update',
  ADD_DELETE_ERROR: 'Unbale to add the deleted geometry',
  DELETE_COWORK_ALERT: 'Do you want to delete this cowork invitation?',
  NO_SUCH_MAP: "Didn't find this map",
  SELF: 'Me',
  ONLINECOWORK_DISABLE_ADD: 'Unable to add when online cowork',
  ONLINECOWORK_DISABLE_OPERATION: 'Unable to do the operation when online cowork', //待翻译
  
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
  ADD_BLACKLIST: 'أضف إلى قائمة الحذر',
  DELETE_FRIEND: 'حذف صديق',
  LIST_MEMBERS: 'أعضاء القائمة',
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
  SYS_NO_SUCH_USER: 'المستخد غير موجود',
  SYS_FRIEND_ALREADY_IN_GROUP: 'تم تحديد الأصدقاء بالفعل في المجموعة',
  EXCEED_NAME_LIMIT: 'يجب أن يكون الاسم في حدود 40 كلمة',
  SYS_MSG_MOD_GROUP_NAME: 'تم تغيير اسم المجموعة إلى',
  SYS_LOGIN_ON_OTHER_DEVICE: 'تم تسجيل حسابك على جهاز آخر',
  SYS_MSG_REJ: 'المقابل لم يضفك كصديق بعد',
  SYS_FRIEND_REQ_ACCEPT: 'أنتم أصدقاء الأن,استمتعو بالحديث',
  
  // 待翻译
  SYS_INVITE_TO_COWORK: ' invites you to join the cowork',
  SYS_MSG_GEO_ADDED: 'Added',
  SYS_MSG_GEO_DELETED: 'Deleted',
  SYS_MSG_GEO_UPDATED: 'Updated',
  
  SYS_MSG_GEO_ADDED2: '',
  SYS_MSG_GEO_DELETED2: '',
  SYS_MSG_GEO_UPDATED2: '',
}
export { Friends }
