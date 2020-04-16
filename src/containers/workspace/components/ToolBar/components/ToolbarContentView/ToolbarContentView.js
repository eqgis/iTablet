import React from 'react'
import { View, Animated, Text, FlatList } from 'react-native'
import {
  ToolbarType,
  ConstToolType,
  Const,
  Height,
} from '../../../../../../constants'
import { color } from '../../../../../../styles'
import { setSpText } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { ColorTable } from '../../../../../mapSetting/secondMapSettings/components'
import { Row, MTBtn, Picker } from '../../../../../../components'
import SymbolTabs from '../../../SymbolTabs'
import SymbolList from '../../../SymbolList'
import ToolList from '../ToolList'
import ToolbarTableList from '../ToolbarTableList'
import ToolbarHeight from '../../modules/ToolBarHeight'
import ToolbarModule from '../../modules/ToolbarModule'
import styles from './styles'

export default class ToolbarContentView extends React.Component {
  props: {
    type: any,
    containerType: string,
    device: Object,
    currentLayer: Object,
    data: Array,
    language: string,
    selection: Array,
    existFullMap: () => {},
    importSceneWorkspace: () => {},
    refreshLayer3dList: () => {},
    changeLayerList: () => {},
    setVisible: () => {},
    showBox: () => {},
    showFullMap: () => {},
    getMapSetting: () => {},
    setTemplate: () => {},
    customView: () => {},
    // showMap3DTool: () => {},
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props)
    const data = ToolbarHeight.getToolbarSize(props.containerType, {
      data: props.data,
    })
    this.height = data.height
    this.state = {
      column: data.column,
      row: data.row,
      boxHeight: new Animated.Value(this.height),
      listSelectable: false,
      clipSetting: {},
      isShow: true, // 是否显示Content
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // let data = ToolbarHeight.getToolbarHeight(nextProps.device.orientation, nextProps.type)
    if (
      // this.height !== 0 ||
      this.props.type !== nextProps.type ||
      this.props.containerType !== nextProps.containerType ||
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device) ||
      JSON.stringify(this.props.currentLayer) !==
        JSON.stringify(nextProps.currentLayer) ||
      JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data) ||
      JSON.stringify(this.props.selection) !==
        JSON.stringify(nextProps.selection) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    // 点采集，GPS打点类型为0
    if (this.props.type !== undefined && this.props.type !== prevProps.type) {
      this.onChangeHeight(this.props.device.orientation, this.props.type)
    }
  }

  // TODO 每次更改高度和列数的方式可能会两次次setState，需要优化
  onChangeHeight = async () => {
    let _data = ToolbarHeight.getToolbarSize(this.props.containerType, {
      data: this.props.data,
    })
    if (
      this.height !== _data.height ||
      this.state.column !== _data.column ||
      this.state.row !== _data.row
    ) {
      this.height = _data.height
      this.changeHeight(_data)
    }
  }

  // Box内容框的显示和隐藏
  changeHeight = params => {
    let change = _params => {
      if (
        !isNaN(_params.height) &&
        JSON.stringify(this.state.boxHeight) !== _params.height.toString()
      ) {
        this.height = _params.height
        let animate = Animated.timing(this.state.boxHeight, {
          toValue: this.height,
          duration: Const.ANIMATED_DURATION,
        })
        if (_params.wait) {
          return animate
        }

        // 防止收缩回去后，图标依然显示问题
        let isShow = this.height !== 0
        if (
          this.props.containerType === ToolbarType.table ||
          this.props.containerType === ToolbarType.table
        ) {
          if (this.state.isShow) {
            animate.start(() => {
              if (this.state.isShow !== isShow) {
                this.setState({
                  isShow,
                })
              }
            })
          } else {
            if (this.state.isShow !== isShow) {
              this.setState(
                {
                  isShow,
                },
                () => {
                  setTimeout(() => animate.start(), 100)
                },
              )
            } else {
              animate.start()
            }
          }
        } else {
          if (!this.state.isShow) {
            this.setState(
              {
                isShow: true,
              },
              () => {
                setTimeout(() => animate.start(), 100)
              },
            )
          } else {
            animate.start()
          }
        }
      }
    }
    let newState = {}
    if (typeof params === 'number') {
      return change({ height: params })
    } else if (
      params.column !== undefined &&
      params.column !== this.state.column
    ) {
      newState.column = params.column
    }
    if (params.row !== undefined && params.row !== this.state.row) {
      newState.row = params.row
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState)
    }
    return change(params)
  }

  getContentHeight = () => {
    return this.state.boxHeight
  }

  /***************************************** InputView ***************************************/
  //标注 RecordSet数据改变
  _onValueChange = ({ title, text }) => {
    switch (title) {
      case getLanguage(global.language).Map_Main_Menu.TOOLS_NAME:
        ToolbarModule.addData({
          tools_name: text,
        })
        // this.tools_name = text
        break
      case getLanguage(global.language).Map_Main_Menu.TOOLS_REMARKS:
        ToolbarModule.addData({
          tools_remarks: text,
        })
        // this.tools_remarks = text
        break
      case getLanguage(global.language).Map_Main_Menu.TOOLS_HTTP:
        ToolbarModule.addData({
          tools_http: text,
        })
        // this.tools_http = text
        break
    }
  }

  renderInputView = () => {
    let data = this.props.data[0]
    let renderList = ({ item }) => {
      return (
        <Row
          style={styles.row}
          customRightStyle={styles.customInput}
          title={item.title}
          getValue={this._onValueChange}
          defaultValue={item.value}
        />
      )
    }
    if (data) {
      return (
        <View>
          <View style={styles.textHeader}>
            <Text style={styles.textFont}>{data.title}</Text>
          </View>
          <FlatList
            renderItem={renderList}
            data={data.data}
            keyExtractor={(item, index) => item.value + index}
          />
        </View>
      )
    }
    return null
  }

  /***************************************** ToolBarSectionList ***************************************/
  renderList = () => {
    if (this.props.data.length === 0) return
    return (
      <ToolList
        ref={ref => (this.toolBarSectionList = ref)}
        type={this.props.type}
        data={this.props.data}
        containerType={this.props.containerType}
        getMapSetting={this.props.getMapSetting}
        setTemplate={this.props.setTemplate}
        setToolbarVisible={this.props.setVisible}
        headerAction={this.headerAction}
        underlayColor={color.item_separate_white}
        keyExtractor={(item, index) => index}
        device={this.props.device}
        language={this.props.language}
      />
    )
  }
  /***************************************** SymbolTabs ***************************************/
  renderTabs = () => {
    return (
      <SymbolTabs
        style={styles.tabsView}
        showToolbar={this.props.setVisible}
        showBox={this.props.showBox}
      />
    )
  }

  /***************************************** SymbolList ***************************************/
  renderSymbol = () => {
    return (
      <SymbolList
        device={this.props.device}
        layerData={this.props.currentLayer}
        type={this.props.type}
        column={this.state.column}
      />
    )
  }

  /***************************************** Table ***************************************/
  renderTable = () => {
    return (
      <ToolbarTableList
        data={this.props.data}
        type={this.props.type}
        containerType={this.props.containerType}
        column={this.state.column}
        row={this.state.row}
        device={this.props.device}
        language={this.props.language}
      />
    )
  }

  /***************************************** HorizontalTable ***************************************/
  renderHorizontalTable = () => {
    let numColumns = 1
    return (
      <FlatList
        key={this.props.device.orientation + '_ScrollView'}
        renderItem={({ item, index }) => {
          return (
            <MTBtn
              key={(item.key || item.title) + '_' + index}
              style={[
                {
                  width: Height.TABLE_ROW_HEIGHT_4,
                  height: Height.TABLE_ROW_HEIGHT_4,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              title={item.title}
              textColor={item.disable ? '#A0A0A0' : color.font_color_white}
              textStyle={{ fontSize: setSpText(20) }}
              image={item.image}
              background={item.background}
              onPress={() => {
                if (item.disable) return
                if (
                  ToolbarModule.getData().actions &&
                  ToolbarModule.getData().actions.tableAction
                ) {
                  ToolbarModule.getData().actions.tableAction(item)
                }
                if (item.action) {
                  item.action(item)
                }
              }}
            />
          )
        }}
        data={this.props.data}
        keyExtractor={(item, index) => item.title + index}
        numColumns={numColumns}
        style={[
          { backgroundColor: color.content_white },
          this.props.device.orientation.indexOf('PORTRAIT') === 0
            ? { height: Height.TABLE_ROW_HEIGHT_4 * numColumns }
            : { width: Height.TABLE_ROW_HEIGHT_4 * numColumns },
        ]}
        horizontal={this.props.device.orientation.indexOf('PORTRAIT') === 0}
        extraData={this.props.device.orientation}
      />
    )
    // return (
    //   <HorizontalTableList
    //     data={this.props.data}
    //     numColumns={this.state.column}
    //     renderCell={({ item, index }) => {
    //       let column = this.state.column
    //       return (
    //         <MTBtn
    //           style={[styles.cell, { flex: 1, backgroundColor: 'gray' }]}
    //           // key={rowIndex + '-' + index}
    //           title={item.title}
    //           textColor={item.disable ? '#A0A0A0' : color.font_color_white}
    //           textStyle={{ fontSize: setSpText(20) }}
    //           // size={MTBtn.Size.NORMAL}
    //           image={item.image}
    //           background={item.background}
    //           onPress={() => {
    //             if (item.disable) return
    //             if (
    //               ToolbarModule.getData().actions &&
    //               ToolbarModule.getData().actions.tableAction
    //             ) {
    //               ToolbarModule.getData().actions.tableAction(item)
    //             }
    //             if (item.action) {
    //               item.action(item)
    //             }
    //           }}
    //         />
    //       )
    //     }}
    //     device={this.props.device}
    //   />
    // )
  }

  /***************************************** ColorTable ***************************************/
  renderColorTable = () => {
    return (
      <ColorTable
        language={this.props.language}
        data={this.props.data}
        device={this.props.device}
        column={this.state.column}
        itemAction={async item => {
          if (
            ToolbarModule.getData().actions &&
            ToolbarModule.getData().actions.tableAction
          ) {
            let params = {
              type: this.props.type,
              key: typeof item === 'string' ? item : item.key,
              layerName: this.props.currentLayer.name,
            }
            typeof item === 'object' && Object.assign(params, item)
            await ToolbarModule.getData().actions.tableAction(params)
          }
          if (
            ToolbarModule.getData().actions &&
            ToolbarModule.getData().actions.colorAction
          ) {
            let params = {
              type: this.props.type,
              key: typeof item === 'string' ? item : item.key,
              layerName: this.props.currentLayer.name,
            }
            typeof item === 'object' && Object.assign(params, item)
            await ToolbarModule.getData().actions.colorAction(params)
          }
        }}
      />
    )
  }

  /***************************************** Picker ***************************************/
  renderPicker = () => {
    return (
      <Picker
        ref={ref => (this.picker = ref)}
        language={GLOBAL.language}
        confirm={data => {
          if (
            ToolbarModule.getData().actions &&
            ToolbarModule.getData().actions.pickerConfirm
          ) {
            let item = data instanceof Array ? [data[0].key, data[1].key] : data
            ToolbarModule.getData().actions.pickerConfirm({
              selectKey: item,
              selectName: item,
            })
          }
        }}
        cancel={() => {
          if (
            ToolbarModule.getData().actions &&
            ToolbarModule.getData().actions.pickerCancel
          ) {
            ToolbarModule.getData().actions.pickerCancel()
          }
        }}
        popData={this.props.data}
        viewableItems={3}
      />
    )
  }

  render() {
    let box
    if (!this.state.isShow) return <View />
    if (this.props.customView) {
      box = this.props.customView(this.props, this.state)
    } else {
      switch (this.props.containerType) {
        case ToolbarType.list:
        case ToolbarType.selectableList:
          if (this.props.data.length === 0) return <View /> // 若当前无数据，则不显示
          switch (this.props.type) {
            case ConstToolType.MAP_TOOL_TAGGING_SETTING:
              box = this.renderInputView()
              break
            case ConstToolType.PLOT_ANIMATION_XML_LIST:
            default:
              box = this.renderList()
              break
          }
          break
        case ToolbarType.tabs:
          box = this.renderTabs()
          break
        case ToolbarType.symbol:
          box = this.renderSymbol()
          break
        case ToolbarType.horizontalTable:
          box = this.renderHorizontalTable()
          break
        case ToolbarType.picker:
          box = this.renderPicker()
          break
        case ToolbarType.colorTable:
          box = this.renderColorTable()
          break
        case ToolbarType.table:
        default:
          box = this.renderTable()
      }
    }
    let style
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      style = {
        width: this.state.boxHeight,
        height: this.props.device.height,
        justifyContent: 'flex-end',
        flexDirection: 'column',
      }
    } else {
      style = { height: this.state.boxHeight, width: this.props.device.width }
    }
    return (
      <Animated.View
        style={[style, { backgroundColor: 'transparent' }]}
        pointerEvents={'box-none'}
      >
        {box}
      </Animated.View>
    )
  }
}
