/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { PopView, FingerMenu } from '../../../components'
import { scaleSize } from '../../../utils'
import { size, color } from '../../../styles'
import { getLanguage } from '../../../language'
import { TabView, SceneMap } from 'react-native-tab-view'

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: scaleSize(80) * 5,
  },
  btnsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(50),
    height: scaleSize(80),
  },
  btnView: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  list: {
    maxHeight: (scaleSize(80) + 1) * 6, // 最多6条
    backgroundColor: 'transparent',
  },
})

export default class PopSwitchList extends React.Component {
  props: {
    language: String,
    type?: String,
    confirm: () => {},
    cancel: () => {},
    data: Array, // [[], [], []]
    currentPopDatas: Array, // [xxx, yyy, zzz],
  }

  static defaultProps = {
    data: [],
    currentPopDatas: [],
  }

  constructor(props) {
    super(props)

    this.state = {
      currentTabIndex: 0,
      hasNext: props.data.length > 1,
      hasPrevious: false,
      routes: this._getRoutes(),
    }

    this.fingerMenus = [] // 指滑列表关联对象
  }

  setVisible = (visible, cb) => {
    if (this.state.currentTabIndex !== 0) {
      this.setState(
        {
          currentTabIndex: 0,
        },
        () => {
          this.popModal && this.popModal.setVisible(visible, cb)
        },
      )
    } else {
      this.popModal && this.popModal.setVisible(visible, cb)
    }
  }

  renderFingerList = (data = [], index) => {
    return (
      <FingerMenu
        ref={ref => {
          this.fingerMenus[index] = ref
        }}
        key={index}
        tabLabel={index}
        data={data}
        initialKey={
          this.props.currentPopDatas[index] &&
          this.props.currentPopDatas[index].key
        }
      />
    )
  }

  renderContent = () => {
    let views = []
    this.props.data.forEach((subList, index) => {
      if (subList instanceof Array && subList.length > 0) {
        views.push(this.renderFingerList(subList, index))
      }
    })
    return views
  }

  renderBottom = () => {
    return (
      <View style={[styles.btnsView, { width: '100%' }]}>
        <TouchableOpacity
          style={[styles.btnView, { justifyContent: 'flex-start' }]}
          onPress={() => {
            // 上一步
            if (this.state.currentTabIndex > 0) {
              this.setState({
                currentTabIndex: this.state.currentTabIndex - 1,
              })
              return
            }
            this.popModal && this.popModal.setVisible(false)
          }}
        >
          <Text style={styles.btnText}>
            {this.state.currentTabIndex > 0
              ? getLanguage(this.props.language || global.language)
                .Analyst_Labels.PREVIOUS
              : getLanguage(this.props.language || global.language)
                .Analyst_Labels.CANCEL}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnView, { justifyContent: 'flex-end' }]}
          onPress={() => {
            // 下一步
            if (this.state.currentTabIndex < this.props.data.length - 1) {
              this.setState({
                currentTabIndex: this.state.currentTabIndex + 1,
              })
              return
            }
            // 添加
            if (
              this.props.confirm &&
              typeof this.props.confirm === 'function'
            ) {
              let data = []
              this.fingerMenus.forEach(item => {
                let curData = item && item.getCurrentData()
                data.push(curData.data)
              })
              this.props.confirm(data)
            }
          }}
        >
          <Text style={styles.btnText}>
            {this.state.currentTabIndex < this.props.data.length - 1
              ? getLanguage(this.props.language || global.language)
                .Analyst_Labels.NEXT
              : getLanguage(this.props.language || global.language)
                .Analyst_Labels.ADD}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _getRoutes = () => {
    const routes = []
    this.props.data.forEach((item, index) => {
      routes.push({
        key: index + '',
        title: index + '',
      })
    })
    return routes
  }

  goToPage = index => {
    this.state.currentTabIndex !== index &&
    this.setState({
      currentTabIndex: index,
    })
  }

  renderScene = (() => {
    const data = {}
    this.props.data.map((item, index) => {
      data[index + ''] = () => this.renderFingerList(item, index)
    })
    return SceneMap(data)
  })()

  render() {
    return (
      <PopView
        ref={ref => (this.popModal = ref)}
        contentStyle={{ height: scaleSize(80) * 6 }}
      >
        <TabView
          lazy
          navigationState={{
            index: this.state.currentTabIndex,
            routes: this.state.routes,
          }}
          onIndexChange={this.goToPage}
          renderTabBar={() => null}
          renderScene={this.renderScene}
          swipeEnabled={true}
          tabBarPosition={'bottom'}
        />
        {this.renderBottom()}
      </PopView>
    )
  }
}
