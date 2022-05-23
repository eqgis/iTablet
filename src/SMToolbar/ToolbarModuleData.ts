import { ImageRequireSource } from 'react-native'
import { ToolbarOption } from './ToolbarOption'


export type ToolbarModuleData<ModuleList> = ModuleData<ModuleList, keyof ModuleList>

interface ModuleData<ModuleList, key extends keyof ModuleList> {
  name: key
  image: ImageRequireSource
  /** functiontoolbar 点击事件 */
  action: () => void
  /** 获取名称 */
  getTitle: () => string
  /** 根据 key 获取内部数据 */
  getData(key: ModuleList[key]): ToolbarOption<unknown>

  customView?: React.ComponentType<any>
  customViewBottom?: React.ComponentType<any>
}

/** toolbar 的自定义回调，toolbar module 实现 */
// export interface ToolBarActions {

// }
