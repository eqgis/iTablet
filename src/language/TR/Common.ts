import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'SuperMap Kullanıcı Hizmet Sözleşmesi',
  AGREE: 'Kabul Ediyorum',
  READ_AND_AGREE: 'Yukarıdaki şartları okudum ve kabul ediyorum',
  AGAIN:'See Again',//need to translate
  CONFIRM_EXIT:'Confirm Exit',//need to translate
  REMINDER:'Reminder',//need to translate
  AGREEMENT:'We attach great importance to the protection of your personal information and promise to protect and process your information in strict accordance with the hypergraph privacy policy. If we disagree with the policy, we regret that we will not be able to provide services',//need to translate
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
