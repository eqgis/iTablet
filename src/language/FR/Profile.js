// 我的、发现
const Profile = {
  // 我的  主页面
  LOGIN_NOW: 'connexion',
  IMPORT: 'import',
  DATA: 'Données',
  MARK: 'Mark',
  MAP: 'Carte',
  SCENE: 'Scène',
  BASEMAP: 'Carte de base',
  SYMBOL: 'Symbole',
  SETTINGS: 'Paramètres',
  COLOR_SCHEME: 'Schéma de couleur',
  TEMPLATE: 'Modèle',
  AIMODEL: 'AI Model', //待翻译
  COLLECTION_TEMPLATE: "Modèle d'arpentage",
  PLOTTING_TEMPLATE: 'Modèle de traçage',
  NAVIGATION: 'Navigation',
  INCREMENT: 'Augmentation',
  ENCLOSURE: 'Coffret',

  MY_COLOR_SCHEME: 'My Color Scheme', //待翻译
  MY_MODEL: 'My Model', //待翻译

  SELECT_MODEL: 'Select Model', //待翻译

  // 我的——登录
  LOGIN: 'connexion',
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
  RE_ENTER_PASSWORD: 'Please re-enter your password', //待翻译
  PASSWORD_DISMATCH: 'The passwords are different, please check again',
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

  SWITCH: 'Switch', //待翻译
  SWITCH_CURRENT: "Vous êtes déjà connecté avec cet utilisateur'",
  SWITCHING: "Commutation ...'",
  SWITCH_FAIL: "Le basculement a échoué, veuillez réessayer de vous connecter avec cet utilisateur'",

  // 地图服务地址
  SERVICE_ADDRESS: 'Service Address',
  MAP_NAME: 'Nom de la carte',
  ENTER_SERVICE_ADDRESS: "Veuillez saisir l'adresse du service",
  SAVE: 'Enregistrer',

  // 我的服务
  SERVICE: 'Service',
  MY_SERVICE: 'Service',
  PRIVATE_SERVICE: "Service privé'",
  PUBLIC_SERVICE: 'Service publique',

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
  PATH: 'Chemin',

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
  BATCH_ADD: 'Batch Add', // 待翻译
  BATCH_OPERATE: 'Opération par lots',
  MY_APPLET: 'My Applet', // 待翻译

  // 待翻译
  UN_DOWNLOADED_APPLET: 'Undownloaded Applet',
  DELETE_APPLET: 'Delete Applet',
  ADD_APPLET: 'Add Applet',
  MOVE_UP: 'Move Up',
  MOVE_DOWN: 'Move Down',

  DELETE_SERVICE: 'Supprimer le service',
  PUBLISH_SERVICE: 'Publier',
  SET_AS_PRIVATE_SERVICE: 'Définir comme service privé',
  SET_AS_PUBLIC_SERVICE: 'Définir comme service public',
  SET_AS_PRIVATE_DATA: 'Définir comme données privées',
  SET_AS_PUBLIC_DATA: 'Définir comme données publiques',
  NO_SERVICE: 'Pas de service',

  GET_DATA_FAILED: "Échec d'obtention des données",

  // 关于
  ABOUT: 'À propos',
  SERVICE_HOTLINE: 'Service Hotline',
  SALES_CONSULTATION: 'Consultation des ventes',
  BUSINESS_WEBSITE: 'Site Web professionnel',
  SERVICE_AGREEMENT: 'Service Agreement',
  PRIVACY_POLICY: 'Politique de confidentialité',
  HELP_MANUAL: "Manuel d'aide",

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
  CLEAR: 'Clear',
  CREATE: 'Créer',
  DATASET_BUILD_PYRAMID: 'Build Pyramid', //待翻译
  DATASET_BUILD_STATISTICS: 'Statistics Model',
  TIME_SPEND_OPERATION: 'This operation may take some time, would you like to continue?',
  IMPORT_BUILD_PYRAMID: 'Do you want to build image pyramid(may take some time)？',
  BUILDING: 'Building',
  BUILD_SUCCESS: 'Build Sucessfully',
  BUILD_FAILED: 'Build Failed',

  // 创建数据源
  NEW_DATASOURCE: 'Créer une source de données',
  SET_DATASOURCE_NAME: 'Définir le nom de la source de données',
  ENTER_DATASOURCE_NAME: 'Veuillez saisir le nom de la source de données',
  OPEN_DATASROUCE_FAILED: "Échec de l'ouverture de la source de données",
  DATASOURCE_TYPE: 'Datasource type', //待翻译
  SERVICE_TYPE: 'Service type',

  SELECT_DATASET_EXPORT_TYPE: 'Sélectionnez le format à exporter',
  DATASET_EXPORT_NOT_SUPPORTED: "L'exportation de cet ensemble de données n'est pas encore prise en charge",

  // 搜索
  SEARCH: 'Chercher',
  NO_SEARCH_RESULT: 'Aucun résultat de recherche',

  // 设置
  STATUSBAR_HIDE: "Barre d'état Masquer",
  SETTING_LICENSE: 'License',
  SETTING_ABOUT_ITABLET: "À propos d'iTablet",
  SETTING_ABOUT: 'About ', //待翻译
  SETTING_ABOUT_AFTER: '',
  SETTING_CHECK_VERSION: 'Vérifier la version',
  SETTING_SUGGESTION_FEEDBACK: 'Suggestion Feedback', //待翻译
  SETTING_LANGUAGE: 'Langue',
  SETTING_LANGUAGE_AUTO: 'Auto',
  SETTING_LOCATION_DEVICE: 'Location Device', //待翻译
  SETTING_LOCATION_LOCAL: 'This device', //待翻译

  // 许可
  LICENSE: '许可',
  LICENSE_CURRENT: 'Licence actuelle',
  LICENSE_TYPE: 'Type de licence',
  LICENSE_TRIAL: 'Essai de licence',
  LICENSE_OFFICIAL: 'License Official',
  LICENSE_STATE: 'État de licence',
  LICENSE_SURPLUS: 'License Surplus',
  LICENSE_YEAR: 'YEAR', //待翻译
  LICENSE_DAY: 'Jour',
  LICENSE_PERMANENT: 'Permanent', //待翻译
  LICENSE_CONTAIN_MODULE: 'License Contain Module',
  LICENSE_CONTAIN_EXPAND_MODULE: 'License Contain Expand Module', //待翻译
  LICENSE_USER_NAME: 'User Name', //待翻译
  LICENSE_REMIND_NUMBER: 'License Remind Number', //待翻译
  LICENSE_OFFICIAL_INPUT: 'Entrée officielle de licence',
  LICENSE_TRIAL_APPLY: "Essai de licence s'applique",
  LICENSE_OFFICIAL_CLEAN: 'License Official Clean',
  LICENSE_OFFICIAL_RETURN: 'License Return', //待翻译
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
  LICENSE_MODULE_REGISTER_SUCCESS: 'Module Register Success',
  LICENSE_MODULE_REGISTER_FAIL: 'Module Register Fail', //待翻译
  LICENSE_EXIT: 'Quitter',
  LICENSE_EXIT_FAILED: 'Échec de la sortie',
  LICENSE_EXIT_CLOUD_ACTIVATE: 'Do you want recycle cloud license and activate?', //待翻译
  LICENSE_EXIT_CLOUD_LOGOUT: 'Do you want recycle cloud license and logout?', //待翻译
  LICENSE_CURRENT_EXPIRE: 'Licence actuelle non valide',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE: "Ce module n'est pas inclus dans la licence actuelle",
  LICENSE_NOT_CONTAIN_CURRENT_MODULE_SUB: "Ce module n'est pas inclus dans la licence actuelle et certaines de ses fonctions ne seront pas disponibles",
  LICENSE_NO_NATIVE_OFFICAL: 'Pas de fichier de licence officiel natif, veuillez ajouter le fichier de licence Official_License à / iTablet / license / file ',
  LICENSE_NOT_ITABLET_OFFICAL: "Cette licence officielle n'est pas activée sur iTablet, veuillez vous rendre sur la page de licence pour effacer la licence et la réactiver",
  LICENSE_NATIVE_EXPIRE: 'Licence native non valide',

  // 待翻译
  LICENSE_LONG_EFFECTIVE: 'Long Effective',
  LICENSE_OFFLINE: 'License OffLine',
  LICENSE_CLOUD: 'License Cloud',
  LICENSE_PRIVATE_CLOUD: 'License Private Cloud',
  LICENSE_NONE: 'None',
  LICENSE_EDITION: 'License Edition',
  LICENSE_EDITION_CURRENT: 'Current Edition',
  LICENSE_IN_TRIAL: 'in Trial',
  LICENSE_TRIAL_END: 'Trial End',
  LICENSE_MODULE: 'Expand Module',
  LICENSE_ACTIVATE: 'Activate',
  LICENSE_ACTIVATING: 'Activating',
  LICENSE_ACTIVATION_SUCCESS: 'Activate Success',
  LICENSE_ACTIVATION_FAIL: 'Activate Failed',
  LICENSE_SELECT_LICENSE: 'Select License',
  LICENSE_REAMIN_DAYS: 'Remain Days',
  LICENSE_SHOW_DETAIL: 'Show details',
  LICENSE_QUERY_NONE: 'Unable to get license information',
  LICENSE_PRIVATE_CLOUD_SERVER: 'Private Cloud Server',

  LICENSE_EDUCATION: 'Licence pédagogique',
  LICENSE_EDUCATION_CONNECT_FAIL: 'Échec de la connexion au service',

  // 待翻译
  LICENSE_QUERY: 'Query License',
  LICENSE_QUERYING: 'Quering',
  LICENSE_QUERY_FAIL: 'Query failed. Please check the server setting',
  LICENSE_SELECT_MODULE: 'Select Module',
  LICENSE_SELECT_EDITION: 'Select Edition',
  LICENSE_TOTAL_NUM: 'Total Numbers',
  LICENSE_REMIAN_NUM: 'Remain Numbers',
  LICENSE_DUE_DATE: 'Expire at',
  LICENSE_CLOUD_SITE_SWITCH: 'Switch',
  LICENSE_CLOUD_SITE_DEFAULT: 'Default Site',
  LICENSE_CLOUD_SITE_JP: 'Japan Site',
  // itablet许可版本
  LICENSE_EDITION_STANDARD: 'Standard Edition',
  LICENSE_EDITION_PROFESSIONAL: 'Professional Edition',
  LICENSE_EDITION_ADVANCED: 'Advanced Edition',

  // imobile许可模块
  Core_Dev: 'Core Dev',
  Core_Runtime: "Durée d'exécution principale",
  Navigation_Dev: 'Navigation Dev',
  Navigation_Runtime: "Durée d'exécution de la navigation",
  Realspace_Dev: 'Espace réel Dev',
  Realspace_Runtime: "Temps réel de l'espace réel",
  Plot_Dev: 'Plot Dev',
  Plot_Runtime: "Durée d'exécution du tracé",
  Industry_Navigation_Dev: "«Dev de navigation de l'industrie»",
  Industry_Navigation_Runtime: "Runtime de navigation de l'industrie",
  Indoor_Navigation_Dev: 'Indoor Navigation Dev',
  Indoor_Navigation_Runtime: 'Autonomie de navigation intérieure',
  Plot3D_Dev: 'Plot3D Dev',
  Plot3D_Runtime: 'Plot3D Runtime',
  Realspace_Analyst_Dev: 'Analyste en espace réel Dev',
  Realspace_Analyst_Runtime: 'Realspace Analyst Runtime',
  Realspace_Effect_Dev: 'Realspace Effect Dev',
  Realspace_Effect_Runtime: "Temps d'exécution réel de l'espace",

  // itablet许可模块 待翻译
  ITABLET_ARMAP: 'Ar Map',
  ITABLET_NAVIGATIONMAP: 'Navigation Map',
  ITABLET_DATAANALYSIS: 'Data Analysis',
  ITABLET_PLOTTING: 'Plotting',
  INVALID_MODULE: 'Invalid module. Unable to continue.',
  INVALID_LICENSE: 'Invalid license. Unable to continue.',
  GO_ACTIVATE: 'Go Activate',

  // 意见反馈 待翻译
  SUGGESTION_FUNCTION_ABNORMAL: 'Function Abnormal : Function abnormal or not can use',
  SUGGESTION_PRODUCT_ADVICE: 'Product Suggestion : I have a suggestion',
  SUGGESTION_OTHER_PROBLEMS: 'Other Problems',
  SUGGESTION_SELECT_PROBLEMS: 'Please select the problems',
  SUGGESTION_PROBLEMS_DETAIL: 'Please provide detailed problems and suggestion',
  SUGGESTION_PROBLEMS_DESCRIPTION: 'Plese input problem description',
  SUGGESTION_CONTACT_WAY: 'Contact Way',
  SUGGESTION_CONTACT_WAY_INPUT: 'Please input contact way',
  SUGGESTION_SUBMIT: 'Submit',
  SUGGESTION_SUBMIT_SUCCEED: 'Submit Succeed',
  SUGGESTION_SUBMIT_FAILED: 'Submit Failed',

  // ar地图校准 待翻译
  MAP_AR_DATUM_LONGITUDE: 'Longitude',
  MAP_AR_DATUM_LATITUDE: 'Latitude',
  MAP_AR_DATUM_ENTER_CURRENT_POSITION: 'Please enter current position',
  MAP_AR_DATUM_AUTO_LOCATION: 'Auto location',
  MAP_AR_DATUM_MAP_SELECT_POINT: 'Map select point',
  MAP_AR_DATUM_SURE: 'Sure',
  MAP_AR_DATUM_AUTO_LOCATIONING: 'Locationing',
  MAP_AR_DATUM_POSITION: 'Datum position',
  MAP_AR_DATUM_AUTO_LOCATION_SUCCEED: 'Auto location succeed',
  MAP_AR_DATUM_MAP_SELECT_POINT_SUCCEED: 'Map select point succeed',
  MAP_AR_DATUM_PLEASE_TOWARDS_SOUTH: 'Please place your mobile phone facing south click sure',
  MAP_AR_DATUM_SETTING: 'Setting',
  X_COORDINATE: 'X Coordinate',
  Y_COORDINATE: 'Y Coordinate',

  // ar地图 待翻译
  COLLECT_SCENE_RENAME: 'Rename',
  COLLECT_SCENE_RENAME_SUCCEED: 'Rename succeed',
  COLLECT_SCENE_ADD_REMARK: 'Add remark',
  COLLECT_SCENE_ADD_REMARK_SUCCEED: 'Add remark succeed',

  CHOOSE_COLOR: 'Sélectionner la couleur',
  SET_PROJECTION: 'Configurer la projection',
}

export { Profile }
