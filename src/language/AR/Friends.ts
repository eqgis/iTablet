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
  TITLE_CHOOSE_GROUP: 'Choose group', //待翻译
  TITLE_CHOOSE_MEMBER: 'Choose member', //待翻译
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
  JOIN: 'Join', // 待翻译
  TITLE_CHOOSE_MEMBER: 'Select Members',
  VIEW_MORE_MEMBERS: 'View more members',
  MY_GROUPS: 'My Groups',
  JOINED_GROUPS: 'Joined Groups',
  GROUP_MESSAGE: 'Group Message',
  TASK: 'Task',
  TASK_DISTRIBUTION: 'New Task',
  GROUP_CREATE: 'Create Group',
  GROUP_DELETE: 'Delete Group',
  GROUP_APPLY: 'Join Group',
  GROUP_EXIST: 'Leave Group',
  GROUP_INVITE: 'Add Member',
  GROUP_SETTING: 'Group Setting',
  GROUP_MEMBER_MANAGE: 'Manage Members',
  GROUP_MEMBER_DELETE: 'Delete Member',
  GROUP_RESOURCE: 'Manage Resource',
  GROUP_RESOURCE_UPLOAD: 'Upload Data',
  GROUP_RESOURCE_DELETE: 'Delete Data',
  GROUP_MANAGE: 'Manage',
  GROUP_MEMBER: 'Member',
  NAME: 'Name',
  GROUP_NAME_PLACEHOLDER: 'Please enter at most 20 characters for Name',
  GROUP_TAG: 'Tag',
  GROUP_TAG_PLACEHOLDER: '6 tags at most seperating each with comma',
  GROUP_REMARK: 'Note',
  GROUP_REMARK_PLACEHOLDER: 'Please enter at most 100 characters for Note',
  RESOURCE_SHARER: 'Sharer',
  CREATOR: 'Creator',
  ALL_MEMBER: 'All Members',
  GROUP_TYPE: 'Type',
  GROUP_TYPE_PRIVATE: 'Private',
  GROUP_TYPE_PRIVATE_INFO: 'The creator invites members to the group',
  GROUP_TYPE_PUBLIC: 'Public',
  GROUP_TYPE_PUBLIC_INFO: 'The creator invites members to the group. Or members can apply to join the group.',
  GROUP_TYPE_PUBLIC_CHECK_INFO: 'The creator needs to audit the new application',
  CREATE: 'Create',
  GROUP_CREATE_SUCCUESS: 'Successfully created a group',
  GROUP_CREATE_FAILED: 'Failed to create a group',
  GROUP_TAG_NOT_EMPTY: 'Please enter the group label',
  GROUP_NAME_NOT_EMPTY: 'Please name the group',
  GROUP_ALREADY_JOINED: 'Joined the group',
  GROUP_APPLY_REASON: 'Applied Reason',
  APPLY: 'Apply',
  GROUP_APPLY_INFO: 'Applied',
  GROUP_APPLY_AGREE: 'Agree',
  GROUP_APPLY_REFUSE: 'Refuse',
  GROUP_APPLY_DISAGREE: 'Disagree',
  GROUP_APPLY_ALREADY_AGREE: 'Agreed',
  GROUP_APPLY_ALREADY_DISAGREE: 'Disagreed',
  GROUP_APPLY_TO: 'Apply to Group',
  GROUP_SELECT_MEMBER: 'Please select members',
  GROUP_APPLY_TITLE: 'Apply to join the group',
  GROUP_APPLY_ALRADY_TITLE: 'The application has been audited',
  APPLICANT: 'Applicant',
  APPLY_REASON: 'Apply Reason',
  APPLY_TIME: 'Applied Time',
  GROUP_NAME: 'Group Name',
  CHECK_RESULT: 'Audit Result',
  CHECK_TIME: 'Audited Time',
  APPLY_MESSAGE: 'Apply Message',
  INVITE: 'Invite',
  INVITE_MESSAGE: 'Invitation message',
  INVITE_TO: 'Invite you to join',
  INVITE_REASON: 'Invited Reason',
  INVITE_SUCCESS: 'Successfully sent the invitation',
  INVITE_FAILED: 'Failed to send the invitation',
  INVITE_SEARCH_PLACEHOLDER: 'Please enter nickname',

  RESOURCE_UPLOAD: 'Upload',
  RESOURCE_UPLOAD_SUCCESS: 'Successfully uploaded',
  RESOURCE_UPLOAD_FAILED: 'Failed to upload',
  RESOURCE_EXPORT_FAILED: 'Failed to export',
  RESOURCE_EXPORTING: 'Exporting',
  RESOURCE_UPLOADING: 'Uploading',
  RESOURCE_DELETE_INFO: 'Are you sure you want to delete the selected data',
  RESOURCE_SELECT_MODULE: 'Please select a template',
  RESOURCE_DOWNLOAD_INFO: 'Please download the task',

  TASK_DOWNLOAD: 'Download Task',
  TASK_DOWNLOADING: 'Downloading',
  TASK_TITLE: 'Cowork Task',
  TASK_MAP: 'Cowork Map',
  TASK_CREATOR: 'Creator',
  TASK_TYPE: 'Data Type',
  TASK_UPDATE_TIME: 'Updated Time',
  TASK_CREATE_TIME: 'Created Time',
  TASK_SEND_TIME: 'Sent Time',
  TASK_MODULE: 'Module',
  // 提示消息
  GROUP_EXIST_INFO: 'Do you want to leave the group',
  GROUP_DELETE_INFO: 'Do you want to delete the group',
  GROUP_DELETE_INFO2: 'The current group has been disbanded', // 待翻译
  GROUP_MEMBER_DELETE_INFO: 'Do you want to delete the selected member',
  GROUP_MEMBER_DELETE_INFO2: 'You have been kicked out of the current group', // 待翻译
  GROUP_TASK_DELETE_INFO: 'Do you want to delete tasks?',

  // 待翻译
  GROUP_MESSAGE_NULL: 'No Message',
  GROUP_DATA_NULL: 'No Data',
  GROUP_TASK_NULL: 'No Task',
  CREATE_FIRST_GROUP_TASK: 'Create the first task',

  INVITE_CORWORK_MEMBERS: 'Invite Members',
  DELETE_CORWORK_MEMBERS: 'Delete Members',
  DELETE_CORWORK_TASK: 'Delete Task',

  INVITE_GROUP_MEMBERS: 'Inivite Members',
  INVITE_GROUP_MEMBERS_INFO: 'Whether to invite members immediately',
  INVITE_GROUP_MEMBERS_ERROR_1: 'The user already exists',
  INVITE_GROUP_MEMBERS_ERROR_2: 'The group has invited the user',
}
export { Friends }
