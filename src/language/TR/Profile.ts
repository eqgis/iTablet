import CN from '../CN'

// 我的、发现
const Profile: typeof CN.Profile = {
  // 我的  主页面
  LOGIN_NOW: 'Giriş',
  IMPORT: 'İçeri Aktar',
  DATA: 'Veri',
  MARK: 'İşaretle',
  MAP: 'Harita',
  SCENE: 'Manzara',
  BASEMAP: 'Altlık Harita',
  SYMBOL: 'Sembol',
  SETTINGS: 'Ayarlar',
  COLOR_SCHEME: 'Renk Şeması',
  TEMPLATE: 'Taslak',
  AIMODEL: 'AI Modeli',
  COLLECTION_TEMPLATE: 'Ölçme Taslağı',
  PLOTTING_TEMPLATE: 'Çizim Şablonu',
  NAVIGATION: 'Navigasyon',
  INCREMENT: 'Arttırım',
  ENCLOSURE: 'Çevreleme',

  MY_COLOR_SCHEME: 'Renk Şemalarım',
  MY_MODEL: 'Modellerim',

  SELECT_MODEL: 'Model Seç',

   // 我的  提示语
   MY_GUIDE: 'After import data\ncan be opened in the home module',//待翻译
   MY_GUIDE_KNOW:'Know it',//待翻译
   MY_GUIDE_SLIDE: 'Draw up to check',//待翻译
   MY_GUIDE_SLIDE_LAND:'Draw left to check',//待翻译
   EFFECT_GUIDE:'Add effect to scene',//待翻译
   LAUNCH_GUIDE:'Add video,words,picture,web to the scene',//待翻译
   MEASURE_GUIDE:'Measure the distance, height and area',//待翻译
   MY_GUIDE_NEXT:'Next',//待翻译
   MY_GUIDE_SKIP:'Skip',//待翻译
   ANALYST_GUIDE:'Network analysis and vector analysis',//待翻译
   PROCESS_GUIDE:'Registration and projection conversion',//待翻译
   CHOOSE_TYPE:'Choose Launch Type',//待翻译
   CHOOSE_MEASURE_TYPE:'Choose Measure Type',//待翻译
   SELECT_DATASET:'Check to add dataset',//待翻译
   ADD_SELECT_DATASET:'Add Dataset',//待翻译
   MOVE_BROWSING:'"Move left and right" to browse complete information',//待翻译

  // 我的——登录
  LOGIN: 'Giriş',
  LOGINING: 'Logining..',//待翻译
  LOGIN_TIMEOUT: 'Giriş zaman aşımı lütfen daha sonra tekrar deneyin',
  LOGIN_CURRENT: 'Mevcut kullanıcı zaten giriş yaptı',
  LOGIN_INVALID: '’Girişin süresi doldu. Lütfen tekrar giriş yapın',
  MOBILE_LOGIN: '’Mobil Giriş',
  EMAIL_LOGIN: '’E-posta Girişi',
  ENTER_EMAIL_OR_USERNAME: 'Lütfen e-postanızı ya da kullanıcı adınızı girin',
  ENTER_MOBILE: 'Lütfen cep telefon numaranızı girin',
  USERNAME_ALL: 'Telefon numarası/E-mail/Kullanıcı Adı',
  ENTER_USERNAME_ALL: 'Lütfen cep telefon numaranızı, e-postanızı ya da kullanıcı adınızı girin',
  ENTER_PASSWORD: 'Lütfen şifrenizi girin',
  RE_ENTER_PASSWORD: 'Lütfen şifrenizi tekrar girin', //need to be translated
  PASSWORD_DISMATCH: 'Şifreler farklı, lütfen kontrol edin', //need to be translated
  REGISTER: 'Kayıt ol',
  FORGET_PASSWORD: 'Şifrenizi mi unuttunuz?',
  RESET_PASSWORD: 'Şifreyi Sıfırla',
  MOBILE_REGISTER: 'Mobil Kayıt',
  EMAIL_REGISTER: 'E-posta Kaydı',
  ENTER_USERNAME: 'Lütfen kullanıcı adınızı girin',
  ENTER_USERNAME2: 'Lütfen kullanıcı adınızı girin',
  ENTER_CODE: 'Lütfen kullanıcı adınızı girin',
  GET_CODE: 'Kod Al',
  ENTER_EMAIL: 'Lütfen e-postanızı girin',
  ENTER_SERVER_ADDRESS: 'Lütfen sunucu adresini girin',
  ENTER_VALID_SERVER_ADDRESS: 'Lütfen geçerli bir sunucu adresi girin',
  ENTER_REALNAME: 'Lütfen gerçek adınızı girin',
  ENTER_COMPANY: 'Lütfen şirketinizi girin',
  REGISTER_READ_PROTOCAL: 'Okudum ve kabul ediyorum',
  REGISTER_ONLINE_PROTOCAL: 'SuperMap Hizmet Şartları ve Gizlilik Politikası',
  CONNECTING: 'Bağlanıyor',
  CONNECT_SERVER_FAIL: 'Sunucuya bağlanılamadı, lütfen ağ veya sunucu adresini kontrol edin',
  NEXT: 'Sonraki',

  SWITCH_ACCOUNT: 'Hesap Değiştir',
  LOG_OUT: 'Oturumu Kapat',

  SWITCH: 'Değiştir',
  SWITCH_CURRENT: 'Bu kullanıcı ile zaten giriş yaptınız',
  SWITCHING: 'Değiştiriliyor...',
  SWITCH_FAIL: 'Geçiş başarısız, lütfen bu kullanıcıyla tekrar giriş yapmayı deneyin',

  // 地图服务地址
  SERVICE_ADDRESS: 'Servis Adresi',
  MAP_NAME: 'Harita Adı',
  ENTER_SERVICE_ADDRESS: 'Lütfen Servis Adresini girin',
  SAVE: 'Kaydet',

  // 我的服务
  SERVICE: 'Servis',
  MY_SERVICE: 'Servis',
  PRIVATE_SERVICE: 'Özel Servis',
  PUBLIC_SERVICE: 'Halka Açık Servis',

  // 个人主页
  MY_ACCOUNT: 'Hesabım',
  PROFILE_PHOTO: 'Profil Fotoğrafı',
  USERNAME: 'Kullanıcı Adı',
  PHONE: 'Cep Telefonu',
  E_MAIL: 'E-posta',
  CONNECT: 'Bağlan',
  MANAGE_ACCOUNT: 'Hesabı Yönet',
  ADD_ACCOUNT: 'Hesap Ekle',
  DELETE_ACCOUNT: 'Hesap Sil',
  UNABLE_DELETE_SELF: 'Kullanıcı Silinemiyor',

  DELETE: 'Sil',
  SELECT_ALL: 'Tümünü Seç',
  DESELECT_ALL: 'Tüm Seçimleri Kaldır',

  // 数据删除导出
  SHARE: 'Paylaş',
  PATH: 'Erişim Yolu',

  LOCAL: 'Lokal',
  SAMPLEDATA: 'Örnek Veri',
  ON_DEVICE: 'Kullanıcı Verisi',
  EXPORT_DATA: 'Verileri Dışa Aktar',
  IMPORT_DATA: 'Verileri İçe Aktar',
  UPLOAD_DATA: 'Verileri Paylaş',
  DELETE_DATA: 'Verileri Sil',
  OPEN_DATA: 'Verileri Aç',
  NEW_DATASET: 'Verikümesi Oluştur',
  UPLOAD_DATASET: 'Verikümesi Paylaş',
  DELETE_DATASET: 'Verikümesi Sil',
  UPLOAD_MAP: 'Haritayı Paylaş',
  EXPORT_MAP: 'Haritayı Dışa Aktar',
  DELETE_MAP: 'Haritayı Sil',
  UPLOAD_SCENE: 'Manzarayı Paylaş',
  DELETE_SCENE: 'Manzarayı Sil',
  UPLOAD_SYMBOL: 'Sembolü Paylaş',
  DELETE_SYMBOL: 'Sembolü Sil',
  UPLOAD_TEMPLATE: 'Taslağı Paylaş',
  DELETE_TEMPLATE: 'Taslağı Sil',
  UPLOAD_MARK: 'İşareti Paylaş',
  DELETE_MARK: 'İşareti Sil',
  UPLOAD_COLOR_SCHEME: 'Renk Şemasını Paylaş',
  DELETE_COLOR_SCHEME: 'Renk Şemasını Sil',
  BATCH_SHARE: 'Toplu Paylaş',
  BATCH_DELETE: 'Toplu Sil',
  BATCH_ADD: 'Toplu Ekle',
  BATCH_OPERATE: 'Toplu İşlem',
  MY_APPLET: 'Uygulamalarım',
  UN_DOWNLOADED_APPLET: 'Yüklenmemiş Uygulama',
  DELETE_APPLET: 'Delete Applet',
  ADD_APPLET: 'Add Applet',
  MOVE_UP: 'Move Up',
  MOVE_DOWN: 'Move Down',

  DELETE_SERVICE: 'Hizmeti Sil',
  PUBLISH_SERVICE: 'Yayınla',
  SET_AS_PRIVATE_SERVICE: 'Özel Servis olarak ayarla',
  SET_AS_PUBLIC_SERVICE: 'Halka Açık Servis olarak ayarla',
  SET_AS_PRIVATE_DATA: 'Özel Veri olarak ayarlaa',
  SET_AS_PUBLIC_DATA: 'Halka Açık Veri olarak ayarla',
  NO_SERVICE: 'Servis Yok',

  GET_DATA_FAILED: 'Veri alınamadı',

  // 关于
  ABOUT: 'Hakkında',
  SERVICE_HOTLINE: 'Hizmet Hattı',
  SALES_CONSULTATION: 'Satış Danışmanlığı',
  BUSINESS_WEBSITE: 'İşletme Web Sitesi',
  SERVICE_AGREEMENT: 'Hizmet Anlaşması',
  PRIVACY_POLICY: 'Gizlilik Politikası',
  HELP_MANUAL: 'Yardım Kılavuzu',
  NOVICE_GUIDE: 'Novice Guide',//待翻译
  START_GUIDE:'Start Guide',//待翻译

  MAP_ONLINE: 'Çevrimiçi Harita',
  MAP_2D: '2B Harita',
  MAP_3D: '3B Harita',
  BROWSE_MAP: 'Keşfet',

  // 创建数据集
  PLEASE_ADD_DATASET: 'Lütfen verikümesi ekleyin',
  ADD_DATASET: 'Verikümesi ekle',
  ENTER_DATASET_NAME: 'Lütfen verikümesi adı girin',
  SELECT_DATASET_TYPE: 'Lütfen verikümesi tipi seçin',
  DATASET_NAME: 'Verikümesi Adı',
  DATASET_TYPE: 'Verikümesi Tipi',
  DATASET_TYPE_POINT: 'Nokta',
  DATASET_TYPE_LINE: 'Çizgi',
  DATASET_TYPE_REGION: 'Bölge',
  DATASET_TYPE_TEXT: 'Metin',
  CLEAR: 'Temizle',
  CREATE: 'Oluştur',
  DATASET_BUILD_PYRAMID: 'Veri Piramidi',
  DATASET_BUILD_STATISTICS: 'Statistics Model',
  TIME_SPEND_OPERATION: 'This operation may take some time, would you like to continue?',
  IMPORT_BUILD_PYRAMID: 'Do you want to build image pyramid(may take some time)？',
  BUILDING: 'Building',
  BUILD_SUCCESS: 'Build Sucessfully',
  BUILD_FAILED: 'Build Failed',

  // 创建数据源
  NEW_DATASOURCE: 'Verikaynağı Oluştur',
  SET_DATASOURCE_NAME: 'Verikaynağı Adı Ayarla',
  ENTER_DATASOURCE_NAME: 'Lütfen verikaynağı adı girin',
  OPEN_DATASROUCE_FAILED: 'Verikaynağı açılamadı',
  DATASOURCE_TYPE: 'veri türü',
  SERVICE_TYPE: 'Servis tipi',

  SELECT_DATASET_EXPORT_TYPE: 'Dışa Aktarma için format seçin',
  DATASET_EXPORT_NOT_SUPPORTED: 'Bu verikümesinin dışa aktarımı henüz desteklenmiyor',

  // 搜索
  SEARCH: 'Ara',
  NO_SEARCH_RESULT: 'Arama sonucu yok',

  // 设置
  STATUSBAR_HIDE: 'Durum Çubuğu Gizle',
  SETTING_LICENSE: 'Lisans',
  SETTING_ABOUT_ITABLET: 'iTablet Hakkında',
  SETTING_ABOUT: '',
  SETTING_ABOUT_AFTER: ' Hakkında',
  SETTING_CHECK_VERSION: 'Sürüm Kontrolü',
  SETTING_SUGGESTION_FEEDBACK: 'geribesleme',
  SETTING_LANGUAGE: 'Dil',
  SETTING_LANGUAGE_AUTO: 'Otomatik',
  SETTING_LOCATION_DEVICE: 'Konumlandır',
  SETTING_LOCATION_LOCAL: 'Bu cihaz',
  SETTING_CLEAR_CACHE: 'Clear Cache',//待翻译

  // 许可
  LICENSE: 'Lisans',
  LICENSE_CURRENT: 'Mevcut Lisans',
  LICENSE_TYPE: 'Lisans Tipi',
  LICENSE_TRIAL: 'Deneme Lisansı',
  LICENSE_OFFICIAL: 'Resmi Lisans',
  LICENSE_STATE: 'Lisans Durumu',
  LICENSE_SURPLUS: 'Fazla',
  LICENSE_YEAR: 'Yıl',
  LICENSE_DAY: ' Gün',
  LICENSE_PERMANENT: 'kalıcı',
  LICENSE_CONTAIN_MODULE: 'Lisans Modülü İçerir',
  LICENSE_CONTAIN_EXPAND_MODULE: 'Lisans Modülü İçerir',
  LICENSE_USER_NAME: 'Kullanıcı Adı',
  LICENSE_REMIND_NUMBER: 'Lisans Hatırlatma Numarası',
  LICENSE_OFFICIAL_INPUT: 'Resmi Lisans Girişi',
  LICENSE_TRIAL_APPLY: 'Deneme Lisansı Başvurusu',
  LICENSE_OFFICIAL_CLEAN: 'Resmi Lisans Dönüş',
  LICENSE_OFFICIAL_RETURN: 'Lisans Dönüş',
  LICENSE_CLEAN_CANCLE: 'Silme İptal',
  LICENSE_CLEAN_CONTINUE: 'Dönüş',
  LICENSE_CLEAN_ALERT: 'Dönüş ?',
  INPUT_LICENSE_SERIAL_NUMBER: 'Lisans Seri Numarası Girişi',
  PLEASE_INPUT_LICENSE_SERIAL_NUMBER: 'Lütfen Lisans Seri Numarası Girin',
  PLEASE_INPUT_LICENSE_SERIAL_NUMBER_NOT_CORRECT: 'Girilen lisans seri numarası doğru değil',
  LICENSE_SERIAL_NUMBER_ACTIVATION_SUCCESS: 'Seri Numarası Aktivasyonu Başarılı',
  LICENSE_REGISTER_BUY: 'Satın Alma Kaydı',
  LICENSE_HAVE_REGISTER: 'Kaydedildi',
  LICENSE_NOT_CONTAIN_MODULE: 'Modülü İçermiyor',
  LICENSE_MODULE_REGISTER_SUCCESS: 'Modül Kaydı Başarılı',
  LICENSE_MODULE_REGISTER_FAIL: 'Modül Kaydı Başarısız',
  LICENSE_EXIT: 'Çıkış',
  LICENSE_EXIT_FAILED: 'Çıkış Başarısız',
  LICENSE_EXIT_CLOUD_ACTIVATE: 'Dönüş bulut lisans ve Aktivasyonu?',
  LICENSE_EXIT_CLOUD_LOGOUT: 'Dönüş bulut lisans ve Çıkış',
  LICENSE_CURRENT_EXPIRE: 'Mevcut Lisans Geçersiz',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE: 'Bu modül mevcut lisansa dahil değildir',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE_SUB: 'Bu modül mevcut lisans kapsamında değildir ve bazı işlevleri kullanılamaz!!!',
  LICENSE_NO_NATIVE_OFFICAL: 'Yerel resmi lisans dosyası yok, Lütfen "/ iTablet / license /" file "dosyasına "Official_License" lisans dosyasını ekleyin',
  LICENSE_NOT_ITABLET_OFFICAL: 'Bu resmi lisans iTablette aktif değil, lütfen lisansı temizlemek ve yeniden etkinleştirmek için lisans sayfasına gidin',
  LICENSE_NATIVE_EXPIRE: 'Yerel Lisans Geçersiz',
  LICENSE_LONG_EFFECTIVE: 'Uzun vadeli etkili',
  LICENSE_OFFLINE: 'çevrimdışı Lisans',
  LICENSE_CLOUD: 'Bulut Lisans',
  LICENSE_PRIVATE_CLOUD: 'özel Bulut Lisans',
  LICENSE_NONE: 'Yok',
  LICENSE_EDITION: 'Lisans Baskı',
  LICENSE_EDITION_CURRENT: 'şimdiki　Baskı',
  LICENSE_IN_TRIAL: 'Deneme',
  LICENSE_TRIAL_END: 'Deneme Sonu',
  LICENSE_MODULE: 'Modülü',
  LICENSE_ACTIVATE: 'Aktivasyonu',
  LICENSE_ACTIVATING: 'Aktivasyonu',
  LICENSE_ACTIVATION_SUCCESS: 'Aktivasyonu Başarılı',
  LICENSE_ACTIVATION_FAIL: 'Aktivasyonu Başarısız',
  LICENSE_SELECT_LICENSE: 'Lisans seçin',
  LICENSE_REAMIN_DAYS: 'kalan günler',
  LICENSE_SHOW_DETAIL: 'detayları göster',
  LICENSE_QUERY_NONE: 'Lisans Sorgu Başarısız',
  LICENSE_PRIVATE_CLOUD_SERVER: 'özel bulut sunucu',
  LICENSE_EDUCATION: 'Eğitim lisansı',
  LICENSE_EDUCATION_CONNECT_FAIL: 'Hizmet bağlantısı başarısız oldu',
  LICENSE_QUERY: 'Sorgu',
  LICENSE_QUERYING: 'Sorgu',
  LICENSE_QUERY_FAIL: 'Sorgu başarısız, ',
  LICENSE_SELECT_MODULE: 'Modülü Seçin',
  LICENSE_SELECT_EDITION: 'Lisans Seçin',
  LICENSE_TOTAL_NUM: 'Toplam',
  LICENSE_REMIAN_NUM: 'kalmak',
  LICENSE_DUE_DATE: 'son tarih',
  LICENSE_CLOUD_SITE_SWITCH: 'Değiştir',
  LICENSE_CLOUD_SITE_DEFAULT: 'Varsayılan Site',
  LICENSE_CLOUD_SITE_JP: 'Japon Site',
  // itablet许可版本
  LICENSE_EDITION_STANDARD: 'Standart Baskı',
  LICENSE_EDITION_PROFESSIONAL: 'Profesyonel Baskı',
  LICENSE_EDITION_ADVANCED: 'Ileri Baskı',
  // imobile许可模块
  Core_Dev: 'Core Dev',
  Core_Runtime: 'Core Runtime',
  Navigation_Dev: 'Navigation Dev',
  Navigation_Runtime: 'Navigation Runtime',
  Realspace_Dev: 'Realspace Dev',
  Realspace_Runtime: 'Realspace Runtime',
  Plot_Dev: 'Plot Dev',
  Plot_Runtime: 'Plot Runtime',
  Industry_Navigation_Dev: 'Industry Navigation Dev',
  Industry_Navigation_Runtime: 'Industry Navigation Runtime',
  Indoor_Navigation_Dev: 'Indoor Navigation Dev',
  Indoor_Navigation_Runtime: 'Indoor Navigation Runtime',
  Plot3D_Dev: 'Plot3D Dev',
  Plot3D_Runtime: 'Plot3D Runtime',
  Realspace_Analyst_Dev: 'Realspace Analyst Dev',
  Realspace_Analyst_Runtime: 'Realspace Analyst Runtime',
  Realspace_Effect_Dev: 'Realspace Effect Dev',
  Realspace_Effect_Runtime: 'Realspace Effect Runtime',
  // itablet许可模块
  ITABLET_ARMAP: 'AR Harita',
  ITABLET_NAVIGATIONMAP: 'Navigasyon',
  ITABLET_DATAANALYSIS: 'Veri Analizi',
  ITABLET_PLOTTING: 'Çizim',
  INVALID_MODULE: 'Mevcut Modülü Geçersiz. Devam Edememek.',
  INVALID_LICENSE: 'Lisans Geçersiz. Devam Edememek.',
  GO_ACTIVATE: 'Aktivasyonu',

  // 意见反馈
  SUGGESTION_FUNCTION_ABNORMAL: 'Anormal fonksiyon: arıza veya mevcut değil',
  SUGGESTION_PRODUCT_ADVICE: 'Ürün önerisi: rahatsız edici kullanım, önerilerim var',
  SUGGESTION_OTHER_PROBLEMS: 'Diğer konular',
  SUGGESTION_SELECT_PROBLEMS: 'Lütfen geri bildirimde bulunmak istediğiniz soruyu seçin',
  SUGGESTION_PROBLEMS_DETAIL: 'Lütfen ayrıntılı sorular ve yorumlar ekleyin',
  SUGGESTION_PROBLEMS_DESCRIPTION: 'Lütfen sorunun bir açıklamasını girin',
  SUGGESTION_CONTACT_WAY: 'İletişim bilgileri',
  SUGGESTION_CONTACT_WAY_INPUT: 'Lütfen iletişim bilgilerini girin',
  SUGGESTION_SUBMIT: 'sunmak',
  SUGGESTION_SUBMIT_SUCCEED: 'Başarıyla gönder',
  SUGGESTION_SUBMIT_FAILED: 'İşlem başarısız oldu',

  // ar地图校准
  MAP_AR_DATUM_LONGITUDE: 'boylam',
  MAP_AR_DATUM_LATITUDE: 'enlem',
  MAP_AR_DATUM_ENTER_CURRENT_POSITION: 'Lütfen geçerli konum koordinatlarını girin',
  MAP_AR_DATUM_AUTO_LOCATION: 'Otomatik konumlandırma',
  MAP_AR_DATUM_MAP_SELECT_POINT: 'Harita seçimi',
  MAP_AR_DATUM_SURE: 'belirlemek',
  MAP_AR_DATUM_AUTO_LOCATIONING: 'Konumlandırma',
  MAP_AR_DATUM_POSITION: 'Taban noktası koordinatları',
  MAP_AR_DATUM_AUTO_LOCATION_SUCCEED: 'Otomatik konumlandırma başarılı',
  MAP_AR_DATUM_MAP_SELECT_POINT_SUCCEED: 'Harita başarıyla seçildi',
  MAP_AR_DATUM_PLEASE_TOWARDS_NORTH: '请把手机后置摄像头朝北点击确定', //待翻译
  MAP_AR_DATUM_SETTING: 'Kurulum',
  X_COORDINATE: 'X Koordinatı',
  Y_COORDINATE: 'Y Koordinatı',
  MAP_AR_DATUM_AUTO_CATCH: 'Auto Catch',//待翻译
  MAP_AR_DATUM_AUTO_CATCH_TOLERANCE: 'Tolerance',//待翻译

  // ar地图
  COLLECT_SCENE_RENAME: 'Yeniden adlandırma',
  COLLECT_SCENE_RENAME_SUCCEED: 'Başarıyla yeniden adlandırıldı',
  COLLECT_SCENE_ADD_REMARK: 'Not ekle',
  COLLECT_SCENE_ADD_REMARK_SUCCEED: 'Not başarıyla eklendi',

  CHOOSE_COLOR: 'Renk Seç',
  SET_PROJECTION: 'Projeksiyonu ayarla',
}

export { Profile }
