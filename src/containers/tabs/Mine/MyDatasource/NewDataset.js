import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Container, Input } from '../../../../components'
import { SMap, DatasetType, SProcess } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import { scaleSize, Toast, dataUtil } from '../../../../utils'
import { color, size } from '../../../../styles'
import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'

const closeImg = getThemeAssets().publicAssets.icon_cancel
const addImg = require('../../../../assets/mapTool/icon_plus.png')
const pointImg = require('../../../../assets/mapToolbar/dataset_type_point_black.png')
const lineImg = require('../../../../assets/mapToolbar/dataset_type_line_black.png')
const regionImg = require('../../../../assets/mapToolbar/dataset_type_region_black.png')
const textImg = require('../../../../assets/mapToolbar/dataset_type_text_black.png')
const CADImg = require('../../../../assets/mapToolbar/dataset_type_cad_black.png')

class NewDataset extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.userTempWorkspace = !!params?.userTempWorkspace // 是否使用临时工作空间
    this.state = {
      title: params.title,
      datasets: [],
      errorMap: (new Map(): Map<string, Object>),
    }
    this.getDatasets = params.getDatasets
    this.refreshCallback = params.refreshCallback || undefined
  }

  componentDidMount() {
    this.setState({
      datasets: [
        {
          key: new Date().getTime(),
          datasetName: this._getAvailableName('New_Point'),
          datasetType: DatasetType.POINT,
          datasetPrjName: "PCS_SPHERE_MERCATOR", // 投影坐标系
          datasetPrjValue: 53004,
        },
      ],
    })
  }

  _getAvailableName = (name, checkCurrent = true) => {
    let i = 1
    let datasetName = name
    let result = false
    while (!result) {
      if (this._isAvailableName(datasetName, checkCurrent)) {
        result = true
      } else {
        datasetName = name + '_' + i++
      }
    }
    return datasetName
  }

  _isAvailableName = (name, checkCurrent) => {
    let list = []
    let datasets = this.getDatasets()
    for (let i = 0; i < datasets.length; i++) {
      list.push(datasets[i].datasetName)
    }
    if (checkCurrent) {
      for (let i = 0; i < this.state.datasets.length; i++) {
        list.push(this.state.datasets[i].datasetName)
      }
    }
    let result = true
    for (let i = 0; i < list.length; i++) {
      if (list.includes(name)) {
        result = false
        break
      }
    }
    return result
  }

  _getDefaultDatasetNameByType = datasetType => {
    let datasetName = 'New_Dataset'
    switch (datasetType) {
      case DatasetType.POINT:
        datasetName = 'New_Point'
        break
      case DatasetType.LINE:
        datasetName = 'New_Line'
        break
      case DatasetType.REGION:
        datasetName = 'New_Region'
        break
      case DatasetType.TEXT:
        datasetName = 'New_Text'
        break
      case DatasetType.CAD:
        datasetName = 'New_CAD'
        break
    }
    return datasetName
  }

  _addDataset = () => {
    let lastDatasetType
    let length = this.state.datasets.length
    if (length > 0) {
      lastDatasetType = this.state.datasets[length - 1].datasetType
    }
    let datasetType = lastDatasetType || DatasetType.POINT
    let datasetName = this._getDefaultDatasetNameByType(datasetType)
    datasetName = this._getAvailableName(datasetName)
    let data = {
      key: new Date().getTime(),
      datasetName: datasetName,
      datasetType: datasetType,
      datasetPrjName: "PCS_SPHERE_MERCATOR", // 投影坐标系
      datasetPrjValue: 53004,
    }
    let datasets = this.state.datasets.clone()
    datasets.push(data)
    this.setState({ datasets }, () => {
      setTimeout(() => {
        this.ScrollView.scrollToEnd(true)
      }, 500)
    })
  }

  _deleteDataset = index => {
    let datasets = JSON.parse(JSON.stringify(this.state.datasets))
    const errorMap = new Map(this.state.errorMap)
    errorMap.delete(this.state.datasets[index].key)
    datasets.splice(index, 1)
    if (datasets.length === 0) {
      this.setState({ datasets: [], errorMap })
    } else {
      this.setState({ datasets, errorMap })
    }
  }

  _clearDatasets = () => {
    let datasets = [
      {
        key: new Date().getTime(),
        datasetName: this._getAvailableName('New_Point', false),
        datasetType: DatasetType.POINT,
        datasetPrjName: "PCS_SPHERE_MERCATOR", // 投影坐标系
        datasetPrjValue: 53004,
      },
    ]
    this.setState(state => {
      const errorMap = new Map(state.errorMap)
      errorMap.clear()
      return { datasets, errorMap }
    })
  }

  setErrorMap = (key, errorInfo) => {
    if (key === undefined || key === '') return
    this.setState(state => {
      const errorMap = new Map(state.errorMap)
      const target = errorMap.get(key)

      if (target && target !== errorInfo) {
        if (errorInfo === undefined || errorInfo === '') {
          errorMap.delete(key)
        } else {
          errorMap.set(key, errorInfo)
        }
      } else {
        if (errorInfo !== undefined && errorInfo !== '') {
          errorMap.set(key, errorInfo)
        }
      }
      return { errorMap }
    })
  }

  _createDatasets = async () => {
    try {
      if (this.state.datasets.length === 0) {
        Toast.show(getLanguage(GLOBAL.language).Profile.PLEASE_ADD_DATASET)
      } else {
        let newDatasets = this.state.datasets
        if (this.state.errorMap.size) {
          return
        }
        for (let i = 0; i < newDatasets.length; i++) {
          if (!newDatasets[i].datasetName) {
            Toast.show(getLanguage(GLOBAL.language).Profile.ENTER_DATASET_NAME)
            return
          }
          if (!newDatasets[i].datasetType) {
            Toast.show(getLanguage(GLOBAL.language).Profile.SELECT_DATASET_TYPE)
            return
          }
        }
        this.container.setLoading(
          true,
          getLanguage(GLOBAL.language).Prompt.CREATING,
        )
        if (!(await this._isAvailableDatasetName(newDatasets))) {
          setTimeout(() => {
            Toast.show(
              getLanguage(GLOBAL.language).Prompt.INVALID_DATASET_NAME +
                ': ' +
                this.badName,
            )
            this.container && this.container.setLoading(false)
          }, 1000)
        } else {
          for (let newDataset of newDatasets) {
            let result = await SMap.createDataset(
              this.state.title,
              newDataset.datasetName,
              newDataset.datasetType,
              this.userTempWorkspace,
            )
            if(result){
              await SProcess.setPrjCoordSys(
                this.state.title,
                newDataset.datasetName,
                newDataset.datasetPrjValue+"",
                this.userTempWorkspace,
              )
            }
          }
          setTimeout(async () => {
            Toast.show(getLanguage(GLOBAL.language).Prompt.CREATE_SUCCESSFULLY)
            this.refreshCallback && (await this.refreshCallback())
            this._clearDatasets()
            this.container && this.container.setLoading(false)
          }, 1000)
        }
        NavigationService.goBack()
      }
    } catch (error) {
      setTimeout(() => {
        Toast.show(getLanguage(GLOBAL.language).Prompt.CREATE_FAILED)
        this.container && this.container.setLoading(false)
      }, 1000)
    }
  }

  _isAvailableDatasetName = async datasets => {
    if (datasets.length === 0) {
      return false
    } else {
      for (let i = 0; i < datasets.length; i++) {
        if (
          !(await SMap.isAvailableDatasetName(
            this.state.title,
            datasets[i].datasetName,
            this.userTempWorkspace,
          ))
        ) {
          this.badName = datasets[i].datasetName
          return false
        }
      }
      return true
    }
  }

    // 设置投影坐标系
    _setProjection = (item, index) => {
      NavigationService.navigate('ProjectionTargetCoordsPage',{
        title: getLanguage(GLOBAL.language).Analyst_Labels.COORDSYS,
        // 投影坐标系选择界面确定时回调
        cb: targetCoords =>{
          NavigationService.goBack()
          const {value, title} = targetCoords
          const datasets = JSON.parse(JSON.stringify(this.state.datasets))
          const ds = {...datasets[index], datasetPrjName: title, datasetPrjValue: value}
          datasets.splice(index,1,ds)
          this.setState({datasets:datasets})
        },
      })
    }

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemStyle}>
        {this._renderItemHead(index)}
        <View style={styles.longSeperator} />
        {this._renderItemBody(item, index)}
      </View>
    )
  }

  _renderItemHead = index => {
    return (
      <View style={styles.itemHeadStyle}>
        <Text style={styles.text}>{index + 1}</Text>
        <TouchableOpacity
          onPress={() => {
            this._deleteDataset(index)
          }}
        >
          <Image source={closeImg} style={styles.imgStyle} />
        </TouchableOpacity>
      </View>
    )
  }

  _renderItemBody = (item, index) => {
    return (
      <View style={styles.itemBodyStyle}>
        <View style={styles.datasetNameStyle}>
          <Text style={styles.textStyle}>
            {/* {'数据集名称'} */}
            {getLanguage(GLOBAL.language).Profile.DATASET_NAME}
          </Text>
          <Input
            style={styles.textInputStyle}
            defaultValue={item.datasetName || ''}
            onChangeText={text => {
              item.datasetName = text
              item.nameChanged = true
              let { error } = dataUtil.isLegalName(text, GLOBAL.language)
              this.setErrorMap(item.key, error)
            }}
            showClear={true}
          />
        </View>
        <View style={styles.errorView}>
          {this.state.errorMap.get(item.key) && (
            <Text style={styles.errorInfo}>
              {this.state.errorMap.get(item.key)}
            </Text>
          )}
        </View>
        <View style={styles.longSeperator} />
        <View>
          <Text style={styles.textStyle}>
            {/* {'数据集类型'} */}
            {getLanguage(GLOBAL.language).Profile.DATASET_TYPE}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {this._renderDatasetType(item, DatasetType.POINT)}
            {this._renderDatasetType(item, DatasetType.LINE)}
            {this._renderDatasetType(item, DatasetType.REGION)}
            {this._renderDatasetType(item, DatasetType.TEXT)}
            {this._renderDatasetType(item, DatasetType.CAD)}
          </View>
        </View>
        <View style={styles.longSeperator} />
        {/* 设置数据集投影 */}
        <View style={{marginBottom:scaleSize(10)}}>
          <Text style={styles.textStyle}>
            {getLanguage(GLOBAL.language).Analyst_Labels.COORDSYS}
          </Text>
          <TouchableOpacity onPress={()=>{
            this._setProjection(item,index)
          }}>
            <View style={{flex: 1,justifyContent:'center'}}>
              <Text style={[styles.textStyle, { color: '#4680DF' }]}>
                {item.datasetPrjName}
              </Text>
              <Image source={getThemeAssets().publicAssets.icon_arrow_right} style={styles.arrowStyle}/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderDatasetType = (item, type) => {
    let text
    let img
    if (type === DatasetType.POINT) {
      text = getLanguage(GLOBAL.language).Profile.DATASET_TYPE_POINT
      img = pointImg
    } else if (type === DatasetType.LINE) {
      text = getLanguage(GLOBAL.language).Profile.DATASET_TYPE_LINE
      img = lineImg
    } else if (type === DatasetType.REGION) {
      text = getLanguage(GLOBAL.language).Profile.DATASET_TYPE_REGION
      img = regionImg
    } else if (type === DatasetType.TEXT) {
      text = getLanguage(GLOBAL.language).Profile.DATASET_TYPE_TEXT
      img = textImg
    } else if (type === DatasetType.CAD) {
      text = 'CAD'
      img = CADImg
    }
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.datasetTypeStyle,
            item.datasetType === type ? { backgroundColor: '#4680DF' } : {},
          ]}
          onPress={() => {
            if (item.datasetType === type) {
              return
            }
            item.datasetType = type
            if (!item.nameChanged) {
              item.datasetName = this._getAvailableName(
                this._getDefaultDatasetNameByType(type),
              )
            }
            let datasets = this.state.datasets.clone()
            this.setState({ datasets })
          }}
        >
          <Image source={img} style={styles.imgStyle} />
          <Text style={styles.textStyle}>{text}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderAddDataset = () => {
    return (
      <View>
        <TouchableOpacity onPress={this._addDataset}>
          <View style={styles.addStyle}>
            <Image style={styles.imgStyle} source={addImg} />
            <Text style={[styles.textStyle, { color: '#4680DF' }]}>
              {/* {'添加数据集'} */}
              {getLanguage(GLOBAL.language).Profile.ADD_DATASET}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _renderScroll = () => {
    return (
      <ScrollView ref={ref => (this.ScrollView = ref)}>
        <View style={styles.scrollViewStyle}>
          <FlatList
            style={styles.flatListStyle}
            data={this.state.datasets}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this._renderItem}
            extraData={this.state.errorMap}
          />
          {this._renderAddDataset()}
        </View>
      </ScrollView>
    )
  }

  _renderBottom = () => {
    return (
      <View style={styles.bottomStyle}>
        <TouchableOpacity onPress={this._clearDatasets}>
          <Text style={[styles.textStyle, { padding: scaleSize(10) }]}>
            {/* {'清空'} */}
            {getLanguage(GLOBAL.language).Profile.CLEAR}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._createDatasets}>
          <Text style={[styles.textStyle, { padding: scaleSize(10) }]}>
            {/* {'创建'} */}
            {getLanguage(GLOBAL.language).Profile.CREATE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={{
          backgroundColor: color.contentColorWhite,
        }}
        headerProps={{
          title: getLanguage(GLOBAL.language).Profile.NEW_DATASET,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this._renderScroll()}
        {this._renderBottom()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    alignItems: 'center',
    marginBottom: scaleSize(80),
    paddingHorizontal: scaleSize(50),
  },
  flatListStyle: {
    width: '100%',
  },
  bottomStyle: {
    backgroundColor: color.contentColorWhite,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleSize(30),
    position: 'absolute',
    bottom: 0,
    height: scaleSize(80),
    width: '100%',
  },
  itemStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    marginTop: scaleSize(50),
    borderRadius: scaleSize(10),
  },
  itemHeadStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleSize(20),
  },
  itemBodyStyle: {
    marginHorizontal: scaleSize(20),
  },
  datasetNameStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datasetTypeStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.contentColorWhite,
    padding: scaleSize(5),
    borderRadius: scaleSize(5),
    marginVertical: scaleSize(10),
    marginRight: scaleSize(20),
  },
  addStyle: {
    marginTop: scaleSize(50),
    flexDirection: 'row',
    alignItems: 'center',
  },
  longSeperator: {
    height: scaleSize(1),
    marginVertical: scaleSize(10),
    backgroundColor: color.contentColorWhite,
  },
  textStyle: {
    fontSize: scaleSize(24),
  },
  textInputStyle: {
    width: '70%',
    // height: scaleSize(80),
    fontSize: scaleSize(24),
    // borderBottomColor: color.borderLight,
    color: 'black',
    borderBottomWidth: 1,
    // marginTop: 10,
  },
  imgStyle: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  errorView: {
    height: scaleSize(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: scaleSize(200),
  },
  errorInfo: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.red,
    textAlign: 'left',
  },
  arrowStyle: {
    width: scaleSize(20),
    height: scaleSize(20),
    position: 'absolute',
    right: scaleSize(10),
  },
})

export default NewDataset
