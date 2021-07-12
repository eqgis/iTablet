/**
 * 数据服务接口测试
 */
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
    ServiceData.getData(this.type, params)
    const result = await ServiceAction.getGroupServices(params.currentTask.groupID)

    let _data = [{
      title: getLanguage(GLOBAL.language).Profile.MY_SERVICE,
      image: getThemeAssets().mine.my_service,
      data: [],
    }]
    if (result?.content?.length > 0) {
      let services = []
      result.content.forEach(item => {
        services.push({
          key: item.resourceId,
          title: item.resourceName,
          subTitle: new Date(item.createTime).Format("yyyy-MM-dd hh:mm:ss"),
          data: item,
          size: 'large',
          image: getThemeAssets().dataType.icon_data_source,
        })
      })
      _data[0].data = services || []
    }
    ToolbarModule.addData({
      services: _data,
    })
    params.showFullMap && params.showFullMap(true)
    params.setToolbarVisible(true, ConstToolType.SM_MAP_SERVICE_LIST, {
      data: _data,
      buttons: [],
      containerType: ToolbarType.list,
      isFullScreen: true,
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
    title: getLanguage(GLOBAL.language).Profile.MY_SERVICE,
    size: 'large',
    image: getThemeAssets().mine.my_service,
    getData: ServiceData.getData,
    actions: ServiceAction,
    serviceType: serviceType,
  })
}
