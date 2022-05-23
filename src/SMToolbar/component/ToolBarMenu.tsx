import React from 'react'
import MenuDialog, { Item } from '../../components/MenuDialog2'


/** toolbar 菜单参数 */
export interface ToolBarMenuOption {
  /** 当前选中项 */
  key?: string
  data: ToolBarMenuItem[]
}

interface ToolBarMenuItem {
  /** 名称 */
  text: string
  key: string
  /** 选中事件 */
  onSelect: () => void
}

interface Props {
  data: ToolBarMenuOption
  toolbarVisible: boolean
}

class ToolBarMenu extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  isVisible = (): boolean => {
    return this.props.toolbarVisible && this.props.data.data.length > 0
  }

  getData = (): Item[] => {
    const arr: Item[] = this.props.data.data.map(item => {
      return {
        key: item.text,
        selectKey: item.key,
        action: ()=> {
          item.onSelect()
        }
      }
    })
    return arr
  }

  render() {
    if(this.isVisible()) {
      return(
        <MenuDialog
          data={this.getData()}
          autoSelect={true}
          selectKey={this.props.data.key}
        />
      )
    }
    return null
  }
}

export default ToolBarMenu