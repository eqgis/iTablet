import * as React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { FingerMenu } from '../../components'
import { Height } from '../../constants'
import { scaleSize } from '../../utils'
import { size, color } from '../../styles'
import { getLanguage } from '../../language'

const styles = StyleSheet.create({
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
  linkView: {
    flex: 1,
    // height: scaleSize(300),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  list: {
    maxHeight: Height.TABLE_ROW_HEIGHT_1 * 6, // 最多6条
    // backgroundColor: 'transparent',
  },
  popView: {
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: color.bgW,
  },
})

export default class SinglePicker extends React.Component {
  props: {
    language: String,
    confirm: () => {},
    cancel: () => {},
    popData: Array,
    initialKey: String,
    viewableItems?: number,
  }

  constructor(props) {
    super(props)

    this.currentFirstData =
      this.props.popData &&
      this.props.popData.length > 0 &&
      this.props.popData[0]
    this.update = false
    this.selectItem = this.currentFirstData // 默认选中数据
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.popData) !==
        JSON.stringify(nextProps.popData) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  setVisible = (visible, cb) => {
    if (visible === undefined) {
      visible = !this.state.visible
    } else if (visible === this.state.visible) {
      return
    }
    this.setState(
      {
        visible: visible,
      },
      () => {
        if (cb && typeof cb === 'function') {
          cb()
        }
      },
    )
  }

  renderLinkList = () => {
    return (
      <View style={styles.linkView}>
        <FingerMenu
          style={{ flex: 1, width: '50%' }}
          ref={ref => (this.firstMenu = ref)}
          data={this.props.popData}
          initialKey={this.props.initialKey}
          onScroll={item => {
            this.selectItem = item
            this.update = true
          }}
          onSelect={item => {
            this.selectItem = item
            this.update = true
          }}
          viewableItems={this.props.viewableItems}
        />
      </View>
    )
  }

  renderBottom = () => {
    return (
      <View style={[styles.btnsView, { width: '100%' }]}>
        <TouchableOpacity
          style={[styles.btnView, { justifyContent: 'flex-start' }]}
          onPress={() => {
            if (this.props.cancel && typeof this.props.cancel === 'function') {
              this.props.cancel()
            }
          }}
        >
          <Text style={styles.btnText}>
            {
              getLanguage(this.props.language || global.language).Analyst_Labels
                .CANCEL
            }
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnView, { justifyContent: 'flex-end' }]}
          onPress={() => {
            if (
              this.props.confirm &&
              typeof this.props.confirm === 'function'
            ) {
              this.props.confirm(this.selectItem)
            }
          }}
        >
          <Text style={styles.btnText}>
            {
              getLanguage(this.props.language || global.language).Analyst_Labels
                .CONFIRM
            }
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View
        style={[
          styles.popView,
          this.props.viewableItems > 0 && {
            height: (this.props.viewableItems + 1) * Height.TABLE_ROW_HEIGHT_1,
          },
        ]}
      >
        {this.renderBottom()}
        {this.renderLinkList()}
      </View>
    )
  }
}
