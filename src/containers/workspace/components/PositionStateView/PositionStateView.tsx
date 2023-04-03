import { getThemeAssets } from "@/assets"
import { ChunkType } from "@/constants"
import NavigationService from "@/containers/NavigationService"
import { getLanguage } from "@/language"
import { PointParamShowParam } from "@/redux/models/setting"
import { GGA, IRTKFixType, RTKFixType } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"
import React, {Component} from "react"
import { Text, View, Image, TouchableOpacity } from 'react-native'
import styles from './style'

interface Props {
  pointStateText: string,
  isPointParamShow: PointParamShowParam,
  gga: GGA,
}

export default class PositionStateView extends Component<Props> {

  constructor(props: Props) {
    super(props)
    this.state = {
      text: this.props.pointStateText,
    }
  }


  getPositionSatateText = (type: IRTKFixType[keyof IRTKFixType] | -1) => {
    let text = getLanguage().UNKONW
    switch (type) {
      case RTKFixType.invalid: // "Invalid"
        text = getLanguage().INVALIDE_SOLUTION
        break
      case RTKFixType.GPS: // "GPS"
        text = getLanguage().SIGING_POINT_SOLUTION
        break
      case RTKFixType.DGPS: // "DGPS"  Differential Global Position System  差分全球定位系统
        text = getLanguage().DGPS
        break
      case RTKFixType.PPS: // "PPS"  Pulse Per Second
        text = getLanguage().PPS
        break
      case RTKFixType.RTK: // "RTK"
        text = getLanguage().FIXED_SOLUTION
        break
      case RTKFixType.floatRTK: // "FloatRTK"
        text = getLanguage().FLOAT_SOLUTION
        break
      case RTKFixType.estimated: // "Estimated"  Estimated Positioning Error 估计定位误差
        text = getLanguage().ESTIMATED
        break
      case RTKFixType.manual: // "Manual"
        text = getLanguage().MANUAL
        break
      case RTKFixType.simulation: // "Simulation"
        text = getLanguage().SIMULATION
        break
      case RTKFixType.WAAS: // "WAAS"  Wide Area Augmentation System 广域扩充系统
        text = getLanguage().WAAS
        break
      default:
        text = getLanguage().UNKONW
        break
    }
    return text
  }


  render() {
    let imgState = getThemeAssets().publicAssets.icon_position_state_red
    switch (this.props.gga?.fixType || -1) {
      case 4: // "RTK"
        imgState = getThemeAssets().publicAssets.icon_position_state_green
        break
      case 5: // "FloatRTK"
        imgState = getThemeAssets().publicAssets.icon_position_state_yellow
        break
      // case 0: // "Invalid"
      case 1: // "GPS"
      case 2: // "DGPS"
      case 3: // "PPS"
      case 6: // "Estimated"
      case 7: // "Manual"
      case 8: // "Simulation"
      case 9: // "WAAS"
      default:
        imgState = getThemeAssets().publicAssets.icon_position_state_red
        break
    }
    // 定位信息第一次进入APP，设置除为专题制图外的其他模块都显示
    const isShow =  (this.props.isPointParamShow === 1 || (this.props.isPointParamShow === -1 && global.Type !== ChunkType.MAP_THEME))
    return isShow ? (
      <TouchableOpacity
        style={[
          styles.container,
          // !this.props.isPointParamShow && styles.containerHiden
        ]}
        onPress={() => {
          NavigationService.navigate("LocationInformation")
        }}
        activeOpacity={0.5}
      >
        <View
          style={[styles.itemStyle]}
        >
          <Image
            source={imgState}
            style={[styles.image]}
          />
          <Text style={[styles.text]}>{this.getPositionSatateText(this.props.gga ? this.props.gga.fixType : -1)}</Text>
        </View>

        <View
          style={[styles.itemStyle]}
        >
          <Image
            source={getThemeAssets().publicAssets.icon_position_accuracy}
            style={[styles.image]}
          />
          <Text style={[styles.text]}>{this.props?.gga?.HDOP?.toFixed(2) || getLanguage().UNKONW}</Text>
        </View>

        <View
          style={[styles.itemStyle]}
        >
          <Image
            source={getThemeAssets().publicAssets.icon_gps}
            style={[styles.image]}
          />
          <Text style={[styles.text]}>{this.props?.gga?.satNums || 0}</Text>
        </View>

      </TouchableOpacity>
    ): null
  }
}
