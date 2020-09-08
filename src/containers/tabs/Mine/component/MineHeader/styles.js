import { StyleSheet, Platform } from 'react-native'
import { scaleSize, screen, fixedSize } from '../../../../../utils'
import { size, color } from '../../../../../styles'

export { screen, color }
export default StyleSheet.create({
  // profile
  profileContainerP: {
    backgroundColor: color.white,
    flexDirection: 'column',
    width: '100%',
    height: scaleSize(496),
    paddingBottom: scaleSize(40),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainerBgP: {
    backgroundColor: color.white,
    width: '100%',
    height: scaleSize(440),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainerL: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingBottom: scaleSize(50),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainerBgL: {
    marginHorizontal: scaleSize(90),
    flexDirection: 'row',
    backgroundColor: color.white,
    height: scaleSize(240),
    paddingHorizontal: scaleSize(44),
    paddingVertical: scaleSize(40),
  },
  // Myprofile
  MyProfileStyleP: {
    alignItems: 'center',
  },
  MyProfileStyleL: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  profileAvatarStyleP: {
    marginTop: scaleSize(78),
    height: scaleSize(160),
    width: scaleSize(160),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(80),
  },
  profileAvatarStyleL: {
    height: scaleSize(160),
    width: scaleSize(160),
    backgroundColor: '#FFFFFF',
    borderRadius: scaleSize(80),
  },
  headImgStyle: {
    height: scaleSize(160),
    width: scaleSize(160),
    borderRadius: scaleSize(80),
  },
  profileTextStyleP: {
    alignItems: 'center',
  },
  profileTextStyleL: {
    alignItems: 'flex-start',
  },
  userNameStyle: {
    marginTop: fixedSize(8),
    fontSize: fixedSize(40),
    color: color.content,
  },
  statusTextStyle: {
    fontSize: fixedSize(24),
    color: '#C2C2C2',
  },
  // search
  searchContainerL: {
    position: 'absolute',
    flexDirection: 'column',
    height: scaleSize(80),
    justifyContent: 'flex-end',
    bottom: scaleSize(10),
    right: scaleSize(130),
  },
  searchViewStyleP: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    marginLeft: -fixedSize(230),
    right: 0,
    width: fixedSize(460),
    height: scaleSize(80),
    backgroundColor: color.white,
    borderRadius: scaleSize(40),
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#eee',
        shadowOpacity: 1,
        shadowRadius: 2,
      },
    }),
  },
  searchViewStyleL: {
    width: '100%',
    height: scaleSize(80),
    backgroundColor: color.white,
    borderRadius: scaleSize(40),
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#eee',
        shadowOpacity: 1,
        shadowRadius: 2,
      },
    }),
  },
  searchImgStyle: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  searchInputStyle: {
    width: fixedSize(380),
    paddingVertical: 0,
    fontSize: fixedSize(20),
    color: '#A7A7A7',
  },
  // side
  sideItemStyle: {
    position: 'absolute',
    right: 0,
    top: scaleSize(40),
    backgroundColor: '#ED372E',
    paddingVertical: fixedSize(10),
    paddingHorizontal: fixedSize(20),
    borderTopLeftRadius: fixedSize(20),
    borderBottomLeftRadius: fixedSize(20),
  },
  SideTextStyle: {
    fontSize: fixedSize(20),
    color: '#FFFFFF',
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
