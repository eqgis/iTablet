import * as React from 'react'
import {
  View,
  Image,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import NavigationService from '../NavigationService'
import Orientation from 'react-native-orientation'
import styles from './styles'
import { Container, TextBtn } from '../../components'
import { SAIClassifyView, SMap, SMediaCollector } from 'imobile_for_reactnative'
import { Toast } from '../../utils'
import { getLanguage } from '../../language'
import { ConstPath } from '../../constants'
import { FileTools } from '../../native'

/*
 * 分类结果编辑界面
 */
export default class ClassifyResultEditView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}
    this.layerName = params.layerName || ''
    this.geoID = params.geoID || -1 // 有geoID则是修改
    this.datasourceAlias = params.datasourceAlias || ''
    this.datasetName = params.datasetName || ''
    if (
      Platform.OS === 'android' &&
      params.imagePath.toLowerCase().indexOf('content://') !== 0
    ) {
      this.imagePath = 'file://' + params.imagePath || ''
    } else {
      this.imagePath = params.imagePath || ''
    }
    this.classifyTime = params.classifyTime || ''
    this.cb = params && params.cb

    this.state = {
      mediaName: params.mediaName || '',
      remarks: params.description || '',
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  back = () => {
    this.cb && this.cb()
    NavigationService.goBack()
    return true
  }

  save = async () => {
    const mediaData = JSON.stringify({
      type: 'AI_CLASSIFY',
      mediaName: this.state.mediaName,
    })
    let result = false, modifiedData = []
    if (this.geoID > -1 && this.layerName) {
      let targetPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
          this.props.user.currentUser.userName +
          '/' +
          ConstPath.RelativeFilePath.Media,
      )
      modifiedData = [{
        name: 'MediaName',
        value: this.state.mediaName,
      },{
        name: 'Description',
        value: this.state.remarks,
      },{
        name: 'MediaData',
        value: mediaData,
      }]
      result = await SMediaCollector.saveMediaByDataset(
        this.layerName,
        this.geoID,
        targetPath,
        modifiedData,
        false,
        true,
      )
    } else {
      result = await SAIClassifyView.modifyLastItem({
        datasourceAlias: this.datasourceAlias,
        datasetName: this.datasetName,
        mediaName: this.state.mediaName,
        remarks: this.state.remarks,
        mediaData: mediaData,
      })
    }
    if (result) {
      Toast.show(getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY)
      this.cb && this.cb(modifiedData)
      NavigationService.goBack()
    }
  }

  renderImageViewer = () => {
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: this.imagePath }} />
      </View>
    )
  }

  renderInfoViewer = () => {
    return (
      <KeyboardAvoidingView
        enabled={true}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'column',
        }}
        behavior={Platform.OS === 'ios' && 'position'}
      >
        <View style={styles.infocontainer}>
          <View style={styles.classifyTitleView}>
            <Text style={styles.title}>
              {getLanguage(GLOBAL.language).AI.CATEGORY}
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              style={styles.edit}
              numberOfLines={2}
              onChangeText={text => this.setState({ mediaName: text })}
              value={this.state.mediaName}
            />
          </View>
          <View style={styles.classifyTitleView}>
            <Text style={styles.title}>
              {
                getLanguage(GLOBAL.language).Map_Main_Menu
                  .MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_TIME
              }
            </Text>
            <Text style={styles.titleConfidence}>{this.classifyTime}</Text>
          </View>
          <View style={styles.classifyTitleView}>
            <Text style={styles.title}>
              {
                getLanguage(GLOBAL.language).Map_Main_Menu
                  .MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_REMARKS
              }
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              style={styles.edit}
              numberOfLines={2}
              onChangeText={text => this.setState({ remarks: text })}
              value={this.state.remarks}
              placeholder={
                getLanguage(GLOBAL.language).Map_Main_Menu
                  .MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_PLEA_REMARKS
              }
              placeholderTextColor={'#A0A0A0'}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_CLASSIFY,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
          headerRight: [
            <TextBtn
              key={'confirm'}
              btnText={getLanguage(GLOBAL.language).Common.CONFIRM}
              textStyle={
                this.state.mediaName
                  ? styles.headerBtnTitle
                  : styles.headerBtnTitleDisable
              }
              containerStyle={{width:'auto'}}
              btnClick={this.save}
            />,
          ],
        }}
        bottomProps={{ type: 'fix' }}
      >
        <View style={styles.container}>
          {this.renderImageViewer()}
          {this.renderInfoViewer()}
        </View>
      </Container>
    )
  }
}
