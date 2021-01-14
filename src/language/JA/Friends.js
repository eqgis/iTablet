// 友達
const Friends = {
  LOCALE: 'ja-jp',

  LOGOUT: 'Onlineアカウントにログインして、友達に連絡',
  MESSAGES: 'メッセージ',
  FRIENDS: '友達',
  GROUPS: 'グループ',
  ADD_FRIENDS: '友達の追加',
  NEW_GROUP_CHAT: 'グループチャットを開始',
  RECOMMEND_FRIEND: '友達推奨',
  SELECT_MODULE: 'モジュールの選択',
  SELECT_MAP: 'マップの選択',
  // Friend
  MSG_SERVICE_FAILED: 'メッセージサービスに接続のに失敗しました！',
  MSG_SERVICE_NOT_CONNECT: 'メッセージサービスに接続しません！',
  SEND_SUCCESS: 'シェア完了',
  SEND_FAIL: '送信に失敗',
  SEND_FAIL_NETWORK: 'シェアに失敗しました、ネットワークを確認してください',
  RECEIVE_SUCCESS: '受信完了',
  RECEIVE_FAIL_EXPIRE: 'ダウンロードに失敗しました。ファイルは期限切れる可能性があります。',
  RECEIVE_FAIL_NETWORK: 'ダウンロードに失敗しました、ネットワークを確認してください',
  // FriendMessage
  MARK_READ: '既読にする',
  MARK_UNREAD: '未読にする',
  DEL: '削除',
  NOTIFICATION: 'メッセージ通知',
  CLEAR_NOTIFICATION: '通知メッセージのクリア',
  CONFIRM: 'OK',
  CANCEL: 'キャンセル',
  ALERT_DEL_HISTORY: '削除後で、チャットのレコードをクリアします',
  // FriendList
  SET_MARK_NAME: '備考の設定',
  DEL_FRIEND: '友達の削除',
  ALERT_DEL_FRIEND: '当連絡先を削除すると、チャットレコードを削除します录',
  TEXT_CONTENT: 'テキスト内容',
  INPUT_MARK_NAME: '備考名を入力してください',
  INPUT_INVALID: '内容は無効です。再度入力してください',
  // InformMessage
  TITLE_NOTIFICATION: '通知メッセージ',
  FRIEND_RESPOND: '追加要求に同意します ？',
  // CreateGroupChat
  CONFIRM2: 'OK',
  TITLE_CHOOSE_FRIEND: '友達の選択',
  TOAST_CHOOSE_2: '2人以下ではグループチャットを開始できません',
  NO_FRIEND: 'まだ友達を追加していません',
  // AddFriend
  ADD_FRIEND_PLACEHOLDER: 'メールアドレス/ニックネーム',
  SEARCHING: '検索中...',
  SEARCH: '検索',
  ADD_SELF: '自分は友達として追加できません',
  ADD_AS_FRIEND: '相手を友達に追加 ？',
  // FriendGroup
  LOADING: '更新中...',
  DEL_GROUP: 'グループチャットの削除',
  DEL_GROUP_CONFIRM: 'メッセージをクリアして、閉じますか?',
  DEL_GROUP_CONFIRM2: 'メッセージをクリアして、解除ますか?',
  // Chat
  INPUT_MESSAGE: 'メッセージ入力...',
  SEND: '送信',
  LOAD_EARLIER: 'もっとメッセージを表示',
  IMPORT_DATA: 'データインポート中',
  IMPORT_SUCCESS: 'インポートに成功',
  IMPORT_FAIL: 'インポートに失敗',
  IMPORT_CONFIRM: 'データをインポートかどうか',
  RECEIVE_CONFIRM: 'データ受信かどうか',
  OPENCOWORKFIRST: 'コラボレーションマップを開いて、当データをインポートします',
  LOCATION_COWORK_NOTIFY: 'コラボレーション中、位置を開けません',
  LOCATION_SHARE_NOTIFY: 'シェア中、位置を開けません',
  WAIT_DOWNLOADING: 'データダウンロード完了を待ってください',
  DATA_NOT_FOUND: 'ファイルを見つかりません。再度ダウンロードしますか?',
  LOAD_ORIGIN_PIC: '原図のロード',
  // CustomActions
  MAP: 'マップ',
  TEMPLATE: 'テンプレート',
  LOCATION: '位置',
  PICTURE: '画像',
  LOCATION_FAILED: '位置取得にに失敗',
  // Cowork
  COWORK_MESSAGE: 'Cowork Message', // 待翻译
  SEND_COWORK_INVITE: 'コラボレーション招待を送りしますか',
  COWORK_INVITATION: 'マップコラボレーション招待',
  COWORK_MEMBER: 'コラボレーションメンバー',
  COWORK_IS_END: 'コラボレーションは終了しました',
  COWORK_JOIN_FAIL: '現在参加することができません',
  COWORK_UPDATE: '更新',
  COWORK_ADD: '追加',
  COWORK_IGNORE: '無視',
  NEW_MESSAGE: '新しメッセージ',
  NEW_MESSAGE_SHORT: 'メッセージ',
  UPDATING: '更新中',
  SELECT_MESSAGE_TO_UPDATE: '処理するメッセージを選択してください',
  UPDATE_NOT_EXIST_OBJ: 'オブジェクトは存在しない、更新できません',
  ADD_DELETE_ERROR: '削除されたオブジェクトの追加はできません',
  DELETE_COWORK_ALERT: 'コラボレーションを削除しますか',
  NO_SUCH_MAP: '当マップはありません',
  SELF: '自分',
  ONLINECOWORK_DISABLE_ADD: 'オンラインコラボ中、追加できません',
  ONLINECOWORK_DISABLE_OPERATION: 'オンラインコラボ中、当操作を実行できません', //ｊｐ０７３０
  // RecommendFriend
  FIND_NONE: '連絡先から新しいonline友達を見つかりません',
  ALREADY_FRIEND: 'あなたたちはもう友達です。 ',
  PERMISSION_DENIED_CONTACT: '携帯の設定でiTabletのアドレス帳アクセス権限を設定してください',
  // ManageFriend/Group
  SEND_MESSAGE: 'メッセージを送信',
  SET_MARKNAME: '備考名の変更',
  SET_GROUPNAME: 'グループ名の変更',
  PUSH_FRIEND_CARD: '友達の名刺を送る ',
  FRIEND_MAP: '友達マップ',
  ADD_BLACKLIST: 'ブラックリストに追加',
  DELETE_FRIEND: '友達の削除',
  LIST_MEMBERS: 'グループメンバーの表示',
  LEAVE_GROUP: 'グループチャットを閉じる',
  MEMBERS: 'Members', // 待翻译
  CLEAR_HISTORY: 'チャットレコードのクリア',
  DISBAND_GROUP: 'グループの解除',
  DELETE_MEMBER: 'グループメンバーの削除',
  ADD_MEMBER: 'グループメンバーを招待',
  COWORK: 'マップコラボレーション',
  EXIT_COWORK: 'コラボレーションを閉じる',
  GO_COWORK: 'コラボレーション',
  ALERT_EXIT_COWORK: '現在のコラボレーションマップを閉じますか?',
  SHARE_DATASET: '対応データセットをシェア',
  // system text
  SYS_MSG_PIC: '[画像]',
  SYS_MSG_MAP: '[マップ]',
  SYS_MSG_LAYER: '[レイヤー]',
  SYS_MSG_DATASET: '[データセット]',
  SYS_MSG_ADD_FRIEND: 'あなたを友達に追加することを要求します',
  SYS_MSG_REMOVED_FROM_GROUP: 'グループチャットから削除します',
  SYS_MSG_LEAVE_GROUP: 'グループチャットと閉じます',
  SYS_MSG_ETC: '等 ',
  SYS_MSG_REMOVE_OUT_GROUP: '  ',
  SYS_MSG_REMOVE_OUT_GROUP2: 'グループチャットからを削除',
  SYS_MSG_ADD_INTO_GROUP: ' 追加 ',
  SYS_MSG_ADD_INTO_GROUP2: 'グループチャットに入ります',
  SYS_NO_SUCH_USER: '当ユーザーは存在しません',
  SYS_FRIEND_ALREADY_IN_GROUP: '選択友達はグループにいます',
  EXCEED_NAME_LIMIT: '長さは40個の文字(漢字20個)以下に設定してください',
  SYS_MSG_MOD_GROUP_NAME: ' グループ名を に変更',
  SYS_LOGIN_ON_OTHER_DEVICE: 'アカウントは他のデバイスでログインしました',
  SYS_MSG_REJ: '相手はあなたをまだ友達に追加していません',
  SYS_FRIEND_REQ_ACCEPT: '友達になりました。チャットを開始してください。',
  SYS_INVITE_TO_COWORK: 'はあなたをコラボレーションに招待してます',
  SYS_MSG_GEO_ADDED: '',
  SYS_MSG_GEO_DELETED: '',
  SYS_MSG_GEO_UPDATED: '',
  SYS_MSG_GEO_ADDED2: 'を追加しました',
  SYS_MSG_GEO_DELETED2: 'を削除しました',
  SYS_MSG_GEO_UPDATED2: 'を更新しました',

  ADDED: 'Added', // 待翻译

  // 创建群组 待翻译
  TITLE_CHOOSE_MEMBER: 'Select Members',
  VIEW_MORE_MEMBERS: 'View more members',
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
  GROUP_SETTING: 'Group Setting',
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
  APPLY_MESSAGE: 'Apply Message',
  INVITE: 'Invite',
  INVITE_MESSAGE: 'Invitation message',
  INVITE_TO: 'Invite you to join',
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
  TASK_TITLE: 'Cowork Task',
  TASK_MAP: 'Cowork Map',
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

  INVITE_CORWORK_MEMBERS: 'Invite Members',
  DELETE_CORWORK_MEMBERS: 'Delete Members',
}
export { Friends }
