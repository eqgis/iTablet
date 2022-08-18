
import { dp } from '@/utils'
import { WIDTH } from '@/utils/constUtil'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: dp(200),
    height: dp(150),
    backgroundColor: 'rgba(0,0,0,.5)',
    top: dp(90),
    left: dp(10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    // borderColor: '#fff',
    // borderWidth: dp(1),
  },
  textStyle: {
    color: '#fff',
    fontSize: dp(14),
    textAlign: 'center',
    justifyContent: 'center',
  },
  row: {
    width: dp(200),
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  col: {
    flex: 1,
    borderColor: '#fff',
    borderWidth: dp(1),
    justifyContent: 'center',
    alignContent: 'center',
  }
})

export default styles