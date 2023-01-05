import { getThemeAssets } from "@/assets"
import NavigationService from "@/containers/NavigationService"
import { getLanguage } from "@/language"
import { AppToolBar } from "@/utils"
import { getImage } from "../../assets/Image"


// 地图设置 新菜单栏
export const getThematicMapSettings = () => [
  {
    title: getLanguage(global.language).Map_Settings.ADDRESS_BOOK_SETTING,
    leftImage: getImage().telephone1,
    action: () => {
      // NavigationService.navigate('LocationSetting')
      NavigationService.navigate('ContactsList')
    },
  },
  {
    title: getLanguage(global.language).Map_Settings.BASIC_SETTING,
    leftImage: getThemeAssets().setting.icon_basic,
  },
  {
    title: getLanguage(global.language).Map_Settings.LICENSE_CENTER,
    leftImage: getThemeAssets().setting.icon_legend,
    action: () => {
      const user = AppToolBar.getProps().user
      NavigationService.navigate('LicensePage', {
        user: user,
      })
    },
  },
  {
    title: getLanguage(global.language).Map_Settings.LANGUAGE_SETTING,
    leftImage: getThemeAssets().setting.icon_coordinate,
    action: () => {
      NavigationService.navigate('LanguageSetting')
    },
  },
  {
    title: getLanguage(global.language).Map_Settings.SERVER_SETTING,
    leftImage: getThemeAssets().setting.icon_range,
    action: () => {
      NavigationService.navigate('InputServer')
    },
  },
]

export default {
  getThematicMapSettings,
}