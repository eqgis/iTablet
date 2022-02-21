import CN from "../CN"

// 好友
const Friends: typeof CN.Friends = {
  LOCALE: "en",

  LOGOUT: "Connectez-vous au service en ligne et restez en contact avec vos amis",
  MESSAGES: "Messages",
  FRIENDS: "Amis",
  GROUPS: "Groupes",
  ADD_FRIENDS: "Ajouter des amis",
  NEW_GROUP_CHAT: "Nouveau groupe de chat",
  RECOMMEND_FRIEND: "Recommander des amis",
  SELECT_MODULE: "Sélectionnez le module",
  SELECT_MAP: "Sélectionnez la carte",
  PUBLIC_FRIENDS: "Amis publics",
  // Friend
  MSG_SERVICE_FAILED: "Échec de la connexion au service de messagerie",
  MSG_SERVICE_NOT_CONNECT: "Impossible de se connecter au service de messagerie",
  SEND_SUCCESS: "Envoyer avec succès",
  SEND_FAIL: "Échec de l'envoi du fichier",
  SEND_FAIL_NETWORK: "Échec de l'envoi du fichier, veuillez vérifier votre réseau",
  RECEIVE_SUCCESS: "Reçu avec succès",
  RECEIVE_FAIL_EXPIRE: "La réception a échoué, le fichier a peut-être expiré",
  RECEIVE_FAIL_NETWORK: "Échec de la réception, veuillez vérifier votre réseau",
  // FriendMessage
  MARK_READ: "Marquer comme lu",
  MARK_UNREAD: "Marquer comme non lu",
  DEL: "Supprimer",
  NOTIFICATION: "Notification",
  CLEAR_NOTIFICATION: "Effacer la notification",
  CONFIRM: "Oui",
  CANCEL: "Annuler",
  ALERT_DEL_HISTORY: "Effacer cet historique de chat?",
  // FriendList
  SET_MARK_NAME: "Définir le nom de la marque",
  DEL_FRIEND: "Supprimer un ami",
  ALERT_DEL_FRIEND: "Supprimer l'ami ainsi que l'historique du chat?",
  TEXT_CONTENT: "Contenu textuel",
  INPUT_MARK_NAME: "Veuillez saisir le nom de la marque",
  INPUT_INVALID: "Entrée non valide, veuillez saisir à nouveau",
  // InformMessage
  TITLE_NOTIFICATION: "Notification",
  FRIEND_RESPOND: "Acceptez cette demande d'ami?",
  // CreateGroupChat
  CONFIRM2: "OK",
  TITLE_CHOOSE_FRIEND: "Choisissez un ami",
  TITLE_CHOOSE_GROUP: "Choisissez un groupe",
  TITLE_CHOOSE_MEMBER: "Choisissez un membre",
  TOAST_CHOOSE_2: "Ajouter plus de 2 amis pour discuter en groupe",
  NO_FRIEND: "Oups, pas encore d'ami",
  // AddFriend
  ADD_FRIEND_PLACEHOLDER: "Email / Pseudo",
  SEARCHING: "Recherche...",
  SEARCH: "CHERCHER",
  ADD_SELF: "Impossible de vous ajouter comme ami",
  ADD_AS_FRIEND: "Ajoutez le/la comme ami(e)?",
  // FriendGroup
  LOADING: "Chargement...",
  DEL_GROUP: "Supprimer le groupe",
  DEL_GROUP_CONFIRM: "Souhaitez-vous effacer l'historique des discussions et quitter ce groupe?",
  DEL_GROUP_CONFIRM2: "Souhaitez-vous effacer l'historique des discussions et dissoudre ce groupe?",
  // Chat
  INPUT_MESSAGE: "Message d'entrée...",
  SEND: "Envoyer",
  LOAD_EARLIER: "Charger les messages précédents",
  IMPORT_DATA: "Importer des données...",
  IMPORT_SUCCESS: "Importer avec succès",
  IMPORT_FAIL: "Importation échouée",
  IMPORT_CONFIRM: "Voulez-vous importer les données?",
  RECEIVE_CONFIRM: "Voulez-vous télécharger les données",
  OPENCOWORKFIRST: "Veuillez ouvrir la carte de coworking avant d'importer les données",
  LOCATION_COWORK_NOTIFY: "Impossible d'ouvrir l'emplacement en mode coworking",
  LOCATION_SHARE_NOTIFY: "Impossible d'ouvrir la localisation lors du partage",
  WAIT_DOWNLOADING: "Veuillez attendre la fin du téléchargement",
  DATA_NOT_FOUND: "Les données non retrouvées, souhaitez-vous les télécharger à nouveau?",
  LOAD_ORIGIN_PIC: "Origine de la charge",
  UNSUPPORTED_MESSAGE: "Message non pris en charge",
  // CustomActions
  MAP: "Carte",
  TEMPLATE: "Modèle",
  LOCATION: "Localisation",
  PICTURE: "Image",
  LOCATION_FAILED: "Impossible de localiser",
  // Cowork
  COWORK_MESSAGE: "Message de coworking",
  SEND_COWORK_INVITE: "Voulez-vous envoyer l'invitation de coworking?",
  COWORK_INVITATION: "Invitation de coworking",
  COWORK_MEMBER: "Membres du Coworking",
  COWORK_IS_END: "Le coworking est terminé",
  COWORK_JOIN_FAIL: "Impossible de rejoindre ce coworking maintenant",
  COWORK_UPDATE: "Mise à jour",
  COWORK_ADD: "Ajouter",
  COWORK_IGNORE: "Ignorer",
  NEW_MESSAGE: "Nouveau message",
  NEW_MESSAGE_SHORT: "Nouveau",
  UPDATING: "Mise à jour",
  SELECT_MESSAGE_TO_UPDATE: "Veuillez sélectionner un message à mettre à jour",
  UPDATE_NOT_EXIST_OBJ: "La géométrie n'existe pas, impossible de faire la mise à jour",
  ADD_DELETE_ERROR: "Impossible d'ajouter la géométrie supprimée",
  DELETE_COWORK_ALERT: "Voulez-vous supprimer cette invitation de coworking?",
  NO_SUCH_MAP: "Carte introuvée",
  SELF: "Moi",
  ONLINECOWORK_DISABLE_ADD: "Impossible d'ajouter lors du coworking en ligne",
  ONLINECOWORK_DISABLE_OPERATION: "Impossible d'effectuer l'opération lors du coworking en ligne",
  // RecommendFriend
  FIND_NONE: "Impossible de trouver de nouveaux amis parmi vos contacts",
  ALREADY_FRIEND: "Vous êtes déjà amis",
  PERMISSION_DENIED_CONTACT: "Veuillez activer iTablet pour afficher les contacts",
  // ManageFriend/Group
  SEND_MESSAGE: "Envoyer le message",
  SET_MARKNAME: "Définir un alias",
  SET_GROUPNAME: "Définir le nom du groupe",
  PUSH_FRIEND_CARD: "Appuyer sur Carte d'ami",
  FRIEND_MAP: "Carte d'amis",
  ADD_BLACKLIST: "Ajouter à la liste noire",
  DELETE_FRIEND: "Supprimer un ami",
  LIST_MEMBERS: "Liste des membres",
  MEMBERS: "Membres",
  LEAVE_GROUP: "Quitter le groupe",
  CLEAR_HISTORY: "Effacer l'historique de la discussion",
  DISBAND_GROUP: "Dissoudre le groupe",
  DELETE_MEMBER: "Supprimer un membre du groupe",
  ADD_MEMBER: "Ajouter un membre du groupe",
  COWORK: "Carte coworking",
  EXIT_COWORK: "Quitter le Coworking",
  GO_COWORK: "Coworking",
  ALERT_EXIT_COWORK: "Voulez-vous fermer la carte de coworking actuelle?",
  SHARE_DATASET: "Partager l'ensemble de données",
  // system text
  SYS_MSG_PIC: "[IMAGE]",
  SYS_MSG_MAP: "[CARTE]",
  SYS_MSG_LAYER: "[COUCHE]",
  SYS_MSG_DATASET: "[Ensemble de données]",
  SYS_MSG_ADD_FRIEND: "Envoyer une demande d'amitié",
  SYS_MSG_REMOVED_FROM_GROUP: "vous a retiré du groupe",
  SYS_MSG_LEAVE_GROUP: "a quitté ce groupe",
  SYS_MSG_ETC: "... ",
  SYS_MSG_REMOVE_OUT_GROUP: " ont enlevé ",
  SYS_MSG_REMOVE_OUT_GROUP2: "hors groupe",
  SYS_MSG_ADD_INTO_GROUP: " avoir ajouté ",
  SYS_MSG_ADD_INTO_GROUP2: "en groupe",
  SYS_NO_SUCH_USER: "Utilisateur non trouvé",
  SYS_FRIEND_ALREADY_IN_GROUP: "Amis sélectionnés déjà dans le groupe",
  EXCEED_NAME_LIMIT: "Le nom doit contenir moins de 40 mots (caractère chinois moins de 20 mots)",
  SYS_MSG_MOD_GROUP_NAME: " a changé le nom du groupe en ",
  SYS_LOGIN_ON_OTHER_DEVICE: "Votre compte est connecté sur un autre appareil",
  SYS_MSG_REJ: "L'autre partie ne vous a pas encore ajouté comme ami",
  SYS_FRIEND_REQ_ACCEPT: "Vous êtes amis maintenant, profitez-en!",
  SYS_INVITE_TO_COWORK: " vous invite à rejoindre le coworking",
  SYS_MSG_GEO_ADDED: "Ajouté",
  SYS_MSG_GEO_DELETED: "Supprimé",
  SYS_MSG_GEO_UPDATED: "Actualisé",
  SYS_MSG_GEO_ADDED2: "",
  SYS_MSG_GEO_DELETED2: "",
  SYS_MSG_GEO_UPDATED2: "",
  ADDED: "Ajouté",

  // 创建群组
  JOIN: "Rejoindre",
  VIEW_MORE_MEMBERS: "Voir plus de membres",
  MY_GROUPS: "Mes groupes",
  JOINED_GROUPS: "Groupes rejoints",
  GROUP_MESSAGE: "Message de groupe",
  TASK: "Tâche",
  TASK_DISTRIBUTION: "Nouvelle tâche",
  GROUP_CREATE: "Créer un groupe",
  GROUP_DELETE: "Supprimer le groupe",
  GROUP_APPLY: "Rejoindre le groupe",
  GROUP_EXIST: "Quitter le groupe",
  GROUP_INVITE: "Ajouter un membre",
  GROUP_SETTING: "Réglage du groupe",
  GROUP_MEMBER_MANAGE: "Gérer les membres",
  GROUP_MEMBER_DELETE: "Supprimer le membre",
  GROUP_RESOURCE: "Gérer les ressources",
  GROUP_RESOURCE_UPLOAD: "Télécharger des données",
  GROUP_RESOURCE_DELETE: "Suprimmer les données",
  GROUP_MANAGE: "Gérer",
  GROUP_MEMBER: "Membre",
  NAME: "Nom",
  GROUP_NAME_PLACEHOLDER: "Veuillez saisir au maximum 20 caractères",
  GROUP_TAG: "Balises",
  GROUP_TAG_PLACEHOLDER: "6 balises au maximum séparées chacune par une virgule",
  GROUP_REMARK: "Note",
  GROUP_REMARK_PLACEHOLDER: "Veuillez saisir au maximum 100 caractères",
  RESOURCE_SHARER: "Partageur",
  CREATOR: "Créateur",
  ALL_MEMBER: "Tous les membres",
  GROUP_TYPE: "Type",
  GROUP_TYPE_PRIVATE: "Privé",
  GROUP_TYPE_PRIVATE_INFO: "Le créateur invite des membres dans le groupe",
  GROUP_TYPE_PUBLIC: "Public",
  GROUP_TYPE_PUBLIC_INFO: "Le créateur invite des membres dans le groupe. Ou les membres peuvent demander à rejoindre le groupe.",
  GROUP_TYPE_PUBLIC_CHECK_INFO: "Le créateur doit auditer la nouvelle application",
  CREATE: "Créer",
  GROUP_CREATE_SUCCUESS: "Création du groupe réussie",
  GROUP_CREATE_FAILED: "Échec de la création du groupe",
  GROUP_TAG_NOT_EMPTY: "Veuillez saisir le libellé du groupe",
  GROUP_NAME_NOT_EMPTY: "Veuillez nommer le groupe",
  GROUP_ALREADY_JOINED: "a rejoint le groupe",
  GROUP_APPLY_REASON: "Raison appliquée",
  APPLY: "Appliquer",
  GROUP_APPLY_INFO: "Appliqué",
  GROUP_APPLY_AGREE: "Accepter",
  GROUP_APPLY_REFUSE: "Refuser",
  GROUP_APPLY_DISAGREE: "Pas D'accord",
  GROUP_APPLY_ALREADY_AGREE: "Accepté",
  GROUP_APPLY_ALREADY_DISAGREE: "Refusé",
  GROUP_APPLY_TO: "Appliquer au groupe",
  GROUP_SELECT_MEMBER: "Veuillez sélectionner les membres",
  GROUP_APPLY_TITLE: "Postuler pour rejoindre le groupe",
  GROUP_APPLY_ALRADY_TITLE: "L'application a été auditée",
  APPLICANT: "Demandeur",
  APPLY_REASON: "Raison d'application",
  APPLY_TIME: "Temps d'application",
  GROUP_NAME: "Nom du groupe",
  CHECK_RESULT: "Résultat de l'audit",
  CHECK_TIME: "Temps d'audite",
  APPLY_MESSAGE: "Message d'application",
  INVITE: "Inviter",
  INVITE_MESSAGE: "Messaged'nvitation",
  INVITE_TO: "Vous invite à rejoindre",
  INVITE_REASON: "Raison d'invitation",
  INVITE_SUCCESS: "Invitation envoyée avec succès",
  INVITE_FAILED: "Échec de d'envoi de l'invitation",
  INVITE_SEARCH_PLACEHOLDER: "Veuillez saisir un pseudo",

  RESOURCE_UPLOAD: "Importer",
  RESOURCE_UPLOAD_SUCCESS: "Importé avec succès",
  RESOURCE_UPLOAD_FAILED: "Échec d'importation",
  RESOURCE_EXPORT_FAILED: "Échec de l'exportation",
  RESOURCE_EXPORTING: "Exportation",
  RESOURCE_UPLOADING: "Importation",
  RESOURCE_DELETE_INFO: "Êtes-vous sûr de vouloir supprimer les données sélectionnées",
  RESOURCE_SELECT_MODULE: "Veuillez sélectionner un modèle",
  RESOURCE_DOWNLOAD_INFO: "Veuillez télécharger la tâche",
  RESOURCE_NOT_EXIST: "La ressource n\"existe pas",

  TASK_DOWNLOAD: "Télécharger la tâche",
  TASK_DOWNLOADING: "Téléchargement",
  TASK_TITLE: "Tâche de coworking",
  TASK_MAP: "Carte de coworking",
  TASK_CREATOR: "Créateur",
  TASK_TYPE: "Type de données",
  TASK_UPDATE_TIME: "Heure mise à jour",
  TASK_CREATE_TIME: "Heure de création",
  TASK_SEND_TIME: "Heure d'envoi",
  TASK_MODULE: "Module",
  // 提示消息
  GROUP_EXIST_INFO: "Voulez-vous quitter le groupe",
  GROUP_DELETE_INFO: "Voulez-vous supprimer le groupe",
  GROUP_DELETE_INFO2: "Le groupe actuel a été dissous",
  GROUP_MEMBER_DELETE_INFO: "Voulez-vous supprimer le membre sélectionné",
  GROUP_MEMBER_DELETE_INFO2: "Vous avez été exclu du groupe actuel",
  GROUP_TASK_DELETE_INFO: "Voulez-vous supprimer des tâches?",

  GROUP_MESSAGE_NULL: "Pas de message",
  GROUP_DATA_NULL: "Pas de données",
  GROUP_TASK_NULL: "Pas de tâches",
  CREATE_FIRST_GROUP_TASK: "Créer la première tâche",

  INVITE_CORWORK_MEMBERS: "Inviter des membres",
  DELETE_CORWORK_MEMBERS: "Supprimer des membres",
  DELETE_CORWORK_TASK: "Supprimer la tâche",

  INVITE_GROUP_MEMBERS: "Inviter des membres",
  INVITE_GROUP_MEMBERS_INFO: "Inviter les membres immédiatement?",
  INVITE_GROUP_MEMBERS_ERROR_1: "L'utilisateur existe déjà",
  INVITE_GROUP_MEMBERS_ERROR_2: "Le groupe a invité un utilisateur",

  REPORT: "Rapport",
  SENDING: "Envoi en cours",
  REPORT_SUCCESS: "rapport obtenu",
  PRIVATE_REPORT:"Rapport de lettre privée",

  INAPPROPRIATE: "Publication inappropriée causé par moi",
  ADVERTISING: "Publicité poubelle, vente de contrefacon",
  PORNOGRAPHIC: "vulgarité de la pornographie",
  ILLEGAL: "Crime illégal",
  INFORMATION: "Fausses informatons",
  MINOR:"Liaison mineur",
  SUSPECTED:"Suspecté de fraude",
  EMBEZZLED:"Ce compte peut être détourné",
}
export { Friends }
