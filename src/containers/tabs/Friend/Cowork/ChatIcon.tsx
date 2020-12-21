import React, { Component } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { MTBtn } from '../../../../components'
import { scaleSize } from '../../../../utils'
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
  language: String,
  navigation: Object,
}

class ChatIcon extends Component<Props, {}> {

  left: Animated.Value
  visible: boolean

  constructor(props: Props) {
    super(props)
    this.left = new Animated.Value(scaleSize(20))
    this.visible = true
  }

  setVisible = (visible: boolean) => {
    if (visible !== this.visible) {
      Animated.timing(this.left, {
        toValue: visible ? scaleSize(20) : -500,
        duration: 300,
      }).start()
      this.visible = visible
    }
  }

  action = () => {
    let param: any = {}
    if (CoworkInfo.coworkId !== '') {
      param.targetId = CoworkInfo.talkId
    }
    NavigationService.navigate('Chat', param)
  }

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          right: this.left,
          bottom: scaleSize(140),
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
  newMessage: state.chat.toJS().coworkNewMessage,
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
