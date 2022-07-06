import * as React from 'react'
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { SARMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../language'
import { fixedSize } from '../../../../../../utils'
import { color } from '../../../../../../styles'
import { ScanView } from '../../components'
import ToolbarModule from '../ToolbarModule'
import AiVehicleActions from './AiVehicleActions'
import { Input, Button } from '../../../../../../components'
import styles from './styles'

interface Props {}

interface State {
  plateNubmer: string,
}

/*
 * 车辆识别界面
 */
export default class ScanVehicleView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    const _data: any = ToolbarModule.getData()
    this.state = {
      plateNubmer: _data.plateNubmer || '',
    }
  }

  componentDidMount() {
    try {
      SARMap.addCarPlateReadListener(async num => {
        ToolbarModule.addData({
          plateNubmer: num,
        })
        this.setState({
          plateNubmer: num,
        })
      })
      SARMap.startCarPlateRead()
    } catch (error) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(error)
    }
  }

  componentWillUnmount() {
    try {
      SARMap.endCarPlateRead()
      SARMap.removeCarPlateReadListener()
    } catch (error) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(error)
    }
  }

  renderBottomView() {
    const _params: any = ToolbarModule.getParams()
    let height = _params.device.height - fixedSize(200)
    let width = _params.device.width - fixedSize(120)
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' && 'position'}
        style={styles.previewBottom}
      >
        <View style={[styles.previewBottomContent, {
          maxHeight: height,
          maxWidth: width,
        }]}>
          <View style={styles.previewBottomLeftContent}>
            <Text style={styles.previewBottomTitle}>{getLanguage(global.language).AI.PLATE_NUMBER}</Text>
            <Input
              style={{ paddingHorizontal: 0 }}
              textAlign={'left'}
              inputStyle={styles.input}
              defaultValue={this.state.plateNubmer}
              placeholderTextColor={color.themePlaceHolder}
              textContentType={'URL'}
              onChangeText={text => {
                ToolbarModule.addData({
                  plateNubmer: text === '' ? '' : text.toLocaleUpperCase(),
                })
              }}
              showClear
              isKeyboardAvoiding
            />
          </View>
          <Button
            key="confirm"
            style={styles.confirmBtn}
            title={getLanguage(global.language).Map_Tools.TAKE_PHOTO}
            onPress={async () => {
              AiVehicleActions.goToPreview()
            }}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }

  render() {
    return (
      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}>
        <ScanView />
        {this.renderBottomView()}
      </View>
    )
  }
}
