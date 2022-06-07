import { MyDataPage } from '../component'
import DataHandler from '../../../../utils/DataHandler'
import { FileTools } from '../../../../native'

class MyAIModel extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.aimodel
    this.state = {
      ...this.state,
      shareToLocal: true,
      shareToOnline: true,
      shareToIPortal: true,
      shareToFriend: true,
    }
  }

  getData = async () => {
    let data = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'AIMODEL',
    )

    let sectionData = []
    sectionData.push({
      title: 'AIMODEL',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    if (!this.itemInfo) return false
    let filePath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )

    let result = await FileTools.deleteFile(filePath)

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

    let filePath = homePath + this.itemInfo.item.path
    let archivePaths = [filePath]
    let result = await FileTools.zipFiles(archivePaths, targetPath)

    return result
  }
}

export default MyAIModel
