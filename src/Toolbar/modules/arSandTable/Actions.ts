import { ConstPath } from "@/constants"
import DataHandler from "@/containers/tabs/Mine/DataHandler"
import { AppLog, AppToolBar } from "@/utils"
import { FileTools, SARMap } from "imobile_for_reactnative"



// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function addModelToSandTable() {
  const { sandTableModels } = AppToolBar.getData()
  if(sandTableModels != undefined) {
    const homePath = await FileTools.getHomeDirectory()
    const paths:string[] = []
    for(let i = 0; i < sandTableModels.length; i++) {
      paths.push(homePath + sandTableModels[i])
    }
    SARMap.addModelToSandTable(paths)
  } else {
    AppLog.error('未选中模型！')
  }

}

/** 另存沙盘模型到指定路径 */
export async function saveARSandTable(name: string) {
  const homePath = await FileTools.getHomeDirectory()
  const targetPath = homePath + ConstPath.ExternalData

  const availableName = await DataHandler.getAvailableName(targetPath, name, 'directory')
  return await SARMap.saveAsARSandTable(availableName, targetPath)
}