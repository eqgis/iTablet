import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'SuperMap Kullanıcı Hizmet Sözleşmesi',
  AGREE: 'Kabul Ediyorum',
  READ_AND_AGREE: 'Yukarıdaki şartları okudum ve kabul ediyorum',
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
