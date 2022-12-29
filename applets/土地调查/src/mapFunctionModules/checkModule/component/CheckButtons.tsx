import { MTBtn } from '@/components'
import { getImage } from '../../../assets'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '@/utils'
import CheckAction from '../CheckAction'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
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