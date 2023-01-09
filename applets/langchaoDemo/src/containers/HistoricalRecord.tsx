import React, { Component } from "react"
import { SectionList, View, Text, TouchableOpacity, Image, StyleSheet, TextInput, FlatList } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container, Dialog } from '../../../../src/components'
import { dp } from "imobile_for_reactnative/utils/size"
import { getLanguage } from "@/language"
import { setCurrentSymbol } from "@/redux/models/symbol"
import { getPublicAssets } from "@/assets"
import { setServerIP, setServerUserId, setServerUserName, setServerDepartmentId } from '../reduxModels/langchao'
import { dateFormat, getToken, setSysOrgid, setUserId, setUserName, users } from "../utils/langchaoServer"
import { LayerUtils, StyleUtils, Toast } from "@/utils"
import { color } from "@/styles"
import MapToolbar from "@/containers/workspace/components/MapToolbar"
import ToolbarModule from "../../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule"
import ConstToolType from "@/constants/ConstToolType"
// import { setServerIP, setServerUserId, setServerUserName, setServerDepartmentId } from "@/redux/models/langchao"
import {
  SMap,
  Action,
  GeoStyle,
  SMediaCollector,
  FieldType,
  DatasetType,
  TextStyle,
  GeometryType,
} from 'imobile_for_reactnative'
import { AppletsToolType } from "../constants"
import CallDetailData from "../mapFunctionModules/CallDetail/CallDetailData"
import { ToolbarType } from "@/constants"
import CallDetailPage from "../components/CallDetailPage/CallDetailPage"
import CallDetail from "../mapFunctionModules/CallDetail"
import { getImage } from "../assets/Image"
import TourAction from "../mapFunctionModules/Langchao/TourAction"
interface fieldInfoType {
  caption: string,
  name: string,
  type: number,
  maxLength: number,
  defaultValue: unknown,
  isRequired: boolean,
  isSystemField: boolean,
}

interface attributeDataType {
  name: string,
  fieldInfo: fieldInfoType,
  value: unknown
}


interface callAttributeType {
  SmID: number,
  isUploaded: boolean,
  myName: string,
  myPhoneNumber: string,
  callName: string,
  callPhoneNumber: string,
  localTime_User: string,
  bjTime: string,
  duration: string | number,
  attributeInfo: Array<attributeDataType>,
}

interface Props extends ReduxProps {
	navigation: any,
	mapModules: any,
  device: any,
  language: string,
  currentLayer: any,
}

interface State {
	attributeData:Array<callAttributeType>,
}

class HistoricalRecord extends Component<Props, State> {

  container: typeof Container | undefined | null = null
  constructor(props: Props) {
    super(props)
    this.state = {
      attributeData: [],
    }
  }

  componentDidMount = async (): Promise<void> => {
    await SMap.setLayerVisible(this.props.currentLayer.path, true)
    await this.getAttributeData()
  }

  componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<State>): void => {
    SMap.setLayerVisible(this.props.currentLayer.path, true)
  }

  getAttributeData = async () => {
    const layerpath = "line_965018@langchao"
    const result = await LayerUtils.getLayerAttribute(
      {
        data: [],
        head: [],
      },
      layerpath, 0, 30,
      {
        // filter: this.filter,
      },
      "refresh",
    )

    const TempData:Array<callAttributeType> = []

    const layerAttributedataArray = result.attributes.data
    const layerAttributedataLength = layerAttributedataArray.length
    for(let i = layerAttributedataLength - 1; i >= 0; i --) {
      // 每一条记录对象
      const AttributedataItem = layerAttributedataArray[i]
      const itemObj: callAttributeType = {
        SmID: -1,
        isUploaded: false,
        myName: '',
        myPhoneNumber: '',
        callName: '',
        callPhoneNumber: '',
        localTime_User: '',
        bjTime: '',
        duration: 0,
        attributeInfo: AttributedataItem,
      }
      for(let j = 0; j < AttributedataItem.length; j ++) {
        // 记录对象的每一个属性和他的值
        const item = AttributedataItem[j]
        if(item.name === "isUploaded") {
          // isUploadedIndex = j
          itemObj.isUploaded = item.value
        } else if(item.name === "SmID") {
          itemObj.SmID = item.value
        } else if(item.name === "myName") {
          itemObj.myName = item.value
        } else if(item.name === "myPhoneNumber") {
          itemObj.myPhoneNumber = item.value
        } else if(item.name === "callName") {
          itemObj.callName = item.value
        } else if(item.name === "callPhoneNumber") {
          itemObj.callPhoneNumber = item.value
        } else if(item.name === "localTime_User") {
          itemObj.localTime_User = item.value
        } else if(item.name === "bjTime") {
          itemObj.bjTime = item.value
        } else if(item.name === "duration") {
          itemObj.duration = item.value
        }
      }

      if(itemObj.SmID !== -1) {
        TempData.push(itemObj)
      }
    }

    // console.warn("TempData: " + JSON.stringify(TempData))
    this.setState({
      attributeData: TempData,
    })
  }

  callDetail = async(data: callAttributeType) => {

    try {
      const currentFieldInfo = data.attributeInfo
      if(currentFieldInfo.length === 0) return
      this.setLoading(true, getLanguage().LOADING)
      SMap.setAction(Action.PAN)
      SMap.setLayerEditable(this.props.currentLayer.path, false)
      let geoStyle = new GeoStyle()
      geoStyle.setFillForeColor(0, 255, 0, 0.5)
      geoStyle.setLineWidth(1)
      geoStyle.setLineColor(70, 128, 223)
      geoStyle.setMarkerHeight(5)
      geoStyle.setMarkerWidth(5)
      geoStyle.setMarkerSize(10)
      // 检查是否是文本对象，若是，则使用TextStyle
      for (let j = 0; j < currentFieldInfo.length; j++) {
        if (
          currentFieldInfo[j].name === 'SmGeoType' &&
          currentFieldInfo[j].value === GeometryType.GEOTEXT
        ) {
          geoStyle = new TextStyle()
          geoStyle.setForeColor(0, 255, 0, 0.5)
          break
        }
      }
      SMap.setTrackingLayer(
        [
          {
            layerPath: this.props.currentLayer.path + '',
            ids: [
              // (currentFieldInfo[0].name === 'SmID'
              //   ? currentFieldInfo[0].value
              //   : currentFieldInfo[1].value) + 1 - 1,
              data.SmID
            ],
            style: JSON.stringify(geoStyle),
          },
        ],
        true,
      ).then(async () => {

        CallDetail()().action()
        const type = AppletsToolType.APPLETS_CALL_DETAIL_HOME
        const { buttons, customView } =CallDetailData.getData(type)
        ToolbarModule.getParams().showFullMap(true)
        ToolbarModule.getParams().setToolbarVisible(true, type, {
          isFullScreen: false,
          height: dp(88 * 10),
          // data,
          buttons,
          containerType: ToolbarType.list,
          customView: customView && (() => customView(data)),
          // column,
          cb: () => {
            // ToolbarModule.addData({
            //   lastType: type,
            //   lastLayer:layerName,
            // })
            // createCollector(type, layerName)
            this.props.navigation &&
                  this.props.navigation.navigate('MapView', {
                    hideMapController: true,
                  })
            this.setLoading(false)
          },
        })

        StyleUtils.setSelectionStyle(this.props.currentLayer.path)
        result = await SMap.setLayerVisible(this.props.currentLayer.path, false)
        if (data instanceof Array && data.length > 0) {
          SMap.moveToPoint({
            x: data[0].x,
            y: data[0].y,
          })
        }
      })
    } catch (error) {
      this.setLoading(false)
    }

  }

  setLoading = (loading = false, info: string | undefined, extra = {}) => {
    this.container && this.container?.setLoading(loading, info, extra)
  }

  _renderItem(item: callAttributeType, index: number) {
    return (
      <View
        style={[{
          width: '100%',
          height: dp(60),
          flexDirection: 'row',
          paddingHorizontal: dp(10),
          marginTop: dp(10),
          borderBottomColor: color.grayLight,
          borderBottomWidth: dp(1),
        }]}
      >
        <TouchableOpacity
          style={[{
            flex:1,
            height: dp(60),
            flexDirection: 'row',
            justifyContent: 'space-between',
            // paddingHorizontal: dp(10),
            // marginTop: dp(10),
            // borderBottomColor: color.grayLight,
            // borderBottomWidth: dp(1),
          }]}
          onPress={() => {
            this.callDetail(item)
          }}
        >
          <View
            style={[{
              flex: 1,
              height: '100%',
              justifyContent: 'space-evenly',
            },
            item.callPhoneNumber === "" && {
              justifyContent: 'center',
            },
            ]}
          >
            <Text
              style={[{
                fontSize: dp(20),
              }]}
            >
              {item.callName || getLanguage(global.language).Map_Settings.MANUAL_ACQUISITION}
            </Text>
            {item.callPhoneNumber !== "" && (
              <Text>{item.callPhoneNumber}</Text>
            )}
            {/* <Text>{item.callPhoneNumber || ""}</Text> */}
          </View>

          <View
            style={[{
              width:dp(150),
              height: '100%',
              justifyContent: 'space-evenly',
              alignItems: 'flex-end'
            }]}
          >
            <Text
              style={[{
              }]}
            >
              {item.localTime_User}
            </Text>
            <Text>{`时长：${Number(item.duration).toFixed(2)} 分钟`}</Text>
          </View>

        </TouchableOpacity>
        <TouchableOpacity
          style={[{
            width: dp(40),
            height: '100%',
            justifyContent: 'center',
            alignContent: 'center',
            marginLeft: dp(10),
          }]}
          onPress={async () => {
            TourAction.uploadDialog(item.SmID, 'line')
            await this.getAttributeData()
          }}
        >
          <Image
            style={[{
              width: dp(30),
              height: dp(30),
            }]}
            source={item.isUploaded ? getImage().icon_upload_gray : getImage().icon_upload}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderList = () => {
    if(this.state.attributeData.length <= 0) {
      return null
    }
    return (
      <FlatList
        renderItem={({item, index}) => this._renderItem(item, index)}
        data={this.state.attributeData}
        keyExtractor={(item, index) => item.SmID + "-" + index}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  renderHeaderRight = () => {
    return (
      <TouchableOpacity
        style={[{
          width: dp(40),
          height: '100%',
          justifyContent: 'center',
          alignContent: 'center',
          marginLeft: dp(10),
        }]}
        onPress={async () => {
          TourAction.uploadDialog(-1, 'all')
          await this.getAttributeData()
        }}
      >
        <Image
          style={[{
            width: dp(30),
            height: dp(30),
          }]}
          source={getImage().icon_upload}
        />
      </TouchableOpacity>
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        mapModules={this.props.mapModules}
        initIndex={1}
        type={"langchao"}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
        headerProps={{
          title: getLanguage(global.language).Map_Settings.HISTORICAL_RECORD,
          // title: "设置服务地址",
          withoutBack: true,
          headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: {
            borderBottomWidth: dp(1),
            backgroundColor: color.containerHeaderBgColor,
          },
          responseHeaderTitleStyle: {color: color.containerTextColor},
          isResponseHeader: true,
        }}
        bottomBar={this.renderToolBar()}
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        {/* <Text>{"我是历史记录页面"}</Text> */}
        {this.renderList()}

      </Container>
    )
  }
}

const mapStateToProp = (state: any) => ({
  mapModules: state.mapModules.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentLayer: state.layers.toJS().currentLayer,
})

const mapDispatch = {
  setCurrentSymbol,
  setServerIP,
  // setServerIP1,
  setServerUserId,
  setServerUserName,
  setServerDepartmentId,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(HistoricalRecord)

const styles = StyleSheet.create({
})