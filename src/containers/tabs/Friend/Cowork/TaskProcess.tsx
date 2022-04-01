import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { getLanguage } from '../../../../language/index'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'
import { connect } from 'react-redux'
import { getRwSubtaskById, setSubtaskProcess } from '../../../../utils/TaskThreeServiceUrtils'
import { SMap } from 'imobile_for_reactnative'
import {updateCoworkMsgProcess} from '../../../../../src/redux/models/cowork'

interface Props {
  language: string,
  navigation: any,
  newMessage: number,
  coworkInfo: any,
  currentTask: any,
  currentUser: any,
}

interface State {
  subTaskProcess: string,
}

const DEFAULT_LEFT = scaleSize(0)
class TaskProcess extends Component<Props, State> {

  left: Animated.Value
  visible: boolean
  timer: any
  totalCount: number
  isFirstC: boolean

  constructor(props: Props) {
    super(props)
    this.left = new Animated.Value(scaleSize(DEFAULT_LEFT))
    this.visible = true
    this.timer = null
    this.totalCount = 100
    this.isFirstC = true

    this.state = {
      subTaskProcess: this.props.currentTask?.process,
    }

  }

  componentDidMount = async () => {
    // this.updateSubTaskProcess()
    // this.timer = setInterval(async ()=>{
    //     console.log("1111");
    //     this.updateSubTaskProcess()
    //   }, 1000)
  }

  componentWillUnmount = () => {
   // 当定时器标识不为空时，先清除定时器
    // if(this.timer !== null){
    //   clearInterval(this.timer)
    // }
  }




  

  /** 
   * 保存第三方数据，并移除第三方数据图层
   */
   updateSubTaskProcess = async () => {
    try {
      // 当定时器标识不为空时，先清除定时器
      // if(this.timer !== null){
      //   clearInterval(this.timer)
      // }
      // 获取当前任务的ID
      let subtaskid = this.props.currentTask.resource.resourceId
      // 获取指定ID的子任务信息
      // let threeServiceIpUrl = 'http://192.168.11.21:6932' 
      let threeServiceIpUrl = this.props.threeServiceIpUrl
      let subtaskInfo = await getRwSubtaskById(subtaskid)

      let array = subtaskInfo.subtaskname.split("-")
      // 唯一标识
      let id = array[1] + '_' + array[2] + '_' + subtaskid

      // let ProcessStr = this.props.data.process
     

      // debugger
      // let totalCount = 10
      if(this.isFirstC) {
        debugger
        // 拿到子任务里显示数据的列表
        let infoDataList = JSON.parse(subtaskInfo.jsonvalue)['111']['1']
        let ProcessStr = subtaskInfo.process
        let preProcess = ProcessStr.substring(0,ProcessStr.length - 1)
        if(preProcess !== '0'){
          this.totalCount = Math.round((infoDataList.length * 100.0) / preProcess)
        }
        this.isFirstC = false
      }
     
      
      // 更新进度的参数
      let param = {
        id,
        totalCount:this.totalCount,  // 完成任务的对象总数
      }
      // 返回的是一个字符串
      // let process = await SMap.removeThreeDataLayer(param, false)
      let process = await SMap.upSubTaskProcess(param, false)
      // 当需要更新进度时才去更新
      if(process !== ''){
        let result = await setSubtaskProcess(subtaskid, process)
        
        // 定时更新
        // this.timer = setInterval(async ()=>{
        //   console.log("1111");
        //   let result = await setSubtaskProcess(threeServiceIpUrl, subtaskid, process)
        // }, 500)
        this.setState({subTaskProcess: process})

        if(result) {
          let curTaskInfo = JSON.parse(JSON.stringify(this.props.currentTask))
          curTaskInfo.process = process
          // 此处调用修改方法进行修改
          this.props.updateCoworkMsgProcess(curTaskInfo)
        }
      }
      
    } catch (error) {
      console.warn("update subTask process error: " + error)
    }
    
  }

  setVisible = (visible: boolean) => {
    if (visible !== this.visible) {
      Animated.timing(this.left, {
        toValue: visible ? scaleSize(DEFAULT_LEFT) : -500,
        duration: 300,
      }).start()
      this.visible = visible
    }
  }

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: this.left,
          top: scaleSize(220),
        }}
      >
        <View
          style={{
            backgroundColor: color.contentColorGray,
            height: scaleSize(60),
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: scaleSize(30),
            borderBottomRightRadius: scaleSize(30),
          }}
        >
          <View
            style={{
              paddingHorizontal: scaleSize(20),
            }}
          >
            <Text style={{ color: 'white', fontSize: size.fontSize.fontSizeLg }}>
             {"进度:" + this.state.subTaskProcess }
            </Text>
          </View>
        </View>
      </Animated.View>
    )
  }
}

const mapStateToProps = state => ({
  newMessage: state.cowork.toJS().coworkNewMessage,
  currentUser: state.user.toJS().currentUser,
  coworkInfo: state.cowork.toJS().coworkInfo,
  currentTask: state.cowork.toJS().currentTask,
  threeServiceIpUrl: state.cowork.toJS().threeServiceIpUrl,
})

const mapDispatchToProps = {
  updateCoworkMsgProcess,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true,
  },
)(TaskProcess)
