//好友
const Friends = {
  LOCALE: 'zh-cn',

  LOGOUT:
    'Connectez-vous au service en ligne et restez en contact avec vos amis',
  MESSAGES: 'Messages',
  FRIENDS: 'Amis',
  GROUPS: 'Groupes',
  ADD_FRIENDS: 'Ajouter des amis',
  NEW_GROUP_CHAT: 'Nouvelle discussion de groupe',
  RECOMMEND_FRIEND: 'Recommander des Amis',
  SELECT_MODULE: 'Sélectionnez le module',
  SELECT_MAP: '选择地图',
  // Friend
  MSG_SERVICE_FAILED: 'Impossible de se connecter au service de messagerie',
  MSG_SERVICE_NOT_CONNECT:
    'Impossible de se connecter au service de messagerie',
  SEND_SUCCESS: 'Envoyer avec succès',
  SEND_FAIL: "Échec de l'envoi du fichier",
  SEND_FAIL_NETWORK: 'Échec de la réception, veuillez vérifier votre réseau',
  RECEIVE_SUCCESS: 'Réception réussie',
  RECEIVE_FAIL_EXPIRE: 'La réception a échoué, le fichier a peut-être expiré',
  RECEIVE_FAIL_NETWORK: 'Échec de réception, veuillez vérifier votre réseau',
  // FriendMessage
  MARK_READ: 'Marquer comme lu', //*
  MARK_UNREAD: 'Marquer comme non lu', //*
  DEL: 'Delete', //*
  NOTIFICATION: 'Notification', //*
  CLEAR_NOTIFICATION: 'Effacer la notification', //*
  CONFIRM: 'Oui', //*
  CANCEL: 'Annuler', //*
  ALERT_DEL_HISTORY: 'Effacer cet historique de chat?', //*
  // FriendList
  SET_MARK_NAME: 'Définir le nom du repère',
  DEL_FRIEND: 'Supprimer un ami',
  ALERT_DEL_FRIEND: "Supprimer l'ami ainsi que l'historique de chat?",
  TEXT_CONTENT: 'Contenu du texte',
  INPUT_MARK_NAME: 'Veuillez saisir le nom de la marque',
  INPUT_INVALID: 'Entrée non valide, veuillez entrer à nouveau',
  // InformMessage
  TITLE_NOTIFICATION: 'Notification',
  FRIEND_RESPOND: "Accepter cette demande d'ami?",
  // CreateGroupChat
  CONFIRM2: 'ACCORD',
  TITLE_CHOOSE_FRIEND: 'Choisir un ami',
  TOAST_CHOOSE_2: 'Ajouter plus de 2 Amis pour chatter en groupe',
  NO_FRIEND: "Oups, pas encore d'ami",
  // AddFriend
  ADD_FRIEND_PLACEHOLDER: 'E-mail / Téléphone / Pseudo',
  SEARCHING: 'Recherche...',
  SEARCH: 'CHERCHER',
  ADD_SELF: 'Impossible de vous ajouter comme ami',
  ADD_AS_FRIEND: "L'ajouter comme ami?",
  // FriendGroup
  LOADING: 'Chargement ...',
  DEL_GROUP: 'Supprimer le groupe',
  DEL_GROUP_CONFIRM:
    "Souhaitez-vous effacer l'historique des discussions et quitter ce groupe?",
  DEL_GROUP_CONFIRM2:
    "Voulez-vous effacer l'historique des discussions et dissoudre ce groupe?",
  // Chat
  INPUT_MESSAGE: "Message d'entrée...",
  SEND: 'Envoyer',
  LOAD_EARLIER: 'Charger les messages antérieurs',
  IMPORT_DATA: 'Importation de données...',
  IMPORT_SUCCESS: "Succès d'importation",
  IMPORT_FAIL: "Échec de l'importation",
  IMPORT_CONFIRM: 'Voulez-vous importer les données?',
  RECEIVE_CONFIRM: 'Voulez-vous télécharger les données',
  OPENCOWORKFIRST:
    "Veuillez d'abord ouvrir la carte de coworking avant d'importer les données",
  LOCATION_COWORK_NOTIFY: "Impossible d'ouvrir l'emplacement en mode coworking",
  LOCATION_SHARE_NOTIFY: "Impossible d'ouvrir l'emplacement dans le partage",
  WAIT_DOWNLOADING: "Veuillez patienter jusqu'à la fin du téléchargement",
  DATA_NOT_FOUND:
    'Les données ne vous intéressent pas, souhaitez-vous les télécharger à nouveau?',
  LOAD_ORIGIN_PIC: "Charger l'origine",
  // CustomActions
  MAP: 'Carte',
  TEMPLATE: 'Modèle',
  LOCATION: 'Lieu',
  PICTURE: 'Image',
  LOCATION_FAILED: 'Impossible de localiser',
  // Cowork
  SEND_COWORK_INVITE: '是否发送协作邀请？',
  COWORK_INVITATION: '协作邀请',
  COWORK_MEMBER: '协作人员',
  COWORK_IS_END: '协作已结束',
  COWORK_JOIN_FAIL: '暂时无法加入',
  COWORK_UPDATE: '更新',
  COWORK_ADD: '追加',
  COWORK_IGNORE: '忽略',
  NEW_MESSAGE: '新消息',
  NEW_MESSAGE_SHORT: '新消息',
  UPDATING: '更新中',
  SELECT_MESSAGE_TO_UPDATE: '请选择要处理的消息',
  UPDATE_NOT_EXIST_OBJ: '该对象不存在，无法更新',
  ADD_DELETE_ERROR: '不能添加删除对象',
  DELETE_COWORK_ALERT: '是否删除此协作？',
  NO_SUCH_MAP: '无此地图',
  SELF: '我',
  ONLINECOWORK_DISABLE_ADD: '在线协作中，不能添加',
  // RecommendFriend
  FIND_NONE: 'Impossible de trouver de nouvelles amis à partir de vos contacts',
  ALREADY_FRIEND: 'Vous êtes déjà Amis',
  PERMISSION_DENIED_CONTACT:
    "Veuillez activer l'autorisation d'iTablet pour afficher les contacts",
  // ManageFriend/Group
  SEND_MESSAGE: 'Envoyer un message',
  SET_MARKNAME: "Définir l'alias",
  SET_GROUPNAME: 'Définir le nom du groupe',
  PUSH_FRIEND_CARD: "Poussez la carte d'amis",
  FRIEND_MAP: "Carte d'amis",
  ADD_BLACKLIST: 'Ajouter à la liste noire',
  DELETE_FRIEND: 'Supprimer un ami',
  LIST_MEMBERS: 'Liste des membres',
  LEAVE_GROUP: 'Quitter le groupe',
  CLEAR_HISTORY: "Effacer l'historique des discussions",
  DISBAND_GROUP: 'Groupe de dissolution',
  DELETE_MEMBER: 'Supprimer un membre du groupe',
  ADD_MEMBER: 'Ajouter un membre du groupe',
  COWORK: 'Carte de coworking',
  EXIT_COWORK: 'Quitter le coworking',
  GO_COWORK: 'Coworking',
  ALERT_EXIT_COWORK: 'Voulez-vous fermer la carte de coworking actuelle?',
  SHARE_DATASET: "Partager l'ensemble de données en même temps",
  // system text
  SYS_MSG_PIC: '[IMAGE]',
  SYS_MSG_MAP: 'CARTE',
  SYS_MSG_LAYER: '[COUCHE]',
  SYS_MSG_DATASET: '[Ensemble de données]',
  SYS_MSG_ADD_FRIEND: "Envoyer une demande d'ami",
  SYS_MSG_REMOVED_FROM_GROUP: 'vous aviez été retiré du groupe',
  SYS_MSG_LEAVE_GROUP: 'vous aviez quitté  ce groupe',
  SYS_MSG_ETC: '... ',
  SYS_MSG_REMOVE_OUT_GROUP: ' ont supprimé ',
  SYS_MSG_REMOVE_OUT_GROUP2: 'hors groupe',
  SYS_MSG_ADD_INTO_GROUP: ' ont ajouté ',
  SYS_MSG_ADD_INTO_GROUP2: 'Dans le groupe',
  SYS_NO_SUCH_USER: 'Utilisateur non trouvé',
  SYS_FRIEND_ALREADY_IN_GROUP: 'Amis sélectionnés déjà dans le groupe',
  EXCEED_NAME_LIMIT:
    'Le nom doit être composé de 40 mots (Chinois dans 20 mots)',
  SYS_MSG_MOD_GROUP_NAME: ' Changé le nom du groupe en ',
  SYS_LOGIN_ON_OTHER_DEVICE: 'Votre compte est connecté sur un autre appareil',
  SYS_MSG_REJ: "L'autre coté ne vous a pas encore ajouté comme ami",
  SYS_FRIEND_REQ_ACCEPT: 'Vous êtes Amis maintenant, profitez-en!',
  SYS_INVITE_TO_COWORK: '邀您参加协作',
  SYS_MSG_GEO_ADDED: '添加了',
  SYS_MSG_GEO_DELETED: '删除了',
  SYS_MSG_GEO_UPDATED: '更新了',
  SYS_MSG_GEO_ADDED2: '',
  SYS_MSG_GEO_DELETED2: '',
  SYS_MSG_GEO_UPDATED2: '',
}
export { Friends }
