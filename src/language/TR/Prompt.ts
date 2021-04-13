import CN from '../CN'

// 提示语
const Prompt: typeof CN.Prompt = {
  YES: 'Evet',
  NO: 'Hayır',
  SAVE_TITLE: 'Değişiklikleri mevcut haritaya kaydetmek istiyor musunuz?',
  SAVE_YES: 'Evet',
  SAVE_NO: 'Hayır',
  CANCEL: 'İptal',
  COMMIT: 'Uygula',
  REDO: 'Yeniden yap',
  UNDO: 'Geri al',
  SHARE: 'Paylaş',
  DELETE: 'Sil',
  WECHAT: 'Wechat',
  BEGIN: 'Başla',
  STOP: 'Dur',
  FIELD_TO_PAUSE: 'Durdurma Başarısız',
  WX_NOT_INSTALLED: 'Wechat yüklü değil',
  WX_SHARE_FAILED: 'Wechat yüklemesini kontrol edin',
  RENAME: 'Yeniden adlandır',
  BATCH_DELETE: 'Toplu Sil',
  PREPARING: 'Hazırlamak',

  DOWNLOAD_SAMPLE_DATA: 'Örnek veri indir?',
  DOWNLOAD_DATA: 'Veri İndir',
  DOWNLOAD: 'İndir',
  DOWNLOADING: 'Yükleniyor',
  DOWNLOAD_SUCCESSFULLY: 'Tamamlandı',
  DOWNLOAD_FAILED: 'İndirme Başarısız',
  UNZIPPING: 'Sıçrama',
  ONLINE_DATA_ERROR: 'Ağ verileri bozulmuş ve normal şekilde kullanılamaz',

  NO_REMINDER: 'Hatırlatma Yok',

  LOG_OUT: 'Çıkış yapmak istediğinizden emin misiniz?',
  FAILED_TO_LOG: 'Giriş başarısız',
  INCORRECT_USER_INFO: 'Hesap mevcut değil ya da şifre hatalı',
  INCORRECT_IPORTAL_ADDRESS: 'Giriş Başarısız, lütfen sunucu adresinizi kontrol edin',

  DELETE_STOP: 'Durdurmayı silmek istediğinizden emin misiniz?',
  DELETE_OBJECT: 'Nesneyi silmek istediğinizden emin misiniz?',
  PLEASE_ADD_STOP: 'Lütfen Stop Ekleyin',

  CONFIRM: 'Onayla',
  COMPLETE: 'Tamamla',

  NO_PERMISSION_ALERT: 'İzin Yok',
  EXIT: 'Çıkış',
  REQUEST_PERMISSION: 'İstek',

  OPENING: 'Açılıyor',

  QUIT: 'SuperMap iTabletten çık?',
  MAP_LOADING: 'Yükleniyor',
  LOADING: 'Yükleniyor',
  THE_MAP_IS_OPENED: 'Harita açıldı',
  THE_MAP_IS_NOTEXIST: 'Harita mevcut değil',
  THE_SCENE_IS_OPENED: 'Manzara açıldı',
  NO_SCENE_LIST: 'Veri Yok',
  SWITCHING: 'Değiştiriliyor',
  CLOSING: 'Kapatılıyor',
  CLOSING_3D: 'Kapatılıyor',
  SAVING: 'Kaydediliyor',
  SWITCHING_SUCCESS: 'Geçiş Başarılı',
  ADD_SUCCESS: 'Başarıyla eklendi',
  ADD_FAILED: 'Ekleme Başarısız',
  ADD_MAP_FAILED: 'Mevcut haritaya eklenemez',
  CREATE_THEME_FAILED: 'Tema oluşturma başarısız',
  PLEASE_ADD_DATASET: 'Lütfen verikümesi ekleyin',
  PLEASE_SELECT_OBJECT: 'Lütfen düzenlemek için bir nesne seçin',
  SWITCHING_PLOT_LIB: 'Değiştiriliyor',
  NON_SELECTED_OBJ: 'Seçili nesne yok',
  CHANGE_BASE_MAP: 'Altlık harita boş, lütfen ilk önce değiştirin',
  OVERRIDE_SYMBOL: 'Aynı kimliğe sahip sembol mevcut, lütfen eklemek için yöntem seçin!',
  OVERWRITE: 'Overwrite',
  CHOOSE_DATASET: 'Lütfen veri kümesi seçin',

  PLEASE_SUBMIT_EDIT_GEOMETRY: 'Lütfen Mevcut Geometriyi Gönderin',

  SET_ALL_MAP_VISIBLE: 'Tamamı Görünü',
  SET_ALL_MAP_INVISIBLE: 'Tamamı Görünmez',
  LONG_PRESS_TO_SORT: '(Sıralamak için uzun basın)',

  PUBLIC_MAP: 'Herkese Açık Harita',
  SUPERMAP_FORUM: 'SuperMap Forum',
  SUPERMAP_KNOW: 'SuperMap Know',
  SUPERMAP_GROUP: 'SuperMap Grup',
  INSTRUCTION_MANUAL: 'Kullanım Kılavuzu',
  THE_CURRENT_LAYER: 'Geçerli Katman',
  NO_BASE_MAP: 'Temel harita kaldırılamaz',
  ENTER_KEY_WORDS: 'Lütfen anahtar kelimeleri girin',
  SEARCHING: 'Arıyor',
  SEARCHING_DEVICE_NOT_FOUND: 'hiçbir cihaz bulunamadı',
  READING_DATA: 'Veri Okuyor',
  CREATE_SUCCESSFULLY: 'Başarıyla oluşturuldu',
  SAVE_SUCCESSFULLY: 'Başarıyla Kaydedildi',
  NO_NEED_TO_SAVE: 'Kaydetme gereksiz',
  SAVE_FAILED: 'Kaydetme Başarısız',
  ENABLE_DYNAMIC_PROJECTION: 'Dinamik projeksiyonu etkinleştir?',
  TURN_ON: 'Aç',
  CREATE_FAILED: 'Oluşturma Başarısız',
  INVALID_DATASET_NAME: 'Geçersiz verikümesi adı ya da ad mevcutta kullanılıyor',

  PLEASE_CHOOSE_POINT_LAYER: 'Lütfen Nokta Katmanını Seçiniz',
  PLEASE_CHOOSE_LINE_LAYER: 'Lütfen Çizgi Katmanını Seçiniz',
  PLEASE_CHOOSE_REGION_LAYER: 'Lütfen Alan Katmanını Seçiniz',

  NO_PLOTTING_DEDUCTION: 'Mevcut haritada çizim kesintisi yok',
  NO_FLY: 'Mevcut sahnede uçuş yok',
  PLEASE_OPEN_SCENE: 'Lütfen bir sahne açın',
  NO_SCENE: 'Sahne Yok',
  ADD_ONLINE_SCENE: 'Onliine Sahne Ekle',

  PLEASE_ENTER_TEXT: 'Lütfen metin girin',
  PLEASE_SELECT_THEMATIC_LAYER: 'Lütfen tematik bir katman seçin',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED: 'Geçerli katman stillendirilemez, lütfen başka bir katmanı yeniden seçin',

  PLEASE_SELECT_PLOT_LAYER: 'Lütfen Çizim Katmanı Seçin',
  DONOT_SUPPORT_ARCORE: 'AR (Arttırılmış Gerçeklik) fonksiyonları bu cihazda desteklenmiyor.',
  GET_SUPPORTED_DEVICE_LIST: 'Desteklenen cihaz listesini gör',
  PLEASE_NEW_PLOT_LAYER: 'Lütfen Yeni Çizim Katmanı Oluşturun',
  DOWNLOADING_PLEASE_WAIT: 'İndiriliyor, lütfen bekleyin',
  DOWNLOADING_OTHERS_PLEASE_WAIT: 'Lütfen diğer dosyalar indirilirken bekleyin', 
  SELECT_DELETE_BY_RECTANGLE: 'Lütfen öğeyi dikdörtgen seçerek sili seçin',

  CHOOSE_LAYER: 'Katman Seç',

  COLLECT_SUCCESS: 'Başarıyla Toplandı',

  SELECT_TWO_MEDIAS_AT_LEAST: 'Lütfen en az iki medya seçin',
  DELETE_OBJ_WITHOUT_MEDIA_TIPS: 'This object has no media files. Do you want to delete it?', // need to translate

  NETWORK_REQUEST_FAILED: 'Ağ İsteği Başarısız',

  SAVEING: 'Kaydediyor',
  CREATING: 'Oluşturuyor',
  PLEASE_ADD_DATASOURCE: 'Lütfen bir verikaynağı ekleyin',
  NO_ATTRIBUTES: 'Öznitelik yok',
  NO_SEARCH_RESULTS: 'Arama sonucu yok',

  READING_TEMPLATE: 'Taslak okunuyor',
  SWITCHED_TEMPLATE: 'Değiştirilmiş Taslak',
  THE_CURRENT_SELECTION: 'Geçerli seçim ',
  THE_LAYER_DOES_NOT_EXIST: 'Lağıt mevcut değil',

  IMPORTING_DATA: 'Veriyi içeri aktarıyor',
  DATA_BEING_IMPORT: 'Veri içe aktarılıyor',
  IMPORTING: 'Aktarılıyor',
  IMPORTED_SUCCESS: 'Başarıyla içeri aktarıldı',
  FAILED_TO_IMPORT: 'İçeri aktarma başarısız',
  IMPORTED_3D_SUCCESS: 'Başarıyla içeri aktarıldı',
  FAILED_TO_IMPORT_3D: 'İçeri aktarma başarısız',
  DELETING_DATA: 'Servisi siliyor',
  DELETING_SERVICE: 'Başarıyla silindi',
  DELETED_SUCCESS: 'Silme başarısız',
  FAILED_TO_DELETE: 'Veriyi siliyor',
  PUBLISHING: 'Yayınlanıyor',
  PUBLISH_SUCCESS: 'Başarıyla yayınlandı',
  PUBLISH_FAILED: 'Yayınlama Başarısız',
  DELETE_CONFIRM: 'Öğeyi silmek istediğinizden emin misiniz?',
  BATCH_DELETE_CONFIRM: 'Seçili öğe(ler)i silmek istediğinizden emin misiniz?',

  SELECT_AT_LEAST_ONE: 'En az bir öğe seçin',
  DELETE_MAP_RELATE_DATA: 'Aşağıdaki harita(lar) etkilenecek, devam et?',

  LOG_IN: 'Yükleniyor',
  ENTER_MAP_NAME: 'Lütfen harita adı girin',
  CLIP_ENTER_MAP_NAME: 'Harita adı girin',
  ENTER_SERVICE_ADDRESS: 'Lütfen Servis Adresi girin',
  ENTER_ANIMATION_NAME: 'Lütfen animasyon adını girin',
  ENTER_ANIMATION_NODE_NAME: 'Lütfen animasyon node adını girin',
  PLEASE_SELECT_PLOT_SYMBOL: 'Lütfen çizim sembolü seçin',

  ENTER_NAME: 'Lütfen adı girin',
  ENTER_CAPTION: 'Lütfen başlık girin', 
  CHOICE_TYPE: 'Lütfen türü seçin', 
  INPUT_LENGTH: 'Lütfen maksimum uzunluğu girin', 
  DEFAULT_VALUE_EROROR: 'Varsayılan değer giriş hatası', 
  SELECT_REQUIRED: 'Lütfen gerekli olanları seçin', 

  CLIPPING: 'Kırpılıyor',
  CLIPPED_SUCCESS: 'Başarıyla Kırpıldı',
  CLIP_FAILED: 'Kırpılma başarısız',

  LAYER_CANNOT_CREATE_THEMATIC_MAP: 'Mevcut katman tematik bir harita oluşturmak için kullanılamaz.',

  ANALYSING: 'Analiz ediliyor',
  CHOOSE_STARTING_POINT: 'Başlangıç noktası seç',
  CHOOSE_DESTINATION: 'Hedef Seçin',

  LATEST: 'En son: ',
  GEOGRAPHIC_COORDINATE_SYSTEM: 'Coğrafi Koordinat Sistemi: ',
  PROJECTED_COORDINATE_SYSTEM: 'Öngörülen (Projected) Koordinat Sistemi: ',
  FIELD_TYPE: 'Alan Tipi: ',

  PLEASE_LOGIN_AND_SHARE: 'Lütfen giriş yap ve paylaş',
  PLEASE_LOGIN: 'Lütfen giriş',
  SHARING: 'Paylaşıyor',
  SHARE_SUCCESS: 'Başarıyla Paylaşıldı',
  SHARE_FAILED: 'Paylaşım Başarısız',
  SHARE_PREPARE: 'Paylaşım için Hazırlanıyor',
  SHARE_START: 'Paylaşmaya Başla',

  EXPORTING: 'Dışarı Aktarılıyor',
  EXPORT_SUCCESS: 'Başarıyla Dışarı Aktarıldı',
  EXPORT_FAILED: 'Dışa Aktarma Başarısız',
  EXPORT_TO: 'Veri şu konuma dışarı aktarıldı: ',
  REQUIRE_PRJ_1984: 'Verikümesinin PrjCoordSys WGS_1984 olmalıdır',

  UNDO_FAILED: 'Geri alma başarısız',
  REDO_FAILED: 'Yeniden yapma başarısız',
  RECOVER_FAILED: 'Kurtarma başarısız',

  SETTING_SUCCESS: 'Başarıyla ayarlandı',
  SETTING_FAILED: 'Ayarlama başarısız',
  NETWORK_ERROR: 'Ağ Hatası',
  NO_NETWORK: 'İnternet bağlantısı yok',
  CHOOSE_CLASSIFY_MODEL: 'Sınıflandırma Modeli Seç',
  USED_IMMEDIATELY: 'Hemen Kullanıldı',
  USING: 'Using',
  DEFAULT_MODEL: 'Varsayılan Model',
  DUSTBIN_MODEL: 'Çöpkovası Modeli',
  PLANT_MODEL: 'Plant Modeli',
  CHANGING: 'Değiştiriliyor',
  CHANGE_SUCCESS: 'Değişme Başarılı',
  CHANGE_FAULT: 'Değişme Hatası',
  DETECT_DUSTBIN_MODEL: 'Çöpkovası Modeli',
  ROAD_MODEL: 'Yol Modeli',

  LICENSE_EXPIRED: 'Deneme lisansının süresi doldu. Deneme sürümüne devam etmek istiyor musunuz?',
  APPLY_LICENSE: 'Lisansa Başvur',
  APPLY_LICENSE_FIRST: 'Lütfen önce geçerli bir lisansa başvurun',

  GET_LAYER_GROUP_FAILD: 'Katman grubunu alma başarısız',
  TYR_AGAIN_LATER: 'Lütfen daha sonra tekrar deneyiniz',

  LOCATING: 'Konumluyor',
  CANNOT_LOCATION: 'Konumlama başarısız',
  INDEX_OUT_OF_BOUNDS: 'Sınır dışı dizin',
  PLEASE_SELECT_LICATION_INFORMATION: 'Lütfen Konum belirleyin.',
  OUT_OF_MAP_BOUNDS: 'Harita sınırları dışında',
  CANT_USE_TRACK_TO_INCREMENT_ROAD: 'Geçerli konum harita sınırları dışında, bu yüzden yolu artırmak için izlemeyi kullanamazsınız',
  AFTER_COLLECT: 'Lütfen görüntülemeden önce toplayın',

  POI: 'POI',

  ILLEGAL_DATA: 'Yasadışı Veri',

  UNSUPPORTED_LAYER_TO_SHARE: 'Bu katmanın paylaşımı henüz desteklenmiyor',
  SELECT_DATASET_TO_SHARE: 'Lütfen paylaşmak için verikümesi seçin',
  ENTER_DATA_NAME: 'Lütfen veri adı girin',
  SHARED_DATA_10M: ' 10MB üstü veri paylaşılamaz',

  PHIONE_HAS_BEEN_REGISTERED: 'Cep telefonu numarası kayıtlı',
  NICKNAME_IS_EXISTS: 'Kullanıcı adı kullanımda',
  VERIFICATION_CODE_ERROR: 'Onaylama Kodu yanlış ya da geçersiz',
  VERIFICATION_CODE_SENT: 'Onaylama kodu gönderildi.',
  EMAIL_HAS_BEEN_REGISTERED: 'E-posta kayıt edildi',
  REGISTERING: 'Kaydediyor',
  REGIST_SUCCESS: 'Başarıyla kaydedildi',
  REGIST_FAILED: 'Kayıt Başarısız',
  GOTO_ACTIVATE: 'Lütfen deneme lisansını mail kutusuna indirin',
  ENTER_CORRECT_MOBILE: 'Lütfen geçerli bir cep telefonu numarası girin',
  ENTER_CORRECT_EMAIL: 'Lütfen geçerli bir e-posta adresi girin',

  // 设置菜单提示信息
  ROTATION_ANGLE_ERROR: 'Dönme açısı -360 ° ile 360 ° arasında olmalıdır',
  MAP_SCALE_ERROR: 'Giriş hatası! Lütfen bir numara girin',
  VIEW_BOUNDS_ERROR: 'Aralık hatası! Lütfen bir numara girin',
  VIEW_BOUNDS_RANGE_ERROR: 'Parametre hatası! Görüşün hem yüksekliği hem de genişliği sıfırdan büyük olmalıdır',
  MAP_CENTER_ERROR: 'Koordinat hatası! Hem X hem de Y sayı olmalıdır',
  COPY_SUCCESS: 'Kopyalama Başarılı!',
  // 复制坐标系
  COPY_COORD_SYSTEM_SUCCESS: 'Koordinat sistemi çoğaltması başarılı',
  COPY_COORD_SYSTEM_FAIL: 'Koordinat sistemi çoğaltması başarısız',
  ILLEGAL_COORDSYS: 'Desteklenen bir koordinat sistemi dosyası değil',

  TRANSFER_PARAMS: 'Parametre hatası, Lütfen bir numara girin',
  PLEASE_ENTER: 'Lütfen girin ',

  REQUEST_TIMEOUT: 'İstek zamanaşımı',

  IMAGE_RECOGNITION_ING: 'Yükleniyor',
  IMAGE_RECOGNITION_FAILED: 'Görüntü tanıma başarısız',

  ERROR_INFO_INVALID_URL: 'Geçersiz URL',
  ERROR_INFO_NOT_A_NUMBER: 'Bu bir sayı değil',
  ERROR_INFO_START_WITH_A_LETTER: 'Ad yalnızca bir harfle başlayabilir',
  ERROR_INFO_ILLEGAL_CHARACTERS: 'Ad geçersiz karakter içeremez.',
  ERROR_INFO_EMPTY: 'Ad boş bırakılamaz.',

  OPEN_LOCATION: 'Lütfen Sistem Ayarlarından Konum Servisini açın.',
  REQUEST_LOCATION: 'iTablet işlemi tamamlamak için konum iznine ihtiyaç duyuyor',
  LOCATION_ERROR: 'Konum isteği başarısız, lütfen daha sonra tekrar deneyin',

  OPEN_THRID_PARTY: 'Üçüncü parti bir uygulama açacaksınız. Devam et?',

  FIELD_ILLEGAL: 'Alan geçersiz',
  PLEASE_SELECT_A_RASTER_LAYER: 'Lütfen raster katmanı seçin',

  PLEASE_ADD_DATASOURCE_BY_UNIFORM: 'Lütfen verikaynağını katmana göre ekleyin',
  CURRENT_LAYER_DOSE_NOT_SUPPORT_MODIFICATION: 'Mevcut katman modifikasyonu desteklemiyor',

  FAILED_TO_CREATE_POINT: 'Nokta oluşturma başarısız',
  FAILED_TO_CREATE_TEXT: 'Metin oluşturma başarısız',
  FAILED_TO_CREATE_LINE: 'Çizgi oluşturma başarısız',
  FAILED_TO_CREATE_REGION: 'Poligon oluşturma başarısız',
  CLEAR_HISTORY: 'Geçmişi temizle',
  // 导航相关
  SEARCH_AROUND: 'Etrafında ara',
  GO_HERE: 'Buraya git',
  SHOW_MORE_RESULT: 'Daha fazla sonuç göster',
  PLEASE_SET_BASEMAP_VISIBLE: 'Lütfen altlık haritayı görünür yapın',
  NO_NETWORK_DATASETS: 'Mevcut çalışma alanı ağ verikümesi içermiyor',
  NO_LINE_DATASETS: 'Mevcut çalışma alanı çizgi verikümesi içermiyor',
  NETWORK_DATASET_IS_NOT_AVAILABLE: 'Mevcut ağ verikümesi uygun değil',
  POINT_NOT_IN_BOUNDS: 'Seçili ağ verikümesinin sınırları nokta içermiyor',
  POSITION_OUT_OF_MAP: 'Konumunuz harita sınırları dışında, lütfen navigasyonu simüle edin.',
  SELECT_DATASOURCE_FOR_NAVIGATION: 'Navigasyon için veri seçin',
  PLEASE_SELECT_NETWORKDATASET: 'Lütfen önce ağ verikümesi seçin',
  PLEASE_SELECT_A_POINT_INDOOR: 'Lütfen iç mekan noktasını seçin',
  PATH_ANALYSIS_FAILED: 'Yol analizi başarısız oldu, lütfen başlangıç ve bitiş noktalarını tekrar seçin',
  ROAD_NETWORK_UNLINK: 'Bağlantısı kesilen yol ağı nedeniyle yol analizi başlangıç noktasından bitiş noktasına kadar başarısız oldu',
  CHANGE_TO_OUTDOOR: 'Dış mekana geçilsin mi?',
  CHANGE_TO_INDOOR: 'Evin içinde geçilsin mi?',
  SET_START_AND_END_POINTS: 'Lütfen ilk önce başlangıç ve bitiş noktalarını ayarlayın',
  SELECT_LAYER_NEED_INCREMENTED: 'Lütfen arttırılması gereken katmanı seçin',
  SELECT_THE_FLOOR: 'Lütfen katmanın konumlandığı katı seçin',
  LONG_PRESS_ADD_START: 'Lütfen başlangıç noktası eklemek için uzun basın',
  LONG_PRESS_ADD_END: 'Lütfen hedef eklemek için uzun basın',
  ROUTE_ANALYSING: 'Analiz yapılıyor',
  DISTANCE_ERROR: 'Hedef başlangıç noktasına çok yakın, lütfen yeniden seçin!',
  USE_ONLINE_ROUTE_ANALYST: 'Noktalar verikümesi sınırlarının dışında ya da noktalar çevresinde verikümesi yok. Çevrimiçi rota analisti kullanmak ister misiniz?',
  NOT_SUPPORT_ONLINE_NAVIGATION: 'Çevrimiçi navigasyon henüz desteklenmiyor.',
  CREATE: 'Yeni',
  NO_DATASOURCE: 'Geçerli çalışma alanında veri kaynağı yok, lütfen önce yeni bir veri kaynağı oluşturun',
  FLOOR: 'Kat',
  AR_NAVIGATION: 'AR Navi',
  ARRIVE_DESTINATION: 'Arrived the destination',
  DEVIATE_NAV_PATH: 'Deviated from the navigation path',

  //导航增量路网
  SELECT_LINE_DATASET: 'Lütfen önce bir çizgi veri kümesi seçin',
  CANT_UNDO: 'Geri alınamaz',
  CANT_REDO: "Yeniden yapılamaz",
  DATASET_RENAME_FAILED: 'Veri kümesi adı yalnızca harf, rakam ve "_", "@", "#" içerebilir',
  SWITCH_LINE: 'Veri kümesini değiştir',
  HAS_NO_ROADNAME_FIELD_DATA: 'Yol adı alanı bilgisi olmayan veri kümesi',
  MERGE_SUCCESS: 'Başarıyla birleştirildi',
  MERGE_FAILD: 'Birleştirme başarısız oldu',
  NOT_SUPPORT_PRJCOORDSYS: 'Aşağıdaki veri setinin koordinat sistemi birleştirmeyi desteklemiyor',
  MERGEING: 'Birleştir',
  NEW_NAV_DATA: 'Navigasyon Verileri Oluşturun',
  INPUT_MODEL_FILE_NAME: 'Lütfen bir model dosya adı girin',
  SELECT_DESTINATION_DATASOURCE: 'Lütfen hedef veri kaynağını seçin',
  FILENAME_ALREADY_EXIST: 'Dosya zaten mevcut, lütfen dosya adını yeniden girin',
  NETWORK_BUILDING: 'Uygulanıyor...',
  BUILD_SUCCESS: 'Başarıyla uygulandı',
  SELECT_LINE_SMOOTH: 'Lütfen düzeltilmesi gereken çizgiyi seçin',
  SELECT_A_POINT_INLINE: 'Lütfen bir çevrimiçi nokta seçin',
  LINE_DATASET: 'Çizgi Verikümesi',
  DESTINATION_DATASOURCE: 'Hedef Veri Kaynağı',
  SMOOTH_FACTOR: 'Lütfen düzeltme faktörünü girin',
  SELECT_EXTEND_LINE: 'Lütfen uzatılması gereken çizgiyi seçin',
  SELECT_SECOND_LINE: 'Lütfen ikinci çizgiyi seçin',
  SELECT_TRIM_LINE: 'Lütfen kırpılacak çizgiyi seçin',
  SELECT_BASE_LINE: 'Lütfen bir temel çizgi seçin',
  SELECT_RESAMPLE_LINE: 'Lütfen yeniden örneklenmesi gereken çizgiyi seçin',
  SELECT_CHANGE_DIRECTION_LINE: 'Lütfen yön değiştirmesi gereken çizgiyi seçin',
  EDIT_SUCCESS: 'Başarılı işlem',
  EDIT_FAILED: 'İşlem başarısız',
  SMOOTH_NUMBER_NEED_BIGGER_THAN_2: 'Düzeltme katsayısı 2 ~ 10 tam sayı olmalıdır',
  CONFIRM_EXIT: 'Çıkmak istediğinizden emin misin?',
  TOPO_EDIT_END: 'Düzenlemeyi bitirip çıkmak istediğinizden emin misiniz?',
  // 自定义专题图
  ONLY_INTEGER: 'Yalnızca tamsayılar girilebilir!',
  ONLY_INTEGER_GREATER_THAN_2: "Yalnızca 2'den büyük tamsayılar girilebilir!",
  PARAMS_ERROR: 'Parametre hatası, ayar başarısız!',

  SPEECH_TIP: "Aşağıdakileri seçebilirsiniz: \n'Yaklaş'，'Uzaklaş'，'Yerleştir'，'Kapat',\n 'Ara' ya da herhangi bir Adres",
  SPEECH_ERROR: 'Tanımlı hata, lütfen daha sonra tekrar deneyiniz',
  SPEECH_NONE: 'Hiçbir şey konuşmadınız gibi görünüyor',

  NOT_SUPPORT_STATISTIC: 'Alan, istatistiği desteklemiyor',
  ATTRIBUTE_DELETE_CONFIRM: 'Bu öznitelik alanı silinsin mi?',
  ATTRIBUTE_DELETE_TIPS: 'Silme özelliğinden sonra kurtarılamaz',
  ATTRIBUTE_DELETE_SUCCESS: 'Öznitelik Alanı Silme Başarılı',
  ATTRIBUTE_DELETE_FAILED: 'Öznitelik Alanı Silme Başarısız',
  ATTRIBUTE_ADD_SUCCESS: 'Öznitelik Ekleme Başarılı',
  ATTRIBUTE_ADD_FAILED: 'Öznitelik Ekleme Başarısız',
  ATTRIBUTE_DEFAULT_VALUE_IS_NULL: 'Varsayılan değer boş',

  CANNOT_COLLECT_IN_THEMATIC_LAYERS: 'Tematik düzeyler toplanamaz',
  CANNOT_COLLECT_IN_CAD_LAYERS: 'CAD katmanlarında toplanamaz',
  CANNOT_COLLECT_IN_TEXT_LAYERS: 'Metin katmanlarında toplanamaz',
  HEAT_MAP_DATASET_TYPE_ERROR: 'Sadece nokta veri setleri oluşturulabilir',

  INVALID_DATA_SET_FAILED: 'Geçersiz veri türü. Ayarlama başarısız!',

  INVISIBLE_LAYER_CAN_NOT_BE_SET_CURRENT: 'Katman görünemez ve geçerli katmana ayarlanamaz',
  //三维AR管线相关
  FILE_NOT_EXISTS: 'Veri yok, lütfen örnek verilerini indirin',
  MOVE_PHONE_ADD_SCENE: 'Please move phone slowly,identify the plane click on the screen to add scene',
  IDENTIFY_TIMEOUT: 'İzleme görüntüsü zaman aşımı, tekrar denemek ister misiniz?',
  TRACKING_LOADING: 'İzleniyor...',

  // 专题制图加载/输出xml
  SUCCESS: 'Başarılı işlem',
  FAILED: 'Başarısız işlem',
  NO_TEMPLATE: 'Kullanılabilir şablon yok',
  CONFIRM_LOAD_TEMPLATE: 'Şablonu yükleyeceğinizden emin misiniz?',
  CONFIRM_OUTPUT_TEMPLATE: 'Haritanın çıktısını alacağınızdan emin misiniz?',
}

export { Prompt }
