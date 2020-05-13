import React, { Component } from 'react'
import { View,TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import TabContainer from '../../src/containers/tabs/TabContainer'
// import { getThemeAssets } from '../../src/assets'
// import { TouchableHighlight } from 'react-native-gesture-handler'
import { Toast } from '../../src/utils'

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
    // TabContainer为首页Tab的界面容器，具体Props参照Container组件
    return (
      <TabContainer
        ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
        headerProps={{
          title: Example.getTitle(),
          withoutBack: true,
        }}
        navigation={this.props.navigation}
      >
        <TouchableHighlight style={{flex: 1, backgroundColor: 'yellow'}} onPress={() => {Toast.show("用户自定义yellow")} }>
          <View></View>
        </TouchableHighlight>
        <TouchableHighlight style={{flex: 1, backgroundColor: 'blue'}} onPress={() => {Toast.show("用户自定义blue")} }>
          <View></View>
        </TouchableHighlight>
      </TabContainer>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = state => ({
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})

// 链接Redux，获取持久化/全局动态数据
const MyExample = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Example)

// 导出界面相关信息
export default {
  key: 'Example',
  // 根据系统语言获取Title
  getTitle: Example.getTitle,
  // 自定义Tab界面
  Screen: MyExample,
  // Tab未点击图片
  image: require('../../src/assets/userDefine/userDefineTab.png'), // Tab未点击图片
  selectedImage: require('../../src/assets/userDefine/userDefineTab.png'),
}
