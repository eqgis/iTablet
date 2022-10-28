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

  param: {x: string, y: string, z: string}
  onConfirm: (parms: Point3D) => void
  onEnhance: () => void
  onSelectPoint: () => void
  onScan: () => void
}

interface State {
  x: string
  y: string
  z: string
}

class LocationCalibration extends React.Component<Props, State> {

  timer: NodeJS.Timer | null

  constructor(props: Props) {
    super(props)
    this.state ={
      x: props.param.x,
      y: props.param.y,
      z: props.param.z
    }
    this.timer = null
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if(prevProps.param.x !== this.props.param.x
      || prevProps.param.y !== this.props.param.y
      || prevProps.param.z !== this.props.param.z) {
      this.setState({
        x: this.props.param.x,
        y: this.props.param.y,
        z: this.props.param.z
      })
    }
  }

  getCurrentLocation = () => {
    SMap.getCurrentPosition().then(result =>{
      this.setState({
        x: result.x + '',
        y: result.y + '',
      })
    })
  }

  /**
   * AR增强定位点击调用方法
   */
  arEnhancePosition = () => {
    this.props.onEnhance()
  }


  selectPoint = () => {
    this.props.onSelectPoint()
  }


  gotoScan = () => {
    this.props.onScan()
  }

  onConfirm = () =>{
    this.props.onConfirm({x:parseFloat(this.state.x), y:parseFloat(this.state.y), z:parseFloat(this.state.z)})
  }


  renderInput = (props: {
    text: string,
    value: string,
    onChange: (text:string) => void
    onClear: () => void
  }) => {
    return (
      <View style={styles.inputItem}>
        <Text style={[AppStyle.h2, {marginRight: dp(18)}]}>
          {props.text}
        </Text>
        <TextInput
          style={{flex: 1,
            fontSize: dp(13),
            padding: 0,
            borderBottomWidth: dp(1),
            borderBottomColor: '#ECECEC',
          }}
          keyboardType={'numeric'}
          returnKeyType={'done'}
          defaultValue={props.value}
          value={props.value}
          onChangeText={(text: string) => {
            text = formatFloat(text)
            props.onChange(text)
          }}
        />
        <TouchableOpacity
          onPress={props.onClear}
        >
          <Image
            source={getImage().icon_close}
            style={{...AppStyle.Image_Style_Small, tintColor: AppStyle.Color.GRAY}}
          />

        </TouchableOpacity>
      </View>
    )
  }

  renderInputs = () => {
    const horizontal = this.props.windowSize.height < styles.containerStyle.height
    return (
      <View style={[
        styles.inputContainer,
        horizontal ? {
          marginTop: dp(11)
        }: {
          marginTop: dp(5)
        }]}>
        {this.renderInput({
          text: 'X',
          value: this.state.x,
          onChange: text => {
            this.setState({x: text})
          },
          onClear: () => {
            this.setState({x: '0'})
          }
        })}
        {this.renderInput({
          text: 'Y',
          value: this.state.y,
          onChange: text => {
            this.setState({y: text})
          },
          onClear: () => {
            this.setState({y: '0'})
          }
        })}
        {this.renderInput({
          text: 'H',
          value: this.state.z,
          onChange: text => {
            this.setState({z: text})
          },
          onClear: () => {
            this.setState({z: '0'})
          }
        })}
      </View>
    )
  }

  renderItem = (text: string, image: ImageRequireSource, onPress: () => void) => {
    return (
      <View style={styles.selectItem}>
        <TouchableOpacity
          style={styles.selectItemTouch}
          onPress={onPress}
        >
          <Image
            source={image}
            style={styles.selectItemImage}
          />
        </TouchableOpacity>

        <Text
          numberOfLines={2}
          style={styles.selectItemText}
        >
          {text + ''}
        </Text>
      </View>
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
        {/* 自动定位部分 */}
        <View style={styles.selectAuto}>
          <Text
            numberOfLines={1}
            style={[styles.selectTitle, {maxWidth: dp(70)}]}
          >
            {getLanguage().MAP_AR_DATUM_AUTO_LOCATION}
          </Text>

          <View style={{marginTop: dp(10), marginRight: dp(5)}}>
            {this.renderItem(
              getLanguage().MAP_AR_ENHANCE_POSITION,
              getImage().icon_ar_enhance,
              this.arEnhancePosition,
            )}
          </View>
        </View>

        {/* 手动定位部分 */}
        <View style={styles.selectManual}>
          <Text
            numberOfLines={2}
            style={styles.selectTitle}
          >
            {getLanguage().MAP_AR_DATUM_MANUAL_LOCATION}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: dp(10),
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {this.renderItem(
              getLanguage().MAR_AR_DATUM_PICTURE_LOCATION,
              getImage().icon_scan,
              this.gotoScan,
            )}
            {this.renderItem(
              getLanguage().MAP_AR_DATUM_MAP_SELECT_POINT,
              getImage().icon_map_selection,
              this.selectPoint,
            )}
            {this.renderItem(
              getLanguage().MAP_AR_DATUM_GPS_LOCATION,
              getThemeAssets().collection.icon_location,
              this.getCurrentLocation,
            )}
          </View>
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
    return (
      <View style={[styles.header, this.horizontal && { marginTop: dp(34), width: dp(142)}]}>
        <View style={styles.circle1}>
          <View style={styles.circle2}>
            <View style={styles.circle3}>
              <Image
                style={styles.headerImage}
                source={getImage().icon_mobile}
              />
            </View>
          </View>
        </View>
        <Text style={styles.headerText1}>
          {getLanguage().MAR_AR_POSITION_CORRECT}
        </Text>
        <Text style={[styles.headerText2, {textAlign: 'center'}]}>
          {getLanguage().MAP_AR_TOWARDS_NORTH}
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
      <View style={[styles.confirmButtonContainer]}>
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
          {this.renderInputs()}
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
        {this.renderInputs()}
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
    height: dp(519),
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
    height: dp(59),
    width: dp(59),
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
    width: dp(70),
    height: dp(80),
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