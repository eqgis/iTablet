import { dp } from 'imobile_for_reactnative/utils/size'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  textContainer: {
    position: 'absolute',
    // bottom: 0,
    top: dp(30),
    left: dp(55),
    width: '100%',
    height: dp(20),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textstyle:{
    color:"#fff",
    fontSize: dp(8),
    textShadowOffset:{
      width:dp(1),
      height:dp(1),
    },
    textShadowRadius:dp(1),
    textShadowColor:'#000'
  },
})
