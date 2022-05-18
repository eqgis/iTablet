import React from 'react'
import {
  View,
  Modal,
  BackHandler,
  InteractionManager,
  Platform,
  Dimensions,
} from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import PageKeys from './PageKeys'
import AlbumListView from './AlbumListView'
import AlbumView from './AlbumView'
import { screen } from '../../../utils'
import NavigationService from '@/containers/NavigationService'
// import PreviewMultiView from './PreviewMultiView'
// import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator'

const Stack = createNativeStackNavigator()

export default class extends React.PureComponent {
  static defaultProps = {
    okLabel: 'OK',
    cancelLabel: 'Cancel',
    deleteLabel: 'Delete',
    useVideoLabel: 'Use Video',
    usePhotoLabel: 'Use Photo',
    previewLabel: 'Preview',
    choosePhotoTitle: 'Choose Photo',
    maxSizeChooseAlert: number =>
      global.language === 'EN'
        ? 'You can only choose ' + number + ' photos at most'
        : '您最多能选择' + number + '张照片',
    maxSizeTakeAlert: number =>
      'You can only take ' + number + ' photos at most',
    supportedOrientations: ['portrait', 'landscape'],
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._clickBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._clickBack)
  }

  render() {
    const callback = data => {
      this.props.callback && this.props.callback(data)
      // NavigationService.goBack('ImagePickerStack')
      this.props.navigation.navigate('MapView')
    }
    const allscenes = {
      [PageKeys.album_list]: AlbumListView,
      [PageKeys.album_view]: AlbumView,
      // [PageKeys.preview]: PreviewMultiView,
    }
    const withUnwrap = WrappedComponent =>
      class extends React.PureComponent {
        render() {
          return (
            <WrappedComponent
              {...this.props.route.params}
              navigation={this.props.navigation}
              callback={callback}
            />
          )
        }
      }
    // const scenes = Object.keys(allscenes).reduce((prv, cur) => {
    //   prv[cur] = {
    //     screen: withUnwrap(allscenes[cur]),
    //     navigationOptions: {
    //       gesturesEnabled: false,
    //     },
    //   }
    //   return prv
    // }, {})
    // const NavigationDoor = createAppContainer(
    //   createNativeStackNavigator(scenes, {
    //     initialRouteName: this.props.initialRouteName,
    //     initialRouteParams: {
    //       ...this.props,
    //       callback: callback,
    //     },
    //     headerMode: 'none',
    //     // transitionConfig: () => ({
    //     //   screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    //     // }),
    //   }),
    // )
    
    return (
      // <Modal
      //   animationType={'slide'}
      //   supportedOrientations={this.props.supportedOrientations}
      //   style={{ flex: 1 }}
      //   onRequestClose={this._onRequestClose}
      // >
        <View style={{ flex: 1 }}>
          {/* <NavigationDoor /> */}
          {/* <AlbumListView
            {...this.props}
            callback={callback}
            navigation={this.props.navigation}
          /> */}
          {/* { withUnwrap(allscenes[PageKeys.album_list])} */}
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={PageKeys.album_list}
              screenOptions={{
                headerShown: false,
                animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
                presentation: 'transparentModal',
              }}
            >
              <Stack.Screen name={PageKeys.album_list} component={() => withUnwrap(allscenes[PageKeys.album_list])} />
              <Stack.Screen name={PageKeys.album_view} component={() => withUnwrap(allscenes[PageKeys.album_view])} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      // </Modal>
    )
  }

  _onRequestClose = () => {}

  _clickBack = () => {
    this.props.onDestroy && this.props.onDestroy()
    return true
  }
}
