import * as React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import Header from '../../../../components/Header'

import { scaleSize, screen } from '../../../../utils'
import { getLanguage } from '../../../../language'
import HardwareBackHandler from '../../../../components/HardwareBackHandler'

export default class IncrementRoadView extends React.Component {
  props: {
    headerProps: Object,
    isRight: Boolean,
    onClick: () => {},
  }

  constructor(props) {
    super(props)
  }

  onBack = () => {
    if(this.props.headerProps.backAction) {
      this.props.headerProps.backAction()
    }
    return true
  }

  render() {
    let right, rightTxt
    let left, leftTxt
    if (this.props.isRight) {
      right = {
        backgroundColor: '#4680df',
      }
      rightTxt = {
        color: 'white',
      }
    } else {
      left = {
        backgroundColor: '#4680df',
      }
      leftTxt = {
        color: 'white',
      }
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <HardwareBackHandler onBackPress={this.onBack}/>
        <Header {...this.props.headerProps} />
        <View style={[styles.table, { marginTop: screen.getHeaderHeight() }]}>
          <TouchableOpacity
            style={[styles.button, left]}
            onPress={() => {
              this.props.onClick(false)
            }}
          >
            <Text style={[styles.text, leftTxt]}>
              {getLanguage(global.language).Map_Main_Menu.TRACK}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, right]}
            onPress={() => {
              this.props.onClick(true)
            }}
          >
            <Text style={[styles.text, rightTxt]}>
              {getLanguage(global.language).Map_Main_Menu.HAND_PAINTED}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: scaleSize(60),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    position: 'absolute',
    width: '100%',
    height: scaleSize(60),
    backgroundColor: '#EEEEEE',
    // alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: scaleSize(26),
    color: 'black',
  },
})
