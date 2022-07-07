import { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { dp } from '../utils'
import color from './color'

export const Image_Style: ImageStyle = {
  width: dp(25),
  height: dp(25),
}

export const Image_Style_Small: ImageStyle = {
  width: dp(18),
  height: dp(18),
}

// ********* 文字风格 *********
// 从大到小: h1, h2, h3, h4....
// 后缀含义：
// c: center中心排列；
// g: gray，灰色字体；

export const h1: TextStyle = {
  fontSize: dp(18),
  color: color.BLACK,
}

export const h2: TextStyle = {
  fontSize: dp(14),
  color: color.BLACK,
}

export const h3: TextStyle = {
  fontSize: dp(12),
  color: color.BLACK,
}

/** h2 gray */
export const h2g: TextStyle = {
  ...h2,
  color: color.GRAY,
}

/** h2 center */
export const h2c: TextStyle = {
  ...h2,
  textAlign: 'center',
}

/** @deprecated 使用 AppStyle.h2 */
export const Text_Style: TextStyle = h2

/** @deprecated 使用 AppStyle.h3 */
export const Text_Style_Small: TextStyle = h3

/** @deprecated 使用 AppStyle.h2c */
export const Text_Style_Center: TextStyle = h2c

/** @deprecated */
export const Text_Style_Small_Center: TextStyle = {
  ...h3,
  textAlign: 'center',
  fontSize: dp(10),
}

/** 悬浮风格 */
export const FloatStyle: ViewStyle = {
  elevation: 3,
  shadowOffset: { width: 0, height: 0 },
  shadowColor: '#eee',
  shadowOpacity: 1,
  shadowRadius: 2,
}

/** 分割线风格 */
export const SeperatorStyle: ViewStyle ={
  width: '100%',
  height: dp(1),
  backgroundColor: color.Seperator,
}

/** list item 通用风格 */
export const ListItemStyle: ViewStyle = {
  height: dp(46),
  marginLeft: dp(20),
  paddingRight: dp(16),
  borderBottomColor: color.Seperator,
  borderBottomWidth: dp(1),
  flexDirection: 'row',
  alignItems: 'center',
}

/** list item 通用风格, 无分割线 */
export const ListItemStyleNS: ViewStyle = {
  height: dp(47),
  marginLeft: dp(20),
  paddingRight: dp(16),
  flexDirection: 'row',
  alignItems: 'center',
}

/** Button 组件风格 */
export const ButtonStyle: ViewStyle = {
  height: dp(45),
  minWidth: dp(60),
  backgroundColor: color.Button_Dark,
  borderColor: color.Button_Dark,
  borderWidth: dp(1),
  borderRadius: dp(15),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: dp(10),
  alignSelf: 'center',
}

/** Button 组件文字风格 */
export const ButtonTextStyle: TextStyle = {
  textAlign: 'center',
  fontSize: dp(12),
  color: color.WHITE,
  marginHorizontal: dp(5),
}

/** Button 组件图片风格 */
export const ButtomImageStyle: ImageStyle = {
  width: dp(25),
  height: dp(25),
  marginHorizontal: dp(5),
}

/** 输入框背景风格 */
export const inputBackgroud: ViewStyle = {
  backgroundColor: color.Background_Container,
  width: '100%',
  height: dp(50),
  borderRadius: dp(40),
  paddingHorizontal: dp(10),
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: dp(20),
}

/** 输入框文字风格 */
export const textInputStyle: TextStyle =  {
  width: '100%',
  fontSize: dp(16),
  color: color.Text_Input,
  textAlign: 'center',
}
