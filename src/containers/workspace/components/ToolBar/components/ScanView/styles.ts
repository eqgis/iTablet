import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../../../utils'

export default StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayPreviewLeft: {
    position: 'absolute',
    width: scaleSize(60),
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
  },
  overlayPreviewTop: {
    position: 'absolute',
    height: scaleSize(145),
    top: 0,
    left: scaleSize(60),
    right: scaleSize(60),
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
  },
  overlayPreviewRight: {
    position: 'absolute',
    height: '100%',
    width: scaleSize(60),
    top: 0,
    right: 0,
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
  },
  overlayPreviewBottom: {
    position: 'absolute',
    height: scaleSize(600),
    bottom: 0,
    left: scaleSize(60),
    right: scaleSize(60),
    backgroundColor: '#rgba(45, 45, 47, 0.7)',
  },
})
