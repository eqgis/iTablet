import CN from '../CN'

// 好友
const Friends: typeof CN.Friends = {
  LOCALE: 'en',

  LOGOUT: 'Çevrimiçi hizmete giriş yapın ve arkadaşlarınızla iletişimde kalın',
  MESSAGES: 'Mesajlar',
  FRIENDS: 'Arkadaşlar',
  GROUPS: 'Gruplar',
  ADD_FRIENDS: 'Arkadaş Ekle',
  NEW_GROUP_CHAT: 'Yeni Grup Sohbeti',
  RECOMMEND_FRIEND: 'Arkadaş Ekle',
  SELECT_MODULE: 'Modül Seç',
  SELECT_MAP: 'Harita Seç',
  // Friend
  MSG_SERVICE_FAILED: 'Mesaj servisine bağlanılamadı',
  MSG_SERVICE_NOT_CONNECT: 'Mesaj servisine bağlanılamıyor',
  SEND_SUCCESS: 'Başarıyla gönderildi',
  SEND_FAIL: 'Dosya Gönderilemedi',
  SEND_FAIL_NETWORK: 'Dosya gönderilemedi, lütfen ağınızı kontrol edin',
  RECEIVE_SUCCESS: 'Başarılıyla alındı',
  RECEIVE_FAIL_EXPIRE: 'Alma başarısız, dosyanın süresi dolmuş olabilir',
  RECEIVE_FAIL_NETWORK: 'Alma başarısız, lütfen ağınızı kontrol edin',
  // FriendMessage
  MARK_READ: 'Okundu olarak işaretle',
  MARK_UNREAD: 'Okunmadı olarak işaretle',
  DEL: 'Silme',
  NOTIFICATION: 'Bildirim',
  CLEAR_NOTIFICATION: 'Bildirimleri Temizle',
  CONFIRM: 'Evet',
  CANCEL: 'İptal',
  ALERT_DEL_HISTORY: 'Bu konuşma geçmişini sil?',
  // FriendList
  SET_MARK_NAME: 'İşaret Adı Ayarla',
  DEL_FRIEND: 'Arkadaş Sil',
  ALERT_DEL_FRIEND: 'Arkadaşınızı ve sohbet geçmişinizi silmek istiyor musunuz?',
  TEXT_CONTENT: 'Metin İçeriği',
  INPUT_MARK_NAME: 'Lütfen işaret adını girin',
  INPUT_INVALID: 'Geçersiz giriş, lütfen tekrar giriş yapın',
  // InformMessage
  TITLE_NOTIFICATION: 'Bildirim',
  
  FRIEND_RESPOND: 'Bu arkadaşlık isteğini kabul et?',
  // CreateGroupChat
  CONFIRM2: 'Tamam',
  TITLE_CHOOSE_FRIEND: 'Arkadaş Seç',
  TITLE_CHOOSE_GROUP: 'Grup Seç',
  TITLE_CHOOSE_MEMBER: 'Üye Seç',
  TOAST_CHOOSE_2: 'Grupta sohbet etmek için ikiden fazla arkadaş ekle',
  NO_FRIEND: 'Hay aksi! Henüz arkadaş yok',
  // AddFriend
  ADD_FRIEND_PLACEHOLDER: 'E-posta / Takma İsim',
  SEARCHING: 'Aranıyor...',
  SEARCH: 'Arama',
  ADD_SELF: 'Kendinizi arkadaş olarak ekleyemezsiniz',
  ADD_AS_FRIEND: 'Arkadaş olarak ekle?',
  // FriendGroup
  LOADING: 'Yükleniyor...',
  DEL_GROUP: 'Grubu Sil',
  DEL_GROUP_CONFIRM: 'Sohbet geçmişini silmek ve bu gruptan ayrılmak ister misiniz?',
  DEL_GROUP_CONFIRM2: 'Sohbet geçmişini temizlemek ve bu grubu dağıtmak ister misiniz?',
  // Chat
  INPUT_MESSAGE: 'Giriş mesajı ...',
  SEND: 'Gönder',
  LOAD_EARLIER: 'Önceki mesajları yükle',
  IMPORT_DATA: 'Veriler içe aktarılıyor…',
  IMPORT_SUCCESS: 'İçe aktarma başarılı oldu',
  IMPORT_FAIL: 'İçe aktarma başarısız oldu',
  IMPORT_CONFIRM: 'Verileri içe aktarmak istiyor musunuz?',
  RECEIVE_CONFIRM: 'Verileri indirmek istiyor musunuz?',
  OPENCOWORKFIRST: 'Verileri içe aktarmadan önce lütfen ortak çalışma haritasını açın',
  LOCATION_COWORK_NOTIFY: 'Konum ortak çalışma modunda açılamıyor',
  LOCATION_SHARE_NOTIFY: 'Konum paylaşımda açılamıyor',
  WAIT_DOWNLOADING: 'Lütfen indirme tamamlanana kadar bekleyin',
  DATA_NOT_FOUND: 'Veri bulunamadı, tekrar indirmek ister misiniz?',
  LOAD_ORIGIN_PIC: 'Başlangıcı Yükle',
  UNSUPPORTED_MESSAGE: 'Desteklenmeyen Mesaj',
  // CustomActions
  MAP: 'Harita',
  TEMPLATE: 'Taslak',
  LOCATION: 'Konum',
  PICTURE: 'Resim',
  LOCATION_FAILED: 'Konumlandırma Başarısız',
  // Cowork
  COWORK_MESSAGE: 'Ortak Çalışma Mesajı',
  SEND_COWORK_INVITE: 'İşbirliği daveti mi gönderiyorsun?',
  COWORK_INVITATION: 'İşbirliği davetisi',
  COWORK_MEMBER: 'İşbirliğici',
  COWORK_IS_END: 'İşbirliği bitti',
  COWORK_JOIN_FAIL: 'Geçici olarak katılamadı',
  COWORK_UPDATE: 'Güncelle',
  COWORK_ADD: 'Ekle',
  COWORK_IGNORE: 'ignore',
  NEW_MESSAGE: 'Yeni mesajı',
  NEW_MESSAGE_SHORT: 'Yeni',
  UPDATING: 'Güncelleniyor',
  SELECT_MESSAGE_TO_UPDATE: 'Lütfen işlemek için mesajı seçin',
  UPDATE_NOT_EXIST_OBJ: 'Nesne yok ve güncellenemiyor',
  ADD_DELETE_ERROR: 'Silinmiş öğeyi eklemez',
  DELETE_COWORK_ALERT: 'Bu işbirliği silin mi?',
  NO_SUCH_MAP: 'Hiçbir harita bulunamadı',
  SELF: 'Kendim',
  ONLINECOWORK_DISABLE_ADD: 'Çevrimiçi işbirliğinde eklenemiyorum',
  ONLINECOWORK_DISABLE_OPERATION: 'Çevirimiçi ortak çalışırken işlen yapılamıyor ',
  // RecommendFriend
  FIND_NONE: 'Kişilerinizden yeni arkadaşlar bulunamıyor',
  ALREADY_FRIEND: 'Zaten arkadaşsınız',
  PERMISSION_DENIED_CONTACT: 'Kişileri görüntülemek için lütfen iTablete izin verin',
  // ManageFriend/Group
  SEND_MESSAGE: 'Mesaj gönder',
  SET_MARKNAME: 'Takma İsim Ayarla',
  SET_GROUPNAME: 'Grup adı ayarla',
  PUSH_FRIEND_CARD: 'Arkadaş kartını dene',
  FRIEND_MAP: 'Arkadaş Haritası',
  ADD_BLACKLIST: 'Kara listeye ekle',
  DELETE_FRIEND: 'Arkadaşı sil',
  LIST_MEMBERS: 'Üyeleri listele ',
  MEMBERS: 'Üyeler',
  LEAVE_GROUP: 'Gruptan çık',
  CLEAR_HISTORY: 'Sohbet geçmişini temizle',
  DISBAND_GROUP: 'Grubu dağıt',
  DELETE_MEMBER: 'Grup üyesini çıkar',
  ADD_MEMBER: 'Grup üyesi ekle',
  COWORK: 'Harita ortak çalışması',
  EXIT_COWORK: 'Ortak çalışmadan ayrıl',
  GO_COWORK: 'Ortak çalışma',
  ALERT_EXIT_COWORK: 'Mevcut ortak çalışma haritasını kapatmak istiyor musunuz?',
  SHARE_DATASET: 'Veri kümesini paylaşın',
  // system text
  SYS_MSG_PIC: '[RESİM]',
  SYS_MSG_MAP: '[HARİTA]',
  SYS_MSG_LAYER: '[KATMAN]',
  SYS_MSG_DATASET: '[VERİ KÜMESİ]',
  SYS_MSG_ADD_FRIEND: 'Arkadaşlık isteği gönder',
  SYS_MSG_REMOVED_FROM_GROUP: 'Seni gruptan çıkarttı',
  SYS_MSG_LEAVE_GROUP: 'Bu gruptan ayrıldı',
  SYS_MSG_ETC: '... ',
  SYS_MSG_REMOVE_OUT_GROUP: ' Grup dışı ',
  SYS_MSG_REMOVE_OUT_GROUP2: 'Grup dışı2',
  SYS_MSG_ADD_INTO_GROUP: ' Gruba ekle ',
  SYS_MSG_ADD_INTO_GROUP2: 'Gruba ekle2',
  SYS_NO_SUCH_USER: 'Kullanıcı bulunamadı',
  SYS_FRIEND_ALREADY_IN_GROUP: 'Seçilen arkadaşlar zaten grupta',
  EXCEED_NAME_LIMIT: 'Ad 40 karakteri aşamaz (Çince için 20)',
  SYS_MSG_MOD_GROUP_NAME: ' Grup adını değiştirdi ',
  SYS_LOGIN_ON_OTHER_DEVICE: 'Hesabınız başka bir cihazda oturum açtı',
  SYS_MSG_REJ: 'Karşı taraf seni henüz arkadaş olarak eklemedi',
  SYS_FRIEND_REQ_ACCEPT: 'Artık arkadaşsınız, keyfini çıkar!',
  SYS_INVITE_TO_COWORK: ' Seni işbirliğine davet etti',
  SYS_MSG_GEO_ADDED: '',
  SYS_MSG_GEO_DELETED: '',
  SYS_MSG_GEO_UPDATED: '',
  SYS_MSG_GEO_ADDED2: 'Ekle',
  SYS_MSG_GEO_DELETED2: 'Silindi',
  SYS_MSG_GEO_UPDATED2: 'Güncellendi',
  ADDED: 'Eklendi',

  // 创建群组
  JOIN: 'Katıl',
  VIEW_MORE_MEMBERS: 'Daha Fazla Üye Gör',
  MY_GROUPS: 'Gruplarım',
  JOINED_GROUPS: 'Kayıtlı Gruplar',
  GROUP_MESSAGE: 'Grup Mesajı',
  TASK: 'Görev',
  TASK_DISTRIBUTION: 'Yeni Görev',
  GROUP_CREATE: 'Grup Oluştur',
  GROUP_DELETE: 'Grup Sil',
  GROUP_APPLY: 'Gruba Katıl',
  GROUP_EXIST: 'Gruptan Ayrıl',
  GROUP_INVITE: 'Üye Ekle',
  GROUP_SETTING: 'Grup Ayarları',
  GROUP_MEMBER_MANAGE: 'Üyeleri Yönet',
  GROUP_MEMBER_DELETE: 'Üye Sil',
  GROUP_RESOURCE: 'Kaynak Yönetimi',
  GROUP_RESOURCE_UPLOAD: 'Veri Yükle',
  GROUP_RESOURCE_DELETE: 'Veri Sil',
  GROUP_MANAGE: 'Yönet',
  GROUP_MEMBER: 'Üye',
  NAME: 'Ad',
  GROUP_NAME_PLACEHOLDER: 'Lütfen en fazla 20 karakter giriniz.',
  GROUP_TAG: 'Etiket',
  GROUP_TAG_PLACEHOLDER: 'Her birini virgülle ayıran en fazla 6 etiket',
  GROUP_REMARK: 'Not',
  GROUP_REMARK_PLACEHOLDER: 'Lütfen en fazla 100 karakter girin',
  RESOURCE_SHARER: 'Paylaşıcı',
  CREATOR: 'Oluşturucu',
  ALL_MEMBER: 'Tüm Üyeler',
  GROUP_TYPE: 'Tip',
  GROUP_TYPE_PRIVATE: 'Özel',
  GROUP_TYPE_PRIVATE_INFO: 'Oluşturucu, üyeleri gruba davet ediyor',
  GROUP_TYPE_PUBLIC: 'Herkese Açık',
  GROUP_TYPE_PUBLIC_INFO: 'Oluşturucu, üyeleri gruba davet eder veya üyeler gruba katılmak için başvurabilir.',
  GROUP_TYPE_PUBLIC_CHECK_INFO: 'Oluşturanın yeni uygulamayı denetlemesi gerekiyor.',
  CREATE: 'Oluştur',
  GROUP_CREATE_SUCCUESS: 'Başarıyla grup oluşturuldu',
  GROUP_CREATE_FAILED: 'Grup oluşturulamadı',
  GROUP_TAG_NOT_EMPTY: 'Lütfen grup etiketini girin',
  GROUP_NAME_NOT_EMPTY: 'Lütfen grubu adlandırın',
  GROUP_ALREADY_JOINED: 'Gruba katıldı',
  GROUP_APPLY_REASON: 'Uygulanma Nedeni',
  APPLY: 'Uygula',
  GROUP_APPLY_INFO: 'Uygulandı',
  GROUP_APPLY_AGREE: 'Onay',
  GROUP_APPLY_REFUSE: 'Red',
  GROUP_APPLY_DISAGREE: 'Katılmıyorum',
  GROUP_APPLY_ALREADY_AGREE: 'Katılıyorum',
  GROUP_APPLY_ALREADY_DISAGREE: 'Reddedildi',
  GROUP_APPLY_TO: 'Gruba Uygula',
  GROUP_SELECT_MEMBER: 'Lütfen üye seçin',
  GROUP_APPLY_TITLE: 'Gruba katılmak için başvurun',
  GROUP_APPLY_ALRADY_TITLE: 'Uygulama denetlendi',
  APPLICANT: 'Başvuru sahibi',
  APPLY_REASON: 'Başvuru nedeni',
  APPLY_TIME: 'Başvurulan zaman',
  GROUP_NAME: 'Grup Adı',
  CHECK_RESULT: 'Denetleme Sonucu',
  CHECK_TIME: 'Denetleme Zamanı',
  APPLY_MESSAGE: 'Uygulama Mesajı',
  INVITE: 'Davet',
  INVITE_MESSAGE: 'Davet mesajı',
  INVITE_TO: 'Sizi katılmaya davet ediyor',
  INVITE_REASON: 'Davet nedeni',
  INVITE_SUCCESS: 'Davet başarıyla gönderildi',
  INVITE_FAILED: 'Davet gönderilemedi',
  INVITE_SEARCH_PLACEHOLDER: 'Lütfen takma ad girin',

  RESOURCE_UPLOAD: 'Yükle',
  RESOURCE_UPLOAD_SUCCESS: 'Başarıyla yüklendi',
  RESOURCE_UPLOAD_FAILED: 'Yüklenemedi',
  RESOURCE_EXPORT_FAILED: 'Dışa aktarılamadı',
  RESOURCE_EXPORTING: 'Dışarı Aktarılıyor',
  RESOURCE_UPLOADING: 'Yüklüyor',
  RESOURCE_DELETE_INFO: 'Seçili verileri silmek istediğinizden emin misiniz?',
  RESOURCE_SELECT_MODULE: 'Lütfen bir şablon seçin',
  RESOURCE_DOWNLOAD_INFO: 'Lütfen görevi indirin',

  TASK_DOWNLOAD: 'Görevi indir',
  TASK_DOWNLOADING: 'İndiliyor...',
  TASK_TITLE: 'Ortak Çalışma Görevi',
  TASK_MAP: 'Ortak Çalışma Haritası',
  TASK_CREATOR: 'Oluşturucu',
  TASK_TYPE: 'Veri Tipi',
  TASK_UPDATE_TIME: 'Güncellenme zamanı',
  TASK_CREATE_TIME: 'Oluşturulma zamanı',
  TASK_SEND_TIME: 'Gönderilme zamanı',
  TASK_MODULE: 'Modül',
  // 提示消息
  GROUP_EXIST_INFO: 'Gruptan ayrılmak istiyor musun?',
  GROUP_DELETE_INFO: 'Grubu silmek istiyor musunuz?',
  GROUP_DELETE_INFO2: 'Mevcut grup dağıtıldı.',
  GROUP_MEMBER_DELETE_INFO: 'Seçili üyeyi silmek istiyor musunuz?',
  GROUP_MEMBER_DELETE_INFO2: 'Mevcut gruptan çıkarıldınız.',
  GROUP_TASK_DELETE_INFO: 'Görevleri silmek istiyor musunuz?',

  GROUP_MESSAGE_NULL: 'Mesaj Yok',
  GROUP_DATA_NULL: 'Veri Yok',
  GROUP_TASK_NULL: 'Görev Yok',
  CREATE_FIRST_GROUP_TASK: 'İlk Görevi Oluştur',

  INVITE_CORWORK_MEMBERS: 'Üye davet et',
  DELETE_CORWORK_MEMBERS: 'Üye sil',
  DELETE_CORWORK_TASK: 'Görev sil',

  INVITE_GROUP_MEMBERS: 'Üye daveti',
  INVITE_GROUP_MEMBERS_INFO: 'Üyeler hemen davet edilsin mi?',
  INVITE_GROUP_MEMBERS_ERROR_1: 'Kullanıcı zaten mevcut',
  INVITE_GROUP_MEMBERS_ERROR_2: 'Grup, kullanıcıyı davet etti',
}
export { Friends }
