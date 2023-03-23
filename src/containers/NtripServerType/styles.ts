/** 外部设备页面的样式文件 */
import { scaleSize } from "@/utils"
import { dp } from "imobile_for_reactnative/utils/size"
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContentView: {
    width: '100%',
    flexDirection: 'column',
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(30),
    marginLeft: scaleSize(60),
    height:dp(50),
    // backgroundColor: '#fff',
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: dp(1),
  },
  text: {
    fontSize: scaleSize(28),
    color: '#333',
  },
  image: {
    height: dp(30),
    width: dp(30),
  },
  headerRightText: {
    fontSize: dp(16),
  },
  seperator: {
    height: dp(5),
    backgroundColor: '#f9f9f9',
    // marginTop: dp(10),
  },

})

export default styles

