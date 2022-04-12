/**
 * 数据服务接口测试
 */
import { SMap } from 'imobile_for_reactnative'
import ServiceAction from './ServiceAction'
import ServiceData from './ServiceData'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType, UserType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import FunctionModule from '../../../../../../class/FunctionModule'

class ServiceModule extends FunctionModule {
  constructor(props) {
    super(props)
    // ServiceAction.setServiceType(props.serviceType)
  }

  action = async () => {
    this.setModuleData(this.type)

    const params = ToolbarModule.getParams()
    const _data = await ServiceData.getData(this.type, params)

    ToolbarModule.addData({
      services: _data.data,
    })
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, ConstToolType.SM_MAP_SERVICE_LIST, {
      containerType: ToolbarType.list,
      isFullScreen: true,
      ..._data,
    })
  }
}

export default function(serviceType) {
  if (!serviceType) {
    const params = ToolbarModule.getParams()
    serviceType = UserType.isIPortalUser(params.user?.currentUser) ? 'iportal' : 'online'
  }

  return new ServiceModule({
    type: ConstToolType.SM_MAP_SERVICE,
    title: getLanguage(global.language).Profile.MY_SERVICE,
    size: 'large',
    image: getThemeAssets().mine.my_service,
    getData: ServiceData.getData,
    actions: ServiceAction,
    serviceType: serviceType,
  })
}
