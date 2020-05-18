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
  // Friend
  MSG_SERVICE_FAILED: 'メッセージサービスに接続のに失敗しました！',
  MSG_SERVICE_NOT_CONNECT: 'メッセージサービスに接続しません！',
  SEND_SUCCESS: 'シェア完了',
  SEND_FAIL: '送信に失敗',
  SEND_FAIL_NETWORK: 'シェアに失敗しました、ネットワークを確認してください',
  RECEIVE_SUCCESS: '受信完了',
  RECEIVE_FAIL_EXPIRE:
    'ダウンロードに失敗しました。ファイルは期限切れる可能性があります。',
  RECEIVE_FAIL_NETWORK:
    'ダウンロードに失敗しました、ネットワークを確認してください',
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
  ADD_FRIEND_PLACEHOLDER: 'メールアドレス/携帯電話/ニックネーム',
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
  SEND_COWORK_INVITE: 'マップコラボレーション招待状を送りしますか',
  COWORK_INVITATION: 'マップコラボレーション招待',
  COWORK_MEMBER: 'コラボメンバー',
  COWORK_IS_END: 'マップコラボレーションは終了しました',
  COWORK_JOIN_FAIL: '現在参加することができません',
  COWORK_UPDATE: '更新',
  COWORK_ADD: '追加',
  COWORK_IGNORE: '無視',
  NEW_MESSAGE: 'ニューメッセージ',
  NEW_MESSAGE_SHORT: 'メッセージ',
  UPDATING: '更新中',
  SELECT_MESSAGE_TO_UPDATE: 'アップデートしたいメッセージを選んでください',
  UPDATE_NOT_EXIST_OBJ: 'オブジェクトは存在しないてめ更新できません',
  ADD_DELETE_ERROR: '削除されたオブジェクトの追加はできません',
  // RecommendFriend
  FIND_NONE: '連絡先から新しいonline友達を見つかりません',
  ALREADY_FRIEND: 'あなたたちはもう友達です。 ',
  PERMISSION_DENIED_CONTACT:
    '携帯の設定でiTabletのアドレス帳アクセス権限を設定してください',
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
  CLEAR_HISTORY: 'チャットレコードのクリア',
  DISBAND_GROUP: 'グループの解除',
  DELETE_MEMBER: 'グループメンバーの削除',
  ADD_MEMBER: 'グループメンバーを招待',
  COWORK: 'マップコラボレーション',
  EXIT_COWORK: 'コラボレーションを閉じる',
  GO_COWORK: 'コラボレーション',
  ALERT_EXIT_COWORK: '現在のコラボレーションマップを閉じますか?',
  SHARE_DATASET: '対応データセットを同時にシェア',
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
  SYS_INVITE_TO_COWORK: 'はあなたをマップコラボレーションに招待してます',
  SYS_MSG_GEO_ADDED: '',
  SYS_MSG_GEO_DELETED: '',
  SYS_MSG_GEO_UPDATED: '',
  SYS_MSG_GEO_ADDED2: 'を追加しました',
  SYS_MSG_GEO_DELETED2: 'を削除しました',
  SYS_MSG_GEO_UPDATED2: 'を更新しました',
}
export { Friends }
