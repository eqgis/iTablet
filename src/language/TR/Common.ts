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

  DELETE_CURRENT_OBJ_CONFIRM: 'Do you want to delete current object?',  //to be translated
  NO_SELECTED_OBJ: 'No selected object',  //to be translated
}

export { Protocol, Common }
