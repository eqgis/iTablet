import { ImageStyle, Platform, TextStyle, ViewStyle } from "react-native"
import { dp } from "./screen"

export const Color = {
  /** Container 灰白色背景色 */
  Background_Container: '#F6F7F8',
  /** 页面背景，二级背景 */
  Background_Page: '#FFFFFF',
  /** 工具栏白色背景色 */
  Background_Toolbar: '#FAFAFA',
  /** 不可选时的灰色背景色 */
  Background_Disabled: '#CCCCCC',
  /** 选中图标背景 */
  Background_Image_Select: '#F0F0F0',
  /** 灰色背景 */
  Background_Gray: '#E6E6E6',

  /** toolbar 底栏及与底栏相连的 view 的背景色 */
  Toolbar_Bottom: '#FFFFFF',

  /** Button 深色背景 */
  Button_Dark: '#2D2D2D',
  /** Button 删除等警示性背景色 */
  Button_Alert: '#EA532D',
  /** Button 取消背景 */
  Button_Cancel: '#B4B4B4',
  /** Button 灰色背景 */
  Button_Gray: '#505050',

  /** 选中条按钮 */
  Bar_Select: '#171717',
  /** 未选条按钮 */
  Bar_Unselect: '#F6F7F8',
  /** 未选条按钮描边 */
  Bar_Unselect_border: '#EBEBEB',

  /** 首页底栏文字颜色 */
  BottomText: '#707070',
  /** 首页底栏文字选中颜色 */
  BottomTextSelect: '#1B1B1B',
  /** 首页底栏选中时的黑色线段 */
  BottomLineSelect: '#171717',

  /** 一般 tab 选中时的线 */
  Tab_Select_Line: '#222222',
  /** 一般 tab 选中时字体颜色 */
  Tab_Select_Text: '#1B1B1B',
  /** 一般 tab 字体颜色 */
  Tab_Text: '#919191',

  /** 数据集字段类型等 选中时 边框 文字 */
  View_Select: '#141516',
  /** 数据集字段类型等 未选中时 边框 文字 */
  View_Unselect: '#D2D2D2',

  /** 深色文字 */
  Text_Dark: '#1B1B1B',
  /** 浅色文字 */
  Text_Light: '#707070',
  /** 搜索文字 */
  Text_Search: '#CECECE',
  /** 工具栏文字颜色 */
  Text_Tool: '#474748',
  /** 输入文字颜色 */
  Text_Input: '#171717',
  /** 删除等警示性文字颜色 */
  Text_Alert: '#EA532D',

  /** 分割线的灰色 */
  Seperator: '#ECECEC',
  Seperratoe_Light: '#F8F8F8',

  /** 进度条颜色 */
  Progress: '#1296db',

  WHITE: '#FFFFFF',
  BLACK: 'black',
  BLUE: '#1296db',
  GRAY: '#959595',
  LIGHT_WIHTE: '#F6F7F8',
  LIGHT_BLACK: '#171717',
  LIGHT_GRAY: '#EBEBEB',
  LIGHT_GRAY2: '#C0C0C0',
  OVERLAY: 'rgba(105, 105, 105, 0.8)',
}

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
  color: Color.BLACK,
}

export const h2: TextStyle = {
  fontSize: dp(14),
  color: Color.BLACK,
}

export const h3: TextStyle = {
  fontSize: dp(12),
  color: Color.BLACK,
}

export const h3c: TextStyle = {
  ...h3,
  textAlign: 'center'
}

export const h3g: TextStyle = {
  ...h3,
  color: Color.GRAY,
}

/** h2 gray */
export const h2g: TextStyle = {
  ...h2,
  color: Color.GRAY,
}

/** h2 center */
export const h2c: TextStyle = {
  ...h2,
  textAlign: 'center'
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
  fontSize: dp(10)
}

/** 悬浮风格 */
export const FloatStyle: ViewStyle = Platform.select({
  android: {
    elevation: 3
  },
  ios: {
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#eee',
    shadowOpacity: 1,
    shadowRadius: 2,
  }
}) || {}

/** 分割线风格 */
export const SeperatorStyle: ViewStyle ={
  width: '100%',
  height: dp(1),
  backgroundColor: Color.Seperator,
}

/** list item 通用风格 */
export const ListItemStyle: ViewStyle = {
  height: dp(46),
  marginLeft: dp(20),
  paddingRight: dp(16),
  borderBottomColor: Color.Seperator,
  borderBottomWidth: dp(1),
  flexDirection: 'row',
  alignItems: 'center'
}

/** list item 通用风格, 无分割线 */
export const ListItemStyleNS: ViewStyle = {
  height: dp(47),
  marginLeft: dp(20),
  paddingRight: dp(16),
  flexDirection: 'row',
  alignItems: 'center'
}

/** Button 组件风格 */
export const ButtonStyle: ViewStyle = {
  height: dp(45),
  minWidth: dp(60),
  backgroundColor: Color.Button_Dark,
  borderColor: Color.Button_Dark,
  borderWidth: dp(1),
  borderRadius: dp(15),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: dp(10),
  alignSelf: 'center'
}

/** Button 组件文字风格 */
export const ButtonTextStyle: TextStyle = {
  textAlign: 'center',
  fontSize: dp(12),
  color: Color.WHITE,
  marginHorizontal: dp(5)
}

/** Button 组件图片风格 */
export const ButtomImageStyle: ImageStyle = {
  width: dp(25),
  height: dp(25),
  marginHorizontal: dp(5)
}

/** 输入框背景风格 */
export const inputBackgroud: ViewStyle = {
  backgroundColor: Color.Background_Container,
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
  color: Color.Text_Input,
  textAlign: 'center',
}

export const COLORS = [
  '#FFFFFF',
  '#000000',
  '#F0EDE1',
  '#1E477C',
  '#4982BC',
  '#00A1E9',
  '#803000',
  '#BD5747',
  '#36E106',
  '#9CBB58',
  '#8364A1',
  '#4AADC7',
  '#F89746',
  '#E7A700',
  '#E7E300',
  '#D33248',
  '#F1F1F1',
  '#7D7D7D',
  '#DDD9C3',
  '#C9DDF0',
  '#DBE4F3',
  '#BCE8FD',
  '#E5C495',
  '#F4DED9',
  '#DBE9CE',
  '#EBF4DE',
  '#E5E1ED',
  '#DDF0F3',
  '#FDECDC',
  '#FFE7C4',
  '#FDFACA',
  '#F09CA0',
  '#D7D7D7',
  '#585858',
  '#C6B797',
  '#8CB4EA',
  '#C1CCE4',
  '#7ED2F6',
  '#B1894F',
  '#E7B8B8',
  '#B0D59A',
  '#D7E3BD',
  '#CDC1D9',
  '#B7DDE9',
  '#FAD6B1',
  '#F5CE88',
  '#FFF55A',
  '#EF6C78',
  '#BFBFBF',
  '#3E3E3E',
  '#938953',
  '#548ED4',
  '#98B7D5',
  '#00B4F0',
  '#9A6C34',
  '#D79896',
  '#7EC368',
  '#C5DDA5',
  '#B1A5C6',
  '#93CDDD',
  '#F9BD8D',
  '#F7B550',
  '#FFF100',
  '#E80050',
  '#A6A6A7',
  '#2D2D2B',
  '#494428',
  '#1D3A5F',
  '#376192',
  '#825320',
  '#903635',
  '#13B044',
  '#76933C',
  '#5E467C',
  '#31859D',
  '#E46C07',
  '#F39900',
  '#B7AB00',
  '#A50036',
  '#979D99',
  '#0C0C0C',
  '#1C1A10',
  '#0C263D',
  '#005883',
  '#693904',
  '#622727',
  '#005E14',
  '#4F6028',
  '#3E3050',
  '#245B66',
  '#974805',
  '#AD6A00',
  '#8B8100',
  '#7C0022',
  '#F0DCBE',
  '#F2B1CF',
  '#D3FFBF',
  '#00165F',
  '#6673CB',
  '#006EBF',
  '#89CF66',
  '#70A900',
  '#93D150',
  '#70319F',
  '#D38968',
  '#FFBF00',
  '#FFFF00',
  '#C10000',
  '#F0F1A6',
  '#FF0000',
]
