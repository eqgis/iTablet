import React from 'react'
import { ScaledSize, StyleSheet, TouchableOpacity } from 'react-native'
import ToolBarBottom from './component/ToolBarBottom'
import ToolBarFloatBar from './component/ToolBarFloatBar'
import ToolBarList from './component/ToolBarList'
import ToolBarMenu, { SupportToolbarOption } from './component/ToolBarMenu'
import ToolBarSlide from './component/ToolBarSlide'
import { AppLog, AppStyle } from '../utils'
import { ModuleProps, ToolbarModuleViewProps } from './ToolbarModule'
import { ToolbarModuleData } from './ToolbarModuleData'
import { IToolbarOption, ToolbarOption, ToolBarBottomItem } from './ToolbarOption'
import ToolbarSlideHeader from './component/ToolbarSlideHeader'
import ToolbarSelectionList from './component/ToolbarSelectionList'
import ToolbarTabContainer from './component/ToolbarTab/ToolbarTabContainer'
import ToolbarColor from './component/ToolbarColor'

export interface ToolbarProps<ParamList> extends React.ClassAttributes<ToolBarContainer<ParamList>>{
  initModule?: {name: keyof ParamList, key: ParamList[keyof ParamList]}
  windowSize: ScaledSize
  visibleChange: (visible: boolean) => void
  /** 点击背景事件 默认为关闭toolbar */
  onOverlayPress?: () => void
}

interface State<ParamList> extends IToolbarOption {
  visible: boolean
  module?: {name: keyof ParamList, key: ParamList[keyof ParamList]}
}

class ToolBarContainer<ParamList> extends React.Component<ToolbarProps<ParamList>, State<ParamList>> {

  toolbarTabRef: ToolbarTabContainer | null = null
  toolbarList: ToolBarList | null = null

  modules: ToolbarModuleData<ParamList>[]

  constructor(props: ToolbarProps<ParamList>) {
    super(props)

    this.modules = this._getModules()
    let data: ToolbarOption<unknown> | undefined
    if(this.props.initModule) {
      data = this.modules.find(item => item.name === this.props.initModule?.name)?.getData(this.props.initModule.key)
    }
    const option = new ToolbarOption()
    if(data) {
      Object.assign(option, data)
    }
    this.state = {
      visible: !!this.props.initModule,
      module: this.props.initModule,
      ...option,
    }

  }

  _getModules = () => {
    const modules: ToolbarModuleData<ParamList>[] = []
    React.Children.map(this.props.children, child => {
      if(React.isValidElement<ModuleProps<ParamList>>(child)) {
        modules.push(child.props.data)
      }
    })
    return modules
  }

  onOverlayPress = () => {
    const backBottom = this.state.bottomData.find(item => item.ability === 'back')
    if(backBottom) {
      backBottom.onPress()
    } else if(this.props.onOverlayPress) {
      this.props.onOverlayPress()
    } else {
      this.setVisible(false)
    }
  }

  setVisible = <name extends keyof ParamList>(
    visible: boolean,
    module?: { name: name, key: ParamList[name]}
  ) => {
    const isVisibleChange = visible !== this.state.visible
    if(module) {
      const data = this.modules.find(item => item.name === module.name )?.getData(module.key)
      if(data) {
        this.setState({
          visible,
          module,
          ...data,
          moduleData: data.moduleData,
        }, data.pageAction)
        isVisibleChange && this.props.visibleChange(visible)
      } else {
        //获取不到data说明1: 模块错误；2:key错误；3:相应模块页面没有实现getData方法
        AppLog.error('getData method not implemented')
      }
    } else {
      this.setState({
        visible
      })
      isVisibleChange && this.props.visibleChange(visible)
    }
  }

  /**
   * 根据选中的 menu 数据来更新toolbar
   * 此时 toobar 仍在当前的 module 页面中，不会改变
   */
  setMenuView = (data: SupportToolbarOption, bottom: ToolBarBottomItem[]) => {
    let currentBottom = this.state.bottomData
    const hasMenuControl = currentBottom.find(item => {
      return item.ability === 'menu_toogle' || item.ability === 'menu_view_toogle'
    })
    if(currentBottom.length > 0 && !hasMenuControl) {
      currentBottom = currentBottom.concat([])
      currentBottom.splice(1, 0, ...bottom)
    }
    this.setState({
      ...data,
      bottomData: currentBottom,
    })
  }

  resetTabData = () => {
    this.toolbarTabRef?.reset?.()
  }

  showTabView = (visible: boolean) => {
    this.toolbarTabRef?.showTabView(visible)
  }

  /** 切换 ToolbarList 的显隐 */
  toggleListVisible = () => {
    this.toolbarList?.toggleHide()
  }

  setToolBarListIndex = (index:number) => {
    this.toolbarList?.setState({selectedIndex:index})
  }

  renderViews = () => {
    return (
      <>
        {this.renderModules()}

        <ToolbarSlideHeader
          toolbarVisible={this.state.visible}
          option={this.state.slideHeaderData}
          windowSize={this.props.windowSize}
        />

        <ToolBarFloatBar
          toolbarVisible={this.state.visible}
          data={this.state.floatBottomData}
        />

        <ToolBarMenu
          toolbarVisible={this.state.visible}
          data={this.state.menuData}
          onSelect={this.setMenuView}
        />
      </>
    )
  }

  renderModules = (position: 'full' | 'bottom' = 'full') => {
    return  React.Children.map(this.props.children, child => {
      if(!React.isValidElement<ModuleProps<ParamList>>(child)) {
        return child
      }
      let Component: React.ComponentType<ToolbarModuleViewProps<unknown>> | undefined = undefined
      if(position === 'full') {
        Component = child.props.data.customView
      } else {
        Component = child.props.data.customViewBottom
      }
      if(!Component) return null
      const visible = this.state.visible && this.state.module?.name === child.props.name
      return (
        <Component
          visible={visible}
          data={visible && this.state.moduleData}
          {...this.props}
        />)
    })
  }

  renderList = () => {
    return (
      <>
        {this.renderModules('bottom')}

        <ToolBarSlide
          toolbarVisible={this.state.visible}
          data={this.state.slideData}
          windowSize={this.props.windowSize}
        />
        <ToolBarList
          ref={ref => this.toolbarList = ref}
          data={this.state.listData.data}
          visible={this.state.visible}
          oneColumn={this.state.listData.oneColumn !== false}
          showSelect={this.state.listData.showSelect === true}
          getExtraData={this.state.listData.getExtraData}
          animation={true}
          windowSize={this.props.windowSize}
        />
        <ToolbarColor
          toolbarVisible={this.state.visible}
          data={this.state.colorOption}
          windowSize={this.props.windowSize}
        />
        <ToolbarTabContainer
          ref={ref => this.toolbarTabRef = ref}
          option={this.state.tabOption}
          toolbarVisible={this.state.visible}
          windowSize={this.props.windowSize}
        />
        <ToolbarSelectionList
          toolbarVisible={this.state.visible}
          option={this.state.selectionListData}
          windowSize={this.props.windowSize}
        />
      </>
    )
  }

  renderBottom = () => {
    return (
      <ToolBarBottom
        data={this.state.bottomData}
        visible={this.state.visible}
        renderView={this.renderList}
        windowSize={this.props.windowSize}
      />
    )
  }

  render() {
    return(
      <>
        {this.state.visible && this.state.showBackground && (
          <TouchableOpacity
            onPress={this.onOverlayPress}
            style={[StyleSheet.absoluteFill, {backgroundColor: AppStyle.Color.BLACK, opacity: 0.6}]}
            activeOpacity={0.6}
          />)
        }
        {this.renderViews()}
        {this.renderBottom()}
      </>
    )
  }
}

export default ToolBarContainer