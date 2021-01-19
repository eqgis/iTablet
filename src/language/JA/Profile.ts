import CN from '../CN'

// 我的、发现
const Profile: typeof CN.Profile = {
  // 我的  主页ポリゴン
  LOGIN_NOW: 'ログイン',
  IMPORT: 'インポート',
  DATA: 'データ',
  MARK: 'マーク',
  MAP: 'マップ',
  SCENE: 'シーン',
  BASEMAP: 'ベースマップ',
  SYMBOL: 'シンボル',
  SETTINGS: '設定',
  COLOR_SCHEME: 'カラースキーム',
  TEMPLATE: 'テンプレート',
  AIMODEL: 'AI モデル', //jp0730
  COLLECTION_TEMPLATE: 'コレクションテンプレート',
  PLOTTING_TEMPLATE: 'アニメシンボルテンプレート',
  NAVIGATION: 'ナビ',
  INCREMENT: 'インクリメント',
  ENCLOSURE: 'フェンス',

  MY_COLOR_SCHEME: 'マイカラースキーム', //jp0730
  MY_MODEL: 'マイモデル', //jp0730

  SELECT_MODEL: 'モデルの選択', //jp0730

   // 我的  提示语
   MY_GUIDE: 'After import data\ncan be opened in the home module',//待翻译
   MY_GUIDE_KNOW:'Know it',//待翻译
   MY_GUIDE_SLIDE: 'Draw up to check',//待翻译
   MY_GUIDE_SLIDE_LAND:'Draw left to check',//待翻译
   EFFECT_GUIDE:'Add effect to scene',//待翻译
   LAUNCH_GUIDE:'Add video,words,picture,web to the scene',//待翻译
   MEASURE_GUIDE:'Measure the distance, height and area',//待翻译
   MY_GUIDE_NEXT:'Next',//待翻译
   MY_GUIDE_SKIP:'Skip',//待翻译

  // 我的——登录
  LOGIN: 'ログイン',
  LOGINING: 'Logining..',//待翻译
  LOGIN_TIMEOUT: 'ログインタイムアウト、後で再度試してださい。',
  LOGIN_CURRENT: '現在ユーザーはログインしました。',
  LOGIN_INVALID: 'ログインに失敗しました。再度ログインしてください。',
  MOBILE_LOGIN: '携帯ログイン',
  EMAIL_LOGIN: 'メールログイン',
  ENTER_EMAIL_OR_USERNAME: 'メールアドレスまたはニックネームを入力してください',
  ENTER_MOBILE: '携帯番号を入力してください',
  USERNAME_ALL: '携帯番号/メールアドレス/ニックネーム',
  ENTER_USERNAME_ALL: '携帯番号、メールアドレスまたはニックネームを入力してください',
  ENTER_PASSWORD: 'パスワードを入力してください',
  RE_ENTER_PASSWORD: 'Please re-enter your password', //待翻译
  PASSWORD_DISMATCH: 'The passwords are different, please check again',
  REGISTER: 'レジスタ',
  FORGET_PASSWORD: 'パスワードを忘れましたか？',
  RESET_PASSWORD: 'パスワードの再設定',
  MOBILE_REGISTER: '携帯レジスト',
  EMAIL_REGISTER: 'メールレジスト',
  ENTER_USERNAME: 'ニックネームを入力してください',
  ENTER_USERNAME2: 'ユーザー名を入力してください',
  ENTER_CODE: '検証コードを入力してください',
  GET_CODE: '検証コードの取得',
  ENTER_EMAIL: 'メールアドレスを入力してください',
  ENTER_SERVER_ADDRESS: 'サービスアドレスを入力してください',
  ENTER_VALID_SERVER_ADDRESS: '有効なサービスアドレスを入力してください',
  ENTER_REALNAME: '本名を入力してください',
  ENTER_COMPANY: '組織を入力してください',
  REGISTER_READ_PROTOCAL: '閲読済み、受け取ります。 ',
  REGISTER_ONLINE_PROTOCAL: '《スーパーマップユーザーサービス協議 》',
  CONNECTING: '接続中',
  CONNECT_SERVER_FAIL: 'サーバーに接続できません。ネットワーク、サーバーアドレスを確認してください。',
  NEXT: '次へ',

  SWITCH_ACCOUNT: 'アカウントの切替',
  LOG_OUT: 'ログアウト',

  SWITCH: '切替',
  SWITCH_CURRENT: '現在ユーザーを使用中、切替できません',
  SWITCHING: '切替中...',
  SWITCH_FAIL: '切替に失敗しました。当ユーザーを再度ログインしてください。',

  // マップサービスアドレス
  SERVICE_ADDRESS: 'サービスアドレス',
  MAP_NAME: 'マップ名',
  ENTER_SERVICE_ADDRESS: 'サービスアドレスを入力してください',
  SAVE: '保存',

  // 我的サービス
  SERVICE: 'サービス',
  MY_SERVICE: 'サービス',
  PRIVATE_SERVICE: 'プライベートサービス',
  PUBLIC_SERVICE: 'パブリックサービス',

  // 个人主页
  MY_ACCOUNT: '個人ホームページ',
  PROFILE_PHOTO: 'プロフィール写真',
  USERNAME: 'ユーザー名',
  PHONE: '携帯番号',
  E_MAIL: 'メールアドレス',
  CONNECT: 'バインディング',
  MANAGE_ACCOUNT: 'アカウント管理',
  ADD_ACCOUNT: 'アカウントの追加',
  DELETE_ACCOUNT: 'アカウントの削除',
  UNABLE_DELETE_SELF: '現在ユーザーは削除されません',

  DELETE: '削除',
  SELECT_ALL: 'すべて選択',
  DESELECT_ALL: '選択の反転',

  // データ削除エクスポート
  SHARE: 'シェア',
  PATH: 'パス',

  LOCAL: 'ローカル',
  SAMPLEDATA: 'サンプルデータ',
  ON_DEVICE: '外部データ',
  EXPORT_DATA: 'データのエクスポート',
  IMPORT_DATA: 'データのインポート',
  UPLOAD_DATA: 'データのシェア',
  DELETE_DATA: 'データの削除',
  OPEN_DATA: 'データを開く',
  NEW_DATASET: '新規データセット',
  UPLOAD_DATASET: 'データセットのシェア',
  DELETE_DATASET: 'データセットの削除',
  UPLOAD_MAP: 'マップのシェア',
  EXPORT_MAP: 'マップのエクスポート',
  DELETE_MAP: 'マップの削除',
  UPLOAD_SCENE: 'シーンのシェア',
  DELETE_SCENE: 'シーンの削除',
  UPLOAD_SYMBOL: 'シンボルのシェア',
  DELETE_SYMBOL: 'シンボルの削除',
  UPLOAD_TEMPLATE: 'テンプレートのシェア',
  DELETE_TEMPLATE: 'テンプレートの削除',
  UPLOAD_MARK: 'マークのシェア',
  DELETE_MARK: 'マークの削除',
  UPLOAD_COLOR_SCHEME: 'カラースキームのシェア',
  DELETE_COLOR_SCHEME: 'カラースキームの削除',
  BATCH_SHARE: 'バッチシェア',
  BATCH_DELETE: 'バッチ削除',
  BATCH_ADD: 'バッチ追加',
  BATCH_OPERATE: 'バッチ操作',
  MY_APPLET: '使用できるアプレット',
  UN_DOWNLOADED_APPLET: 'アプレットダウンロードの取り消し', // 带下载
  DELETE_APPLET: 'アプレットの削除',
  ADD_APPLET: 'アプレットの追加',
  MOVE_UP: '上へ',
  MOVE_DOWN: '下へ',

  DELETE_SERVICE: 'サービスの削除',
  PUBLISH_SERVICE: 'サービスの配信',
  SET_AS_PRIVATE_SERVICE: 'プライベートサービスに設定',
  SET_AS_PUBLIC_SERVICE: 'パブリックサービスに設定',
  SET_AS_PRIVATE_DATA: 'プライベートデータに設定',
  SET_AS_PUBLIC_DATA: 'パブリックデータに設定',
  NO_SERVICE: 'サービス無し',

  GET_DATA_FAILED: 'データの取得に失敗しました',

  // 关于
  ABOUT: 'About',
  SERVICE_HOTLINE: 'サポートサービス',
  SALES_CONSULTATION: 'お問い合わせ',
  BUSINESS_WEBSITE: 'ホームページへ',
  SERVICE_AGREEMENT: 'サービス協議',
  PRIVACY_POLICY: 'プライバシーポリシー',
  HELP_MANUAL: 'ヘルプ',
  NOVICE_GUIDE: 'Novice Guide',//待翻译
  START_GUIDE:'Start Guide',//待翻译

  MAP_ONLINE: 'オンラインマップ',
  MAP_2D: '2Dマップ',
  MAP_3D: '3Dシーン',
  BROWSE_MAP: 'マップの表示',

  // 作成データセット
  PLEASE_ADD_DATASET: 'データセットを追加してください',
  ADD_DATASET: 'データセットの追加',
  ENTER_DATASET_NAME: 'データセット名を入力してください',
  SELECT_DATASET_TYPE: 'データセットタイプを選択してください',
  DATASET_NAME: 'データセット名',
  DATASET_TYPE: 'データセットタイプ',
  DATASET_TYPE_POINT: 'ポイント',
  DATASET_TYPE_LINE: 'ライン',
  DATASET_TYPE_REGION: 'ポリゴン',
  DATASET_TYPE_TEXT: 'テキスト',
  CLEAR: 'クリア',
  CREATE: '作成',
  DATASET_BUILD_PYRAMID: 'ピラミッドの作成', //jp0730
  DATASET_BUILD_STATISTICS: '統計モデルの生成',
  TIME_SPEND_OPERATION: '当操作は時間掛かります。続きますか?',
  IMPORT_BUILD_PYRAMID: '画像ピラミッドを作成しますか(時間掛かります)？',
  BUILDING: '作成',
  BUILD_SUCCESS: '作成に成功',
  BUILD_FAILED: '作成に失敗',

  // 作成データソース
  NEW_DATASOURCE: '新規データソース',
  SET_DATASOURCE_NAME: 'データソース名の設定',
  ENTER_DATASOURCE_NAME: 'データソース名の入力',
  OPEN_DATASROUCE_FAILED: 'データソースを開くのに失敗しました。',
  DATASOURCE_TYPE: 'データタイプ',
  SERVICE_TYPE: 'サービス種類',

  SELECT_DATASET_EXPORT_TYPE: 'エクスポートタイプを選択してください',
  DATASET_EXPORT_NOT_SUPPORTED: '当タイプのデータセットのエクスポートをサポートしません',

  // 検索
  SEARCH: '検索',
  NO_SEARCH_RESULT: '関連データを検索しません',

  // 設定
  STATUSBAR_HIDE: 'ステータスバーの非表示',
  SETTING_LICENSE: 'ライセンス',
  SETTING_ABOUT_ITABLET: 'iTabletについて',
  SETTING_ABOUT: '',
  SETTING_ABOUT_AFTER: 'について',
  SETTING_CHECK_VERSION: 'バージョン確認',
  SETTING_SUGGESTION_FEEDBACK: 'フィードバック',
  SETTING_LANGUAGE: '言語',
  SETTING_LANGUAGE_AUTO: 'システムと同様',
  SETTING_LOCATION_DEVICE: 'デバイスにポジショニング',
  SETTING_LOCATION_LOCAL: '当デバイス',
  SETTING_CLEAR_CACHE: 'Clear Cache',//待翻译

  // ライセンス
  LICENSE: 'ライセンス',
  LICENSE_CURRENT: '現在ライセンス',
  LICENSE_TYPE: 'ライセンスタイプ',
  LICENSE_TRIAL: 'トライアルライセンス',
  LICENSE_OFFICIAL: '正式ライセンス',
  LICENSE_STATE: 'ライセンス状態',
  LICENSE_SURPLUS: '残り',
  LICENSE_YEAR: '年',
  LICENSE_DAY: '日',
  LICENSE_PERMANENT: '無期限',
  LICENSE_CONTAIN_MODULE: 'モジュール',
  LICENSE_CONTAIN_EXPAND_MODULE: '拡張モジュール',
  LICENSE_USER_NAME: 'ユーザー名',
  LICENSE_REMIND_NUMBER: '残りライセンス数',
  LICENSE_OFFICIAL_INPUT: '正式ライセンスの設定',
  LICENSE_TRIAL_APPLY: 'トライアルライセンスの申請',
  LICENSE_OFFICIAL_CLEAN: '正式ライセンスの返還',
  LICENSE_OFFICIAL_RETURN: 'ライセンスの返還',
  LICENSE_CLEAN_CANCLE: 'キャンセル',
  LICENSE_CLEAN_CONTINUE: '返還',
  LICENSE_CLEAN_ALERT: 'ライセンスを返還しますか',
  INPUT_LICENSE_SERIAL_NUMBER: 'ライセンス番号の入力',
  PLEASE_INPUT_LICENSE_SERIAL_NUMBER: 'ライセンス番号を入力してください',
  PLEASE_INPUT_LICENSE_SERIAL_NUMBER_NOT_CORRECT: '正確なライセンス番号を入力してください',
  LICENSE_SERIAL_NUMBER_ACTIVATION_SUCCESS: 'アクティブに成功しました',
  LICENSE_REGISTER_BUY: '登録して購入',
  LICENSE_HAVE_REGISTER: 'レジスタ済',
  LICENSE_NOT_CONTAIN_MODULE: '拡張モジュールはありません',
  LICENSE_MODULE_REGISTER_SUCCESS: 'モジュールのログインに成功しました',
  LICENSE_MODULE_REGISTER_FAIL: 'モジュールのログインに失敗しました',
  LICENSE_EXIT: '閉じる',
  LICENSE_EXIT_FAILED: '閉じるのに失敗しました',
  LICENSE_EXIT_CLOUD_ACTIVATE: 'クラウドライセンスを返還してアクティブしますか?',
  LICENSE_EXIT_CLOUD_LOGOUT: 'クラウドライセンスを返還してログアウトしますか?',
  LICENSE_CURRENT_EXPIRE: '現在ライセンスは無効です',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE: '現在ライセンスに当モジュールはありません',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE_SUB: '現在ライセンスに当モジュールはありません。当モジュールの機能を使用できません。',
  LICENSE_NO_NATIVE_OFFICAL: 'ローカル正式ライセンスファイルはありません。/iTablet/license/フォルダにOfficial_Licenseライセンスファイルを追加してください',
  LICENSE_NOT_ITABLET_OFFICAL: '当正式ライセンスはiTablet内でアクティブするライセンスではありません。iTabletの部分の機能を使用できません。ライセンスページでライセンスをクリアして、再申請ください',
  LICENSE_NATIVE_EXPIRE: 'ローカルライセンス无效',
  LICENSE_LONG_EFFECTIVE: '無期限',
  LICENSE_OFFLINE: 'オフラインライセンス',
  LICENSE_CLOUD: 'クラウドライセンス',
  LICENSE_PRIVATE_CLOUD: 'プライベートクラウドライセンス',
  LICENSE_NONE: 'なし',
  LICENSE_EDITION: 'ライセンスエディション',
  LICENSE_EDITION_CURRENT: '現在エディション',
  LICENSE_IN_TRIAL: 'トライアル中',
  LICENSE_TRIAL_END: 'トライアル終了',
  LICENSE_MODULE: '拡張モジュール',
  LICENSE_ACTIVATE: 'ライセンスをアクティブ',
  LICENSE_ACTIVATING: 'アクティブ中',
  LICENSE_ACTIVATION_SUCCESS: 'アクティブに成功',
  LICENSE_ACTIVATION_FAIL: 'アクティブに失敗',
  LICENSE_SELECT_LICENSE: 'ライセンスの選択',
  LICENSE_REAMIN_DAYS: '残り',
  LICENSE_SHOW_DETAIL: '詳細の表示',
  LICENSE_QUERY_NONE: 'ライセンス情報が見つかりませんでした',
  LICENSE_PRIVATE_CLOUD_SERVER: 'プライベートクラウドサーバーアドレス',
  LICENSE_EDUCATION: '教育ライセンス',
  LICENSE_EDUCATION_CONNECT_FAIL: 'サービス接続に失敗しました',
  LICENSE_QUERY: 'ライセンス取得',
  LICENSE_QUERYING: '取得中',
  LICENSE_QUERY_FAIL: '取得に失敗しました。サーバの設定を確認してください',
  LICENSE_SELECT_MODULE: 'モジュールの選択',
  LICENSE_SELECT_EDITION: 'エディションの選択',
  LICENSE_TOTAL_NUM: '総',
  LICENSE_REMIAN_NUM: '残り',
  LICENSE_DUE_DATE: '有効期間',
  LICENSE_CLOUD_SITE_SWITCH: '切替',
  LICENSE_CLOUD_SITE_DEFAULT: 'デフォルトサイト',
  LICENSE_CLOUD_SITE_JP: '日本サイト',
  // itablet许可版本
  LICENSE_EDITION_STANDARD: 'スタンダドエディション',
  LICENSE_EDITION_PROFESSIONAL: 'プロフェッショナルエディション',
  LICENSE_EDITION_ADVANCED: 'アドバンスエディション',
  // imobile许可模块
  Core_Dev: 'コア開発モジュール',
  Core_Runtime: 'コアランタイムモジュール',
  Navigation_Dev: '通常ナビ開発モジュール',
  Navigation_Runtime: '通常ナビランタイムモジュール',
  Realspace_Dev: '3Dシーン開発モジュール',
  Realspace_Runtime: '3Dシーンランタイムモジュール',
  Plot_Dev: '2Dアニメシンボル開発モジュール',
  Plot_Runtime: '2Dアニメシンボルランタイムモジュール',
  Industry_Navigation_Dev: '業務ナビ開発モジュール',
  Industry_Navigation_Runtime: '業務ナビランタイムモジュール',
  Indoor_Navigation_Dev: '室内ナビ開発モジュール',
  Indoor_Navigation_Runtime: '室内ナビランタイムモジュール',
  Plot3D_Dev: '3Dアニメシンボル開発モジュール',
  Plot3D_Runtime: '3Dアニメシンボルランタイムモジュール',
  Realspace_Analyst_Dev: '3D解析開発モジュール',
  Realspace_Analyst_Runtime: '3D解析ランタイムモジュール',
  Realspace_Effect_Dev: '3D特殊効果開発モジュール',
  Realspace_Effect_Runtime: '3D特殊効果ランタイムモジュール',
  // itablet许可模块
  ITABLET_ARMAP: 'ARマップ',
  ITABLET_NAVIGATIONMAP: 'ナビマップ',
  ITABLET_DATAANALYSIS: 'データ解析',
  ITABLET_PLOTTING: 'アニメシンボル',
  INVALID_MODULE: '現在モジュールのライセンスは無効です。この機能を使用できません。',
  INVALID_LICENSE: 'ライセンスは無効です。この機能を使用できません。',
  GO_ACTIVATE: 'ライセンス登録',

  // 意见反馈
  SUGGESTION_FUNCTION_ABNORMAL: '機能異常:機能障害または使用不可',
  SUGGESTION_PRODUCT_ADVICE: '製品意見：製品に関して意見があります',
  SUGGESTION_OTHER_PROBLEMS: 'その他の問題',
  SUGGESTION_SELECT_PROBLEMS: 'フィードバック項目を選択してください',
  SUGGESTION_PROBLEMS_DETAIL: '詳しい問題や意見を補足してください',
  SUGGESTION_PROBLEMS_DESCRIPTION: '問題の内容を入力してください',
  SUGGESTION_CONTACT_WAY: '連絡先',
  SUGGESTION_CONTACT_WAY_INPUT: '連絡先を入力してください',
  SUGGESTION_SUBMIT: 'サブミット',
  SUGGESTION_SUBMIT_SUCCEED: 'サブミットに成功',
  SUGGESTION_SUBMIT_FAILED: 'サブミットに失敗',

  // ar地图校准
  MAP_AR_DATUM_LONGITUDE: '経度',
  MAP_AR_DATUM_LATITUDE: '緯度',
  MAP_AR_DATUM_ENTER_CURRENT_POSITION: '現在位置の座標を入力してください',
  MAP_AR_DATUM_AUTO_LOCATION: '自動ポジショニング',
  MAP_AR_DATUM_MAP_SELECT_POINT: 'マップから選択',
  MAP_AR_DATUM_SURE: 'OK',
  MAP_AR_DATUM_AUTO_LOCATIONING: 'ポジショニング中',
  MAP_AR_DATUM_POSITION: '基点座標',
  MAP_AR_DATUM_AUTO_LOCATION_SUCCEED: '自動ポジショニングに成功',
  MAP_AR_DATUM_MAP_SELECT_POINT_SUCCEED: 'マップから選択に成功',
  MAP_AR_DATUM_PLEASE_TOWARDS_NORTH: '携帯電話のバックカメラを北に向けていることを確認してください。',
  MAP_AR_DATUM_SETTING: '設定',
  X_COORDINATE: 'X 座標', //jp0730
  Y_COORDINATE: 'Y 座標',
  MAP_AR_DATUM_AUTO_CATCH: 'Auto Catch',//待翻译
  MAP_AR_DATUM_AUTO_CATCH_TOLERANCE: 'Tolerance',//待翻译

  // ar地图
  COLLECT_SCENE_RENAME: '名前変更',
  COLLECT_SCENE_RENAME_SUCCEED: '名前変更に成功しました',
  COLLECT_SCENE_ADD_REMARK: '備考の追加',
  COLLECT_SCENE_ADD_REMARK_SUCCEED: '備考の追加に成功しました',

  CHOOSE_COLOR: '色の選択',
  SET_PROJECTION: '投影を設定する',
}

export { Profile }