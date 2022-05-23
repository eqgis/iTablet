import CN from "../CN"

const Protocol: typeof CN.Protocol = {
  PROTOCOL: "SuperMap Kullanıcı Hizmet Sözleşmesi",
  AGREE: "Kabul Ediyorum",
  READ_AND_AGREE: "Yukarıdaki şartları okudum ve kabul ediyorum",
  AGAIN:"Tekrar Gör",
  CONFIRM_EXIT:"Çıkışı Onayla",
  REMINDER:"Hatırlatıcı",
  AGREEMENT:"Kişisel bilgilerinizin korunmasına büyük önem veriyoruz ve bilgilerinizi SuperMap gizlilik politikasına sıkı sıkıya uygun olarak korumayı ve işlemeyi taahhüt ediyoruz. Bu gizlilik politikasıyla aynı fikirde olmadığınız takdirde, hizmet sağlayamayacağımız için üzgünüz.",
}

const Common: typeof CN.Common = {
  UP: "Yukarı",
  DOWN: "Aşağı",
  LEFT: "Sol",
  RIGHT: "Sağ",
  FRONT: "Ön",
  BACK: "Arka",

  PARAMETER: "Parametre",
  CONFIRM: "Onayla",

  ADD: "Ekle",
  NONE: "hayır",

  DELETE_CURRENT_OBJ_CONFIRM: "Ağımdaki nesni silmek ister misiniz?",
  NO_SELECTED_OBJ: "Seçili nesne yok",

  CURRENT: 'Mevcut',
  SELECTED: 'Seçili',
  DEFAULT: 'Varsayılan',

  SELECT_MODEL: 'Model Seç',

  PLEASE_SELECT_MODEL: 'Please select model', // To be translated
  
  SHOULD_BE_DECIMAL_FRACTION: 'should be a ddecimal fraction',
  SHOULD_BE_INTEGER: 'shoud be an integer',
  SHOULD_BE_POSITIVE_NUMBER: 'shoud be a positive number',

  
  TRANVERSE: 'Tranverse',
  LONGITUDINAL: 'Longitudinal',
  HORIZONTAL: 'Horizontal',
  VERTICAL: 'Vertical',
  
  EXIT_SAND_TABLE_CONFIRM: 'Do you want to quit editing the sand table?',
  PLEASE_INPUT_MODEL_NAME: 'Please input model name',
  SAND_TABLE: 'Sand Table',
  EXPORT_SAND_TABLE_CONFIRM: 'Do you want to export the sand table?',
  MODEL_LIST: 'Model List',

  ALIGN: 'Alignment',
}

export { Protocol, Common }
