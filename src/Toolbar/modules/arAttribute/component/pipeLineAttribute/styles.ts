
import { dp } from '@/utils'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: dp(220),
    height: dp(135),
    top: dp(90),
    left: dp(10),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderColor: '#007AFF' ,
    borderWidth: dp(1),
    borderRadius: dp(15),
    overflow: 'hidden',
  },
  textStyle: {
    color: '#fff',
    fontSize: dp(14),
    textAlign: 'center',
    justifyContent: 'center',
  },
  row: {
    width: dp(220),
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  colLeft: {
    flex: 2,
    borderColor: 'rgba(255, 255, 255, .1)',
    backgroundColor: 'rgba(0, 45, 99, 0.8)',
    paddingHorizontal: dp(3),
    borderWidth: dp(1),
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: -dp(1),
    marginLeft: -dp(1),
  },
  colRight: {
    flex: 3,
    borderColor: 'rgba(255, 255, 255, .1)',
    backgroundColor: 'rgba(0, 45, 99, 0.7)',
    borderWidth: dp(1),
    paddingHorizontal: dp(3),
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: -dp(1),
    marginLeft: -dp(1),
  }
})

export default styles
