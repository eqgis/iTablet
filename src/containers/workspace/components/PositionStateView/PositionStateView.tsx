import { getThemeAssets } from "@/assets"
import NavigationService from "@/containers/NavigationService"
import { getLanguage } from "@/language"
import { GGA } from "imobile_for_reactnative/NativeModule/interfaces/SLocation"
import React, {Component} from "react"
import { Text, View, Image, TouchableOpacity } from 'react-native'
import styles from './style'

interface Props {
  pointStateText: string,
  isPointParamShow: boolean,
  gga: GGA,
}

export default class PositionStateView extends Component<Props> {

  constructor(props: Props) {
    super(props)
    this.state = {
      text: this.props.pointStateText,
    }
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
    return this.props.isPointParamShow ? (
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
          <Text style={[styles.text]}>{this.getPositionSatateText(this.props?.gga?.fixType || -1)}</Text>
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
