// 制图

const Map_Label = {
  // マップ底部ナビ
  MAP: 'マップ',
  LAYER: 'レイヤー',
  ATTRIBUTE: '属性',
  SETTING: '設定',
  SCENE: 'シーン',
  NAME: '名',
  TOOL_BOX: 'ツールボックス',
  ARMAP: 'ARマップ',
  NAVIGATION: 'ナビ',
  INCREMENT: 'インクリメント',
  ENCLOSURE: 'フェンス',
}

// マップ、シーン主菜单
const Map_Main_Menu = {
  CURRENT_MAP: '現在マップ',
  // マップ制图及公共 開始
  START: '開始',
  START_OPEN_MAP: 'マップを開く',
  START_NEW_MAP: '新規マップ',
  START_RECENT: '歴史レコード',
  START_SAVE_MAP: 'マップの保存',
  START_SAVE_AS_MAP: 'マップに名前を付けて保存',
  START_OPEN_SENCE: 'シーンを開く',
  START_NEW_SENCE: '新規シーン',
  START_SAVE_SENCE: 'シーンの保存',
  START_SAVE_AS_SENCE: 'シーンに名前を付けて保存',
  PLOT_SAVE_ANIMATION: 'アニメーションの保存',
  ANIMATION_NODE_NAME: 'アニメーションノード名',

  PLOT: 'アニメシンボル',

  // マップ制图及公共 追加
  OPEN: '追加',
  OPEN_DATASOURCE: 'データソース',
  OPEN_MAP: 'マップ',
  OPEN_BACK: '前へ',

  NAVIGATION_START: 'ナビ',
  NETWORK_MODEL: 'モデル',
  NETWORK_MODEL_FILE: 'ネットワークモデルファイル',
  NAVIGATION_WORKSPACE: 'ナビワークスペース',
  NAVIGATION_MAP: 'ナビマップ',
  NETWORK: '道路ネットワーク',
  NETWORK_MODULE: '道路網',
  NETMODEL: 'ネットワークモデル',
  NETDATA: '道路ネットワークデータの選択',
  INDOORDATA: '室内データソース',
  INDOOR_DATASOURCE: '室内データソース',
  OUTDOOR_DATASETS: '屋外データセット',
  SWITCH_DATA: 'データ切り替え',
  DATASET: 'データセットの選択',
  Traffic: '道路状況',

  ANALYSIS: '解析',

  NEW_DATASOURCE: '新規データソース',
  // 凡例設定
  LEGEND_COLUMN: '列数',
  LEGEND_WIDTH: '幅',
  LEGEND_HEIGHT: '高さ',
  LEGEND_FONT: 'フォントサイズ',
  LEGEND_ICON: 'アイコンサイズ',
  LEGEND_COLOR: 'フィルカラー',
  LEGEND_POSITION: '凡例位置',
  TOP_LEFT: '左上揃え',
  TOP_RIGHT: '右上揃え',
  LEFT_BOTTOM: '左下揃え',
  RIGHT_BOTTOM: '右下揃え',

  // マップ制图及公共 スタイル
  STYLE: 'スタイル',
  STYLE_EDIT: 'スタイル 編集',
  STYLE_SYMBOL: 'シンボル',
  STYLE_SIZE: 'サイズ',
  STYLE_SYMBOL_SIZE: 'シンボルサイズ',
  STYLE_COLOR: 'カラー',
  STYLE_ROTATION: '回転角度',
  STYLE_TRANSPARENCY: '透明度',
  STYLE_LINE_WIDTH: 'ライン幅',
  STYLE_FOREGROUND: '前景色',
  STYLE_BACKGROUND: '背景色',
  STYLE_BORDER: '輪郭カラー',
  STYLE_BORDER_WIDTH: '輪郭幅',
  STYLE_GRADIENT_FILL: 'グラデーション',
  STYLE_FRAME_COLOR: 'ボーダーカラー',
  STYLE_FRAME_SYMBOL: 'ボーダーシンボル',
  STYLE_FONT: 'フォント',
  STYLE_FONT_SIZE: 'フォントサイズ',
  STYLE_ALIGNMENT: '位置',
  STYLE_FONT_STYLE: 'スタイル',
  STYLE_CONTRAST: '色相',
  STYLE_BRIGHTNESS: '明度',
  STYLE_BOLD: '太字',
  STYLE_ITALIC: '斜体',
  STYLE_UNDERLINE: '下線',
  STYLE_STRIKEOUT: '取り消し線',
  STYLE_OUTLINE: '輪郭',
  STYLE_SHADOW: 'シェード',
  SATURATION: '彩度',
  CONTRAST: 'コントラスト',

  ROTATE_LEFT: '左回転90°',
  ROTATE_RIGHT: '右回転90°',
  VERTICAL_FLIP: '上下回転',
  HORIZONTAL_FLIP: '左右回転',

  // マップ制图及公共 ツール
  TOOLS: 'ツール',
  TOOLS_DISTANCE_MEASUREMENT: '距離計測',
  TOOLS_AREA_MEASUREMENT: '面積計測',
  TOOLS_AZIMUTH_MEASUREMENT: '方位角計測',
  TOOLS_SELECT: 'ポイント選択',
  TOOLS_RECTANGLE_SELECT: 'ポリゴン選択',
  TOOLS_ROUND_SELECT: '円形選択',
  FULL_SCREEN: '全体表示',

  // マーク
  PLOTS: 'マーク',
  DOT_LINE: 'ポイントでラインを描画',
  FREE_LINE: 'ペンシルラインを描画',
  DOT_REGION: 'ポイントでポリゴンを描画',
  FREE_REGION: '自由ポリゴンを描画',
  TOOLS_3D_CREATE_POINT: '兴趣ポイント',
  TOOLS_CREATE_POINT: 'ポイントを描画',
  TOOLS_CREATE_LINE: 'ラインを描画',
  TOOLS_CREATE_REGION: 'ポリゴンを描画',
  TOOLS_CREATE_TRACK: '軌跡',
  TOOLS_CREATE_TEXT: 'テキスト',

  TOOLS_NAME: '名',
  TOOLS_REMARKS: '備考',
  TOOLS_HTTP: 'httpアドレス',
  TOOLS_PICTURES: '画像',
  COLLECT_TIME: 'コレクション時間',
  COORDINATE: '経度緯度',

  // クリップ
  TOOLS_RECTANGLE_CLIP: '矩形クリップ',
  TOOLS_CIRCLE_CLIP: '円形クリップ',
  TOOLS_POLYGON_CLIP: 'ポリゴンクリップ',
  TOOLS_SELECT_OBJECT_AREA_CLIP: '選択オブジェクトでクリップ',
  TOOLS_CLIP_INSIDE: 'エリア内クリップ',
  TOOLS_ERASE: 'イレース',
  TOOLS_EXACT_CLIP: '精確クリップ',
  TOOLS_TARGET_DATASOURCE: '目標データソース',
  TOOLS_UNIFIED_SETTING: '統一設定',
  MAP_CLIP: 'マップクリップ',
  CLIP: 'クリップ',

  CAMERA: 'マルチメディアコレクション',
  TOUR: '旅行軌跡',
  TOUR_NAME: '旅行軌跡名',

  STYLE_TRANSFER: 'AIマップ作成',
  OBJ_EDIT: 'オブジェクト編集',

  TOOLS_MAGNIFIER: '拡大鏡',
  TOOLS_SELECT_ALL: 'すべて選択',
  TOOLS_SELECT_REVERSE: '選択の反転',

  // 3D ツール
  TOOLS_SCENE_SELECT: '選択',
  TOOLS_PATH_ANALYSIS: 'ルート解析',
  TOOLS_VISIBILITY_ANALYSIS: '見通し解析',
  TOOLS_CLEAN_PLOTTING: 'マークのクリア',
  TOOLS_BOX_CLIP: 'Boxクリップ',
  TOOLS_PLANE_CLIP: '平面クリップ',
  TOOLS_CROSS_CLIP: 'Crossクリップ',
  // 3D 飛行
  FLY: '飛行',
  FLY_ROUTE: '飛行軌跡',
  FLY_ADD_STOPS: '目標ポイントの追加',
  FLY_AROUND_POINT: 'ポイント旋回飛行',

  // 3Dクリップ
  CLIP_LAYER: 'クリップレイヤー',
  CLIP_AREA_SETTINGS: 'クリップエリアパラメータ設定',
  CLIP_AREA_SETTINGS_WIDTH: '底面幅',
  CLIP_AREA_SETTINGS_LENGTH: '底面長さ',
  CLIP_AREA_SETTINGS_HEIGHT: '高度',
  CLIP_AREA_SETTINGS_XROT: 'x回転',
  CLIP_AREA_SETTINGS_YROT: 'y回転',
  CLIP_AREA_SETTINGS_ZROT: 'z回転',
  POSITION: '位置',
  CLIP_SETTING: 'クリップ設定',
  CLIP_INNER: 'エリア内クリップ',
  LINE_COLOR: 'クリップラインカラー',
  LINE_OPACITY: 'クリップライン透明度',
  SHOW_OTHER_SIDE: '反対側を表示',
  ROTATE_SETTINGS: '回転パラメータ',
  CLIP_SURFACE_SETTING: 'クリップポリゴン設定',
  CUT_FIRST: 'クリップしてください',
  // 专题制图 主題図
  THEME: '主題図',
  THEME_UNIFORM_MAP: '統一スタイル',
  THEME_UNIQUE_VALUES_MAP: '個別値スタイル',
  THEME_RANGES_MAP: '段階区分スタイル',
  THEME_UNIFORM_LABLE: '統一スタイルのラベル',
  THEME_UNIQUE_VALUE_LABLE_MAP: '個別値スタイルラベル',
  THEME_RANGES_LABLE_MAP: '段階区分ラベル',
  THEME_AREA: '面積図',
  THEME_STEP: '段階図',
  THEME_LINE: '折れ線グラフ',
  THEME_POINT: '散布図',
  THEME_COLUMN: '棒グラフ',
  THEME_3D_COLUMN: '3D棒グラフ',
  THEME_PIE: '円グラフ',
  THEME_3D_PIE: '3D円グラフ',
  THEME_ROSE: 'ローズグラフ',
  THEME_3D_ROSE: '3Dローズグラフ',
  THEME_STACKED_BAR: '積み上げ棒グラフ',
  THEME_3D_STACKED_BAR: '3D積み上げ棒グラフ',
  THEME_RING: 'ドーナツグラフ',
  THEME_DOT_DENSITY_MAP: '点密度図',
  THEME_GRADUATED_SYMBOLS_MAP: '連続的スケール記号図',
  THEME_HEATMAP: 'ヒートマップ',

  THEME_ALL_SELECTED: 'すべて選択',
  THEME_ALL_CANCEL: 'すべてキャンセル',
  THEME_HIDE_SYSTEM_FIELDS: 'システムフィールドの非表示',
  THEME_EXPRESSION: '表現式',
  THEME_UNIQUE_EXPRESSION: '個別値表現式',
  THEME_RANGE_EXPRESSION: '段階区分表現式',
  THEME_COLOR_SCHEME: 'カラースキーム',
  THEME_FONT_SIZE: 'フォントサイズ',
  THEME_FONT: 'フォント',
  THEME_ROTATION: '回転角度',
  THEME_COLOR: 'カラー',

  THEME_METHOD: '段階区分方法',
  THEME_EQUAL_INTERVAL: '等距離区分',
  THEME_SQURE_ROOT_INTERVAL: '平方根区分',
  THEME_STANDARD_DEVIATION_INTERVAL: '標準偏差区分',
  THEME_LOGARITHMIC_INTERVAL: '対数区分',
  THEME_QUANTILE_INTERVAL: '等級段階区分',
  THEME_MANUAL: 'ユーザー定義段階区分',

  THEME_BACK_SHAPE: '背景形状',
  THEME_DEFAULT: 'デフォルト',
  THEME_RECTANGLE: '矩形',
  THEME_ROUND_RECTANGLE: '角丸矩形',
  THEME_ELLIPSE: '角丸矩形',
  THEME_DIAMOND: '菱形',
  THEME_TRIANGLE: '三角形',
  THEME_MARKER_SYMBOL: 'ポイントシンボル',

  THEME_HEATMAP_RADIUS: 'カーネル半径',
  THEME_HEATMAP_COLOR: 'カラースキーム',
  THEME_HEATMAP_FUZZY_DEGREE: 'グラデーションあいまい度',
  THEME_HEATMAP_MAXCOLOR_WEIGHT: '最大カラー重み',

  THEME_GRANDUATE_BY: '計算方法',
  THEME_CONSTANT: '定数',
  THEME_LOGARITHM: '対数',
  THEME_SQUARE_ROOT: '平方根',
  THEME_MAX_VISIBLE_SIZE: '最大表示値',
  THEME_MIN_VISIBLE_SIZE: '最小表示値',

  DOT_VALUE: 'ポイント値',
  GRADUATE_BY: '値の計算方法',
  DATUM_VALUE: '基準値',
  RANGE_COUNT: '段階区分個数',

  // 外业コレクション コレクション
  CREATE_WITH_SYMBOLS: '通常作成',
  CREATE_WITH_TEMPLATE: 'テンプレートで作成',
  POINT_SYMBOL_LIBRARY: 'ポイントシンボルライブラリ',
  LINE_SYMBOL_LIBRARY: 'ラインシンボルライブラリ',
  REGION_SYMBOL_LIBRARY: 'ポリゴンシンボルライブラリ',

  COLLECTION: 'コレクト',
  COLLECTION_RECENT: '最近',
  COLLECTION_SYMBOL: 'シンボル',
  COLLECTION_GROUP: 'グループ',
  COLLECTION_UNDO: '取り消す',
  COLLECTION_REDO: 'やり直す',
  COLLECTION_CANCEL: 'キャンセル',
  COLLECTION_SUBMIT: 'コミット',
  COLLECTION_METHOD: 'コレクション方式',
  COLLECTION_POINTS_BY_GPS: 'GPSプロット方式',
  COLLECTION_LINE_BY_GPS: 'GPS軌跡式',
  COLLECTION_POINT_DRAW: 'ポイント描画式',
  COLLECTION_FREE_DRAW: '自由式',
  COLLECTION_ADD_POINT: 'プロット',
  COLLECTION_START: '開始',
  COLLECTION_PAUSE: '一時停止',
  COLLECTION_STOP: '停止',

  // 外业コレクション 編集
  EDIT: '編集',
  EDIT_ADD_NODES: '頂点の追加',
  EDIT_NODES: '頂点の編集',
  EDIT_DELETE: '削除',
  EDIT_DELETE_NODES: '頂点の削除',
  EDIT_DELETE_OBJECT: 'オブジェクトの削除',
  EDIT_ERASE: 'イレース',
  EDIT_SPLIT: '分割',
  EDIT_UNION: 'ユニオン',
  EDIT_DRAW_HOLLOW: 'ドーナツの手動描画',
  EDIT_PATCH_HOLLOW: 'ドーナツのパッチ',
  EDIT_FILL_HOLLOW: 'ドーナツの補填',
  EDIT_CANCEL_SELECTION: '選択のキャンセル',
  MOVE: '移動',
  OBJMOVE: '対象移動',
  FREE_DRAW_ERASE: '手動描画でイレース',

  // アニメシンボル
  PLOTTING: 'アニメシンボル',
  PLOTTING_LIB_CHANGE: 'アニメシンボルライブラリの切替',
  PLOTTING_LIB: 'アニメシンボルライブラリ',
  PLOTTING_ANIMATION: '展開',
  PLOTTING_ANIMATION_DEDUCTION: '状況展開',
  PLOTTING_ANIMATION_RESET: 'リセット',

  // シェア
  SHARE: 'シェア',
  SHARE_WECHAT: 'WeChat',
  SHARE_FRIENDS: '友達',
  SHARE_EXPLORE: '探検',

  MAO_ROAD_DISTRIBUTION: '道路ネットワーク',

  MAP_AR_DONT_SUPPORT_DEVICE: '当デバイスをサポートしません',
  MAP_AR_CAMERA_EXCEPTION: 'カメラ異常、権限を確認してください',
  MAP_AR_AI_ASSISTANT: 'AI\nアシスタント',
  MAP_AR_AI_ASSISTANT_CUSTOM_COLLECT: '通常コレクション',
  MAP_AR_AI_ASSISTANT_MUNICIPAL_COLLECT: '市政コレクション',
  MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT: '交通違反コレクション',
  MAP_AR_AI_ASSISTANT_ROAD_COLLECT: '道路コレクション',
  MAP_AR_AI_ASSISTANT_POI_COLLECT: 'POIマップ',
  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT: 'AI計測',
  MAP_AR_AI_ASSISTANT_CLASSIFY: '目標分類',
  MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT: '状況コレクション',
  MAP_AR_AI_ASSISTANT_TARGET_COLLECT: '目標コレクション',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT: '高精度コレクション',
  MAP_AR_AI_ASSISTANT_ILLEGALLY_PARK_COLLECT: '交通違反コレクション',
  MAP_AR_AI_ASSISTANT_CAST_MODEL_OPERATE: 'モデル再生',
  MAP_AR_AI_ASSISTANT_NEWDATA: '新規',
  MAP_AR_AI_ASSISTANT_SCENE_NEW_DATANAME: 'データソース名を入力してください',

  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_CHOOSE_MODEL: 'モデルを選択してください',
  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_SEARCHING: '平面を検索中',
  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_VIEW_DISTANCE: 'ビューポイント距離:',

  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOTALLENGTH: '総長さ:',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOLASTLENGTH: '現在長さ:',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_HISTORY: '歴史レコード:',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NAME:
    'コレクション名を入力してください:',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY: '歴史データはありません',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_START: 'レコードを開始',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_STOP: 'レコードを一時停止',
  MAP_AR_AI_ASSISTANT_SAVE_LINE: 'ライン',
  MAP_AR_AI_ASSISTANT_SAVE_POINT: 'ポイント',
  MAP_AR_AI_SAVE_SUCCESS: '保存に成功',
  MAP_AR_AI_SAVE_POINT: 'ポイントの保存',
  MAP_AR_AI_SAVE_LINE: 'ラインの保存',
  MAP_AR_AI_CHANGE: '視角の切替',
  MAP_AR_AI_CLEAR: 'クリア',
  MAP_AR_AI_NEW_ROAD: '新規道路を作成してください',
  MAP_AR_AI_SAVE_REGION: '顔を保存',
  MAP_AR_AI_SCENE_TRACK_COLLECT: 'トレース収集',
  MAP_AR_AI_SCENE_POINT_COLLECT: 'ラッシュコレクション',
  MAP_AR_AI_SCENE_POINT_COLLECT_CLICK_HINT:
    '画面をタップして現在のポイントを特定します',

  MAP_AR_AI_ASSISTANT_CLASSIFY_LOADING: '分類中',
  MAP_AR_AI_ASSISTANT_CLASSIFY_FAILED: '分類に失敗しました。再度試してください',
  MAP_AR_AI_ASSISTANT_CLASSIFY_NOPICS: '画像を選択しません',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT: '識別結果',
  MAP_AR_AI_ASSISTANT_CLASSIFY_CONFIDENCE: '信頼度',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_NAME: '物体名:',

  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_TIME: '識別時間:',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_REMARKS: '備考:',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_PLEA_REMARKS: '備考を入力してください',
  MAP_AR_AI_ASSISTANT_CLASSIFY_SAVE: '保存',

  MAP_AR_AI_CANCEL: 'キャンセル',
  MAP_AR_AI_CONFIRM: 'OK',

  // 智能配图
  FILL: 'フィル',
  BORDER: '輪郭',
  LINE: 'ライン',
  MARK: 'マーク',

  // マップナビ
  START_POINT: '起点',
  END_POINT: '終点',
  DRAW: '描画',
  ROAD_DETAILS: '道路詳細',
  ROUTE_THROUGH: '経由道路：',
  DISTANCE: '距離：',
  METERS: 'メートル',
  KILOMETERS: 'キロメートル',
  DISPLAY_MAP: 'マップの表示',
  START_FROM_START_POINT: '開始点から出発',
  ARRIVE_AT_THE_DESTINATION: '終点に到達',
  REAL_NAVIGATION: 'ナビ',
  SIMULATED_NAVIGATION: 'シミュレーションナビ',
  GO_STRAIGHT: '直進',
  SELECT_START_POINT: '起点の選択',
  SELECT_DESTINATION: '終点の選択',
  SET_AS_START_POINT: '起点に設定',
  SET_AS_DESTINATION: '終点に設定',
  CLEAR_NAV_HISTORY: 'クリア歴史',
  ROUTE_ANALYST: 'ルート解析',
  SELECT_POINTS: 'マップでポイントを選択',
  LONG_PRESS_SELECT_POINTS: '(長押しポイントを選択)',
  INCREMENT_ROAD: 'インクリメント道路ネットワーク',
  TRACK: '軌跡',
  HAND_PAINTED: '手動描画で',
  NETWORK_DATASET: '道路ネットワークデータセット',
  MODEL_FILE: 'ナビモデルファイル',
  MY_LOCATION: '私の位置',
  //导航采集
  MAP_INDOOR_NETWORK: '屋内',
  MAP_OUTDOOR_NETWORK: 'アウトドア',
  MAP_INCREMENT_START: '開始',
  MAP_INCREMENT_STOP: '停止',
  MAP_INCREMENT_ADD_POINT: 'プロット',
  MAP_INCREMENT_CANCEL: 'キャンセルする',
  MAP_INCREMENT_COMMIT: '提出する',
  MAP_INCREMENT_GPS_POINT: 'GPSプロット方式',
  MAP_INCREMENT_GPS_TRACK: 'GPS軌跡式',
  MAP_INCREMENT_POINTLINE: 'ポイント描画式',
  MAP_INCREMENT_FREELINE: '自由式',

  MAP_TOPO_ADD_NODE: 'ノードを追加',
  MAP_TOPO_EDIT_NODE: 'ノードを編集',
  MAP_TOPO_DELETE_NODE: 'ノードを削除する',
  MAP_TOPO_DELETE_OBJECT: 'オブジェクトを削除',
  MAP_TOPO_SMOOTH: 'スムーズ',
  MAP_TOPO_SPLIT_LINE: 'ラインラインは中断しました',
  MAP_TOPO_SPLIT: '割り込み',
  MAP_TOPO_EXTEND: '伸ばす',
  MAP_TOPO_TRIM: 'トリミング',
  MAP_TOPO_RESAMPLE: 'リサンプリング',
  MAP_TOPO_CHANGE_DIRECTION: '方向を変える',
  ADD_DATASET: 'データセットを追加',
  SELECT_ROADNAME_FIELD: '次のデータセットの道路名フィールドを選択します',
  SELECT_FIELD: 'フィールドを選択',
  MERGE_CANCEL: 'キャンセルする',
  MERGE_CONFIRM: 'よし',
  MERGE_SELECT_ALL: 'すべて選択',
  MERGE_ADD: '追加',
  MERGE_DATASET: 'データセットをマージ',
}

// 展開アニメーション
const Map_Plotting = {
  PLOTTING_ANIMATION_MODE: 'アニメーションタイプ',
  PLOTTING_ANIMATION_OPERATION: '効果オプション',
  PLOTTING_ANIMATION_START_MODE: '開始',

  PLOTTING_ANIMATION_WAY: 'パス',
  PLOTTING_ANIMATION_BLINK: 'ブリンク',
  PLOTTING_ANIMATION_ATTRIBUTE: '属性',
  PLOTTING_ANIMATION_SHOW: '表示非表示',
  PLOTTING_ANIMATION_ROTATE: '回転',
  PLOTTING_ANIMATION_SCALE: 'スケール',
  PLOTTING_ANIMATION_GROW: '成長',

  PLOTTING_ANIMATION_START_TIME: '開始時間',
  PLOTTING_ANIMATION_DURATION: '持続時間',
  PLOTTING_ANIMATION_FLLOW_LAST: '前のアニメーション後に再生',
  PLOTTING_ANIMATION_CLICK_START: 'クリックして開始',
  PLOTTING_ANIMATION_TOGETHER_LAST: '前のアニメーションと同時に再生',
  PLOTTING_ANIMATION_CONTINUE: '続けて作成',
  PLOTTING_ANIMATION_WAY_SET: 'パス設定',
  PLOTTING_ANIMATION_SAVE: '保存',
  PLOTTING_ANIMATION_BACK: '返す',

  ANIMATION_ATTRIBUTE_STR: 'アニメーション属性',
  ANIMATION_WAY: 'パスアニメーション',
  ANIMATION_BLINK: 'ブリンクアニメーション',
  ANIMATION_ATTRIBUTE: '属性アニメーション',
  ANIMATION_SHOW: '表示非表示アニメーション',
  ANIMATION_ROTATE: '回転アニメーション',
  ANIMATION_SCALE: 'スケールアニメーション',
  ANIMATION_GROW: '成長アニメーション',

  ANIMATION_SCALE_START_SCALE: '開始スケール',
  ANIMATION_SCALE_END_SCALE: '終了スケール',

  ANIMATION_SHOW_STATE: 'アニメシンボル表示',
  ANIMATION_SHOW_EFFECT: '効果を表示',

  ANIMATION_BLINK_INTERVAL: '周波数ブリンク',
  ANIMATION_BLINK_NUMBER: '回数ブリンク',
  ANIMATION_BLINK_REPLACE: 'カラー切替',
  ANIMATION_BLINK_START_COLOR: '開始カラー',
  ANIMATION_BLINK_REPLACE_COLOR: '切替カラー',

  ANIMATION_ROTATE_DIRECTION: '回転方向',
  ANIMATION_ROTATE_CLOCKWISE: '時計順',
  ANIMATION_ROTATE_ANTICLOCKWISE: '逆時計順',
  ANIMATION_ROTATE_START_ANGLE: '開始回転角度',
  ANIMATION_ROTATE_END_ANGLE: '終了回転角度',

  ANIMATION_ATTRIBUTE_LINE_WIDTH: 'ライン幅アニメーション',
  ANIMATION_ATTRIBUTE_LINE_WIDTH_START: '開始ライン幅',
  ANIMATION_ATTRIBUTE_LINE_WIDTH_END: '終了ライン幅',
  ANIMATION_ATTRIBUTE_LINE_COLOR: 'ラインカラーアニメーション',
  ANIMATION_ATTRIBUTE_LINE_COLOR_START: '開始ラインカラー',
  ANIMATION_ATTRIBUTE_LINE_COLOR_END: '終了ラインカラー',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH: 'セリフ幅アニメーション',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH_START: '開始セリフ幅',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH_END: '終了セリフ幅',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR: 'セリフカラーアニメーション',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR_START: '開始セリフカラー',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR_END: '終了セリフカラー',

  ANIMATION_NODE_EDIT: 'アニメーションの編集',
}

// レイヤー
const Map_Layer = {
  PLOTS: '私のマーク',
  PLOTS_IMPORT: 'マークのインポート',
  PLOTS_DELETE: 'マークの削除',
  PLOTS_EDIT: 'マークの編集',
  PLOTS_SET_AS_CURRENT: '現在マークに設定',

  LAYERS: '私のレイヤー',
  LAYERS_MOVE_UP: '上に移動',
  LAYERS_MOVE_DOWN: '下に移動',
  LAYERS_TOP: '最上位に移動',
  LAYERS_BOTTOM: '再下位に移動',
  LAYERS_LONG_PRESS: '長押しドラッグでソート',
  LAYERS_SET_AS_CURRENT_LAYER: '現在レイヤーに設定',
  LAYERS_FULL_VIEW_LAYER: '当レイヤーを全体表示',
  LAYERS_LAYER_STYLE: 'レイヤースタイル',
  LAYERS_FULL_EXTENT: '当レイヤーを全体表示',
  LAYERS_SET_VISIBLE_SCALE: '表示スケール範囲',
  LAYERS_RENAME: '名前変更',
  LAYERS_COPY: 'コピー',
  LAYERS_PASTE: 'コピーするレイヤーを挿入',
  LAYERS_LAYER_PROPERTIES: 'レイヤー属性',
  LAYERS_REMOVE: '削除',
  LAYERS_COLLECT: '現在レイヤーでコレクション',
  LAYERS_MAXIMUM: '最大表示スケール',
  LAYERS_MINIMUM: '最小表示スケール',
  LAYERS_UER_DEFINE: 'ユーザー定義',
  LAYER_NONE: 'なし',
  LAYERS_SET_AS_CURRENT_SCALE: '現在スケールに設定',
  LAYERS_CLEAR: 'クリア',
  LAYERS_LAYER_NAME: 'レイヤータイトル',
  LAYERS_COMPLETE_LINE: 'ラインスタイル完全表示',
  LAYERS_OPTIMIZE_CROSS: '交差点の処理',
  LAYERS_ANTIALIASING: 'アンチエイリアス',
  LAYERS_SHOW_OVERLAYS: 'テキスト重複表示',
  LAYERS_SCALE_SYMBOL: 'シンボルスケーラブル',
  LAYERS_SCALE: 'ズーム基準スケール',
  LAYERS_MIN_OBJECT_SIZE: '最小オブジェクトサイズ',
  LAYERS_FILTER_OVERLAPPING_SMALL_OBJECTS: '希薄表示',
  LAYERS_SHARE: 'シェア',
  SELECT_LAYSER_SCALE: 'スケールを選択してください',
  LAYER_SCALE_RANGE_WRONG:
    '最大スケールは最小スケールより大きい値に設定する必要があります。',

  VISIBLE: 'レイヤーを表示に設定',
  NOT_VISIBLE: 'レイヤーを非表示に設定',
  OPTIONAL: 'レイヤーを選択可能に設定',
  NOT_OPTIONAL: 'レイヤーを選択不可に設定',
  EDITABLE: 'レイヤーを編集可能に設定',
  NOT_EDITABLE: 'レイヤーを編集不可に設定',
  SNAPABLE: 'レイヤーをスナップ可能に設定',
  NOT_SNAPABLE: 'レイヤーをスナップ不可に設定',
  // 主題図レイヤー
  LAYERS_CREATE_THEMATIC_MAP: '主題図の作成',
  LAYERS_MODIFY_THEMATIC_MAP: '主題図の変更',

  BASEMAP: '私のベースマップ',
  BASEMAP_SWITH: 'ベースマップの切替',
  MY_TERRAIN: '私の地形',

  SCALE_TO_CURRENT_LAYER: '現在のレイヤーにズーム',
  ADD_A_TERRAIN_LAYER: '地形レイヤーを追加',
  ADD_A_IMAGE_LAYER: '画像レイヤーを追加',
  REMOVE_THE_CURRENT_LAYER: '現在のレイヤーを削除',
  ONLINE_BASE_MAP: 'オンライン地図',
  ADD_LAYER_URL: 'オンラインレイヤーのアドレスを追加',
  TERRAIN: '地形',
  IMAGE: 'イメージ',
}

// 属性
const Map_Attribute = {
  ATTRIBUTE_SORT: 'ソート',
  ATTRIBUTE_LOCATION: 'ポジショニング',
  ATTRIBUTE_CANCEL: 'キャンセル',
  ATTRIBUTE_EDIT: '編集',
  ATTRIBUTE_STATISTIC: '統計',
  ATTRIBUTE_ASSOCIATION: '関連',
  ATTRIBUTE_NO: '番号',
  ATTRIBUTE_CURRENT: '現在の位置',
  ATTRIBUTE_FIRST_RECORD: '頭行にポジション',
  ATTRIBUTE_LAST_RECORD: '末行にポジション',
  ATTRIBUTE_RELATIVE: '相対位置',
  ATTRIBUTE_ABSOLUTE: '絶対位置',
  ATTRIBUTE_UNDO: '取り消す',
  ATTRIBUTE_REDO: 'やり直す',
  ATTRIBUTE_REVERT: '復元',
  ATTRIBUTE_FIELD_ADD: '追加',
  ATTRIBUTE_ADD: '属性追加',
  ATTRIBUTE_DETAIL: '属性詳細',
  REQUIRED: '必須',
  NAME: '名前',
  TYPE: 'タイプ',
  LENGTH: '長さ',
  DEFAULT: 'デフォルト',
  CONFIRM_ADD: '追加',

  DETAIL: '詳細',
  // 統計モード
  MAX: '最大値',
  MIN: '最小値',
  AVERAGE: '平均値',
  SUM: '総計',
  VARIANCE: '分散',
  STANDARD_DEVIATION: '標準偏差',
  COUNT_UNIQUE: '個別値個数',
  FIELD_TYPE: 'フィールドタイプ',
  ALIAS: '識別名',
  ASCENDING: '昇順',
  DESCENDING: '降順',
}

// マップ設定
const Map_Setting = {
  BASIC_SETTING: '基本設定',
  ROTATION_GESTURE: 'ジェスチャー回転',
  PITCH_GESTURE: 'ジェスチャー俯仰',
  THEME_LEGEND: '主題図凡例',
  COLUMN_NAV_BAR: '横持ち時ナビィバーを縦表示にする',

  // 効果設定
  EFFECT_SETTINGS: '効果設定',
  ANTI_ALIASING_MAP: 'アンチエイリアスマップ',
  SHOW_OVERLAYS: 'テキスト重複表示',

  // 範囲設定
  BOUNDS_SETTING: '範囲設定',
  FIX_SCALE: '固定スケール',

  // 3Dシーン設定
  SCENE_NAME: 'シーン名',
  FOV: 'カメラ角度',
  SCENE_OPERATION_STATUS: 'シーン操作状態',
  VIEW_MODE: 'ビューモード',
  TERRAIN_SCALE: '地形誇張倍率',
  SPHERICAL: '球面',
}

// マップ設定菜单
const Map_Settings = {
  THEME_LEGEND: '凡例',
  // 一级菜单
  BASIC_SETTING: '基本設定',
  RANGE_SETTING: '範囲設定',
  COORDINATE_SYSTEM_SETTING: '座標系設定',
  ADVANCED_SETTING: '詳細設定',
  LEGEND_SETTING: '凡例設定',
  ENCLOSURE_NAME: 'フェンス名',
  START_TIME: '開始時間',
  END_TIME: '終了時間',
  REMARKS: '備考',
  DRAWING_RANGE: '描画範囲',

  // 视频マップ設定:一级菜单
  POI_SETTING: 'POI設定',
  DETECT_TYPE: '検出タイプ',
  DETECT_STYLE: '検出ボックススタイル',

  POI_SETTING_PROJECTION_MODE: 'プロジェクトモード',
  POI_SETTING_OVERLAP_MODE: '回避モード',
  POI_SETTING_POLYMERIZE_MODE: '集計モード',

  DETECT_TYPE_PERSON: '人',
  DETECT_TYPE_BICYCLE: '自転車',
  DETECT_TYPE_CAR: '車',
  DETECT_TYPE_MOTORCYCLE: 'オートバイ',
  DETECT_TYPE_BUS: 'バス',
  DETECT_TYPE_TRUCK: 'トラック',
  DETECT_TYPE_TRAFFICLIGHT: '信号機',
  DETECT_TYPE_FIREHYDRANT: '消火栓',
  DETECT_TYPE_CUP: 'カップ',
  DETECT_TYPE_CHAIR: '椅子',
  DETECT_TYPE_BIRD: '鳥',
  DETECT_TYPE_CAT: '猫',
  DETECT_TYPE_DOG: '犬',
  DETECT_TYPE_POTTEDPLANT: '鉢植え',
  DETECT_TYPE_TV: 'モニター',
  DETECT_TYPE_LAPTOP: 'ノートパソコン',
  DETECT_TYPE_MOUSE: 'マウス',
  DETECT_TYPE_KEYBOARD: 'キーボード',
  DETECT_TYPE_CELLPHONE: '携帯電話',
  DETECT_TYPE_BOOK: '本',
  DETECT_TYPE_BOTTLE: '瓶',

  DETECT_STYLE_IS_DRAW_TITLE: '目標描画検出名',
  DETECT_STYLE_IS_DRAW_CONFIDENCE: '目標描画検出の可信度',
  DETECT_STYLE_IS_SAME_COLOR: '統一カラー',
  DETECT_STYLE_SAME_COLOR: '統一カラー値',
  DETECT_STYLE_STROKE_WIDTH: '目標描画ボックス検出のライン幅',
  COUNTRACKED: 'トラッキング個数',

  // 二级菜单 基本設定
  MAP_NAME: 'マップ名',
  SHOW_SCALE: '表示スケール',
  ROTATION_GESTURE: 'ジェスチャー回転',
  PITCH_GESTURE: 'ジェスチャー俯仰',
  ROTATION_ANGLE: '回転角度',
  COLOR_MODE: 'カラーモード',
  BACKGROUND_COLOR: '背景カラー',
  MAP_ANTI_ALIASING: 'マップアンチエイリアス',
  FIX_SYMBOL_ANGLE: '固定シンボル角度',
  FIX_TEXT_ANGLE: '固定テキスト角度',
  FIX_TEXT_DIRECTION: '固定テキスト方向',
  SHOW_OVERLAYS: 'テキスト重複表示',
  ENABLE_MAP_MAGNIFER: 'マップ拡大鏡を使用',

  // 二级菜单 範囲設定
  MAP_CENTER: 'センターポイント',
  MAP_SCALE: 'スケール',
  FIX_SCALE_LEVEL: '固定スケールレベル',
  CURRENT_VIEW_BOUNDS: '現在ウィンドウの四方範囲',

  // 二级菜单 座標系設定
  COORDINATE_SYSTEM: '座標系',
  COPY_COORDINATE_SYSTEM: '座標系のコピー',
  DYNAMIC_PROJECTION: 'アクティブ投影',
  TRANSFER_METHOD: '変換方法',

  // 二级菜单 詳細設定
  FLOW_VISIUALIZATION: 'フロー表示',
  SHOW_NEGATIVE_DATA: '負の値を表示',
  AUTOMATIC_AVOIDANCE: '自動回避',
  ZOOM_WITH_MAP: 'シンボルスケーラブル',
  SHOW_TRACTION_LINE: 'リーダー線の表示',
  GLOBAL_STATISTICS: '全局統計値',
  CHART_ANNOTATION: '統計グラフラベル',
  SHOW_AXIS: '座標軸の表示',
  HISTOGRAM_STYLE: '棒グラフスタイル',
  ROSE_AND_PIE_CHART_STYLE: 'ローズグラフ、円グラフスタイル',

  // 三级菜单 カラーモード
  DEFAULT_COLOR_MODE: 'デフォルトカラーモード',
  BLACK_AND_WHITE: 'モノクロモード',
  GRAY_SCALE_MODE: 'グレーモード',
  ANTI_BLACK_AND_WHITE: '白黒反転モード',
  ANTI_BLACK_AND_WHITE_2: '白黒反転、その他は保留',

  // 三级菜单 窗口四至範囲
  LEFT: '左',
  RIGHT: '右',
  TOP: '上',
  BOTTOM: '下',

  // 三级菜单 座標系設定
  PLAN_COORDINATE_SYSTEM: '平面座標系',
  GEOGRAPHIC_COORDINATE_SYSTEM: '地理座標系',
  PROJECTED_COORDINATE_SYSTEM: '投影座標系',

  // 三级菜单 コピー座標系
  FROM_DATASOURCE: 'データソースから',
  FROM_DATASET: 'データセットから',
  FROM_FILE: 'ファイルから',

  // 四级菜单 変換方法パラメータ設定
  BASIC_PARAMS: '基本パラメータ',
  OFFSET: 'オフセット量',
  PROPORTIONAL_DIFFERENCE: '比例差',
  ROTATION_ANGLE_SECONDS: '回転角度(秒)',

  // 四级菜单 和コピーヒント
  DATASOURCES: 'データソース',
  DATASETS: 'データセット',
  TYPE: 'タイプ',
  FORMAT: 'フォーマット',
  ALL_COORD_FILE: 'サポートする座標系ファイル',
  SHAPE_COORD_FILE: 'Shape座標系ファイル',
  MAPINFO_FILE: 'MapInfo交換フォーマット',
  MAPINFO_TAB_FILE: 'MapInfo Tabファイル',
  IMG_COORD_FILE: '影像フォーマット座標系ファイル',
  COORD_FILE: '座標系ファイル',

  // 設定的一些パラメータ
  PERCENT: '百分率',
  OFF: '閉じる',
  CONFIRM: 'OK',
  CANCEL: 'キャンセル',
  COPY: 'コピー',
}

// マップツール
const Map_Tools = {
  VIDEO: 'ビデオ',
  PHOTO: '写真',
  AUDIO: 'オーディオ',

  TAKE_PHOTO: '撮影',
  FROM_ALBUM: 'アルバムから選択',
  VIEW: '表示',
}

// POI title
const Map_PoiTitle = {
  FOOD: '食べ物',
  SCENE: '観光地',
  BANK: '銀行',
  SUPERMARKET: 'スーパー',
  HOTEL: 'ホテル',
  TOILET: 'トイレ',
  BUS_STOP: 'バスステーション',
  PARKING_LOT: '駐車場',
  HOSPITAL: '病院',
  GAS_STATION: 'ガソリンスタンド',
  MARKET: 'デパート',
  SUBWAY: '地下鉄',
}
export {
  Map_Main_Menu,
  Map_Label,
  Map_Layer,
  Map_Plotting,
  Map_Attribute,
  Map_Setting,
  Map_Settings,
  Map_Tools,
  Map_PoiTitle,
}
