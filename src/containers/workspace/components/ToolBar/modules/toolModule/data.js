import { getLanguage } from '../../../../../../language'

function pickerData() {
  const option = [
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_CONTRAST,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_CONTRAST,
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BRIGHTNESS,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BRIGHTNESS,
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.SATURATION,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.SATURATION,
    },
  ]
  const pickerData = [
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.FILL,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.FILL,
      children: option,
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.BORDER,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.BORDER,
      children: option,
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.LINE,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.LINE,
      children: option,
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.MARK,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.MARK,
      children: option,
    },
  ]
  return pickerData
}

export { pickerData }
