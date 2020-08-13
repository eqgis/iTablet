/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native'
import { Container, CustomInputDialog } from '../../components'
import {
  getLayerIconByType,
  getLayerWhiteIconByType,
  getPublicAssets,
} from '../../assets'
import { dataUtil, scaleSize, screen, setSpText, Toast } from '../../utils'
import color from '../../styles/color'
import { getLanguage } from '../../language'
import { SMap, DatasetType } from 'imobile_for_reactnative'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'

export default class CreateNavDataPage extends Component {
  props: {
    navigation: Object,
    device: Object,
    currentUser: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedDataset: {},
      selectedDatasource: {},
    }
    this.maxWidth = new Animated.Value(
      screen.getScreenWidth(this.props.device.orientation),
    )
    this.maxHeight =
      screen.getScreenHeight(this.props.device.orientation) - scaleSize(200)
  }
  async componentDidMount() {
    let data = await SMap.getDatasourceAndDataset()
    if (data.length === 0 || data[0]?.data?.length === 0) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.INCREMENT_FIRST)
      this.props.navigation.goBack()
    } else if (data[1]?.data?.length === 0) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.NO_DATASOURCE)
      setTimeout(() => {
        this.dialog.setDialogVisible(true, {
          title: getLanguage(GLOBAL.language).Map_Main_Menu.NEW_DATASOURCE,
          value: 'default_roadnet_datasource',
          confirmBtnTitle: getLanguage(GLOBAL.language).Prompt.CONFIRM,
          cancelBtnTitle: getLanguage(GLOBAL.language).Prompt.CANCEL,
          placeholder: '',
          returnKeyType: 'done',
          keyboardAppearance: 'dark',
          confirmAction: this._createDatasource,
        })
      }, 1000)
    } else {
      this.setState({
        data,
        selectedDatasource: data[1].default,
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.device.orientation !== this.props.device.orientation) {
      this.maxHeight =
        screen.getScreenHeight(this.props.device.orientation) - scaleSize(200)
      let maxWidth = screen.getScreenWidth(this.props.device.orientation)
      Animated.timing(this.maxWidth, {
        toValue: maxWidth,
        duration: 300,
      }).start()
    }
  }

  _onPressRow = ({ section, item }) => {
    let name =
      section.title === 'dataset' ? 'selectedDataset' : 'selectedDatasource'
    this.setState({
      [name]: item,
    })
  }

  _confirm = () => {
    this.dialog.setDialogVisible(true, {
      title: getLanguage(GLOBAL.language).Prompt.INPUT_MODEL_FILE_NAME,
      value: this.state.selectedDataset.datasetName,
      confirmBtnTitle: getLanguage(GLOBAL.language).Prompt.CONFIRM,
      cancelBtnTitle: getLanguage(GLOBAL.language).Prompt.CANCEL,
      placeholder: '',
      returnKeyType: 'done',
      keyboardAppearance: 'dark',
      confirmAction: this._dialogConfirm,
    })
  }

  _createDatasource = async datasourceName => {
    this.container.setLoading(
      true,
      getLanguage(GLOBAL.language).Prompt.CREATING,
    )
    let datasourcePath =
      global.homePath +
      ConstPath.UserPath +
      this.props.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Datasource
    let availableName = await this._getAvailableFileName(
      datasourcePath,
      datasourceName,
      'udb',
    )
    availableName = availableName.substring(0, availableName.lastIndexOf('.'))
    let rel = await SMap.createNavDatasource(availableName)
    if (rel) {
      let data = await SMap.getDatasourceAndDataset()
      this.setState({
        data,
        selectedDatasource: data[1].default,
      })
    } else {
      Toast.show(getLanguage(global.language).Prompt.CREATE_FAILED)
    }
    this.container.setLoading(false)
    return true
  }

  _getAvailableFileName = async (path, name, ext) => {
    let result = await FileTools.fileIsExist(path)
    if (!result) {
      await FileTools.createDirectory(path)
    }
    let availableName = name + '.' + ext
    if (await FileTools.fileIsExist(path + '/' + availableName)) {
      for (let i = 1; ; i++) {
        availableName = name + '_' + i + '.' + ext
        if (!(await FileTools.fileIsExist(path + '/' + availableName))) {
          return availableName
        }
      }
    } else {
      return availableName
    }
  }

  _dialogConfirm = async fileName => {
    let { selectedDatasource, selectedDataset } = this.state
    if (!selectedDataset.datasetName) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.SELECT_LINE_DATASET)
      return true
    }
    if (!selectedDatasource.datasourceName) {
      Toast.show(
        getLanguage(GLOBAL.language).Prompt.SELECT_DESTINATION_DATASOURCE,
      )
      return true
    }
    let { result, error } = dataUtil.isLegalName(fileName)
    if (!result) {
      Toast.show(error)
    } else {
      let filePath = await FileTools.appendingHomeDirectory(
        ConstPath.AppPath +
          'User/' +
          this.props.currentUser.userName +
          '/' +
          ConstPath.RelativePath.Datasource +
          fileName +
          '.snm',
      )
      let isFileExist = await FileTools.fileIsExist(filePath)
      if (isFileExist) {
        Toast.show(getLanguage(GLOBAL.language).Prompt.FILENAME_ALREADY_EXIST)
      } else {
        let rel = await SMap.buildOutdoorNetwork({
          ...selectedDataset,
          ...selectedDatasource,
          filePath,
        })
        if (rel) {
          Toast.show(getLanguage(GLOBAL.language).Prompt.NETWORK_BUILDING)
          this.dialog.setDialogVisible(false)
          GLOBAL.BUILD_NETWORK_LISTENER = SMap.addBuildNetworkListener({
            success: networkName => {
              if (networkName) {
                setTimeout(
                  () =>
                    Toast.show(
                      getLanguage(GLOBAL.language).Prompt.BUILD_SUCCESS,
                    ),
                  2000,
                )
                GLOBAL.BUILD_NETWORK_LISTENER.remove()
              }
            },
          })
          this.props.navigation.goBack()
          return true
        }
      }
    }
  }
  _renderSectionHeader = ({ section }) => {
    let title =
      section.title === 'dataset'
        ? getLanguage(GLOBAL.language).Prompt.LINE_DATASET
        : getLanguage(GLOBAL.language).Prompt.DESTINATION_DATASOURCE
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
      </View>
    )
  }
  _renderItem = ({ section, item }) => {
    let img,
      extraTxt = {},
      extraBack = {},
      name
    if (section.title === 'dataset') {
      name = item.datasetName
      let hasExtra = this.state.selectedDataset.datasetName === item.datasetName
      if (hasExtra) {
        img = getLayerWhiteIconByType(DatasetType.LINE)
        extraTxt = {
          color: color.white,
        }
        extraBack = {
          backgroundColor: color.item_selected_bg,
        }
      } else {
        img = getLayerIconByType(DatasetType.LINE)
      }
    } else {
      let hasExtra =
        this.state.selectedDatasource.datasourceName === item.datasourceName
      name = item.datasourceName
      if (hasExtra) {
        img = getPublicAssets().navigation.icon_datasource_white
        extraTxt = {
          color: color.white,
        }
        extraBack = {
          backgroundColor: color.item_selected_bg,
        }
      } else {
        img = getPublicAssets().navigation.icon_datasource
      }
    }

    return (
      <TouchableOpacity
        style={[styles.row, extraBack]}
        onPress={() => this._onPressRow({ section, item })}
      >
        <Image source={img} style={styles.image} resizeMode={'contain'} />
        <Text style={[styles.name, extraTxt]}>{name}</Text>
      </TouchableOpacity>
    )
  }
  _renderContainer = () => {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(GLOBAL.language).Prompt.NEW_NAV_DATA,
          navigation: this.props.navigation,
        }}
      >
        <SectionList
          style={{ maxHeight: this.maxHeight }}
          sections={this.state.data}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.toString() + index}
          getItemLayout={(data, index) => ({
            length: scaleSize(81),
            offset: scaleSize(81) * index,
            index,
          })}
        />
        {this.state.data.length > 0 && (
          <TouchableOpacity style={styles.confirm} onPress={this._confirm}>
            <Text style={styles.confirmTxt}>
              {getLanguage(GLOBAL.language).Prompt.CONFIRM}
            </Text>
          </TouchableOpacity>
        )}
      </Container>
    )
  }

  _renderDialog = () => {
    return <CustomInputDialog ref={ref => (this.dialog = ref)} />
  }

  render() {
    return (
      <Animated.View style={[styles.container, { width: this.maxWidth }]}>
        {this._renderContainer()}
        {this._renderDialog()}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(20),
    backgroundColor: color.content_white,
    borderBottomWidth: 1,
    borderBottomColor: color.USUAL_SEPARATORCOLOR,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: scaleSize(40),
    marginRight: scaleSize(20),
    height: scaleSize(80),
    borderBottomWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
  },
  title: {
    fontSize: setSpText(24),
  },
  name: {
    flex: 1,
    fontSize: setSpText(20),
  },
  imageWrap: {
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  confirm: {
    position: 'absolute',
    bottom: scaleSize(60),
    left: 0,
    right: 0,
    height: scaleSize(60),
    marginHorizontal: scaleSize(60),
    borderRadius: scaleSize(30),
    backgroundColor: color.blue1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTxt: {
    fontSize: setSpText(24),
    color: color.white,
  },
  dialogBackground: {
    height: scaleSize(240),
  },
  dialogContent: {
    flex: 1,
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogTitle: {
    fontSize: setSpText(26),
  },
  dialogInput: {
    borderColor: color.separateColorGray,
    borderWidth: 1,
    borderRadius: 5,
    height: scaleSize(60),
    width: '80%',
    fontSize: setSpText(24),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
