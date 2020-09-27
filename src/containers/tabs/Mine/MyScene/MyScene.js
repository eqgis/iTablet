import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import RNFS from 'react-native-fs'

class MyScene extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.scene
    this.state = {
      ...this.state,
      shareToLocal: true,
      shareToOnline: true,
      shareToIPortal: true,
    }
  }

  getData = async () => {
    let data = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'SCENE',
    )

    let sectionData = []
    sectionData.push({
      title: 'SCENE',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

   isJSON = (str)=> {
    if (typeof str === 'string') {
      try {
        var obj = JSON.parse(str)
        if (typeof obj === 'object' && obj) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    }
  }
  deleteData = async () => {
    if (!this.itemInfo) return false
    let pxpPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    // debugger
    let value = await RNFS.readFile(pxpPath)
    // debugger
   
    let jsonValue  = JSON.parse(value)
   
    // debugger
    let dirName = jsonValue.Workspace.server.split('/')[0]
    let arr = pxpPath.split('/')
    let scenePath = pxpPath.replace(arr[arr.length-1],dirName)

    // let scenePath = pxpPath?.substring(0,pxpPath.length-4) 

    let result = await FileTools.deleteFile(scenePath)
    result = result && (await FileTools.deleteFile(pxpPath))
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

    let scenePath = homePath + this.itemInfo.item.path
    let pxpPath = scenePath + '.pxp'
    archivePaths = [scenePath, pxpPath]

    let result = await FileTools.zipFiles(archivePaths, targetPath)
    return result
  }
}

export default MyScene
