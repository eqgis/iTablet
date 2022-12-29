import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color, size } from '../../styles'

export default StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  list: {
    paddingHorizontal: scaleSize(40),
  },
  
  // item
  itemView: {
    flex: 1,
    flexDirection: 'column',
    margin: scaleSize(10),
    borderRadius: scaleSize(20),
    backgroundColor: 'white',
    // overflow: 'hidden',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: color.colorEF,
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  itemBottom: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: color.white,
    paddingVertical: scaleSize(16),
    paddingHorizontal: scaleSize(20),
    borderBottomRightRadius: scaleSize(20),
    borderBottomLeftRadius: scaleSize(20),
  },
  itemBottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.white,
    marginTop: scaleSize(14),
  },
  sizeText: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.gray,
    backgroundColor: 'transparent',
  },
  itemName: {
    color: color.black,
    fontSize: size.fontSize.fontSizeMd,
    maxWidth: scaleSize(300),
    marginTop: scaleSize(14),
    backgroundColor: 'transparent',
  },
  itemImageView: {
    width: '100%',
    height: scaleSize(204),
    borderTopRightRadius: scaleSize(20),
    borderTopLeftRadius: scaleSize(20),
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  itemImage: {
    flex: 1,
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
  downloadImg: {
    height: scaleSize(44),
    width: scaleSize(44),
  },
})
