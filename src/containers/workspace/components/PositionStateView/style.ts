import { dp } from "imobile_for_reactnative/utils/size";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: dp(65),
    left: dp(10),
    width: dp(200),
    height: dp(24),
    borderRadius: dp(8),
    backgroundColor: "rgba(255, 255, 255, .7)",
    // elevation: 20,
    // shadowOffset: { width: 0, height: 0 },
    // shadowColor: 'black',
    // shadowOpacity: 1,
    // shadowRadius: 2,
    // justifyContent: 'flex-end',
    alignItems: 'center',
    // overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: dp(5),
  },
  containerHiden: {
    top: dp(-30),
  },
  text: {
    fontSize: dp(10),
    // backgroundColor: 'transparent',
    // backgroundColor: "rgba(255, 255, 255, .4)",
    borderRadius: dp(4),
    paddingHorizontal: dp(2),
    color: '#333',
    textAlign: 'left',
    lineHeight: dp(20),
  },
  image: {
    width: dp(18),
    height: dp(18),
    marginRight: dp(3),
  },
  itemStyle: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height:'100%',
  },
})

export default styles