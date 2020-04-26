import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import TabContainer from '../../src/containers/tabs/TabContainer'
import { getThemeAssets } from '../../src/assets'

class Example extends Component {
  props: {
    language: string,
    navigation: Object,
    device: Object,
  }

  constructor(props) {
    super(props)
  }

  static getTitle = language => {
    return language === 'CN' ? 'Tab示例' : 'Tab Example'
  }

  render() {
    return (
      <TabContainer
        ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
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

const MyExample = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Example)

export default {
  key: 'Example',
  getTitle: MyExample.getTitle,
  Screen: MyExample,
  image: getThemeAssets().tabBar.tab_discover,
  selectedImage: getThemeAssets().tabBar.tab_discover_selected,
}
