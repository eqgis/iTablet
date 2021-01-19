// 好友
const Friends = {
  LOCALE: 'zh-cn',

  LOGOUT: '登录Online账号以联系好友',
  MESSAGES: '消息',
  FRIENDS: '好友',
  GROUPS: '群组',
  ADD_FRIENDS: '添加好友',
  NEW_GROUP_CHAT: '发起群聊',
  RECOMMEND_FRIEND: '好友推荐',
  SELECT_MODULE: '选择模块',
  SELECT_MAP: '选择地图',
  // Friend
  MSG_SERVICE_FAILED: '连接消息服务失败！',
  MSG_SERVICE_NOT_CONNECT: '未能连接消息服务！',
  SEND_SUCCESS: '分享完成',
  SEND_FAIL: '发送失败',
  SEND_FAIL_NETWORK: '分享失败，请检查网络',
  RECEIVE_SUCCESS: '接收完成',
  RECEIVE_FAIL_EXPIRE: '下载失败，文件可能已经过期',
  RECEIVE_FAIL_NETWORK: '下载失败，请检查网络',
  // FriendMessage
  MARK_READ: '标记已读',
  MARK_UNREAD: '标记未读',
  DEL: '删除',
  NOTIFICATION: '消息通知',
  CLEAR_NOTIFICATION: '清空通知消息',
  CONFIRM: '确定',
  CANCEL: '取消',
  ALERT_DEL_HISTORY: '删除后,将清空该聊天的消息记录',
  // FriendList
  SET_MARK_NAME: '设置备注',
  DEL_FRIEND: '删除好友',
  ALERT_DEL_FRIEND: '将该联系人删除,将同时删除与该联系人的聊天记录',
  TEXT_CONTENT: '文本内容',
  INPUT_MARK_NAME: '请输入备注名',
  INPUT_INVALID: '内容不符合规范请重新输入',
  // InformMessage
  TITLE_NOTIFICATION: '通知消息',
  FRIEND_RESPOND: '同意对方添加请求 ？',
  // CreateGroupChat
  CONFIRM2: '确定',
  TITLE_CHOOSE_FRIEND: '选择好友',
  TITLE_CHOOSE_GROUP: '选择群组',
  TITLE_CHOOSE_MEMBER: '选择成员',
  TOAST_CHOOSE_2: '少于两人不能发起群聊',
  NO_FRIEND: '您还未添加好友哦',
  // AddFriend
  ADD_FRIEND_PLACEHOLDER: '邮箱/昵称',
  SEARCHING: '查询中...',
  SEARCH: '搜索',
  ADD_SELF: '不能添加自己为好友哦',
  ADD_AS_FRIEND: '添加对方为好友 ？',
  // FriendGroup
  LOADING: '刷新中...',
  DEL_GROUP: '删除群聊',
  DEL_GROUP_CONFIRM: '清空消息并退出群聊?',
  DEL_GROUP_CONFIRM2: '清空消息并解散群聊?',
  // Chat
  INPUT_MESSAGE: '输入消息...',
  SEND: '发送',
  LOAD_EARLIER: '显示更多消息',
  IMPORT_DATA: '数据导入中',
  IMPORT_SUCCESS: '导入成功',
  IMPORT_FAIL: '导入失败',
  IMPORT_CONFIRM: '是否导入数据',
  RECEIVE_CONFIRM: '是否接收数据',
  OPENCOWORKFIRST: '请先打开协作地图再导入此数据',
  LOCATION_COWORK_NOTIFY: '协作中不能打开位置',
  LOCATION_SHARE_NOTIFY: '分享中不能打开位置',
  WAIT_DOWNLOADING: '请等待数据下载完成',
  DATA_NOT_FOUND: '找不到文件，是否重新下载?',
  LOAD_ORIGIN_PIC: '加载原图',
  // CustomActions
  MAP: '地图',
  TEMPLATE: '模板',
  LOCATION: '位置',
  PICTURE: '图片',
  LOCATION_FAILED: '获取位置失败',
  // Cowork
  SEND_COWORK_INVITE: '是否发送协作邀请？',
  COWORK_INVITATION: '协作邀请',
  COWORK_MEMBER: '协作人员',
  COWORK_IS_END: '协作已结束',
  COWORK_JOIN_FAIL: '暂时无法加入',
  COWORK_UPDATE: '更新',
  COWORK_ADD: '追加',
  COWORK_IGNORE: '忽略',
  NEW_MESSAGE: '新消息',
  NEW_MESSAGE_SHORT: '新消息',
  UPDATING: '更新中',
  SELECT_MESSAGE_TO_UPDATE: '请选择要处理的消息',
  UPDATE_NOT_EXIST_OBJ: '该对象不存在，无法更新',
  ADD_DELETE_ERROR: '不能添加删除对象',
  DELETE_COWORK_ALERT: '是否删除此协作？',
  NO_SUCH_MAP: '无此地图',
  SELF: '我',
  ONLINECOWORK_DISABLE_ADD: '在线协作中，不能添加',
  ONLINECOWORK_DISABLE_OPERATION: '在线协作中，不能进行此操作',
  // RecommendFriend
  FIND_NONE: '未能从联系人中找到新的online好友',
  ALREADY_FRIEND: '你们已经是好友了',
  PERMISSION_DENIED_CONTACT: '请在手机的设置中打开iTablet访问通讯录的权限',
  // ManageFriend/Group
  SEND_MESSAGE: '发消息',
  SET_MARKNAME: '修改备注名',
  SET_GROUPNAME: '修改群名称',
  PUSH_FRIEND_CARD: '推送好友名片',
  FRIEND_MAP: '好友地图',
  ADD_BLACKLIST: '加入黑名单',
  DELETE_FRIEND: '删除好友',
  LIST_MEMBERS: '查看群员',
  MEMBERS: '群成员',
  LEAVE_GROUP: '退出群聊',
  CLEAR_HISTORY: '清空聊天记录',
  DISBAND_GROUP: '解散群',
  DELETE_MEMBER: '移除群员',
  ADD_MEMBER: '邀请群员',
  COWORK: '地图协作',
  EXIT_COWORK: '退出协作',
  GO_COWORK: '协作',
  ALERT_EXIT_COWORK: '是否关闭当前协作地图?',
  SHARE_DATASET: '分享对应数据集',
  // system text
  SYS_MSG_PIC: '[图片]',
  SYS_MSG_MAP: '[地图]',
  SYS_MSG_LAYER: '[图层]',
  SYS_MSG_DATASET: '[数据集]',
  SYS_MSG_ADD_FRIEND: '请求添加您为好友',
  SYS_MSG_REMOVED_FROM_GROUP: '将你移除群聊',
  SYS_MSG_LEAVE_GROUP: '退出了群聊',
  SYS_MSG_ETC: '等 ',
  SYS_MSG_REMOVE_OUT_GROUP: ' 将 ',
  SYS_MSG_REMOVE_OUT_GROUP2: '移出群聊',
  SYS_MSG_ADD_INTO_GROUP: ' 添加 ',
  SYS_MSG_ADD_INTO_GROUP2: '进入群聊',
  SYS_NO_SUCH_USER: '该用户不存在',
  SYS_FRIEND_ALREADY_IN_GROUP: '所选好友已在群组中',
  EXCEED_NAME_LIMIT: '长度需小于40个字符(汉字20个字符)',
  SYS_MSG_MOD_GROUP_NAME: ' 将群名称更改为 ',
  SYS_LOGIN_ON_OTHER_DEVICE: '您的账号已在别的设备上登录',
  SYS_MSG_REJ: '对方还未添加您为好友',
  SYS_FRIEND_REQ_ACCEPT: '你们已经是朋友了，开始聊天吧',
  SYS_INVITE_TO_COWORK: '邀您参加协作',
  SYS_MSG_GEO_ADDED: '添加了',
  SYS_MSG_GEO_DELETED: '删除了',
  SYS_MSG_GEO_UPDATED: '更新了',
  SYS_MSG_GEO_ADDED2: '',
  SYS_MSG_GEO_DELETED2: '',
  SYS_MSG_GEO_UPDATED2: '',
  ADDED: '已添加',

  // 创建群组
  TASK: '任务',
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
  APPLY: '申请',
  GROUP_APPLY_INFO: '已提交申请',
  GROUP_APPLY_AGREE: '同意申请',
  GROUP_APPLY_REFUSE: '拒绝申请',
  GROUP_APPLY_DISAGREE: '不同意申请',
  GROUP_APPLY_ALREADY_AGREE: '已允许该成员加入',
  GROUP_APPLY_ALREADY_DISAGREE: '已拒绝该成员加入',
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