/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Platform,
  Keyboard,
  Animated,
  KeyboardAvoidingView,
} from 'react-native'
import { scaleSize, setSpText, Toast } from '../../../../../../../utils'
import {
  getLayerIconByType,
  getLayerWhiteIconByType,
  getPublicAssets,
  getThemeAssets,
} from '../../../../../../../assets'
import { SMap, DatasetType } from 'imobile_for_reactnative'
import { color } from '../../../../../../../styles'
import ToolbarModule from '../../ToolbarModule'
import { Const, ToolbarType, Height } from '../../../../../../../constants'
import IncrementData from '../IncrementData'
import { getLanguage } from '../../../../../../../language'
import MergeDatasetView from './MergeDatasetView'

export default class LineList extends Component {
  props: {
    /**
     * [{datasetName<String>,datasourceName<String>}]
     */
    data: Array,
    /**
     * {datasetName<String>,datasourceName<String>}
     */
    selectedItem: Object,
    device: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      /** 同props.data */
      data: props.data || [],
      /** 同props.selectedItem */
      selectedItem: props.selectedItem || {},
      /** {datasetName<String>,datasourceName<String>} */
      editingItem: {},
    }
    this.keyBoardDidShowListener = null
    this.keyBoardDidHideListener = null
  }
  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.keyBoardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      )
      this.keyBoardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      )
    }
  }
  componentWillUnmount() {
    //安卓不加 用keyboardAvoidingView
    this.keyBoardDidHideListener && this.keyBoardDidHideListener.remove()
    this.keyBoardDidShowListener && this.keyBoardDidShowListener.remove()
  }

  _keyboardDidShow = e => {
    let { height } = e.startCoordinates
    Animated.timing(GLOBAL.ToolBar.state.bottom, {
      toValue: height,
      duration: Const.ANIMATED_DURATION,
    }).start()
  }
  _keyboardDidHide = () => {
    Animated.timing(GLOBAL.ToolBar.state.bottom, {
      toValue: 0,
      duration: Const.ANIMATED_DURATION,
    }).start()
  }

  /**
   * 返回路网采集模块
   */
  _cancel = async () => {
    const params = ToolbarModule.getParams()
    const preType = ToolbarModule.getData().preType
    const containerType = ToolbarType.table
    const _data = await IncrementData.getData(preType)
    this._keyboardDidHide()
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    params.setToolbarVisible &&
      params.setToolbarVisible(true, preType, {
        containerType: ToolbarType.table,
        isFullScreen: false,
        resetToolModuleData: true,
        height: data.height,
        column: data.column,
        ..._data,
      })
  }

  /**
   * 设置选中的数据并返回路网采集模块
   */
  _confirm = async () => {
    if (!this.state.selectedItem.datasetName) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_LINE_DATASET)
      return
    }
    if (
      GLOBAL.INCREMENT_DATA.datasetName !==
        this.state.selectedItem.datasetName ||
      GLOBAL.INCREMENT_DATA.datasourceName !==
        this.state.selectedItem.datasourceName
    ) {
      let params = {
        preDatasetName: GLOBAL.INCREMENT_DATA.datasetName || '',
        datasourceName: this.state.selectedItem.datasourceName,
        datasetName: this.state.selectedItem.datasetName,
      }
      await SMap.setCurrentDataset(params)
      GLOBAL.INCREMENT_DATA = this.state.selectedItem
    }
    const params = ToolbarModule.getParams()
    const preType = ToolbarModule.getData().preType
    const containerType = ToolbarType.table
    const _data = await IncrementData.getData(preType)
    const data = ToolbarModule.getToolbarSize(containerType, {
      data: _data.data,
    })
    params.setToolbarVisible &&
      params.setToolbarVisible(true, preType, {
        containerType: ToolbarType.table,
        isFullScreen: false,
        resetToolModuleData: true,
        height: data.height,
        column: data.column,
        ..._data,
      })
  }

  /**
   * 跳转到合并数据集页面
   * @param {*} item FlatList的data数组元素 data[]
   */
  onMerge = item => {
    const params = ToolbarModule.getParams()
    params.setToolbarVisible &&
      params.setToolbarVisible(true, 'MERGE_DATASET', {
        containerType: ToolbarType.list,
        isFullScreen: false,
        height:
          params.device.orientation === 'PORTRAIT'
            ? Height.LIST_HEIGHT_P
            : Height.LIST_HEIGHT_L,
        data: [],
        buttons: [],
        customView: () => <MergeDatasetView sourceData={item} />,
      })
  }

  /**
   * 编辑数据集名称
   * @param {Object} param0.item FlatList的data数组元素 data[]
   */
  _onEditPress = ({ item }) => {
    let editingItem = this.state.editingItem
    if (
      editingItem.datasetName !== item.datasetName ||
      editingItem.datasourceName !== item.datasourceName
    ) {
      this.setState(
        {
          editingItem: item,
          selectedItem: item,
        },
        () => {
          this.input && this.input.focus()
        },
      )
    }
  }

  /**
   * 完成编辑数据集名称
   * @param {Number} param0.index 序号
   * @param {String} param0.text 编辑的文字
   */
  _endEditing = ({ index, text }) => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    let regExp = /^[a-zA-Z0-9@#_]+$/
    let isValid = regExp.test(text)
    if (isValid) {
      let { datasourceName, datasetName } = data[index]
      data[index].datasetName = text
      let selectedItem = JSON.parse(JSON.stringify(this.state.selectedItem))
      selectedItem.datasetName = text
      //更新datasteName
      SMap.modifyDatasetName({
        datasourceName,
        datasetName,
        newDatasetName: text,
      })
      this.setState({
        data,
        selectedItem,
        editingItem: {},
      })
    } else {
      Toast.show(getLanguage(GLOBAL.language).Prompt.DATASET_RENAME_FAILED)
    }
  }
  // _clearEdit = () => {
  //   this.setState({
  //     editingItem:{},
  //   })
  // }

  /**
   * 选中数据集
   * @param {*} param0.item FlatList的data数组元素 data[]
   */
  _selectItem = ({ item }) => {
    let selectedItem = this.state.selectedItem
    if (
      selectedItem.datasetName !== item.datasetName ||
      selectedItem.datasourceName !== item.datasourceName
    ) {
      this.setState({
        selectedItem: item,
      })
    }
  }

  /**
   * 删除数据集
   * @param {*} param0.index 数据集在FlatList的data数组元素中的序号
   */
  _onDeletePress = ({ index }) => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    let deleteData = data.splice(index, 1)
    let { datasourceName, datasetName } = deleteData[0]
    //如果删除的是当前选中 自动选中下一个
    let selectedItem = this.state.selectedItem
    let removeLayer = false
    if (
      selectedItem.datasourceName === datasourceName &&
      selectedItem.datasetName === datasetName
    ) {
      selectedItem = data[index] || {}
    }
    if (
      GLOBAL.INCREMENT_DATA.datasourceName === datasourceName &&
      GLOBAL.INCREMENT_DATA.datasetName === datasetName
    ) {
      removeLayer = true
      GLOBAL.INCREMENT_DATA = {}
    }
    SMap.deleteDatasetAndLayer({ datasourceName, datasetName, removeLayer })
    this.setState({
      data,
      selectedItem,
    })
  }

  /**
   *
   * @param {Number} param0.index  FlatList的data数组元素的序号
   * @param {Object} param0.item FlatList的data数组元素 data[]
   */
  _renderItem = ({ index, item }) => {
    let hasExtra =
      this.state.selectedItem.datasourceName === item.datasourceName &&
      this.state.selectedItem.datasetName === item.datasetName
    let extraStyle, extraTxtStyle, lineImg
    let renameImg, deleteImg, addImage
    if (hasExtra) {
      renameImg = getThemeAssets().navigation.icon_increment_rename_white
      deleteImg = getThemeAssets().navigation.icon_increment_delete_white
      addImage = require('../../../../../../../assets/map/Frenchgrey/scene_addfly_light.png')
      extraStyle = { backgroundColor: color.item_selected_bg }
      extraTxtStyle = { color: color.white }
      lineImg = getLayerWhiteIconByType(DatasetType.LINE)
    } else {
      renameImg = getThemeAssets().navigation.icon_increment_rename
      deleteImg = getThemeAssets().navigation.icon_increment_delete
      addImage = getPublicAssets().common.icon_add
      extraStyle = {}
      extraTxtStyle = {}
      lineImg = getLayerIconByType(DatasetType.LINE)
    }
    let isEditing =
      this.state.editingItem.datasourceName === item.datasourceName &&
      this.state.editingItem.datasetName === item.datasetName
    return (
      <TouchableOpacity
        style={[styles.row, extraStyle]}
        onPress={() => {
          this._selectItem({ item })
        }}
      >
        <View style={styles.imageWrap}>
          <Image source={lineImg} resizeMode={'contain'} style={styles.image} />
        </View>
        {isEditing ? (
          <TextInput
            ref={ref => (this.input = ref)}
            style={[styles.text, styles.input, extraTxtStyle]}
            defaultValue={item.datasetName}
            returnKeyType={'done'}
            maxLength={30}
            onEndEditing={evt => {
              this._endEditing({ index, text: evt.nativeEvent.text })
            }}
          />
        ) : (
          <Text style={[styles.text, extraTxtStyle]}>{item.datasetName}</Text>
        )}
        <TouchableOpacity
          style={styles.imageWrap}
          onPress={() => {
            this.onMerge(item)
          }}
        >
          <Image
            source={addImage}
            resizeMode={'contain'}
            style={styles.image}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imageWrap}
          onPress={() => {
            this._onEditPress({ item })
          }}
        >
          <Image
            source={renameImg}
            resizeMode={'contain'}
            style={styles.image}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imageWrap}
          onPress={() => {
            this._onDeletePress({ index })
          }}
        >
          <Image
            source={deleteImg}
            resizeMode={'contain'}
            style={styles.image}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  render() {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.container}>
          <View style={styles.title}>
            <TouchableOpacity
              style={styles.titleTxtWrap}
              onPress={this._cancel}
            >
              <Text style={styles.actionTxt}>
                {getLanguage(GLOBAL.language).Prompt.CANCEL}
              </Text>
            </TouchableOpacity>
            <Text style={styles.titleTxt}>
              {getLanguage(GLOBAL.language).Prompt.SWITCH_LINE}
            </Text>
            <TouchableOpacity
              style={styles.titleTxtWrap}
              onPress={this._confirm}
            >
              <Text style={styles.actionTxt}>
                {getLanguage(GLOBAL.language).Prompt.CONFIRM}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            style={styles.padding}
            keyExtractor={(item, index) => item.toString() + index}
            data={this.state.data}
            extraData={this.state}
            renderItem={this._renderItem}
          />
        </View>
      )
    } else {
      return (
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.title}>
            <TouchableOpacity
              style={styles.titleTxtWrap}
              onPress={this._cancel}
            >
              <Text style={styles.actionTxt}>
                {getLanguage(GLOBAL.language).Prompt.CANCEL}
              </Text>
            </TouchableOpacity>
            <Text style={styles.titleTxt}>
              {getLanguage(GLOBAL.language).Prompt.SWITCH_LINE}
            </Text>
            <TouchableOpacity
              style={styles.titleTxtWrap}
              onPress={this._confirm}
            >
              <Text style={styles.actionTxt}>
                {getLanguage(GLOBAL.language).Prompt.CONFIRM}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            style={styles.padding}
            keyExtractor={(item, index) => item.toString() + index}
            data={this.state.data}
            extraData={this.state}
            renderItem={this._renderItem}
          />
        </KeyboardAvoidingView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.content_white,
  },
  padding: {
    paddingHorizontal: scaleSize(10),
    paddingBottom: scaleSize(10),
  },
  title: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#303030',
  },
  titleTxt: {
    color: 'white',
    fontSize: setSpText(22),
  },
  actionTxt: {
    color: 'white',
    fontSize: setSpText(20),
  },
  titleTxtWrap: {
    width: scaleSize(80),
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.content_white,
    marginHorizontal: scaleSize(20),
    borderBottomWidth: 1,
    borderBottomColor: color.USUAL_SEPARATORCOLOR,
  },
  row: {
    height: scaleSize(61),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: scaleSize(20),
    paddingLeft: scaleSize(20),
    borderBottomWidth: 1,
    borderBottomColor: color.USUAL_SEPARATORCOLOR,
  },
  imageWrap: {
    width: scaleSize(60),
    height: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  text: {
    flex: 1,
    fontSize: setSpText(18),
  },
  input: {
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  flex: {
    flex: 1,
  },
})
