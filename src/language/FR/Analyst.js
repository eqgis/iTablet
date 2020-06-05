const Analyst_Modules = {
  BUFFER_ANALYSIS: 'Analyse de tampon',
  BUFFER_ANALYSIS_2: 'Analyse de tampon',
  BUFFER_ANALYST_SINGLE: 'Analyse de tampon',
  BUFFER_ANALYST_MULTIPLE: 'Analyse multi-tampons',
  OVERLAY_ANALYSIS: 'Analyse de superposition',
  THIESSEN_POLYGON: 'Polygone Thiessen',
  MEASURE_DISTANCE: 'Mesurer la distance',
  ONLINE_ANALYSIS: 'Analyse en ligne',
  INTERPOLATION_ANALYSIS: 'Analyse d',

  OPTIMAL_PATH: 'Chemin optimal',
  CONNECTIVITY_ANALYSIS: 'Analyse de connectivité',
  FIND_TSP_PATH: 'Rechercher le chemin TSP',
  TRACING_ANALYSIS: 'Analyse de traçage',

  REGISTRATION_CREATE: '新建配准',
  REGISTRATION_SPEEDINESS: '快速配准',
  PROJECTION_TRANSFORMATION: '投影转换',
}

const Analyst_Methods = {
  CLIP: 'Agrafe',
  UNION: 'Union',
  ERASE: 'Effacer',
  INTERSECT: 'Intersect',
  IDENTITY: 'Identité',
  XOR: 'XOR',
  UPDATE: 'mise à jour',

  DENSITY: 'Analyse de densité',
  AGGREGATE_POINTS_ANALYSIS: 'Analyse des points agrégés',
}

const Analyst_Labels = {
  ANALYST: 'Analyste',
  CONFIRM: 'Confirmer',
  RESET: 'Rréinitialiser',
  CANCEL: 'Annuler',
  NEXT: 'Prochain',
  PREVIOUS: 'Précèdent',
  ADD: 'Ajouter',
  Edit: 'Modifier',

  // local
  USE_AN_EXISTING_NETWORK_DATASET:
    'Utiliser un ensemble de données réseau existant',
  BUILD_A_NETWORK_DATASET: 'Créer un ensemble de données réseau',
  CHOOSE_DATA: 'Choisissez les données',
  TOPOLOGY: 'Topologie',
  ADD_DATASET: 'Ajouter un ensemble de données',
  DONE: 'Terminé',
  RESULT_FIELDS: 'Champs de résultats',
  SPLIT_SETTINGS: 'Paramètres de partage',
  SPLIT_LINE_BY_POINT: 'Divisé Ligne par point’',
  SPLIT_LINES_AT_INTERSECTION: 'Divisé Ligne à Intersection',

  SET_START_STATION: 'Définir la station de départ',
  MIDDLE_STATIONS: 'Stations intermédiaires',
  SET_END_STATION: "Définir la station d'extrémité",
  LOCATION: 'Emplacement',
  SET_AS_START_STATION: 'Définir comme station de départ',
  SET_AS_END_STATION: "Définir la station d'extrémité",
  ADD_STATIONS: 'Ajouter des stations',
  ADD_BARRIER_NODES: 'Ajouter des nœuds de barrière',
  ADD_NODES: 'Ajouter des nœuds',
  UPSTREAM_TRACKING: 'Suivi en amont',
  DOWNSTREAM_TRACKING: 'Suivi en aval',
  CLEAR: 'Effacer',
  START_STATION: 'Démarrer la station',
  MIDDLE_STATION: 'Station intermédiaire',
  END_STATION: 'End Station',
  BARRIER_NODE: 'Nœud barrière',
  NODE: 'Nœud',

  BUFFER_ZONE: 'Tampon',
  MULTI_BUFFER_ZONE: 'Multi-Tampon',
  DATA_SOURCE: 'La source de données',
  DATA_SET: 'Base de données',
  SELECTED_OBJ_ONLY: 'Objets sélectionnés uniquement',
  BUFFER_TYPE: 'Type de tampon',
  BUFFER_ROUND: 'Rond',
  BUFFER_FLAT: 'Plat',
  BUFFER_RADIUS: 'Rayon',
  RESULT_SETTINGS: 'Paramètres des résultats',
  BUFFER_UNION: 'Union Tampon',
  KEEP_ATTRIBUTES: 'Conserver les attributs',
  DISPLAY_IN_MAP: 'Afficher sur la carte',
  DISPLAY_IN_SCENE: 'Afficher dans la scène',
  SEMICIRCLE_SEGMENTS: 'Segments de demi-cercle',
  RING_BUFFER: 'Rond Tampon',
  RESULT_DATA: 'Données de résultat',
  BATCH_ADD: 'Ajouter un lot',
  START_VALUE: 'Valeur de départ',
  END_VALUE: 'Valeur finale',
  STEP: 'Étape',
  RANGE_COUNT: 'Range Count',
  INSERT: 'Insérer',
  DELETE: 'Supprimer',
  INDEX: 'Index',
  RADIUS: 'Rayon',
  RESULT_DATASET_NAME: 'Nom du jeu de données de résultat',
  GO_TO_SET: 'Aller au set',

  SOURCE_DATA: 'Données source',
  OVERLAY_DATASET: 'Recouvrir base de données',
  SET_FIELDS: 'Définir les champs',
  FIELD_NAME: 'Nom du champ',

  ISERVER_LOGIN: 'Connexion iServer',
  ISERVER: 'URL iServer',
  SOURCE_DATASET: 'Jeu de données source',

  ANALYSIS_PARAMS: "Paramètres d'analyse",
  ANALYSIS_METHOD: "Méthode d'analyse",
  Mesh_Type: 'Type de maillage',
  WEIGHT_FIELD: 'Champ de poids',
  ANALYSIS_BOUNDS: "Limites d'analyse",
  MESH_SIZE: 'Mesh Size',
  SEARCH_RADIUS: 'Rayon',
  AREA_UNIT: 'Unités de zone',
  STATISTIC_MODE: 'Mode statistique',
  NUMERIC_PRECISION: 'Précision numérique',
  AGGREGATE_TYPE: "Type d'agrégat",

  THEMATIC_PARAMS: 'Paramètres thématiques',
  INTERVAL_MODE: 'Mode Intervalle',
  NUMBER_OF_SEGMENTS: 'Nombre de segments',
  COLOR_GRADIENT: 'Mode dégradé de couleur',

  Input_Type: "Type d'entrée",
  Dataset: 'Jeu de données',

  NOT_SET: 'Not Set',
  ALREADY_SET: 'Déjà défini',

  ADD_WEIGHT_STATISTIC: 'Ajouter un champ pondéré',

  // 方向
  LEFT: 'Gauche',
  DOWN: 'bas',
  RIGHT: 'Droite',
  UP: 'Haut',

  // 邻近分析
  DISPLAY_REGION_SETTINGS: 'Afficher les paramètres de région',
  CUSTOM_LOCALE: 'Paramètres régionaux personnalisés',
  SELECT_REGION: 'Sélectionner une région',
  DRAW_REGION: 'Dessiner une région',
  MEASURE_DISTANCE: 'Mesurer la distance',
  REFERENCE_DATASET: 'Ensemble de données de référence',
  PARAMETER_SETTINGS: 'Outil de Paramétrages',
  MEASURE_TYPE: 'Type de mesure',
  MIN_DISTANCE_2: 'Distance minimale',
  DISTANCE_IN_RANGE: 'Distance dans la plage',
  QUERY_RANGE: 'Plage de requêtes',
  MIN_DISTANCE: 'Distance minimale',
  MAX_DISTANCE: 'Distance maximale',
  ASSOCIATE_BROWSING_RESULT: 'Résultat de navigation associé',

  // 插值分析
  INTERPOLATION_METHOD: "Analyse d'interpolation",
  INTERPOLATION_FIELD: "Méthodes d'interpolation",
  SCALE_FACTOR: "Facteur d'échelle",
  RESOLUTION: 'Resolution',
  PIXEL_FORMAT: 'Format Pixel',
  INTERPOLATION_BOUNDS: 'Limites',
  SAMPLE_POINT_SETTINGS: "Paramètres de point d'échantillonnage",
  SEARCH_MODE: 'Mode de recherche',
  MAX_RADIUS: 'Rayon max',
  SEARCH_RADIUS_2: 'Rayon de recherche',
  SEARCH_POINT_COUNT: 'Point Count',
  MIX_COUNT: 'Min Count',
  MOST_INVOLVED: 'Les plus impliqués',
  MOST_IN_BLOCK: 'Le plus dans le bloc',
  OTHER_PARAMETERS: 'Autres paramètres',
  POWER: 'Puissance',
  TENSION: 'Tension',
  SMOOTHNESS: 'Douceur',
  SEMIVARIOGRAM: 'Semi-variogramme',
  ROTATION: 'Rotation',
  SILL: 'Seuil',
  RANGE: 'Gamme',
  NUGGET_EFFECT: 'Effet pépite',
  MEAN: 'Moyen',
  EXPONENT: 'Exposant',
  HISTOGRAM: 'Histogramme',
  FUNCTION: 'Fonction',
  SHOW_STATISTICS: 'Afficher les statistiques',
  EXPORT_TO_ALBUM: "Exporter vers l'album",

  REGISTRATION_DATASET: '配准数据',
  REGISTRATION_REFER_DATASET_ADD: '添加参考数据',
  REGISTRATION: '配准',
  REGISTRATION_ARITHMETIC: '配准算法',
  REGISTRATION_LINE: '线性配准（至少4个控制点）',
  REGISTRATION_QUADRATIC: '二次多项式配准（至少7个控制点）',
  REGISTRATION_RECTANGLE: '矩形配准（2个控制点）',
  REGISTRATION_OFFSET: '偏移配准（1个控制点）',
  REGISTRATION_LINE_: '线性配准',
  REGISTRATION_QUADRATIC_: '二次多项式配准',
  REGISTRATION_RECTANGLE_: '矩形配准',
  REGISTRATION_OFFSET_: '偏移配准',
  REGISTRATION_ASSOCIATION: '关联浏览',

  REGISTRATION_ASSOCIATION_CLOCE: '取消关联',
  REGISTRATION_EXECUTE: '执行',
  REGISTRATION_EXECUTE_SUCCESS: '执行成功',
  REGISTRATION_EXECUTE_FAILED: '执行失败',
  REGISTRATION_SAVE_AS: '另存',
  REGISTRATION_RESAMPLE: '结果重采样',
  REGISTRATION_SAMPLE_MODE: '采样模式',
  REGISTRATION_SAMPLE_MODE_NO: '无',
  REGISTRATION_SAMPLE_MODE_NEAR: '最邻近法',
  REGISTRATION_SAMPLE_MODE_BILINEARITY: '双线性内插法',
  REGISTRATION_SAMPLE_MODE_CUBIC_SONVOLUTION: '三次卷积内插法',
  REGISTRATION_SAMPLE_PIXEL: '采样像素',
  REGISTRATION_RESULT_DATASET: '目标数据集',
  REGISTRATION_RESULT_DATASOURCE: '目标数据源',
  REGISTRATION_ORIGINAL_DATASOURCE: '原始数据',
  REGISTRATION_POINTS_DETAIL: '查看',
  REGISTRATION_EXECUTING: '执行中',
  REGISTRATION_ENUMBER: '序号',
  REGISTRATION_ORIGINAL: '源点',
  REGISTRATION_TAREGT: '目标点',
  REGISTRATION_RESELECT_POINT: '重新选点',
  REGISTRATION_EXPORT: '导出',
  REGISTRATION_EXPORT_SUCCESS: '导出成功',
  REGISTRATION_EXPORT_FAILED: '导出失败',
  REGISTRATION_EXPORT_FILE_NAME: '配准信息文件名称',
  REGISTRATION_EXPORT_FILE: '配准信息文件',
  REGISTRATION_PLEASE_SELECT: '请选择',
  REGISTRATION_NOT_SETLECT_DATASET: '请选择配准数据集',
  REGISTRATION_NOT_SETLECT_REFER_DATASET: '请选择参考数据集',
  //投影转换
  PROJECTION_SOURCE_COORDS: '源坐标系',
  PROJECTION_COORDS_NAME: '坐标系名称',
  PROJECTION_COORDS_UNIT: '坐标单位',
  PROJECTION_GROUND_DATUM: '大地基准面',
  PROJECTION_REFERENCE_ELLIPSOID: '参考椭球体',

  PROJECTION_CONVERT_SETTING: '参考系转换设置',
  PROJECTION_CONVERT_MOTHED: '转换方法',
  PROJECTION_PARAMETER_SETTING: '参数设置',
  BASIC_PARAMETER: '基本参数',
  ROTATION_ANGLE_SECOND: '旋转角度(秒)',
  OFFSET: '偏移量',
  RATIO_DIFFERENCE: '比例差',
  TARGET_COORDS: '目标坐标系',
  COPY: '复制',
  RESETING: '重设',
  GEOCOORDSYS: '地理坐标系',
  PRJCOORDSYS: '投影坐标系',
  CONVERTTING: '转换中',
  CONVERT_SUCCESS: '转换成功',
  CONVERT_FAILED: '转换失败',
  ARITHMETIC: 'algorithme',
}

const Convert_Unit = {
  ///  毫米。
  MILIMETER: '毫米',
  /// 平方毫米。
  SQUAREMILIMETER: '平方毫米',
  ///  厘米。
  CENTIMETER: '厘米',
  /// 平方厘米。
  SQUARECENTIMETER: '平方厘米',
  /// 英寸。
  INCH: '英寸',
  /// 平方英寸。
  SQUAREINCH: '平方英寸',
  /// 分米。
  DECIMETER: '分米',
  /// 平方分米。
  SQUAREDECIMETER: '平方分米',
  ///  英尺。
  FOOT: '英尺',
  ///  平方英尺。
  SQUAREFOOT: '平方英尺',
  ///  码。
  YARD: '码',
  ///  平方码。
  SQUAREYARD: '平方码',
  ///  米。
  METER: '米',
  ///  平方米。
  SQUAREMETER: '平方米',
  /// 千米。
  KILOMETER: '千米',
  /// 平方千米。
  SQUAREKILOMETER: '平方千米',
  /// 平方英里。
  MILE: '平方英里',
  /// 英里。
  SQUAREMILE: '英里',
  ///  秒。
  SECOND: '秒',
  ///  分。
  MINUTE: '分',
  ///  度。
  DEGREE: '度',
  /// 弧度。
  RADIAN: '弧度',
}

const Analyst_Params = {
  // 缓冲区分析
  BUFFER_LEFT_AND_RIGHT: 'Gauche et Droite',
  BUFFER_LEFT: 'Gauche',
  BUFFER_RIGHT: 'Droite',

  // 分析方法
  SIMPLE_DENSITY_ANALYSIS: 'Analyse de densité simple',
  KERNEL_DENSITY_ANALYSIS: 'Analyse de densité du noyau',

  // 网格面类型
  QUADRILATERAL_MESH: 'Maille quadrilatérale',
  HEXAGONAL_MESH: 'Maillage hexagonal',

  // 分段模式
  EQUIDISTANT_INTERVAL: 'Intervalle équidistant',
  LOGARITHMIC_INTERVAL: 'Intervalle logarithmique',
  QUANTILE_INTERVAL: 'Intervalle quantile',
  SQUARE_ROOT_INTERVAL: 'Intervalle racine carrée',
  STANDARD_DEVIATION_INTERVAL: "Intervalle d'écart type",

  // 长度单位
  METER: 'm',
  KILOMETER: 'km',
  YARD: 'yd',
  FOOT: 'ft',
  MILE: 'mile',

  // 面积单位
  SQUARE_MILE: 'mile²',
  SQUARE_METER: 'm²',
  SQUARE_KILOMETER: 'km²',
  HECTARE: 'ha',
  ARE: 'are',
  ACRE: 'acre',
  SQUARE_FOOT: 'ft²',
  SQUARE_YARD: 'yd²',

  // 颜色渐变模式
  GREEN_ORANGE_PURPLE_GRADIENT: 'Dégradé Vert Orange Violet',
  GREEN_ORANGE_RED_GRADIENT: 'Dégradé Vert Orange Violet',
  RAINBOW_COLOR: 'Couleur Arc en ciel',
  SPECTRAL_GRADIENT: 'Dégradé spectral',
  TERRAIN_GRADIENT: 'Dégradé du terrain',

  // 统计模式
  MAX: 'Max',
  MIN: 'Min',
  AVERAGE: 'Moyen',
  SUM: 'Somme',
  VARIANCE: 'Variance',
  STANDARD_DEVIATION: 'Écart-type',

  // 聚合类型
  AGGREGATE_WITH_GRID: 'Agréger avec grille',
  AGGREGATE_WITH_REGION: 'Agréger avec la région',

  // 插值方法
  IDW: 'IDW',
  SPLINE: 'Spline',
  ORDINARY_KRIGING: 'Krigeage ordinaire',
  SIMPLE_KRIGING: 'Krigeage simple',
  UNIVERSAL_KRIGING: 'Krigeage universel',

  // 像素格式
  UBIT1: 'UBIT1',
  UBIT16: 'UBIT16',
  UBIT32: 'UBIT32',
  SINGLE: 'unique',
  DOUBLE: 'Double',

  // 查找方法
  SEARCH_VARIABLE_LENGTH: 'Longueur variable',
  SEARCH_FIXED_LENGTH: 'Longueur fixe',
  SEARCH_BLOCK: 'Bloque',

  // 半变异函数
  SPHERICAL: 'Sphérique	',
  EXPONENTIAL: 'Exponentiel',
  GAUSSIAN: 'Gaussien',
}

const Analyst_Prompt = {
  ANALYSING: "en cours d'analyse",
  ANALYSIS_START: "en cours d'analyse",
  ANALYSIS_SUCCESS: 'Analyse réussie',
  ANALYSIS_FAIL: "L'analyse a échoué",
  PLEASE_CONNECT_TO_ISERVER: 'Veuillez-vous connecter à iServer',
  PLEASE_CHOOSE_INPUT_METHOD: 'Veuillez choisir la méthode de saisie',
  PLEASE_CHOOSE_DATASET: 'Veuillez choisir un ensemble de données',
  LOGIN_ISERVER_FAILED:
    "Échec de connexion à iServer, veuillez vérifier l'ip, le nom d'utilisateur et le mot de passe",
  BEING_ANALYZED: "En cours d'analyse",
  ANALYZING_FAILED: "L'analyse a échoué",
  LOADING_MODULE: 'Chargement du module',
  LOADING_MODULE_FAILED: 'Chargement du module',
  TWO_NODES_ARE_CONNECTED: 'Les deux nœuds sont connectés',
  TWO_NODES_ARE_NOT_CONNECTED: 'Les deux nœuds ne sont pas connectés',
  NOT_FIND_SUITABLE_PATH: "N'a pas trouvé de chemin approprié",
  SELECT_DATA_SOURCE_FIRST:
    "Veuillez d'abord sélectionner la source de données",
  SELECT_DATA_SET_FIRST: "Veuillez d'abord sélectionner l'ensemble de données",
  PLEASE_SELECT_A_REGION: 'Veuillez sélectionner une région',
  REGISTRATION_LINE_POINTS: '请设置至少4个控制点',
  REGISTRATION_QUADRATIC_POINTS: '请设置至少7个控制点',
  REGISTRATION_RECTANGLE_POINTS: '请设置2个控制点',
  REGISTRATION_OFFSET_POINTS: '请设置1个控制点',
  REGISTRATION_POINTS_NUMBER_ERROR: '控制点数量不匹配',
}

export {
  Analyst_Modules,
  Analyst_Methods,
  Analyst_Labels,
  Analyst_Params,
  Analyst_Prompt,
  Convert_Unit,
}
