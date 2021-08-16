import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'أتفاقيه خدمه مستخدم سوبرماب',
  AGREE: 'موافق',
  READ_AND_AGREE: 'لقد قرأت الشروط المذكورة أعلاه وأوافق عليها',
  AGAIN:'See Again',//need to translate
  CONFIRM_EXIT:'Confirm Exit',//need to translate
  REMINDER:'Reminder',//need to translate
  AGREEMENT:'We attach great importance to the protection of your personal information and promise to protect and process your information in strict accordance with the hypergraph privacy policy. If we disagree with the policy, we regret that we will not be able to provide services',//need to translate
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

  DELETE_CURRENT_OBJ_CONFIRM: 'هل تريد حذف الكائن الحالي ؟',
  NO_SELECTED_OBJ: 'لا توجد كائنات مختارة',
}

export { Protocol, Common }
