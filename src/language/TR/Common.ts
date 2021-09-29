import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'SuperMap Kullanıcı Hizmet Sözleşmesi',
  AGREE: 'Kabul Ediyorum',
  READ_AND_AGREE: 'Yukarıdaki şartları okudum ve kabul ediyorum',
  AGAIN:'Tekrar Gör',
  CONFIRM_EXIT:'Çıkışı Onayla',
  REMINDER:'Hatırlatıcı',
  AGREEMENT:'Kişisel bilgilerinizin korunmasına büyük önem veriyoruz ve bilgilerinizi SuperMap gizlilik politikasına sıkı sıkıya uygun olarak korumayı ve işlemeyi taahhüt ediyoruz. Bu gizlilik politikasıyla aynı fikirde olmadığınız takdirde, hizmet sağlayamayacağımız için üzgünüz.',
}

const Common: typeof CN.Common = {
  UP: 'Yukarı',
  DOWN: 'Aşağı',
  LEFT: 'Sol',
  RIGHT: 'Sağ',
  FRONT: 'Ön',
  BACK: 'Arka',

  PARAMETER: 'Parametre',
  CONFIRM: 'Onayla',

  ADD: 'Ekle',
  NONE: 'hayır',

  DELETE_CURRENT_OBJ_CONFIRM: 'Ağımdaki nesni silmek ister misiniz?',
  NO_SELECTED_OBJ: 'Seçili nesne yok',
}

export { Protocol, Common }
