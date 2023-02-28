import FunctionModule from '@/class/FunctionModule'
import { IToolbarType } from '@/constants/ToolbarType'
import screen from '../../../../../utils/screen'
import ToolBar, {Props, DefaultProps} from '../ToolBar'
import { ToolbarModuleKey } from './modulesKeys'
import ToolBarHeight from './ToolBarHeight'
import ToolbarModuleUtils from './ToolbarModuleUtils'

type ToolbarProps = Props & DefaultProps

interface ToolbarModuleParam extends ToolbarProps {
  type: ToolbarModuleKey
  setToolbarVisible: ToolBar['setVisible']
  showBox: ToolBar['showBox']
  setLastState: ToolBar['setLastState']
  showMenuBox: ToolBar['showMenuBox']
  mapMoveToCurrent: ToolBar['mapMoveToCurrent']
  contentView: ToolBar['contentView']
  buttonView: ToolBar['buttonView']
}


interface ToolbarModuleData {

}

export class ToolbarModule {

  _params: ToolbarModuleParam

  _data: ToolbarModuleData

  constructor() {
    this._params = {} // 外部数据和方法 Toolbar props
    this._data = {} // 临时数据
  }

  setParams(params: ToolbarModuleParam = {}) {
    this._params = params
  }

  addParams(params: Partial<ToolbarModuleParam> = {}) {
    Object.assign(this._params, params)
  }

  getParams() {
    return this._params
  }

  setData(data: ToolbarModuleData = {}) {
    this._data = data
  }

  addData(data: Partial<ToolbarModuleData> = {}) {
    Object.assign(this._data, data)
  }

  getData() {
    return this._data
  }

  /** 获取Toolbar 高度、行数、列数 **/
  getToolbarSize(type: keyof IToolbarType, additional = {}) {
    try {
      const params = this.getParams()
      let toolbarSize = {}
      const data = this.getData()
      let orientation
      if (params && params.device && params.device.orientation) {
        orientation = params.device.orientation
      } else {
        orientation = screen.getOrientation()
      }
      // 找当前模块下自定义的getToolbarSize，如果返回false，则去ToolBarHeight中去获取对应类型高度
      if (data && data.getToolbarSize) {
        toolbarSize = data.getToolbarSize(type, orientation, additional)
      }
      if (!toolbarSize || Object.keys(toolbarSize).length === 0) {
        toolbarSize = ToolBarHeight.getToolbarSize(type, orientation, additional)
      }
      return toolbarSize
    } catch (error) {
      return {}
    }
  }

  _modules = []

  getModules() {
    try {
      return ToolbarModuleUtils.getModules(this)
    } catch (error) {
      return []
    }
  }

  add(param: () => FunctionModule) {
    try {
      ToolbarModuleUtils.add(this, param)
    } catch(e) {
      __DEV__ && console.warn(e)
    }
  }

  /**
   * 添加小小插件自定义地图工具栏模块
   */
  addAppletModule(param: () => FunctionModule) {
    try {
      ToolbarModuleUtils.addAppletModule(param)
    } catch(e) {
      __DEV__ && console.warn(e)
    }
  }

  getModule(type: ToolbarModuleKey, params = {}) {
    try {
      return ToolbarModuleUtils.getModule(this, type, params)
    } catch (error) {
      return []
    }
  }

  /**
   * 获取Toolbar内容数据和底部对应按钮
   * @param type
   * @param params
   * @returns {Promise.<{data, buttons}>}
   */
  async getToolBarData(type: ToolbarModuleKey, params = {}) {
    let toolBarData = {
      data: [],
      buttons: [],
    }

    try {
      const module = this.getModule(type, params)
      if (module && module.getData) {
        toolBarData = await module.getData(type, params)
      }
      return toolBarData
    } catch(e) {
      return toolBarData
    }
  }

  async setToolBarData(type: ToolbarModuleKey, params = {}) {
    try {
      const module = this.getModule(type, params)
      if (module && module.setModuleData) {
        module.setModuleData(type)
      }
    } catch(e) {
      __DEV__ && console.warn(e)
    }
  }

  /**
   * 获取菜单弹框数据
   * @param type
   * @param others {themeType}
   * @returns {Array}
   */
  getMenuDialogData(type: ToolbarModuleKey, ...others) {
    try {
      const module = this.getModule(type)
      const data = (module?.getMenuData && module.getMenuData(type, ...others)) || []
      return data
    } catch(e) {
      return []
    }
  }

  /**
   * 获取自定义Header数据
   * getHeaderView优先级高于getHeaderData
   * @param type
   * @param others {themeType}
   * @returns {Array}
   */
  getHeaderData(type: ToolbarModuleKey, ...others) {
    try {
      if (!type) return null
      const module = this.getModule(type)
      const data = (module?.getHeaderData && module.getHeaderData(type, ...others)) || undefined
      return data
    } catch(e) {
      return null
    }
  }

  /**
   * 获取自定义Header
   * 优先于getHeaderData
   * @param type
   * @param others {themeType}
   * @returns {Array}
   */
  getHeaderView(type: ToolbarModuleKey, ...others) {
    try {
      if (!type) return null
      const module = this.getModule(type)
      const header = (module?.getHeaderView && module.getHeaderView(type, ...others)) || undefined
      return header
    } catch(e) {
      return null
    }
  }

  /**
   * 获取自定义界面
   * @param type
   * @returns {Array}
   */
  getCustomView(type: ToolbarModuleKey, ...others) {
    if (!type) return null
    const module = this.getModule(type)
    const bottomView = (module?.getCustomView && module.getCustomView(type, ...others)) || undefined
    return bottomView
  }

  /**
   * 获取底部自定义界面
   * @param type
   * @returns {Array}
   */
  getBottomView(type: ToolbarModuleKey, ...others) {
    if (!type) return null
    const module = this.getModule(type)
    const bottomView = (module?.getBottomView && module.getBottomView(type, ...others)) || undefined
    return bottomView
  }
}

const defaultModule = new ToolbarModule()
const modules = new Map()

function getToolbarModule(key: string) {
  if (!modules.has(key)) {
    modules.set(key, new ToolbarModule())
  }
  return modules.get(key)
}

function deleteToolbarModule(key: string) {
  if (modules.has(key)) {
    modules.delete(key)
  }
}

export { getToolbarModule, deleteToolbarModule }

export default defaultModule
