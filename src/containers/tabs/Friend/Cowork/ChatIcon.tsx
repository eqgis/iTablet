import React, { Component } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { MTBtn } from '../../../../components'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'
import { connect } from 'react-redux'
import CoworkInfo from '../Cowork/CoworkInfo'

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
    width: scaleSize(64),
    height: scaleSize(64),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnImg: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  shadow: {
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
})

interface Props {
  device: any,
}

class ChatIcon extends Component<Props, {}> {

  right: Animated.Value
  bottom: Animated.Value
  visible: boolean

  constructor(props: Props) {
    super(props)
    this.right = new Animated.Value(this.getRightDistance())
    this.bottom = new Animated.Value(this.getBottomDistance())
    this.visible = true
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device)
    )
  }

  componentDidUpdate(prevProps: Props) {
    // 切换用户，重新加载用户配置文件
    if (prevProps.device.orientation !== this.props.device.orientation && this.visible) {
      Animated.parallel([
        Animated.timing(this.right, {
          toValue: this.getRightDistance(),
          duration: 300,
        }),
        Animated.timing(this.bottom, {
          toValue: this.getBottomDistance(),
          duration: 300,
        }),
      ]).start()
    }
  }

  setVisible = (visible: boolean) => {
    if (visible !== this.visible) {
      Animated.parallel([
        Animated.timing(this.right, {
          toValue: visible ? this.getRightDistance() : -500,
          duration: 300,
        }),
        Animated.timing(this.bottom, {
          toValue: this.getBottomDistance(),
          duration: 300,
        }),
      ]).start()
      this.visible = visible
    }
  }

  getRightDistance = () => {
    let distance
    if (this.props.device.orientation.indexOf('PORTRAIT') >= 0) {
      distance = scaleSize(20)
    } else {
      distance = scaleSize(116)
    }
    return distance
  }

  getBottomDistance = () => {
    let distance
    if (this.props.device.orientation.indexOf('PORTRAIT') >= 0) {
      distance = scaleSize(135)
    } else {
      distance = scaleSize(26)
    }
    return distance
  }

  action = () => {
    let param: any = {}
    if (CoworkInfo.coworkId !== '') {
      param.targetId = CoworkInfo.talkId
      param.title = getLanguage(GLOBAL.language).Friends.GROUPS
    }
    NavigationService.navigate('Chat', param)
  }

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          right: this.right,
          bottom: this.bottom,
        }}
      >
        <MTBtn
          style={[styles.btn, styles.shadow]}
          imageStyle={styles.btnImg}
          key={'controller_minus'}
          textColor={'black'}
          size={MTBtn.Size.NORMAL}
          image={getThemeAssets().find.forum}
          onPress={this.action}
        />
      </Animated.View>
    )
  }
}

const mapStateToProps = (state: any) => ({
  device: state.device.toJS().device,
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true,
  },
)(ChatIcon)
