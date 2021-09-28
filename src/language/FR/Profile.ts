import CN from '../CN'

// 我的、发现
const Profile: typeof CN.Profile = {
  // 我的  主页面
  LOGIN_NOW: 'connexion',
  IMPORT: 'importer',
  DATA: 'Données',
  MARK: 'Marque',
  MAP: 'Carte',
  ARMAP: 'Carte RA',
  ARMODEL: 'Modèle RA',
  AREFFECT: 'Effet RA',
  SCENE: 'Scène',
  BASEMAP: 'Carte de base',
  SYMBOL: 'Symbole',
  SETTINGS: 'Paramètres',
  COLOR_SCHEME: 'Schéma de couleur',
  TEMPLATE: 'Modèle',
  AIMODEL: 'Modèle IA',
  COLLECTION_TEMPLATE: "Modèle d'arpentage",
  PLOTTING_TEMPLATE: 'Modèle de traçage',
  MAP_TEMPLATE: 'Mapping Template',//need to translate
  NAVIGATION: 'Navigation',
  INCREMENT: 'Incrémentation',
  ENCLOSURE: 'Coffret',

  MY_COLOR_SCHEME: 'Mon schéma de couleurs',
  MY_MODEL: 'Mon modèle',

  SELECT_MODEL: 'Sélectionnez un modèle',

  // 我的  提示语
  MY_GUIDE: "Après l'importation des données\npeut être ouvert dans le module d'accueil",
  MY_GUIDE_KNOW:'A savoir',
  MY_GUIDE_SLIDE: 'Dessinez pour vérifier',
  MY_GUIDE_SLIDE_LAND:'Dessinez à gauche pour vérifier',
  EFFECT_GUIDE:'Ajouter un effet à la scène',
  LAUNCH_GUIDE:'Ajouter une vidéo, des mots, une image Web à la scène',
  MEASURE_GUIDE:'Mesurer la distance, la hauteur et la surface',
  MY_GUIDE_NEXT:'Suivant',
  MY_GUIDE_SKIP:'Sauter',
  ANALYST_GUIDE:'Analyse de réseau et analyse vectorielle',
  PROCESS_GUIDE:'Enregistrement et conversion de projection',
  CHOOSE_TYPE:'Choisissez le type de lancement',
  CHOOSE_MEASURE_TYPE:'Choisissez le type de mesure',
  SELECT_DATASET:'Cocher pour ajouter un ensemble de données',
  ADD_SELECT_DATASET:'Ajouter un ensemble de données',
  MOVE_BROWSING:'Déplacer vers la gauche et vers la droite "pour parcourir les informations complètes',
  ADD_THEME_DATA:'1.Ajouter des données de thème',
  CHOOSE_THEME_TYPE:'2.Choisissez le type de thème',
  CHANGE_THEME_STYLE:'3.Changer le style du thème',
  START_COLLECT:'1.Nouvelle collection de cartes  basée sur un modèle',
  CHOOSE_COLLECT:"2.Sélectionnez des symboles pour l'acquisition de données",
  EDIT_COLLECT:'3.Modifier les données collectées',
  MAP_BROWSE:'Cliquez pour ouvrir la carte',
  MAP_TAGGINGL:'Cliquez pour sélectionner la méthode de marquage à utiliser',
  SCENE_BROWSE:'Cliquez pour ouvrir la scène',
  SCENE_FLY:"Cliquez sur Définir l'itinéraire de vol et parcourir automatiquement la scène sous différents angles",

  // 我的——登录
  LOGIN: 'connexion',
  LOGINING: 'Connexion..',
  LOGIN_TIMEOUT: 'Délai de connexion, veuillez réessayer plus tard',
  LOGIN_CURRENT: "L'utilisateur actuel est déjà connecté",
  LOGIN_INVALID: 'La connexion a expiré. Veuillez vous reconnecter',
  MOBILE_LOGIN: 'Connexion mobile',
  EMAIL_LOGIN: 'Connexion par e-mail',
  ENTER_EMAIL_OR_USERNAME: "Veuillez saisir votre adresse e-mail ou votre nom d'utilisateur",
  ENTER_MOBILE: 'Veuillez saisir votre numéro de mobile',
  USERNAME_ALL: "numéro de mobile/e-mail/nom d'utilisateur",
  ENTER_USERNAME_ALL: "Veuillez saisir votre numéro de mobile, adresse e-mail ou votre nom d'utilisateur",
  ENTER_PASSWORD: 'Veuillez saisir votre mot de passe',
  RE_ENTER_PASSWORD: 'veuillez resaisir votre mot de passe',
  PASSWORD_DISMATCH: 'Les mots de passe sont différents, veuillez vérifier à nouveau',
  REGISTER: "S'inscrire",
  FORGET_PASSWORD: 'Mot de passe oublié',
  RESET_PASSWORD: 'Réinitialiser le mot de passe',
  MOBILE_REGISTER: 'Registre mobile',
  EMAIL_REGISTER: 'Inscription par e-mail',
  ENTER_USERNAME: "Veuillez saisir votre nom d'utilisateur",
  ENTER_USERNAME2: "Veuillez saisir le nom d'utilisateur",
  ENTER_CODE: 'Veuillez saisir votre code',
  GET_CODE: 'Obtenir le code',
  ENTER_EMAIL: 'Veuillez saisir votre adresse e-mail',
  ENTER_SERVER_ADDRESS: "Veuillez saisir l'adresse du serveur",
  ENTER_VALID_SERVER_ADDRESS: 'Veuillez saisir une adresse de serveur valide',
  ENTER_REALNAME: 'Veuillez saisir votre vrai nom',
  ENTER_COMPANY: 'Veuillez saisir votre entreprise',
  REGISTER_READ_PROTOCAL: "J'ai lu et j'accepte les",
  REGISTER_ONLINE_PROTOCAL: "Conditions d'utilisation et politique de confidentialité de SuperMap",
  CONNECTING: 'Connexion',
  CONNECT_SERVER_FAIL: "Impossible de se connecter au serveur, veuillez vérifier l'adresse réseau ou serveur,",
  NEXT: 'Suivant',

  SWITCH_ACCOUNT: 'Changer de compte',
  LOG_OUT: 'Déconnexion',
  CANCELLATION:'Cancellation',//need to translate

  SWITCH: 'Commutateur',
  SWITCH_CURRENT: "Vous êtes déjà connecté avec cet utilisateur'",
  SWITCHING: "Commutation ...'",
  SWITCH_FAIL: "Le basculement a échoué, veuillez réessayer de vous connecter avec cet utilisateur'",

  // 地图服务地址
  SERVICE_ADDRESS: 'Adresse de service',
  MAP_NAME: 'Nom de la carte',
  ENTER_SERVICE_ADDRESS: "Veuillez saisir l'adresse du service",
  SAVE: 'Enregistrer',

  // 我的服务
  SERVICE: 'Service',
  MY_SERVICE: 'Service',
  PRIVATE_SERVICE: "Service privé'",
  PUBLIC_SERVICE: 'Service publique',

  INVALID_SERVER_ADDRESS: 'Invalid Server Address', // to be translated

  // 个人主页
  MY_ACCOUNT: 'Mon compte',
  PROFILE_PHOTO: "Photo de profil'",
  USERNAME: "Nom d'utilisateur",
  PHONE: 'Téléphone',
  E_MAIL: 'E-mail',
  CONNECT: 'Connect',
  MANAGE_ACCOUNT: 'Gérer le compte',
  ADD_ACCOUNT: 'Ajouter un compte',
  DELETE_ACCOUNT: 'Supprimer le compte',
  UNABLE_DELETE_SELF: "Impossible de supprimer l'utilisateur actuel",

  DELETE: 'Supprimer',
  SELECT_ALL: 'Sélectionner tout',
  DESELECT_ALL: 'Désélectionner tout',

  // 数据删除导出
  SHARE: 'Partage',
  PATH: 'Trajectoire',

  LOCAL: 'Local',
  SAMPLEDATA: 'exemples de données',
  ON_DEVICE: "Données d'utilisateur",
  EXPORT_DATA: 'Exporter les données',
  IMPORT_DATA: 'Importer des données',
  UPLOAD_DATA: 'Partager les données',
  DELETE_DATA: 'Supprimer les données',
  OPEN_DATA: 'Données ouvertes',
  NEW_DATASET: 'Créer un ensemble de données',
  UPLOAD_DATASET: 'Partager le jeu de données',
  DELETE_DATASET: "Supprimer l'ensemble de données",
  UPLOAD_MAP: 'Partager la carte',
  EXPORT_MAP: 'Exporter la carte',
  DELETE_MAP: 'Supprimer la carte',
  UPLOAD_SCENE: 'Partager la scène',
  DELETE_SCENE: 'Supprimer la scène',
  UPLOAD_SYMBOL: 'Partager le symbole',
  DELETE_SYMBOL: 'Supprimer le symbole',
  UPLOAD_TEMPLATE: 'Partager le modèle',
  DELETE_TEMPLATE: 'Supprimer le modèle',
  UPLOAD_MARK: 'Partager la marque',
  DELETE_MARK: 'Supprimer la marque',
  UPLOAD_COLOR_SCHEME: 'Partager le schéma de couleurs',
  DELETE_COLOR_SCHEME: 'Supprimer le jeu de couleurs',
  BATCH_SHARE: 'Partage par lots',
  BATCH_DELETE: 'Suppression de lot',
  BATCH_ADD: 'Ajouter par lots',
  BATCH_OPERATE: 'Opération par lots',
  MY_APPLET: 'Mon applet',
  UN_DOWNLOADED_APPLET: 'Applet non téléchargé',
  DELETE_APPLET: "Supprimer l'applet",
  ADD_APPLET: "Ajouter l'applet",
  MOVE_UP: 'Déplacer vers le haut',
  MOVE_DOWN: 'Déplacer vers le bas',

  DELETE_SERVICE: 'Supprimer le service',
  PUBLISH_SERVICE: 'Publier',
  SET_AS_PRIVATE_SERVICE: 'Définir comme service privé',
  SET_AS_PUBLIC_SERVICE: 'Définir comme service public',
  SET_AS_PRIVATE_DATA: 'Définir comme données privées',
  SET_AS_PUBLIC_DATA: 'Définir comme données publiques',
  NO_SERVICE: 'Pas de service',
  SHARE_TO_GROUP: 'Share to group', // need to translate

  GET_DATA_FAILED: "Échec d'obtention des données",

  // 关于
  ABOUT: 'À propos',
  SERVICE_HOTLINE: 'Service Hotline',
  SALES_CONSULTATION: 'Consultation des ventes',
  BUSINESS_WEBSITE: 'Site Web professionnel',
  SERVICE_AGREEMENT: 'Service Agreement',
  PRIVACY_POLICY: 'Politique de confidentialité',
  HELP_MANUAL: "Manuel d'aide",
  NOVICE_GUIDE: 'Guide pour novice',
  START_GUIDE:'Guide de démarrage',

  MAP_ONLINE: 'Carte en ligne',
  MAP_2D: 'Carte 2D',
  MAP_3D: 'Carte 3D',
  BROWSE_MAP: 'Parcourir',

  // 创建数据集
  PLEASE_ADD_DATASET: 'Veuillez ajouter un ensemble de données',
  ADD_DATASET: 'Ajouter un ensemble de données',
  ENTER_DATASET_NAME: "Veuillez saisir le nom de l'ensemble de données",
  SELECT_DATASET_TYPE: 'Veuillez sélectionner le type de jeu de données',
  DATASET_NAME: 'Nom du jeu de données',
  DATASET_TYPE: 'Type de jeu de données',
  DATASET_TYPE_POINT: 'point',
  DATASET_TYPE_LINE: 'ligne',
  DATASET_TYPE_REGION: 'région',
  DATASET_TYPE_TEXT: 'texte',
  CLEAR: 'Enlever',
  CREATE: 'Créer',
  DATASET_BUILD_PYRAMID: 'Construire une pyramide',
  DATASET_BUILD_STATISTICS: 'Modèle statistique',
  TIME_SPEND_OPERATION: 'Cette opération peut prendre un certain temps, souhaitez-vous continuer?',
  IMPORT_BUILD_PYRAMID: "Voulez-vous construire une pyramide d'images (cela peut prendre un certain temps)？",
  BUILDING: 'Bâtiment',
  BUILD_SUCCESS: 'Construit avec succès',
  BUILD_FAILED: 'Construction échouée',

  // 创建数据源
  NEW_DATASOURCE: 'Créer une source de données',
  SET_DATASOURCE_NAME: 'Définir le nom de la source de données',
  ENTER_DATASOURCE_NAME: 'Veuillez saisir le nom de la source de données',
  OPEN_DATASROUCE_FAILED: "Échec de l'ouverture de la source de données",
  DATASOURCE_TYPE: 'Type de source de données',
  SERVICE_TYPE: 'Type de service',

  SELECT_DATASET_EXPORT_TYPE: 'Sélectionnez le format à exporter',
  DATASET_EXPORT_NOT_SUPPORTED: "L'exportation de cet ensemble de données n'est pas encore prise en charge",

  // 搜索
  SEARCH: 'Chercher',
  NO_SEARCH_RESULT: 'Aucun résultat de recherche',

  // 设置
  STATUSBAR_HIDE: "Barre d'état Masquer",
  SETTING_LICENSE: 'License',
  SETTING_ABOUT_ITABLET: "À propos d'iTablet",
  SETTING_ABOUT: 'À propos ',
  SETTING_ABOUT_AFTER: '',
  SETTING_CHECK_VERSION: 'Vérifier la version',
  SETTING_SUGGESTION_FEEDBACK: 'Feedback sur les suggestions',
  SETTING_LANGUAGE: 'Langue',
  SETTING_LANGUAGE_AUTO: 'Auto',
  SETTING_LOCATION_DEVICE: 'Dispositif de localisation',
  SETTING_LOCATION_LOCAL: 'Cet appareil',
  SETTING_CLEAR_CACHE: 'Vider le cache',
  SETTING_CLEAR_CACHE_SUCCESS:'Suppression réussie',
  DISTANCE:'Distance(m)',//need to translate
  TIME:'Time(s)',//need to translate
  INPUT_NUMBER:"Please Input Number",//need to translate
  DISTANCE_LOCATION:'Distance Location',//need to translate
  TIME_LOCATION:'Time Location',//need to translate

  // 许可
  LICENSE: 'License',
  LICENSE_CURRENT: 'Licence actuelle',
  LICENSE_TYPE: 'Type de licence',
  LICENSE_TRIAL: 'Essai de licence',
  LICENSE_OFFICIAL: 'Licence Officielle',
  LICENSE_STATE: 'État de licence',
  LICENSE_SURPLUS: 'Excédent de licence',
  LICENSE_YEAR: 'Année',
  LICENSE_DAY: 'Jour',
  LICENSE_PERMANENT: 'Permanent',
  LICENSE_CONTAIN_MODULE: 'Module contenant la licence',
  LICENSE_CONTAIN_EXPAND_MODULE: 'Module contenant la licence prolongée',
  LICENSE_USER_NAME: "Nom d'utilisateur",
  LICENSE_REMIND_NUMBER: 'Numéro de rappel de licence',
  LICENSE_OFFICIAL_INPUT: 'Entrée officielle de licence',
  LICENSE_TRIAL_APPLY: "Essai de licence s'applique",
  LICENSE_OFFICIAL_CLEAN: 'Nettoyage de licence officielle',
  LICENSE_OFFICIAL_RETURN: 'Retour de licence',
  LICENSE_CLEAN_CANCLE: 'Nettoyer Annuler',
  LICENSE_CLEAN_CONTINUE: 'Nettoyer Continuer',
  LICENSE_CLEAN_ALERT: 'Le nombre de licences sera déduit de la prochaine activation après avoir effacé la licence. Le numéro de licence restant actuel',
  INPUT_LICENSE_SERIAL_NUMBER: "Numéro de série de la licence d'entrée",
  PLEASE_INPUT_LICENSE_SERIAL_NUMBER: 'Veuillez saisir le numéro de série de la licence',
  PLEASE_INPUT_LICENSE_SERIAL_NUMBER_NOT_CORRECT: "Le numéro de série de la licence d'entrée n'est pas correct",
  LICENSE_SERIAL_NUMBER_ACTIVATION_SUCCESS: "Réussite de l'activation du numéro de série",
  LICENSE_REGISTER_BUY: "S'inscrire Acheter",
  LICENSE_HAVE_REGISTER: 'suis inscrit',
  LICENSE_NOT_CONTAIN_MODULE: 'Ne pas contenir de module',
  LICENSE_MODULE_REGISTER_SUCCESS: 'Module enregistré avec succès',
  LICENSE_MODULE_REGISTER_FAIL: 'Enregistrement du module échoué',
  LICENSE_EXIT: 'Quitter',
  LICENSE_EXIT_FAILED: 'Impossible de quitter',
  LICENSE_EXIT_CLOUD_ACTIVATE: "Voulez-vous recycler la licence cloud et l'activer?",
  LICENSE_EXIT_CLOUD_LOGOUT: 'Voulez-vous recycler la licence cloud et vous déconnecter?',
  LICENSE_CURRENT_EXPIRE: 'Licence actuelle non valide',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE: "Ce module n'est pas inclus dans la licence actuelle",
  LICENSE_NOT_CONTAIN_CURRENT_MODULE_SUB: "Ce module n'est pas inclus dans la licence actuelle et certaines de ses fonctions ne seront pas disponibles",
  LICENSE_NO_NATIVE_OFFICAL: 'Pas de fichier de licence officiel natif, veuillez ajouter le fichier de licence Official_License à / iTablet / license / file ',
  LICENSE_NOT_ITABLET_OFFICAL: "Cette licence officielle n'est pas activée sur iTablet, veuillez vous rendre sur la page de licence pour effacer la licence et la réactiver",
  LICENSE_NATIVE_EXPIRE: 'Licence native non valide',
  LICENSE_LONG_EFFECTIVE: 'Longue efficacité',
  LICENSE_OFFLINE: 'Licence hors ligne',
  LICENSE_CLOUD: 'Cloud de licence',
  LICENSE_PRIVATE_CLOUD: 'Licence Cloud privé',
  LICENSE_NONE: 'Aucun',
  LICENSE_EDITION: 'Édition de licence',
  LICENSE_EDITION_CURRENT: 'Édition actuelle',
  LICENSE_IN_TRIAL: 'En essai',
  LICENSE_TRIAL_END: "Fin d'essai",
  LICENSE_MODULE: 'Développer le module',
  LICENSE_ACTIVATE: 'Activer',
  LICENSE_ACTIVATING: 'Activation',
  LICENSE_ACTIVATION_SUCCESS: 'Activer avec succès',
  LICENSE_ACTIVATION_FAIL: 'Activation échouée',
  LICENSE_SELECT_LICENSE: 'Sélectionnez la licence',
  LICENSE_REAMIN_DAYS: 'Jours restants',
  LICENSE_SHOW_DETAIL: 'Afficher les détails',
  LICENSE_QUERY_NONE: "Impossible d'obtenir les informations de licence",
  LICENSE_PRIVATE_CLOUD_SERVER: 'Serveur de cloud privé',
  LICENSE_EDUCATION: 'Licence pédagogique',
  LICENSE_EDUCATION_CONNECT_FAIL: 'Échec de connexion au service',
  LICENSE_QUERY: 'Licence de requête',
  LICENSE_QUERYING: 'Requête',
  LICENSE_QUERY_FAIL: 'La requête a échoué. Veuillez vérifier les paramètres du serveur',
  LICENSE_SELECT_MODULE: 'Sélectionnez le module',
  LICENSE_SELECT_EDITION: "Sélectionnez l'édition",
  LICENSE_TOTAL_NUM: 'Nombre total',
  LICENSE_REMIAN_NUM: 'Nombre restant',
  LICENSE_DUE_DATE: 'Expire le',
  LICENSE_CLOUD_SITE_SWITCH: 'Commutateur',
  LICENSE_CLOUD_SITE_DEFAULT: 'Site par défaut',
  LICENSE_CLOUD_SITE_JP: 'Site du Japon',
  // itablet许可版本
  LICENSE_EDITION_STANDARD: 'Edition standard',
  LICENSE_EDITION_PROFESSIONAL: 'Edition Professionnelle',
  LICENSE_EDITION_ADVANCED: 'Édition avancée',
  // imobile许可模块
  Core_Dev: 'Développement de base',
  Core_Runtime: "Durée d'exécution principale",
  Navigation_Dev: 'Développement de navigation',
  Navigation_Runtime: "Durée d'exécution de la navigation",
  Realspace_Dev: 'Espace réel Dev',
  Realspace_Runtime: "Temps réel de l'espace réel",
  Plot_Dev: 'Plot Dev',
  Plot_Runtime: "Durée d'exécution du tracé",
  Industry_Navigation_Dev: "Dev de navigation de l'industrie",
  Industry_Navigation_Runtime: "Runtime de navigation de l'industrie",
  Indoor_Navigation_Dev: 'Développement de navigation intérieure',
  Indoor_Navigation_Runtime: 'Autonomie de navigation intérieure',
  Plot3D_Dev: 'Plot3D Dev',
  Plot3D_Runtime: 'Plot3D Runtime',
  Realspace_Analyst_Dev: 'Analyste en espace réel Dev',
  Realspace_Analyst_Runtime: "Analyste de l'espace real pendant le temps d'exécution",
  Realspace_Effect_Dev: "Effet Dev de l'espace réel",
  Realspace_Effect_Runtime: "Temps d'exécution de l'espace réel ",
  // itablet许可模块
  ITABLET_ARMAP: 'Carte RA',
  ITABLET_NAVIGATIONMAP: 'Carte de navigation',
  ITABLET_DATAANALYSIS: 'Analyse de données',
  ITABLET_PLOTTING: 'Traçage',
  INVALID_MODULE: 'Module non valide. Impossible de continuer.',
  INVALID_LICENSE: 'Licence invalide. Impossible de continuer.',
  GO_ACTIVATE: 'Allez activer',

  // 意见反馈
  SUGGESTION_FUNCTION_ABNORMAL: 'Fonction anormale:  fonction anormale ou non utilisable',
  SUGGESTION_PRODUCT_ADVICE: "Suggestion de produit:  j'ai une suggestion",
  SUGGESTION_OTHER_PROBLEMS: 'Autres problèmes',
  SUGGESTION_SELECT_PROBLEMS: 'Veuillez sélectionner les problèmes',
  SUGGESTION_PROBLEMS_DETAIL: 'Veuillez fournir des problèmes détaillés et des suggestions',
  SUGGESTION_PROBLEMS_DESCRIPTION: 'Veuillez saisir la description du problème',
  SUGGESTION_CONTACT_WAY: 'Moyen de Contact',
  SUGGESTION_CONTACT_WAY_INPUT: 'Veuillez saisir le moyen de contact',
  SUGGESTION_SUBMIT: 'Soumettre',
  SUGGESTION_SUBMIT_SUCCEED: 'Soumis avec succès',
  SUGGESTION_SUBMIT_FAILED: 'Échec de soumission',

  // ar地图校准
  MAP_AR_DATUM_LONGITUDE: 'Longitude',
  MAP_AR_DATUM_LATITUDE: 'Latitude',
  MAP_AR_DATUM_ENTER_CURRENT_POSITION: 'Veuillez saisir votre position actuelle',
  MAP_AR_DATUM_AUTO_LOCATION: 'Localisation automatique',
  MAP_AR_DATUM_MAP_SELECT_POINT: 'Point de sélection de la carte',
  MAP_AR_DATUM_SURE: 'Sûr',
  MAP_AR_DATUM_AUTO_LOCATIONING: 'Localisation',
  MAP_AR_DATUM_POSITION: 'Données de positionnement',
  MAP_AR_DATUM_AUTO_LOCATION_SUCCEED: 'Localisation automatique réussie',
  MAP_AR_DATUM_MAP_SELECT_POINT_SUCCEED: 'Point de sélection de carte réussi',
  MAP_AR_DATUM_PLEASE_TOWARDS_NORTH: 'Veuillez placer votre téléphone mobile face au nord et cliquez sur Sûr',
  MAP_AR_DATUM_SETTING: 'Réglage',
  X_COORDINATE: 'Coordonnée X',
  Y_COORDINATE: 'Coordonnée Y',
  MAP_AR_DATUM_AUTO_CATCH: 'Capture automatique',
  MAP_AR_DATUM_AUTO_CATCH_TOLERANCE: 'Tolérance',
  MAP_AR_DRAW_WINDOW: 'Dessiner une fenêtre',

  MAR_AR_DATUM_PICTURE_LOCATION: 'Emplacement QR',
  MAR_AR_POSITION_CORRECT: 'Calibrage de la position',
  MAP_AR_TOWARDS_NORTH: "La caméra à l'arrière du téléphone fait face au nord",
  MAP_AR_SCAN_TIP: 'Assurez-vous que le code QR remplit exactement le cadre de numérisation',
  MAP_AR_SCAN_IT: 'Numériser',
  MAP_AR_DATUM_HEIGHT: 'Hauteur',
  MAP_AR_DATUM_DIRECTION: 'Direction',
  MAR_AR_DATUM_NORTH: 'Nord',
  MAR_AR_PICTURE_LOCATION_SUCCEED: 'Emplacement QR réussi',
  MAR_AR_QR_INVALID: 'Informations sur le code QR non reconnues',

  // ar地图
  COLLECT_SCENE_RENAME: 'Renommer',
  COLLECT_SCENE_RENAME_SUCCEED: 'Renommer avec succès',
  COLLECT_SCENE_ADD_REMARK: 'Ajouter une remarque',
  COLLECT_SCENE_ADD_REMARK_SUCCEED: 'Ajouter de la remarque réussie',

  CHOOSE_COLOR: 'Sélectionner la couleur',
  SET_PROJECTION: 'Configurer la projection',

  ONLINE_DATA_UNAVAILABLE: 'Online Data unavailable', //to be translated
  ONLINE: 'Online', //to be translated

  CLOUD_CAPACITY_NOT_ENOUGH: 'No enough capacity on cloud storage',  //to be translated
}

export { Profile }
