/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 * description: 二级左右联动菜单组件
 */

import React from 'react'
import {
  TouchableOpacity,
  View,
  FlatList,
  Text,
  PanResponder,
  Image,
} from 'react-native'
import { scaleSize, screen } from '../../utils'
import { getPublicAssets } from '../../assets'
import styles from './styles'
import { CheckBox } from '../../components'
import { color, size } from '../../styles'

const LEFT_MIN_WIDTH = scaleSize(240)
export default class LinkageList extends React.Component {
  props: {
    language: String,
    data: Array, // 菜单数据
    titles: Array, //左右侧标题
    onLeftPress?: () => {}, //左侧点击
    onRightPress?: () => {}, //右侧点击
    styles?: Object, //样式
    adjustmentWidth?: boolean,
    isMultiple: boolean, //是否是多选
  }

  static defaultProps = {
    adjustmentWidth: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      rightSelected: 0,
      // data: props.data || [],
      rightData: (props.data && props.data[0] && props.data[0].data) || [],
      selectedData: [],
    }
    if (this.props.isMultiple) {
      this.isMultiple = true
    }
    this.styles = this.props.styles
      ? Object.assign(styles, this.props.styles)
      : styles

    if (props.adjustmentWidth) {
      this._panBtnStyles = {
        style: {
          width: LEFT_MIN_WIDTH,
        },
      }
      this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
        onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
        onPanResponderMove: this._handlePanResponderMove,
        onPanResponderRelease: this._handlePanResponderEnd,
        onPanResponderTerminate: this._handlePanResponderEnd,
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        rightData:
          (this.props.data[this.state.selected] &&
            this.props.data[this.state.selected].data) ||
          [],
      })
    }
    if (this._panBtnStyles.style.width > screen.getMapChildPageWith()) {
      this._panBtnStyles.style.width =
        screen.getMapChildPageWith() - LEFT_MIN_WIDTH
      this._updateNativeStyles()
    }
  }

  getSelectData = () => {
    return this.state.selectedData
  }

  _handleStartShouldSetPanResponder = () => {
    // evt, gestureState
    return true
  }

  _handleMoveShouldSetPanResponder = () => {
    // evt, gestureState
    return true
  }

  _handlePanResponderMove = (evt, gestureState) => {
    let diff = screen.getScreenWidth() - screen.getMapChildPageWith()
    this._panBtnStyles.style.width = gestureState.moveX - diff
    if (this._panBtnStyles.style.width < LEFT_MIN_WIDTH) {
      this._panBtnStyles.style.width = LEFT_MIN_WIDTH
    } else if (
      this._panBtnStyles.style.width >
      screen.getMapChildPageWith() - LEFT_MIN_WIDTH
    ) {
      this._panBtnStyles.style.width =
        screen.getMapChildPageWith() - LEFT_MIN_WIDTH
    }
    this._updateNativeStyles()
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    let diff = screen.getScreenWidth() - screen.getMapChildPageWith()
    this._panBtnStyles.style.width = gestureState.moveX - diff
    if (this._panBtnStyles.style.width < LEFT_MIN_WIDTH) {
      this._panBtnStyles.style.width = LEFT_MIN_WIDTH
    } else if (
      this._panBtnStyles.style.width >
      screen.getMapChildPageWith() - LEFT_MIN_WIDTH
    ) {
      this._panBtnStyles.style.width =
        screen.getMapChildPageWith() - LEFT_MIN_WIDTH
    }
    this._updateNativeStyles()
  }

  _updateNativeStyles = () => {
    this.leftList && this.leftList.setNativeProps(this._panBtnStyles)
  }

  select = ({ leftIndex, rightIndex }) => {
    let state = {}
    if (leftIndex >= 0) state.selected = leftIndex
    if (rightIndex >= 0) state.rightSelected = rightIndex
    if (
      this.props.data &&
      this.props.data.length > 0 &&
      this.props.data[leftIndex] &&
      this.props.data[leftIndex].data &&
      this.props.data[leftIndex].data.length > 0
    ) {
      state.rightData = this.props.data[leftIndex].data
    }
    if (Object.keys(state).length > 0) {
      this.setState(state)
    }
  }

  onLeftPress = ({ item, index }) => {
    if (this.props.onLeftPress) return this.props.onLeftPress({ item, index })
    this.setState({
      selected: index,
      rightData: item.data,
    })
  }

  onRightPress = async ({ item, index }) => {
    let data = this.props.data
    let parent = {}
    for (let p of data) {
      if (p.title === item.parentTitle) {
        parent = p
      }
    }
    if (index !== this.state.rightSelected) {
      this.setState({ rightSelected: index }, () => {
        if (this.props.onRightPress)
          return this.props.onRightPress({ parent, item, index })
      })
    } else {
      if (this.props.onRightPress)
        return this.props.onRightPress({ parent, item, index })
    }
  }

  renderLeftItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={
          this.state.selected === index
            ? this.styles.leftWrapSelect
            : this.styles.leftWrap
        }
        onPress={() => {
          this.onLeftPress({ item, index })
        }}
      >
        {this.state.selected === index && <View style={styles.leftSelectTag} />}
        <Text style={this.styles.leftItem} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  renderRightItem = ({ item, index }) => {
    let rightItem = this.isMultiple
      ? this.renderMultipleRightItem({ item, index })
      : this.renderSingleRightItem({ item, index })
    return rightItem
  }

  renderSingleRightItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={
          this.state.rightSelected === index
            ? this.styles.leftWrapSelect
            : this.styles.leftWrap
        }
        onPress={() => {
          this.onRightPress({ item, index })
        }}
      >
        <Text style={this.styles.rightItem} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  indexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === val) return i
    }
    return -1
  }

  renderMultipleRightItem = ({ item, index }) => {
    let isSelect = false
    let data = this.state.selectedData
    let datasourceIndex = -1
    for (let i = 0; i < data.length; i++) {
      if (item.datasourceName === data[i].datasourceName) {
        datasourceIndex = i
        break
      }
    }
    if (datasourceIndex != -1) {
      let desetIndex = this.indexOf(data[datasourceIndex].data, index)
      if (desetIndex != -1) {
        isSelect = true
      }
    }

    return (
      <View
        // style={item.hasSelect?this.styles.rightWrapBlue:this.styles.leftWrap}
        style={this.styles.leftWrap}
      >
        <CheckBox
          style={{
            height: scaleSize(30),
            width: scaleSize(30),
            marginLeft: scaleSize(20),
          }}
          checked={isSelect}
          onChange={value => {
            item.isSelect = value
            let data = this.state.selectedData
            if (value) {
              let datasourceIndex = -1
              for (let i = 0; i < data.length; i++) {
                if (item.datasourceName === data[i].datasourceName) {
                  data[i].data.push(index)
                  datasourceIndex = i
                  break
                }
              }
              if (datasourceIndex == -1) {
                let dataItem = {}
                dataItem.datasourceName = item.datasourceName
                let datasetArray = []
                datasetArray.splice()
                datasetArray.push(index)
                dataItem.data = datasetArray
                data.push(dataItem)
              }
            } else {
              for (let i = 0; i < data.length; i++) {
                if (item.datasourceName === data[i].datasourceName) {
                  let datasetIndex = this.indexOf(data[i].data, index)
                  if (datasetIndex != -1) {
                    data[i].data.splice(datasetIndex, 1)
                  }
                  break
                }
              }
            }
            this.setState({
              selectedData: data,
            })
          }}
        />
        <Text
          style={{
            flex: 1,
            marginLeft: scaleSize(40),
            fontSize: size.fontSize.fontSizeSm,
            color: item.hasSelect ? color.blue1 : color.black,
          }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </View>
    )
  }

  render() {
    let panHandlers = {}
    if (this._panResponder && this._panResponder.panHandlers) {
      panHandlers = this._panResponder.panHandlers
    }
    return (
      <View style={this.styles.container}>
        <View
          ref={ref => (this.leftList = ref)}
          style={this.styles.leftFlatListContainer}
        >
          <View style={this.styles.headContainer}>
            <Text style={this.styles.menuTitle}>{this.props.titles[0]}</Text>
          </View>
          <FlatList
            style={{ flex: 1 }}
            renderItem={this.renderLeftItem}
            data={this.props.data}
            extraData={this.state.selected}
            keyExtractor={(item, index) => item + index}
          />
        </View>
        {this.props.adjustmentWidth && (
          <View style={styles.moveSeparator} {...panHandlers}>
            <Image
              style={styles.dragIcon}
              source={getPublicAssets().common.icon_drag}
              resizeMode={'contain'}
            />
          </View>
        )}
        <View style={this.styles.rightFlatListContainer}>
          <View style={this.styles.headContainer}>
            <View style={styles.shortLine1} />
            <Text style={this.styles.menuTitle}>{this.props.titles[1]}</Text>
            <View style={styles.shortLine2} />
          </View>
          <FlatList
            ref={ref => (this.RightList = ref)}
            renderItem={this.renderRightItem}
            data={this.state.rightData}
            extraData={
              this.isMultiple
                ? this.state.selectedData
                : this.state.rightSelected
            }
            keyExtractor={(item, index) => item + index}
          />
        </View>
      </View>
    )
  }
}
