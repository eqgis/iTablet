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
  COLLECTION_TEMPLATE: "Modèle d'arpentage",
  PLOTTING_TEMPLATE: 'Modèle de traçage',
  NAVIGATION: 'Navigation',
  INCREMENT: 'Augmentation',
  ENCLOSURE: 'Coffret',

  MY_COLOR_SCHEME: 'My Color Scheme', //待翻译

  // 我的——登录
  LOGIN: 'connexion',
  LOGIN_TIMEOUT: 'Délai de connexion, veuillez réessayer plus tard',
  LOGIN_CURRENT: "L'utilisateur actuel est déjà connecté",
  LOGIN_INVALID: 'La connexion a expiré. Veuillez vous reconnecter',
  MOBILE_LOGIN: 'Connexion mobile',
  EMAIL_LOGIN: 'Connexion par e-mail',
  ENTER_EMAIL_OR_USERNAME: "Veuillez saisir votre adresse e-mail ou votre nom d'utilisateur",
  ENTER_MOBILE: 'Veuillez saisir votre numéro de mobile',
  ENTER_USERNAME_ALL: "Veuillez saisir votre numéro de mobile, adresse e-mail ou votre nom d'utilisateur",
  ENTER_PASSWORD: 'Veuillez saisir votre mot de passe',
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
  BATCH_ADD: '批量添加',
  BATCH_OPERATE: 'Opération par lots',
  AVAILABLE_APPLET: '可用小程序', // 待翻译
  DELETE_APPLET: '删除小程序',
  ADD_APPLET: '添加小程序',
  MOVE_UP: '上移',
  MOVE_DOWN: '下移',

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
  TIME_SPEND_OPERATION: 'This operation will cost some time, would you like to continue?',
  BUILDING: 'Building',
  BUILD_SUCCESS: 'Build Sucessfully',
  BUILD_FAILED: 'Build Failed',

  // 创建数据源
  NEW_DATASOURCE: 'Créer une source de données',
  SET_DATASOURCE_NAME: 'Définir le nom de la source de données',
  ENTER_DATASOURCE_NAME: 'Veuillez saisir le nom de la source de données',
  OPEN_DATASROUCE_FAILED: "Échec de l'ouverture de la source de données",
  DATASOURCE_TYPE: '数据类型',
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
  SETTING_ABOUT: '关于',
  SETTING_ABOUT_AFTER: '',
  SETTING_CHECK_VERSION: 'Vérifier la version',
  SETTING_SUGGESTION_FEEDBACK: '意见反馈',
  SETTING_LANGUAGE: 'Langue',
  SETTING_LANGUAGE_AUTO: 'Auto',
  SETTING_LOCATION_DEVICE: '定位设备',
  SETTING_LOCATION_LOCAL: '此设备',

  // 许可
  LICENSE: '许可',
  LICENSE_CURRENT: 'Licence actuelle',
  LICENSE_TYPE: 'Type de licence',
  LICENSE_TRIAL: 'Essai de licence',
  LICENSE_OFFICIAL: 'License Official',
  LICENSE_STATE: 'État de licence',
  LICENSE_SURPLUS: 'License Surplus',
  LICENSE_YEAR: '年',
  LICENSE_DAY: 'Jour',
  LICENSE_PERMANENT: '永久',
  LICENSE_CONTAIN_MODULE: 'License Contain Module',
  LICENSE_CONTAIN_EXPAND_MODULE: '所含拓展模块',
  LICENSE_USER_NAME: '用户名',
  LICENSE_REMIND_NUMBER: '剩余许可数量',
  LICENSE_OFFICIAL_INPUT: 'Entrée officielle de licence',
  LICENSE_TRIAL_APPLY: "Essai de licence s'applique",
  LICENSE_OFFICIAL_CLEAN: 'License Official Clean',
  LICENSE_OFFICIAL_RETURN: '归还许可',
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
  LICENSE_MODULE_REGISTER_FAIL: '模块登记失败',
  LICENSE_EXIT: 'Quitter',
  LICENSE_EXIT_FAILED: 'Échec de la sortie',
  LICENSE_EXIT_CLOUD_ACTIVATE: '归还当前云许可并激活此许可?',
  LICENSE_EXIT_CLOUD_LOGOUT: '归还当前云许可并退出账号?',
  LICENSE_CURRENT_EXPIRE: 'Licence actuelle non valide',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE: "Ce module n'est pas inclus dans la licence actuelle",
  LICENSE_NOT_CONTAIN_CURRENT_MODULE_SUB: "Ce module n'est pas inclus dans la licence actuelle et certaines de ses fonctions ne seront pas disponibles",
  LICENSE_NO_NATIVE_OFFICAL: 'Pas de fichier de licence officiel natif, veuillez ajouter le fichier de licence Official_License à / iTablet / license / file ',
  LICENSE_NOT_ITABLET_OFFICAL: "Cette licence officielle n'est pas activée sur iTablet, veuillez vous rendre sur la page de licence pour effacer la licence et la réactiver",
  LICENSE_NATIVE_EXPIRE: 'Licence native non valide',
  LICENSE_LONG_EFFECTIVE: '长期有效',
  LICENSE_OFFLINE: '离线许可',
  LICENSE_CLOUD: '云许可',
  LICENSE_PRIVATE_CLOUD: '私有云许可',
  LICENSE_NONE: '没有许可',
  LICENSE_EDITION: '许可版本',
  LICENSE_EDITION_CURRENT: '当前版本',
  LICENSE_IN_TRIAL: '试用中',
  LICENSE_TRIAL_END: '试用结束',
  LICENSE_MODULE: '扩展模块',
  LICENSE_ACTIVATE: '激活许可',
  LICENSE_ACTIVATING: '激活中',
  LICENSE_ACTIVATION_SUCCESS: '激活成功',
  LICENSE_ACTIVATION_FAIL: '激活失败',
  LICENSE_SELECT_LICENSE: '选择许可',
  LICENSE_REAMIN_DAYS: '剩余天数',
  LICENSE_SHOW_DETAIL: '显示详细信息',
  LICENSE_QUERY_NONE: '未查询到许可信息',
  LICENSE_PRIVATE_CLOUD_SERVER: '私有云许可地址',
  LICENSE_QUERY: '查询许可',
  LICENSE_QUERYING: '查询中',
  LICENSE_QUERY_FAIL: '查询失败，请检查服务器设置',
  LICENSE_SELECT_MODULE: '选择模块',
  LICENSE_SELECT_EDITION: '选择版本',
  LICENSE_TOTAL_NUM: '总套数',
  LICENSE_REMIAN_NUM: '可用套数',
  LICENSE_DUE_DATE: '到期时间',
  LICENSE_CLOUD_SITE_SWITCH: '切换',
  LICENSE_CLOUD_SITE_DEFAULT: '默认站点',
  LICENSE_CLOUD_SITE_JP: '日本站点',
  // itablet许可版本
  LICENSE_EDITION_STANDARD: '标准版',
  LICENSE_EDITION_PROFESSIONAL: '专业版',
  LICENSE_EDITION_ADVANCED: '高级版',
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
  // itablet许可模块
  ITABLET_ARMAP: 'AR地图',
  ITABLET_NAVIGATIONMAP: '导航地图',
  ITABLET_DATAANALYSIS: '数据分析',
  ITABLET_PLOTTING: '应急标绘',
  INVALID_MODULE: '当前模块许可无效，不能进行此操作。',
  INVALID_LICENSE: '许可无效，不能进行此操作。',
  GO_ACTIVATE: '前往激活',

  // 意见反馈
  SUGGESTION_FUNCTION_ABNORMAL: '功能异常：功能故障或不可用',
  SUGGESTION_PRODUCT_ADVICE: '产品建议：用得不爽，我有建议',
  SUGGESTION_OTHER_PROBLEMS: '其他问题',
  SUGGESTION_SELECT_PROBLEMS: '请选择你想反馈的问题点',
  SUGGESTION_PROBLEMS_DETAIL: '请补充详细问题和意见',
  SUGGESTION_PROBLEMS_DESCRIPTION: '请输入问题描述',
  SUGGESTION_CONTACT_WAY: '联系方式',
  SUGGESTION_CONTACT_WAY_INPUT: '请输入联系方式',
  SUGGESTION_SUBMIT: '提交',
  SUGGESTION_SUBMIT_SUCCEED: '提交成功',
  SUGGESTION_SUBMIT_FAILED: '提交失败',

  // ar地图校准
  MAP_AR_DATUM_LONGITUDE: '经度',
  MAP_AR_DATUM_LATITUDE: '纬度',
  MAP_AR_DATUM_ENTER_CURRENT_POSITION: '请输入当前位置坐标',
  MAP_AR_DATUM_AUTO_LOCATION: '自动定位',
  MAP_AR_DATUM_MAP_SELECT_POINT: '地图选点',
  MAP_AR_DATUM_SURE: '确定',
  MAP_AR_DATUM_AUTO_LOCATIONING: '定位中',
  MAP_AR_DATUM_POSITION: '基点坐标',
  MAP_AR_DATUM_AUTO_LOCATION_SUCCEED: '自动定位成功',
  MAP_AR_DATUM_MAP_SELECT_POINT_SUCCEED: '地图选点成功',
  MAP_AR_DATUM_PLEASE_TOWARDS_SOUTH: '请把手机垂直于地面面向正南点击确定',
  MAP_AR_DATUM_SETTING: '设置',

  // ar地图
  COLLECT_SCENE_RENAME: '重命名',
  COLLECT_SCENE_RENAME_SUCCEED: '重命名成功',
  COLLECT_SCENE_ADD_REMARK: '添加备注',
  COLLECT_SCENE_ADD_REMARK_SUCCEED: '添加备注成功',

  CHOOSE_COLOR: 'Sélectionner la couleur',
  SET_PROJECTION: 'Configurer la projection',
}

export { Profile }
