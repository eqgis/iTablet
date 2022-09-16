import { MTBtn } from '@/components'
import { getImage } from '../../../assets'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { scaleSize } from '@/utils'
import NavigationService from '@/containers/NavigationService'
import CheckAction from '../CheckAction'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    width: '100%',
    // height: scaleSize(240),
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingRight: scaleSize(20)
  },
  btn: {
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
    width: scaleSize(100),
    height: scaleSize(100),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: scaleSize(5),
  },
  btnImg: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  btnText: {
    width: scaleSize(90),
    textAlign: 'center',
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
      </View>
    )
  }
}