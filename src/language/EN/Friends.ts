import CN from '../CN'

// 好友
const Friends: typeof CN.Friends = {
  LOCALE: 'en',

  LOGOUT: 'Log in to Online to keep in touch with your friends',
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
  SEND_FAIL: 'Failed to send the file',
  SEND_FAIL_NETWORK: 'Failed to send the file, please check your network',
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
  TITLE_CHOOSE_GROUP: 'Choose group',
  TITLE_CHOOSE_MEMBER: 'Choose member',
  TOAST_CHOOSE_2: 'Add more than 2 friends to chat in a group',
  NO_FRIEND: 'Oops, no friends yet',
  // AddFriend
  ADD_FRIEND_PLACEHOLDER: 'Email/Nickname',
  SEARCHING: 'Searching...',
  SEARCH: 'SEARCH',
  ADD_SELF: 'Cannot add yourself as a friend',
  ADD_AS_FRIEND: 'Add him/her as a friend?',
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
  UNSUPPORTED_MESSAGE: 'Unsupported Message',
  // CustomActions
  MAP: 'Map',
  TEMPLATE: 'Template',
  LOCATION: 'Location',
  PICTURE: 'Picture',
  LOCATION_FAILED: 'Failed to locate',
  // Cowork
  COWORK_MESSAGE: 'Cowork Message',
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
  UPDATE_NOT_EXIST_OBJ: 'The geometry does not exist',
  ADD_DELETE_ERROR: 'Unable to add the geometry that has been deleted',
  DELETE_COWORK_ALERT: 'Do you want to delete this cowork invitation?',
  NO_SUCH_MAP: "Didn't find this map",
  SELF: 'Me',
  ONLINECOWORK_DISABLE_ADD: 'Unable to add when online cowork',
  ONLINECOWORK_DISABLE_OPERATION: 'Unable to do the operation when online cowork',
  // RecommendFriend
  FIND_NONE: 'Unable to find new friends from your contacts',
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

  // 创建群组
  JOIN: 'Join',
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
  GROUP_TAG_PLACEHOLDER: '6 tags at most separating each with comma',
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
  GROUP_APPLY_ALREADY_DISAGREE: 'Refused',
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
  RESOURCE_NOT_EXIST: 'Resource doesn\'t exist',

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
  GROUP_DELETE_INFO2: 'The current group has been disbanded',
  GROUP_MEMBER_DELETE_INFO: 'Do you want to delete the selected member',
  GROUP_MEMBER_DELETE_INFO2: 'You have been kicked out of the current group',
  GROUP_TASK_DELETE_INFO: 'Do you want to delete tasks?',

  GROUP_MESSAGE_NULL: 'No Message',
  GROUP_DATA_NULL: 'No Data',
  GROUP_TASK_NULL: 'No Task',
  CREATE_FIRST_GROUP_TASK: 'Create the first task',

  INVITE_CORWORK_MEMBERS: 'Invite Members',
  DELETE_CORWORK_MEMBERS: 'Delete Members',
  DELETE_CORWORK_TASK: 'Delete Task',

  INVITE_GROUP_MEMBERS: 'Invite Members',
  INVITE_GROUP_MEMBERS_INFO: 'Whether to invite members immediately',
  INVITE_GROUP_MEMBERS_ERROR_1: 'The user already exists',
  INVITE_GROUP_MEMBERS_ERROR_2: 'The group has invited the user',
}
export { Friends }
