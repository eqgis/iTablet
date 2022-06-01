import React, { Component } from 'react'
import { Container, TextBtn } from '../../../../components'
import { AnalystItem } from '../../components'
import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

export default class ProjectionParameterSetPage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    let _transMothodParameter = params.transMothodParameter
    this.cb = params && params.cb
    this.clickAble = true // 防止重复点击

    this.state = {
      paraNumber: _transMothodParameter.paraNumber,

      offsetX: _transMothodParameter.offsetX,
      offsetY: _transMothodParameter.offsetY,
      offsetZ: _transMothodParameter.offsetZ,

      rotationX: _transMothodParameter.rotationX,
      rotationY: _transMothodParameter.rotationY,
      rotationZ: _transMothodParameter.rotationZ,

      ratitionDifference: _transMothodParameter.ratitionDifference,
    }
  }

  confirm = () => {
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
    } else {
      return
    }

    if (this.cb && typeof this.cb === 'function') {
      this.ratitionDifferenceItem && this.ratitionDifferenceItem._blur()
      this.rotationXItem && this.rotationXItem._blur()
      this.rotationYItem && this.rotationYItem._blur()
      this.rotationZItem && this.rotationZItem._blur()
      this.offsetXItem && this.offsetXItem._blur()
      this.offsetYItem && this.offsetYItem._blur()
      this.offsetZItem && this.offsetZItem._blur()

      let _data = {}
      // _data.paraNumber = this.state.paraNumber
      // _data.offsetX = parseFloat(this.state.offsetX + '')
      // _data.offsetY = parseFloat(this.state.offsetY + '')
      // _data.offsetZ = parseFloat(this.state.offsetZ + '')
      // _data.rotationX = parseFloat(this.state.rotationX + '')
      // _data.rotationY = parseFloat(this.state.rotationY + '')
      // _data.rotationZ = parseFloat(this.state.rotationZ + '')
      // _data.ratitionDifference = parseFloat(this.state.ratitionDifference + '')

      _data.paraNumber = this.state.paraNumber
      _data.offsetX = parseFloat(
        this.offsetXItem && this.offsetXItem.getInputText() + '',
      )
      _data.offsetY = parseFloat(
        this.offsetYItem && this.offsetYItem.getInputText() + '',
      )
      _data.offsetZ = parseFloat(
        this.offsetZItem && this.offsetZItem.getInputText() + '',
      )
      _data.rotationX = parseFloat(
        this.rotationXItem && this.rotationXItem.getInputText() + '',
      )
      _data.rotationY = parseFloat(
        this.rotationYItem && this.rotationYItem.getInputText() + '',
      )
      _data.rotationZ = parseFloat(
        this.rotationZItem && this.rotationZItem.getInputText() + '',
      )
      _data.ratitionDifference = parseFloat(
        this.ratitionDifferenceItem &&
          this.ratitionDifferenceItem.getInputText() + '',
      )
      isNaN(_data.offsetX) ? (_data.offsetX = 0) : null
      isNaN(_data.offsetY) ? (_data.offsetY = 0) : null
      isNaN(_data.offsetZ) ? (_data.offsetZ = 0) : null

      isNaN(_data.rotationX) ? (_data.rotationX = 0) : null
      isNaN(_data.rotationY) ? (_data.rotationY = 0) : null
      isNaN(_data.rotationZ) ? (_data.rotationZ = 0) : null

      isNaN(_data.ratitionDifference) ? (_data.ratitionDifference = 0) : null

      this.cb(_data)
    }
  }

  //基本参数
  renderBasicParamerterView = () => {
    return (
      <View style={{ backgroundColor: color.white }}>
        <View style={[styles.titleView, { backgroundColor: color.white }]}>
          <Text style={styles.title}>
            {getLanguage(global.language).Analyst_Labels.BASIC_PARAMETER}
          </Text>
        </View>
        <AnalystItem
          ref={ref => (this.ratitionDifferenceItem = ref)}
          style={{ borderBottomWidth: 0 }}
          rightType={'input'}
          inputStyle={styles.inputStyle}
          title={getLanguage(global.language).Analyst_Labels.RATIO_DIFFERENCE}
          value={this.state.ratitionDifference + ''}
          keyboardType={'numeric'}
          onSubmitEditing={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.ratitionDifference
            }
            this.setState({
              ratitionDifference: value,
            })
          }}
          onBlur={value => {
            this.setState({
              ratitionDifference: value,
            })
          }}
        />
      </View>
    )
  }

  //旋转角度
  renderRotationAngleView = () => {
    return (
      <View style={{ backgroundColor: color.white, marginTop: scaleSize(20) }}>
        <View style={[styles.titleView, { backgroundColor: color.white }]}>
          <Text style={styles.title}>
            {getLanguage(global.language).Analyst_Labels.ROTATION_ANGLE_SECOND}
          </Text>
        </View>
        <AnalystItem
          ref={ref => (this.rotationXItem = ref)}
          rightType={'input'}
          inputStyle={styles.inputStyle}
          title={'X'}
          value={this.state.rotationX + ''}
          keyboardType={'numeric'}
          onSubmitEditing={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.rotationX
            }
            this.setState({
              rotationX: value,
            })
          }}
          onBlur={value => {
            this.setState({
              rotationX: value,
            })
          }}
        />
        <AnalystItem
          ref={ref => (this.rotationYItem = ref)}
          // style={{ borderBottomWidth: 0 }}
          rightType={'input'}
          inputStyle={styles.inputStyle}
          title={'Y'}
          value={this.state.rotationY + ''}
          keyboardType={'numeric'}
          onSubmitEditing={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.rotationY
            }
            this.setState({
              rotationY: value,
            })
          }}
          onBlur={value => {
            this.setState({
              rotationY: value,
            })
          }}
        />
        <AnalystItem
          ref={ref => (this.rotationZItem = ref)}
          style={{ borderBottomWidth: 0 }}
          rightType={'input'}
          inputStyle={styles.inputStyle}
          title={'Z'}
          value={this.state.rotationZ + ''}
          keyboardType={'numeric'}
          onSubmitEditing={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.rotationZ
            }
            this.setState({
              rotationZ: value,
            })
          }}
          onBlur={value => {
            this.setState({
              rotationZ: value,
            })
          }}
        />
      </View>
    )
  }

  //偏移量
  renderOffsetView = () => {
    return (
      <View style={{ backgroundColor: color.white, marginTop: scaleSize(20) }}>
        <View style={[styles.titleView, { backgroundColor: color.white }]}>
          <Text style={styles.title}>
            {getLanguage(global.language).Analyst_Labels.OFFSET}
          </Text>
        </View>
        <AnalystItem
          ref={ref => (this.offsetXItem = ref)}
          rightType={'input'}
          inputStyle={styles.inputStyle}
          title={'X'}
          value={this.state.offsetX + ''}
          keyboardType={'numeric'}
          onSubmitEditing={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.offsetX
            }
            this.setState({
              offsetX: value,
            })
          }}
          onBlur={value => {
            this.setState({
              offsetX: value,
            })
          }}
        />
        <AnalystItem
          ref={ref => (this.offsetYItem = ref)}
          // style={{ borderBottomWidth: 0 }}
          rightType={'input'}
          inputStyle={styles.inputStyle}
          title={'Y'}
          value={this.state.offsetY + ''}
          keyboardType={'numeric'}
          onSubmitEditing={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.offsetY
            }
            this.setState({
              offsetY: value,
            })
          }}
          onBlur={value => {
            this.setState({
              offsetY: value,
            })
          }}
        />
        <AnalystItem
          ref={ref => (this.offsetZItem = ref)}
          style={{ borderBottomWidth: 0 }}
          rightType={'input'}
          inputStyle={styles.inputStyle}
          title={'Z'}
          value={this.state.offsetZ + ''}
          keyboardType={'numeric'}
          onSubmitEditing={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.offsetZ
            }
            this.setState({
              offsetZ: value,
            })
          }}
          onBlur={value => {
            this.setState({
              offsetZ: value,
            })
          }}
        />
      </View>
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels
            .PROJECTION_PARAMETER_SETTING,
          navigation: this.props.navigation,
          backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={getLanguage(global.language).CONFIRM}
              textStyle={styles.headerBtnTitle}
              btnClick={this.confirm}
            />
          ),
        }}
      >
        <KeyboardAvoidingView
          enabled={true}
          keyboardVerticalOffset={10}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
          }}
          behavior={Platform.OS === 'ios' && 'padding'}
        >
          <ScrollView style={{ backgroundColor: color.background }}>
            {this.state.paraNumber === 3 ? null : (
              <View>
                {this.renderBasicParamerterView()}
                {this.renderRotationAngleView()}
              </View>
            )}
            {this.renderOffsetView()}
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
