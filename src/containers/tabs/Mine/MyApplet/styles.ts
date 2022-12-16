import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'

const styles = StyleSheet.create({
  bottomStyle: {
    height: scaleSize(80),
    paddingHorizontal: scaleSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#A0A0A0',
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  bottomItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default styles
