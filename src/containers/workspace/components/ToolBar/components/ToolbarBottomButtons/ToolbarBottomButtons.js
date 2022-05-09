import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text ,Platform} from 'react-native'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getThemeAssets } from '../../../../../../assets'
import NavigationService from '../../../../../NavigationService'
import { scaleSize ,screen} from '../../../../../../utils'
import { color } from '../../../../../../styles'
import { Height, TouchType } from '../../../../../../constants'
import ToolbarModule from '../../modules/ToolbarModule'

export default class ToolbarBottomButtons extends React.Component {
  props: {
    selection: Array,
    buttons: Array,
    type: string,
    language: string,
    orientation: string,
    toolbarStatus: Object,
    device: Object,
    close: () => {},
    back: () => {}, // 返回上一个Toolbar状态
    showBox: () => {},
    setVisible: () => {},
    existFullMap: () => {},
    setCurrentLayer: () => {},
    getLayers: () => {},
    showMenuBox: () => {},
    menu: () => {},
    getToolbarModule: () => {},
  }

  static defaultProps = {
    buttons: [],
    getToolbarModule: () => ToolbarModule,
  }

  constructor(props) {
    super(props)
    this.lastState = {}
    this.ToolbarModule = this.props.getToolbarModule()
    this.ToolbarModule.addParams({
      buttonView: this, // ToolbarBottomButtons ref
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    // TODO 根据具体情况，判断是否更新
    if (
      JSON.stringify(this.props.selection) !==
        JSON.stringify(nextProps.selection) ||
      JSON.stringify(this.props.buttons) !==
        JSON.stringify(nextProps.buttons) ||
      JSON.stringify(this.props.toolbarStatus) !==
        JSON.stringify(nextProps.toolbarStatus) ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device) ||
      this.props.type !== nextProps.type ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    ) {
      return true
    }
    return false
  }

  //二三维量算功能 撤销事件
  undo = () => {}

  redo = () => {}

  /******************************** 新功能分割线 ********************************/
  /** 提交 **/
  commit = async () => {
    let isFinished = false
    if (
      this.ToolbarModule.getData().actions &&
      this.ToolbarModule.getData().actions.commit
    ) {
      // 返回false表示没有找到对应type的方法，返回undefined表示没有返回值，不作为判断
      isFinished = await this.ToolbarModule.getData().actions.commit(
        this.props.type,
      )
    }
    if (isFinished === false) {
      this.props.close && this.props.close(this.props.type)
      this.ToolbarModule.setData() // 关闭Toolbar清除临时数据
    }
  }

  /** 关闭 **/
  close = async () => {
    let isFinished = false
    // 先设置touch状态再调用自定义close方法 zhangxt
    global.TouchType = TouchType.NORMAL
    if (
      this.ToolbarModule.getData().actions &&
      this.ToolbarModule.getData().actions.close
    ) {
      isFinished = await this.ToolbarModule.getData().actions.close(
        this.props.type,
      )
    }
    if (isFinished === false) {
      this.props.close && this.props.close(this.props.type)
    }
    // this.ToolbarModule.setData() // 关闭Toolbar清除临时数据
  }

  back = () => this.props.back(this.props.type)

  /** 菜单 **/
  menu = () => {
    // 关系到上层组件state变化，交给上层处理
    this.props.menu && this.props.menu({ type: this.props.type })
  }

  /** 菜单和Box切换显示 **/
  showMenuBox = () => {
    // 关系到上层组件state变化，交给上层处理
    this.props.showMenuBox && this.props.showMenuBox({ type: this.props.type })
  }

  /** 显示属性 **/
  showAttribute = () => {
    if (
      this.ToolbarModule.getData().actions &&
      this.ToolbarModule.getData().actions.showAttribute
    ) {
      this.ToolbarModule.getData().actions.showAttribute(this.props.selection)
    }
  }

  /******************************** 新功能分割线 END********************************/

  /** 记录Toolbar上一次的state **/
  setLastState = () => {
    Object.assign(this.lastState, this.state, { height: this.height })
  }

  renderBottomBtn = (item, index) => {
    return (
      <TouchableOpacity
        key={item.type + '-' + index}
        onPress={() => item.action(item)}
        style={styles.button}
      >
        <Image style={styles.img} resizeMode={'contain'} source={item.image} />
        {item.title && <Text style={styles.btnText}>{item.title}</Text>}
      </TouchableOpacity>
    )
  }

  render() {
    let btns = []
    if (this.props.buttons.length === 0) return null
    this.props.buttons.forEach((item, index) => {
      if (!item || (item instanceof Object && !item.type)) return
      let type, image, action, title
      if (item instanceof Object) {
        // 自定义Button
        type = item.type
        image = item.image
        title = item.title
        action = item.action
      } else {
        // 常用按钮
        type = item
      }
      switch (type) {
        case ToolbarBtnType.TOOLBAR_COMMIT:
          image =
            image ||
            getThemeAssets().toolbar.icon_toolbar_submit
          action = action || this.commit
          break
        case ToolbarBtnType.TOOLBAR_DONE:
          image = image ||
            // getThemeAssets().publicAssets.tab_done
            getThemeAssets().toolbar.icon_toolbar_submit
          action = action || this.commit
          break
        case ToolbarBtnType.MENU_FLEX:
          //菜单框-显示与隐藏
          image =
            image ||
            // require('../../../../../../assets/mapEdit/icon_function_theme_param_style.png')
            getThemeAssets().toolbar.icon_toolbar_style
          action = action || this.showMenuBox
          break
        case ToolbarBtnType.CANCEL:
          image =
            image ||
            getThemeAssets().toolbar.icon_toolbar_quit
          action = action || this.close
          break
        case ToolbarBtnType.MENU:
          image =
            image ||
            // require('../../../../../../assets/mapEdit/icon_function_theme_param_menu.png')
            getThemeAssets().toolbar.icon_toolbar_option
          action = action || this.menu
          break
        case ToolbarBtnType.UNDO:
          //二三维 量算功能 撤销按钮
          if (this.props.toolbarStatus.canUndo) {
            action = action || this.undo
            image = image || getThemeAssets().publicAssets.icon_undo_light
          } else {
            image = image || getThemeAssets().publicAssets.icon_undo_disable
          }
          break
        case ToolbarBtnType.REDO:
          //二三维 量算功能 撤销按钮
          if (this.props.toolbarStatus.canRedo) {
            action = action || this.redo
            image = image || getThemeAssets().publicAssets.icon_redo_light
          } else {
            image = image || getThemeAssets().publicAssets.icon_redo_disable
          }
          break
        case ToolbarBtnType.FLEX:
          // image = require('../../../../../../assets/mapEdit/icon_function_theme_param_style.png')
          image = getThemeAssets().toolbar.icon_toolbar_style
          action = () => this.props.showBox()
          break
        case ToolbarBtnType.FLEX_FULL:
          // image = require('../../../../../../assets/mapEdit/flex.png')
          image = getThemeAssets().toolbar.icon_toolbar_style
          action = () => this.props.showBox(true)
          break

        case ToolbarBtnType.COMPLETE:
          image = getThemeAssets().toolbar.icon_toolbar_submit
          action = this.props.close
          break
        case ToolbarBtnType.CANCEL_2:
          image = getThemeAssets().toolbar.icon_toolbar_quit
          action = () => this.props.close(this.props.type, true)
          break
        // case ToolbarBtnType.TAGGING_BACK:
        //   //返回上一级
        //   image = require('../../../../../../assets/public/Frenchgrey/icon-back-white.png')
        //   action = this.taggingBack
        //   break
        case ToolbarBtnType.SHOW_MAP3D_ATTRIBUTE:
          // image = require('../../../../../../assets/mapTools/icon_attribute_white.png')
          image = getThemeAssets().publicAssets.icon_bar_attribute_selected
          action = () => {
            NavigationService.navigate('LayerAttribute3D', { type: 'MAP_3D' })
          }
          break
        // case ToolbarBtnType.VISIBLE:
        //   // 图例的显示与隐藏
        //   image = getPublicAssets().mapTools.tools_legend_on
        //   action = this.changeLegendVisible
        //   break
        // case ToolbarBtnType.NOT_VISIBLE:
        //   // 图例的显示与隐藏
        //   image = getPublicAssets().mapTools.tools_legend_off
        //   action = this.changeLegendVisible
        //   break
        case ToolbarBtnType.TOOLBAR_BACK:
          //返回上一级
          // image = require('../../../../../../assets/public/Frenchgrey/icon-back-white.png')
          image = getThemeAssets().toolbar.icon_toolbar_quit
          action = action || this.back
          break
      }

      if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
        if (type === ToolbarBtnType.PLACEHOLDER) {
          btns.unshift(<View style={styles.button} key={type + '-' + index} />)
        } else if (image) {
          btns.unshift(
            this.renderBottomBtn(
              {
                key: type,
                image: image,
                title: title,
                action: () => action && action(this.props.type),
              },
              index,
            ),
          )
        }
      } else {
        if (type === ToolbarBtnType.PLACEHOLDER) {
          btns.push(<View style={styles.button} key={type + '-' + index} />)
        } else if (image) {
          btns.push(
            this.renderBottomBtn(
              {
                key: type,
                image: image,
                title: title,
                action: () => action && action(this.props.type),
              },
              index,
            ),
          )
        }
      }
    })
    let style
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      style = { ...styles.buttonzLandscape }
      Platform.OS === 'android' ?
        style.height = screen.getScreenSafeHeight(this.props.device.orientation)
        : style.height = this.props.device.height
      if (btns.length === 1) {
        style.justifyContent = 'flex-end' // 只有一个按钮，从底部排列
      }
    } else {
      style = styles.buttonz
    }
    return <View style={style}>{btns}</View>
  }
}

const styles = StyleSheet.create({
  buttonz: {
    flexDirection: 'row',
    height: Height.TOOLBAR_BUTTONS,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonzLandscape: {
    flexDirection: 'column',
    width: Height.TOOLBAR_BUTTONS,
    // height: '100%',
    paddingVertical: scaleSize(20),
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    // flex: 1,
    flexDirection: 'column',
    height: scaleSize(60),
    width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.white,
  },
  img: {
    height: scaleSize(45),
    width: scaleSize(45),
    alignItems: 'center',
    justifyContent: 'center',
  },
})
