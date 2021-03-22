import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../utils'

export default StyleSheet.create({
  dot: {
    backgroundColor: '#BBBBBB',
    width: 5,
    height: 5,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#464646',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: setSpText(64),
    color: '#535353',
    marginTop: -scaleSize(42),
  },
  subTitle: {
    fontSize: setSpText(32),
    color: '#535353',
    marginTop: scaleSize(22),
  },
  image: {
    width: scaleSize(700),
    height: scaleSize(700),
    marginTop: scaleSize(42),
  },
})
