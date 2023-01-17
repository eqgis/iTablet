import { getThemeAssets } from "@/assets"
import NavigationService from "@/containers/NavigationService"
import { getLanguage } from "@/language"
import { AppToolBar } from "@/utils"
import { getImage } from "../../assets/Image"


// 地图设置 新菜单栏
export const getThematicMapSettings = () => [
  {
    title: getLanguage(global.language).Map_Settings.ADDRESS_BOOK_SETTING,
    leftImage: getImage().icon_contact_setting,
    action: () => {
      // NavigationService.navigate('LocationSetting')
      NavigationService.navigate('ContactsList')
    },
  },
  {
    title: getLanguage(global.language).Map_Settings.USER_INFO_MAINTENANCE,
    leftImage: getImage().icon_userInfo_setting,
    action: () => {
      NavigationService.navigate('UserInfoMaintenance')
    },
  },
  {
    title: getLanguage(global.language).Map_Settings.BASIC_SETTING,
    leftImage: getImage().icon_base_setting,
  },
  {
    title: getLanguage(global.language).Map_Settings.LANGUAGE_SETTING,
    leftImage: getImage().icon_language_setting,
    action: () => {
      NavigationService.navigate('LanguageSetting')
    },
  },
  {
    title: getLanguage(global.language).Map_Settings.LICENSE_CENTER,
    leftImage: getImage().icon_license_setting,
    action: () => {
      const user = AppToolBar.getProps().user
      NavigationService.navigate('LicensePage', {
        user: user,
      })
    },
  },
  {
    title: getLanguage(global.language).Map_Settings.SERVER_SETTING,
    leftImage: getImage().icon_server_setting,
    action: () => {
      NavigationService.navigate('InputServer')
    },
  },
  {
    title: getLanguage(global.language).Map_Settings.LEFT_TOP_LOG,
    leftImage: getImage().icon_userInfo_setting,
    action: () => {
      NavigationService.navigate('LangChaoLogin')
    },
  },
  {
    title: getLanguage(global.language).Map_Settings.UPDATE_PASSWORD,
    leftImage: getImage().icon_license_setting,
    action: () => {
      NavigationService.navigate('UpdatePassword')
    },
  },
]

export default {
  getThematicMapSettings,
}