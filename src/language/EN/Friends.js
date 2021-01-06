// 好友
const Friends = {
  LOCALE: 'en',

  LOGOUT: 'Login Online service and keep in touch with your friends',
  MESSAGES: 'Messages',
  FRIENDS: 'Friends',
  GROUPS: 'Groups',
  ADD_FRIENDS: 'Add Friends',
  NEW_GROUP_CHAT: 'New Group Chat',
  RECOMMEND_FRIEND: 'Recommend Friends',
  SELECT_MODULE: 'Select Module',
  SELECT_MAP: 'Select Map',
  // Friend
  MSG_SERVICE_FAILED: 'Failed to connect to message service',
  MSG_SERVICE_NOT_CONNECT: 'Unable to connect to message service',
  SEND_SUCCESS: 'Send successfully',
  SEND_FAIL: 'Failed to send file',
  SEND_FAIL_NETWORK: 'Failed to send file, please check your network',
  RECEIVE_SUCCESS: 'Receive successfully',
  RECEIVE_FAIL_EXPIRE: 'Receive failed, the file might have expired',
  RECEIVE_FAIL_NETWORK: 'Receive failed, please check your network',
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
  SET_MARK_NAME: 'Set mark name',
  DEL_FRIEND: 'Delete friend',
  ALERT_DEL_FRIEND: 'Delete friend as well as the chat history?',
  TEXT_CONTENT: 'Text content',
  INPUT_MARK_NAME: 'Please input mark name',
  INPUT_INVALID: 'Invalid input, please input again',
  // InformMessage
  TITLE_NOTIFICATION: 'Notification',
  FRIEND_RESPOND: 'Accept this friend request?',
  // CreateGroupChat
  CONFIRM2: 'OK',
  TITLE_CHOOSE_FRIEND: 'Choose friend',
  TOAST_CHOOSE_2: 'Add more than 2 friend to chat in group',
  NO_FRIEND: 'Oops,no friend yet',
  // AddFriend
  ADD_FRIEND_PLACEHOLDER: 'Email/Nickname',
  SEARCHING: 'Searching...',
  SEARCH: 'SEARCH',
  ADD_SELF: 'Cannot add yourself as friend',
  ADD_AS_FRIEND: 'Add him/her as friend?',
  // FriendGroup
  LOADING: 'Loading...',
  DEL_GROUP: 'Delete group',
  DEL_GROUP_CONFIRM: 'Would you like to clear chat history and leave this group?',
  DEL_GROUP_CONFIRM2: 'Would you like to clear chat history and disband this group?',
  // Chat
  INPUT_MESSAGE: 'Input message...',
  SEND: 'Send',
  LOAD_EARLIER: 'Load earlier messages',
  IMPORT_DATA: 'Importing data...',
  IMPORT_SUCCESS: 'Import success',
  IMPORT_FAIL: 'Import failed',
  IMPORT_CONFIRM: 'Do you want to import the data?',
  RECEIVE_CONFIRM: 'Do you want to download the data',
  OPENCOWORKFIRST: 'Please open cowork map first before import the data',
  LOCATION_COWORK_NOTIFY: "Can't open location in cowork mode",
  LOCATION_SHARE_NOTIFY: "Can't open location in sharing",
  WAIT_DOWNLOADING: 'Please wait until download completed',
  DATA_NOT_FOUND: 'Data not fond, would you like to download it again?',
  LOAD_ORIGIN_PIC: 'Load Origin',
  // CustomActions
  MAP: 'Map',
  TEMPLATE: 'Template',
  LOCATION: 'Lacation',
  PICTURE: 'Picture',
  LOCATION_FAILED: 'Failed to locate',
  // Cowork
  COWORK_MESSAGE: 'Cowork Message', // 待翻译
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
  ONLINECOWORK_DISABLE_OPERATION: 'Unable to do the operation when online cowork',
  // RecommendFriend
  FIND_NONE: 'Unable to find new frineds from your contacts',
  ALREADY_FRIEND: 'Your are already friends',
  PERMISSION_DENIED_CONTACT: 'Please turn on the permission of iTablet to view contacts',
  // ManageFriend/Group
  SEND_MESSAGE: 'Send message',
  SET_MARKNAME: 'Set Alias',
  SET_GROUPNAME: 'Set group name',
  PUSH_FRIEND_CARD: 'Push friend card',
  FRIEND_MAP: 'Friend map',
  ADD_BLACKLIST: 'Add to blacklist',
  DELETE_FRIEND: 'Delete friend',
  LIST_MEMBERS: 'List members ',
  MEMBERS: 'Members',
  LEAVE_GROUP: 'Leave group',
  CLEAR_HISTORY: 'Clear chat history',
  DISBAND_GROUP: 'Disband group',
  DELETE_MEMBER: 'Remove group member',
  ADD_MEMBER: 'Add group member',
  COWORK: 'Map cowork',
  EXIT_COWORK: 'Exit cowork',
  GO_COWORK: 'Cowork',
  ALERT_EXIT_COWORK: 'Do you want to close current cowork map?',
  SHARE_DATASET: 'Share the dataset',
  // system text
  SYS_MSG_PIC: '[PICTURE]',
  SYS_MSG_MAP: '[MAP]',
  SYS_MSG_LAYER: '[LAYER]',
  SYS_MSG_DATASET: '[DATASET]',
  SYS_MSG_ADD_FRIEND: 'Send a friend request',
  SYS_MSG_REMOVED_FROM_GROUP: 'removed you out of group',
  SYS_MSG_LEAVE_GROUP: 'leaved this group',
  SYS_MSG_ETC: '... ',
  SYS_MSG_REMOVE_OUT_GROUP: ' have removed ',
  SYS_MSG_REMOVE_OUT_GROUP2: 'out of group',
  SYS_MSG_ADD_INTO_GROUP: ' have added ',
  SYS_MSG_ADD_INTO_GROUP2: 'into group',
  SYS_NO_SUCH_USER: 'User not found',
  SYS_FRIEND_ALREADY_IN_GROUP: 'Friends selected already in group',
  EXCEED_NAME_LIMIT: 'Name should be within 40 words (Chinese within 20 words)',
  SYS_MSG_MOD_GROUP_NAME: ' changed the group name to ',
  SYS_LOGIN_ON_OTHER_DEVICE: 'Your account is logged in on other device',
  SYS_MSG_REJ: "The opposite haven't added you as friend yet",
  SYS_FRIEND_REQ_ACCEPT: "You're friends now, enjoy taking!",
  SYS_INVITE_TO_COWORK: ' invites you to join the cowork',
  SYS_MSG_GEO_ADDED: 'Added',
  SYS_MSG_GEO_DELETED: 'Deleted',
  SYS_MSG_GEO_UPDATED: 'Updated',
  SYS_MSG_GEO_ADDED2: '',
  SYS_MSG_GEO_DELETED2: '',
  SYS_MSG_GEO_UPDATED2: '',
  ADDED: 'Added',

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
  GROUP_APPLY_ALREADY_DISAGREE: 'Refused',
  GROUP_APPLY_TO: 'Apply to Group',
  GROUP_SELECT_MEMBER: '请选择成员',
  GROUP_APPLY_TITLE: '申请加入群组',
  GROUP_APPLY_ALRADY_TITLE: '你的群组申请已经审核',
  APPLICANT: '申请人',
  APPLY_REASON: '申请原因',
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
}
export { Friends }
