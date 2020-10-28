import React, { Component } from 'react'
import { Container, TextBtn, Button, MTBtn } from '../../../../components'

import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize, Toast } from '../../../../utils'
import { color } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { getThemeAssets, getPublicAssets } from '../../../../assets'
import {
  View,
  Text,
  FlatList,
  TextInput,
  InteractionManager,
  Platform,
} from 'react-native'

import { SMRectifyView, SRectifyView } from 'imobile_for_reactnative'

export default class RegistrationPage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.rectifyReferDatasetInfo = params?.rectifyReferDatasetInfo
    this.tempControlPoints = []

    let defaultArithmetic = {
      title: getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_OFFSET,
      arithmeticMode: 4,
    }
    GLOBAL.RegistrationArithmeticMode = defaultArithmetic.arithmeticMode
    this.state = {
      isCanDo: true,

      isShowDetail: false,
      isEditPoint: false,
      currentIndex: -1,
      controlPoints: {},

      showPointsData: [],
      tempPoint: {},
      isAssociat: false,

      arithmetic: defaultArithmetic,
    }
  }

  componentDidMount = async () => {
    try {
      setTimeout(async function() {
        if (GLOBAL.RectifyDatasetInfo) {
          await SRectifyView.setRectifyDataset(GLOBAL.RectifyDatasetInfo)
        }
        if (this.rectifyReferDatasetInfo) {
          await SRectifyView.setReferDataset(this.rectifyReferDatasetInfo)
        }
        if (GLOBAL.RegistrationArithmeticMode) {
          await SRectifyView.setTransformationMode(
            GLOBAL.RegistrationArithmeticMode,
          )
        }
        if (Platform.OS === 'android') {
          await SRectifyView.setSplit(0.49)
        }
      }, 500)
    } catch (e) {
      return
    }
  }

  setPoint(point, index) {
    if (
      point.originalPoint !== null &&
      point.originalPoint.x !== null &&
      point.originalPoint.y !== null
    ) {
      let originalX = point.originalPoint.x
      let originalY = point.originalPoint.y
      if (!this.myIsNaN(originalX)) {
        originalX = parseFloat(originalX)
      }
      if (!this.myIsNaN(originalY)) {
        originalY = parseFloat(originalY)
      }
      SRectifyView.setOriginalControlPoint(index, originalX, originalY)
    }
    if (
      point.targetPoint !== null &&
      point.targetPoint.x !== null &&
      point.targetPoint.y !== null
    ) {
      let targetX = point.targetPoint.x
      let targetY = point.targetPoint.y
      if (!this.myIsNaN(targetX)) {
        targetX = parseFloat(targetX)
      }
      if (!this.myIsNaN(targetY)) {
        targetY = parseFloat(targetY)
      }
      SRectifyView.setTargetControlPoint(index, targetX, targetY)
    }
  }

  back = async () => {
    if (this.state.isEditPoint) {
      this.setPoint(this.state.tempPoint, this.state.currentIndex)
      SRectifyView.setCurrentIndex(-1)
      this.setState({
        isShowDetail: true,
        isEditPoint: false,
        currentIndex: -1,
      })
    } else {
      GLOBAL.Loading.setLoading(
        true,
        getLanguage(GLOBAL.language).Prompt.CLOSING,
        //'正在关闭地图'
        { bgColor: '#rgba(0, 0, 0, 0.5)' },
      )
      // Toast.show(getLanguage(GLOBAL.language).Prompt.CLOSING)
      setTimeout(async function() {
        await SRectifyView.dispose()
        GLOBAL.Loading.setLoading(false)
        NavigationService.goBack()
      }, 200)
    }
  }

  sure = async () => {
    if (this.state.isEditPoint) {
      (async function() {
        let _controlPoints = await SRectifyView.getControlPoints()
        let points = this.checkPoints(_controlPoints)
        let point = points[this.state.currentIndex]
        let _showPointsData = this.state.showPointsData
        _showPointsData[this.state.currentIndex] = point

        this.setPoint(this.state.tempPoint, this.state.currentIndex)
        SRectifyView.setCurrentIndex(-1)
        this.setState({
          isShowDetail: true,
          isEditPoint: false,
          currentIndex: -1,
          showPointsData: _showPointsData,
        })
      }.bind(this)())
    } else {
      this.exit()
    }
  }

  exit = async () => {
    GLOBAL.Loading.setLoading(
      true,
      getLanguage(GLOBAL.language).Prompt.CLOSING,
      //'正在关闭地图'
      { bgColor: '#rgba(0, 0, 0, 0.5)' },
    )

    InteractionManager.runAfterInteractions(async () => {
      await SRectifyView.dispose()
      GLOBAL.Loading.setLoading(false)

      NavigationService.goBack('RegistrationDatasetPage')
    })
  }

  confirm = async () => {
    //判断是否有无效点
    let _isAllPointEffect = await SRectifyView.isAllPointEffect()
    if (!_isAllPointEffect) {
      Toast.show(
        getLanguage(GLOBAL.language).Analyst_Prompt
          .REGISTRATION_POINTS_NUMBER_ERROR,
      )
      return
    }
    let controlPoints = await SRectifyView.getControlPoints()
    let result = this.checkControlPoints(controlPoints)
    if (result) {
      NavigationService.navigate('RegistrationExecutePage')
    }
  }

  checkControlPoints(controlPoints) {
    let result = false
    if (
      controlPoints.originalPoints.length != controlPoints.targetPoints.length
    ) {
      Toast.show(
        getLanguage(GLOBAL.language).Analyst_Prompt
          .REGISTRATION_POINTS_NUMBER_ERROR,
      )
    } else if (GLOBAL.RegistrationArithmeticMode != undefined) {
      let arithmeticMode = GLOBAL.RegistrationArithmeticMode
      switch (arithmeticMode) {
        case 1:
          if (controlPoints.originalPoints.length < 4) {
            Toast.show(
              getLanguage(GLOBAL.language).Analyst_Prompt
                .REGISTRATION_LINE_POINTS,
            )
          } else {
            result = true
          }
          break
        case 2:
          if (controlPoints.originalPoints.length < 7) {
            Toast.show(
              getLanguage(GLOBAL.language).Analyst_Prompt
                .REGISTRATION_QUADRATIC_POINTS,
            )
          } else {
            result = true
          }
          break
        case 0:
          if (controlPoints.originalPoints.length != 2) {
            Toast.show(
              getLanguage(GLOBAL.language).Analyst_Prompt
                .REGISTRATION_RECTANGLE_POINTS,
            )
          } else {
            result = true
          }
          break
        case 4:
          if (controlPoints.originalPoints.length != 1) {
            Toast.show(
              getLanguage(GLOBAL.language).Analyst_Prompt
                .REGISTRATION_OFFSET_POINTS,
            )
          } else {
            result = true
          }
          break
      }
    }
    return result
  }

  toRegistrationArithmeticPage = () => {
    NavigationService.navigate('RegistrationArithmeticPage', {
      cb: item => {
        GLOBAL.RegistrationArithmeticMode = item.arithmeticMode
        this.setState({
          arithmetic: item,
        })
        NavigationService.goBack()
      },
    })
  }

  setAssociation = () => {
    let _isAssociation = this.state.isAssociat
    _isAssociation = !_isAssociation
    SRectifyView.setIsAssociatedView(_isAssociation)
    this.setState({
      isAssociat: _isAssociation,
    })
  }

  export = async () => {
    //判断是否有无效点
    let _isAllPointEffect = await SRectifyView.isAllPointEffect()
    if (!_isAllPointEffect) {
      Toast.show(
        getLanguage(GLOBAL.language).Analyst_Prompt
          .REGISTRATION_POINTS_NUMBER_ERROR,
      )
      return
    }
    //检查控制点的数量
    let controlPoints = await SRectifyView.getControlPoints()
    let result = this.checkControlPoints(controlPoints)
    if (!result) {
      return
    }
    let defaultName = ''
    if (
      GLOBAL.RectifyDatasetInfo &&
      GLOBAL.RectifyDatasetInfo.length > 0 &&
      GLOBAL.RectifyDatasetInfo[0].datasourceName
    ) {
      defaultName = GLOBAL.RectifyDatasetInfo[0].datasourceName
    }
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(GLOBAL.language).Analyst_Labels
        .REGISTRATION_EXPORT_FILE_NAME,
      value: defaultName,
      placeholder: getLanguage(GLOBAL.language).Analyst_Labels
        .REGISTRATION_EXPORT_FILE_NAME,
      type: 'name',
      cb: async value => {
        NavigationService.goBack()
        GLOBAL.Loading.setLoading(
          true,
          getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_EXPORT,
        )
        let result = await SRectifyView.rectifyInfoSaveAs(value)
        GLOBAL.Loading.setLoading(false)
        if (result) {
          Toast.show(
            getLanguage(GLOBAL.language).Analyst_Labels
              .REGISTRATION_EXPORT_SUCCESS,
          )
        } else {
          Toast.show(
            getLanguage(GLOBAL.language).Analyst_Labels
              .REGISTRATION_EXPORT_FAILED,
          )
        }
      },
    })
  }

  getToolBarItem = () => {
    return [
      {
        title: getLanguage(GLOBAL.language).Analyst_Labels
          .REGISTRATION_POINTS_DETAIL,
        image: getThemeAssets().analyst.analysis_connectivity,
        action: this.detalShow,
      },
      {
        title: getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_EXECUTE,
        image: getThemeAssets().analyst.analysis_traveling,
        action: this.confirm,
      },
      {
        title: getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_EXPORT,
        image: getPublicAssets().mapTools.tools_new_thematic_map,
        action: this.export,
      },
      {
        title: getLanguage(GLOBAL.language).Analyst_Labels.ARITHMETIC,
        image: getPublicAssets().mapTools.tools_modify_thematic_map,
        action: this.toRegistrationArithmeticPage,
      },
    ]
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.btnViewP}>
        <MTBtn
          style={styles.btn}
          imageStyle={styles.btnImage}
          key={index}
          title={item.title}
          textColor={'black'}
          textStyle={{ fontSize: scaleSize(20), marginTop: scaleSize(8) }}
          size={MTBtn.Size.NORMAL}
          image={item.image}
          onPress={item.action}
          activeOpacity={0.5}
        />
      </View>
    )
  }

  renderToolBar = () => {
    return (
      <View style={styles.toolbarContainer}>
        <FlatList
          ref={ref => (this.list = ref)}
          data={this.getToolBarItem()}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index + '-' + item.title}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    )
  }

  renderArithmeticTitle() {
    return (
      <View style={styles.clickHintView}>
        <Text style={styles.clickHintText}>
          {this.state.arithmetic && this.state.arithmetic.title}
        </Text>
      </View>

      // <View
      //   style={{
      //     width: scaleSize(160),
      //     height: scaleSize(60),
      //     marginTop: scaleSize(30),
      //     marginRight: scaleSize(30),
      //   }}
      // >
      //   <Text>
      //     {this.state.arithmetic&&this.state.arithmetic.title}
      //   </Text>
      // </View>
    )
  }

  renderAssociatView() {
    return (
      <View
        style={{
          width: scaleSize(160),
          height: scaleSize(60),
          marginTop: scaleSize(30),
          marginLeft: scaleSize(30),
        }}
      >
        <Button
          title={
            this.state.isAssociat
              ? getLanguage(GLOBAL.language).Analyst_Labels
                .REGISTRATION_ASSOCIATION_CLOCE
              : getLanguage(GLOBAL.language).Analyst_Labels
                .REGISTRATION_ASSOCIATION
          }
          ref={ref => (this.sureButton = ref)}
          type={'BLUE'}
          style={{
            width: scaleSize(200),
            height: scaleSize(60),
          }}
          titleStyle={{ fontSize: scaleSize(24) }}
          onPress={this.setAssociation}
        />
      </View>
    )
  }
  /////////////////////////////////////////////查看/////////////////////////
  checkPoints = data => {
    let originalPoints = data.originalPoints
    let targetPoints = data.targetPoints
    let length =
      originalPoints.length > targetPoints.length
        ? originalPoints.length
        : targetPoints.length
    let pointsData = []
    for (let i = 0; i < length; i++) {
      let _originalPoint = originalPoints.length > i ? originalPoints[i] : null
      let _targetPoint = targetPoints.length > i ? targetPoints[i] : null
      let point = {
        originalPoint: _originalPoint,
        targetPoint: _targetPoint,
        index: i,
      }
      pointsData.push(point)
    }
    return pointsData
  }
  detalShow = async () => {
    let _controlPoints = await SRectifyView.getControlPoints()
    this.tempControlPoints = _controlPoints
    // if (
    //   _controlPoints.originalPoints.length != _controlPoints.targetPoints.length
    // ) {
    //   Toast.show(
    //     getLanguage(GLOBAL.language).Analyst_Prompt
    //       .REGISTRATION_POINTS_NUMBER_ERROR,
    //   )
    //   return
    // }
    let points = this.checkPoints(_controlPoints)

    this.setState({
      showPointsData: points,
      controlPoints: _controlPoints,
      isShowDetail: true,
    })
  }

  detalBack = () => {
    this.setState({
      isShowDetail: false,
    })
  }
  myIsNaN(value) {
    return typeof value === 'number' && !isNaN(value)
  }
  detalConfirm = () => {
    let _showPointsData = this.state.showPointsData
    for (let i = 0; i < _showPointsData.length; i++) {
      if (
        _showPointsData[i].originalPoint !== null &&
        _showPointsData[i].originalPoint.x !== null &&
        _showPointsData[i].originalPoint.y !== null
      ) {
        let originalX = _showPointsData[i].originalPoint.x
        let originalY = _showPointsData[i].originalPoint.y
        if (!this.myIsNaN(originalX)) {
          originalX = parseFloat(originalX)
        }
        if (isNaN(originalX)) {
          originalX = 0
        }
        if (!this.myIsNaN(originalY)) {
          originalY = parseFloat(originalY)
        }
        if (isNaN(originalY)) {
          originalY = 0
        }
        SRectifyView.setOriginalControlPoint(i, originalX, originalY)
      }
      if (
        _showPointsData[i].targetPoint !== null &&
        _showPointsData[i].targetPoint.x !== null &&
        _showPointsData[i].targetPoint.y !== null
      ) {
        let targetX = _showPointsData[i].targetPoint.x
        let targetY = _showPointsData[i].targetPoint.y
        if (!this.myIsNaN(targetX)) {
          targetX = parseFloat(targetX)
        }
        if (isNaN(targetX)) {
          targetX = 0
        }
        if (!this.myIsNaN(targetY)) {
          targetY = parseFloat(targetY)
        }
        if (isNaN(targetY)) {
          targetY = 0
        }
        SRectifyView.setTargetControlPoint(i, targetX, targetY)
      }
    }

    this.setState({
      isShowDetail: false,
    })
  }

  reselcetPoint = index => {
    SRectifyView.setCurrentIndex(index)
    let _tempPoint = this.state.showPointsData[index]
    this.setState({
      isShowDetail: false,
      isEditPoint: true,
      tempPoint: _tempPoint,
      currentIndex: index,
    })
  }

  removePoint = index => {
    SRectifyView.removeControlPoint(index)
    let _showPointsData = this.state.showPointsData
    _showPointsData.splice(index, 1)
    this.setState({
      showPointsData: _showPointsData,
    })
  }

  clearNoNum = value => {
    value = value.replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if (value.indexOf('.') < 0 && value != '') {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value = parseFloat(value)
    } else if (value == '') {
      value = 0
    }
    return value
  }

  checkNum = value => {
    value = value.replace(/[^\-?\d.]/g, '')
    // if (value.indexOf('.') < 0 && value != '') {
    //   //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    //   value = parseFloat(value)
    // } else if (value == '') {
    //   value = 0
    // }
    return value
  }

  renderDetailItemView = ({ item, index }) => {
    // renderDetailItemView(item,index) {
    return (
      <View
        style={{
          backgroundColor: color.content_white,
          marginTop: index === 0 ? scaleSize(0) : scaleSize(10),
        }}
      >
        <View style={styles.detalItemHeaderView}>
          <Text style={styles.textStyle}>
            {getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_ENUMBER +
              (index + 1)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <TextBtn
              btnText={getLanguage(GLOBAL.language).Analyst_Labels.DELETE}
              textStyle={{
                fontSize: scaleSize(24),
                color: color.blue1,
              }}
              btnClick={() => {
                this.removePoint(index)
              }}
            />

            <TextBtn
              btnText={
                getLanguage(GLOBAL.language).Analyst_Labels
                  .REGISTRATION_RESELECT_POINT
              }
              textStyle={{
                fontSize: scaleSize(24),
                color: color.blue1,
                marginLeft: scaleSize(15),
              }}
              btnClick={() => {
                this.reselcetPoint(index)
              }}
            />
          </View>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.detalSubItemView}>
          <Text style={styles.textStyle}>
            {getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_ORIGINAL +
              'X'}
          </Text>
          <TextInput
            style={styles.textInputStyle}
            value={item.originalPoint && item.originalPoint.x + ''}
            keyboardType="numeric"
            onChangeText={text => {
              // let originalX = this.clearNoNum(text)
              // let originalX=text.replace(/[^\-?\d.]/g,'')
              let originalX = this.checkNum(text)
              let _showPointsData = this.state.showPointsData
              // if(_showPointsData.length<index){
              //   let count =index - _showPointsData.length +1
              //   for(let i=0;i<count;i++){
              //     _showPointsData.push({targetPoint:null,originalPoint:null})
              //   }
              // }
              if (_showPointsData[index].originalPoint === null) {
                _showPointsData[index].originalPoint = { x: originalX, y: '' }
              } else {
                _showPointsData[index].originalPoint.x = originalX
              }
              this.setState({
                showPointsData: _showPointsData,
              })
            }}
          />
        </View>
        <View style={styles.lineSubStyle} />
        <View style={styles.detalSubItemView}>
          <Text style={styles.textStyle}>
            {getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_ORIGINAL +
              'Y'}
          </Text>
          <TextInput
            style={styles.textInputStyle}
            value={item.originalPoint && item.originalPoint.y + ''}
            keyboardType="numeric"
            onChangeText={text => {
              let originalY = this.checkNum(text)
              let _showPointsData = this.state.showPointsData
              if (_showPointsData[index].originalPoint === null) {
                _showPointsData[index].originalPoint = { x: '', y: originalY }
              } else {
                _showPointsData[index].originalPoint.y = originalY
              }
              this.setState({
                showPointsData: _showPointsData,
              })
            }}
          />
        </View>

        <View style={styles.lineSubStyle} />
        <View style={styles.detalSubItemView}>
          <Text style={styles.textStyle}>
            {getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_TAREGT +
              'X'}
          </Text>
          <TextInput
            style={styles.textInputStyle}
            value={item.targetPoint && item.targetPoint.x + ''}
            keyboardType="numeric"
            onChangeText={text => {
              let targetX = this.checkNum(text)
              let _showPointsData = this.state.showPointsData
              if (_showPointsData[index].targetPoint === null) {
                _showPointsData[index].targetPoint = { x: targetX, y: '' }
              } else {
                _showPointsData[index].targetPoint.x = targetX
              }
              this.setState({
                showPointsData: _showPointsData,
              })
            }}
          />
        </View>
        <View style={styles.lineSubStyle} />
        <View style={styles.detalSubItemView}>
          <Text style={styles.textStyle}>
            {getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION_TAREGT +
              'Y'}
          </Text>
          <TextInput
            style={styles.textInputStyle}
            value={item.targetPoint && item.targetPoint.y + ''}
            keyboardType="numeric"
            onChangeText={text => {
              let targetY = this.checkNum(text)
              let _showPointsData = this.state.showPointsData
              if (_showPointsData[index].targetPoint === null) {
                _showPointsData[index].targetPoint = { x: '', y: targetY }
              } else {
                _showPointsData[index].targetPoint.y = targetY
              }
              this.setState({
                showPointsData: _showPointsData,
              })
            }}
          />
        </View>
      </View>
    )
  }

  renderPointsDetail() {
    return (
      <Container
        // style={styles.container}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
        ref={ref => (this.container = ref)}
        showFullInMap={true}
        headerProps={{
          title: getLanguage(GLOBAL.language).Analyst_Labels
            .REGISTRATION_POINTS_DETAIL,
          navigation: this.props.navigation,
          backAction: this.detalBack,
          headerRight: (
            <TextBtn
              btnText={getLanguage(GLOBAL.language).Analyst_Labels.CONFIRM}
              textStyle={
                this.state.isCanDo
                  ? styles.headerBtnTitle
                  : styles.headerBtnTitleDisable
              }
              btnClick={this.detalConfirm}
            />
          ),
        }}
      >
        <FlatList
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: color.background,
          }}
          renderItem={this.renderDetailItemView}
          data={this.state.showPointsData}
          keyExtractor={(item, index) => item + index}
        />
      </Container>
    )
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: color.transView }]}>
        <View
          style={{
            position: 'absolute',
            // height: this.state.isShowDetail ? 100 : '100%',
            // width: '100%',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Container
            style={{
              height: '100%',
            }}
            ref={ref => (this.container = ref)}
            showFullInMap={true}
            headerProps={{
              title: getLanguage(GLOBAL.language).Analyst_Labels.REGISTRATION,
              navigation: this.props.navigation,
              backAction: this.exit,
              headerRight: (
                <TextBtn
                  btnText={
                    this.state.isEditPoint
                      ? getLanguage(GLOBAL.language).Analyst_Labels.CONFIRM
                      : getLanguage(GLOBAL.language).Profile.LICENSE_EXIT
                  }
                  textStyle={styles.headerBtnTitle}
                  btnClick={this.sure}
                />
              ),
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                position: 'absolute',
                top: scaleSize(100),
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <SMRectifyView
                style={{
                  flex: 1,
                  paddingHorizontal: scaleSize(30),
                  alignItems: 'center',
                  backgroundColor: color.bgW,
                }}
                language={GLOBAL.language}
              />

              {this.renderAssociatView()}
              {this.renderArithmeticTitle()}
              {this.state.isEditPoint ? null : this.renderToolBar()}
            </View>

            {/* {this.renderAssociatView()}
            {this.renderArithmeticTitle()}
            {this.state.isEditPoint ? null : this.renderToolBar()} */}
            {/* {this.state.isShowDetail?this.renderPointsDetail():null} */}
          </Container>
        </View>
        {this.state.isShowDetail ? this.renderPointsDetail() : null}
      </View>
    )
  }
}
