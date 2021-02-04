import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { ConstPath } from '../../../../constants'
import RNFS from 'react-native-fs'

class MyMap extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.map
    this.state = {
      ...this.state,
      shareToLocal: true,
      shareToOnline: true,
      shareToIPortal: true,
      shareToWechat: true,
      shareToFriend: true,
      showFullInMap: true,
    }
  }

  getData = async () => {
    let data = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'MAP',
    )

    let sectionData = []
    sectionData.push({
      title: 'MAP',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    if (!this.itemInfo) return false
    let mapPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    let mapExpPath = mapPath.substring(0, mapPath.lastIndexOf('.')) + '.exp'

    let result = await FileTools.deleteFile(mapPath)
    result = result && (await FileTools.deleteFile(mapExpPath))

    let dataPath = this.itemInfo.item.path.split('Data')
    let animationPath = await FileTools.appendingHomeDirectory(
      dataPath[0] +
      'Data/Animation/' +
      this.itemInfo.item.name.substring(
        0,
        this.itemInfo.item.name.lastIndexOf('.'),
      ),
    )
    let path = animationPath
    result && (await FileTools.deleteFile(path))

    return result
  }

  //新增参数template判断导出地图是否为模版
  exportData = async (name, exportToTemp = true, template = false) => {
    if (!this.itemInfo) return false
    let mapPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    let mapExpPath = mapPath.substring(0, mapPath.lastIndexOf('.')) + '.exp'

    let info = await RNFS.readFile(mapExpPath)
    let infoJson = JSON.parse(info)
    let Teminfo = infoJson.Template

    // 存放模版的文件目录
    let collectionDirName = name

    if (Teminfo) {
      let homePath = await FileTools.appendingHomeDirectory()
      let filePath = homePath + '/iTablet/User/' + Teminfo
      let toPath = homePath +
        ConstPath.ExternalData + '/' +
        ConstPath.RelativeFilePath.ExportData +
        name
      if (template) {
        let collectionPath = `${homePath + ConstPath.ExternalData}/Collection/`
        let tempName = name
        let postfix = 0
        // 模版文件目录重名处理
        while(await FileTools.fileIsExist(collectionPath + tempName)){
          tempName = name + '_' + (++postfix)
        }
        collectionDirName = tempName
        toPath = homePath +
          ConstPath.ExternalData + '/' +
          'Collection/' +
          collectionDirName
      }
      await FileTools.createDirectory(toPath)
      await FileTools.copyFile(filePath, toPath + Teminfo.substring(Teminfo.lastIndexOf('/')), true)
    }else {
      if (template) {
        return false
      }
    }

    let mapName = name
    let homePath = await FileTools.appendingHomeDirectory()
    let path =
      homePath +
      ConstPath.ExternalData + '/' +
      ConstPath.RelativeFilePath.ExportData +
      mapName +
      '/' +
      mapName +
      '.smwu'
    if (template) {
      path =
        homePath +
        ConstPath.ExternalData + '/' +
        'Collection/' +
        collectionDirName +
        '/' +
        mapName +
        '.smwu'
    }
    let zipPath
    if (exportToTemp) {
      let tempPath = homePath + this.getRelativeTempPath()
      let availableName = await this._getAvailableFileName(
        tempPath,
        'MyExport',
        'zip',
      )
      zipPath = tempPath + availableName
      this.exportPath = zipPath
    } else {
      let exportPath = homePath + this.getRelativeExportPath()
      if (template) {
        exportPath = homePath + this.getRelativeExportTemplatePath()
      }
      let availableName = await this._getAvailableFileName(
        exportPath,
        collectionDirName,
        'zip',
      )
      zipPath = exportPath + availableName
      this.exportPath = this.getRelativeExportPath() + availableName
      if (template) {
        this.exportPath = ConstPath.ExternalData + '/' +
        'Collection/' +
        collectionDirName +
        '/' +
        mapName +
        '.smwu'
      }
    }

    let exportResult = false
    await this.props.exportWorkspace(
      { maps: [mapName], outPath: path, isOpenMap: true, zipPath, template: template },
      result => {
        exportResult = result
      },
    )

    return exportResult
  }
}

export default MyMap
