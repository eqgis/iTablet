import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { getLanguage } from '../../../../language/index'
import { ConstPath } from '../../../../constants'
import NavigationService from '../../../NavigationService'
import { SMap, EngineType } from 'imobile_for_reactnative'
import { Toast } from '../../../../utils'

class MyDatasource extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.data
    const { params } = this.props.route
    this.state = {
      ...this.state,
      shareToLocal: true,
      shareToOnline: true,
      shareToIPortal: true,
      shareToWechat: true,
      shareToFriend: true,
    }
    this.from = params.from
    this.showMore = this.from === 'MapView' ? false : undefined
    if(params.showMode) {
      this.showMode = params.showMode
    }
  }

  getData = async () => {
    let data = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'DATA',
    )

    let sectionData = []
    sectionData.push({
      title: 'DATA',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    if (!this.itemInfo) return false
    let udbPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    let uddPath = udbPath.substring(0, udbPath.lastIndexOf('.')) + '.udd'

    let result = await FileTools.deleteFile(udbPath)
    result = result && (await FileTools.deleteFile(uddPath))

    return result
  }

  exportData = async (name, exportToTemp = true) => {
    let homePath = await FileTools.appendingHomeDirectory()
    let targetPath
    if (exportToTemp) {
      let tempPath = homePath + this.getRelativeTempPath()
      let availableName = await this._getAvailableFileName(
        tempPath,
        'MyExport',
        'zip',
      )
      targetPath = tempPath + availableName
      this.exportPath = targetPath
    } else {
      let exportPath = homePath + this.getRelativeExportPath()
      let availableName = await this._getAvailableFileName(
        exportPath,
        name,
        'zip',
      )
      targetPath = exportPath + availableName
      this.exportPath = this.getRelativeExportPath() + availableName
    }

    let archivePaths = []

    let udbPath = homePath + this.itemInfo.item.path
    let uddPath = udbPath.substring(0, udbPath.lastIndexOf('.')) + '.udd'
    //拷贝之前先把datasource的临时media删除 add xiezhy
    let toPath = udbPath.substring(0, udbPath.lastIndexOf('/') + 1) + "Media"
    await FileTools.deleteFile(toPath)
    let mediaPath = await SMap.copyMediaByDatasource({
      server: udbPath,
      engineType: EngineType.UDB,
      alias: udbPath.substring(udbPath.lastIndexOf('/') + 1, udbPath.lastIndexOf('.')),
    },toPath)

    archivePaths = [udbPath, uddPath, mediaPath]

    let result = await FileTools.zipFiles(archivePaths, targetPath)
    return result
  }

  getPagePopupData = () => {
    if (this.from === 'MapView') {
      return this.getCustomPagePopupData()
    }
    return []
  }

  getCustomPagePopupData = () => [
    {
      title: getLanguage(global.language).Profile.NEW_DATASOURCE,
      action: () => {
        this._closeModal()
        NavigationService.navigate('InputPage', {
          placeholder: getLanguage(global.language).Profile
            .ENTER_DATASOURCE_NAME,
          headerTitle: getLanguage(global.language).Profile.SET_DATASOURCE_NAME,
          type: 'name',
          cb: async name => {
            let homePath = await FileTools.appendingHomeDirectory()
            let datasourcePath =
              homePath +
              ConstPath.UserPath +
              this.props.user.currentUser.userName +
              '/' +
              ConstPath.RelativePath.Datasource
            let availableName = await this._getAvailableFileName(
              datasourcePath,
              name,
              'udb',
            )
            availableName = availableName.substring(
              0,
              availableName.lastIndexOf('.'),
            )
            await this.createDatasource(
              datasourcePath,
              availableName,
              availableName,
            )
            this._getSectionData()
            NavigationService.goBack()
          },
        })
      },
    },
  ]

  onItemPress = info => {
    if (this.showMode === 'tap') {
      if(this.props.route.params?.callback) {
        this.props.route.params.callback(info)
        this.props.navigation.goBack()
      }
      return
    }
    if (info?.item.isDirectory) {
      Toast.show(global.language === 'CN' ? 'not UDB data source' : '')
      return
    }
    this.itemInfo = info
    this._openDatasource()
  }

  _openDatasource = () => {
    NavigationService.navigate('MyDataset', {
      data: this.itemInfo.item,
      from: this.from,
    })
  }

  createDatasource = async (
    datasourcePath,
    datasourceName,
    datasourceAlias,
  ) => {
    let newDatasourcePath = datasourcePath + datasourceName + '.udb'
    let datasourceParams = {}
    datasourceParams.server = newDatasourcePath
    datasourceParams.engineType = EngineType.UDB
    datasourceParams.alias = datasourceAlias
    await SMap.createDatasource(datasourceParams)
    SMap.closeDatasource(datasourceAlias)
  }
}

export default MyDatasource
