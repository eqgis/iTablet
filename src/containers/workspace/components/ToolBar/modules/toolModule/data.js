import { getLanguage } from '../../../../../../language'

function pickerData() {
  const option = [
    {
      key: getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST,
      value: getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST,
    },
    {
      key: getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS,
      value: getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS,
    },
    {
      key: getLanguage(global.language).Map_Main_Menu.SATURATION,
      value: getLanguage(global.language).Map_Main_Menu.SATURATION,
    },
  ]
  const pickerData = [
    {
      key: getLanguage(global.language).Map_Main_Menu.FILL,
      value: getLanguage(global.language).Map_Main_Menu.FILL,
      children: option,
    },
    {
      key: getLanguage(global.language).Map_Main_Menu.BORDER,
      value: getLanguage(global.language).Map_Main_Menu.BORDER,
      children: option,
    },
    {
      key: getLanguage(global.language).Map_Main_Menu.LINE,
      value: getLanguage(global.language).Map_Main_Menu.LINE,
      children: option,
    },
    {
      key: getLanguage(global.language).Map_Main_Menu.MARK,
      value: getLanguage(global.language).Map_Main_Menu.MARK,
      children: option,
    },
  ]
  return pickerData
}

export { pickerData }
