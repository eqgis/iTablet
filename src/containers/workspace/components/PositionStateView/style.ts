import { dp } from "imobile_for_reactnative/utils/size";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: dp(65),
    left: dp(10),
    width: dp(200),
    height: dp(18),
    borderRadius: dp(4),
    backgroundColor: "rgba(255, 255, 255, .0)",
    // elevation: 20,
    // shadowOffset: { width: 0, height: 0 },
    // shadowColor: 'black',
    // shadowOpacity: 1,
    // shadowRadius: 2,
    // justifyContent: 'flex-end',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  text: {
    fontSize: dp(10),
    // backgroundColor: 'transparent',
    backgroundColor: "rgba(255, 255, 255, .4)",
    borderRadius: dp(4),
    paddingHorizontal: dp(2),
    color: '#ef0000',
    textAlign: 'left',
    lineHeight: dp(20),
  },
})

export default styles