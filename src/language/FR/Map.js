//制图
const Map_Label = {
  // 地图底部导航
  MAP: 'Carte',
  LAYER: 'Couche',
  ATTRIBUTE: 'Attribut',
  SETTING: 'Paramètre',
  SCENE: 'Paysage',
  NAME: 'Nom',
  TOOL_BOX: 'Bôite à outils',
  ARMAP: 'Paysage',
  NAVIGATION: 'Navigation',
  INCREMENT: 'Incrémenter',
  ENCLOSURE: 'Enceinte',
}

//地图、场景主菜单
const Map_Main_Menu = {
  CURRENT_MAP: 'Carte en cours',
  // 地图制图及公共 开始
  START: 'Start',
  START_OPEN_MAP: 'Ovrir la carte',
  START_NEW_MAP: 'Nouvelle carte',
  START_RECENT: 'Récent',
  START_SAVE_MAP: 'Enregistrer la carte',
  START_SAVE_AS_MAP: 'Enregistrer comme',
  START_OPEN_SENCE: 'Ouvrir le paysage',
  START_NEW_SENCE: 'Nouveau paysage',
  START_SAVE_SENCE: 'Enregistre le paysage',
  START_SAVE_AS_SENCE: 'Enregistrer comme',
  PLOT_SAVE_ANIMATION: "Enregistrer l'animation",
  ANIMATION_NODE_NAME: "Nom du nœud d'animation",

  PLOT: 'Traçage',

  // 地图制图及公共 添加
  OPEN: 'Ajouter',
  OPEN_DATASOURCE: 'Source de données',
  OPEN_MAP: 'Carte',
  OPEN_BACK: 'Retour',

  NAVIGATION_START: 'Naviguer',
  NETWORK_MODEL: 'Modèle',
  NETWORK_MODEL_FILE: 'Fichiers de modèle de réseau',
  NAVIGATION_WORKSPACE: 'Espace de travail de navigation',
  NAVIGATION_MAP: 'NAVIGATION_CARTE',
  NETWORK: 'RÉSEAU',
  NETWORK_MODULE: '路网',
  NETMODEL: 'Modèle de réseau',
  NETDATA: 'DONNÉES DE RÉSEAU',
  INDOORDATA: 'DONNÉES INTÉRIEURES',
  INDOOR_DATASOURCE: '室内数据源',
  OUTDOOR_DATASETS: '室外数据集',
  SWITCH_DATA: '导航数据切换',
  DATASET: 'Ensemble de données',
  Traffic: 'Trafic',

  ANALYSIS: 'Analyse',
  PROCESS: '处理',

  NEW_DATASOURCE: 'Nouvelle source de données',
  // 图例设置
  LEGEND_COLUMN: 'Numéro de colonne',
  LEGEND_WIDTH: 'Largeur',
  LEGEND_HEIGHT: 'Hauteur',
  LEGEND_FONT: '字体大小',
  LEGEND_ICON: '图标大小',
  LEGEND_COLOR: 'Couleur',
  LEGEND_POSITION: '图例位置',
  TOP_LEFT: '左上对齐',
  TOP_RIGHT: '右上对齐',
  LEFT_BOTTOM: '左下对齐',
  RIGHT_BOTTOM: '右下对齐',

  // 地图制图及公共 风格
  STYLE: 'Styles',
  STYLE_EDIT: '风格编辑',
  STYLE_SYMBOL: 'Symbole',
  STYLE_SIZE: 'Dimension',
  STYLE_SYMBOL_SIZE: 'Taille du symbole',
  STYLE_COLOR: 'Couleur',
  STYLE_ROTATION: 'Rotation',
  STYLE_TRANSPARENCY: 'Transparence',
  STYLE_LINE_WIDTH: 'Largeur de ligne',
  STYLE_FOREGROUND: 'Premier plan',
  STYLE_BACKGROUND: 'Arrière plan',
  STYLE_BORDER: 'Couleur de bordure',
  STYLE_BORDER_WIDTH: 'Largeur de bordure',
  STYLE_GRADIENT_FILL: 'Remplissage dégradé',
  STYLE_FRAME_COLOR: 'Couleur du cadre',
  STYLE_FRAME_SYMBOL: 'Symbole du cadre',
  STYLE_FONT: 'Police',
  STYLE_FONT_SIZE: 'Taille de police',
  STYLE_ALIGNMENT: 'Alignement',
  STYLE_FONT_STYLE: 'Style de police',
  STYLE_CONTRAST: 'Teinte',
  STYLE_BRIGHTNESS: 'Luminosité',
  STYLE_BOLD: 'Gras',
  STYLE_ITALIC: 'Italique',
  STYLE_UNDERLINE: 'Souligner',
  STYLE_STRIKEOUT: 'Barré',
  STYLE_OUTLINE: 'Contour',
  STYLE_SHADOW: 'Ombre',
  SATURATION: 'Saturation',
  CONTRAST: 'Contraste',

  ROTATE_LEFT: 'Rotation vers la gauche',
  ROTATE_RIGHT: 'Rotation vers la droite',
  VERTICAL_FLIP: 'Retournement vertical',
  HORIZONTAL_FLIP: 'Retournement horizontal',

  // 地图制图及公共 工具
  TOOLS: 'Outils',
  TOOLS_DISTANCE_MEASUREMENT: 'Mesure de distance',
  TOOLS_AREA_MEASUREMENT: 'Zone\n Mesure',
  TOOLS_AZIMUTH_MEASUREMENT: "Mesure d'azimut",
  TOOLS_SELECT: 'Sélectionner',
  TOOLS_RECTANGLE_SELECT: 'Sélection rectangle',
  TOOLS_ROUND_SELECT: 'Sélection circulaire',
  FULL_SCREEN: 'Plein écran',

  // 标注
  PLOTS: 'Marque',
  DOT_LINE: 'Ligne de points',
  FREE_LINE: 'Ligne libre',
  DOT_REGION: 'Région de points',
  FREE_REGION: 'Région libre',
  TOOLS_3D_CREATE_POINT: 'Créer un point',
  TOOLS_CREATE_POINT: 'Créer un point',
  TOOLS_CREATE_LINE: 'Créer une ligne',
  TOOLS_CREATE_REGION: 'Créer une région',
  TOOLS_CREATE_TRACK: 'Créer une piste',
  TOOLS_CREATE_TEXT: 'Créer du texte',

  TOOLS_NAME: 'Nom',
  TOOLS_REMARKS: 'Remarques',
  TOOLS_HTTP: 'Adresse http',
  TOOLS_PICTURES: 'Images',
  COLLECT_TIME: 'Temps',
  COORDINATE: 'Coordonnée',

  // 裁剪
  TOOLS_RECTANGLE_CLIP: 'Faire un clip rectangulaire',
  TOOLS_CIRCLE_CLIP: 'Faire un clip circulaire',
  TOOLS_POLYGON_CLIP: 'Faire un clip polygone',
  TOOLS_SELECT_OBJECT_AREA_CLIP: "Sélectionner un clip de zone d'objet",
  TOOLS_CLIP_INSIDE: "Clip à l'intérieur",
  TOOLS_ERASE: 'Effacer',
  TOOLS_EXACT_CLIP: 'Clip exact',
  TOOLS_TARGET_DATASOURCE: 'Source de données cible',
  TOOLS_UNIFIED_SETTING: 'Réglage unifié',
  MAP_CLIP: 'Clip de Carte',
  CLIP: 'Clip',

  CAMERA: 'Caméra',
  TOUR: 'Tour',
  TOUR_NAME: 'Nom du tour',

  STYLE_TRANSFER: 'Cartographie IA',
  OBJ_EDIT: '对象编辑',

  TOOLS_MAGNIFIER: 'Loupe',
  TOOLS_SELECT_ALL: 'Tout sélectionner',
  TOOLS_SELECT_REVERSE: 'Inversez la selection',

  // 三维 工具
  TOOLS_SCENE_SELECT: 'Sélectionner',
  TOOLS_PATH_ANALYSIS: 'Analyse de Trajectoire',
  TOOLS_VISIBILITY_ANALYSIS: 'Analyse de visibilité',
  TOOLS_CLEAN_PLOTTING: 'Nettoyer le traçage',
  TOOLS_BOX_CLIP: 'Clip de boîte',
  TOOLS_PLANE_CLIP: 'Clip de surface plane',
  TOOLS_CROSS_CLIP: 'Clip croisé',
  // 三维 飞行
  FLY: 'Survoler',
  FLY_ROUTE: 'Itinéraire de vol',
  FLY_ADD_STOPS: 'Ajouter des Stops',
  FLY_AROUND_POINT: "Voler autour d'un point",

  // 三维裁剪
  CLIP_LAYER: 'Couches',
  CLIP_AREA_SETTINGS: 'Paramètres',
  CLIP_AREA_SETTINGS_WIDTH: 'Largeur en bas',
  CLIP_AREA_SETTINGS_LENGTH: 'Longueur en bas',
  CLIP_AREA_SETTINGS_HEIGHT: 'hauteur',
  CLIP_AREA_SETTINGS_XROT: 'x pivoter',
  CLIP_AREA_SETTINGS_YROT: 'y pivoter',
  CLIP_AREA_SETTINGS_ZROT: 'Z pivoter',
  POSITION: 'Position',
  CLIP_SETTING: 'Clip settings',
  CLIP_INNER: 'Paramètres de clip',
  LINE_COLOR: 'Couleur de ligne',
  LINE_OPACITY: 'Opacité de ligne',
  SHOW_OTHER_SIDE: 'Afficher autre côté',
  ROTATE_SETTINGS: 'Paramètre de Pivotement',
  CLIP_SURFACE_SETTING: 'Paramètres de clip de surface',
  CUT_FIRST: "Veuillez d'abord faire un clip de la carte",
  // 专题制图 专题图
  THEME: 'Créer',
  THEME_UNIFORM_MAP: 'Carte uniforme',
  THEME_UNIQUE_VALUES_MAP: 'Valeurs uniques\n Carte',
  THEME_RANGES_MAP: 'Carte de gammes',
  THEME_UNIFORM_LABLE: 'Étiquette uniforme',
  THEME_UNIQUE_VALUE_LABLE_MAP: "Valeur Unique\n Carte d'étiquettes",
  THEME_RANGES_LABLE_MAP: "Gammes\n Carte d'étiquettes",
  THEME_AREA: 'Zone',
  THEME_STEP: 'Étape',
  THEME_LINE: 'Ligne',
  THEME_POINT: 'Point',
  THEME_COLUMN: 'Colonne',
  THEME_3D_COLUMN: 'Colonne 3D',
  THEME_PIE: 'Diagramme circulaire',
  THEME_3D_PIE: 'Diagramme circulaire 3D',
  THEME_ROSE: 'Rose',
  THEME_3D_ROSE: 'Rose 3D',
  THEME_STACKED_BAR: 'Barre empilées',
  THEME_3D_STACKED_BAR: 'Barre empilées 3D',
  THEME_RING: 'Anneau',
  THEME_DOT_DENSITY_MAP: 'Densité de points\n Carte',
  THEME_GRADUATED_SYMBOLS_MAP: 'Gradué\n Symboles carte',
  THEME_HEATMAP: 'Carte de chaleur',
  THEME_CRID_UNIQUE: '栅格单值专题图',
  THEME_CRID_RANGE: '栅格分段专题图',

  THEME_ALL_SELECTED: 'Tout Sélectionner',
  THEME_ALL_CANCEL: 'Tout Annuler',
  THEME_HIDE_SYSTEM_FIELDS: 'Masquer les champs du système',
  THEME_EXPRESSION: 'Expression',
  THEME_UNIQUE_EXPRESSION: 'Expression Unique',
  THEME_RANGE_EXPRESSION: "Plage d'expression",
  THEME_COLOR_SCHEME: 'Schéma de couleur',
  THEME_FONT_SIZE: 'Taille de police',
  THEME_FONT: 'Police',
  THEME_ROTATION: 'Rotation',
  THEME_COLOR: 'Couleur',

  THEME_METHOD: 'Méthode',
  THEME_EQUAL_INTERVAL: 'Intervalle égal',
  THEME_SQURE_ROOT_INTERVAL: 'Racine carrée\n Intervalle',
  THEME_STANDARD_DEVIATION_INTERVAL: "Intervalle d'écart type",
  THEME_LOGARITHMIC_INTERVAL: 'Intervalle logarithmique',
  THEME_QUANTILE_INTERVAL: 'Intervalle quantile',
  THEME_MANUAL: 'Manuel',

  THEME_BACK_SHAPE: 'Forme arrière',
  THEME_DEFAULT: 'Défaut',
  THEME_RECTANGLE: 'Rectangle',
  THEME_ROUND_RECTANGLE: 'Rectangle circulaire',
  THEME_ELLIPSE: 'Ellipse',
  THEME_DIAMOND: 'Diamant',
  THEME_TRIANGLE: 'Triangle',
  THEME_MARKER_SYMBOL: 'Symbole du marqueur',

  THEME_HEATMAP_RADIUS: 'Rayon nucléaire',
  THEME_HEATMAP_COLOR: 'Schéma de couleur',
  THEME_HEATMAP_FUZZY_DEGREE: 'Degré de flou de la couleur',
  THEME_HEATMAP_MAXCOLOR_WEIGHT: 'Poids Max de couleur',

  THEME_GRANDUATE_BY: 'Granduer par',
  THEME_CONSTANT: 'Constant',
  THEME_LOGARITHM: 'Logarithme',
  THEME_SQUARE_ROOT: 'Racine carrée',
  THEME_MAX_VISIBLE_SIZE: 'Taille max de visibilité',
  THEME_MIN_VISIBLE_SIZE: 'Taille min de visibilité',

  // 自定义专题图设置
  THEME_RANGES_LABEL_MAP_TITLE: '分段标签专题图',
  THEME_RANGES_MAP_TITLE: '分段风格专题图',
  THEME_UNIQUE_VALUES_MAP_TITLE: '单值风格专题图',
  THEME_UNIQUE_VALUE_LABEL_MAP_TITLE: '单值标签专题图',
  RANGE: '段数',
  PREVIEW: '预览',
  CUSTOM_THEME_MAP: '自定义专题图',
  COLOR_PICKER: '色盘',
  USER_DEFINE: '用户自定义',

  DOT_VALUE: 'Valeur du point',
  GRADUATE_BY: 'Granduer par',
  DATUM_VALUE: 'Valeur de donnée',
  RANGE_COUNT: 'Nombre de plages',

  // 外业采集 采集
  CREATE_WITH_SYMBOLS: 'Créer avec des symboles',
  CREATE_WITH_TEMPLATE: 'Créer avec un modèle',
  POINT_SYMBOL_LIBRARY: '点符号库',
  LINE_SYMBOL_LIBRARY: '线型符号库',
  REGION_SYMBOL_LIBRARY: '填充符号库',

  COLLECTION: 'Collecte',
  COLLECTION_RECENT: 'Récent',
  COLLECTION_SYMBOL: 'Symbole',
  COLLECTION_GROUP: 'Groupe',
  COLLECTION_UNDO: 'Annuler',
  COLLECTION_REDO: 'Refaire',
  COLLECTION_CANCEL: 'Annuler',
  COLLECTION_SUBMIT: 'Soumettre',
  COLLECTION_METHOD: 'Méthode de collecte',
  COLLECTION_POINTS_BY_GPS: 'Collecte des points par GPS',
  COLLECTION_LINE_BY_GPS: 'Collecte de ligne par GPS',
  COLLECTION_POINT_DRAW: 'Point Dessiné',
  COLLECTION_FREE_DRAW: 'Dessin Libre',
  COLLECTION_ADD_POINT: 'Ajouter des points',
  COLLECTION_START: 'Démarrer',
  COLLECTION_PAUSE: 'Pause',
  COLLECTION_STOP: 'Stop',

  // 外业采集 编辑
  EDIT: 'Éditer',
  EDIT_ADD_NODES: 'Ajouter des nœuds',
  EDIT_NODES: 'Éditer les nœuds',
  EDIT_DELETE: 'Supprimer',
  EDIT_DELETE_NODES: 'Supprimer les nœuds',
  EDIT_DELETE_OBJECT: 'Supprimer des objets',
  EDIT_ERASE: 'Effacer',
  EDIT_SPLIT: 'Diviser',
  EDIT_UNION: 'Union',
  EDIT_DRAW_HOLLOW: 'Dessiner creux',
  EDIT_PATCH_HOLLOW: 'Pièce creuse',
  EDIT_FILL_HOLLOW: 'Remplir le creux',
  EDIT_CANCEL_SELECTION: 'Annuler la sélection',
  MOVE: 'Déplacer',
  OBJMOVE: '对象平移',
  FREE_DRAW_ERASE: 'Effacer dessin libre',

  // 标绘
  PLOTTING: 'Traçage',
  PLOTTING_LIB_CHANGE: 'Changer le traçage de Lib',
  PLOTTING_LIB: 'Traçage Lib',
  PLOTTING_ANIMATION: 'Déduire',
  PLOTTING_ANIMATION_DEDUCTION: "Tracer la déduction d'animation",
  PLOTTING_ANIMATION_RESET: 'Réinitialiser',

  // 分享
  SHARE: 'Partager',
  SHARE_WECHAT: 'Wechat',
  SHARE_FRIENDS: 'Amis',
  SHARE_EXPLORE: 'Explorer',

  MAO_ROAD_DISTRIBUTION: 'Route\nRéseau',

  MAP_AR_DONT_SUPPORT_DEVICE: 'Ne supporte pas ce dispositif',
  MAP_AR_MEASURE: 'AR Measure', //待翻译
  MAP_AR_ANALYZE: 'AR Analyze', //待翻译
  MAP_AR_MAPPING: 'AR Mapping',
  MAP_AR_TOOL: 'AR Tool', //待翻译
  MAP_AR_CAMERA_EXCEPTION: "La caméra est anormale, veuillez vérifier si l'autorisation est activée.",
  MAP_AR_AI_ASSISTANT: 'IA\nCollecte',
  MAP_AR_AI_ASSISTANT_CUSTOM_COLLECT: 'Collecte personnalisée',
  MAP_AR_AI_ASSISTANT_MUNICIPAL_COLLECT: 'Collecte municipale',
  MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT: 'Collecte des violations',
  MAP_AI_POSE_ESTIMATION: 'Pose Estimation', //待翻译
  MAP_AI_GESTURE_BONE: 'Gesture Bone', //待翻译
  MAP_AR_AI_ASSISTANT_ROAD_COLLECT: 'Collecte de route',
  MAP_AR_AI_ASSISTANT_POI_COLLECT: 'Carte POI',
  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT: 'Mesure IA',
  MAP_AR_AI_ASSISTANT_CLASSIFY: 'Classifier cible',
  MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT: 'Rassembler la collecte',
  MAP_AR_AI_ASSISTANT_TARGET_COLLECT: 'Collecter cible',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT: 'Collecte de haute précision',
  MAP_AR_AI_ASSISTANT_ILLEGALLY_PARK_COLLECT: 'Illégalement-Pack Collect',
  MAP_AR_AI_ASSISTANT_CAST_MODEL_OPERATE: 'Modèle en fonte',
  MAP_AR_AI_ASSISTANT_MEASURE_AREA: 'Zone AR',
  MAP_AR_AI_ASSISTANT_MEASURE_LENGTH: 'AR allant',
  MAP_AR_AI_ASSISTANT_MEASURE_DRAW_LINE: 'Dessin au trait AR',
  MAP_AR_AI_ASSISTANT_MEASURE_DRAW_AREA: 'AR photo',
  MAP_AR_AI_ASSISTANT_MEASURE_DRAW_POINT: 'Points de tirage AR',
  MAP_AR_AI_ASSISTANT_MEASURE_MEASURE_HEIGHT: 'Mesure de hauteur AR',
  MAP_AR_VIDEO: 'AR Video', //待翻译
  MAP_AR_IMAGE: 'AR Picture',
  MAP_AR_EFFECT: 'AR Effect',
  MAP_AR_WEBVIEW: 'AR WebPage',
  MAP_AR_TEXT: 'AR Text',
  MAP_AR_SELECT_EFFECT: 'Select Effect',
  MAP_AR_AI_ASSISTANT_NEWDATA: 'Nouvelles données',
  MAP_AR_AI_ASSISTANT_SCENE_NEW_DATANAME: ' Remplissez le nom',
  MAP_AR_TO_CURRENT_POSITION: 'to Current', //待翻译
  MAP_AR_SELECT_POINT_PLANE: 'to Plane',
  MAP_AR_ADD_TO_CURRENT_POSITION: 'to Current',
  MAP_AR_ADD_TO_PLANE: 'Select Point',
  MAP_AR_MOVE_TO_CURRENT_POSITION: 'to Current',
  MAP_AR_MOVE_TO_PLANE: 'Select Point',

  MAP_AR_AI_ASSISTANT_LEFT_ROTATE: 'Tournez à gauche',
  MAP_AR_AI_ASSISTANT_RIGHT_ROTATE: 'Tournez à droite',
  MAP_AR_AI_ASSISTANT_SAND_TABLE: 'Table de sable',
  MAP_AR_AI_ASSISTANT_SAND_TABLE_HIDE: 'Masquer la table de sable',
  MAP_AR_AI_ASSISTANT_SAND_TABLE_MODEL: 'modèle',
  MAP_AR_AI_ASSISTANT_OPREATE_MODEL: 'Modèle de projection',
  MAP_AR_AI_ASSISTANT_OPREATE_MODEL_ARCHITECTURE: 'bâtiment',
  MAP_AR_AI_ASSISTANT_OPREATE_MODEL_PATH: 'route',
  MAP_AR_AI_ASSISTANT_OPREATE_MODEL_MARKER: 'Faire appel à',

  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_CHOOSE_MODEL: 'Choisissez le modèle',
  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_SEARCHING: 'Surface de recherche',
  MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT_VIEW_DISTANCE: 'Distance de vue:',

  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOTALLENGTH: 'Longueur totale:',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOLASTLENGTH: "Jusqu'à la dernière longueur:",
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_HISTORY: "Recueillir l'historique",
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NAME: 'Remplissez le nom',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY: 'Aucun historique de collecte',
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_START: "Commencer l'enregistrement",
  MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_STOP: "Arrêter l'enregistrement",
  MAP_AR_AI_ASSISTANT_SAVE_LINE: 'Ligne',
  MAP_AR_AI_ASSISTANT_SAVE_POINT: 'Point',
  MAP_AR_AI_SAVE_SUCCESS: 'Enregistré succès',
  MAP_AR_AI_SAVE_POINT: 'Enregistrer le point',
  MAP_AR_AI_SAVE_LINE: 'Enregistrer la ligne',
  MAP_AR_AI_CHANGE: 'Changement',
  MAP_AR_AI_CLEAR: 'Effacer',
  MAP_AR_AI_NEW_ROAD: 'Veuillez créer une nouvelle route',

  // 待翻译
  MAP_AR_AI_SAVE_REGION: 'Save Region',
  MAP_AR_AI_SCENE_TRACK_COLLECT: 'Track Collect',
  MAP_AR_AI_SCENE_POINT_COLLECT: 'Point Collect',
  MAP_AR_AI_SCENE_POINT_COLLECT_CLICK_HINT: 'Click the screen to determine the current point',

  MAP_AR_AI_MEASURE_LENGTH: 'Mesure de longueur',
  MAP_AR_AI_MEASURE_AREA: 'Zone de mesure',
  MAP_AI_POSE_ESTIMATION_ZOOM: 'Pose Zoom', //待翻译
  MAP_AI_POSE_ESTIMATION_PAN: 'Pose Pan', //待翻译
  MAP_AI_POSE_ESTIMATION_OVERLOOK: 'Pose Overlook', //待翻译
  MAP_AI_POSE_ESTIMATION_LOOK: 'Pose Look', //待翻译
  MAP_AI_POSE_ESTIMATION_SWITCH_CAMERA: 'Switch Camera', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION: 'Association Map', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_CANCEL: 'Association Cancel', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_UP: 'Up', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_DOWN: 'Down', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_LEFT: 'Left', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_RIGHT: 'Right', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_SHRINK: 'Shrink', //待翻译
  MAP_AI_POSE_ESTIMATION_ASSOCIATION_MAGNIFY: 'Magnify', //待翻译
  MAP_AI_GESTURE_BONE_DETAIL: 'Gesture detail', //待翻译
  MAP_AI_GESTURE_BONE_CLOSE: 'Close', //待翻译

  MAP_AR_AI_ASSISTANT_CLASSIFY_LOADING: 'Classifier le chargement',
  MAP_AR_AI_ASSISTANT_CLASSIFY_FAILED: 'Échec de la classification, réessayer',
  MAP_AR_AI_ASSISTANT_CLASSIFY_NOPICS: "Aucune image n'est sélectionnée",
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT: 'Résultat',
  MAP_AR_AI_ASSISTANT_CLASSIFY_CONFIDENCE: 'Confidence',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_NAME: "Nom d'objet:",

  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_TIME: 'Classifier le temps:',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_REMARKS: 'Remarques:',
  MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_PLEA_REMARKS: 'Remplissez la note',
  MAP_AR_AI_ASSISTANT_CLASSIFY_SAVE: 'Sauvegarder',

  MAP_AR_AI_CANCEL: 'Annuler',
  MAP_AR_AI_CONFIRM: 'confirmer',

  // 智能配图
  FILL: 'Remplir',
  BORDER: 'Bordure',
  LINE: 'Ligne',
  MARK: 'Marque',

  // 地图导航
  START_POINT: 'Point de départ',
  END_POINT: 'Destination',
  DRAW: 'Dessiner',
  ROAD_DETAILS: 'Détails de la route',
  ROUTE_THROUGH: 'Traverser：',
  DISTANCE: 'Distance:',
  METERS: 'm',
  KILOMETERS: 'Km',
  DISPLAY_MAP: 'Afficher la carte',
  START_FROM_START_POINT: 'À partir du point initial',
  ARRIVE_AT_THE_DESTINATION: 'Arrivée à destination',
  REAL_NAVIGATION: 'Démarrer la navigation',
  SIMULATED_NAVIGATION: 'Navigation simulée',
  GO_STRAIGHT: 'Aller droit',
  SELECT_START_POINT: 'Sélectionnez Démarrer',
  SELECT_DESTINATION: 'Sélectionner la destination',
  SET_AS_START_POINT: 'Définir comme début',
  SET_AS_DESTINATION: 'Définir comme destination',
  CLEAR_NAV_HISTORY: "Effacer l'historique",
  ROUTE_ANALYST: 'Analyste de route',
  SELECT_POINTS: 'Sélectionnez les points',
  LONG_PRESS_SELECT_POINTS: '(appui long pour sélectionner un point)',
  INCREMENT_ROAD: 'Incrémentez la Route',
  TRACK: 'Par piste',
  HAND_PAINTED: 'Par la main',
  NETWORK_DATASET: "Réseau d'ensemble de données",
  MODEL_FILE: 'Fichiers de modèle de navigation',
  MY_LOCATION: 'Ma position',

  //导航采集
  MAP_INDOOR_NETWORK: 'Indoor', //待翻译
  MAP_OUTDOOR_NETWORK: 'Outdoor',

  MAP_INCREMENT_START: 'Start',
  MAP_INCREMENT_STOP: 'Stop',
  MAP_INCREMENT_ADD_POINT: 'Add point',
  MAP_INCREMENT_CANCEL: 'Cancel',
  MAP_INCREMENT_COMMIT: 'Commit',

  MAP_INCREMENT_GPS_POINT: 'Collect Points by GPS',
  MAP_INCREMENT_GPS_TRACK: 'Collect Line by GPS',
  MAP_INCREMENT_POINTLINE: 'Point Draw',
  MAP_INCREMENT_FREELINE: 'Free Draw',

  MAP_TOPO_ADD_NODE: 'Add Node',
  MAP_TOPO_EDIT_NODE: 'Edit node',
  MAP_TOPO_DELETE_NODE: 'Delete node',
  MAP_TOPO_DELETE_OBJECT: 'Delete object',
  MAP_TOPO_SMOOTH: 'Smooth',
  MAP_TOPO_SPLIT_LINE: 'Line Split',
  MAP_TOPO_SPLIT: 'Interrupt',
  MAP_TOPO_EXTEND: 'Extend',
  MAP_TOPO_TRIM: 'Trim',
  MAP_TOPO_RESAMPLE: 'Re-sampling',
  MAP_TOPO_CHANGE_DIRECTION: 'Change Direction',
  ADD_DATASET: 'Append Dataset',
  SELECT_ROADNAME_FIELD: 'Select the Road Name Field',
  SELECT_FIELD: 'Select Field',
  MERGE_CANCEL: 'Cancel',
  MERGE_CONFIRM: 'Confirm',
  MERGE_SELECT_ALL: 'Select All',
  MERGE_ADD: 'Append',
  MERGE_DATASET: 'Merge Datasets',
}

//推演动画
const Map_Plotting = {
  PLOTTING_ANIMATION_MODE: "Mode d'animation",
  PLOTTING_ANIMATION_OPERATION: 'Opération de résultat',
  PLOTTING_ANIMATION_START_MODE: 'Début',

  PLOTTING_ANIMATION_WAY: 'Manière',
  PLOTTING_ANIMATION_BLINK: 'Clignotement',
  PLOTTING_ANIMATION_ATTRIBUTE: 'Attribut',
  PLOTTING_ANIMATION_SHOW: 'Indiquer',
  PLOTTING_ANIMATION_ROTATE: 'Pivoter',
  PLOTTING_ANIMATION_SCALE: 'Échelle',
  PLOTTING_ANIMATION_GROW: 'Grandir',

  PLOTTING_ANIMATION_START_TIME: 'Heure de début',
  PLOTTING_ANIMATION_DURATION: 'Durée',
  PLOTTING_ANIMATION_FLLOW_LAST: 'Suivre la dernière animation',
  PLOTTING_ANIMATION_CLICK_START: 'Cliquez sur Démarrer',
  PLOTTING_ANIMATION_TOGETHER_LAST: 'Ensemble dernière animation',
  PLOTTING_ANIMATION_CONTINUE: 'Continuer la création',
  PLOTTING_ANIMATION_WAY_SET: "Ensemble de moyens d'animation",
  PLOTTING_ANIMATION_SAVE: 'Sauvegarder',
  PLOTTING_ANIMATION_BACK: 'Arrière',

  ANIMATION_ATTRIBUTE_STR: "Attribut d'animation",
  ANIMATION_WAY: "Manière d'animation",
  ANIMATION_BLINK: 'Animation de clignotement',
  ANIMATION_ATTRIBUTE: "Attribut d'animation",
  ANIMATION_SHOW: "Spectacle d'animation",
  ANIMATION_ROTATE: "Rotation d'animation",
  ANIMATION_SCALE: "Échelle d'animation",
  ANIMATION_GROW: "Grandissement d'animation",

  ANIMATION_SCALE_START_SCALE: "Démarrer l'échelle",
  ANIMATION_SCALE_END_SCALE: 'Échelle de fin',

  ANIMATION_SHOW_STATE: "Afficher l'état",
  ANIMATION_SHOW_EFFECT: "Afficher l'effet",

  ANIMATION_BLINK_INTERVAL: 'Intervalle de clignotement',
  ANIMATION_BLINK_NUMBER: 'Numéro de clignotement',
  ANIMATION_BLINK_REPLACE: 'Remplacer Clignotement',
  ANIMATION_BLINK_START_COLOR: 'Couleur de début de clignotement',
  ANIMATION_BLINK_REPLACE_COLOR: 'Remplacer la couleur de Clignotement',

  ANIMATION_ROTATE_DIRECTION: 'La direction de pivotement',
  ANIMATION_ROTATE_CLOCKWISE: "Sens des aiguilles d'une montre",
  ANIMATION_ROTATE_ANTICLOCKWISE: "Sens inverse des aiguilles d'une montre",
  ANIMATION_ROTATE_START_ANGLE: 'Angle de départ',
  ANIMATION_ROTATE_END_ANGLE: "Angle d'arrivée",

  ANIMATION_ATTRIBUTE_LINE_WIDTH: 'Largeur de ligne',
  ANIMATION_ATTRIBUTE_LINE_WIDTH_START: 'Début de la largeur de ligne',
  ANIMATION_ATTRIBUTE_LINE_WIDTH_END: 'Fin de la largeur de ligne',
  ANIMATION_ATTRIBUTE_LINE_COLOR: 'Couleur de la ligne',
  ANIMATION_ATTRIBUTE_LINE_COLOR_START: 'Début de la couleur de ligne',
  ANIMATION_ATTRIBUTE_LINE_COLOR_END: 'Fin de la couleur de ligne',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH: 'Largeur de la ligne de contour',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH_START: 'Début de la largeur de la ligne contour',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH_END: 'Fin de la largeur de la ligne contour',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR: 'Couleur de la ligne contour',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR_START: 'Début de la couleur de la ligne contour',
  ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR_END: 'Fin de la couleur de la ligne contour',

  ANIMATION_NODE_EDIT: "Editer l'animation",
}

//图层
const Map_Layer = {
  PLOTS: 'Mes marques',
  PLOTS_IMPORT: 'Importer des marques',
  PLOTS_DELETE: 'Supprimer les marques',
  PLOTS_EDIT: '编辑标注',
  PLOTS_SET_AS_CURRENT: 'Définir comme marques en cours',

  LAYERS: 'Mes couches',
  LAYERS_MOVE_UP: 'Déplacer vers le haut',
  LAYERS_MOVE_DOWN: 'Déplacer vers le bas',
  LAYERS_TOP: 'Haut',
  LAYERS_BOTTOM: 'Bas',
  LAYERS_LONG_PRESS: 'Appuyez longuement et faites glisser pour trier',
  LAYERS_SET_AS_CURRENT_LAYER: 'Définir comme couche en cours',
  LAYERS_FULL_VIEW_LAYER: 'Afficher cette couche en entier',
  LAYERS_LAYER_STYLE: 'Style de couche',
  LAYERS_FULL_EXTENT: 'Extension totale',
  LAYERS_SET_VISIBLE_SCALE: "Définir l'échelle de visibilité",
  LAYERS_RENAME: 'Renommer',
  LAYERS_COPY: 'Copie',
  LAYERS_PASTE: 'Coller',
  LAYERS_LAYER_PROPERTIES: 'Propriétés de la couche',
  LAYERS_REMOVE: 'Retirer',
  LAYERS_COLLECT: 'Collecte sur la couche en cours',
  LAYERS_MAXIMUM: 'Échelle de visibilité maximale',
  LAYERS_MINIMUM: 'Échelle de visibilité minimale',
  LAYERS_UER_DEFINE: "Définir par l'utilisateur",
  LAYER_NONE: '无',
  LAYERS_SET_AS_CURRENT_SCALE: 'Définir comme échelle en cours',
  LAYERS_CLEAR: 'Effacer',
  LAYERS_LAYER_NAME: 'Nom de la couche',
  LAYERS_COMPLETE_LINE: 'Ligne complète',
  LAYERS_OPTIMIZE_CROSS: 'Optimiser la traversée',
  LAYERS_ANTIALIASING: 'Anti crénelage',
  LAYERS_SHOW_OVERLAYS: 'Afficher les superpositions',
  LAYERS_SCALE_SYMBOL: "Symbole d'échelle",
  LAYERS_SCALE: 'Échelle',
  LAYERS_MIN_OBJECT_SIZE: "Dimension minimale de l'objet",
  LAYERS_FILTER_OVERLAPPING_SMALL_OBJECTS: 'Filtre de superpositions des petits objets',
  LAYERS_SHARE: 'Partager',
  SELECT_LAYSER_SCALE: 'Veuillez sélectionner une échelle',
  LAYER_SCALE_RANGE_WRONG: "l'échelle de visibilité maximale doit être supérieure à l'échelle de visibilité minimale",

  VISIBLE: 'Visible',
  NOT_VISIBLE: 'Invisible',
  OPTIONAL: 'Optionnel',
  NOT_OPTIONAL: 'Pas optionnel',
  EDITABLE: 'Modifiable',
  NOT_EDITABLE: 'Non modifiable',
  SNAPABLE: 'Cassable',
  NOT_SNAPABLE: 'Non Cassable',
  // 专题图图层
  LAYERS_CREATE_THEMATIC_MAP: 'Créer une carte thématique',
  LAYERS_MODIFY_THEMATIC_MAP: 'Modifier la carte thématique',

  BASEMAP: 'Mon fond de carte',
  BASEMAP_SWITH: 'interchanger fond de  carte',
  MY_TERRAIN: 'Mon terrain',

  //待翻译
  SCALE_TO_CURRENT_LAYER: 'Scale to the current layer',
  ADD_A_TERRAIN_LAYER: 'Add a terrain layer',
  ADD_A_IMAGE_LAYER: 'Add a image layer',
  REMOVE_THE_CURRENT_LAYER: 'Remove the current layer',
  ONLINE_BASE_MAP: 'Online BaseMap',
  ADD_LAYER_URL: 'Add Layer Url',
  TERRAIN: 'Terrain',
  IMAGE: 'Image',
  IS_ADD_NOTATION_LAYER: 'Do you want to add the notation layer',

  LAYER_SETTING_IMAGE_DISPLAY_MODE: 'Display Mode', //待翻译
  LAYER_SETTING_IMAGE_STRETCH_TYPE: 'Stretch Type',
  DISPLAY_MODE_COMPOSITE: 'Composite',
  DISPLAY_MODE_STRETCHED: 'Stretched',
  STRETCH_TYPE_NONE: 'None',
  STRETCH_TYPE_STANDARDDEVIATION: 'Standard Deviation',
  STRETCH_TYPE_MINIMUMMAXIMUM: 'Minimun Maximum',
  STRETCH_TYPE_HISTOGRAMEQUALIZATION: 'Histogram Equalization',
  STRETCH_TYPE_HISTOGRAMSPECIFICATION: 'Histogram Specification',
  STRETCH_TYPE_GAUSSIAN: 'Gaussian',
}

//属性
const Map_Attribute = {
  ATTRIBUTE_SORT: 'Trier',
  ATTRIBUTE_LOCATION: 'Emplacement',
  ATTRIBUTE_CANCEL: '取消',
  ATTRIBUTE_EDIT: 'Éditer',
  ATTRIBUTE_STATISTIC: 'Statistique',
  ATTRIBUTE_ASSOCIATION: 'Association',
  ATTRIBUTE_NO: 'NON.',
  ATTRIBUTE_CURRENT: 'Courant',
  ATTRIBUTE_FIRST_RECORD: 'Premier record',
  ATTRIBUTE_LAST_RECORD: 'Dernier record',
  ATTRIBUTE_RELATIVE: 'Relatif',
  ATTRIBUTE_ABSOLUTE: 'Absolu',
  ATTRIBUTE_UNDO: 'Annuler',
  ATTRIBUTE_REDO: 'Refaire',
  ATTRIBUTE_REVERT: 'Revenir',
  ATTRIBUTE_FIELD_ADD: 'Ajouter',
  ATTRIBUTE_ADD: '添加属性',
  ATTRIBUTE_DETAIL: '属性详情',
  REQUIRED: '必填',
  NAME: '名称',
  TYPE: '类型',
  LENGTH: '长度',
  DEFAULT: '缺省值',
  CONFIRM_ADD: '确认',

  DETAIL: 'Détail',
  // 统计模式
  MAX: 'Max',
  MIN: 'Min',
  AVERAGE: 'Moyenne',
  SUM: 'Sum',
  VARIANCE: 'Variance',
  STANDARD_DEVIATION: 'STDEV',
  COUNT_UNIQUE: 'Compter',
  FIELD_TYPE: 'Type de champ',
  ALIAS: 'Alias',
  ASCENDING: 'Ascendant',
  DESCENDING: 'Descendant',
}

// 地图设置
const Map_Setting = {
  BASIC_SETTING: 'Paramètres de base',
  ROTATION_GESTURE: 'Geste de rotation',
  PITCH_GESTURE: 'Le Pas de Geste',
  THEME_LEGEND: 'Légende du thème',
  COLUMN_NAV_BAR: '横屏时纵向显示导航栏',
  REAL_TIME_SYNC: '实时同步',

  // 效果设置
  EFFECT_SETTINGS: "Paramètres d'effet",
  ANTI_ALIASING_MAP: "Carte d'anticrénelage",
  SHOW_OVERLAYS: 'Afficher les superpositions',

  // 范围设置
  BOUNDS_SETTING: 'Paramètres des bornes',
  FIX_SCALE: 'Échelle fixe',

  // 三维场景设置
  SCENE_NAME: 'Nom de paysage',
  FOV: 'FOV',
  SCENE_OPERATION_STATUS: 'État de fonctionnement du paysage',
  VIEW_MODE: "Mode d'affichage",
  TERRAIN_SCALE: 'Échelle du terrain',
  SPHERICAL: 'Sphérique',
}

// 地图设置菜单
const Map_Settings = {
  THEME_LEGEND: 'Légende du thème',
  // 一级菜单
  BASIC_SETTING: 'Paramètres de base',
  RANGE_SETTING: 'Paramètres des bornes',
  COORDINATE_SYSTEM_SETTING: 'Paramètres du système de coordonnées',
  ADVANCED_SETTING: 'Paramètres avancés',
  LEGEND_SETTING: 'Paramètres de légende',
  ENCLOSURE_NAME: 'Nom du boîtier',
  START_TIME: 'Heure de début',
  END_TIME: 'Heure de fin',
  REMARKS: 'Remarques',
  DRAWING_RANGE: 'Plage de dessin',

  //目标识别二级菜单
  Beta: '(Fonction Expérimentale)',

  // 视频地图设置	一级菜单
  POI_SETTING: 'Paramètres POI',
  DETECT_TYPE: 'Détecter les types',
  DETECT_STYLE: 'Détecter le style',

  POI_SETTING_PROJECTION_MODE: 'Mode de projection',
  POI_SETTING_OVERLAP_MODE: 'Mode de superposition',
  POI_SETTING_POLYMERIZE_MODE: 'Mode polymériser',

  DETECT_TYPE_PERSON: 'Personne',
  DETECT_TYPE_BICYCLE: 'Vélo',
  DETECT_TYPE_CAR: 'Voiture',
  DETECT_TYPE_MOTORCYCLE: 'Moto',
  DETECT_TYPE_BUS: 'Autobus',
  DETECT_TYPE_TRUCK: 'Camion',
  DETECT_TYPE_TRAFFICLIGHT: 'Feu de circulation',
  DETECT_TYPE_FIREHYDRANT: "Bouche d'incendie",
  DETECT_TYPE_CUP: 'Tasse',
  DETECT_TYPE_CHAIR: 'Chaise',
  DETECT_TYPE_BIRD: 'Oiseau',
  DETECT_TYPE_CAT: 'Voiture',
  DETECT_TYPE_DOG: 'Chien',
  DETECT_TYPE_POTTEDPLANT: 'Plante en pot',
  DETECT_TYPE_TV: 'Télé',
  DETECT_TYPE_LAPTOP: 'Ordinateur Portable',
  DETECT_TYPE_MOUSE: 'Souris',
  DETECT_TYPE_KEYBOARD: 'Clavier',
  DETECT_TYPE_CELLPHONE: 'Téléphone portable',
  DETECT_TYPE_BOOK: 'Livre',
  DETECT_TYPE_BOTTLE: 'Bouteille',

  DETECT_STYLE_IS_DRAW_TITLE: 'Dessiner le Titre',
  DETECT_STYLE_IS_DRAW_CONFIDENCE: 'Dessiner la Confidence',
  DETECT_STYLE_IS_SAME_COLOR: 'Même couleur',
  DETECT_STYLE_SAME_COLOR: 'Même valeur de couleur',
  DETECT_STYLE_STROKE_WIDTH: 'Largeur du trait',
  COUNTRACKED: 'Compte de piste',

  // 二级菜单 基本设置
  MAP_NAME: 'Nom de la carte',
  SHOW_SCALE: "Afficher l'échelle",
  ROTATION_GESTURE: 'Geste de rotation',
  PITCH_GESTURE: 'Le Pas de Geste',
  ROTATION_ANGLE: 'Angle de rotation',
  COLOR_MODE: 'Mode de couleur',
  BACKGROUND_COLOR: "Couleur de l'arrière plan",
  MAP_ANTI_ALIASING: 'Anticrénelage de carte',
  FIX_SYMBOL_ANGLE: "Fixer l'angle du symbole",
  FIX_TEXT_ANGLE: "Fixer l'angle du texte",
  FIX_TEXT_DIRECTION: 'Fixer la direction du texte',
  SHOW_OVERLAYS: 'Afficher les superpositions',
  ENABLE_MAP_MAGNIFER: 'Activer la loupe de la carte',

  // 二级菜单 范围设置
  MAP_CENTER: 'Centre de la carte',
  MAP_SCALE: 'Échelle de la carte',
  FIX_SCALE_LEVEL: "Fixer le niveau d'échelle",
  CURRENT_VIEW_BOUNDS: 'Limites de la vue en cours',

  // 二级菜单 坐标系设置
  COORDINATE_SYSTEM: 'Système de coordonnées',
  COPY_COORDINATE_SYSTEM: 'Copier le système de coordonnées',
  DYNAMIC_PROJECTION: 'Activer la projection dynamique',
  TRANSFER_METHOD: 'Méthode de transfert',

  // 二级菜单 高级设置
  FLOW_VISIUALIZATION: 'Visualisation des flux',
  SHOW_NEGATIVE_DATA: 'Afficher les données négatives',
  AUTOMATIC_AVOIDANCE: 'Évitement automatique',
  ZOOM_WITH_MAP: 'Zoom avec carte',
  SHOW_TRACTION_LINE: 'Afficher la ligne de traction',
  GLOBAL_STATISTICS: 'Statistiques GLOBALES',
  CHART_ANNOTATION: 'Annotation du graphique',
  SHOW_AXIS: "Afficher l'axe",
  HISTOGRAM_STYLE: "Style d'histogramme",
  ROSE_AND_PIE_CHART_STYLE: 'Rose & Style de diagramme circulaire',

  // 三级菜单 颜色模式
  DEFAULT_COLOR_MODE: 'Mode de couleur par défaut',
  BLACK_AND_WHITE: 'Noir et blanc',
  GRAY_SCALE_MODE: 'Mode échelle de gris',
  ANTI_BLACK_AND_WHITE: 'Anti noir et blanc',
  ANTI_BLACK_AND_WHITE_2: 'Anti noir et blanc,Autres couleurs inchangées',

  // 三级菜单 窗口四至范围
  LEFT: 'Gauche',
  RIGHT: 'Droite',
  TOP: 'Haut',
  BOTTOM: 'Bas',

  // 三级菜单 坐标系设置
  PLAN_COORDINATE_SYSTEM: 'Système de coordonnées de plan',
  GEOGRAPHIC_COORDINATE_SYSTEM: 'Système de coordonnées géographiques',
  PROJECTED_COORDINATE_SYSTEM: 'Système de coordonnées projetées',

  // 三级菜单 复制坐标系
  FROM_DATASOURCE: 'Depuis la source de données',
  FROM_DATASET: "Depuis l'ensemble de données",
  FROM_FILE: 'Depuis le fichier',

  // 四级菜单 转换方法参数设置
  BASIC_PARAMS: 'Paramètres de base',
  OFFSET: 'Offset',
  PROPORTIONAL_DIFFERENCE: 'Différence proportionnelle',
  ROTATION_ANGLE_SECONDS: 'Angle de rotation(Seconds)',

  // 四级菜单 和复制提示
  DATASOURCES: 'Source de données',
  DATASETS: 'Ensemble de données',
  TYPE: 'Type',
  FORMAT: 'Format',
  ALL_COORD_FILE: 'Fichier du système de coordonnées supporté',
  SHAPE_COORD_FILE: 'Fichier du système de coordonnées de forme',
  MAPINFO_FILE: 'Fichier de modification MapInfo',
  MAPINFO_TAB_FILE: "Fichier d'onglet MapInfo",
  IMG_COORD_FILE: "Fichier du système de coordonnées d'image",
  COORD_FILE: 'Fichier du système de coordonnées',

  // 设置的一些参数
  PERCENT: 'Pour cent',
  OFF: 'OFF',
  CONFIRM: 'Confirmer',
  CANCEL: 'Annuler',
  COPY: 'Copie',
}

// 地图工具
const Map_Tools = {
  VIDEO: 'Vidéo',
  PHOTO: 'Photo',
  AUDIO: 'Audio',

  TAKE_PHOTO: 'Prendre une photo',
  FROM_ALBUM: "Choisissez à partir de l'album",
  VIEW: 'Vue',
}

// POI title
const Map_PoiTitle = {
  FOOD: 'Aliments',
  SCENE: 'Scénique',
  BANK: 'Banque',
  SUPERMARKET: 'Marché',
  HOTEL: 'Hôtel',
  TOILET: 'Toilette',
  BUS_STOP: 'Autobus',
  PARKING_LOT: 'Parc',
  HOSPITAL: 'Hôpital',
  GAS_STATION: 'Station-essence',
  MARKET: 'Centre commercial',
  SUBWAY: 'Métro',
}

// 采集模板
const Template = {
  COLLECTION_TEMPLATE_MANAGEMENT: 'Template Management', // 待翻译
  COLLECTION_TEMPLATE_CREATE: 'Create Template',
  COLLECTION_TEMPLATE_NAME: 'Template Name',
  ELEMENT_SETTINGS: 'Element Settings',
  ELEMENT_STORAGE: 'Element Storage',
  ATTRIBUTE_SETTINGS: 'Attribute Settings',
  CURRENT_TEMPLATE: 'Current Template',
  DEFAULT_TEMPLATE: 'Default Template',

  ELEMENT_NAME: 'Element Name',
  ELEMENT_CODE: 'Element Code',

  CREATE_ROOT_NODE: 'Create Root Node',
  CREATE_CHILD_NODE: 'Create Chile Node',
  INSERT_NODE: 'Insert Node',

  TEMPLATE_ERROR: 'Can not use the Template while the map not be saved',
}

export { Map_Main_Menu, Map_Label, Map_Layer, Map_Plotting, Map_Attribute, Map_Setting, Map_Settings, Map_Tools, Map_PoiTitle, Template }
