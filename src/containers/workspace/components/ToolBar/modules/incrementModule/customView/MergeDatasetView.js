/**
 * @description 合并数据集
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  SectionList,
} from 'react-native'
import { scaleSize, setSpText, Toast } from '../../../../../../../utils'
import { color } from '../../../../../../../styles'
import ToolbarModule from '../../ToolbarModule'
import {
  ToolbarType,
  ConstToolType,
  Height,
} from '../../../../../../../constants'
import { getPublicAssets, getThemeAssets } from '../../../../../../../assets'
import { SMap } from 'imobile_for_reactnative'
import ModalDropdown from 'react-native-modal-dropdown'
import { getLanguage } from '../../../../../../../language'

export default class MergeDatasetView extends Component {
  props: {
    /**
     * {
     *  datasetName<String>, 目标数据集名
     *  datasourceName<String>, 目标数据源名
     * }
     */
    sourceData: Object,
  }

  static defaultProps = {
    sourceData: GLOBAL.INCREMENT_DATA,
  }
  constructor(props) {
    super(props)
    this.state = {
      /**
       * @author zhangxt
       * 所有线数据集
       *[{
       *  title<String>, 数据源名称
       *  visible<Boolean>, 是否可见
       *  data<Array>, [{
       *      datasourceName<String>, 数据源名称
       *      datasetName<String>, 数据集名称
       *      fieldInfo<Array<String>>?, 数据集字段名，选择后添加
       *      selected?:true, 是否选中，选择后添加
       *      selectedFieldInfo<String>？, 选择的道路字段名，选择后添加
       *    }]
       * }]
       */
      lineDataset: [],
    }
  }

  componentDidMount() {
    this._add()
  }

  /**
   * 获取所有线数据集，过滤需要合并的源数据集 zhangxt
   */
  _add = async () => {
    let lineDataset = await SMap.getAllLineDatasets()
    let { datasetName, datasourceName } = this.props.sourceData
    let filterData = lineDataset.filter(item => {
      if (item.title === datasourceName) {
        item.data = item.data.filter(data => {
          return data.datasetName !== datasetName
        })
        return item.data.length > 0
      }
      return true
    })
    this.setState({
      lineDataset: filterData,
    })
  }

  /**
   * 返回路网采集模块
   */
  _cancel = () => {
    const _params = ToolbarModule.getParams()
    _params.setToolbarVisible(
      true,
      ConstToolType.SM_MAP_INCREMENT_CHANGE_NETWORK,
      {
        isFullScreen: false,
        containerType: ToolbarType.list,
        height:
          _params.device.orientation === 'PORTRAIT'
            ? Height.LIST_HEIGHT_P
            : Height.LIST_HEIGHT_L,
      },
    )
  }

  /**
   * 确定事件
   */
  confirm = () => {
    let data = JSON.parse(JSON.stringify(this.state.lineDataset))
    let selectedData = []
    data.map(item => {
      item.data.map(data => {
        if (data.selected) {
          selectedData.push(data)
        }
      })
    })
    if (selectedData.length === 0) {
      Toast.show(
        getLanguage(GLOBAL.language).Analyst_Prompt.PLEASE_CHOOSE_DATASET,
      )
      return
    }
    /**
     * 需要有默认的道路名称字段'RoadName'或自己选择的道路名称字段
     * 有默认字段，则fieldInfo.length为0，有选择的字段，则item.selectedFieldInfo不为空
     */
    let filterData = selectedData.filter(item => {
      return item.fieldInfo.length > 0 && !item.selectedFieldInfo
    })
    if (filterData.length > 0) {
      Toast.show(
        getLanguage(GLOBAL.language).Map_Main_Menu.SELECT_ROADNAME_FIELD,
      )
    } else {
      this.mergeData(selectedData)
    }
  }

  /**
   * 开始合并
   * @param {Array} selectedDatas  [{
   *  datasetName<String>,
   *  datasourceName<String>,
   *  fieldInfo<Array<String>>, 数据集字段名
   *  selected:true,
   *  selectedFieldInfo<String>？, 选择的道路字段名
   * }]
   */
  mergeData = async selectedDatas => {
    const _params = ToolbarModule.getParams()
    _params.setContainerLoading(
      true,
      getLanguage(GLOBAL.language).Prompt.MERGEING,
    )
    let result = await SMap.mergeDataset(
      { ...this.props.sourceData },
      selectedDatas,
    )
    if (result) {
      _params.setContainerLoading(false)
      if (result instanceof Array) {
        let str = result.reduce(
          (preValue, curValue) => preValue + '、' + curValue,
          '',
        )
        Toast.show(
          `${
            getLanguage(GLOBAL.language).Prompt.NOT_SUPPORT_PRJCOORDSYS
          }:${str}`,
        )
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.MERGE_SUCCESS)
        let preType = ToolbarModule.getData().preType
        let containerType = ToolbarType.table
        _params.setToolbarVisible(true, preType, {
          containerType,
          isFullScreen: false,
        })
      }
    } else {
      _params.setContainerLoading(false)
      Toast.show(getLanguage(GLOBAL.language).Prompt.MERGE_FAILD)
    }
  }

  /**
   *
   * @param {Object} section  {section<Object>, SectionList的sections数组数据元素 sections[0]}
   */
  _onTitlePress = section => {
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

  /**
   *
   * @param {Object} param {
   *  index<Number>,
   *  item<Any>, section数组内的元素 section[]
   *  sections<Array>, item所在的数组
   *  separators<Object>, 分割组件
   * }
   */
  renderItem = param => {
    let { section, item } = param
    if (!section.visible) return null
    return <Item item={item} />
  }

  /**
   *
   * @param {Object} param {section<Object>, SectionList的sections数组数据元素 sections[]}
   */
  _renderSectionHeader = param => {
    let { section } = param
    let arrowImg = section.visible
      ? getThemeAssets().publicAssets.icon_drop_down
      : getThemeAssets().publicAssets.icon_drop_up
    return (
      <TouchableOpacity
        style={styles.section}
        onPress={() => {
          this._onTitlePress(section)
        }}
      >
        <View style={styles.imageWrap}>
          <Image
            source={arrowImg}
            style={styles.image}
            resizeMode={'contain'}
          />
        </View>
        <Text style={styles.text}>{section.title}</Text>
      </TouchableOpacity>
    )
  }

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <View style={styles.actionView}>
            <TouchableOpacity
              style={styles.titleTxtWrap}
              onPress={this._cancel}
            >
              <Text style={styles.actionTxt}>
                {getLanguage(GLOBAL.language).Find.BACK}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.titleTxt}>
            {getLanguage(GLOBAL.language).Map_Main_Menu.ADD_DATASET}
          </Text>
          <View style={styles.actionView}>
            <TouchableOpacity
              style={styles.titleTxtWrap}
              onPress={this.confirm}
            >
              <Text style={styles.actionTxt}>
                {getLanguage(GLOBAL.language).Map_Main_Menu.MERGE_CONFIRM}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sectionSeparateViewStyle} />
        <SectionList
          style={styles.padding}
          keyExtractor={(item, index) => item.toString() + index}
          sections={this.state.lineDataset}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

class Item extends Component {
  props: {
    /**
     * {
     *    datasourceName<String>, 数据源名称
     *    datasetName<String>, 数据集名称
     *    fieldInfo<Array<String>>?, 数据集字段名，选择后添加
     *    selected?:true, 是否选中，选择后添加
     *    selectedFieldInfo<String>？, 选择的道路字段名，选择后添加
     *  }
     */
    item: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: false,
    }
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
      Toast.show(getLanguage(GLOBAL.language).Prompt.HAS_NO_ROADNAME_FIELD_DATA)
    } else {
      this.props.item.selected = !this.state.selected
      this.setState({
        selected: !this.state.selected,
      })
    }
  }

  render() {
    let selectedImg = this.state.selected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.imageWrap}
          onPress={() => this.onSelect()}
        >
          <Image
            source={selectedImg}
            resizeMode={'contain'}
            style={styles.image}
          />
        </TouchableOpacity>
        <Image />
        <Text style={styles.text}>{this.props.item.datasetName}</Text>
        {this.state.selected && this.props.item.fieldInfo?.length > 0 && (
          <ModalDropdown
            style={styles.dropDownStyle}
            textStyle={{
              color: color.item_selected_bg,
              fontSize: setSpText(18),
            }}
            onSelect={(selectIndex, value) => {
              this.props.item.selectedFieldInfo = value
            }}
            defaultValue={
              this.props.item.selectedFieldInfo ||
              getLanguage(GLOBAL.language).Map_Main_Menu.SELECT_ROADNAME_FIELD
            }
            options={this.props.item.fieldInfo}
          />
        )}
      </View>
    )
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
    backgroundColor: color.white,
  },
  titleTxt: {
    color: color.fontColorBlack,
    fontSize: setSpText(22),
  },
  actionTxt: {
    color: color.fontColorBlack,
    fontSize: setSpText(20),
  },
  titleTxtWrap: {
    minWidth: scaleSize(110),
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionSeparateViewStyle: {
    height: scaleSize(2),
    marginHorizontal: scaleSize(30),
    backgroundColor: color.separateColorGray4,
  },
  row: {
    height: scaleSize(61),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scaleSize(20),
    paddingLeft: scaleSize(20),
    borderBottomWidth: 1,
    borderBottomColor: color.separateColorGray4,
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
  section: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.content_white,
    marginHorizontal: scaleSize(20),
    borderBottomWidth: 1,
    borderBottomColor: color.separateColorGray4,
  },
  dropDownStyle: {
    marginRight: scaleSize(10),
  },
})
