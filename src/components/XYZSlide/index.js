import React, { Component } from 'react'
import { View, Text ,TextInput} from 'react-native'
import { screen, scaleSize } from '../../utils'
import SlideBar from '../SlideBar'
import { getLanguage } from '../../language'
import {  size } from '../../styles'

export default class XYZSlide extends Component {
  props: {
    style: Object,
    rangeX: Array,
    rangeY: Array,
    rangeZ: Array,
    onMoveX: () => {},
    onMoveY: () => {},
    onMoveZ: () => {},
    defaultValuex:number, //控件初始值
    defaultValuey:number,//控件初始值
    defaultValuez:number,//控件初始值
    isRotation: Boolean,//三维管线使用时设置参数，其他地方可忽略
    isTransLation: Boolean,//三维管线使用时设置参数，其他地方可忽略
    hasTitle: Boolean,//控件上方显示具体值，三维管线使用时设置参数，其他地方可忽略
    isScale: Boolean,//三维管线使用时设置参数，其他地方可忽略
  }

  static defaultProps = {
    rangeX: [0, 100],
    rangeY: [0, 100],
    rangeZ: [0, 100],
    style:{ width: screen.getScreenWidth() - scaleSize(130) },
    defaultValuex: 0,
    defaultValuey: 0,
    defaultValuez: 0,
    isRotation: false,
    isTransLation: false,
    hasTitle: false,
    isScale: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      backgroundColor: '#FFFFFF',
      title:"",
      data:[],
      num:0,
    }
  }

  onStart = () => {
    // this.setState({
    //   backgroundColor: '#FFFFFFAA',
    // })
  }

  onEnd = () => {
    // this.setState({
    //   backgroundColor: '#FFFFFF',
    // })
  }
  
  onMoveX = (value) => {
    this.props.onMoveX(value)
    if(this.props.isScale){
      this.setState({
        title: value/10000,
        num: value/10000,
      })
      return
    }
    if(this.props.isTransLation){
      this.setState({
        title: value/10+'米',
      })
    }else{
      this.setState({
        title: 'X轴'+value,
      })
    }
  }

  onMoveY = (value) => {
    this.props.onMoveY(value)
    if(this.props.isTransLation){
      this.setState({
        title: value/10+'米',
      })
    }else{
      this.setState({
        title: 'Y轴'+value,
      })
    }
  }

  onMoveZ = (value) => {
    this.props.onMoveZ(value)
    if(this.props.isTransLation){
      this.setState({
        title: value/10+'米',
      })
    }else{
      this.setState({
        title: 'Z轴'+value,
      })
    }
  }

  onClear = () => {
    this.state.data[0]&&this.state.data[0].onClear()
    this.state.data[1]&&this.state.data[1].onClear()
    this.state.data[2]&&this.state.data[2].onClear()
    this.setState({
      title: '',
    })
  }

  renderItem = dir => {
    let range, onMove, labelLeft, labelRight,defaultValue,num
    switch (dir) {
      case 'x':
        labelLeft = this.props.isRotation? -180:getLanguage(global.language).Common.LEFT
        labelRight = this.props.isRotation? 180:getLanguage(global.language).Common.RIGHT
        if(this.props.isScale){
          labelLeft = 0
          labelRight = 1
        }
        range = this.props.rangeX
        onMove = value =>{this.onMoveX(value)}
        defaultValue = this.props.defaultValuex
        num = 0
        break
      case 'y':
        labelLeft = this.props.isRotation? -180:getLanguage(global.language).Common.DOWN
        labelRight = this.props.isRotation? 180:getLanguage(global.language).Common.UP
        range = this.props.rangeY
        onMove = value =>{this.onMoveY(value)}
        defaultValue = this.props.defaultValuey
        num = 1
        break
      default:
        labelLeft = this.props.isRotation? -180:getLanguage(global.language).Common.BACK
        labelRight = this.props.isRotation? 180:getLanguage(global.language).Common.FRONT
        range = this.props.rangeZ
        onMove = value =>{this.onMoveZ(value)}
        defaultValue = this.props.defaultValuez
        num = 2
        break
    }
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          numberOfLines={1}
          style={{
            width: scaleSize(60),
            textAlign: 'center',
            fontSize: scaleSize(24),
          }}
        >
          {labelLeft}
        </Text>
        <SlideBar
          ref={ref => (this.state.data[num] = ref)}
          style={this.props.style}
          range={range}
          onStart={this.onStart}
          onEnd={this.onEnd}
          onMove={onMove}
          defaultValue={defaultValue}
        />
        <Text
          numberOfLines={1}
          style={{
            width: scaleSize(60),
            textAlign: 'center',
            fontSize: scaleSize(24),
          }}
        >
          {labelRight}
        </Text>
      </View>
    )
  }

  renderTitle = () =>{
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' ,justifyContent: 'center'}}>
        <Text
          numberOfLines={1}
          style={{
            width: scaleSize(150),
            textAlign: 'center',
            fontSize: scaleSize(24),
          }}
        >
          {this.state.title}
        </Text>
      </View>
    )
  }

  renderInputTitle= () =>{
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' ,justifyContent: 'center'}}>
        <TextInput
          ref={ref => (this.input = ref)}
          underlineColorAndroid={'transparent'}
          style={{
            width: scaleSize(150),
            height: scaleSize(60),
            backgroundColor: 'transparent',
            textAlign: 'center',
            fontSize: scaleSize(24),
            alignItems: 'center' ,
            justifyContent: 'center',
          }}
          keyboardType={'numeric'}
          defaultValue={this.state.num}
          value={(this.state.num || '') + ''}
          returnKeyLabel={'完成'}
          returnKeyType={'done'}
          onChangeText={num => {
            if(num<0){
              num = 0
            }
            if(num>1){
              num = 1
            }
            this.setState({title:num+'',num:num})
          }}
          onSubmitEditing={this.onSubmitEditing}
          onBlur={this.onBlur}
        />
      </View>
    )
  }

  onSubmitEditing = () => {
    this.onMoveX(this.state.num*10000)
    this.state.data[0].setDefault(this.state.num*10000)
  }

  render() {
    return (
      <View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            paddingTop: this.props.hasTitle ? 0 : scaleSize(20),
            width: '100%',
            borderTopStartRadius: scaleSize(40),
            borderTopRightRadius: scaleSize(40),
            backgroundColor: this.state.backgroundColor,
            height: this.props.isScale ? scaleSize(150) : scaleSize(200),
          },
        ]}
      >
        {this.props.isRotation && this.renderTitle() || this.props.isTransLation && this.renderTitle()}
        {this.props.isScale && this.renderInputTitle()}
        {this.props.onMoveX && this.renderItem('x')}
        {this.props.onMoveY && this.renderItem('y')}
        {this.props.onMoveZ && this.renderItem('z')}
      </View>
    )
  }
}
