import React from 'react'
import MenuDialog, { Item } from '../../components/MenuDialog2'
import { ToolBarListOption } from './ToolBarList'
import { Props as SlideItem} from '../../components/Slider'
import { ToolbarColorOption } from './ToolbarColor'
import { IToolbarOption } from '../ToolbarOption'
import { ToolBarBottomItem } from './ToolBarBottom'
import { getImage } from '../../assets'

/** toolbar 菜单参数 */
export interface ToolBarMenuOption {
  /** 当前选中项 */
  defaultIndex?: number
  /** 是否显示view */
  isShowView?: boolean
  data: ToolBarMenuItem[]
}

interface CommonProps {
  title: string
  onPress?: (index: number) => void
}

interface MenuSlide extends CommonProps {
  type: 'slide'
  slideData: SlideItem[]
  /** 页面添加应用功能 */
  apply?: () => void
}

interface MenuList extends CommonProps, ToolBarListOption {
  type: 'list'
}

interface MenuColor extends CommonProps {
  type: 'color'
  data: ToolbarColorOption
}

export type ToolBarMenuItem = MenuSlide | MenuList | MenuColor

export type SupportToolbarOption =  Pick<IToolbarOption, 'slideData' | 'listData' | 'colorOption'>


interface Props {
  data: ToolBarMenuOption
  onSelect: (data: SupportToolbarOption, bottom:  ToolBarBottomItem[]) => void
  toolbarVisible: boolean
}

interface State {
  showMenu: boolean
}

class ToolBarMenu extends React.Component<Props, State> {

  currentIndex = -1

  viewVisible = false

  constructor(props: Props) {
    super(props)

    this.state = {
      showMenu: false,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.data !== this.props.data) {
      this.currentIndex = this.props.data.defaultIndex !== undefined ? this.props.data.defaultIndex : -1
      this.viewVisible = false
      this.setState({
        showMenu: true
      })
    }
  }

  isVisible = (): boolean => {
    return this.props.toolbarVisible && this.props.data.data.length > 0
  }

  showView = (visible: boolean) => {
    if(visible) {
      this.props.onSelect(this.getToolbarOption(this.props.data.data[this.currentIndex]), this.getControlBottom())
    } else {
      this.props.onSelect(this.getDefaultOption(), this.getControlBottom())
    }
    this.viewVisible = visible
  }

  getControlBottom = (): ToolBarBottomItem[] => {
    return [{
      image: getImage().icon_toolbar_option,
      ability: 'menu_toogle',
      onPress: () => {
        // menu界面 显隐
        this.showView(false)
        this.setState({
          showMenu: !this.state.showMenu,
        })
      }
    }, {
      image: getImage().icon_toolbar_style,
      ability: 'menu_view_toogle',
      onPress: () => {
        //view 显隐
        this.showView(!this.viewVisible)
        this.setState({
          showMenu: false,
        })
      }
    }]
  }

  getDefaultOption = (): SupportToolbarOption => {
    return {
      slideData: {data: []},
      listData: { data: [], oneColumn: true, showSelect: true },
      colorOption: {colors: [], onSelect: () => {}}
    }
  }

  getToolbarOption = (item: ToolBarMenuItem): SupportToolbarOption => {
    const option = this.getDefaultOption()

    if(item.type === 'list') {
      option.listData = {...item}
    } else if(item.type === 'slide') {
      option.slideData.data = item.slideData
    } else if(item.type === 'color') {
      option.colorOption = item.data
    }

    return option
  }

  getData = (): Item[] => {
    const arr: Item[] = this.props.data.data.map((item, index) => {
      return {
        key: item.title,
        selectKey: item.title,
        action: ()=> {
          this.currentIndex = index
          this.showView(this.props.data.isShowView === true)
          item.onPress?.(index)
          this.setState({
            showMenu: false,
          })
        }
      }
    })
    return arr
  }

  getDefaultKey = (): string | undefined => {
    if(this.currentIndex > 0 && this.currentIndex < this.props.data.data.length) {
      return this.props.data.data[this.currentIndex].title
    }
    return undefined
  }

  render() {
    if(this.isVisible() && this.state.showMenu) {
      return(
        <MenuDialog
          data={this.getData()}
          autoSelect={true}
          selectKey={this.getDefaultKey()}
        />
      )
    }
    return null
  }
}

export default ToolBarMenu