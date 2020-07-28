import * as React from 'react'
import { SMARVideoView, SARVideoView } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { Container, ImagePicker } from '../../components'
import { scaleSize } from '../../utils'
import { View, TouchableOpacity, Image } from 'react-native'
import { getPublicAssets } from '../../assets'
import { getLanguage } from '../../language'
import NavigationService from '../../containers/NavigationService'

export default class ARVideoView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    let params = this.props.navigation.state.params || {}
    this.point = params.point
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    setTimeout(async () => {
      if (this.point) {
        await SARVideoView.setPosition(this.point.x, this.point.y)
      }
    }, 1000)
  }

  componentWillUnmount() {}

  renderBottom = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: scaleSize(80),
          backgroundColor: 'black',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginLeft: scaleSize(40),
            alignItems: 'center',
          }}
          onPress={() => {
            ImagePicker.AlbumListView.defaultProps.showDialog = false
            ImagePicker.AlbumListView.defaultProps.assetType = 'Videos'
            ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
            ImagePicker.getAlbum({
              maxSize: 1,
              callback: async data => {
                if (data && data.length > 0) {
                  let path = data[0].uri
                  SARVideoView.addVideoAtCurrentPosition(path)
                }
              },
            })
          }}
        >
          <Image
            source={getPublicAssets().common.icon_album}
            style={{ width: scaleSize(60), height: scaleSize(60) }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_VIDEO,
          navigation: this.props.navigation,
          type: 'fix',
          backAction: () => {
            GLOBAL.toolBox.switchAr()
            NavigationService.goBack('ARVideoView')
            //不移出相机，显示地图
            GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
          },
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMARVideoView style={{ flex: 1 }} />
        {this.renderBottom()}
      </Container>
    )
  }
}
