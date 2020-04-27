/*
 Copyright © SuperMap. All rights reserved.
 Author: lu cheng dong
 E-mail: 756355668@qq.com
 */
import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import TabContainer from '../../src/containers/tabs/TabContainer'
import { getThemeAssets } from '../../src/assets'

class MapTabExample extends Component {
  props: {
    language: string,
    navigation: Object,
    device: Object,
  }

  constructor(props) {
    super(props)
  }

  static getTitle = language => {
    return language === 'CN' ? 'Map Tab示例' : 'Map Tab Example'
  }

  render() {
    return (
      <TabContainer
        ref={ref => (this.container = ref)}
        hideInBackground={false}
        headerProps={{
          title: this.getTitle(),
          withoutBack: true,
        }}
        navigation={this.props.navigation}
      >
        <View style={{flex: 1}} />
      </TabContainer>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = state => ({
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})

const MyMapTabExample = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapTabExample)

export default {
  key: 'MapTabExample',
  getTitle: MyMapTabExample.getTitle,
  Screen: MyMapTabExample,
  image: getThemeAssets().tabBar.tab_discover,
  selectedImage: getThemeAssets().tabBar.tab_discover_selected,
}
