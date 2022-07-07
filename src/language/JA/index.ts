import { language_ja as LANG } from './language_ja'

/** 兼容以前写法的假数据 */
const DUMMY = {
  Navigator_Label: LANG,
  Map_Module: LANG,
  Profile: LANG,
  Prompt: LANG,
  Friends: LANG,
  Find: LANG,
  FieldType: LANG,
  Common: LANG,
  Protocol: LANG,
  AI: LANG,
  Analyst_Labels: LANG,
  Analyst_Methods: LANG,
  Analyst_Modules: LANG,
  Analyst_Params: LANG,
  Analyst_Prompt: LANG,
  Convert_Unit: LANG,
  ARMap: LANG,
  Cowork: LANG,
  RequestError: LANG,
  Map_Attribute: LANG,
  Map_Label: LANG,
  Map_Layer: LANG,
  Map_Main_Menu: LANG,
  Map_Plotting: LANG,
  Map_PoiTitle: LANG,
  Map_Setting: LANG,
  Map_Settings: LANG,
  Map_Tools: LANG,
  Template: LANG,
}

export default {
  ...LANG,
  ...DUMMY
}
