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
    // backgroundColor: '#f00',
    // borderBottomColor: 'rgba(0,0,0,0.05)',
    // borderBottomWidth: dp(1),
  },
  textTitle: {
    fontSize: dp(16),
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
  itemSeperator: {
    width: '100%',
    height: dp(1),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemSeperatorLine: {
    // width: '90%',
    // width:'100%',
    flex:1,
    height: dp(1),
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: scaleSize(115),
    marginRight: scaleSize(30),
  },
  switch: {
    marginRight: dp(-3),
  },

})

export default styles

