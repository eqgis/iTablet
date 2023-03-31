import { getImage, getThemeAssets } from "@/assets"
import { RootState } from "@/redux/types"
import { AppEvent, dp, screen } from "@/utils"
import { SMCollectorType } from "imobile_for_reactnative"
import React, {Component} from "react"
import { View, Image, UIManager,  findNodeHandle, Text, PixelRatio, Platform, TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'

interface Props {
	type: unknown
	device: any
}



class CollectionView extends Component<Props> {

  constructor(props: Props) {
    super(props)
    this.state = {
    }
  }

  addPointBtnAction = () => {
    // 准星采集打点
    if(this.props.type ===  SMCollectorType.LINE_AIM_POINT
			|| this.props.type === SMCollectorType.POINT_AIM_POINT
			|| this.props.type === SMCollectorType.REGION_AIM_POINT
    ) {
      AppEvent.emitEvent("collector_aim_point_add", this.props.type)
    }
  }

  /** 打点按钮 */
  renderAddButton = () => {
    return (
      <TouchableOpacity
        style={[{
          alignSelf: 'center',
        }]}
        onPress={this.addPointBtnAction}
      >
        <Image
          style={{width: dp(70), height: dp(70)}}
          source={getImage().icon_ar_measure_add}
        />
      </TouchableOpacity>
    )
  }

  render() {

    const width = dp(70)
    const height = dp(70)
    let top = 0
    // 横屏
    if(this.props.device.orientation.indexOf('LANDSCAPE') >= 0) {
      // left = screen.deviceHeight / 2 - width / 2
      top = screen.deviceWidth / 2 - height / 2

    }

    if(this.props.type ===  SMCollectorType.LINE_AIM_POINT
			|| this.props.type === SMCollectorType.POINT_AIM_POINT
			|| this.props.type === SMCollectorType.REGION_AIM_POINT
    ) {
      return (
        <TouchableOpacity
          style={[{
            width: width,
            height: height,
            alignSelf: 'center',
            position: 'absolute',
            // backgroundColor: '#f00',
          },
          this.props.device?.orientation.indexOf('LANDSCAPE') === 0 ? {
            top: top,
            right: dp(150)
          } : {
            bottom: dp(130),
          }
          ]}
          onPress={this.addPointBtnAction}
        >
          <Image
            style={{width: dp(70), height: dp(70)}}
            source={getImage().icon_ar_measure_add}
          />
        </TouchableOpacity>
      )
    }
    else return null

  }
}

// export default CollectionView

const mapStateToProps = (state: RootState) => {
  return {
    device: state.device.toJS().device,
    windowSize: state.device.toJS().windowSize,
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true,
  },
)(CollectionView)
