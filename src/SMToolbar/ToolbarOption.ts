import { ToolBarBottomItem } from './component/ToolBarBottom'
import { ToolbarColorOption } from './component/ToolbarColor'
import { FloatBottomOption } from './component/ToolBarFloatBar'
import { ToolBarListItem, ToolBarListOption } from './component/ToolBarList'
import { ToolBarMenuOption } from './component/ToolBarMenu'
import { SelectionListOption } from './component/ToolbarSelectionList'
import { ToolBarSlideOption } from './component/ToolBarSlide'
import { ToolbarSlideHeaderOption } from './component/ToolbarSlideHeader'
import { ToolbarTabOption } from './component/ToolbarTab/ToolbarTabContainer'

export {
  ToolBarBottomItem,
  FloatBottomOption,
  ToolBarListOption,
  ToolBarListItem,
  ToolBarMenuOption,
  SelectionListOption,
  ToolBarSlideOption,
  ToolbarSlideHeaderOption,
  ToolbarTabOption,
}


/** 显示 toolbar 所需参数 */
export interface IToolbarOption {

  /** 显示toolbar后立即执行的方法 */
  pageAction: () => void

  /** 模块自定义数据 */
  moduleData?: unknown

  /** 是否显示半透明的遮罩 */
  showBackground: boolean

  slideHeaderData: ToolbarSlideHeaderOption

  /** toolbar list 所需的数据 */
  listData: ToolBarListOption

  colorOption: ToolbarColorOption

  /** toolbar bottom 所需的数据 */
  bottomData: Array<ToolBarBottomItem>

  /** 浮动底部工具栏所需数据 */
  floatBottomData: FloatBottomOption

  /** 显示菜单所需数据  tabOption和 menuData是等价的，可以互换 */
  menuData: ToolBarMenuOption

  slideData: ToolBarSlideOption

  /**
   *  tab 数据  tabOption和 menuData是等价的，可以互换
   *  @deprecated iTablet中最好替换为menuData，使用iTablet的风格
   */
  tabOption: ToolbarTabOption

  /** 选择列表，支持单选 多选 */
  selectionListData?: SelectionListOption<unknown>

}


export class ToolbarOption<ModuleOption> implements IToolbarOption {

  pageAction = () => {}

  moduleData?: ModuleOption = undefined

  showBackground = false

  slideHeaderData: ToolbarSlideHeaderOption = {visible: false, data: [],selectIndex: 0}

  listData: ToolBarListOption = { data: [], oneColumn: true, showSelect: true }

  colorOption: ToolbarColorOption = { colors: [], onSelect: () => {}}

  bottomData: Array<ToolBarBottomItem> = []

  floatBottomData: FloatBottomOption = { data: []}

  menuData: ToolBarMenuOption = {data:[]}

  slideData: ToolBarSlideOption = {data: []}

  tabOption: ToolbarTabOption = {data: []}

  selectionListData?: SelectionListOption<unknown> = undefined

}
