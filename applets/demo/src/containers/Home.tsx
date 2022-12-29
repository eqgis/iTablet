import React from 'react'
import { View, PermissionsAndroid, Text } from 'react-native'
import { connect } from 'react-redux'
import { SMMapView, SMap, FileTools, AppInfo, SLocation } from 'imobile_for_reactnative'

interface Props {
  language: string,
}

interface State {
  isInit: boolean,
}

class Home extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.setState({
      isInit: false,
    })
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    try {
      const results = await PermissionsAndroid.requestMultiple([
        'android.permission.READ_PHONE_STATE',
        // 'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        // 'android.permission.CAMERA',
        // 'android.permission.RECORD_AUDIO',
      ])

      let isAllGranted = true
      for (const key in results) {
        isAllGranted = results[key] === 'granted' && isAllGranted
      }
      await SMap.setPermisson(true)
      await AppInfo.setRootPath('/iTablet')
      await SMap.initEnvironment('iTablet')
      await SLocation.openGPS()

      isAllGranted && this.setState({
        isInit: isAllGranted,
      })
    } catch (error) {
    }
  }

  _onGetInstance = async () => {
    try {
      const result = await SMap.openWorkspace({
        server: await FileTools.getHomeDirectory() + 'DefaultData/Workspace/Workspace.sxwu',
      })
    } catch (e) {

    }
  }

  render(): React.ReactNode {
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'yellow' }}
      >
        <Text>{this.props.language}</Text>
        {/* {
          this.state.isInit
            ? <SMMapView
              moduleId={0x01}
              onGetInstance={this._onGetInstance}
            />
            : <View />
        } */}
        <SMMapView
          moduleId={0x01}
          onGetInstance={this._onGetInstance}
        />
      </View>
    )
  }
}

const mapDispatchToProps = {
  // plus,
  // minus,
}

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)