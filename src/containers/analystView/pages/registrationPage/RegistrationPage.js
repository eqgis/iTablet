import React, { Component } from 'react'
import { Container, TextBtn } from '../../../../components'

import styles from './styles'
import { getLanguage } from '../../../../language'
import { scaleSize, Toast } from '../../../../utils'
import { color } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { View } from 'react-native'

import { SMRectifyView, SRectifyView } from 'imobile_for_reactnative'
// import { SMRectifyView } from 'imobile_for_reactnative'

export default class RegistrationPage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.tempControlPoints = []

    this.state = {
      isCanDo: true,

      isShowDetail: false,
      controlPoints: {},
    }
  }

  componentDidMount = async () => {
    try {
      setTimeout(async function() {
        if (GLOBAL.RectifyDatasetInfo) {
          await SRectifyView.setRectifyDataset(GLOBAL.RectifyDatasetInfo)
        }
        if (GLOBAL.RectifyReferDatasetInfo) {
          await SRectifyView.setReferDataset(GLOBAL.RectifyReferDatasetInfo)
        }
      }, 500)
    } catch (e) {
      return
    }
  }

  confirm = async () => {
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
        getLanguage(global.language).Analyst_Prompt
          .REGISTRATION_POINTS_NUMBER_ERROR,
      )
    } else if (GLOBAL.RegistrationArithmeticMode != undefined) {
      let arithmeticMode = GLOBAL.RegistrationArithmeticMode
      switch (arithmeticMode) {
        case 0:
          if (controlPoints.originalPoints.length < 4) {
            Toast.show(
              getLanguage(global.language).Analyst_Prompt
                .REGISTRATION_LINE_POINTS,
            )
          } else {
            result = true
          }
          break
        case 1:
          if (controlPoints.originalPoints.length < 7) {
            Toast.show(
              getLanguage(global.language).Analyst_Prompt
                .REGISTRATION_QUADRATIC_POINTS,
            )
          } else {
            result = true
          }
          break
        case 2:
          if (controlPoints.originalPoints.length != 2) {
            Toast.show(
              getLanguage(global.language).Analyst_Prompt
                .REGISTRATION_RECTANGLE_POINTS,
            )
          } else {
            result = true
          }
          break
        case 3:
          if (controlPoints.originalPoints.length != 1) {
            Toast.show(
              getLanguage(global.language).Analyst_Prompt
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

  /////////////////////////////////////////////查看/////////////////////////
  detalShow = async () => {
    let _controlPoints = await SRectifyView.getControlPoints()
    this.tempControlPoints = _controlPoints
    this.setState({
      controlPoints: _controlPoints,
      isShowDetail: true,
    })
  }

  detalConfirm() {}

  renderDetailItemView() {
    return (
      <View>
        <View style={styles.detalItemView} />
      </View>
    )
  }

  renderPointsDetail() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels
            .REGISTRATION_POINTS_DETAIL,
          navigation: this.props.navigation,
          backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={getLanguage(global.language).Analyst_Labels.CONFIRM}
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
        <SMRectifyView
          ref={ref => (GLOBAL.SMAIDetectView = ref)}
          style={{
            flex: 1,
            paddingHorizontal: scaleSize(30),
            alignItems: 'center',
            backgroundColor: color.bgW,
          }}
          language={global.language}
        />
      </Container>
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Analyst_Labels.REGISTRATION,
          navigation: this.props.navigation,
          backAction: this.back,
          headerRight: (
            <TextBtn
              btnText={
                getLanguage(global.language).Analyst_Labels.REGISTRATION_EXECUTE
              }
              textStyle={
                this.state.isCanDo
                  ? styles.headerBtnTitle
                  : styles.headerBtnTitleDisable
              }
              btnClick={this.confirm}
            />
          ),
        }}
      >
        <SMRectifyView
          ref={ref => (GLOBAL.SMAIDetectView = ref)}
          style={{
            flex: 1,
            paddingHorizontal: scaleSize(30),
            alignItems: 'center',
            backgroundColor: color.bgW,
          }}
          language={global.language}
        />
      </Container>
    )
  }
}
