/**
 * 用户自定义地图右侧功能基础类
 *
 * 拥有类型检测方法，防止与系统自带类型冲突
 */
import checkType from '../utils/checkType'
import FunctionModule from './FunctionModule'

interface Types {[key: string]: string}

export default class CustomFunctionModule extends FunctionModule{
  TYPES: Types = {}
  constructor(props: any) {
    super(props)
  }

  /**
   * 用于检测Type是否可用，避免与系统自带类型冲突
   * @param types
   */
  setTypes = (types: Types) => {
    checkType.checkCustomToolbarType(types)
    this.TYPES = types || {}
  }
}
