import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    width: '100%',
  },
  headerBtnTitle: {
    color: color.fontColorBlack,
    fontSize: 17,
  },
  btns: {
    height: scaleSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(150),
    alignItems: 'center',
    marginVertical: scaleSize(30),
    backgroundColor: '#rgba(255, 255, 255, 0.5)',
  },
})
