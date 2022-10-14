/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  Platform,
  FlatList,
} from 'react-native'
import { Container, CustomInputDialog } from '../../components'
import {
  getLayerIconByType,
  getPublicAssets,
  getThemeAssets,
} from '../../assets'
import { dataUtil, scaleSize, setSpText, Toast } from '../../utils'
import color from '../../styles/color'
import { getLanguage } from '../../language'
import { SMap, DatasetType } from 'imobile_for_reactnative'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import ModalDropdown from 'react-native-modal-dropdown'
import NavigationService from '../NavigationService'
import ImageButton from '../../components/ImageButton'

export default class CreateNavDataPage extends Component {
  props: {
    navigation: Object,
    device: Object,
    currentUser: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      /**
       * 线数据集
       * [{
       *  title<String>, 数据源名称
       *  visible<Boolean>, 是否可见
       *  data<Array>, [{
       *      datasourceName<String>, 数据源名称
       *      datasetName<String>, 数据集名称
       *    }]
       * }]
       */
      lineDataset: [],
      /**
       * 目标数据源
       * [{
       *  alias<String>,
       *  engineType<int>,
       *  server<String>,
       *  driver<String>,
       *  ...
       * }]
       */
      datasource: [],
      selectedDataset: {},
      selectedDatasource: {},
      sleectedData:[],
    }
  }

  componentDidMount() {
    this.getLineDatasets()
    this.getDatasource()
  }

  /**
   * 获取工作空间内所有线数据集 zhangxt
   */
  getLineDatasets = async () => {
    let lineDataset = await SMap.getAllLineDatasets()
    this.setState({
      lineDataset: lineDataset,
    })
  }

  /**
   * 获取所有数据源，标注数据源除外。没有数据源时，弹出新建对话框 zhangxt
   */
  getDatasource = async () => {
    let datasource = await SMap.getDatasources()
    let data = []
    datasource.map(item => {
      if (
        item.engineType === 219 &&
        item.alias.indexOf('Label_') !== 0 &&
        item.alias.indexOf('default_increment_datasource@') !== 0
      ) {
        data.push({
          datasourceName: item.alias,
        })
      }
    })
    if (data.length > 0) {
      this.setState({
        datasource: data,
      })
    } else {
      Toast.show(getLanguage(global.language).Prompt.NO_DATASOURCE)
      setTimeout(() => {
        this.dialog?.setDialogVisible(true, {
          title: getLanguage(global.language).Map_Main_Menu.NEW_DATASOURCE,
          value: 'default_roadnet_datasource',
          confirmBtnTitle: getLanguage(global.language).CONFIRM,
          cancelBtnTitle: getLanguage(global.language).Prompt.CANCEL,
          placeholder: '',
          returnKeyType: 'done',
          keyboardAppearance: 'dark',
          confirmAction: this._createDatasource,
        })
      }, 1000)
    }
  }

  /**
   * 确定按钮事件。选择完数据集和数据源后弹出新建模型文件对话框 zhangxt
   */
  _confirm = () => {
    let { selectedDatasource, selectedDataset } = this.state
    if (!selectedDataset.datasetName) {
      Toast.show(getLanguage(global.language).Prompt.SELECT_LINE_DATASET)
      return
    }
    let data = JSON.parse(JSON.stringify(this.state.sleectedData))
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].fieldInfo.length > 0 &&
        !data[i].selectedFieldInfo
      ) {
        Toast.show(
          getLanguage(global.language).Map_Main_Menu.SELECT_ROADNAME_FIELD,
        )
        return
      }
    }

    if (!selectedDatasource.datasourceName) {
      Toast.show(
        getLanguage(global.language).Prompt.SELECT_DESTINATION_DATASOURCE,
      )
      return
    }
    this.dialog.setDialogVisible(true, {
      title: getLanguage(global.language).Prompt.INPUT_MODEL_FILE_NAME,
      value: this.state.selectedDataset.datasetName,
      confirmBtnTitle: getLanguage(global.language).CONFIRM,
      cancelBtnTitle: getLanguage(global.language).Prompt.CANCEL,
      placeholder: '',
      returnKeyType: 'done',
      keyboardAppearance: 'dark',
      confirmAction: this._dialogConfirm,
    })
  }

  /**
   * 通过新建数据源对话框新建数据源 zhangxt
   * @param {*} datasourceName
   */
  _createDatasource = async datasourceName => {
    this.container.setLoading(
      true,
      getLanguage(global.language).Prompt.CREATING,
    )
    let datasourcePath =
      global.homePath +
      ConstPath.UserPath +
      this.props.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Datasource
    let availableName = await this._getAvailableFileName(
      datasourcePath,
      datasourceName,
      'udb',
    )
    availableName = availableName.substring(0, availableName.lastIndexOf('.'))
    let rel = await SMap.createNavDatasource(availableName)
    if (rel) {
      this.getDatasource()
    } else {
      Toast.show(getLanguage(global.language).Prompt.CREATE_FAILED)
    }
    this.container.setLoading(false)
    return true
  }

  /**
   * 获取某路径下可用文件名 zhangxt
   * @param {*} path 路径
   * @param {*} name 文件名 abc
   * @param {*} ext 扩展名 udb
   * @returns abc.udb 有重名的在文件名后加“_1”,仍重名则改为"_2"，依此类推
   */
  _getAvailableFileName = async (path, name, ext) => {
    let result = await FileTools.fileIsExist(path)
    if (!result) {
      await FileTools.createDirectory(path)
    }
    let availableName = name + '.' + ext
    if (await FileTools.fileIsExist(path + '/' + availableName)) {
      for (let i = 1; ; i++) {
        availableName = name + '_' + i + '.' + ext
        if (!(await FileTools.fileIsExist(path + '/' + availableName))) {
          return availableName
        }
      }
    } else {
      return availableName
    }
  }

  /**
   * 新建模型文件对话框确定事件，生成路网模型和对应的导航数据集 zhangxt
   * @param {*} fileName
   */
  _dialogConfirm = async fileName => {
    let { selectedDatasource, selectedDataset ,sleectedData} = this.state
    let { result, error } = dataUtil.isLegalName(fileName)
    if (!result) {
      Toast.show(error)
    } else {
      let filePath = await FileTools.appendingHomeDirectory(
        ConstPath.AppPath +
          'User/' +
          this.props.currentUser.userName +
          '/' +
          ConstPath.RelativePath.Datasource +
          fileName +
          '.snm',
      )
      let isFileExist = await FileTools.fileIsExist(filePath)
      if (isFileExist) {
        Toast.show(getLanguage(global.language).Prompt.FILENAME_ALREADY_EXIST)
      } else {
        this.dialog.setDialogVisible(false)

        global.Loading.setLoading(
          true,
          getLanguage(global.language).Prompt.NETWORK_BUILDING,
        )
        let rel = false
        let data = JSON.parse(JSON.stringify(sleectedData))
        for (let i = 0; i < data.length; i++) {
          let sourceDataset = {
            sourceDatasourceName: data[i].datasourceName,
            sourceDatasetName: data[i].datasetName,
          }
          //没有RoadName字段则要带上选择的道路名称字段
          if (data[i].selectedFieldInfo) {
            sourceDataset.sourceDatasetFiled = data[i].selectedFieldInfo
          }
          rel = await SMap.buildOutdoorNetwork({
            ...sourceDataset,
            ...selectedDatasource,
            filePath,
          })
        }

        setTimeout(() => {
          global.Loading.setLoading(false)
          if (rel) {
            Toast.show(getLanguage(global.language).Prompt.ROADNET_BUILD_SUCCESS)
            this.props.route.params?.cb?.()
          }else{
            Toast.show(getLanguage(global.language).Prompt.ROADNET_BUILD_FAILED)
          }
        }, 1000)
      }
    }
  }

  onPressDatasetHeader = section => {
    let lineDataset = JSON.parse(JSON.stringify(this.state.lineDataset))
    let currentIndex
    for (let i = 0; i < lineDataset.length; i++) {
      if (lineDataset[i].title === section.title) {
        currentIndex = i
        break
      }
    }
    lineDataset[currentIndex].visible = !lineDataset[currentIndex].visible
    this.setState({
      lineDataset,
    })
  }

  renderDatasetSectionHeader = ({ section }) => {
    let arrowImg = section.visible
      ? getThemeAssets().publicAssets.icon_drop_down
      : getThemeAssets().publicAssets.icon_drop_up
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 20,
          height: scaleSize(60),
          borderBottomWidth: 1,
          borderBottomColor: color.USUAL_SEPARATORCOLOR,
          backgroundColor: color.contentColorWhite,
        }}
        onPress={() => {
          this.onPressDatasetHeader(section)
        }}
      >
        <Image source={arrowImg} style={styles.image} resizeMode={'contain'} />
        <Text style={styles.text}>{section.title}</Text>
      </TouchableOpacity>
    )
  }

  renderItem = ({ section, item }) => {
    if (!section.visible) return null
    let sleectedData = JSON.parse(JSON.stringify(this.state.sleectedData))
    let selected = false
    for (let i = 0; i < sleectedData.length; i++) {
      if (sleectedData[i].datasourceName === item.datasourceName &&
        sleectedData[i].datasetName === item.datasetName) {
        selected = true
        break
      }
    }
    return (
      <Item
        item={item}
        selected={selected}
        onSelect={async item => {
          let result = await SMap.isPrgCoordSysWGS1984({...item})
          if(result){
            let data = JSON.parse(JSON.stringify(this.state.sleectedData))
            let has = false
            let index
            for (let i = 0; i < data.length; i++) {
              if (data[i].datasourceName === item.datasourceName &&
                data[i].datasetName === item.datasetName) {
                has = true
                index = i
                break
              }
            }
            if(!has){
              data.push(item)
              this.setState({ selectedDataset: item , sleectedData: data})
            }else{
              data.splice(index,1)
              this.setState({sleectedData: data})
            }
          }else{
            Toast.show(getLanguage(global.language).Prompt.NOT_LONGITUDE)
          }
        }}
        selectedField={async item => {
          let data = JSON.parse(JSON.stringify(this.state.sleectedData))
          let index
          for (let i = 0; i < data.length; i++) {
            if (data[i].datasourceName === item.datasourceName &&
              data[i].datasetName === item.datasetName) {
              index = i
              break
            }
          }
          data.splice(index,1)
          data.push(item)
          this.setState({sleectedData: data})
        }
        }
      />
    )
  }

  renderDatasets = () => {
    return (
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <View
          style={{
            justifyContent: 'center',
            height: scaleSize(80),
            borderBottomWidth: 1,
            borderBottomColor: color.USUAL_SEPARATORCOLOR,
            backgroundColor: color.content_white,
          }}
        >
          <Text>{getLanguage(global.language).Prompt.LINE_DATASET}</Text>
        </View>
        <SectionList
          keyExtractor={(item, index) => item.toString() + index}
          sections={this.state.lineDataset}
          renderSectionHeader={this.renderDatasetSectionHeader}
          renderItem={this.renderItem}
        />
      </View>
    )
  }

  renderDatasourceItem = ({ item }) => {
    let img = getThemeAssets().dataType.icon_data_source,
      extraTxt = {},
      extraBack = {},
      name = item.datasourceName
    let selected = this.state.selectedDatasource.datasourceName === name
    if (selected) {
      img = getThemeAssets().dataType.icon_data_source_selected
      extraTxt = {
        color: color.white,
      }
      extraBack = {
        backgroundColor: color.item_selected_bg,
      }
    }
    return (
      <TouchableOpacity
        style={[styles.row, extraBack]}
        onPress={() => this.setState({ selectedDatasource: item })}
      >
        <Image source={img} style={styles.image} resizeMode={'contain'} />
        <Text style={[styles.name, extraTxt]}>{name}</Text>
      </TouchableOpacity>
    )
  }

  renderDatasource = () => {
    return (
      <View
        style={{ flex: 1, marginHorizontal: 10, marginBottom: scaleSize(130) }}
      >
        <View
          style={{
            justifyContent: 'center',
            height: scaleSize(80),
            borderBottomWidth: 1,
            borderBottomColor: color.USUAL_SEPARATORCOLOR,
            backgroundColor: color.content_white,
          }}
        >
          <Text>
            {getLanguage(global.language).Prompt.DESTINATION_DATASOURCE}
          </Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => item.toString() + index}
          data={this.state.datasource}
          renderItem={this.renderDatasourceItem}
          extraData={this.state.selectedDatasource}
        />
      </View>
    )
  }

  _renderDialog = () => {
    return <CustomInputDialog ref={ref => (this.dialog = ref)} />
  }

  render = () => {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Prompt.NEW_NAV_DATA,
          navigation: this.props.navigation,
          headerRight: (
            <ImageButton
              // containerStyle={styles.capture}
              iconStyle={{
                width: scaleSize(40),
                height: scaleSize(40),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
              activeOpacity={0.5}
              icon={getThemeAssets().dataType.icon_newdata}
              onPress={() => {
                NavigationService.navigate("MapSelectList", { type: 'projectionSelect' ,cb:()=>{
                  setTimeout(() => {
                    this.getDatasource()
                    this.getLineDatasets()
                  }, 1000)
                }})
              }}
            />
          ),
        }}
      >
        {this.renderDatasets()}
        {this.renderDatasource()}
        {this.state.datasource.length > 0 && (
          <TouchableOpacity style={styles.confirm} onPress={this._confirm}>
            <Text style={styles.confirmTxt}>
              {getLanguage(global.language).CONFIRM}
            </Text>
          </TouchableOpacity>
        )}
        {this._renderDialog()}
      </Container>
    )
  }
}

class Item extends Component {
  props: {
    item: Object,
    selected: Boolean,
    onSelect: () => {},
    selectedField: () => {},
  }

  constructor(props) {
    super(props)
  }

  /**
   * zhangxt
   * 数据集选择事件。数据集必须包含道路名称字段才可选择
   * 通过室外路网采集创建的默认创建‘RoadName’字段
   */
  onSelect = async () => {
    let datasetName = this.props.item.datasetName
    let datasourceName = this.props.item.datasourceName
    //第一次点击先获取所有非系统的文字类型字段
    if (!this.props.item.fieldInfo) {
      let needChangeData = await SMap.queryFieldInfos([
        { datasetName, datasourceName },
      ])
      if (needChangeData.length > 0) {
        this.props.item.fieldInfo = needChangeData[0].fieldName
        //已有‘RoadName’字段直接使用，不用再选择
        if (this.props.item.fieldInfo.indexOf('RoadName') > -1) {
          this.props.item.fieldInfo = []
          this.props.item.hasRoadName = true
        }
      } else {
        this.props.item.fieldInfo = []
      }
    }
    if (
      this.props.item.fieldInfo.length === 0 &&
      !this.props.item.hasRoadName
    ) {
      Toast.show(getLanguage(global.language).Prompt.HAS_NO_ROADNAME_FIELD_DATA)
    } else {
      this.props.onSelect && this.props.onSelect(this.props.item)
    }
  }

  render() {
    let img = getLayerIconByType(DatasetType.LINE)
    let backgroundColor = {}
    let fontColor = {}
    let selected = this.props.selected
    let selectedImg = getPublicAssets().common.icon_none
    if (selected) {
      // img = getLayerWhiteIconByType(DatasetType.LINE)
      // backgroundColor = { backgroundColor: color.item_selected_bg }
      // fontColor = { color: color.white }
      selectedImg = getPublicAssets().common.icon_select
    }
    return (
      <View>
        <TouchableOpacity
          onPress={async () => {
            this.onSelect()
          }}
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 40,
              height: scaleSize(80),
              borderBottomWidth: 1,
              borderBottomColor: color.USUAL_SEPARATORCOLOR,
            },
            backgroundColor,
          ]}
        >
          <Image
            source={selectedImg}
            resizeMode={'contain'}
            style={styles.image}
          />
          <Image source={img} style={styles.image} resizeMode={'contain'} />
          <Text style={[{ marginLeft: scaleSize(10), fontSize: setSpText(18) }, fontColor]}>
            {this.props.item.datasetName}
          </Text>
          {selected && this.props.item.fieldInfo?.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                flex:1,
                height: scaleSize(60),
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <ModalDropdown
                textStyle={{
                  color: color.item_selected_bg,
                  fontSize: setSpText(18),
                }}
                onSelect={(selectIndex, value) => {
                  //选中道路名称字段
                  this.props.item.selectedFieldInfo = value
                  this.props.selectedField(this.props.item)
                }}
                defaultValue={
                  this.props.item.selectedFieldInfo ||
                  getLanguage(global.language).Map_Main_Menu.SELECT_ROADNAME_FIELD
                }
                options={this.props.item.fieldInfo}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(20),
    backgroundColor: color.content_white,
    borderBottomWidth: 1,
    borderBottomColor: color.USUAL_SEPARATORCOLOR,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: scaleSize(40),
    marginRight: scaleSize(20),
    height: scaleSize(80),
    borderBottomWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
  },
  title: {
    fontSize: setSpText(24),
  },
  name: {
    flex: 1,
    fontSize: setSpText(20),
    marginLeft: scaleSize(10),
  },
  imageWrap: {
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  confirm: {
    position: 'absolute',
    bottom: scaleSize(60),
    left: 0,
    right: 0,
    height: scaleSize(60),
    marginHorizontal: scaleSize(60),
    borderRadius: scaleSize(30),
    backgroundColor: color.blue1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTxt: {
    fontSize: setSpText(24),
    color: color.white,
  },
  dialogBackground: {
    height: scaleSize(240),
  },
  dialogContent: {
    flex: 1,
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogTitle: {
    fontSize: setSpText(26),
  },
  dialogInput: {
    borderColor: color.separateColorGray,
    borderWidth: 1,
    borderRadius: 5,
    height: scaleSize(60),
    width: '80%',
    fontSize: setSpText(24),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
