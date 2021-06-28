import CN from '../CN'

// ヒント语
const Prompt: typeof CN.Prompt = {
  YES: 'はい',
  NO: 'いいえ',
  SAVE_TITLE: '現在マップを保存しますか',
  SAVE_YES: '保存',
  SAVE_NO: '保存しない',
  CANCEL: 'キャンセル',
  COMMIT: 'コミット',
  REDO: 'やり直す',
  UNDO: '取り消す',
  SHARE: 'シェア',
  DELETE: '削除',
  WECHAT: 'WeChat',
  BEGIN: '開始',
  STOP: '停止',
  FIELD_TO_PAUSE: '一時停止に失敗しまいｓた',
  WX_NOT_INSTALLED: 'WeChatはありません',
  WX_SHARE_FAILED: 'WeChatにシェアのに失敗しました。WeChatをインストールしているかどうかを確認ください',
  RENAME: '名前変更',
  BATCH_DELETE: 'バッチ削除',
  PREPARING: '準備中',

  DOWNLOAD_SAMPLE_DATA: 'サンプルデータをダウンロードしますか？',
  DOWNLOAD_DATA: 'データのダウンロード', // jp0917
  DOWNLOAD: 'ダウンロード',
  DOWNLOADING: 'ダウンロード中',
  DOWNLOAD_SUCCESSFULLY: 'ダウンロード済',
  DOWNLOAD_FAILED: 'ダウンロードに失敗しました',
  UNZIPPING: '解凍中',
  ONLINE_DATA_ERROR: 'ネットワークデータは壊れました、使用できません',

  NO_REMINDER: '次回からヒントを表示しません',

  LOG_OUT: 'ログアウトしますか？',
  FAILED_TO_LOG: 'ログインに失敗しました',
  INCORRECT_USER_INFO: 'ユーザー名、またはパスワードは不正です',
  INCORRECT_IPORTAL_ADDRESS: 'サーバーアドレスは正かどうかを確認してください',

  DELETE_STOP: '目標ポイントを削除しますか?',
  DELETE_OBJECT: '当オブジェクトを削除しますか?',
  DELETE_LAYER: 'Are you sure you want to permanently delete the layer?', // need to translate
  PLEASE_ADD_STOP: '目標ポイントを追加してください',

  NO_PERMISSION_ALERT: '実行に必要な権限はありません',
  EXIT: '閉じる',
  REQUEST_PERMISSION: '権限の申請',

  CONFIRM: 'OK',
  COMPLETE: '完了',

  OPENING: '開く中',

  QUIT: 'SuperMap iTabletを閉じますか?',
  MAP_LOADING: 'マップロード中',
  LOADING: 'ロード中',
  OPEN_MAP_CONFIRM: 'Whether to open the map', // need to translate
  THE_MAP_IS_OPENED: '当マップは開いています',
  THE_MAP_IS_NOTEXIST: '当マップは存在しません',
  OPEN_MAP_FAILED: 'Failed to open the map', // need to translate
  THE_SCENE_IS_OPENED: '当シーンは開いています',
  NO_SCENE_LIST: 'シーンリストはありません',
  NO_SCENE_SELECTED: 'No scene has been selected', // need to translate
  SWITCHING: 'マップ切り替え中',
  CLOSING: 'マップを閉じています',
  CLOSING_3D: 'マップを閉じています',
  SAVING: 'マップ保存中',
  SWITCHING_SUCCESS: '切替にに成功',
  ADD_SUCCESS: '追加に成功',
  ADD_FAILED: '追加に失敗',
  ADD_MAP_FAILED: '現在マップに追加できません',
  CREATE_THEME_FAILED: '主題図の作成に失敗しました',
  PLEASE_ADD_DATASET: '追加するデータセットを選択してください',
  PLEASE_SELECT_OBJECT: '編集オブジェクトを選択してください',
  SWITCHING_PLOT_LIB: 'アニメシンボルライブラリを切り替え中',
  NON_SELECTED_OBJ: '選択オブジェクトはありません',
  CHANGE_BASE_MAP: '現在ベースマップはありません。ベースマップを切替えてください。',
  OVERRIDE_SYMBOL: '同じIDのシンボルを上書きしますか？', //jp0730
  OVERWRITE: '上書き',
  CHOOSE_DATASET: 'データセットを選択してください',

  PLEASE_SUBMIT_EDIT_GEOMETRY: 'Please Submit Current Geometry',//need to translate

  SET_ALL_MAP_VISIBLE: 'すべて表示',
  SET_ALL_MAP_INVISIBLE: 'すべて非表示',
  LONG_PRESS_TO_SORT: '（長押しソート）',

  PUBLIC_MAP: 'パブリックマップ',
  SUPERMAP_FORUM: 'SuperMap Forum',
  SUPERMAP_KNOW: 'SuperMap Know',
  SUPERMAP_GROUP: 'SuperMap Group',
  INSTRUCTION_MANUAL: 'ヘルプ',
  THE_CURRENT_LAYER: '現在レイヤー',
  NO_BASE_MAP: 'No base map can be removed', // need to translate
  ENTER_KEY_WORDS: '検索キーワード入力してください',
  SEARCHING: '検索中',
  SEARCHING_DEVICE_NOT_FOUND: '外部デバイスは検出されませんでした',
  READING_DATA: 'データ読取中',
  CREATE_SUCCESSFULLY: '作成に成功',
  SAVE_SUCCESSFULLY: '保存に成功',
  NO_NEED_TO_SAVE: '保存する必要はありません',
  SAVE_FAILED: '保存に失敗',
  ENABLE_DYNAMIC_PROJECTION: 'アクティブ投影を使用かどうか',
  TURN_ON: 'はい',
  CREATE_FAILED: '作成に失敗',
  INVALID_DATASET_NAME: 'データセット名は無効で、または存在します',
  SAVE_FAIL_POINT:'Illegal point set length, point set object length must be greater than or equal to 1',//need to translate
  SAVE_LINE_FAIL: 'Illegal point set length, point set object length must be greater than or equal to 2',//need to translate
  SAVE_REGION_FAIL: 'Illegal point set length, point set object length must be greater than or equal to 3',//need to translate

  PLEASE_CHOOSE_POINT_LAYER: 'Please Choose Point Layer',//need to translate
  PLEASE_CHOOSE_LINE_LAYER: 'Please Choose Line Layer',//need to translate
  PLEASE_CHOOSE_REGION_LAYER: 'Please Choose Region Layer',//need to translate

  NO_PLOTTING_DEDUCTION: '現在マップに展開リストはありません',
  NO_FLY: '現在シーンに飛行ルートはありません',
  PLEASE_OPEN_SCENE: 'シーンを開いてください',
  NO_SCENE: 'シーン表示無し',
  ADD_ONLINE_SCENE: 'オンラインシーンの追加',

  PLEASE_ENTER_TEXT: 'テキスト内容を入力してください',
  PLEASE_SELECT_THEMATIC_LAYER: '主題図レイヤーを選択してください',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED: '現在レイヤーにスタイルを設定できません。レイヤーを再度選択してください。',

  PLEASE_SELECT_PLOT_LAYER: 'マークレイヤーを選択、または新規してください',
  DONOT_SUPPORT_ARCORE: '当デバイスはARを対応しません',
  GET_SUPPORTED_DEVICE_LIST: '対応しているデバイスのリストを表示',
  PLEASE_NEW_PLOT_LAYER: '新規マークレイヤーを作成しますか',
  DOWNLOADING_PLEASE_WAIT: 'ダウンロード中、お待ちください',
  DOWNLOADING_OTHERS_PLEASE_WAIT: 'Please wait while other files are being downloaded', // need to translate
  SELECT_DELETE_BY_RECTANGLE: '削除オブジェクトを選択してください',

  CHOOSE_LAYER: '選択レイヤー',

  COLLECT_SUCCESS: 'コレクションに成功',

  SELECT_TWO_MEDIAS_AT_LEAST: '少なくとも2つのメディアファイルを選択してください',
  DELETE_OBJ_WITHOUT_MEDIA_TIPS: 'This object has no media files. Do you want to delete it?', // need to translate

  NETWORK_REQUEST_FAILED: 'ネットワークリクエストに失敗しました',

  SAVEING: '保存中',
  CREATING: '作成中',
  PLEASE_ADD_DATASOURCE: 'データソースを追加してください',
  NO_ATTRIBUTES: '属性無し',
  NO_SEARCH_RESULTS: '検索レコードはありません',

  READING_TEMPLATE: 'テンプレート読取中',
  SWITCHED_TEMPLATE: 'テンプレートは切替されました',
  THE_CURRENT_SELECTION: '現在の選択は ',
  THE_LAYER_DOES_NOT_EXIST: '当レイヤーは存在しません',

  IMPORTING_DATA: 'データインポート中',
  DATA_BEING_IMPORT: 'データインポート中',
  IMPORTING: 'インポート中...',
  IMPORTED_SUCCESS: 'インポートに成功',
  FAILED_TO_IMPORT: 'インポートに失敗',
  IMPORTED_3D_SUCCESS: 'インポート3Dに成功',
  FAILED_TO_IMPORT_3D: 'インポート3Dに失敗',
  DELETING_DATA: 'データ削除中',
  DELETING_SERVICE: 'サービス削除中',
  DELETED_SUCCESS: '削除に成功',
  FAILED_TO_DELETE: '削除に失敗',
  PUBLISHING: '配信サービス中',
  PUBLISH_SUCCESS: '配信に成功',
  PUBLISH_FAILED: '配信に失敗',
  DELETE_CONFIRM: '現在データを削除しますか？',
  BATCH_DELETE_CONFIRM: '現在の選択データを削除しますか？',

  SELECT_AT_LEAST_ONE: '少なくとも1つのデータを削除してください',
  DELETE_MAP_RELATE_DATA: 'データ削除は以下のマップに影響があります。削除しますか？',

  LOG_IN: 'ログイン中',
  ENTER_MAP_NAME: 'マップ名を入力してください',
  CLIP_ENTER_MAP_NAME: 'マップ名を入力してください',
  ENTER_SERVICE_ADDRESS: 'サービスアドレスを入力してください',
  ENTER_ANIMATION_NAME: 'アニメーション名を入力してください',
  ENTER_ANIMATION_NODE_NAME: 'アニメーションノード名入力してください',
  PLEASE_SELECT_PLOT_SYMBOL: 'アニメシンボルシンボルを選択してください',

  ENTER_NAME: '名称を入力してください',
  ENTER_CAPTION: 'Please input caption', // need to translate
  CHOICE_TYPE: 'Please choice type', // need to translate
  INPUT_LENGTH: 'Please input max length', // need to translate
  DEFAULT_VALUE_EROROR: 'Default value input error', // need to translate
  SELECT_REQUIRED: 'Please select required', // need to translate

  CLIPPING: 'マップクリップ中',
  CLIPPED_SUCCESS: 'クリップに成功',
  CLIP_FAILED: 'クリップに失敗',

  LAYER_CANNOT_CREATE_THEMATIC_MAP: '当レイヤーで主題図を作成することをサポートしません',

  ANALYSING: '解析中',
  CHOOSE_STARTING_POINT: '起点を入力してください',
  CHOOSE_DESTINATION: '終点を入力してください',

  LATEST: '最後変更時間: ',
  GEOGRAPHIC_COORDINATE_SYSTEM: '地理座標系: ',
  PROJECTED_COORDINATE_SYSTEM: '投影座標系: ',
  FIELD_TYPE: 'フィールドタイプ: ',

  PLEASE_LOGIN_AND_SHARE: 'ログインしてシェアします',
  PLEASE_LOGIN: 'ログインしてください',
  SHARING: 'シェア中',
  SHARE_SUCCESS: 'シェアに成功',
  SHARE_FAILED: 'シェアに失敗',
  SHARE_PREPARE: 'シェア準備',
  SHARE_START: 'シェア開始',
  SHARE_WX_FILE_SIZE_LIMITE: 'File size cannot exceeds 10M', // need to translate

  EXPORTING: 'エクスポート中',
  EXPORT_SUCCESS: 'エクスポートに成功',
  EXPORT_FAILED: 'エクスポートに失敗',
  EXPORT_TO: 'データエクスポート先：',
  REQUIRE_PRJ_1984: 'データセットの投影座標系はWGS_1984に設定する必要があります',
  EXPORT_TEMP_FAILED: '普通地图不支持导出为模板',//need to translate

  UNDO_FAILED: '取り消すに失敗',
  REDO_FAILED: 'やり直すに失敗',
  RECOVER_FAILED: '復元に失敗',

  SETTING_SUCCESS: '設定に成功',
  SETTING_FAILED: '設定に失敗',
  NETWORK_ERROR: 'ネットワークエラー',
  NO_NETWORK: 'ネットワークに接続しません',
  CHOOSE_CLASSIFY_MODEL: 'モデルタイプを選択してください',
  USED_IMMEDIATELY: 'すぐに使用',
  USING: '使用中',
  DEFAULT_MODEL: 'デフォルトモデル',
  DUSTBIN_MODEL: 'ゴミモデル',
  PLANT_MODEL: '植物モデル',
  CHANGING: '切り替え中',
  CHANGE_SUCCESS: '切り替えに成功',
  CHANGE_FAULT: '切り替えに失敗',
  DETECT_DUSTBIN_MODEL: 'ゴミ箱モデル',
  ROAD_MODEL: '道路モデル',

  LICENSE_EXPIRED: 'トライアルライセンスは期限切れです。続けてトライアルしますか?',
  APPLY_LICENSE: 'ライセンス申請',
  APPLY_LICENSE_FIRST: '有効なライセンスを取得してください',

  GET_LAYER_GROUP_FAILD: 'レイヤーグループの取得に失敗',
  TYR_AGAIN_LATER: '後で再度試してください',

  LOCATING: 'ポジショニング中',
  CANNOT_LOCATION: 'ポジショニングできません',
  INDEX_OUT_OF_BOUNDS: '位置の越境',
  PLEASE_SELECT_LICATION_INFORMATION: 'ポジショニング情報を選択してください',
  OUT_OF_MAP_BOUNDS: 'マップ範囲内にありません',
  CANT_USE_TRACK_TO_INCREMENT_ROAD: '現在位置は道路ネットワークデータセット内にありません。トラックインクリメント道路ネットワークを使用できません。',
  AFTER_COLLECT: 'Please collect before viewing',//need to be translated

  POI: 'POI',

  ILLEGAL_DATA: 'データは無効です',

  UNSUPPORTED_LAYER_TO_SHARE: '当レイヤーのシェアをサポートしません',
  SELECT_DATASET_TO_SHARE: 'シェアするデータセットを選択してください',
  ENTER_DATA_NAME: 'データ名を入力してください',
  SHARED_DATA_10M: 'シェアファイルは10MBを超えします',

  PHIONE_HAS_BEEN_REGISTERED: '携帯番号が登録されました',
  NICKNAME_IS_EXISTS: 'ニックネームは存在しています',
  VERIFICATION_CODE_ERROR: 'ショートメッセージ検証コード不正',
  VERIFICATION_CODE_SENT: '検証コードは送信しました',
  EMAIL_HAS_BEEN_REGISTERED: 'メールアドレスはレジスタされました',
  REGISTERING: 'レジスタ中',
  REGIST_SUCCESS: 'レジスタに成功',
  REGIST_FAILED: 'レジスタに失敗',
  GOTO_ACTIVATE: 'メールでアクティベーションしてください',
  ENTER_CORRECT_MOBILE: '正しい携帯番号を入力してください',
  ENTER_CORRECT_EMAIL: '正しいメールアドレスを入力してください',

  // 設定菜单ヒント情報
  ROTATION_ANGLE_ERROR: '回転角度を-360°～360°に設定してください',
  MAP_SCALE_ERROR: 'スケールの入力は不正です。1つの数字を入力してください',
  VIEW_BOUNDS_ERROR: '範囲の入力は不正です。1つの数字を入力してください',
  VIEW_BOUNDS_RANGE_ERROR: 'パラメータは不正です。ウィンドウの幅、高さを0以上に設定してください',
  MAP_CENTER_ERROR: '座標の入力は不正です。x,yを数字に設定してください',
  COPY_SUCCESS: 'コピーに成功',
  // コピー座標系
  COPY_COORD_SYSTEM_SUCCESS: '座標系のコピーに成功',
  COPY_COORD_SYSTEM_FAIL: '座標系のコピーに失敗',
  ILLEGAL_COORDSYS: '選択ファイルはサポートする座標系ファイルではありません',

  TRANSFER_PARAMS: 'パラメータは不正です。1つの数字を入力してください',
  PLEASE_ENTER: '入力してください',

  REQUEST_TIMEOUT: 'リクエストはタイムアウト',

  IMAGE_RECOGNITION_ING: '識別中',
  IMAGE_RECOGNITION_FAILED: '画像の識別に失敗',

  ERROR_INFO_INVALID_URL: '無効なURL',
  ERROR_INFO_NOT_A_NUMBER: '数字ではありません',
  ERROR_INFO_START_WITH_A_LETTER: '最初の文字は、アルファベットまたはかな・漢字に設定する必要があります',
  ERROR_INFO_ILLEGAL_CHARACTERS: '特殊符号を含むことはできません',
  ERROR_INFO_EMPTY: '空に設定することができません',

  OPEN_LOCATION: 'システムにポジショニングサービスを使用する機能を設定してください',
  REQUEST_LOCATION: 'iTabletはポジショニング権限が必要です',
  LOCATION_ERROR: 'ポジショニング異常、後で再度試してください',

  OPEN_THRID_PARTY: 'サードパーティのアプリケーションにジャンプしようとしています。継続しますか？',

  FIELD_ILLEGAL: 'フィールドは無効です',
  PLEASE_SELECT_A_RASTER_LAYER: 'ラスタレイヤーを選択してください',

  PLEASE_ADD_DATASOURCE_BY_UNIFORM: 'データソースを追加してください',
  CURRENT_LAYER_DOSE_NOT_SUPPORT_MODIFICATION: 'ヒント:現在レイヤーは変更をサポートしません',

  FAILED_TO_CREATE_POINT: 'ポイント追加に失敗',
  FAILED_TO_CREATE_TEXT: '文字に追加失敗',
  FAILED_TO_CREATE_LINE: 'ライン追加に失敗',
  FAILED_TO_CREATE_REGION: 'ポリゴン追加に失敗',
  CLEAR_HISTORY: '検索歴史のクリア',
  // ナビ相关
  SEARCH_AROUND: '周囲を検索',
  GO_HERE: 'ここへ行く',
  SHOW_MORE_RESULT: 'もっと結果を確認',
  PLEASE_SET_BASEMAP_VISIBLE: 'ベースマップ表示できるように設定してください',
  NO_NETWORK_DATASETS: '現在ワークスペースにネットワークデータセットはありません',
  NO_LINE_DATASETS: '現在ワークスペースにラインデータセットはありません',
  NETWORK_DATASET_IS_NOT_AVAILABLE: '現在道路ネットワークデータセットは使用できません。',
  POINT_NOT_IN_BOUNDS: '現在の選択ポイントは道路ネットワークデータセット範囲内にありません',
  POSITION_OUT_OF_MAP: '現在位置はマップナビ範囲外です。シミュレーションナビを使用してください',
  SELECT_DATASOURCE_FOR_NAVIGATION: 'ナビルート解析のデータを選択してください',
  PLEASE_SELECT_NETWORKDATASET: 'ネットワークデータセットを選択してください',
  PLEASE_SELECT_A_POINT_INDOOR: '室内でポイントを選択してください',
  PATH_ANALYSIS_FAILED: 'ルート解析に失敗しました。起点終点を再度選択してください',
  ROAD_NETWORK_UNLINK: '起点、終点の道路ネットワークは接続しません。ルート解析に失敗しました',
  CHANGE_TO_OUTDOOR: 'アウトドアに切替しますか？',
  CHANGE_TO_INDOOR: '屋内に切替しますか',
  SET_START_AND_END_POINTS: '起点、終点を設定してください',
  SELECT_LAYER_NEED_INCREMENTED: 'インクリメントするレイヤーを選択してください',
  SELECT_THE_FLOOR: 'レイヤーがある階を選択してください',
  LONG_PRESS_ADD_START: '長押し起点を追加してください',
  LONG_PRESS_ADD_END: '長押し終点を追加してください',
  ROUTE_ANALYSING: 'ルート解析中',
  DISTANCE_ERROR: '現在開始ポイントの距離は近すぎです、再度選択してください',
  USE_ONLINE_ROUTE_ANALYST: '起始ポイントは道路ネットワークデータセット範囲内にありません、または開始ポイント近くに道路ネットワークはありません。オンラインルート解析を使用しますか？',
  NOT_SUPPORT_ONLINE_NAVIGATION: 'オンラインナビをサポートしません',
  CREATE: '新規',
  NO_DATASOURCE: '現在のワークスペースにはデータソースがありません。新規データソースを作成してください',
  FLOOR: '階', //jp0730
  AR_NAVIGATION: 'AR ナビ',
  ARRIVE_DESTINATION: '目的地に到着しました',
  DEVIATE_NAV_PATH: '計画ルートを外れる',

  //导航增量路网
  SELECT_LINE_DATASET: 'ラインデータセットを選択してください',
  CANT_UNDO: '元に戻すことはできません',
  CANT_REDO: 'やり直すことはできません',
  DATASET_RENAME_FAILED: 'データセット名数字、アルファベット、「_」、「@」、「＃」で構成することが必要です',
  SWITCH_LINE: 'データの切替',
  HAS_NO_ROADNAME_FIELD_DATA: '道路名フィールド情報を選択されていないデータセットがあります',
  MERGE_SUCCESS: 'マージに成功しました',
  MERGE_FAILD: 'マージに失敗しました',
  NOT_SUPPORT_PRJCOORDSYS: '以下のデータセットの座標系はマージをサポートしていません',
  MERGEING: 'マージ中',
  NEW_NAV_DATA: 'ナビデータを作成する',
  INPUT_MODEL_FILE_NAME: 'モデルファイル名を入力してください',
  SELECT_DESTINATION_DATASOURCE: 'ターゲットデータソースを選択してください',
  FILENAME_ALREADY_EXIST: 'ファイルは既に存在しています。ファイル名を再入力してください',
  NETWORK_BUILDING: 'ネットワーク作成中...',
  BUILD_SUCCESS: '道路ネットワークの作成に成功しました',
  SELECT_LINE_SMOOTH: 'スムーズネスラインを選択してください',
  SELECT_A_POINT_INLINE: 'ライン上にあるポイントを選択してください',
  LINE_DATASET: 'ラインデータセット',
  DESTINATION_DATASOURCE: '目標データソース',
  SMOOTH_FACTOR: 'スムーズ係数を入力してください',
  SELECT_EXTEND_LINE: '延長するラインを選択してください',
  SELECT_SECOND_LINE: 'ベースラインを選択してください',
  SELECT_TRIM_LINE: 'トリミングするラインを選択してください',
  SELECT_BASE_LINE: 'ベースラインを選択してください',
  SELECT_RESAMPLE_LINE: 'リサンプリングするラインを選択してください',
  SELECT_CHANGE_DIRECTION_LINE: '方向変更するラインを選択してください',
  EDIT_SUCCESS: '操作に成功しました',
  EDIT_FAILED: '操作に失敗しました',
  SMOOTH_NUMBER_NEED_BIGGER_THAN_2: 'スムーズ係数は2~10間の整数に設定してください',
  CONFIRM_EXIT: '終了しますか？',
  TOPO_EDIT_END: '編集を完了して終了しますか？',
  // 自定义专题图
  ONLY_INTEGER: '整数を入力してください',
  ONLY_INTEGER_GREATER_THAN_2: '２より大きい整数を入力してください',
  PARAMS_ERROR: 'パラメタエラー、設定に失敗しました！',

  SPEECH_TIP: '使用可能語句：\n"拡大"、"縮小"、"ポジショニング"、"閉じる"',
  SPEECH_ERROR: '識別に異常が発生します。後で再度試してください。',
  SPEECH_NONE: 'お話していないようですね',

  NOT_SUPPORT_STATISTIC: '当フィールドを統計をサポートしません',
  ATTRIBUTE_DELETE_CONFIRM: '選択フィールドを削除しますか？',
  ATTRIBUTE_DELETE_TIPS: '属性削除後で、復元できません',
  ATTRIBUTE_DELETE_SUCCESS: '属性フィールドの削除に成功しました',
  ATTRIBUTE_DELETE_FAILED: '属性フィールドの削除に失敗しました',
  ATTRIBUTE_ADD_SUCCESS: '属性の追加に成功しました',
  ATTRIBUTE_ADD_FAILED: '属性の追加に失敗しました',
  ATTRIBUTE_DEFAULT_VALUE_IS_NULL: 'デフォルト値は空です',

  CANNOT_COLLECT_IN_THEMATIC_LAYERS: '主題図レイヤーはコレクションできません',
  CANNOT_COLLECT_IN_CAD_LAYERS: '複合レイヤーはコレクションできません', 
  CANNOT_COLLECT_IN_TEXT_LAYERS: 'テキストレイヤーはコレクションできません', 
  HEAT_MAP_DATASET_TYPE_ERROR: 'ポイントデータセットしか作成できません',

  INVALID_DATA_SET_FAILED: 'データタイプは無効です。設定に失敗しました。', // ｊｐ0917
  INVISIBLE_LAYER_CAN_NOT_BE_SET_CURRENT: '非表示レイヤーを現在レイヤーに設定できません。',

  //三维AR管线相关
  FILE_NOT_EXISTS: 'データが存在しません。サンプルデータをダウンロードしてください',
  MOVE_PHONE_ADD_SCENE: '携帯電話をゆっくり移動してください 平面を認識してからスクリーンをクリックしてシーンを追加してください',
  IDENTIFY_TIMEOUT: 'タイムアウト、再度実行しますか?',
  TRACKING_LOADING: 'トラキング...',
  UNSELECTED_OBJECT: 'Unselected object!', // need to translate

  // 专题制图加载/输出xml
  SUCCESS: '操作に成功しました',
  FAILED: '操作に失敗しました',
  NO_TEMPLATE: '使用可能なテンプレートはありません',
  CONFIRM_LOAD_TEMPLATE: 'テンプレートをロードしますか?',
  CONFIRM_OUTPUT_TEMPLATE: 'マップを出力しますか?',

  SHOW_AR_SCENE_NOTIFY: 'Show AR Scene detect tips', //to be translated
}

export { Prompt }
