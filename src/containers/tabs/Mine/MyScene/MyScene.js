import { MyDataPage } from '../component'
import DataHandler from '../../../../utils/DataHandler'
import { FileTools } from '../../../../native'
import {SScene,RNFS } from 'imobile_for_reactnative'

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
    //  
    let value = await RNFS.readFile(pxpPath)
    //  
   
    let jsonValue  = JSON.parse(value)
   
    //  
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
      // let availableName = await this._getAvailableFileName(
      //   tempPath,
      //   'MyExport',
      //   '',
      // )
      targetPath = tempPath + "MyExport"
      // this.exportPath = targetPath
    } else {
      let exportPath = homePath + this.getRelativeExportPath()
      // let availableName = await this._getAvailableFileName(
      //   exportPath,
      //   name,
      //   '',
      // )
      targetPath = exportPath + name
      // this.exportPath = this.getRelativeExportPath() + availableName
    }
    // let archivePaths = []

    // let scenePath = homePath + this.itemInfo.item.path
    // let pxpPath = scenePath + '.pxp'
    // archivePaths = [scenePath, pxpPath]

    // let result = await FileTools.zipFiles(archivePaths, targetPath)

     
    //重构了部分代码，尽量使用原有接口， add 谢直言
    let result = await SScene.exportScene(name, targetPath)
     
    if (result) {
      const zipPath = targetPath+'.zip'
       
      result = await FileTools.zipFile(targetPath, zipPath)
       
      if (result) {
         
        await FileTools.deleteFile(targetPath)
        this.exportPath = zipPath
         
      }
    } else {
       
      Toast.show(getLanguage(global.language).Prompt.EXPORT_FAILED)
      // '导出失败')
    }
    return result
  }
}

export default MyScene
