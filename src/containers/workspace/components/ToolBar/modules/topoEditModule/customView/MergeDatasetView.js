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
import { ToolbarType } from '../../../../../../../constants'
import { getPublicAssets, getThemeAssets } from '../../../../../../../assets'
import { SMap } from 'imobile_for_reactnative'
import ModalDropdown from 'react-native-modal-dropdown'
import { getLanguage } from '../../../../../../../language'

export default class MergeDatasetView extends Component {
  props: {
    data: Array,
  }
  constructor(props) {
    super(props)
    this.state = {
      lineDataset: [],
    }
  }

  componentDidMount() {
    this._add()
  }

  _add = async () => {
    let lineDataset = await SMap.getAllLineDatasets()
    let { datasetName, datasourceName } = GLOBAL.INCREMENT_DATA
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

  _cancel = () => {
    const _params = ToolbarModule.getParams()
    let preType = ToolbarModule.getData().preType
    let containerType = ToolbarType.table
    _params.setToolbarVisible(true, preType, {
      containerType,
      isFullScreen: false,
    })
  }

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
        getLanguage(global.language).Analyst_Prompt.PLEASE_CHOOSE_DATASET,
      )
      return
    }
    let filterData = selectedData.filter(item => {
      return item.fieldInfo.length > 0 && !item.selectedFieldInfo
    })
    if (filterData.length > 0) {
      Toast.show(
        getLanguage(global.language).Map_Main_Menu.SELECT_ROADNAME_FIELD,
      )
    } else {
      this.mergeData(selectedData)
    }
  }

  //todo 原生回调 添加进度条
  mergeData = async selectedDatas => {
    const _params = ToolbarModule.getParams()
    _params.setContainerLoading(
      true,
      getLanguage(GLOBAL.language).Prompt.MERGEING,
    )
    let result = await SMap.mergeDataset(GLOBAL.INCREMENT_DATA, selectedDatas)
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

  renderItem = ({ section, item }) => {
    if (!section.visible) return null
    return <Item item={item} />
  }

  _renderSectionHeader = ({ section }) => {
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
    item: Object,
    data: Array,
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: false,
    }
  }

  onSelect = async () => {
    this.props.item.selected = !this.state.selected
    let datasetName = this.props.item.datasetName
    let datasourceName = this.props.item.datasourceName
    if (!this.props.item.fieldInfo) {
      let needChangeData = await SMap.queryFieldInfos([
        { datasetName, datasourceName },
      ])
      if (needChangeData.length > 0) {
        this.props.item.fieldInfo = needChangeData[0].fieldName
      } else {
        this.props.item.fieldInfo = []
      }
    }
    this.setState({
      selected: !this.state.selected,
    })
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
              fontSize: setSpText(18),
            }}
            onSelect={(selectIndex, value) => {
              this.props.item.selectedFieldInfo = value
            }}
            defaultValue={
              this.props.item.selectedFieldInfo ||
              getLanguage(global.language).Map_Main_Menu.SELECT_ROADNAME_FIELD
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
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  dropDownStyle: {
    marginRight: scaleSize(10),
  },
})
