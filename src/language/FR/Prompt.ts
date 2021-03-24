import CN from '../CN'

// 提示语
const Prompt: typeof CN.Prompt = {
  YES: 'oui',
  NO: 'non',
  SAVE_TITLE: 'Voulez-vous enregistrer les modifications de la carte actuelle?',
  SAVE_YES: 'Oui',
  SAVE_NO: 'Non',
  CANCEL: 'Annuler',
  COMMIT: 'Commettre',
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
  PREPARING: 'En preparation',

  DOWNLOAD_SAMPLE_DATA: 'Télécharger des échantillons de données?',
  DOWNLOAD_DATA: 'Téléchargement de données',
  DOWNLOAD: 'Télécharger',
  DOWNLOADING: 'Chargement',
  DOWNLOAD_SUCCESSFULLY: 'Termine',
  DOWNLOAD_FAILED: 'Échec de téléchargement',
  UNZIPPING: 'décompresser',
  ONLINE_DATA_ERROR: 'Les données du réseau ont été corrompues et ne peuvent pas être utilisées normalement',

  NO_REMINDER: 'Pas de rappel',

  LOG_OUT: 'Êtes-vous sûr de vouloir vous déconnecter',
  FAILED_TO_LOG: 'Échec de la connexion',
  INCORRECT_USER_INFO: 'Compte inexistant ou erreur de mot de passe',
  INCORRECT_IPORTAL_ADDRESS: "Échec de la connexion, veuillez vérifier l'adresse de votre serveur",

  DELETE_STOP: 'Êtes-vous sûr de vouloir supprimer stop?',
  DELETE_OBJECT: "Êtes-vous sûr de vouloir supprimer définitivement l'objet?",
  PLEASE_ADD_STOP: 'Veuillez ajouter un arrêt',

  CONFIRM: 'Confirmer',
  COMPLETE: 'Complet',

  NO_PERMISSION_ALERT: "L’application n’a pas les autorisations nécessaires pour s’exécuter",
  EXIT: 'Sortie',
  REQUEST_PERMISSION: 'Demande',

  OPENING: 'Ouverture',

  QUIT: 'Quitter SuperMap iTablet',
  MAP_LOADING: 'Chargement',
  LOADING: 'Chargement',
  THE_MAP_IS_OPENED: 'La carte est ouverte',
  THE_MAP_IS_NOTEXIST: "La carte n'existe pas",
  THE_SCENE_IS_OPENED: 'La scène est ouverte',
  NO_SCENE_LIST: 'Aucune donnée',
  SWITCHING: 'Commutation',
  CLOSING: 'Clôture',
  CLOSING_3D: 'Clôture',
  SAVING: 'Enregistrement',
  SWITCHING_SUCCESS: 'Passer avec succès',
  ADD_SUCCESS: 'Ajouté avec succès',
  ADD_FAILED: "Échec d'ajout",
  ADD_MAP_FAILED: "Impossible d'ajouter la carte actuelle",
  CREATE_THEME_FAILED: 'Échec de la création du thème',
  PLEASE_ADD_DATASET: "Veuillez ajouter l'ensemble de données",
  PLEASE_SELECT_OBJECT: 'Veuillez sélectionner un objet à modifier',
  SWITCHING_PLOT_LIB: 'Commutation',
  NON_SELECTED_OBJ: 'Aucun objet sélectionné',
  CHANGE_BASE_MAP: "Carte de base vide, veuillez d'abord changer",
  OVERRIDE_SYMBOL: 'Un symbole avec le même identifiant existe, veuillez sélectionner la méthode à ajouter',
  OVERWRITE: 'Écraser',
  CHOOSE_DATASET: "Veuillez choisir l'ensemble de données",

  PLEASE_SUBMIT_EDIT_GEOMETRY: 'Please Submit Current Geometry',//need to translate

  SET_ALL_MAP_VISIBLE: 'Tout visible',
  SET_ALL_MAP_INVISIBLE: 'Tout invisible',
  LONG_PRESS_TO_SORT: '(appui long pour trier)',

  PUBLIC_MAP: 'Carte publique',
  SUPERMAP_FORUM: 'Forum SuperMap',
  SUPERMAP_KNOW: 'SuperMap Know',
  SUPERMAP_GROUP: 'Groupe SuperMap',
  INSTRUCTION_MANUAL: 'Instruction Manual',
  THE_CURRENT_LAYER: 'La couche actuelle est',
  NO_BASE_MAP: 'No base map can be removed', // need to translate
  ENTER_KEY_WORDS: 'Veuillez saisir des mots clés',
  SEARCHING: 'Recherche',
  SEARCHING_DEVICE_NOT_FOUND: 'Aucun appareil trouvé',
  READING_DATA: 'Lecture des données',
  CREATE_SUCCESSFULLY: 'Créé avec succès',
  SAVE_SUCCESSFULLY: 'Enregistré avec succès',
  NO_NEED_TO_SAVE: "Pas besoin d'enregistrer",
  SAVE_FAILED: "Échec de l'enregistrement",
  ENABLE_DYNAMIC_PROJECTION: 'Activer la projection dynamique?',
  TURN_ON: 'Activer',
  CREATE_FAILED: 'Échec de la création',
  INVALID_DATASET_NAME: 'Nom de jeu de données non valide ou le nom existe déjà',

  PLEASE_CHOOSE_POINT_LAYER: 'Please Choose Point Layer',//need to translate
  PLEASE_CHOOSE_LINE_LAYER: 'Please Choose Line Layer',//need to translate
  PLEASE_CHOOSE_REGION_LAYER: 'Please Choose Region Layer',//need to translate

  NO_PLOTTING_DEDUCTION: 'Aucune déduction de traçage dans la carte actuelle',
  NO_FLY: 'No Fly dans la scène actuelle',
  PLEASE_OPEN_SCENE: 'Veuillez ouvrir une scène',
  NO_SCENE: 'Aucune scène',
  ADD_ONLINE_SCENE: 'Ajouter une scène en ligne',

  PLEASE_ENTER_TEXT: "Veuillez saisir du texte'",
  PLEASE_SELECT_THEMATIC_LAYER: 'Veuillez sélectionner une couche thématique',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED: 'La couche actuelle ne peut pas être stylisée et veuillez en sélectionner une autre',

  PLEASE_SELECT_PLOT_LAYER: 'Veuillez sélectionner la couche du tracé',
  DONOT_SUPPORT_ARCORE: 'Les fonctionnalités RA ne sont pas disponibles sur cet appareil',
  GET_SUPPORTED_DEVICE_LIST: 'Afficher la liste des appareils pris en charge',
  PLEASE_NEW_PLOT_LAYER: 'Veuillez créer une nouvelle couche de tracé',
  DOWNLOADING_PLEASE_WAIT: 'Téléchargement en cours, veuillez patienter',
  DOWNLOADING_OTHERS_PLEASE_WAIT: 'Please wait while other files are being downloaded', // need to translate
  SELECT_DELETE_BY_RECTANGLE: "Veuillez sélectionner supprimer l'élément par rectangle sélectionnez",

  CHOOSE_LAYER: 'Choisir une couche',

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
  THE_LAYER_DOES_NOT_EXIST: "La couche n'existe pas",

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
  ENTER_CAPTION: 'Please input caption', // need to translate
  CHOICE_TYPE: 'Please choice type', // need to translate
  INPUT_LENGTH: 'Please input max length', // need to translate
  DEFAULT_VALUE_EROROR: 'Default value input error', // need to translate
  SELECT_REQUIRED: 'Please select required', // need to translate

  CLIPPING: 'Coupure',
  CLIPPED_SUCCESS: 'Coupé avec succès',
  CLIP_FAILED: 'Échec du découpage',

  LAYER_CANNOT_CREATE_THEMATIC_MAP: 'La couche actuelle ne peut pas être utilisée pour créer une carte thématique.',

  ANALYSING: 'Analyser',
  CHOOSE_STARTING_POINT: 'Choisir le point de départ',
  CHOOSE_DESTINATION: 'Choisir la destination',

  LATEST: 'Dernières: ',
  GEOGRAPHIC_COORDINATE_SYSTEM: 'Système de coordonnées géographiques: ',
  PROJECTED_COORDINATE_SYSTEM: 'Système de coordonnées projeté: ',
  FIELD_TYPE: 'Type de champ: ',

  PLEASE_LOGIN_AND_SHARE: 'Veuillez vous connecter et partager',
  PLEASE_LOGIN: 'Veuillez vous connecter',
  SHARING: 'Partage',
  SHARE_SUCCESS: 'Partagé avec succès',
  SHARE_FAILED: 'Échec du partage',
  SHARE_PREPARE: 'Préparation du partage',
  SHARE_START: 'Commencer le partage',

  EXPORTING: 'Exportation',
  EXPORT_SUCCESS: 'Exporté avec succès',
  EXPORT_FAILED: "Échec de l'exportation",
  EXPORT_TO: 'Les données ont été exportées vers: ',
  REQUIRE_PRJ_1984: "PrjCoordSys de l'ensemble de données doit être WGS_1984'",

  UNDO_FAILED: "Échec de l'annulation",
  REDO_FAILED: 'Échec de la restauration',
  RECOVER_FAILED: 'Échec de la récupération',

  SETTING_SUCCESS: 'Réglé avec succès',
  SETTING_FAILED: 'Échec de la configuration',
  NETWORK_ERROR: 'Erreur réseau',
  NO_NETWORK: 'Pas de connexion Internet',
  CHOOSE_CLASSIFY_MODEL: 'Choisir le modèle de classification',
  USED_IMMEDIATELY: 'Utilisé immédiatement',
  USING: 'Utilisation',
  DEFAULT_MODEL: 'Modèle par défaut',
  DUSTBIN_MODEL: 'Modèle de poubelle',
  PLANT_MODEL: 'Plant Model',
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
  AFTER_COLLECT: 'Please collect before viewing',//need to be translated

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
  VIEW_BOUNDS_RANGE_ERROR: 'Erreur de paramètre! La hauteur et la largeur de la vue doivent être supérieures à zéro »',
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

  PLEASE_ADD_DATASOURCE_BY_UNIFORM: 'Veuillez ajouter la source de données',
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
  CHANGE_TO_OUTDOOR: "passer à l'extérieur?",
  CHANGE_TO_INDOOR: "passer à l'intérieur?",
  SET_START_AND_END_POINTS: "Veuillez d'abord définir les points de début et de fin",
  SELECT_LAYER_NEED_INCREMENTED: 'Veuillez sélectionner la couche à incrémenter',
  SELECT_THE_FLOOR: 'Veuillez sélectionner le sol où se trouve la couche',
  LONG_PRESS_ADD_START: 'Veuillez appuyer longuement pour ajouter un point de départ',
  LONG_PRESS_ADD_END: 'Veuillez appuyer longuement pour ajouter une destination',
  ROUTE_ANALYSING: 'Analyse',
  DISTANCE_ERROR: 'La destination est trop proche du point de départ, veuillez resélectionner!',
  USE_ONLINE_ROUTE_ANALYST: "Les points sont en dehors des limites de l'ensemble de données ou il n'y a aucun ensemble de données autour des points, voulez-vous utiliser l'analyste d'itinéraire en ligne?",
  NOT_SUPPORT_ONLINE_NAVIGATION: "La navigation en ligne n'est pas encore prise en charge",
  CREATE: 'Nouveau',
  NO_DATASOURCE: "Il n'y a pas de source de données dans l'espace de travail actuel, veuillez d'abord créer une nouvelle source de données",
  FLOOR: 'Sol',
  AR_NAVIGATION: 'Navigation RA',
  ARRIVE_DESTINATION: 'Arrivé à destination',
  DEVIATE_NAV_PATH: 'Dévié du chemin de navigation',

  //导航增量路网
  SELECT_LINE_DATASET: "Veuillez d'abord sélectionner un jeu de données de ligne",
  CANT_UNDO: 'Irrévocable',
  CANT_REDO: 'Impossible de refaire',
  DATASET_RENAME_FAILED: "Le nom du jeu de données ne peut contenir que des lettres, des chiffres et '_', '@', '#'",
  SWITCH_LINE: 'Changer de jeu de données',
  HAS_NO_ROADNAME_FIELD_DATA: 'Ensemble de données sans informations de champ de nom de route',
  MERGE_SUCCESS: 'Fusionné avec succès',
  MERGE_FAILD: 'La fusion a échoué',
  NOT_SUPPORT_PRJCOORDSYS: "Le système de coordonnées de l'ensemble de données suivant ne prend pas en charge la fusion",
  MERGEING: 'Fusion',
  NEW_NAV_DATA: 'Créer des données de navigation',
  INPUT_MODEL_FILE_NAME: 'Veuillez saisir un nom de fichier de modèle',
  SELECT_DESTINATION_DATASOURCE: 'Veuillez sélectionner la source de données cible',
  FILENAME_ALREADY_EXIST: 'Le fichier existe déjà, veuillez saisir à nouveau le nom du fichier',
  NETWORK_BUILDING: 'Bâtiment...',
  BUILD_SUCCESS: 'Construit avec succès',
  SELECT_LINE_SMOOTH: 'Veuillez sélectionner la ligne à lisser',
  SELECT_A_POINT_INLINE: 'Veuillez sélectionner un point en ligne',
  LINE_DATASET: 'Jeu de données de ligne',
  DESTINATION_DATASOURCE: 'Source de données cible',
  SMOOTH_FACTOR: 'Veuillez saisir le facteur de lissage',
  SELECT_EXTEND_LINE: 'Veuillez sélectionner la ligne à prolonger',
  SELECT_SECOND_LINE: 'Veuillez sélectionner la deuxième ligne',
  SELECT_TRIM_LINE: 'Veuillez sélectionner la ligne à couper',
  SELECT_BASE_LINE: 'Veuillez sélectionner une ligne de base',
  SELECT_RESAMPLE_LINE: 'Veuillez sélectionner la ligne à rééchantillonner',
  SELECT_CHANGE_DIRECTION_LINE: 'Veuillez sélectionner la ligne qui doit changer de direction',
  EDIT_SUCCESS: 'Opération réussie',
  EDIT_FAILED: 'Opération échouée',
  SMOOTH_NUMBER_NEED_BIGGER_THAN_2: 'Le coefficient de lissage doit être compris entre les entiers 2 et 10',
  CONFIRM_EXIT: 'Êtes-vous sûr de quitter?',
  TOPO_EDIT_END: 'Avez-vous fini de modifier et quitter?',
  // 自定义专题图
  ONLY_INTEGER: 'Seuls les nombres entiers peuvent être saisis!',
  ONLY_INTEGER_GREATER_THAN_2: 'Seuls les nombres entiers supérieurs à 2 peuvent être saisis!',
  PARAMS_ERROR: 'Erreur de paramètres! Échec de paramètres!',

  SPEECH_TIP: "You may say \n'Agrandir'，'Dézoomer'，'Localiser'，'Proche',\n 'Rechercher 'ou n'importe quelle adresse",
  SPEECH_ERROR: "Reconnaître l'erreur, veuillez réessayer plus tard",
  SPEECH_NONE: 'Vous ne sembliez rien dire',

  NOT_SUPPORT_STATISTIC: 'Le champ ne prend pas en charge les statistiques',
  ATTRIBUTE_DELETE_CONFIRM: "Bien sûr, supprimer ce champ d'attribut?",
  ATTRIBUTE_DELETE_TIPS: "Impossible de récupérer après suppression de l'attribut",
  ATTRIBUTE_DELETE_SUCCESS: "Réussite de la suppression du champ d'attribut",
  ATTRIBUTE_DELETE_FAILED: "Échec de la suppression du champ d'attribut",
  ATTRIBUTE_ADD_SUCCESS: 'Attribut ajouter avec success',
  ATTRIBUTE_ADD_FAILED: "Échec de l'ajout d'attribut",
  ATTRIBUTE_DEFAULT_VALUE_IS_NULL: 'La valeur par défaut est null',

  CANNOT_COLLECT_IN_THEMATIC_LAYERS: 'Impossible de collecter dans les couches thématiques',
  CANNOT_COLLECT_IN_CAD_LAYERS: 'Cannot collect in CAD layers', //Need to be translated
  CANNOT_COLLECT_IN_TEXT_LAYERS: 'Cannot collect in Text layers', //Need to be translated
  HEAT_MAP_DATASET_TYPE_ERROR: 'Seul le jeu de données ponctuel peut être créé',

  INVALID_DATA_SET_FAILED: 'Type de données non valide. Échec de paramètre',

  INVISIBLE_LAYER_CAN_NOT_BE_SET_CURRENT: "La couche n'est pas visible et ne peut pas être définie sur la couche actuelle",
  //三维AR管线相关
  FILE_NOT_EXISTS: 'Les données ne sont pas disponibles.Téléchargez les données modèles',
  MOVE_PHONE_ADD_SCENE: 'Please move phone slowly,identify the plane click on the screen to add scene',
  IDENTIFY_TIMEOUT: "Délai d'expiration de l'image de suivi, réessayez?",
  TRACKING_LOADING: 'Suivi...',

  // 专题制图加载/输出xml
  SUCCESS: 'Opération réussie',
  FAILED: "L'opération a échoué",
  NO_TEMPLATE: 'Aucun modèle disponible',
  CONFIRM_LOAD_TEMPLATE: 'Êtes-vous sûr de charger le modèle?',
  CONFIRM_OUTPUT_TEMPLATE: "Êtes-vous sûr d'exporter la carte?",
}

export { Prompt }
