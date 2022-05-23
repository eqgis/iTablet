import CN from "../CN"

const Protocol: typeof CN.Protocol = {
  PROTOCOL: "أتفاقيه خدمه مستخدم سوبرماب",
  AGREE: "موافق",
  READ_AND_AGREE: "لقد قرأت الشروط المذكورة أعلاه وأوافق عليها",
  AGAIN:"مع السلامة",
  CONFIRM_EXIT:"تأكيد خروج",
  REMINDER:"تذكير",
  AGREEMENT:"نحن التقيد الصارم بسياسة الخصوصية SuperMap لحماية المعلومات الشخصية الخاصة بك .من أجل خدمة أفضل لك ، يرجى الموافقة على هذه السياسة",
}

const Common: typeof CN.Common = {
  UP: "أعلى",
  DOWN: "أسفل",
  LEFT: "شمال",
  RIGHT: "يمين",
  FRONT: "أمام",
  BACK: "خلف",

  PARAMETER: "معاملات",
  CONFIRM: "تأكيد",

  ADD: "اضافه",
  NONE: "لا شيء",

  DELETE_CURRENT_OBJ_CONFIRM: "هل تريد حذف الكائن الحالي ؟",
  NO_SELECTED_OBJ: "لا توجد كائنات مختارة",

  CURRENT: 'حالي',
  SELECTED: 'اختار',
  DEFAULT: 'خرق',

  SELECT_MODEL: 'اختيار النموذج',

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
