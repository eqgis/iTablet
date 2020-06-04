import { StyleSheet } from 'react-native'
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
  header: {
    // flex: 1,
    flexDirection: 'row',
    height: scaleSize(300),
  },
  avatarView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: scaleSize(160),
    width: scaleSize(160),
  },
  headerContent: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: scaleSize(300),
  },
  labelView: {
    flex: 1,
    height: scaleSize(80),
    marginHorizontal: scaleSize(30),
    justifyContent: 'center',
  },
  label: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
  },

  // new
  mineContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    justifyContent: 'space-between',
  },
  // profile
  profileContainer: {
    backgroundColor: '#303030',
    width: '100%',
    height: '43%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: fixedSize(30),
  },
  // Myprofile
  MyProfileStyle: {
    marginVertical: fixedSize(20),
    alignItems: 'center',
  },
  profileImages: {
    flex: 1,
    backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileHeadStyle: {
    alignItems: 'center',
    marginBottom: -fixedSize(30),
    height: fixedSize(190),
  },
  profileAvatarStyle: {
    height: fixedSize(140),
    width: fixedSize(140),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: fixedSize(70),
  },
  headImgStyle: {
    height: fixedSize(130),
    width: fixedSize(130),
    borderRadius: fixedSize(65),
  },
  moreViewStyle: {
    height: fixedSize(50),
    width: fixedSize(50),
    borderRadius: fixedSize(50),
    backgroundColor: '#4680DF',
    top: -fixedSize(30),
    borderColor: '#FFFFFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreX: {
    backgroundColor: '#FFFFFF',
    width: fixedSize(30),
    height: fixedSize(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
  },
  moreY: {
    backgroundColor: '#FFFFFF',
    width: fixedSize(3),
    height: fixedSize(30),
    borderRadius: 1,
  },
  profileTextStyle: {
    alignItems: 'center',
  },
  profileTextLandscapeStyle: {
    alignItems: 'flex-start',
    width: fixedSize(300),
    top: -fixedSize(130),
    right: -fixedSize(250),
  },
  userNameStyle: {
    fontSize: fixedSize(40),
    color: '#FFFFFF',
  },
  statusTextStyle: {
    fontSize: fixedSize(24),
    color: '#C2C2C2',
  },
  // search
  searchViewStyle: {
    width: fixedSize(460),
    height: fixedSize(48),
    backgroundColor: '#505050',
    borderRadius: fixedSize(24),
    paddingHorizontal: fixedSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: fixedSize(40),
  },
  searchImgStyle: {
    width: fixedSize(40),
    height: fixedSize(40),
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
    top: fixedSize(20),
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

  // datas
  datasContainer: {
    backgroundColor: color.contentWhite,
    height: '53%',
  },
  scrollContentStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: scaleSize(20),
  },
  itemView: {
    height: scaleSize(120),
    marginVertical: scaleSize(15),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  itemImg: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  itemText: {
    textAlign: 'center',
    fontSize: scaleSize(24),
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
