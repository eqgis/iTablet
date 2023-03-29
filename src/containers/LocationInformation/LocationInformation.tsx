/**
 * 设备厂家页面  设计里的定位设备
 */
import React, { Component } from "react"
import { Text, Image, TouchableOpacity, ScrollView, View, Platform, Switch } from 'react-native'
import Container from '../../components/Container'
import { dp, scaleSize} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import { DeviceManufacturer, DeviceType } from '@/redux/models/location'
import styles from "./styles"
import { MainStackScreenNavigationProps } from "@/types"
import { getImage } from "@/assets"
import { GGA } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"

interface DeviceManufacturerItemType {
  label: string
  value: DeviceManufacturer
}

interface RowType {
  title: string,
  value?: string,
  action?: () => void,
  /** 当为false时显示右侧箭头， 当为true时不显示 */
  isHiddenRightImage?: boolean,
  /** 当为false时显示底部边框， 当为true时不显示 */
  isHiddenBottomLine?: boolean,
}

interface Props {
	navigation: MainStackScreenNavigationProps<'LocationInformation'>,
	deviceManufacturer: DeviceManufacturer,
	setDeviceManufacturer: (manufacturer: DeviceManufacturer) => void
  setDeviceType: (devicetype: DeviceType) => void
  gga:GGA
  isPointParamShow: boolean,
  setPointParamShow: (value: boolean)=> void,
}

interface State {
	// curDeviceManufacturer: DeviceManufacturer,
}

class LocationInformation extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      // curDeviceManufacturer: this.props.deviceManufacturer || "other",
    }
  }

  confirmAction = () => {
    NavigationService.goBack()
  }

  getPositionSatateText01 = (type: number) => {
    let text = getLanguage().UNKONW
    switch (type) {
      case 0:
        text = "Invalid"
        break
      case 1:
        text = "GPS"
        break
      case 2:
        text = "DGPS"
        break
      case 3:
        text = "PPS"
        break
      case 4:
        text = "RTK"
        break
      case 5:
        text = "FloatRTK"
        break
      case 6:
        text = "Estimated"
        break
      case 7:
        text = "Manual"
        break
      case 8:
        text = "Simulation"
        break
      case 9:
        text = "WAAS"
        break
      default:
        text = getLanguage().UNKONW
        break
    }
    return text
  }

  getPositionSatateText = (type: number) => {
    let text = getLanguage().UNKONW
    switch (type) {
      case 4: // "RTK"
        text = getLanguage().FIXED_SOLUTION
        break
      case 5: // "FloatRTK"
        text = getLanguage().FLOAT_SOLUTION
        break
      case 1: // "GPS"
      case 2: // "DGPS"
      case 3: // "PPS"
      case 6: // "Estimated"
      case 7: // "Manual"
      case 8: // "Simulation"
      case 9: // "WAAS"
        text = getLanguage().SIGING_POINT_SOLUTION
        break
      case 0: // "Invalid"
        text = getLanguage().INVALIDE_SOLUTION
        break
      default:
        text = getLanguage().UNKONW
        break
    }
    return text
  }

  /** 确认按钮 */
  renderRight = () => {
    return (
      <TouchableOpacity
        onPress={this.confirmAction}
        style={[{
          marginRight: scaleSize(30),
        }]}
      >
        <Text style={[styles.headerRightText]}>
          {getLanguage(global.language).Profile.CONFIRM}
        </Text>
      </TouchableOpacity>
    )
  }

  /** 分割线 */
  renderSeperator = () => {
    return  <View style={styles.seperator} />
  }

  /** 定位信息显示开关 */
  renderLocationInfoShowSwitch = () => {
    return (
      <View style={[styles.itemView,{
        borderBottomColor:'transparent'
      }]}>
        <Text style={styles.text}>{getLanguage().Map_Settings.SHOW_POINT_INFO}</Text>
        <Switch
          // style={styles.switch}
          trackColor={{ false: '#F0F0F0', true: "#2D2D2D" }}
          thumbColor={this.props.isPointParamShow ? "#fff" : "#fff"}
          ios_backgroundColor={this.props.isPointParamShow ? "#2D2D2D" : '#F0F0F0'}
          value={this.props.isPointParamShow}
          onValueChange={(value: boolean) => {
            this.props.setPointParamShow(value)
          }}
        />
      </View>
    )
  }


  renderRowItem = (param: RowType) => {
    return (
      <TouchableOpacity
        style={[styles.itemView,
          param.isHiddenBottomLine && {
            borderBottomColor:'transparent',
          }]}
        onPress={param.action}
      >
        <Text style={styles.text}>{param.title}</Text>
        {param.value && (
          <View
            style={[{
              flex: 1,
              height: '100%',
              justifyContent:'center',
              alignItems:'flex-end',
              marginRight: dp(6)
            },
            !param.isHiddenRightImage && {
              marginRight: dp(20),
            }]}
          >
            <Text style={[{
              fontSize: scaleSize(26),
            }]}>{param.value}</Text>
          </View>
        )}

        {!param.isHiddenRightImage && (
          <Image
            source={getImage().arrow}
            style={[{
              width: dp(15),
              height: dp(15),
              // marginRight: dp(10),
            }]}
          />
        )}

      </TouchableOpacity>
    )
  }

  renderContent = () => {
    return (
      <ScrollView
        style={[styles.listContentView]}
      >

        {this.renderRowItem({
          title: getLanguage().SLOCATION_STATE_CURRENT,
          value: this.getPositionSatateText(this.props?.gga?.fixType || -1),
          isHiddenRightImage: true,
        })}

        {this.renderRowItem({
          title: getLanguage().SAT_NUMBER,
          value: (this.props.gga?.satNums || 0) + "",
          isHiddenRightImage: true,
        })}

        {this.renderRowItem({
          title: getLanguage().MAP_AR_DATUM_LONGITUDE + '(B)',
          value: (this.props.gga?.longitude || 0) + "",
          isHiddenRightImage: true,
        })}

        {this.renderRowItem({
          title:  getLanguage().MAP_AR_DATUM_LATITUDE + '(L)',
          value: (this.props.gga?.latitude || 0) + "",
          isHiddenRightImage: true,
        })}

        {this.renderRowItem({
          title:  getLanguage().ELLIPSOID_HEIGHT + '(H)',
          value: (this.props.gga?.altitude || 0) + "",
          isHiddenRightImage: true,
        })}
        {this.renderRowItem({
          title: getLanguage().NTRIP_TIMEOUT + '(S)',
          value: (this.props.gga?.age?.toFixed(2) || 0) + "",
          isHiddenRightImage: true,
          isHiddenBottomLine: true,
        })}

        {this.renderSeperator()}
      </ScrollView>
    )
  }

  render() {
    return (
      <Container
        // ref={(ref: typeof Container) => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.LOCATION_INFORMATION,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          isResponseHeader: true,
        }}
        style={styles.container}
      >
        {this.renderLocationInfoShowSwitch()}
        {this.renderSeperator()}
        {this.renderContent()}
      </Container>
    )
  }
}

export default LocationInformation