import { FileTools } from "imobile_for_reactnative"

interface IPath {
  path: string
  [x: string]: string |IPath
}

const AppRootPath = '/iTablet'

/** Common 文件夹及其子文件夹 */
const Common = {
  path: AppRootPath + '/Common',
  Workspace: {
    path:  AppRootPath + '/Common/Workspace'
  }
}

const External = {
  path: AppRootPath + '/ExternalData'
}

/** User 文件夹 */
const User = {
  path: AppRootPath +'/User',
}

/** 各个user目录下的文件夹 */
const UserRoot = {
  path: '',
  Data: {
    path: '/Data',
    Map: {
      path: '/Data/Map'
    },
    Datasource: {
      path: '/Data/Datasource'
    } ,
    ARMap: {
      path: '/Data/ARMap'
    },
    ARDatasource: {
      path: '/Data/ARDatasource'
    },
    ARResource: {
      path: '/Data/ARResource'
    },
    Symbol: {
      path: '/Data/Symbol'
    },
    Template: {
      path: '/Data/Template'
    },
    ARModel: {
      path: '/Data/ARModel'
    },
    ARSandTable: {
      path: '/Data/ARSandTable'
    },
    ARScene: {
      path: '/Data/Scene'
    },
    AREffect: {
      path: '/Data/AREffect'
    },
    AIModel: {
      path: '/Data/AIModel'
    },
    Media: {
      path: '/Data/Media'
    },
    ARSymbol: {
      path: '/Data/ARSymbol'
    }
  },
  Temp: {
    path: '/Temp'
  }
}


/** APP 根目录 */
const AppRoot = {
  path: AppRootPath,
  Common: Common,
  External: External,
  User: User,
}

/** 根据路径创建目录 */
const createPath = async (homePath: string, Dir: IPath) => {
  // console.log(homePath + Dir.path)
  await FileTools.createDirectory(homePath + Dir.path)
  const keys = Object.keys(Dir)
  for(const key in keys) {
    const folder = Dir[keys[key]]
    if(typeof(folder) !== 'string') {
      await createPath(homePath, folder)
    }
  }
}

/** 创建 APP 目录 */
const createAppPath = async (homePath: string) => {
  await createPath(homePath, AppRoot)
}

/** 为一个 user 创建其目录 */
const createUserPath = async (homePath: string, userName: string) => {
  const userPath = homePath + User.path + '/' + userName
  await createPath(userPath, UserRoot)
}

export default AppRoot

export {
  UserRoot,
  createAppPath,
  createUserPath,
  // ARSymbol,
}