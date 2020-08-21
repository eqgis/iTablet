import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color, size } from '../../styles'

export default StyleSheet.create({
  container: {
    backgroundColor: '#FBFBFB',
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    backgroundColor: '#505050',
    paddingLeft: scaleSize(20),
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    backgroundColor: '#FBFBFB',
    paddingLeft: scaleSize(70),
    paddingRight: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selection: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  sectionsTitle: {
    color: '#FBFBFB',
    fontSize: setSpText(26),
    marginLeft: scaleSize(25),
  },
  
  
  // item
  itemView: {
    flex: 1,
    margin: scaleSize(10),
    borderRadius: scaleSize(8),
  },
  itemNameView: {
    position: 'absolute',
    top: scaleSize(8),
    left: scaleSize(8),
    paddingHorizontal: scaleSize(8),
    paddingVertical: scaleSize(4),
    // height: scaleSize(40),
    borderRadius: scaleSize(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(0,0,0,0.5)',
  },
  itemName: {
    color: color.white,
    fontSize: size.fontSize.fontSizeMd,
    maxWidth: scaleSize(300),
  },
  itemBg: {
    width: scaleSize(400),
    height: scaleSize(400),
    borderRadius: scaleSize(8),
  },
  progress: {
    // flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderRadius: scaleSize(22),
  },
  itemDownloadView: {
    position: 'absolute',
    right: scaleSize(8),
    bottom: scaleSize(8),
    height: scaleSize(44),
    // width: scaleSize(44),
    // paddingHorizontal: scaleSize(22),
    borderRadius: scaleSize(22),
    backgroundColor: '#rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemDownloadedView: {
    backgroundColor: color.item_selected_bg,
  },
  itemDownload: {
    marginLeft: scaleSize(10),
    marginRight: scaleSize(22),
    height: scaleSize(36),
    width: scaleSize(36),
  },
})
