/** 外部设备页面的样式文件 */
import { dp } from "imobile_for_reactnative/utils/size"
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dp(10),
    height:dp(50),
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: dp(10),
    marginVertical: dp(25),
  },
  searchText: {
    fontSize: dp(16),
    marginHorizontal: dp(10),
  },
  text: {
    fontSize: dp(16),
  },
  image: {
    height: dp(30),
    width: dp(30),
  },
  seperator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  headerRightText: {
    fontSize: dp(16),
  },

})

export default styles

