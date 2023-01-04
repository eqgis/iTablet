import { color, size } from '@/styles'
import { dp } from 'imobile_for_reactnative/utils/size'
import { StyleSheet } from 'react-native'

const IMAGE_SIZE = dp(100)

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBtnTitle: {
    color: color.fontColorBlack,
    fontSize: size.fontSize.fontSizeXl,
  },
  tableView: {
    padding: dp(5),
    paddingVertical: dp(10),
  },
  tableCellView: {
    // flex: 1,
    height: IMAGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableRowStyle: {
    height: IMAGE_SIZE,
  },

  popBtn: {
    height: dp(80),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: color.bgG,
  },
  popText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

  // 图片Item
  plusImageView: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    // borderRadius: dp(8),
    borderWidth: 1,
    borderColor: color.borderLight,
    backgroundColor: 'transparent',
  },
  imageView: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    // borderRadius: dp(8),
    backgroundColor: 'transparent',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    // borderRadius: dp(8),
    backgroundColor: 'transparent',
  },
  deleteOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(255, 255, 255, 0.3)',
    // borderRadius: dp(8),
  },
  deleteView: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: dp(40),
    width: dp(40),
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  deleteImg: {
    // flex: 1,
    backgroundColor: 'transparent',
    height: dp(30),
    width: dp(30),
  },
  duration: {
    position: 'absolute',
    bottom: dp(8),
    right: dp(8),
    color: 'white',
    fontSize: 14,
  },
  title: {
    color: color.itemColorBlack,
    fontSize: size.fontSize.fontSizeXl,
    marginLeft: dp(30),
  },
  itemView: {
    flexDirection: 'row',
    height: dp(90),
    alignItems: 'center',
    marginHorizontal: dp(30),
  },
  locationImg: {
    width: dp(44),
    height: dp(44),
    marginLeft: dp(30),
  },
  locationTitle: {
    color: color.contentColorGray,
    fontSize: size.fontSize.fontSizeXl,
    marginLeft: dp(10),
  },

  progressView: {
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
})
