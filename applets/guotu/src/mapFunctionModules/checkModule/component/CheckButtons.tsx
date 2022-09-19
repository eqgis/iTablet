import { MTBtn } from '@/components'
import { getImage } from '../../../assets'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '@/utils'
import NavigationService from '@/containers/NavigationService'
import CheckAction from '../CheckAction'
import { size } from '@/styles'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    // height: scaleSize(240),
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingRight: scaleSize(20)
  },
  // topView: {
  //   flex: 1,
  //   // backgroundColor: 'transparent',
  //   backgroundColor: '#rgba(255, 0, 0, 0.8)',
  //   flexDirection: 'column',
  //   // height: scaleSize(240),
  //   // justifyContent: 'space-around',
  //   alignItems: 'flex-end',
  //   paddingRight: scaleSize(20),
  //   paddingTop: scaleSize(100),
  // },
  bottomView: {
    // backgroundColor: 'transparent',
    backgroundColor: '#rgba(0, 255, 0, 0.8)',
    flexDirection: 'column',
    width: '100%',
    height: scaleSize(300),
    // height: scaleSize(240),
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingRight: scaleSize(20)
  },
  btn: {
    backgroundColor: '#rgba(255, 255, 255, 0.8)',
    borderRadius: scaleSize(8),
    width: scaleSize(74),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: scaleSize(8),
  },
  btnImg: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  btnText: {
    width: scaleSize(70),
    textAlign: 'center',
    fontSize: setSpText(14),
  },
})

interface Props {

}

export default class CheckButtons extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <View
        style={styles.container}
        pointerEvents='box-none'
      >
        {/* <View
          style={styles.topView}
          pointerEvents='box-none'
        >
          <MTBtn
            key={'change_layer'}
            image={getImage().layer}
            style={styles.btn}
            imageStyle={styles.btnImg}
            textStyle={styles.btnText}
            title={'切换图层'}
            onPress={async() => {
              // 切换图层
              NavigationService.navigate('ChooseLayer')
            }}
          />
        </View>
        <View
          style={styles.bottomView}
          pointerEvents='box-none'
        > */}
          <MTBtn
            key={'add_land'}
            image={getImage().add}
            style={styles.btn}
            imageStyle={styles.btnImg}
            textStyle={styles.btnText}
            title={'新增地块'}
            onPress={async() => {
              // 新增地块
              CheckAction.addRegion()
            }}
          />
          <MTBtn
            key={'edit_land'}
            image={getImage().edit}
            style={styles.btn}
            imageStyle={styles.btnImg}
            textStyle={styles.btnText}
            title={'地块调整'}
            onPress={async() => {
              // 地块调整
              CheckAction.startCheck()
            }}
          />
        {/* </View> */}
      </View>
    )
  }
}