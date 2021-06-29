import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'أتفاقيه خدمه مستخدم سوبرماب',
  AGREE: 'موافق',
  READ_AND_AGREE: 'لقد قرأت الشروط المذكورة أعلاه وأوافق عليها',
}

const Common: typeof CN.Common = {
  UP: 'أعلى',
  DOWN: 'أسفل',
  LEFT: 'شمال',
  RIGHT: 'يمين',
  FRONT: 'أمام',
  BACK: 'خلف',

  PARAMETER: 'معاملات',
  CONFIRM: 'تأكيد',

  ADD: 'اضافه',
  NONE: 'لا شيء',

  DELETE_CURRENT_OBJ_CONFIRM: 'Do you want to delete current object?',  //to be translated
  NO_SELECTED_OBJ: 'No selected object',  //to be translated
}

export { Protocol, Common }
