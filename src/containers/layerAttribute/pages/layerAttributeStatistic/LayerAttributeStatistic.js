/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, Text, FlatList, TouchableOpacity, SectionList ,Image, Animated } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container, TextBtn } from '../../../../components'
import { getLanguage } from '../../../../language'
import { Toast, LayerUtils ,scaleSize} from '../../../../utils'
import { SMap, StatisticMode , SData } from 'imobile_for_reactnative'
import styles from './styles'
import { color } from '../../../../styles'
import {
  getThemeAssets,
  getPublicAssets,
} from '../../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import { FieldType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SDataType'

const PREVIOUS = 'previous'
const NEXT = 'next'
const UP = 'up'
const DOWN = 'down'
const MAX_VISIBLE_NUMBER = 5 // 显示的最大个数
const ITEM_VIEW_WIDTH_L = scaleSize(180)  // 横屏时宽度
const ITEM_VIEW_HEIGHT_P = scaleSize(200) // 竖屏时高度
const CONTENT_VIEW_HEIGHT = scaleSize(562)

function getData(language, fieldInfo) {
  let data
  if(fieldInfo.type === FieldType.INT16 ||
    fieldInfo.type === FieldType.INT32 ||
    fieldInfo.type === FieldType.INT64 ||
    fieldInfo.type === FieldType.SINGLE ||
    fieldInfo.type === FieldType.DOUBLE) {
    data = [
      {
        key: 'SUM',
        value: StatisticMode.SUM,
        title: getLanguage(language).Map_Attribute.SUM,
      },
      {
        key: 'AVERAGE',
        value: StatisticMode.AVERAGE,
        title: getLanguage(language).Map_Attribute.AVERAGE,
      },
      {
        key: 'MAX',
        value: StatisticMode.MAX,
        title: getLanguage(language).Map_Attribute.MAX,
      },
      {
        key: 'MIN',
        value: StatisticMode.MIN,
        title: getLanguage(language).Map_Attribute.MIN,
      },
      {
        key: 'VARIANCE',
        value: StatisticMode.VARIANCE,
        title: getLanguage(language).Map_Attribute.VARIANCE,
      },
      {
        key: 'STANDARD_DEVIATION',
        value: StatisticMode.STDDEVIATION,
        title: getLanguage(language).Map_Attribute.STANDARD_DEVIATION,
      },
      {
        key: 'COUNT_UNIQUE',
        // value: StatisticMode.SUM,
        title: getLanguage(language).Map_Attribute.COUNT_UNIQUE,
      },
    ]
  } else {
    data = [
      {
        key: 'COUNT_UNIQUE',
        // value: StatisticMode.SUM,
        title: getLanguage(language).Map_Attribute.COUNT_UNIQUE,
      },
    ]
  }
  return data
}

export default class LayerAttributeStatistic extends React.Component {
  props: {
    navigation: Object,
    language: string,
    currentAttribute: Object,
    setCurrentAttribute: () => {},
    device: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.fieldInfo = params.fieldInfo
    this.layer = params.layer
    const data = getData(this.props.language,this.fieldInfo)
    this.state = {
      data,
      currentMethod: data[0],
      result: '0.0',
      resultData:[],
      sectionData:[],
      isShowUpDown: true,
    }
    this.clickAble = true // 防止重复点击
    this.previousOpacity = new Animated.Value(0)
    this.nextOpacity = new Animated.Value(1)

    this.upOpacity = new Animated.Value(0)
    this.downOpacity = new Animated.Value(1)

    this.offset = 0
    this.maxOffset = 100
    this.onPrevious = true
    this.onNext = true

    /** 当前的y轴位置 */
    this.offsetY = 0
    /** y轴能到达的最大位置 */
    this.maxOffsetY = 100
    this.onUp = true
    this.onDown = true

  }

  showarraw = (length: number) => {
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') >= 0
    let headerHeight = scaleSize(120)
    if(isLandscape) {
      headerHeight = scaleSize(80)
    }
    const totalHeight = this.props.device.height - headerHeight

    let contentHeight = CONTENT_VIEW_HEIGHT + length * scaleSize(80)
    return contentHeight > totalHeight
  }

  componentDidMount() {
    this.statistic(this.state.currentMethod)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.setState({
        data: getData(this.props.language,this.fieldInfo),
      })
    }
  }

  statistic = item => {
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1000)
    } else {
      return
    }
    if (item.key === 'COUNT_UNIQUE') {
      SMap.getLayerAttribute(this.layer.path, 0, 100000000000, {
        groupBy: this.fieldInfo.name,
      }).then(
        result => {
          const downShow = this.showarraw(result.data.length)
          this.setState({
            currentMethod: item,
            result: result.total.toString(),
            resultData:result.data,
            sectionData:[{
              data: result.data,
              visible:true,
            }],
            isShowUpDown: downShow,
          })
        },
        () => {
          this.setState({
            currentMethod: item,
          })
          Toast.show(
            getLanguage(this.props.language).Prompt.NOT_SUPPORT_STATISTIC,
          )
        },
      )
    } else {
      SData.statistic(
        {datasetName:this.layer.datasetName,datasourceName:this.layer.datasourceAlias},
        this.fieldInfo.name,
        item.value,
      ).then(
        result => {
          this.setState({
            currentMethod: item,
            result: result.toString(),
          })
        },
        () => {
          this.setState({
            currentMethod: item,
            result: '0.0',
          })
          Toast.show(
            getLanguage(this.props.language).Prompt.NOT_SUPPORT_STATISTIC,
          )
        },
      )

      // SMap.statistic(
      //   this.layer.path,
      //   false,
      //   this.fieldInfo.name,
      //   item.value,
      // ).then(
      //   result => {
      //     this.setState({
      //       currentMethod: item,
      //       result: result.toString(),
      //     })
      //   },
      //   () => {
      //     this.setState({
      //       currentMethod: item,
      //       result: '0.0',
      //     })
      //     Toast.show(
      //       getLanguage(this.props.language).Prompt.NOT_SUPPORT_STATISTIC,
      //     )
      //   },
      // )
    }
  }

  complete = () => {
    NavigationService.goBack('LayerAttributeStatistic')
  }

  _keyExtractor = item => item.key

  _renderItem = ({ item }) => {
    let viewStyle, textStyle
    if (item.key === this.state.currentMethod.key) {
      viewStyle = styles.headerSelectedItem
      textStyle = styles.headerSelectedItemText
    } else {
      viewStyle = styles.headerItem
      textStyle = styles.headerItemText
    }
    return (
      <View style={styles.methodItem}>
        <TouchableOpacity
          style={viewStyle}
          onPress={() => this.statistic(item)}
        >
          <Text style={textStyle}>{item.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderSeparator = () => {
    return <View style={styles.headerSeparator} />
  }

  _renderHeader = () => {
    return (
      <View style={styles.headerView}>
        {this.renderIndicator(PREVIOUS)}
        <FlatList
          ref={ref => (this.listView = ref)}
          data={this.state.data}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderSeparator}
          getItemLayout={this.getItemLayout}
          horizontal={true}
          keyExtractor={this._keyExtractor}
          showsHorizontalScrollIndicator={false}
          extraData={this.state.currentMethod}
          onScroll={event => {
            this.offset = event.nativeEvent.contentOffset.x
            // console.warn(JSON.stringify(event.nativeEvent))
            this.maxOffset = event.nativeEvent.contentSize.width -
            event.nativeEvent.layoutMeasurement.width
            this.handlePosition()
          }}
        />
        {this.renderIndicator(NEXT)}
      </View>
    )
  }

  renderIndicator = location => {
    let source
    let style = {
      // opacity: location === PREVIOUS ? this.previousOpacity : this.nextOpacity,
    }
    // source =
    //     location === PREVIOUS
    //       ? getPublicAssets().common.icon_slide_left
    //       : getPublicAssets().common.icon_slide_right

    switch(location){
      case PREVIOUS:
        source = getPublicAssets().common.icon_slide_left
        style.opacity = this.previousOpacity
        break
      case NEXT:
        source = getPublicAssets().common.icon_slide_right
        style.opacity = this.nextOpacity
        break
      case UP:
        source = getPublicAssets().common.icon_slide_up
        style.opacity = this.upOpacity
        style.width = scaleSize(50)
        break
      case DOWN:
        source = getPublicAssets().common.icon_slide_down
        style.opacity = this.downOpacity
        style.width = scaleSize(50)
        break
    }

    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: scaleSize(50),
          height: '100%',
          backgroundColor: 'transparent',
        }}
        activeOpacity={1}
      >
        <Animated.Image
          resizeMode={'contain'}
          style={[
            {
              height: '100%',
              width: scaleSize(24),
            },
            style,
          ]}
          source={source}
        />
      </TouchableOpacity>
    )
  }

  handlePosition = () => {
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') >= 0
    let contentHeight = (this.listView && this.listView._listRef._totalCellLength) || 0
    let offset = this.offset
    let visibleHeight
    if (isLandscape) {
      visibleHeight = ITEM_VIEW_WIDTH_L * MAX_VISIBLE_NUMBER
    } else {
      visibleHeight = ITEM_VIEW_HEIGHT_P * MAX_VISIBLE_NUMBER
    }
    let onPrevious, onNext
    if (visibleHeight < contentHeight) {
      if (offset === 0) {
        onPrevious = true
        onNext = false
      } else if (offset + visibleHeight + 3 > contentHeight) {
        onPrevious = false
        onNext = true
      } else {
        onPrevious = false
        onNext = false
      }
    } else {
      onPrevious = true
      onNext = true
    }
    if (onPrevious !== this.onPrevious) {
      this.onPrevious = onPrevious
      Animated.timing(this.previousOpacity, {
        toValue: onPrevious ? 0 : 1,
        duration: 150,
        useNativeDriver: false,
      }).start()
    }
    if (onNext !== this.onNext) {
      this.onNext = onNext
      Animated.timing(this.nextOpacity, {
        toValue: onNext ? 0 : 1,
        duration: 150,
        useNativeDriver: false,
      }).start()
    }
  }

  handlePositionY = () => {
    let onUp, onDown
    // let contentHeight = (this.listViewY && this.listViewY._listRef._totalCellLength) || 0
    if(this.maxOffsetY <= 0) {
      // 当内容比容器高度低时，两个都不显示
      onUp = true
      onDown = true
    } else {
      if(this.offsetY <= 0) {
        onUp = true
        onDown = false
      } else if(this.offsetY >= this.maxOffsetY) {
        onUp = false
        onDown = true
      } else {
        onUp = false
        onDown = false
      }
    }

    if (onUp !== this.onUp) {
      this.onUp = onUp
      Animated.timing(this.upOpacity, {
        toValue: onUp ? 0 : 1,
        duration: 150,
        useNativeDriver: false,
      }).start()
    }
    if (onDown !== this.onDown) {
      this.onDown = onDown
      Animated.timing(this.downOpacity, {
        toValue: onDown ? 0 : 1,
        duration: 150,
        useNativeDriver: false,
      }).start()
    }


  }

  _renderContent = () => {
    return (
      <View style={styles.contentView}>
        <View style={styles.contentTop}>
          <Text style={styles.contentTitle}>{this.fieldInfo.name || ''}</Text>
          <Text style={styles.method}>{this.state.currentMethod.title}</Text>
          <Text style={styles.contentValue}>{this.state.result}</Text>
        </View>
        <View style={styles.contentBottom}>
          <View style={styles.contentBottomTextRow}>
            <View style={styles.contentBottomTextTitleView}>
              <Text style={styles.contentBottomText}>
                {getLanguage(this.props.language).Map_Attribute.FIELD_TYPE}
              </Text>
            </View>
            <View style={styles.contentBottomTextValueView}>
              <Text style={styles.contentBottomText}>
                {LayerUtils.getFieldTypeText(
                  this.fieldInfo.type,
                  this.props.language,
                )}
              </Text>
            </View>
          </View>
          <View style={styles.contentBottomTextRow}>
            <View style={styles.contentBottomTextTitleView}>
              <Text style={styles.contentBottomText}>
                {getLanguage(this.props.language).Map_Attribute.ALIAS}
              </Text>
            </View>
            <View style={styles.contentBottomTextValueView}>
              <Text style={styles.contentBottomText}>
                {this.fieldInfo.caption || ''}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  refreshList = section => {
    let newData = this.state.sectionData
    section.visible = !section.visible
    newData[section.index] = section
    this.setState({
      sectionData: newData.concat(),
      isShowUpDown: section.visible,
    })
  }

  renderSection = ({ section }) => {
    let value
    this.state.resultData[0].forEach((item) => {
      if (item.name === this.fieldInfo.name)
        value = item.value
    })
    if(value===undefined){
      return
    }
    let image = section.visible
      ? getThemeAssets().publicAssets.icon_drop_down
      : getThemeAssets().publicAssets.icon_drop_up
    return (
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => {
          this.refreshList(section)
        }}
      >
        <Text style={[styles.contentBottomText,{marginLeft:scaleSize(10)}]}>
          {getLanguage(language).Map_Attribute.UNIQUE}
        </Text>
        <Image resizeMode={'contain'} source={image} style={styles.icon_big} />
      </TouchableOpacity>
    )
  }

  _renderItem_  = ({ item ,section,index}) => {
    let value
    item.forEach((item) => {
      if (item.name === this.fieldInfo.name)
        value = item.value
    })

    if (section.visible && value!=='' && value!==null&& value!==undefined) {
      return (
        <View style={styles.contentBottom}>
          <View style={styles.contentBottomTextRow}>
            <View style={styles.contentBottomTextTitleView}>
              <Text style={[styles.contentBottomText,{marginLeft:scaleSize(10)}]}>
                {index+1}
                {/* {getLanguage(language).Map_Attribute.UNIQUE} */}
              </Text>
            </View>
            <View style={styles.contentBottomTextValueView}>
              <Text style={styles.contentBottomText}>
                {value}
              </Text>
            </View>
          </View>
        </View>
      )
    } else {
      return <View />
    }
  }

  _renderBottom = () => {
    return(
      <View style={[styles.contentView,{marginTop:scaleSize(90),borderTopWidth: scaleSize(1),borderTopColor: color.borderLight}]}>
        <SectionList
          style={{ flex: 1 }}
          sections={this.state.sectionData}
          renderItem={this._renderItem_}
          renderSectionHeader={this.renderSection}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={15}
          ListFooterComponent={<View style={{ height: 8 }} />}
        />
      </View>
    )
  }
  renderItem = ({item}) => {
    if(item.title === 'content') {
      return this._renderContent()
    } else if(item.title === 'bottom' && item?.visible) {
      return this._renderBottom()
    }
    return null
  }

  renderContent = () => {
    const data = [
      {title: 'content'},
      {title: 'bottom', visible: this.state.currentMethod.key==='COUNT_UNIQUE' }
    ]
    return (
      <FlatList
        ref={ref => (this.listViewY = ref)}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={this._keyExtractor}
        onScroll={event => {
          this.offsetY = event.nativeEvent.contentOffset.y
          // console.warn(JSON.stringify(event.nativeEvent))
          this.maxOffsetY = event.nativeEvent.contentSize.height -
            event.nativeEvent.layoutMeasurement.height
          this.measurementY = event.nativeEvent.layoutMeasurement.height
          this.handlePositionY()
        }}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Map_Attribute
            .ATTRIBUTE_STATISTIC,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Prompt.COMPLETE}
              textStyle={styles.headerBtnTitle}
              btnClick={this.complete}
            />
          ),
        }}
      >
        {this._renderHeader()}
        {this.state.currentMethod.key==='COUNT_UNIQUE' && this.state.isShowUpDown && (
          <View style={{height:scaleSize(40), width: '100%', alignItems: 'flex-end', position: 'absolute',
            top:this.props.device.orientation.indexOf('LANDSCAPE') >= 0 ? dp(80): dp(120),
            right:0}}
          >
            {this.renderIndicator(UP)}
          </View>
        )}
        {this.renderContent()}
        {this.state.currentMethod.key==='COUNT_UNIQUE' && this.state.isShowUpDown && (
          <View style={{height:scaleSize(40), width: '100%', alignItems: 'flex-end', position: 'absolute', bottom:dp(5),right:0}}>
            {this.renderIndicator(DOWN)}
          </View>
        )}

      </Container>
    )
  }
}
