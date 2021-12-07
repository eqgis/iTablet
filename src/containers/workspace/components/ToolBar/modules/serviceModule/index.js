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
    ServiceData.getData(this.type, params)
    const result = await ServiceAction.getGroupServices(params.currentTask.groupID)

    let _data = [{
      title: getLanguage(GLOBAL.language).Profile.MY_SERVICE,
      image: getThemeAssets().mine.my_service,
      data: [],
    }]
    if (result?.content?.length > 0) {
      let datasources = await SMap.getDatasources() || []
      let services = []
      const mapName = params.map?.currentMap?.name?.replace(/_[0-9]+$/g, '') || ''
      result.content.forEach(item => {
        let exist = false
        // 查询服务所在数据源是否在当前地图已经打开
        // 若没打开,则过滤掉
        for (const datasource of datasources) {
          let serviceUDBName = item.resourceName.substring(item.resourceName.indexOf('_') + 1, item.resourceName.lastIndexOf('_'))
          // 判断是否发布时,本地打包的名字自动添加了 -数字- 后缀
          const reg = /-[0-9]+-$/
          serviceUDBName = serviceUDBName.replace(reg, '')
          if (
            exist ||
            serviceUDBName.toLocaleLowerCase() === mapName.toLocaleLowerCase() || // 服务数据是地图数据
            serviceUDBName.toLocaleLowerCase() === datasource.alias.toLocaleLowerCase() || // 服务数据是数据源数据
            serviceUDBName.toLocaleLowerCase().indexOf('tagging_') === 0 ||
            serviceUDBName.toLocaleLowerCase().indexOf('default_tagging') === 0
          ) {
            exist = true
            break
          }
        }
        exist && services.push({
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
