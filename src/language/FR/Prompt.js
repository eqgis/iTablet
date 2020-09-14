// 提示语
const Prompt = {
  YES: 'oui',
  NO: 'non',
  SAVE_TITLE: 'Voulez-vous enregistrer les modifications de la carte actuelle?',
  SAVE_YES: 'Oui',
  SAVE_NO: 'Non',
  CANCEL: 'Annuler',
  COMMIT: 'Commit',
  REDO: 'Refaire',
  UNDO: 'Annuler',
  SHARE: 'Partage',
  DELETE: 'Supprimer',
  WECHAT: 'Wechat',
  BEGIN: 'Commencer',
  STOP: 'Stop',
  FIELD_TO_PAUSE: 'Échec de la pause',
  WX_NOT_INSTALLED: "Wechat non installé'",
  WX_SHARE_FAILED: "Le partage Wechat a échoué, veuillez vérifier l'installation de wechat",
  RENAME: 'Renommer',
  BATCH_DELETE: 'Suppression de lot',
  PREPARING: '准备中',

  DOWNLOAD_SAMPLE_DATA: 'Télécharger les exemples de données?',
  DOWNLOAD_DATA: '数据下载', // 待翻译
  DOWNLOAD: 'Télécharger',
  DOWNLOADING: 'Chargement',
  DOWNLOAD_SUCCESSFULLY: 'Termine',
  DOWNLOAD_FAILED: 'Échec du téléchargement',
  UNZIPPING: '解压中',

  NO_REMINDER: 'Pas de rappel',

  LOG_OUT: 'Êtes-vous sûr de vouloir vous déconnecter',
  FAILED_TO_LOG: 'Échec de la connexion',
  INCORRECT_USER_INFO: 'Compte inexistant ou erreur de mot de passe',
  INCORRECT_IPORTAL_ADDRESS: "Échec de la connexion, veuillez vérifier l'adresse de votre serveur",

  DELETE_STOP: 'Êtes-vous sûr de vouloir supprimer stop?',
  DELETE_OBJECT: "Êtes-vous sûr de vouloir supprimer définitivement l'objet?",
  PLEASE_ADD_STOP: '请添加站点',

  CONFIRM: 'Confirmer',
  COMPLETE: 'Complet',

  OPENING: 'Ouverture',

  QUIT: 'Quitter SuperMap iTablet',
  MAP_LOADING: 'Chargement',
  LOADING: 'Chargement',
  THE_MAP_IS_OPENED: 'La carte est ouverte',
  THE_SCENE_IS_OPENED: 'La scène est ouverte',
  NO_SCENE_LIST: 'Aucune donnée',
  SWITCHING: 'Commutation',
  CLOSING: 'Clôture',
  CLOSING_3D: 'Clôture',
  SAVING: 'Enregistrement',
  SWITCHING_SUCCESS: 'Passer avec succès',
  ADD_SUCCESS: 'Ajouté avec succès',
  ADD_FAILED: "Échec de l'ajout",
  ADD_MAP_FAILED: "Impossible d'ajouter la carte actuelle",
  CREATE_THEME_FAILED: 'Échec de la création du thème',
  PLEASE_ADD_DATASET: "Veuillez ajouter l'ensemble de données",
  PLEASE_SELECT_OBJECT: 'Veuillez sélectionner un objet à modifier',
  SWITCHING_PLOT_LIB: 'Commutation',
  NON_SELECTED_OBJ: 'Aucun objet sélectionné',
  CHANGE_BASE_MAP: "Carte de base vide, veuillez d'abord changer",
  OVERRIDE_SYMBOL: 'Symbol with the same id exists, please select method to add', //待翻译
  OVERWRITE: 'Overwrite',

  SET_ALL_MAP_VISIBLE: 'Tout visible',
  SET_ALL_MAP_INVISIBLE: 'Tout invisible',
  LONG_PRESS_TO_SORT: '(appui long pour trier)',

  PUBLIC_MAP: 'Carte publique',
  SUPERMAP_FORUM: 'Forum SuperMap',
  SUPERMAP_KNOW: 'SuperMap Know',
  SUPERMAP_GROUP: 'Groupe SuperMap',
  INSTRUCTION_MANUAL: 'Instruction Manual',
  THE_CURRENT_LAYER: 'La couche actuelle est',
  ENTER_KEY_WORDS: 'Veuillez saisir des mots clés',
  SEARCHING: 'Recherche',
  SEARCHING_DEVICE_NOT_FOUND: '未能搜索到外部设备',
  READING_DATA: 'Lecture des données',
  CREATE_SUCCESSFULLY: 'Créé avec succès',
  SAVE_SUCCESSFULLY: 'Enregistré avec succès',
  NO_NEED_TO_SAVE: "Pas besoin d'enregistrer",
  SAVE_FAILED: "Échec de l'enregistrement",
  ENABLE_DYNAMIC_PROJECTION: 'Activer la projection dynamique?',
  TURN_ON: 'Activer',
  CREATE_FAILED: 'Échec de la création',
  INVALID_DATASET_NAME: 'Nom de jeu de données non valide ou le nom existe déjà',

  NO_PLOTTING_DEDUCTION: 'Aucune déduction de traçage dans la carte actuelle',
  NO_FLY: 'No Fly dans la scène actuelle',
  PLEASE_OPEN_SCENE: 'Veuillez ouvrir une scène',
  NO_SCENE: 'Aucune scène',
  ADD_ONLINE_SCENE: 'Add Online Scene', //待翻译

  PLEASE_ENTER_TEXT: "Veuillez saisir du texte'",
  PLEASE_SELECT_THEMATIC_LAYER: 'Veuillez sélectionner une couche thématique',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED: 'Le calque actuel ne peut pas être stylisé et veuillez en sélectionner un autre',

  PLEASE_SELECT_PLOT_LAYER: 'Veuillez sélectionner le calque du tracé',
  DONOT_SUPPORT_ARCORE: 'Cet appareil ne prend pas en charge ARCore',
  PLEASE_NEW_PLOT_LAYER: 'Veuillez créer un nouveau calque de tracé',
  DOWNLOADING_PLEASE_WAIT: 'Téléchargement en cours, veuillez patienter',
  SELECT_DELETE_BY_RECTANGLE: "Veuillez sélectionner supprimer l'élément par rectangle sélectionnez",

  CHOOSE_LAYER: 'Choisir un calque',

  COLLECT_SUCCESS: 'Recueillir le succès',

  SELECT_TWO_MEDIAS_AT_LEAST: 'Vous devez sélectionner au moins deux médias',

  NETWORK_REQUEST_FAILED: 'Échec de la demande réseau',

  SAVEING: 'Enregistrement',
  CREATING: 'Création',
  PLEASE_ADD_DATASOURCE: 'Veuillez ajouter une source de données',
  NO_ATTRIBUTES: 'Aucun attribut',
  NO_SEARCH_RESULTS: 'Aucun résultat de recherche',

  READING_TEMPLATE: 'Modèle de lecture',
  SWITCHED_TEMPLATE: 'Modèle changé',
  THE_CURRENT_SELECTION: 'La sélection actuelle est',
  THE_LAYER_DOES_NOT_EXIST: '该图层不存在',

  IMPORTING_DATA: "Importation de données'",
  DATA_BEING_IMPORT: "Les données sont en cours d'importation",
  IMPORTING: 'Importation',
  IMPORTED_SUCCESS: 'Importé avec succès',
  FAILED_TO_IMPORT: "Échec de l'importation",
  IMPORTED_3D_SUCCESS: 'Importé avec succès',
  FAILED_TO_IMPORT_3D: "Échec de l'importation",
  DELETING_DATA: 'Suppression de données',
  DELETING_SERVICE: "Suppression du service'",
  DELETED_SUCCESS: 'Supprimé avec succès',
  FAILED_TO_DELETE: 'Échec de la suppression',
  PUBLISHING: 'Publication',
  PUBLISH_SUCCESS: 'Publié avec succès',
  PUBLISH_FAILED: 'Échec de la publication',
  DELETE_CONFIRM: "Voulez-vous vraiment supprimer l'élément?",
  BATCH_DELETE_CONFIRM: 'Voulez-vous vraiment supprimer les éléments sélectionnés?',

  SELECT_AT_LEAST_ONE: 'Veuillez sélectionner au moins un élément',
  DELETE_MAP_RELATE_DATA: 'Les cartes suivantes seront affectées, continuer?',

  LOG_IN: 'Chargement',
  ENTER_MAP_NAME: 'Veuillez saisir le nom de la carte',
  CLIP_ENTER_MAP_NAME: 'Entrez le nom de la carte',
  ENTER_SERVICE_ADDRESS: "Veuillez saisir l'adresse du service",
  ENTER_ANIMATION_NAME: "Veuillez saisir le nom de l'animation",
  ENTER_ANIMATION_NODE_NAME: "Veuillez saisir le nom du nœud d'animation",
  PLEASE_SELECT_PLOT_SYMBOL: 'Veuillez sélectionner le symbole de tracé',

  ENTER_NAME: 'Veuillez saisir le nom',

  CLIPPING: 'Coupure',
  CLIPPED_SUCCESS: 'Coupé avec succès',
  CLIP_FAILED: 'Échec du découpage',

  LAYER_CANNOT_CREATE_THEMATIC_MAP: 'La couche actuelle ne peut pas être utilisée pour créer une carte thématique.',

  ANALYSING: 'Analyser',
  CHOOSE_STARTING_POINT: 'Choisir le point de départ',
  CHOOSE_DESTINATION: 'Choisir la destination',

  LATEST: 'Dernières',
  GEOGRAPHIC_COORDINATE_SYSTEM: 'Système de coordonnées géographiques',
  PROJECTED_COORDINATE_SYSTEM: 'Système de coordonnées projeté',
  FIELD_TYPE: 'Type de champ',

  PLEASE_LOGIN_AND_SHARE: 'Veuillez vous connecter et partager',
  PLEASE_LOGIN: '请登录',
  SHARING: 'Partage',
  SHARE_SUCCESS: 'Partagé avec succès',
  SHARE_FAILED: 'Échec du partage',
  SHARE_PREPARE: 'Préparation du partage',
  SHARE_START: 'Commencer le partage',

  EXPORTING: 'Exportation',
  EXPORT_SUCCESS: 'Exporté avec succès',
  EXPORT_FAILED: "Échec de l'exportation",
  EXPORT_TO: 'Les données ont été exportées vers',
  REQUIRE_PRJ_1984: "PrjCoordSys de l'ensemble de données doit être WGS_1984'",

  UNDO_FAILED: "Échec de l'annulation",
  REDO_FAILED: 'Échec de la restauration',
  RECOVER_FAILED: 'Échec de la récupération',

  SETTING_SUCCESS: "Réglé avec succès', ",
  SETTING_FAILED: 'Échec de la configuration',
  NETWORK_ERROR: 'Erreur réseau',
  NO_NETWORK: 'Pas de connexion Internet',
  CHOOSE_CLASSIFY_MODEL: 'Choisir le modèle de classification',
  USED_IMMEDIATELY: 'Utilisé immédiatement',
  USING: 'Utilisation',
  DEFAULT_MODEL: 'Modèle par défaut',
  DUSTBIN_MODEL: 'Modèle de poubelle',
  PLANT_MODEL: '植物模型',
  CHANGING: 'En changeant',
  CHANGE_SUCCESS: 'Changer le succès',
  CHANGE_FAULT: 'Change Fault',
  DETECT_DUSTBIN_MODEL: 'Modèle de poubelle',
  ROAD_MODEL: 'Modèle de route',

  LICENSE_EXPIRED: "La licence d'essai a expiré. Voulez-vous continuer le procès?",
  APPLY_LICENSE: 'Appliquer la licence',
  APPLY_LICENSE_FIRST: "Veuillez d'abord appliquer une licence valide",

  GET_LAYER_GROUP_FAILD: "Échec d'obtention du groupe de couches",
  TYR_AGAIN_LATER: 'Veuillez réessayer plus tard',

  LOCATING: 'localisation',
  CANNOT_LOCATION: 'Échec de la localisation',
  INDEX_OUT_OF_BOUNDS: 'Index hors limites',
  PLEASE_SELECT_LICATION_INFORMATION: 'Veuillez configurer le lieu',
  OUT_OF_MAP_BOUNDS: 'Hors des limites de la carte',
  CANT_USE_TRACK_TO_INCREMENT_ROAD: "L'emplacement actuel est hors des limites de la carte afin que vous ne puissiez pas utiliser le suivi pour incrémenter la route",

  POI: 'POI',

  ILLEGAL_DATA: 'Données illégales',

  UNSUPPORTED_LAYER_TO_SHARE: "Le partage de cette couche n'est pas encore pris en charge",
  SELECT_DATASET_TO_SHARE: 'Veuillez sélectionner le jeu de données à partager',
  ENTER_DATA_NAME: 'Veuillez saisir le nom des données',
  SHARED_DATA_10M: 'Le fichier de plus de 10 Mo ne peut pas être partagé',

  PHIONE_HAS_BEEN_REGISTERED: 'Le numéro de mobile est enregistré',
  NICKNAME_IS_EXISTS: "Le nom d'utilisateur existe déjà",
  VERIFICATION_CODE_ERROR: 'Le code de vérification est incorrect ou invalide',
  VERIFICATION_CODE_SENT: 'Le code de vérification a été envoyé.',
  EMAIL_HAS_BEEN_REGISTERED: "L'e-mail est enregistré",
  REGISTERING: 'enregistrément',
  REGIST_SUCCESS: 'Enregistré avec succès',
  REGIST_FAILED: "Échec de l'enregistrément",
  GOTO_ACTIVATE: "Veuillez télécharger la licence d'essai dans la boîte mail",
  ENTER_CORRECT_MOBILE: 'Veuillez saisir le bon numéro de téléphone portable',
  ENTER_CORRECT_EMAIL: 'Veuillez saisir la bonne adresse e-mail',

  // 设置菜单提示信息
  ROTATION_ANGLE_ERROR: "L'angle de rotation doit être compris entre -360 ° et 360 °",
  MAP_SCALE_ERROR: "Erreur d'entrée! Veuillez saisir un nombre",
  VIEW_BOUNDS_ERROR: 'Erreur de plage! Veuillez saisir un nombre',
  VIEW_BOUNDS_RANGE_ERROR: 'Erreur de paramètre! La hauteur et la largeur de la vue doivent être supérieures à zéro »,',
  MAP_CENTER_ERROR: 'Erreur de coordination! X et Y doivent tous deux être des nombres ',
  COPY_SUCCESS: 'Copier avec success',
  // 复制坐标系
  COPY_COORD_SYSTEM_SUCCESS: 'Coordonner la réplication du système avec succès',
  COPY_COORD_SYSTEM_FAIL: 'La réplication du système de coordonnées a échoué',
  ILLEGAL_COORDSYS: 'Pas un fichier de système de coordonnées pris en charge',

  TRANSFER_PARAMS: 'Erreur de param! Veuillez saisir un nombre',
  PLEASE_ENTER: 'Veuillez saisir',

  REQUEST_TIMEOUT: "Délai d'expiration de la demande",

  IMAGE_RECOGNITION_ING: 'Chargement',
  IMAGE_RECOGNITION_FAILED: "La reconnaissance d'image a échoué",

  ERROR_INFO_INVALID_URL: "URL non valide'",
  ERROR_INFO_NOT_A_NUMBER: "Ce n'est pas un nombre",
  ERROR_INFO_START_WITH_A_LETTER: 'Le nom ne peut commencer que par une lettre',
  ERROR_INFO_ILLEGAL_CHARACTERS: 'Le nom ne peut pas contenir de caractères illégaux',
  ERROR_INFO_EMPTY: 'Le nom ne peut pas être vide.',

  OPEN_LOCATION: 'Veuillez ouvrir le service de localisation dans les paramètres système',
  REQUEST_LOCATION: "iTablet a besoin d'une autorisation de localisation pour terminer l'action'",
  LOCATION_ERROR: 'La demande de localisation a échoué, veuillez réessayer plus tard',

  OPEN_THRID_PARTY: 'Vous allez ouvrir une application à trente, continuez?',

  FIELD_ILLEGAL: 'Champ illégal',
  PLEASE_SELECT_A_RASTER_LAYER: 'Veuillez sélectionner une couche raster',

  PLEASE_ADD_DATASOURCE_BY_UNIFORM: 'Veuillez ajouter la source de données par uniforme',
  CURRENT_LAYER_DOSE_NOT_SUPPORT_MODIFICATION: 'La couche actuelle ne prend pas en charge la modification',

  FAILED_TO_CREATE_POINT: 'Échec de création du point',
  FAILED_TO_CREATE_TEXT: 'Impossible de créer du texte',
  FAILED_TO_CREATE_LINE: 'Impossible de créer la ligne',
  FAILED_TO_CREATE_REGION: 'Échec de création de la région',
  CLEAR_HISTORY: 'Histoire claire',
  // 导航相关
  SEARCH_AROUND: 'Rechercher autour de',
  GO_HERE: 'Allez ici',
  SHOW_MORE_RESULT: 'Afficher plus de résultats',
  PLEASE_SET_BASEMAP_VISIBLE: 'Veuillez définir le fond de carte visible',
  NO_NETWORK_DATASETS: "L'espace de travail actuel ne contient pas de jeu de données réseau",
  NO_LINE_DATASETS: "L'espace de travail actuel ne contient pas de jeu de données de ligne",
  NETWORK_DATASET_IS_NOT_AVAILABLE: "L'ensemble de données réseau actuel n'est pas disponible",
  POINT_NOT_IN_BOUNDS: 'Les limites du jeu de données réseau sélectionné ne contiennent pas le point',
  POSITION_OUT_OF_MAP: 'Votre position est en dehors des limites de la carte, veuillez utiliser la navigation simulée',
  SELECT_DATASOURCE_FOR_NAVIGATION: 'Sélectionner les données pour la navigation',
  PLEASE_SELECT_NETWORKDATASET: "Sélectionnez d'abord un jeu de données réseau",
  PLEASE_SELECT_A_POINT_INDOOR: 'Veuillez sélectionner le point intérieur',
  PATH_ANALYSIS_FAILED: "L'analyse du chemin a échoué! Veuillez sélectionner à nouveau les points de début et de fin",
  ROAD_NETWORK_UNLINK: "L'analyse du chemin a échoué en raison du réseau routier déconnecté du point de départ au point d'arrivée",
  CHANGE_TO_OUTDOOR: '是否切换到室外？',
  CHANGE_TO_INDOOR: '是否切换到室内？',
  SET_START_AND_END_POINTS: "Veuillez d'abord définir les points de début et de fin",
  SELECT_LAYER_NEED_INCREMENTED: 'Veuillez sélectionner la couche à incrémenter',
  SELECT_THE_FLOOR: 'Veuillez sélectionner le sol où se trouve la couche',
  LONG_PRESS_ADD_START: 'Veuillez appuyer longuement pour ajouter un point de départ',
  LONG_PRESS_ADD_END: 'Veuillez appuyer longuement pour ajouter une destination',
  ROUTE_ANALYSING: 'Analyse',
  DISTANCE_ERROR: 'La destination est trop proche du point de départ, veuillez resélectionner!',
  USE_ONLINE_ROUTE_ANALYST: "Les points sont en dehors des limites de l'ensemble de données ou il n'y a aucun ensemble de données autour des points, voulez-vous utiliser l'analyste d'itinéraire en ligne?",
  NOT_SUPPORT_ONLINE_NAVIGATION: "La navigation en ligne n'est pas encore prise en charge",
  CREATE: '新建',
  NO_DATASOURCE: '当前工作空间无数据源，请先新建数据源',
  FLOOR: 'Floor', //待翻译
  AR_NAVIGATION: 'AR Navi',
  ARRIVE_DESTINATION: 'Arrived the destination',
  DEVIATE_NAV_PATH: 'Deviated from the navigation path',

  //导航增量路网
  SELECT_LINE_DATASET: 'Please select a line dataset first', //待翻译
  CANT_UNDO: 'Irrevocable',
  CANT_REDO: "Can't redo",
  DATASET_RENAME_FAILED: 'The dataset name can only contain letters, numbers and "_", "@", "#"',
  SWITCH_LINE: 'Switch dataset',
  HAS_NO_ROADNAME_FIELD_DATA: 'Dataset without road name field info',
  MERGE_SUCCESS: 'Merged successfully',
  MERGE_FAILD: 'Merge failed',
  NOT_SUPPORT_PRJCOORDSYS: 'The coordinate system of the following data set does not support merging',
  MERGEING: 'Merging',
  NEW_NAV_DATA: 'Create Navigation Data',
  INPUT_MODEL_FILE_NAME: 'Please enter a model file name',
  SELECT_DESTINATION_DATASOURCE: 'Please select the target datasource',
  FILENAME_ALREADY_EXIST: 'The file already exists, please re-enter the file name',
  NETWORK_BUILDING: 'Building...',
  BUILD_SUCCESS: 'Successfully built',
  SELECT_LINE_SMOOTH: 'Please select the line that needs to be smoothed',
  SELECT_A_POINT_INLINE: 'Please select an online point',
  LINE_DATASET: 'Line Dataset',
  DESTINATION_DATASOURCE: 'Target Datasource',
  SMOOTH_FACTOR: 'Please enter smoothing factor',
  SELECT_EXTEND_LINE: 'Please select the line that needs to be extended',
  SELECT_SECOND_LINE: 'Please select the second line',
  SELECT_TRIM_LINE: 'Please select the line to be trimmed',
  SELECT_BASE_LINE: 'Please select a baseline',
  SELECT_RESAMPLE_LINE: 'Please select the line that needs to be resampled',
  SELECT_CHANGE_DIRECTION_LINE: 'Please select the line that needs to change direction',
  EDIT_SUCCESS: 'Successful operation',
  EDIT_FAILED: 'Operation failed',
  SMOOTH_NUMBER_NEED_BIGGER_THAN_2: 'Smoothing coefficient should be 2 ~ 10 integers',
  CONFIRM_EXIT: 'Are you sure to exit?',
  TOPO_EDIT_END: 'Are you finished editing and exit?',
  // 自定义专题图 待翻译
  ONLY_INTEGER: '只能输入整数！',
  ONLY_INTEGER_GREATER_THAN_2: '只能输入大于2的整数！',
  PARAMS_ERROR: '参数错误，设置失败！',

  SPEECH_TIP: 'Vous pouvez dire',
  SPEECH_ERROR: "Reconnaître l'erreur, veuillez réessayer plus tard",
  SPEECH_NONE: 'Vous ne sembliez rien dire',

  NOT_SUPPORT_STATISTIC: 'Le champ ne prend pas en charge les statistiques',
  ATTRIBUTE_DELETE_CONFIRM: 'Sure Delete this Attribute Field?',
  ATTRIBUTE_DELETE_TIPS: "Impossible de récupérer après suppression de l'attribut",
  ATTRIBUTE_DELETE_SUCCESS: "Réussite de la suppression du champ d'attribut",
  ATTRIBUTE_DELETE_FAILED: "Échec de la suppression du champ d'attribut",
  ATTRIBUTE_ADD_SUCCESS: 'Attribut ajouter avec success',
  ATTRIBUTE_ADD_FAILED: "Échec de l'ajout d'attribut",
  ATTRIBUTE_DEFAULT_VALUE_IS_NULL: 'La valeur par défaut est null',

  CANNOT_COLLECT_IN_THEMATIC_LAYERS: '专题图层不能采集',
  HEAT_MAP_DATASET_TYPE_ERROR: '只有点数据集可以创建',
  
  INVALID_DATA_SET_FAILED: 'Invalid data type. Failed to set', // 待翻译
}

export { Prompt }
