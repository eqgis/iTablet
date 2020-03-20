import ToolbarModule from '../ToolbarModule'
import NavigationService from '../../../../../NavigationService'

async function action() {
  try {
    const _params = ToolbarModule.getParams()
    NavigationService.navigate('NavigationView', {
      changeNavPathInfo: _params.changeNavPathInfo,
    })
  } catch (e) {
    //console.warn(e)
  }
}

export default function(type, title, customAction) {
  return {
    key: title,
    title: title,
    action: () => {
      if (customAction === false) {
        return
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: require('../../../../../../assets/Navigation/navi_icon.png'),
  }
}
