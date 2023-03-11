import { getThemeAssets } from "@/assets"
import NavigationService from "@/containers/NavigationService"
import { getLanguage } from "@/language"
import { AppToolBar, Toast } from "@/utils"
import { getImage } from "../../assets/Image"
import { getUserParam } from "../../utils/langchaoServer"


// 地图设置 新菜单栏
export const getThematicMapSettings = (hasUser = false) => {
  let data = [
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
    // {
    //   title: getLanguage(global.language).Map_Settings.LEFT_TOP_LOG,
    //   leftImage: getImage().icon_userInfo_setting,
    //   action: () => {
    //     NavigationService.navigate('LangChaoLogin',{
    //       type: 'setting'
    //     })
    //   },
    // },
  ]

  const contacts = {
    title: getLanguage(global.language).Map_Settings.ADDRESS_BOOK_SETTING,
    leftImage: getImage().icon_contact_setting,
    action: () => {
      // NavigationService.navigate('LocationSetting')
      if(getUserParam().userId === "") {
        NavigationService.navigate('LangChaoLogin')
      } else {
        NavigationService.navigate('ContactsList')
      }
    },
  }

  const userInfo = {
    title: getLanguage(global.language).Map_Settings.USER_INFO_MAINTENANCE,
    leftImage: getImage().icon_userInfo_setting,
    action: () => {
      if(getUserParam().userId === "") {
        NavigationService.navigate('LangChaoLogin')
      } else {
        NavigationService.navigate('UserInfoMaintenance')
      }
    },
  }

  const passwordUpdate = {
    title: getLanguage(global.language).Map_Settings.UPDATE_PASSWORD,
    leftImage: getImage().icon_license_setting,
    action: () => {
      if(getUserParam().userId === "") {
        NavigationService.navigate('LangChaoLogin')
      } else {
        NavigationService.navigate('UpdatePassword')
      }
    },
  }

  const app_version = " 1.0"
  const versionCode = {
    title: getLanguage(global.language).Map_Settings.VERSION_CODE + app_version,
    leftImage: getImage().icon_app_version,
    action: () => {
      Toast.show(app_version)
    },
  }

  if(hasUser) {
    // data = data.concat(userData)
    data.unshift(userInfo)
    data.unshift(contacts)
    data.push(passwordUpdate)
  }
  data.push(versionCode)
  return data
}

export default {
  getThematicMapSettings,
}