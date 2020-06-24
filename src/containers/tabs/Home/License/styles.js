import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  item: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  title: {
    fontSize: scaleSize(24),
    marginLeft: 15,
  },
  activeButton: {
    alignSelf: 'center',
    width: '94%',
    height: scaleSize(60),
    marginVertical: scaleSize(60),
  },
  moduleItem: {
    width: '100%',
    height: scaleSize(80),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleImageView: {
    height: scaleSize(80),
    width: scaleSize(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleImage: {
    height: scaleSize(55),
    width: scaleSize(55),
  },
  moduleText: {
    fontSize: scaleSize(20),
  },
  moduleTitle: {
    backgroundColor: 'white',
    paddingLeft: 20,
  },
  moduleTitleText: {
    fontSize: scaleSize(26),
  },

  //privatecloud
  addressView: {
    width: '100%',
    alignItems: 'center',
    paddingTop: scaleSize(150),
  },
  inputBackgroud: {
    width: '75%',
    backgroundColor: '#EFEFEF',
    height: scaleSize(90),
    borderRadius: scaleSize(40),
    paddingHorizontal: scaleSize(10),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleSize(20),
  },
  textInputStyle: {
    width: '100%',
    height: scaleSize(80),
    fontSize: scaleSize(26),
    borderBottomColor: color.borderLight,
    color: 'black',
    marginTop: 10,
    textAlign: 'center',
  },
  connectStyle: {
    height: scaleSize(60),
    width: '50%',
    backgroundColor: color.itemColorBlack,
    marginTop: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: color.fontColorGray,
    fontSize: scaleSize(23),
    textAlign: 'center',
  },
})
