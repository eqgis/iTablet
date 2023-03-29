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

  getPositionSatateText = (type: number) => {
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


  render() {
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
            source={getThemeAssets().publicAssets.icon_position_state}
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
