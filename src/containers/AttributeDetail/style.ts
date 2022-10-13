import { AppStyle } from "@/utils";
import { dp } from "imobile_for_reactnative/utils/size";
import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  containerP: {
    borderTopLeftRadius: dp(20),
    borderTopRightRadius: dp(20),
    paddingTop: dp(20),
  },
  itemView: {
    flexDirection: 'column',
  },
  subItemView: {
    flexDirection: 'row',
    height: dp(40),
    alignItems: 'center',
    paddingHorizontal: dp(20),
  },
  subItemLeftView: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: dp(20),
  },
  subItemRightView: {
    flex: 2,
    alignItems: 'center',
  },
  header: {
    height: dp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...AppStyle.h1,
  },
  titleText: {
    width: '100%',
    fontSize: dp(18),
    color: AppStyle.Color.BLACK,
    textAlign: 'left',
  },
  valueText: {
    width: '100%',
    fontSize: dp(14),
    color: AppStyle.Color.Text_Tool,
    textAlign: 'right',
  },
  inputStyle: {
    width: '100%',
    fontSize: dp(14),
    color: AppStyle.Color.Text_Tool,
    textAlign: 'right',
  },
})

export default styles