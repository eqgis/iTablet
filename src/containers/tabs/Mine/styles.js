import { StyleSheet, Platform } from 'react-native'
import { scaleSize, screen, fixedSize } from '../../../utils'
import { size, color } from '../../../styles'

export { screen, color }
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  // new
  mineContainer: {
    flex: 1,
    backgroundColor: color.white,
    justifyContent: 'space-between',
  },

  // datas
  datasContainer: {
    flex: 1,
    backgroundColor: color.white,
  },
  scrollContentStyleP: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: scaleSize(20),
  },
  scrollContentStyleL: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: scaleSize(70),
  },
  itemView: {
    marginVertical: scaleSize(25),
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  itemImg: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  itemText: {
    marginTop: scaleSize(9),
    textAlign: 'center',
    fontSize: scaleSize(24),
    color: color.fontColorGray2,
  },

  logoView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoImagStyle: {
    width: fixedSize(100),
    height: fixedSize(100),
    marginTop: fixedSize(20),
    marginHorizontal: fixedSize(10),
  },
})
