// 好友
const Friends = {
  LOCALE: 'en',

  LOGOUT: 'Connectez-vous au service en ligne et restez en contact avec vos amis',
  MESSAGES: 'Messages',
  FRIENDS: 'Amis',
  GROUPS: 'Groupes',
  ADD_FRIENDS: 'Ajouter des amis',
  NEW_GROUP_CHAT: 'Nouveau groupe de chat',
  RECOMMEND_FRIEND: 'Recommander des amis',
  SELECT_MODULE: 'Sélectionnez le module',
  SELECT_MAP: 'Sélectionnez la carte',
  // Friend
  MSG_SERVICE_FAILED: 'Échec de la connexion au service de messagerie',
  MSG_SERVICE_NOT_CONNECT: 'Impossible de se connecter au service de messagerie',
  SEND_SUCCESS: 'Envoyer avec succès',
  SEND_FAIL: "Échec de l'envoi du fichier",
  SEND_FAIL_NETWORK: "Échec de l'envoi du fichier, veuillez vérifier votre réseau",
  RECEIVE_SUCCESS: 'Reçu avec succès',
  RECEIVE_FAIL_EXPIRE: 'La réception a échoué, le fichier a peut-être expiré',
  RECEIVE_FAIL_NETWORK: 'Échec de la réception, veuillez vérifier votre réseau',
  // FriendMessage
  MARK_READ: 'Mark read', //*
  MARK_UNREAD: 'Mark unread', //*
  DEL: 'Supprimer', //*
  NOTIFICATION: 'Notification', //*
  CLEAR_NOTIFICATION: 'Effacer la notification', //*
  CONFIRM: 'Oui', //*
  CANCEL: 'Annuler', //*
  ALERT_DEL_HISTORY: 'Effacer cet historique de chat?', //*
  // FriendList
  SET_MARK_NAME: 'Définir le nom de la marque',
  DEL_FRIEND: 'Supprimer un ami',
  ALERT_DEL_FRIEND: "Supprimer l'ami ainsi que l'historique du chat?",
  TEXT_CONTENT: 'Contenu textuel',
  INPUT_MARK_NAME: 'Veuillez saisir le nom de la marque',
  INPUT_INVALID: 'Entrée non valide, veuillez saisir à nouveau',
  // InformMessage
  TITLE_NOTIFICATION: 'Notification',
  FRIEND_RESPOND: "Acceptez cette demande d'ami?",
  // CreateGroupChat
  CONFIRM2: 'OK',
  TITLE_CHOOSE_FRIEND: 'Choisissez un ami',
  TOAST_CHOOSE_2: 'Ajouter plus de 2 amis pour discuter en groupe',
  NO_FRIEND: "Oups, pas encore d'ami",
  // AddFriend
  ADD_FRIEND_PLACEHOLDER: 'Email / Pseudo',
  SEARCHING: 'Recherche...',
  SEARCH: 'CHERCHER',
  ADD_SELF: 'Impossible de vous ajouter comme ami',
  ADD_AS_FRIEND: 'Ajoutez le/la comme ami(e)?',
  // FriendGroup
  LOADING: 'Chargement...',
  DEL_GROUP: 'Supprimer le groupe',
  DEL_GROUP_CONFIRM: "Souhaitez-vous effacer l'historique des discussions et quitter ce groupe?",
  DEL_GROUP_CONFIRM2: "Souhaitez-vous effacer l'historique des discussions et dissoudre ce groupe?",
  // Chat
  INPUT_MESSAGE: "Message d'entrée...",
  SEND: 'Envoyer',
  LOAD_EARLIER: 'Charger les messages précédents',
  IMPORT_DATA: 'Importer des données...',
  IMPORT_SUCCESS: 'Importer avec succès',
  IMPORT_FAIL: 'Importation échouée',
  IMPORT_CONFIRM: 'Voulez-vous importer les données?',
  RECEIVE_CONFIRM: 'Voulez-vous télécharger les données',
  OPENCOWORKFIRST: "Veuillez ouvrir la carte de coworking avant d'importer les données",
  LOCATION_COWORK_NOTIFY: "Impossible d'ouvrir l'emplacement en mode coworking",
  LOCATION_SHARE_NOTIFY: "Impossible d'ouvrir la localisation lors du partage",
  WAIT_DOWNLOADING: 'Veuillez attendre la fin du téléchargement',
  DATA_NOT_FOUND: 'Les données non retrouvées, souhaitez-vous les télécharger à nouveau?',
  LOAD_ORIGIN_PIC: 'Origine de la charge',
  // CustomActions
  MAP: 'Carte',
  TEMPLATE: 'Modèle',
  LOCATION: 'Localisation',
  PICTURE: 'Image',
  LOCATION_FAILED: 'Impossible de localiser',
  // Cowork
  SEND_COWORK_INVITE: "Voulez-vous envoyer l'invitation de coworking?",
  COWORK_INVITATION: 'Invitation de coworking',
  COWORK_MEMBER: 'Membres du Coworking',
  COWORK_IS_END: 'Le coworking est terminé',
  COWORK_JOIN_FAIL: 'Impossible de rejoindre ce coworking maintenant',
  COWORK_UPDATE: 'Mise à jour',
  COWORK_ADD: 'Ajouter',
  COWORK_IGNORE: 'Ignorer',
  NEW_MESSAGE: 'Nouveau message',
  NEW_MESSAGE_SHORT: 'Nouveau',
  UPDATING: 'Mise à jour',
  SELECT_MESSAGE_TO_UPDATE: 'Veuillez sélectionner un message à mettre à jour',
  UPDATE_NOT_EXIST_OBJ: "La géométrie n'existe pas, impossible de faire la mise à jour",
  ADD_DELETE_ERROR: "Impossible d'ajouter la géométrie supprimée",
  DELETE_COWORK_ALERT: 'Voulez-vous supprimer cette invitation de coworking?',
  NO_SUCH_MAP: 'Carte introuvée',
  SELF: 'Moi',
  ONLINECOWORK_DISABLE_ADD: "Impossible d'ajouter lors du coworking en ligne",
  ONLINECOWORK_DISABLE_OPERATION: "Impossible d'effectuer l'opération lors du coworking en ligne",
  // RecommendFriend
  FIND_NONE: 'Impossible de trouver de nouveaux amis parmi vos contacts',
  ALREADY_FRIEND: 'Vous êtes déjà amis',
  PERMISSION_DENIED_CONTACT: 'Veuillez activer iTablet pour afficher les contacts',
  // ManageFriend/Group
  SEND_MESSAGE: 'Envoyer le message',
  SET_MARKNAME: 'Définir un alias',
  SET_GROUPNAME: 'Définir le nom du groupe',
  PUSH_FRIEND_CARD: "Appuyer sur Carte d'ami",
  FRIEND_MAP: "Carte d'amis",
  ADD_BLACKLIST: 'Ajouter à la liste noire',
  DELETE_FRIEND: 'Supprimer un ami',
  LIST_MEMBERS: 'Liste des membres',
  MEMBERS: 'Membres',
  LEAVE_GROUP: 'Quitter le groupe',
  CLEAR_HISTORY: "Effacer l'historique de la discussion",
  DISBAND_GROUP: 'Dissoudre le groupe',
  DELETE_MEMBER: 'Supprimer un membre du groupe',
  ADD_MEMBER: 'Ajouter un membre du groupe',
  COWORK: 'Carte coworking',
  EXIT_COWORK: 'Quitter le Coworking',
  GO_COWORK: 'Coworking',
  ALERT_EXIT_COWORK: 'Voulez-vous fermer la carte de coworking actuelle?',
  SHARE_DATASET: "Partager l'ensemble de données",
  // system text
  SYS_MSG_PIC: '[IMAGE]',
  SYS_MSG_MAP: '[CARTE]',
  SYS_MSG_LAYER: '[COUCHE]',
  SYS_MSG_DATASET: '[Ensemble de données]',
  SYS_MSG_ADD_FRIEND: "Envoyer une demande d'amitié",
  SYS_MSG_REMOVED_FROM_GROUP: 'vous a retiré du groupe',
  SYS_MSG_LEAVE_GROUP: 'a quitté ce groupe',
  SYS_MSG_ETC: '... ',
  SYS_MSG_REMOVE_OUT_GROUP: ' ont enlevé ',
  SYS_MSG_REMOVE_OUT_GROUP2: 'hors groupe',
  SYS_MSG_ADD_INTO_GROUP: ' avoir ajouté ',
  SYS_MSG_ADD_INTO_GROUP2: 'en groupe',
  SYS_NO_SUCH_USER: 'Utilisateur non trouvé',
  SYS_FRIEND_ALREADY_IN_GROUP: 'Amis sélectionnés déjà dans le groupe',
  EXCEED_NAME_LIMIT: 'Le nom doit contenir moins de 40 mots (caractère chinois moins de 20 mots)',
  SYS_MSG_MOD_GROUP_NAME: ' a changé le nom du groupe en ',
  SYS_LOGIN_ON_OTHER_DEVICE: 'Votre compte est connecté sur un autre appareil',
  SYS_MSG_REJ: "L'autre partie ne vous a pas encore ajouté comme ami",
  SYS_FRIEND_REQ_ACCEPT: 'Vous êtes amis maintenant, profitez-en!',
  SYS_INVITE_TO_COWORK: ' vous invite à rejoindre le coworking',
  SYS_MSG_GEO_ADDED: 'Ajouté',
  SYS_MSG_GEO_DELETED: 'Supprimé',
  SYS_MSG_GEO_UPDATED: 'Actualisé',
  SYS_MSG_GEO_ADDED2: '',
  SYS_MSG_GEO_DELETED2: '',
  SYS_MSG_GEO_UPDATED2: '',
  ADDED: 'Ajouté',

  // 创建群组 待翻译
  TASK: 'Task',
  TASK_DISTRIBUTION: '新建任务',
  GROUP_CREATE: '创建群组',
  GROUP_DELETE: '解散群组',
  GROUP_APPLY: '申请入群',
  GROUP_EXIST: '退出群组',
  GROUP_INVITE: '邀请入群',
  GROUP_MEMBER_MANAGE: '成员管理',
  GROUP_MEMBER_DELETE: '删除成员',
  GROUP_RESOURCE: '资源管理',
  GROUP_RESOURCE_UPLOAD: '上传数据',
  GROUP_RESOURCE_DELETE: '删除数据',
  GROUP_MANAGE: '管理',
  GROUP_MEMBER: '成员',
  NAME: '名称',
  GROUP_NAME_PLACEHOLDER: '最多输入20字',
  GROUP_TAG: '标签',
  GROUP_TAG_PLACEHOLDER: '多个标签用逗号分隔，最多不超过6个',
  GROUP_REMARK: '备注',
  GROUP_REMARK_PLACEHOLDER: '最多输入100字',
  RESOURCE_SHARER: '资源共享者',
  CREATOR: '创建者',
  ALL_MEMBER: '所有成员',
  GROUP_TYPE: '类型',
  GROUP_TYPE_PRIVATE: '私有',
  GROUP_TYPE_PRIVATE_INFO: '由创建者邀请用户加入群组',
  GROUP_TYPE_PUBLIC: '共有',
  GROUP_TYPE_PUBLIC_INFO: '可有创建者邀请，或者用户申请加入群组',
  GROUP_TYPE_PUBLIC_CHECK_INFO: '用户申请加入该群组时需要审核',
  CREATE: '创建',
  GROUP_CREATE_SUCCUESS: '创建群组成功',
  GROUP_CREATE_FAILED: '创建群组失败',
  GROUP_TAG_NOT_EMPTY: '群组标签不能为空',
  GROUP_NAME_NOT_EMPTY: '群组名不能为空',
  GROUP_ALREADY_JOINED: '已加入该群组',
  GROUP_APPLY_REASON: '申请原因',
  APPLY: '申请',
  GROUP_APPLY_INFO: '已提交申请',
  GROUP_APPLY_AGREE: '同意申请',
  GROUP_APPLY_REFUSE: '拒绝申请',
  GROUP_APPLY_DISAGREE: '不同意申请',
  GROUP_APPLY_ALREADY_AGREE: '已允许该成员加入',
  GROUP_APPLY_ALREADY_DISAGREE: '已拒绝该成员加入',
  GROUP_SELECT_MEMBER: '请选择成员',
  GROUP_APPLY_TITLE: '申请加入群组',
  GROUP_APPLY_ALRADY_TITLE: '你的群组申请已经审核',
  APPLICANT: '申请人',
  APPLY_REASON: '申请原因',
  APPLY_TIME: '申请时间',
  GROUP_NAME: '群组名称',
  CHECK_RESULT: '审核结果',
  CHECK_TIME: '审核时间',
  INVITE: '邀请',
  INVITE_REASON: '邀请原因',
  INVITE_SUCCESS: '发送邀请成功',
  INVITE_FAILED: '发送邀请失败',
  INVITE_SEARCH_PLACEHOLDER: '请输入用户昵称',

  RESOURCE_UPLOAD: '开始上传',
  RESOURCE_UPLOAD_SUCCESS: '上传成功',
  RESOURCE_UPLOAD_FAILED: '上传失败',
  RESOURCE_EXPORT_FAILED: '导出失败',
  RESOURCE_EXPORTING: '导出中',
  RESOURCE_UPLOADING: '上传中',
  RESOURCE_DELETE_INFO: '是否删除被选中的数据',
  RESOURCE_SELECT_MODULE: '请选择模板',
  RESOURCE_DOWNLOAD_INFO: '请下载任务',

  TASK_DOWNLOAD: '下载任务',
  TASK_DOWNLOADING: '下载中',
  TASK_TITLE: '任务名称',
  TASK_CREATOR: '所有者',
  TASK_TYPE: '数据类型',
  TASK_UPDATE_TIME: '更新时间',
  TASK_CREATE_TIME: '创建时间',
  TASK_SEND_TIME: '发送时间',
  TASK_MODULE: '模块',
  // 提示消息
  GROUP_EXIST_INFO: '是否退出群组',
  GROUP_DELETE_INFO: '是否解散群组',
  GROUP_MEMBER_DELETE_INFO: '是否删除被选中的成员',
}
export { Friends }
