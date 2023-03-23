import { SMap } from 'imobile_for_reactnative'
import React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ImageRequireSource, StyleSheet} from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../redux/types'
import { dp, AppStyle } from '../../utils'
import { formatFloat } from '../../utils/CheckUtils'
import { getImage, getThemeAssets } from '../../assets'
import { getLanguage } from '../../language'
import { Point3D } from 'imobile_for_reactnative/types/data'
import Button from 'imobile_for_reactnative/components/Button'

interface Props extends ReduxProps{
  close: () => void
  visible: boolean

  onConfirm: (calinrationMode: CalibrationMode) => void
  // onEnhance: () => void
  // gotoSinglePointPage: () => void
  // gotoTwoPointPage: () => void
}

export type CalibrationMode = "arEnhance" | "singlePoint" | "twoPoint"

interface State {
  // to do
  selectPositionMode: CalibrationMode
}

class LocationCalibration extends React.Component<Props, State> {

  timer: NodeJS.Timer | null

  constructor(props: Props) {
    super(props)
    this.state ={
      selectPositionMode: 'singlePoint'
    }
    this.timer = null
  }

  /**
   * AR增强定位点击调用方法
   */
  arEnhancePosition = () => {
    // this.props.onEnhance()
    this.setState({
      selectPositionMode: 'arEnhance',
    })
  }

  /** 去单点定位页面 */
  gotoSinglePointPage = () => {
    // this.props.gotoSinglePointPage()
    this.setState({
      selectPositionMode: 'singlePoint',
    })
  }

  /** 去两点定位页面 */
  gotoTwoPointPage = () => {
    // this.props.gotoTwoPointPage()
    this.setState({
      selectPositionMode: 'twoPoint',
    })
  }

  onConfirm = () =>{
    this.props.onConfirm(this.state.selectPositionMode)
    // switch(this.state.selectPositionMode) {
    //   case 'arEnhance':
    //     this.props.onEnhance()
    //     break
    //   case 'singlePoint':
    //     this.props.gotoSinglePointPage()
    //     break
    //   case 'twoPoint':
    //     this.props.gotoTwoPointPage()
    //     break

    // }
  }

  renderItem = (text: string, image: ImageRequireSource, onPress: () => void, mode:CalibrationMode ) => {
    return (
      <TouchableOpacity style={[styles.selectItem,
        this.state.selectPositionMode === mode && {
          borderColor: '#007AFF',
        }
      ]}
      onPress={onPress}
      >
        <View
          style={styles.selectItemTouch}
        >
          <Image
            source={image}
            style={styles.selectItemImage}
          />
        </View>

        <Text
          numberOfLines={2}
          style={styles.selectItemText}
        >
          {text + ''}
        </Text>
      </TouchableOpacity>
    )
  }

  renderSelect = () => {
    const horizontal = this.props.windowSize.height < styles.containerStyle.height
    return (
      <View
        style={[horizontal ? {
          marginTop: dp(8),
        } : {
          marginTop: dp(20),
          marginBottom: dp(5),
        },
        styles.selectContainer
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            marginTop: dp(10),
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* 单点定位 */}
          {this.renderItem(
            getLanguage().SINGLE_POINT_POSITION,
            getThemeAssets().collection.icon_location,
            this.gotoSinglePointPage,
            'singlePoint',
          )}

          {/* 两点定位 */}
          {this.renderItem(
            getLanguage().TWO_POINT_POSITION,
            getImage().icon_two_point_position,
            this.gotoTwoPointPage,
            'twoPoint',
          )}

          {/* AR增强定位 */}
          {this.renderItem(
            getLanguage().MAP_AR_ENHANCE_POSITION,
            getImage().icon_ar_enhance,
            this.arEnhancePosition,
            'arEnhance'
          )}

        </View>
      </View>

    )
  }

  renderClose = () => {
    return (
      <TouchableOpacity
        style={[this.horizontal ? {
          right: dp(18),
          top: dp(14),
        }: {
          right: dp(21),
          top: dp(20),
        }, {
          position: 'absolute',
        }]}
        onPress={this.props.close}
      >
        <Image
          style={{
            height: dp(17),
            width: dp(17),
          }}
          source={getThemeAssets().mapTools.icon_tool_cancel}
        />
      </TouchableOpacity>

    )
  }

  renderHeader = () => {
    let title = getLanguage().SINGLE_POINT_POSITION
    let descript = getLanguage().MAP_AR_TOWARDS_NORTH
    let imageSrc = getImage().icon_position_single_point
    switch(this.state.selectPositionMode) {
      case 'arEnhance':
        title = getLanguage().MAP_AR_ENHANCE_POSITION
        descript = getLanguage().SCAN_POSITION_CODE
        imageSrc = getImage().icon_position_single_point
        break
      case 'singlePoint':
        title = getLanguage().SINGLE_POINT_POSITION
        descript = getLanguage().MAP_AR_TOWARDS_NORTH
        imageSrc = getImage().icon_position_swell
        break
      case 'twoPoint':
        title = getLanguage().TWO_POINT_POSITION
        descript = getLanguage().OPEN_GPS_TWO_POINT
        imageSrc = getImage().icon_position_two_point
        break

    }
    return (
      <View style={[styles.header, this.horizontal && { marginTop: dp(34), width: dp(142)}]}>
        <View style={styles.circle1}>
          {/* <View style={styles.circle2}>
            <View style={styles.circle3}>

            </View>
          </View> */}
          <Image
            style={styles.headerImage}
            source={imageSrc}
          />
        </View>
        <Text style={styles.headerText1}>
          {title}
        </Text>
        <Text style={[styles.headerText2, {textAlign: 'center'}]}>
          {descript}
        </Text>
      </View>
    )
  }

  /**
   * 校准页面的确定按钮的渲染
   * @returns
   */
  renderButton = () => {
    return (
      <View style={[styles.confirmButtonContainer,
        !this.horizontal && {
          marginTop: dp(10),
        }
      ]}>
        <Button
          style={styles.confirmButtom}
          title={getLanguage().Common.CONFIRM}
          onPress={this.onConfirm}
        />
      </View>
    )
  }

  renderContainer= () => {
    return this.horizontal ? (
      <View style={styles.containerStyleL}>
        {this.renderClose()}
        <View style={{flex: 1}}>
          {this.renderSelect()}
        </View>
        <View style={{ height: '100%', justifyContent: 'space-between', alignItems: 'center', marginLeft: dp(28)}}>
          {this.renderHeader()}
          {this.renderButton()}
        </View>
      </View>
    ): (
      <View style={styles.containerStyle}>
        {this.renderClose()}
        {this.renderHeader()}
        {this.renderSelect()}
        {this.renderButton()}
      </View>
    )
  }

  horizontal = true
  render() {
    if (!this.props.visible) return null
    this.horizontal = this.props.windowSize.height < styles.containerStyle.height
    return (
      <View  style={[StyleSheet.absoluteFill, {elevation: 100}]}>
        <View  style={[StyleSheet.absoluteFill, {backgroundColor: 'black', opacity: 0.7}]} />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {this.renderContainer()}
        </View>
      </View>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  windowSize: state.device.toJS().windowSize,
})



type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp)

export default connector(LocationCalibration)


const styles = StyleSheet.create({
  containerStyle: {
    width: dp(335),
    // height: dp(519),
    height: dp(390),
    borderRadius: dp(21),
    backgroundColor: AppStyle.Color.WHITE,
    alignItems: 'center',
    paddingTop: dp(31),
    paddingBottom: dp(13),
    paddingHorizontal: dp(21),
  },
  containerStyleL: {
    flexDirection: 'row',
    height: dp(285),
    width: dp(502),
    borderRadius: dp(21),
    backgroundColor: AppStyle.Color.WHITE,
    alignItems: 'center',
    paddingVertical: dp(13),
    paddingHorizontal: dp(24),
  },

  header: {
    alignItems: 'center',
    width: '100%',
  },
  circle1: {
    width: dp(109),
    height: dp(109),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dp(55),
    borderWidth: dp(1),
    borderColor: '#E7E7E77F',
  },
  circle2: {
    width: dp(92),
    height: dp(92),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dp(46),
    backgroundColor: '#EFEFEF7F'
  },
  circle3: {
    width: dp(75),
    height: dp(75),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dp(38),
    backgroundColor: 'white',
  },
  headerImage: {
    // height: dp(59),
    // width: dp(59),
    width: dp(109),
    height: dp(109),
  },
  headerText1: {
    ...AppStyle.h2,
    fontSize: dp(15),
    marginTop: dp(6),
  },
  headerText2: {
    ...AppStyle.h3,
    marginTop: dp(2),
    color: '#8a8a8f',
  },

  inputContainer: {
    width: '100%'
  },
  inputItem: {
    height: dp(44),
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: dp(10),
    // borderBottomWidth: dp(1),
    // borderBottomColor: '#ECECEC',
  },

  selectContainer: {
    flexDirection: 'row',
  },
  selectAuto: {
    alignItems: 'flex-start',
    borderRightWidth: dp(1),
    borderColor: AppStyle.Color.Seperratoe_Light,
    marginRight: dp(5),
  },
  selectManual: {
    alignItems: 'flex-start',
    flex: 1,
  },
  selectTitle: {
    ...AppStyle.h2,
    color: AppStyle.Color.Text_Light,
  },

  selectItem: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: dp(80),
    height: dp(80),
    borderWidth: dp(1),
    borderRadius: dp(10),
    borderColor: '#fff',
  },
  selectItemTouch: {
    width: dp(59),
    height: dp(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dp(8),
    marginBottom: dp(3),
  },
  selectItemImage: {
    width: dp(34),
    height: dp(34),
  },
  selectItemText: {
    fontSize: dp(12),
    color: AppStyle.Color.Text_Light,
    textAlign: 'center',
  },

  confirmButtonContainer: {
    width: dp(142),
    height: dp(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtom: {
    width: dp(125),
    height: dp(38),
    borderRadius: dp(50),
  }
})