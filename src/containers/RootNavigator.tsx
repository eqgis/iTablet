import React, { Component } from 'react'
import { View } from 'react-native'
import NavigationService from './NavigationService'
import AppNavigator from '../containers'
import { NavigationContainer, NavigationState } from '@react-navigation/native'
import { UserInfo } from '@/types'

interface Props {
  appConfig: any,
  device: any,
  currentUser: UserInfo,

  setNav: (params: any, cb?: () => void) => Promise<void>,
  setModules: (params: any, cb?: () => void) => Promise<void>,
}

export default class RootNavigator extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const prevAppConfig = Object.assign({}, this.props.appConfig)
    const nextAppConfig = Object.assign({}, nextProps.appConfig)
    delete prevAppConfig.currentMapModule
    delete nextAppConfig.currentMapModule
    const shouldUpdate =
      JSON.stringify(prevAppConfig) !== JSON.stringify(nextAppConfig) ||
      JSON.stringify(nextProps.device) !== JSON.stringify(this.props.device)
    return shouldUpdate
  }

  render() {
    let RootView = <View style={{ flex: 1 }} />
    if (
      this.props.appConfig.tabModules &&
      this.props.appConfig.tabModules.length > 0
    ) {
      RootView = AppNavigator({
        appConfig: this.props.appConfig,
        device: this.props.device,
        currentUser: this.props.currentUser,
      })
    }
    return (
      <NavigationContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef)
        }}
        onStateChange={(state: NavigationState | undefined) => {
          this.props.setNav(state)
        }}
      >
        {RootView}
      </NavigationContainer>
    )
  }
}
