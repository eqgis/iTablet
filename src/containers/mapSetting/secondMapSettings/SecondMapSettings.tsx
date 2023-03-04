/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import { Container } from '../../../components'
import { FilterList } from './components'
import LinkageList from '../../../components/LinkageList'
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  FlatList,
  SectionList,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Platform,
  TextInput,
  Clipboard,
} from 'react-native'
import {
  basicSettings,
  rangeSettings,
  coordinateSystemSettings,
  coordinateData,
  copyCoordinate,
  transfer3ParamsSetting,
  transfer7ParamsSetting,
  // advancedSettings,
  fourRanges,
  transferData,
  coordMenuData,
  coordMenuTitle,
  getDetectStyleSettings,
  getDetectTypesSettings,
} from '../settingData'
import { SMap, SAIDetectView, SData } from 'imobile_for_reactnative'
import { scaleSize, screen } from '../../../utils'
import color from '../../../styles/color'
import styles from './styles'
import Toast from '../../../utils/Toast'
import NavigationService from '../../NavigationService'
import { getThemeAssets } from '../../../assets'
import { getLanguage } from '../../../language'
import FileTools from '../../../native/FileTools'
import { mapSettingModule } from '../../workspace/components/ToolBar/modules'
import { ConstToolType ,ChunkType} from '../../../constants'
import SlideBar from 'imobile_for_reactnative/components/SlideBar'
import { TMapColorMode } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'

export default class SecondMapSettings extends Component {
  props: {
    language: string,
    navigation: Object,
    title: string,
    mapScaleView: boolean,
    device: Object,
    setMapScaleView: () => {},
    renderItem?: () => {},
    showCompass: () => {},
    isShowCompass: boolean,
    setPointParamShow: () => void,
    isPointParamShow: boolean,
  }
  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.state = {
      data: [],
      title: params.title,
      rightBtn: params.rightBtn || '',
      cb: params.cb || '',
      editControllerVisible: false,
      currentClick: '',
      /** ai检测置信度设置 */
      showConfidence: false,
      /** ai检测置信度 范围 0-100*/
      confidence: 0,
    }
  }
  UNSAFE_componentWillMount() {
    this.getData()
  }

  componentDidMount() {
    this.initState()
  }
  /** 初始化状态 */
  initState = async () => {
    //获取置信度初始值 zhangxt
    if(this.state.title === getLanguage(global.language).Map_Settings.DETECT_TYPE) {
      let confidence = await SAIDetectView.getConfidence()
      confidence = Math.round(confidence * 100)
      this.setState({
        confidence: confidence,
      })
    }
  }

  //数字格式化成带逗号的数字
  formatNumberToString = num => {
    const dotReg = /\./
    const reg = /\.\d+/
    let afterDot = ''
    dotReg.test(num) && (afterDot = num.toString().match(reg)[0])
    return (+num).toLocaleString('en').replace(reg, afterDot)
  }

  //带逗号的字符串格式化成数字
  formatStringToNumber = str => {
    const reg = /,/g
    return +str.replace(reg, '')
  }

  //获取数据方法
  getData = async () => {
    let data = [],
      dataSourceAndSets,
      homeDirectory
    switch (this.state.title) {
      case getLanguage(global.language).Map_Settings.BASIC_SETTING:
        data = await this.getBasicData()
        break
      case getLanguage(global.language).Map_Settings.RANGE_SETTING:
        data = await this.getRangeData()
        break
      case getLanguage(global.language).Map_Settings.COORDINATE_SYSTEM_SETTING:
        data = await this.getCoordinateSystemData()
        break
      case getLanguage(global.language).Map_Settings.ADVANCED_SETTING:
        data = await this.getAdvanceData()
        break
      case getLanguage(global.language).Map_Settings.MAP_CENTER:
        data = { title: 'centerPoint' }
        data.value = await SMap.getMapCenter()
        break
      case getLanguage(global.language).Map_Settings.MAP_SCALE:
        data = { title: 'scale' }
        data.value = await SMap.getMapScale()
        break
      case getLanguage(global.language).Map_Settings.COORDINATE_SYSTEM:
        data = await coordinateData()
        break
      case getLanguage(global.language).Map_Settings.CURRENT_VIEW_BOUNDS:
        data = await this.getFourRangeData()
        break
      case getLanguage(global.language).Map_Settings.TRANSFER_METHOD:
        data = transferData()
        break
      case getLanguage(global.language).Map_Settings.COPY_COORDINATE_SYSTEM:
        data = copyCoordinate()
        break
      case getLanguage(global.language).Map_Settings.FROM_DATASOURCE:
        data = await this.getDatasources()
        break
      case getLanguage(global.language).Map_Settings.FROM_DATASET:
        data = await this.getDatasources()
        dataSourceAndSets = await this.getDatasets({ data })
        break
      case getLanguage(global.language).Map_Settings.FROM_FILE:
        homeDirectory = await FileTools.getHomeDirectory()
        Platform.OS === 'android' && (homeDirectory += '/iTablet')
        data = await FileTools.getPathListByFilterDeep(
          homeDirectory,
          //todo 目前接口只支持xml/prj文件导入
          //"shp,prj,mif,tab,tif,img,sit,xml"
          'xml,prj',
        )
        break
      case getLanguage(global.language).Map_Settings.DETECT_TYPE:
        data = await this.getDetectTypesSettings()
        break
      case getLanguage(global.language).Map_Settings.DETECT_STYLE:
        data = getDetectStyleSettings()
        data[0].value = await SAIDetectView.isDrawTileEnable()
        data[1].value = await SAIDetectView.isDrawConfidenceEnable()
        data[2].value = await SAIDetectView.getIsCountTrackedMode()
        break
      case 'Geocentric Transalation(3-para)':
        data = transfer3ParamsSetting()
        data[0].value[0].value = this.state.title
        break
      case 'Molodensky(7-para)':
      case 'Abridged Molodensky(7-para)':
      case 'Position Vector(7-para)':
      case 'Coordinate Frame(7-para)':
      case 'Bursa-wolf(7-para)':
        data = transfer7ParamsSetting()
        data[0].value[0].value = this.state.title
        break
    }
    this.setState({
      data,
      dataSourceAndSets,
    })
  }

  // 获取数据源
  getDatasources = async () => {
    const datas = []
    const datasources = await SData.getDatasources()
    datasources.map(item => {
      const obj = {}
      obj.title = item.alias
      obj.server = item.server
      obj.engineType = item.engineType
      obj.iconType = 'text'
      datas.push(obj)
    })
    return datas
  }

  // 获取所有数据集
  getDatasets = async ({ data }) => {
    const result = data
    let index = 0
    let dataset
    try {
      for (const item of data) {
        const datasets = []
        dataset = await SData.getDatasetsByDatasource(
          {
            server: item.server,
            engineType: item.engineType,
            alias: item.title,
          },
        )
        //
        dataset.map(val => {
          const obj = {}
          obj.title = val.datasetName
          obj.parentTitle = val.datasourceName
          datasets.push(obj)
        })
        result[index++].data = datasets
      }
    } catch (e) {
      return result
    }

    return result
  }

  // 基础设置数据
  getBasicData = async () => {
    let data, angle, bgColor
    data = await basicSettings()

    data[0].value = await SMap.getMapName()
    data[1].value = this.props.mapScaleView
    data[2].value = SMap.isEnableRotateTouch()
    data[3].value = SMap.isEnableSlantTouch()
    angle = await SMap.getMapAngle()
    Platform.OS === 'android' && (angle += '°')
    data[4].value = angle.toString().replace('.0', '')
    //原生层返回的是中文，做一个映射，转换成对应语言
    const colorMode:TMapColorMode = await SMap.getMapColorMode()
    const allColorMode = {
      0: getLanguage(global.language).Map_Settings.DEFAULT_COLOR_MODE,
      1: getLanguage(global.language).Map_Settings.BLACK_AND_WHITE,
      2: getLanguage(global.language).Map_Settings.GRAY_SCALE_MODE,
      3: getLanguage(global.language).Map_Settings.ANTI_BLACK_AND_WHITE,
      4: getLanguage(global.language).Map_Settings.ANTI_BLACK_AND_WHITE_2,
    }
    data[5].value = allColorMode[colorMode]
    bgColor = await SMap._getMapBackgroundColor()
    data[6].value = bgColor.toUpperCase()
    data[7].value = await SMap.isAntialias()
    data[8].value = await SMap.getMarkerFixedAngle()
    data[9].value = await SMap.getTextFixedAngle()
    data[10].value = await SMap.getFixedTextOrientation()
    data[11].value = await SMap.isOverlapDisplayed()
    data[12].value = await SMap.isMagnifierEnabled()
    data[13].value = await SMap.isShowLocation()
    data[14].value = this.props.isShowCompass
    data[15].value = this.props.isPointParamShow
    data.splice(1,1)

    if (global.Type === ChunkType.MAP_NAVIGATION) {
      data.splice(11,1)
    }
    return data
  }

  // 识别型数据
  getDetectTypesSettings = async () => {
    const data = await getDetectTypesSettings()
    const array = await SAIDetectView.getDetectArrayToUse()
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].key === array[i]) {
          data[j].value = true
        }
      }
    }
    return data
  }

  //范围设置数据
  getRangeData = async () => {
    const data = await rangeSettings()
    const mapCenter = await SMap.getMapCenter()
    const centerX = this.formatNumberToString(mapCenter.x)
    const centerY = this.formatNumberToString(mapCenter.y)
    const mapScale = await SMap.getMapScale()
    const scale = this.formatNumberToString(mapScale)
    data[0].value = `${centerX}\n${centerY}`
    data[1].value = `1:${scale}`
    data[2].value = await SMap.isVisibleScalesEnabled()
    return data
  }

  //坐标系设置数据
  getCoordinateSystemData = async () => {
    const data = await coordinateSystemSettings()
    const prjObj = await SData.prjCoordSysFromXml(await SMap.getPrjCoordSys())

    let transMethodStr = "Geocentric Transalation(3-para)"
    const transferMethod = await SMap.getMapCoordSysTransMethod()
    switch (transferMethod) {
      case 9604:
        transMethodStr = "Molodensky(7-para)"
        break
      case 9605:
        transMethodStr = "Abridged Molodensky(7-para)"
        break
      case 9606:
        transMethodStr = "Position Vector(7-para)"
        break
      case 9607:
        transMethodStr = "Coordinate Frame(7-para)"
        break
      case 9608:
        transMethodStr = "Bursa-wolf(7-para)"
        break
    }
    data[0].value = prjObj?.name||""//await SMap.getPrjCoordSysName()
    const isDynamicProjection = await SMap.getDynamicProjection()
    data[2].value = isDynamicProjection
    data[3].value = isDynamicProjection
      ? transMethodStr
      : getLanguage(global.language).Map_Settings.OFF
    this.setState({
      transferMethod,
    })
    return data
  }

  // //高级设置数据
  // getAdvanceData = async () => {
  //   let data = await advancedSettings()
  //   return data
  // }

  //
  getFourRangeData = async () => {
    const data = await fourRanges()
    const viewBounds = await SMap.getMapViewBounds()
    data[0].value = this.formatNumberToString(viewBounds.left)
    data[1].value = this.formatNumberToString(viewBounds.bottom)
    data[2].value = this.formatNumberToString(viewBounds.right)
    data[3].value = this.formatNumberToString(viewBounds.top)
    return data
  }

  //返回
  backAction = () => {
    NavigationService.goBack()
  }

  //switch开关事件
  _onValueChange = async ({ value, item, index }) => {
    const data = this.state.data.concat()
    switch (item.title) {
      case  getLanguage().Map_Settings.SHOW_POINT_INFO:
        this.props.setPointParamShow(value)
        break
      case getLanguage().Map_Settings.SHOW_COMPASS:
        this.props.showCompass(value)
        break
      case getLanguage(global.language).Map_Settings.SHOW_LOCATION:
        await SMap.setShowLocation(value)
        break
      case getLanguage(global.language).Map_Settings.ROTATION_GESTURE:
        await SMap.enableRotateTouch(value)
        break
      case getLanguage(global.language).Map_Settings.ROTATION_GESTURE:
        await SMap.enableRotateTouch(value)
        break
      case getLanguage(global.language).Map_Settings.PITCH_GESTURE:
        await SMap.enableSlantTouch(value)
        break
      case getLanguage(global.language).Map_Settings.MAP_ANTI_ALIASING:
        await SMap.setAntialias(value)
        break
      case getLanguage(global.language).Map_Settings.FIX_SYMBOL_ANGLE:
        await SMap.setMarkerFixedAngle(value)
        break
      case getLanguage(global.language).Map_Settings.FIX_TEXT_ANGLE:
        await SMap.setTextFixedAngle(value)
        break
      case getLanguage(global.language).Map_Settings.SHOW_OVERLAYS:
        await SMap.setOverlapDisplayed(value)
        break
      case getLanguage(global.language).Map_Settings.FIX_TEXT_DIRECTION:
        await SMap.setFixedTextOrientation(value)
        break
      case getLanguage(global.language).Map_Settings.FIX_SCALE_LEVEL:
        await SMap.setVisibleScalesEnabled(value)
        break
      case getLanguage(global.language).Map_Settings.ENABLE_MAP_MAGNIFER:
        await SMap.setIsMagnifierEnabled(value)
        break
      case getLanguage(global.language).Map_Settings.DYNAMIC_PROJECTION:
        await SMap.setDynamicProjection(value)
        data[index + 1].value = value
          ? this.state.transferMethod
          : getLanguage(global.language).Map_Settings.OFF
        break
      case getLanguage(global.language).Map_Settings
        .POI_SETTING_PROJECTION_MODE:
        await SAIDetectView.setProjectionModeEnable(value)
        break
      case getLanguage(global.language).Map_Settings.POI_SETTING_OVERLAP_MODE:
        await SAIDetectView.setPOIOverlapEnable(value)
        break
      case getLanguage(global.language).Map_Settings
        .POI_SETTING_POLYMERIZE_MODE:
        await SAIDetectView.setIsPolymerize(value)
        break
      case getLanguage(global.language).Map_Settings.DETECT_STYLE_IS_DRAW_TITLE:
        await SAIDetectView.setDrawTileEnable(value)
        break
      case getLanguage(global.language).Map_Settings
        .DETECT_STYLE_IS_DRAW_CONFIDENCE:
        await SAIDetectView.setDrawConfidenceEnable(value)
        break
      case getLanguage(global.language).Map_Settings.COUNTRACKED:
        if (value) {
          await SAIDetectView.startCountTrackedObjs()
        } else {
          await SAIDetectView.stopCountTrackedObjs()
        }
        break
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_PERSON:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_BICYCLE:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_CAR:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_MOTORCYCLE:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_BUS:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_TRUCK:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_TRAFFICLIGHT:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_FIREHYDRANT:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_CUP:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_CHAIR:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_BIRD:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_CAT:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_DOG:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_POTTEDPLANT:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_TV:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_LAPTOP:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_MOUSE:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_KEYBOARD:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_CELLPHONE:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_BOOK:
      case getLanguage(global.language).Map_Settings.DETECT_TYPE_BOTTLE:
        await SAIDetectView.setDetectItemEnable(item.key, value)
        break
    }
    data[index].value = value
    this.setState({
      data,
    })
  }

  //text item 点击事件
  onTextItemPress = async ({ item, title }) => {
    try{
      let prjCoordSysName = ''
      let toastTip
      !title && (title = this.state.title)
      switch (title) {
        case getLanguage(global.language).Map_Settings.FROM_DATASOURCE:{
          await SData.openDatasource({server:item.server,engineType:item.engineType,alias:"dataSource#"})
          const dsPrjXml = await SData.getDatasourcePrjCoordSys("dataSource#")
          SData.closeDatasource("dataSource#")
          SMap.setPrjCoordSys(dsPrjXml)
          const prjObj = await SData.prjCoordSysFromXml(dsPrjXml)
          prjCoordSysName = prjObj?.name || ""
          //await SMap.copyPrjCoordSysFromDatasource(
          //   item.server,
          //   item.engineType,
          // )
          toastTip = prjCoordSysName
            ? getLanguage(global.language).Prompt.COPY_COORD_SYSTEM_SUCCESS
            : getLanguage(global.language).Prompt.COPY_COORD_SYSTEM_FAIL
          break
        }
        case getLanguage(global.language).Map_Settings.FROM_DATASET:{
          const dsPrjXml = await SData.getDatasetPrjCoordSys({datasetName:item.title,datasourceName:item.parentTitle})
          SMap.setPrjCoordSys(dsPrjXml)
          const prjObj = await SData.prjCoordSysFromXml(dsPrjXml)
          prjCoordSysName = prjObj?.name || ""
          // prjCoordSysName = await SMap.copyPrjCoordSysFromDataset(
          //   item.parentTitle,
          //   item.title,
          // )
          toastTip = prjCoordSysName
            ? getLanguage(global.language).Prompt.COPY_COORD_SYSTEM_SUCCESS
            : getLanguage(global.language).Prompt.COPY_COORD_SYSTEM_FAIL
          break
        }
        case getLanguage(global.language).Map_Settings.FROM_FILE:{
          let  type:1|2 = 1
          if(item.name.substring(item.name.lastIndexOf('.'), item.name.length) !== "xml"){
            type = 2
          }
          const dsPrjXml = await SData.prjCoordSysFileToXml(item.path,type)
          SMap.setPrjCoordSys(dsPrjXml).then(value=>{
            console.log(value)
          })
          const prjObj = await SData.prjCoordSysFromXml(dsPrjXml)
          prjCoordSysName = prjObj?.name || ""
          // prjCoordSysName = await SMap.copyPrjCoordSysFromFile(
          //   item.path,
          //   item.name.substring(item.name.lastIndexOf('.'), item.name.length),
          // )
          toastTip = prjCoordSysName
            ? getLanguage(global.language).Prompt.COPY_COORD_SYSTEM_SUCCESS
            : getLanguage(global.language).Prompt.COPY_COORD_SYSTEM_FAIL
          break
        }
      }
      toastTip !== undefined && Toast.show(toastTip)
      if (this.state.cb !== '') {
        this.state.cb(prjCoordSysName)
      }
    }catch(e){
      Toast.show(getLanguage(global.language).Prompt.COPY_COORD_SYSTEM_FAIL_NO_COORD)
    }
  }

  //arrow item点击事件
  onArrowItemPress = ({ item, index }) => {
    const title = item.title
    const data = this.state.data.concat()
    switch (title) {
      case getLanguage(global.language).Map_Settings.ROTATION_ANGLE:
        this.props.navigation.navigate('InputPage', {
          headerTitle: title,
          // keyboardType: 'numeric',
          placeholder: data[index].value.replace('°', ''),
          type: 'number',
          cb: async value => {
            let isSetSuccess = false
            if (value !== '' && value >= -360 && value <= 360) {
              isSetSuccess = await SMap.setMapAngle(+value)
            } else {
              Toast.show(
                getLanguage(global.language).Prompt.ROTATION_ANGLE_ERROR,
              )
            }

            if (isSetSuccess) {
              data[index].value = value + '°'
              this.setState(
                {
                  data,
                },
                () => {
                  this.backAction()
                },
              )
            }
          },
        })
        break
      case getLanguage(global.language).Map_Settings.COLOR_MODE:
      case getLanguage(global.language).Map_Settings.BACKGROUND_COLOR:
        {
          const type =
            title === getLanguage(global.language).Map_Settings.COLOR_MODE
              ? ConstToolType.SM_MAP_SETTINGS_COLOR_MODE
              : ConstToolType.SM_MAP_SETTINGS_BACKGROUND_COLOR
          mapSettingModule().action(type)
        }

        // if (this.popModal) {
        //   this.setState(
        //     {
        //       currentClick: title,
        //     },
        //     () => {
        //       this.popModal.setVisible(true)
        //     },
        //   )
        // }
        break
      case getLanguage(global.language).Map_Settings.MAP_CENTER:
        this.props.navigation.navigate('SecondMapSettings1', {
          title,
          cb: this.saveInput,
        })
        break
      case getLanguage(global.language).Map_Settings.COORDINATE_SYSTEM:
        this.props.navigation.navigate('SecondMapSettings2', {
          title,
          cb: this.setMapCoordinate,
        })
        break
      case getLanguage(global.language).Map_Settings.CURRENT_VIEW_BOUNDS:
        this.props.navigation.navigate('SecondMapSettings3', {
          title,
          rightBtn: getLanguage(global.language).Map_Settings.COPY,
        })
        break
      case getLanguage(global.language).Map_Settings.COPY_COORDINATE_SYSTEM:
        this.props.navigation.navigate('SecondMapSettings7', {
          title,
          cb:
            this.state.cb !== ''
              ? this.state.cb
              : ({ prjCoordSysName }) => {
                const data = this.state.data.concat()
                data[0].value = prjCoordSysName
                this.setState({
                  data,
                })
              },
        })
        break
      case getLanguage(global.language).Map_Settings.FROM_DATASOURCE:
      case getLanguage(global.language).Map_Settings.FROM_DATASET:
      case getLanguage(global.language).Map_Settings.FROM_FILE:
        this.props.navigation.navigate('SecondMapSettings4', {
          title,
          cb:
            this.state.cb !== ''
              ? this.state.cb
              : ({ prjCoordSysName }) => {
                const data = this.state.data.concat()
                data[0].value = prjCoordSysName
                this.setState({
                  data,
                })
              },
        })
        break
      case getLanguage(global.language).Map_Settings.TRANSFER_METHOD:
        this.props.navigation.navigate('SecondMapSettings5', {
          title,
          cb: this.setTransferMethod,
        })
        break
      case 'Geocentric Transalation(3-para)':
      case 'Molodensky(7-para)':
      case 'Abridged Molodensky(7-para)':
      case 'Position Vector(7-para)':
      case 'Coordinate Frame(7-para)':
      case 'Bursa-wolf(7-para)':
        this.props.navigation.navigate('SecondMapSettings6', {
          title,
          rightBtn: getLanguage(global.language).CONFIRM,
          cb: this.state.cb,
        })
        break
    }
  }

  onInputEnding = async (item, index, evt) => {
    const newValue = evt.nativeEvent.text
    let isSuccess = false
    const regExp = /^\d+(\.\d+)?$/
    const data = this.state.data.concat()
    let tips = ''
    switch (item.title) {
      case getLanguage(global.language).Map_Settings.MAP_SCALE:
        if (newValue !== '' && newValue.match(regExp)) {
          isSuccess = await SMap.setMapScale(1 / newValue)
          data[index].value = `1:${this.formatNumberToString(
            Number.parseFloat(newValue).toFixed(6),
          )}`
          data[index].state = false
        } else {
          tips = getLanguage(global.language).Prompt.MAP_SCALE_ERROR
        }
        break
      //四至范围点击 跳InputPage
      case getLanguage(global.language).LEFT:
      case getLanguage(global.language).Map_Settings.BOTTOM:
      case getLanguage(global.language).RIGHT:
      case getLanguage(global.language).Map_Settings.TOP:
        if (newValue !== '' && newValue.match(regExp)) {
          data[index].value = this.formatNumberToString(
            Number.parseFloat(newValue).toFixed(6),
          )
          data[index].state = false
          const left = this.formatStringToNumber(data[0].value)
          const bottom = this.formatStringToNumber(data[1].value)
          const right = this.formatStringToNumber(data[2].value)
          const top = this.formatStringToNumber(data[3].value)
          isSuccess = await SMap.setMapViewBounds({
            left,
            bottom,
            right,
            top,
          })
          !isSuccess &&
            (tips = getLanguage(global.language).Prompt.VIEW_BOUNDS_RANGE_ERROR)
        } else {
          tips = getLanguage(global.language).Prompt.VIEW_BOUNDS_ERROR
        }
        break
      //转换参数设置点击
      case getLanguage(global.language).Map_Settings.PROPORTIONAL_DIFFERENCE:
      case 'X':
      case 'Y':
      case 'Z':
        if (newValue !== '' && newValue.match(regExp)) {
          data[item.pos].value[index].value = this.formatNumberToString(
            newValue,
          )
          data[item.pos].value[index].state = false
          isSuccess = true
        } else {
          tips = getLanguage(global.language).Prompt.TRANSFER_PARAMS
        }
        break
      case getLanguage(global.language).Map_Settings.MAP_CENTER:
        data[index].value = `${this.formatNumberToString(
          this.inputvalue,
        )}/${this.formatNumberToString(Number.parseFloat(newValue).toFixed(6))}`
        data[index].state = false
        this.inputvalue = null
        isSuccess = true
        break
    }
    this.clickedIndex = 0
    this.itemPos = 0
    isSuccess &&
      this.setState({
        data,
      })
    tips !== '' && Toast.show(tips)
  }

  //修改值判定 不适用于跳转InputPage的
  saveInput = async (newValue, title) => {
    let isSuccess = false
    const regExp = /^\d+(\.\d+)?$/
    const data = this.state.data.concat()
    switch (title) {
      case getLanguage(global.language).Map_Settings.MAP_CENTER:
        if (
          newValue.x &&
          newValue.x.match(regExp) &&
          newValue.y &&
          newValue.y.match(regExp)
        ) {
          isSuccess = await SMap.setMapCenter(+newValue.x, +newValue.y)
          data[0].value =
            this.formatNumberToString(newValue.x) +
            '/' +
            this.formatNumberToString(newValue.y)
        } else {
          Toast.show(getLanguage(global.language).Prompt.MAP_CENTER_ERROR)
        }
        break
    }
    isSuccess &&
      this.setState({ data }, () => {
        this.backAction()
      })
  }

  //设置地图坐标系回调
  setMapCoordinate = value => {
    const data = this.state.data.concat()
    data[0].value = value
    this.setState({
      data,
    })
    return true
  }

  //设置转换方法回调
  setTransferMethod = value => {
    const data = this.state.data.concat()
    data[3].value = value
    this.setState({
      data,
    })
    return true
  }

  //渲染switch
  renderSwitchItem = (item, index) => {
    return (
      <View>
        <View style={{ ...styles.row, paddingRight: scaleSize(10) }}>
          <Text style={styles.itemName}>{item.title}</Text>
          <Switch
            // style={styles.switch}
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={item.value ? color.bgW : color.bgW}
            ios_backgroundColor={item.value ? color.switch : color.bgG}
            value={item.value}
            onValueChange={value => {
              this._onValueChange({ value, item, index })
            }}
          />
        </View>
        {this.renderLine(index)}
      </View>
    )
  }

  //渲染分割线
  renderLine = index => {
    if (
      this.state.title ===
        getLanguage(global.language).Map_Settings.DETECT_TYPE &&
      index === 9
    ) {
      return (
        <View>
          <View
            style={{
              flex: 1,
              height: 1,
              marginHorizontal: 10,
              backgroundColor: color.separateColorGray,
            }}
          />
          <View
            style={{
              ...styles.betarow,
              paddingRight: scaleSize(10),
              backgroundColor: color.gray5,
            }}
          >
            <Text style={styles.betaName1}>{'Beta'}</Text>
            <Text style={styles.betaName}>
              {getLanguage(global.language).Map_Settings.Beta}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 1,
              marginHorizontal: 10,
              backgroundColor: color.separateColorGray,
            }}
          />
        </View>
      )
    } else {
      return (
        <View
          style={{
            flex: 1,
            height: 1,
            marginHorizontal: 10,
            backgroundColor: color.separateColorGray,
          }}
        />
      )
    }
  }

  //渲染带more按钮的行
  renderArrowItem = (item, index) => {
    const rightImagePath = require('../../../assets/Mine/mine_my_arrow.png')
    const hasValue = item.value !== undefined
    const isBackGroundColor =
      item.title === getLanguage(global.language).Map_Settings.BACKGROUND_COLOR
    if (
      item.title ===
        getLanguage(global.language).Map_Settings.TRANSFER_METHOD &&
      item.value === getLanguage(global.language).Map_Settings.OFF
    ) {
      return (
        <View>
          <View style={styles.row}>
            <Text
              style={{
                ...styles.itemName,
                color: '#777',
              }}
            >
              {item.title}
            </Text>
            <Text style={styles.rightText}>{item.value}</Text>
            <Image
              style={styles.itemArrow}
              resizeMode={'contain'}
              source={rightImagePath}
            />
          </View>
          {this.renderLine()}
        </View>
      )
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.onArrowItemPress({ item, index })}
        >
          <View style={styles.row}>
            <Text style={styles.itemName}>{item.title}</Text>
            {hasValue &&
              isBackGroundColor && (
              <View style={{ ...styles.colorView }}>
                <Text
                  style={{
                    ...styles.colorBlock,
                    backgroundColor: item.value,
                  }}
                />
              </View>
            )}
            {hasValue &&
              !isBackGroundColor && (
              <Text style={styles.rightText}>{item.value}</Text>
            )}
            <Image
              style={styles.itemArrow}
              resizeMode={'contain'}
              source={rightImagePath}
            />
          </View>
        </TouchableOpacity>
        {this.renderLine()}
      </View>
    )
  }

  //渲染普通text行
  renderTextItem = item => {
    const hasRightValue = item.value !== undefined
    return (
      <TouchableOpacity
        onPress={() => {
          this.onTextItemPress({ item, title: this.state.title })
        }}
      >
        <View style={styles.row}>
          <Text style={styles.itemName}>{item.title}</Text>
          {hasRightValue && <Text style={styles.rightText}>{item.value}</Text>}
        </View>
        {this.renderLine()}
      </TouchableOpacity>
    )
  }

  //渲染带键盘的多行input 单行的直接跳inputPage（需要修改信息的item）
  renderKeybordItem = item => {
    const renderData = {}
    switch (item.title) {
      case 'centerPoint':
        renderData.x = item.value.x
        renderData.y = item.value.y
        break
      case 'scale':
        renderData.textInput = item
    }
    return (
      <View style={styles.inputContainer}>
        {Object.keys(renderData).map((item, index) => {
          return (
            <TextInput
              key={item + index}
              onChangeText={text => (this[item] = text)}
              style={styles.inputItem}
              placeholder={`${item}:${renderData[item]}`}
            />
          )
        })}
      </View>
    )
  }
  renderInputItem = (item, index) => {
    if (item.state) {
      const value = item.value + ''
      return (
        <View>
          <View>
            <View style={styles.row}>
              <Text style={styles.itemName}>{item.title}</Text>
              {item.title ===
                getLanguage(global.language).Map_Settings.MAP_SCALE && (
                <Text style={styles.rightText}>1:</Text>
              )}
              <TextInput
                ref={ref => (this.input = ref)}
                onEndEditing={evt => this.onInputEnding(item, index, evt)}
                style={styles.rightWrapText}
                keyboardType={'numeric'}
                returnKeyType={'done'}
                defaultValue={
                  this.formatStringToNumber(value.replace('1:', '')) + ''
                }
              />
            </View>
          </View>
          {this.renderLine()}
        </View>
      )
    }
    return (
      <View>
        <View>
          <View style={styles.row}>
            <Text style={styles.itemName}>{item.title}</Text>
            <TouchableOpacity
              onLongPress={() => {
                const data = this.state.data.concat()
                switch (item.title) {
                  case getLanguage(global.language).Map_Settings.MAP_SCALE:
                  case getLanguage(global.language).LEFT:
                  case getLanguage(global.language).Map_Settings.BOTTOM:
                  case getLanguage(global.language).RIGHT:
                  case getLanguage(global.language).Map_Settings.TOP:
                    data[index].state = true
                    break
                  case 'X':
                  case 'Y':
                  case 'Z':
                  case getLanguage(global.language).Map_Settings
                    .PROPORTIONAL_DIFFERENCE:
                    data[item.pos].value[index].state = true
                    break
                }
                //用于计算KeyboarAvoidingView的Offset
                this.clickedIndex = index
                this.itemPos = item.pos
                this.setState(
                  {
                    data,
                  },
                  () => {
                    setTimeout(() => {
                      this.input && this.input.focus()
                    })
                  },
                )
              }}
            >
              <Text style={styles.rightWrapText}>{item.value}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.renderLine()}
      </View>
    )
  }

  renderDoubleInputItem = (item, index) => {
    if (item.state) {
      let keys = []
      let values = []
      switch (item.title) {
        case getLanguage(global.language).Map_Settings.MAP_CENTER:
          keys = ['x:', 'y:']
          values = item.value
            .split('/')
            .map(val => this.formatStringToNumber(val))
          break
      }
      return (
        <View>
          <View>
            <View style={styles.row}>
              <Text style={styles.itemName}>{item.title}</Text>
              <Text style={styles.rightText}>{keys[0]}</Text>
              <TextInput
                ref={ref => (this.input = ref)}
                onEndEditing={evt => {
                  this.inputvalue = Number.parseFloat(
                    evt.nativeEvent.text,
                  ).toFixed(6)
                  this.input2.focus()
                }}
                style={styles.rightWrapText}
                keyboardType={'numeric'}
                returnKeyType={'done'}
                defaultValue={values[0] + ''}
              />
              <Text style={styles.rightText}>{keys[1]}</Text>
              <TextInput
                ref={ref => (this.input2 = ref)}
                onEndEditing={evt => this.onInputEnding(item, index, evt)}
                style={styles.rightWrapText}
                keyboardType={'numeric'}
                returnKeyType={'done'}
                defaultValue={values[1] + ''}
              />
            </View>
          </View>
          {this.renderLine()}
        </View>
      )
    }
    return (
      <View>
        <View>
          <View style={styles.row}>
            <Text style={styles.itemName}>{item.title}</Text>
            <TouchableOpacity
              onLongPress={() => {
                const data = this.state.data.concat()
                switch (item.title) {
                  case getLanguage(global.language).Map_Settings.MAP_CENTER:
                    data[index].state = true
                    break
                }
                this.setState(
                  {
                    data,
                  },
                  () => {
                    setTimeout(() => {
                      this.input && this.input.focus()
                    })
                  },
                )
              }}
            >
              <Text style={styles.rightWrapText}>{item.value}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.renderLine()}
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    if (this.props.renderItem) {
      return this.props.renderItem
    }
    switch (item.iconType) {
      case 'switch':
        return this.renderSwitchItem(item, index)
      case 'arrow':
        return this.renderArrowItem(item, index)
      case 'text':
        return this.renderTextItem(item)
      case 'input':
        return this.renderInputItem(item, index)
      case 'doubleInput':
        return this.renderDoubleInputItem(item, index)
    }
  }

  //复制按钮点击事件
  copyInfo = async () => {
    const datas = this.state.data
    Clipboard.setString(
      datas.reduce((total, item) => {
        return `${total}${item.title}:${item.value}\n`
      }, ''),
    )
    const isSuccess = await Clipboard.getString()
    if (isSuccess !== undefined) {
      Toast.show(getLanguage(global.language).Prompt.COPY_SUCCESS)
    }
  }

  /** 设置置信度确认方法 */
  setConfidence = async () => {
    if(this.state.showConfidence) {
      const confidence = this.state.confidence
      SAIDetectView.setConfidence(confidence / 100)
      this.setState({
        showConfidence: false,
      })
    } else {
      this.setState({
        showConfidence: true,
      })
    }
  }

  //SectionList header点击事件
  refreshList = section => {
    const newData = this.state.data
    section.visible = !section.visible
    newData[section.index] = section
    this.setState({
      data: newData.concat(),
    })
  }

  //SectionList的header
  renderSectionHeader = ({ section }) => {
    const image = section.visible
      ? getThemeAssets().publicAssets.list_section_packup
      : getThemeAssets().publicAssets.list_section_spread
    return (
      <TouchableOpacity
        style={{
          height: scaleSize(80),
          backgroundColor: color.content,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          this.refreshList(section)
        }}
      >
        <Image
          source={image}
          style={{
            width: scaleSize(40),
            height: scaleSize(40),
            marginLeft: scaleSize(20),
          }}
        />
        <Text style={styles.sectionHeader}>{section.title}</Text>
      </TouchableOpacity>
    )
  }

  //sectionlist的item
  renderSectionItem = ({ item, section }) => {
    if (section.visible) {
      return (
        <View>
          <TouchableOpacity
            onPress={async () => {
              const isSuccess = await SMap.setPrjCoordSys(item.value)
              isSuccess && this.state.cb(item.name)
              isSuccess && this.backAction()
            }}
          >
            <View style={styles.row}>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
    return <View />
  }

  //转换参数设置方法
  setTransferParams = async () => {
    const data = this.state.data
    let isSuccess
    const paramsObject = {}
    switch (data.length) {
      case 2:
        paramsObject.rotateX = 0
        paramsObject.rotateY = 0
        paramsObject.rotateZ = 0
        paramsObject.scaleDifference = 0
        paramsObject.translateX = data[1].value[0].value
        paramsObject.translateY = data[1].value[1].value
        paramsObject.translateZ = data[1].value[2].value
        break
      case 3:
        paramsObject.rotateX = data[1].value[0].value
        paramsObject.rotateY = data[1].value[1].value
        paramsObject.rotateZ = data[1].value[2].value
        paramsObject.scaleDifference = data[0].value[1].value
        paramsObject.translateX = data[2].value[0].value
        paramsObject.translateY = data[2].value[1].value
        paramsObject.translateZ = data[2].value[2].value
        break
    }
    Object.keys(paramsObject).map(key => {
      if (typeof paramsObject[key] === 'string') {
        paramsObject[key] = this.formatStringToNumber(paramsObject[key])
      }
    })
    const methodStr = this.state.title
    let method:9603|9604|9605|9606|9607|9608 = 9603
    // const transferMethod = await SMap.getMapCoordSysTransMethod()
    switch (methodStr) {
      case "Molodensky(7-para)":
        method = 9604
        break
      case  "Abridged Molodensky(7-para)":
        method = 9605
        break
      case "Position Vector(7-para)":
        method = 9606
        break
      case "Coordinate Frame(7-para)":
        method = 9607
        break
      case "Bursa-wolf(7-para)":
        method = 9608
        break
    }
    await SMap.setMapCoordSysTransMethod(method)
    isSuccess = await SMap.setMapCoordSysTransParameter(paramsObject)
    // isSuccess = await SMap.setCoordSysTransMethodAndParams(paramsObject)
    if (isSuccess) {
      this.state.cb(this.state.title)
      this.backAction()
      Toast.show(getLanguage(global.language).Prompt.SETTING_SUCCESS)
    } else {
      Toast.show(getLanguage(global.language).Prompt.SETTING_FAILED)
    }
  }

  //section 分割线
  renderSectionFooter = ({ section }) => {
    if (!section.visible) return <View />
    return (
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          height: 1,
          backgroundColor: color.bgG,
        }}
      />
    )
  }

  renderRight = () => {
    if(this.state.rightBtn !== '') {
      return (
        <TouchableOpacity key={'copy'} onPress={this.copyInfo}>
          <Text style={styles.headerRight}>
            {this.state.rightBtn}
          </Text>
        </TouchableOpacity>
      )
    }
    if(this.state.title === getLanguage(global.language).Map_Settings.DETECT_TYPE) {
      return (
        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginRight: scaleSize(30)}} key={'confidence'} onPress={this.setConfidence}>
          <Text style={{color: 'black', fontSize: scaleSize(24)}}>
            {this.state.showConfidence
              ? getLanguage(global.language).CONFIRM
              : getLanguage(global.language).Map_Settings.CONFIDENCE}
          </Text>
          {!this.state.showConfidence && (
            <Text style={{color: 'black', fontSize: scaleSize(20)}}>
              {'(' + this.state.confidence + '%)'}
            </Text>
          )}
        </TouchableOpacity>
      )
    }
    return null
  }

  renderConfidenceSlide = () => {
    if(this.state.showConfidence) {
      return (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            backgroundColor: '#00000055',
          }}
        >
          <View style={{
            width: '100%',
            alignItems: 'center',
            backgroundColor: 'white',
          }}>

            <Text
              numberOfLines={1}
              style={{
                fontSize: scaleSize(24),
                textAlign: 'center',
              }}
            >
              {this.state.confidence +'%'}
            </Text>
            <SlideBar
              style={{ width: screen.getScreenWidth() - 20 }}
              range={[0, 100]}
              defaultMaxValue={this.state.confidence}
              onMove={location => {
                this.setState({
                  confidence: location,
                })
              }}
            />
          </View>
        </View>
      )
    }
  }

  render() {
    if (
      this.state.data.constructor === Object &&
      this.state.data.value !== ''
    ) {
      const data = this.state.data
      return (
        <Container
          navigation={this.props.navigation}
          headerProps={{
            title: this.state.title,
            backAction: this.backAction,
            headerRight: [
              <TouchableOpacity
                key={'save'}
                onPress={() => {
                  const value = this.x ? { x: this.x, y: this.y } : this.textInput
                  this.state.cb(value, this.state.title)
                }}
              >
                <Text style={styles.headerRight}>
                  {getLanguage(global.language).CONFIRM}
                </Text>
              </TouchableOpacity>,
            ],
          }}
        >
          {this.renderKeybordItem(data)}
        </Container>
      )
    }
    if (
      this.state.title ===
      getLanguage(global.language).Map_Settings.COORDINATE_SYSTEM
    ) {
      return (
        <Container
          navigation={this.props.navigation}
          headerProps={{
            title: this.state.title,
            backAction: this.backAction,
          }}
        >
          <SectionList
            sections={this.state.data}
            keyExtractor={(item, index) => item + index}
            renderItem={this.renderSectionItem}
            ItemSeparatorComponent={this.renderSectionFooter}
            renderSectionHeader={this.renderSectionHeader}
            renderSectionFooter={this.renderSectionFooter}
          />
        </Container>
      )
    }
    if (
      this.state.title ===
      getLanguage(global.language).Map_Settings.FROM_DATASET
    ) {
      return (
        <Container
          navigation={this.props.navigation}
          headerProps={{
            title: this.state.title,
            backAction: this.backAction,
          }}
        >
          <LinkageList
            language={this.props.language}
            data={this.state.dataSourceAndSets}
            titles={[
              getLanguage(global.language).Map_Settings.DATASOURCES,
              getLanguage(global.language).Map_Settings.DATASETS,
            ]}
            onRightPress={this.onTextItemPress}
          />
        </Container>
      )
    }
    if (
      this.state.title === getLanguage(global.language).Map_Settings.FROM_FILE
    ) {
      const menuData = coordMenuData()
      const menuTitle = coordMenuTitle()
      return (
        <Container
          navigation={this.props.navigation}
          headerProps={{
            title: this.state.title,
            backAction: this.backAction,
          }}
        >
          <FilterList
            language={this.props.language}
            data={this.state.data}
            menuData={menuData}
            menuTitle={menuTitle}
            onItemPress={this.onTextItemPress}
          />
        </Container>
      )
    }
    if (/^[\w\s-]+(\(\d{1,2}-para\))$/.test(this.state.title)) {
      let keyboardVerticalOffset
      if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
        if (Platform.OS === 'ios') {
          keyboardVerticalOffset =
            (this.itemPos - 3) * 120 + this.clickedIndex * 40
        } else {
          keyboardVerticalOffset =
            (this.itemPos - 3) * 120 - this.clickedIndex * 40
        }
      } else {
        if (Platform.OS === 'ios') {
          keyboardVerticalOffset = this.itemPos * 100 + this.clickedIndex * 20
        } else {
          keyboardVerticalOffset = 0
        }
      }
      return (
        <Container
          navigation={this.props.navigation}
          headerProps={{
            title: this.state.title,
            backAction: this.backAction,
            headerRight: [
              <TouchableOpacity
                key={'setTransferParams'}
                onPress={() => {
                  this.setTransferParams()
                }}
              >
                <Text style={styles.headerRight}>{this.state.rightBtn}</Text>
              </TouchableOpacity>,
            ],
            isResponseHeader: true,
          }}
        >
          <ScrollView>
            <KeyboardAvoidingView
              enabled={this.itemPos > 0}
              behavior={Platform.OS === 'ios' && 'padding'}
              keyboardVerticalOffset={keyboardVerticalOffset}
            >
              {this.state.data.map((item, index) => {
                return (
                  <View key={item + index}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <FlatList
                      renderItem={this.renderItem}
                      data={item.value}
                      extraData={this.state.data}
                      keyExtractor={(item, index) => item + index}
                      ListFooterComponent={<View style={{height:8}}/>}
                    />
                  </View>
                )
              })}
            </KeyboardAvoidingView>
          </ScrollView>
        </Container>
      )
    }
    return (
      <Container
        navigation={this.props.navigation}
        headerProps={{
          title: this.state.title,
          backAction: this.backAction,
          headerRight: this.renderRight(),
          headerOnTop: this.state.showConfidence,
          // 国际版标题过长
          isResponseHeader: true,
        }}
      >
        <FlatList
          renderItem={this.renderItem}
          data={this.state.data}
          keyExtractor={(item, index) => item + index}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator = {false}
          ListFooterComponent={<View style={{height:8}}/>}
        />
        {this.renderConfidenceSlide()}
      </Container>
    )
  }
}