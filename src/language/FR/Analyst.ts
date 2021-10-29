import CN from "../CN"

const Analyst_Modules: typeof CN.Analyst_Modules = {
  BUFFER_ANALYSIS: "Analyse de tampons",
  BUFFER_ANALYSIS_2: "Analyse de tampons",
  BUFFER_ANALYST_SINGLE: "Analyse de tampons",
  BUFFER_ANALYST_MULTIPLE: "Analyse multi-tampons",
  OVERLAY_ANALYSIS: "Analyse de superposition",
  THIESSEN_POLYGON: "Polygone de Thiessen",
  MEASURE_DISTANCE: "Mesure de distance",
  ONLINE_ANALYSIS: "Analyse en ligne",
  INTERPOLATION_ANALYSIS: "Analyse d'interpolation",

  OPTIMAL_PATH: "Trajectoire optimale",
  CONNECTIVITY_ANALYSIS: "Analyse de la connectivité",
  FIND_TSP_PATH: "Trouver la trajectoire TSP",
  TRACING_ANALYSIS: "Analyse de traçage",

  REGISTRATION_CREATE: "Nouvel Enregistrement",
  REGISTRATION_SPEEDINESS: "Enregistrement Rapide",
  PROJECTION_TRANSFORMATION: "Transformation de projection",
}

const Analyst_Methods: typeof CN.Analyst_Methods = {
  CLIP: "Clip",
  UNION: "Union",
  ERASE: "Effacer",
  INTERSECT: "Intersection",
  IDENTITY: "Identité",
  XOR: "XOR",
  UPDATE: "Mise à jour",

  DENSITY: "Analyse de la densité",
  AGGREGATE_POINTS_ANALYSIS: "Analyse des points agrégés",
}

const Analyst_Labels: typeof CN.Analyst_Labels = {
  ANALYST: "Analyse",
  CONFIRM: "Terminé",
  RESET: "Réinitialiser",
  CANCEL: "Annuler",
  NEXT: "Suivant",
  PREVIOUS: "Précédent",
  ADD: "Ajouter",
  Edit: "Éditer",

  // local
  USE_AN_EXISTING_NETWORK_DATASET: "Utiliser un réseau d'ensemble de données existant",
  BUILD_A_NETWORK_DATASET: "Créer un réseau de jeu de données",
  CHOOSE_DATA: "Choisir les données",
  TOPOLOGY: "Topologie",
  ADD_DATASET: "Ajouter un ensemble de données",
  DONE: "Terminé",
  RESULT_FIELDS: "Champs de résultats",
  SPLIT_SETTINGS: "Paramètres de fractionnement",
  SPLIT_LINE_BY_POINT: "Fractionner les lignes en points",
  SPLIT_LINES_AT_INTERSECTION: "Fractionner les lignes à l'intersection",

  SET_START_STATION: "Définir la station de départ",
  MIDDLE_STATIONS: "Stations intermédiaires",
  SET_END_STATION: "Définir la station d'arrivée",
  LOCATION: "Localisation",
  SET_AS_START_STATION: "Point de départ",
  SET_AS_END_STATION: "Destination",
  ADD_STATIONS: "Ajouter des stations",
  ADD_BARRIER_NODES: "Ajouter des nœuds de barrière",
  ADD_NODES: "Ajouter des nœuds",
  UPSTREAM_TRACKING: "Suivi en amont",
  DOWNSTREAM_TRACKING: "Suivi en aval",
  CLEAR: "Effacer",
  START_STATION: "Station de départ",
  MIDDLE_STATION: "Station intermédiaire",
  END_STATION: "Station d'arrivée",
  BARRIER_NODE: "Nœud de barrière",
  NODE: "Nœud",

  BUFFER_ZONE: "Tampon",
  MULTI_BUFFER_ZONE: "Multi-tampon",
  DATA_SOURCE: "Source de données",
  DATA_SET: "Ensemble de données",
  SELECTED_OBJ_ONLY: "Seulement les objets sélectionnés",
  BUFFER_TYPE: "Type de tampon",
  BUFFER_ROUND: "Circulaire",
  BUFFER_FLAT: "Plat",
  BUFFER_RADIUS: "Rayon",
  RESULT_SETTINGS: "Reglage de résultats",
  BUFFER_UNION: "Union de Tampons",
  KEEP_ATTRIBUTES: "Conservation d'attributs",
  DISPLAY_IN_MAP: "Afficher sur la carte",
  DISPLAY_IN_SCENE: "Afficher dans la scène",
  SEMICIRCLE_SEGMENTS: "Segments en demi-cercle",
  RING_BUFFER: "Tampon en anneau",
  RESULT_DATA: "Données de résultat",
  BATCH_ADD: "Ajouter les lots",
  START_VALUE: "Valeur initiale",
  END_VALUE: "Valeur finale",
  STEP: "Étape",
  RANGE_COUNT: "Plage de Compte",
  INSERT: "Insérer",
  DELETE: "Supprimer",
  INDEX: "Indice",
  RADIUS: "Rayon",
  RESULT_DATASET_NAME: "Nom du résultat du jeu de données",
  GO_TO_SET: "Aller aux Réglages",

  SOURCE_DATA: "Données source",
  OVERLAY_DATASET: "Superposition de Jeu de données",
  SET_FIELDS: "Définir les champs",
  FIELD_NAME: "Nom de domaine",

  ISERVER_LOGIN: "Connexion iServer",
  ISERVER: "URL iServer",
  SOURCE_DATASET: "Ensemble de données source",

  ANALYSIS_PARAMS: "Paramètres d'analyse",
  ANALYSIS_METHOD: "Méthode d'analyse",
  Mesh_Type: "Type de maille",
  WEIGHT_FIELD: "Champ de poids",
  ANALYSIS_BOUNDS: "Analyse de Limites",
  MESH_SIZE: "Taille de maille",
  SEARCH_RADIUS: "Rayon",
  AREA_UNIT: "Unités de surface",
  STATISTIC_MODE: "Mode statistique",
  NUMERIC_PRECISION: "Précision numérique",
  AGGREGATE_TYPE: "Type de collection",
  AGGREGATE_DATASET: "Aggregate Dataset",// to be translated

  THEMATIC_PARAMS: "Paramètres thématiques",
  INTERVAL_MODE: "Mode intervalle",
  NUMBER_OF_SEGMENTS: "Nombre de segments",
  COLOR_GRADIENT: "Mode dégradé de couleur",

  Input_Type: "Type de données",
  Dataset: "Ensemble de données",

  NOT_SET: "Pas encore défini",
  ALREADY_SET: "Déjà défini",

  ADD_WEIGHT_STATISTIC: "Ajouter un champ pondéré",

  // 方向
  LEFT: "Gauche",
  DOWN: "Bas",
  RIGHT: "Droite",
  UP: "Haut",

  // 邻近分析
  DISPLAY_REGION_SETTINGS: "Afficher les paramètres de la région",
  CUSTOM_LOCALE: "Coutume Locale",
  SELECT_REGION: "Choisissez une région",
  DRAW_REGION: "Dessiner une région",
  MEASURE_DISTANCE: "Mesurer la distance",
  REFERENCE_DATASET: "Ensemble de données de référence",
  PARAMETER_SETTINGS: "Paramètres des réglages",
  MEASURE_TYPE: "Type de mesure",
  MIN_DISTANCE_2: "Distance minimale",
  DISTANCE_IN_RANGE: "Distance dans l'Intervalle",
  QUERY_RANGE: "Plage de requête",
  MIN_DISTANCE: "Distance minimale",
  MAX_DISTANCE: "Distance maximale",
  ASSOCIATE_BROWSING_RESULT: "Associer les résultats de navigation",

  // 插值分析
  INTERPOLATION_METHOD: "Analyse d'interpolation",
  INTERPOLATION_FIELD: "Méthodes d'interpolation",
  SCALE_FACTOR: "Facteur d'échelle",
  RESOLUTION: "Résolution",
  PIXEL_FORMAT: "Format de pixel",
  INTERPOLATION_BOUNDS: "Limites",
  SAMPLE_POINT_SETTINGS: "Paramètres de points d'échantillonnage",
  SEARCH_MODE: "Mode de recherche",
  MAX_RADIUS: "Rayon maximum",
  SEARCH_RADIUS_2: "Rayon de recherche",
  SEARCH_POINT_COUNT: "Nombre de points",
  MIX_COUNT: "Nombre minimum",
  MOST_INVOLVED: "Les plus impliqués",
  MOST_IN_BLOCK: "Plus dans le bloc",
  OTHER_PARAMETERS: "Autres paramètres",
  POWER: "Puissance",
  TENSION: "Tension",
  SMOOTHNESS: "Souplesse",
  SEMIVARIOGRAM: "Semi-variogramme",
  ROTATION: "Rotation",
  SILL: "Seuil",
  RANGE: "Intervalle",
  NUGGET_EFFECT: "Effet de pépite",
  MEAN: "Moyen",
  EXPONENT: "Exposant",
  HISTOGRAM: "Histogramme",
  FUNCTION: "Fonction",
  SHOW_STATISTICS: "Montrez les statistiques",
  EXPORT_TO_ALBUM: "Exporter vers l'album",

  REGISTRATION_DATASET: "Enregistrement d'ensemble de données",
  REGISTRATION_REFER_DATASET_ADD: "Enregistrement d'ensemble de données de référence",
  REGISTRATION: "Enregistrement",
  REGISTRATION_ARITHMETIC: "Arithmétique d'enregistrement",
  REGISTRATION_LINE: "Ligne d'enregistrement (au moins 4 points de contrôle)",
  REGISTRATION_QUADRATIC: "Enregistrement quadratique (au moins 7 points de contrôle)",
  REGISTRATION_RECTANGLE: "Enregistrement rectangulaire (2 points de contrôle)",
  REGISTRATION_OFFSET: "Enregistrement en décalage(1 points de contrôle)",
  REGISTRATION_LINE_: "Ligne d'enregistrement",
  REGISTRATION_QUADRATIC_: "Enregistrement quadratique",
  REGISTRATION_RECTANGLE_: "Enregistrement rectangulaire",
  REGISTRATION_OFFSET_: "Enregistrement en décalage",
  REGISTRATION_ASSOCIATION: "Association",

  REGISTRATION_ASSOCIATION_CLOCE: "Annuler les associés",
  REGISTRATION_EXECUTE: "Exécuter",
  REGISTRATION_EXECUTE_SUCCESS: "Exécuté avec succès",
  REGISTRATION_EXECUTE_FAILED: "Exécution échouée",
  REGISTRATION_SAVE_AS: "Enregistrer sous",
  REGISTRATION_RESAMPLE: "Rééchantillonnage des résultats",
  REGISTRATION_SAMPLE_MODE: "Mode d'échantillonnage",
  REGISTRATION_SAMPLE_MODE_NO: "Non",
  REGISTRATION_SAMPLE_MODE_NEAR: "La méthode des adjacents",
  REGISTRATION_SAMPLE_MODE_BILINEARITY: "Interpolation bilinéaire",
  REGISTRATION_SAMPLE_MODE_CUBIC_SONVOLUTION: "Interpolation par convolution cubique",
  REGISTRATION_SAMPLE_PIXEL: "Echantillon de pixel",
  REGISTRATION_RESULT_DATASET: "Ensemble de données du résultat",
  REGISTRATION_RESULT_DATASOURCE: "Source de données du résultat",
  REGISTRATION_ORIGINAL_DATASOURCE: "Jeu de données d'origine",
  REGISTRATION_POINTS_DETAIL: "Détail",
  REGISTRATION_EXECUTING: "En cours",
  REGISTRATION_ENUMBER: "Numéro de série",
  REGISTRATION_ORIGINAL: "Source",
  REGISTRATION_TAREGT: "Cible",
  REGISTRATION_RESELECT_POINT: "Resélectionner le point",
  REGISTRATION_EXPORT: "Exporter",
  REGISTRATION_EXPORT_SUCCESS: "Exporté avec succès ",
  REGISTRATION_EXPORT_FAILED: "Exportation échouée",
  REGISTRATION_EXPORT_FILE_NAME: "Exporter le nom du fichier",
  REGISTRATION_EXPORT_FILE: "Fichier d'informations des enregistrements",
  REGISTRATION_PLEASE_SELECT: "Veuillez sélectionner",
  REGISTRATION_NOT_SETLECT_DATASET: "Veuillez sélectionner un ensemble de données d'enregistrement",
  REGISTRATION_NOT_SETLECT_REFER_DATASET: "Veuillez sélectionner un ensemble de données de référence",
  //投影转换
  PROJECTION_SOURCE_COORDS: "Coordonnées source",
  PROJECTION_COORDS_NAME: "Nom des Coordonnées",
  PROJECTION_COORDS_UNIT: "Unité des Coordonnées",
  PROJECTION_GROUND_DATUM: "Données du sol",
  PROJECTION_REFERENCE_ELLIPSOID: "Référence ellipsoïdale",

  PROJECTION_CONVERT_SETTING: "Paramètres de conversion du système de référence",
  PROJECTION_CONVERT_MOTHED: "Méthode de conversion",
  PROJECTION_PARAMETER_SETTING: "Réglage des paramètres",
  BASIC_PARAMETER: "Paramètres de base",
  ROTATION_ANGLE_SECOND: "Angle de rotation (seconde)",
  OFFSET: "Décalage",
  RATIO_DIFFERENCE: "Différence de rapport",
  TARGET_COORDS: "Coordonnées cibles",
  COPY: "Copier",
  RESETING: "Réinitialiser",
  GEOCOORDSYS: "Système de coordonnées géographiques",
  PRJCOORDSYS: "Système de coordonnées projeté",
  COMMONCOORDSYS: "Système de coordonnées commun",
  CONVERTTING: "Conversion",
  CONVERT_SUCCESS: "Convertie avec succès",
  CONVERT_FAILED: "Conversion échouée",
  ARITHMETIC: "Arithmétique",
  COORDSYS:"Coordinate System",
}

const Convert_Unit: typeof CN.Convert_Unit = {
  ///  毫米。
  MILIMETER: "Millimètre",
  /// 平方毫米。
  SQUAREMILIMETER: "mm2",
  ///  厘米。
  CENTIMETER: "cm",
  /// 平方厘米。
  SQUARECENTIMETER: "cm2",
  /// 英寸。
  INCH: "pouce",
  /// 平方英寸。
  SQUAREINCH: "Pouce carré",
  /// 分米。
  DECIMETER: "Dm",
  /// 平方分米。
  SQUAREDECIMETER: "Décimètres carrés",
  ///  英尺。
  FOOT: "Pied (ft)",
  ///  平方英尺。
  SQUAREFOOT: "Pieds carrés",
  ///  码。
  YARD: "Yard",
  ///  平方码。
  SQUAREYARD: "Yard carré",
  ///  米。
  METER: "Mètre",
  ///  平方米。
  SQUAREMETER: "Mètre carré",
  /// 千米。
  KILOMETER: "km",
  /// 平方千米。
  SQUAREKILOMETER: "kilomètre carré",
  /// 平方英里。
  MILE: "Mille carré",
  /// 英里。
  SQUAREMILE: "mille",
  ///  秒。
  SECOND: "seconde",
  ///  分。
  MINUTE: "Minute",
  ///  度。
  DEGREE: "degré",
  /// 弧度。
  RADIAN: "radian",
}

const Analyst_Params: typeof CN.Analyst_Params = {
  // 缓冲区分析
  BUFFER_LEFT_AND_RIGHT: "Gauche et droite",
  BUFFER_LEFT: "Gauche",
  BUFFER_RIGHT: "Droite",

  // 分析方法
  SIMPLE_DENSITY_ANALYSIS: "Analyse de densité simple",
  KERNEL_DENSITY_ANALYSIS: "Analyse de la densité du noyau",

  // 网格面类型
  QUADRILATERAL_MESH: "Maille quadrilatérale",
  HEXAGONAL_MESH: "Maille hexagonale",

  // 分段模式
  EQUIDISTANT_INTERVAL: "Intervalle équidistant",
  LOGARITHMIC_INTERVAL: "Intervalle logarithmique",
  QUANTILE_INTERVAL: "Intervalle quantile",
  SQUARE_ROOT_INTERVAL: "Intervalle de racine carrée",
  STANDARD_DEVIATION_INTERVAL: "Intervalle standard de déviation",

  // 长度单位
  METER: "m",
  KILOMETER: "km",
  YARD: "yd",
  FOOT: "ft",
  MILE: "mile",

  // 面积单位
  SQUARE_MILE: "mille²",
  SQUARE_METER: "m²",
  SQUARE_KILOMETER: "km²",
  HECTARE: "ha",
  ARE: "are",
  ACRE: "acre",
  SQUARE_FOOT: "ft²",
  SQUARE_YARD: "yd²",

  // 颜色渐变模式
  GREEN_ORANGE_PURPLE_GRADIENT: "Violet orange vert dégradé",
  GREEN_ORANGE_RED_GRADIENT: "Rouge orange vert dégradé",
  RAINBOW_COLOR: "Couleur arc-en-ciel",
  SPECTRAL_GRADIENT: "Gradient spectral",
  TERRAIN_GRADIENT: "Gradient du terrain",

  // 统计模式
  MAX: "Max",
  MIN: "Min",
  AVERAGE: "Moyenne",
  SUM: "Sum",
  VARIANCE: "Variance",
  STANDARD_DEVIATION: "Écart-type",

  // 聚合类型
  AGGREGATE_WITH_GRID: "Agréger avec la grille",
  AGGREGATE_WITH_REGION: "Agréger avec la région",

  // 插值方法
  IDW: "IDW",
  SPLINE: "Enture",
  ORDINARY_KRIGING: "Krigeage ordinaire",
  SIMPLE_KRIGING: "Krigeage simple",
  UNIVERSAL_KRIGING: "Krigeage universel",

  // 像素格式
  UBIT1: "UBIT1",
  UBIT16: "UBIT16",
  UBIT32: "UBIT32",
  SINGLE: "Seul",
  DOUBLE: "Double",

  // 查找方法
  SEARCH_VARIABLE_LENGTH: "Longueur variable",
  SEARCH_FIXED_LENGTH: "Longueur fixe",
  SEARCH_BLOCK: "Obstacle",

  // 半变异函数
  SPHERICAL: "Sphérique",
  EXPONENTIAL: "Exponentiel",
  GAUSSIAN: "Gaussien",
}

const Analyst_Prompt: typeof CN.Analyst_Prompt = {
  ANALYSING: "En cours d'analyse",
  ANALYSIS_START: "En cours d'analyse",
  ANALYSIS_SUCCESS: "Analysé avec succès",
  ANALYSIS_FAIL: "Analyse échouée",
  PLEASE_CONNECT_TO_ISERVER: "Veuillez vous connecter à iServer",
  PLEASE_CHOOSE_INPUT_METHOD: "Veuillez choisir la méthode de saisie",
  PLEASE_CHOOSE_DATASET: "Veuillez choisir l'ensemble de données",
  LOGIN_ISERVER_FAILED: "Échec de connexion à iServer, veuillez vérifier l'adresse IP, le nom d'utilisateur et le mot de passe",
  BEING_ANALYZED: "En analyse",
  ANALYZING_FAILED: "Analyse échouée",
  LOADING_MODULE: "Chargement du module",
  LOADING_MODULE_FAILED: "Échec de chargement du module, veuillez vérifier l'ensemble de données",
  TWO_NODES_ARE_CONNECTED: "Les deux nœuds sont connectés",
  TWO_NODES_ARE_NOT_CONNECTED: "Les deux nœuds ne sont pas connectés",
  NOT_FIND_SUITABLE_PATH: "Pas de chemin approprié",
  SELECT_DATA_SOURCE_FIRST: "Veuillez d'abord sélectionner la source de données",
  SELECT_DATA_SET_FIRST: "Veuillez d'abord sélectionner l'ensemble de données",
  PLEASE_SELECT_A_REGION: "Veuillez sélectionner une région",
  REGISTRATION_LINE_POINTS: "Veuillez définir au moins 4 points de contrôle",
  REGISTRATION_QUADRATIC_POINTS: "Veuillez définir au moins 7 points de contrôle",
  REGISTRATION_RECTANGLE_POINTS: "Veuillez définir 2 points de contrôle",
  REGISTRATION_OFFSET_POINTS: "Veuillez définir 1 point de contrôle",
  REGISTRATION_POINTS_NUMBER_ERROR: "Le nombre de points de contrôle ne correspond pas",
  ANALYSIS_SUCCESS_TOWATCH: "Analyse réussie voulez-vous visualiser le resultat?",
}

export { Analyst_Modules, Analyst_Methods, Analyst_Labels, Analyst_Params, Analyst_Prompt, Convert_Unit }
