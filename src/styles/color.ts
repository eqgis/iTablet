import ThemeType from '../constants/ThemeType'

const darkTheme = {
  theme: '#2D2D2F',
  reverseTheme: '#FFFFFF',
  borderLight: '#C1C0B9',
  border: '#505052',
  subTheme: '#48484b',
  themeText: '#FFFFFF',
  themeText2: '#181818',
  themePlaceHolder: '#959595',

  overlay: 'rgba(105, 105, 105, 0.8)',
  transOverlay: 'rgba(0, 0, 0, 0)',
  transView: 'rgba(48, 48, 48, 0.85)',
  blackBg: '#353537',
  bgW: '#FBFBFB',
  bgG: '#A0A0A0',
}

const lightTheme = {
  theme: '#2D2D2F',
  reverseTheme: '#FFFFFF',
  borderLight: '#C1C0B9',
  border: '#505052',
  subTheme: '#48484b',
  themeText: '#FFFFFF',
  themeText2: '#181818',
  themePlaceHolder: '#959595',

  overlay: 'rgba(105, 105, 105, 0.8)',
  transOverlay: 'rgba(0, 0, 0, 0)',
  transView: 'rgba(240, 240, 240, 0.85)',
  blackBg: '#353537',
  bgW: '#F9F9F9',
  bgW2: '#E1E1E1',
  bgG: '#A0A0A0',
  bgG2: '#F3F4F8',
  bgG3: '#F6F7F8',
  switch: '#4680DF',
  selected_blue: '#007AFF',
  // selected: '#4680DF',
  selected: 'rgba(70, 128, 223, 0.5)',

  fontColorWhite: '#FBFBFB',
  fontColorBlack: '#181818',
  fontColorGray: '#A0A0A0',
  fontColorGray2: '#9C9C9C',
  fontColorGray3: '#8A8A8F',

  itemColorWhite: '#FBFBFB',
  itemColorBlack: '#181818',
  itemColorGray: '#505050',
  itemColorGray2: '#EFEFEF',
  itemColorGray3: '#D6D6D6',
  itemColorGray4: '#E5E5E5',

  contentColorWhite: '#FBFBFB',
  contentWhite: '#FBFBFB',
  contentColorWhite2: 'rgba(240,240,240, 0.85)',
  contentColorBlack: '#181818',
  contentColorGray: '#505050',

  borderColorBlack: '#181818',

  // separateColorGray: '#A0A0A0',
  separateColorGray: '#EEEEEE',
  separateColorGray2: '#6C7B8A',
  separateColorGray3: '#F1F3F8',
  separateColorGray4: '#F2F2F2',

  imageColorBlack: '#181818',
  imageColorWhite: '#FBFBFB',

  // modalBgColor: 'rgba(48, 48, 48, 0.85)',
  modalBgColor: 'rgba(0, 0, 0, 0.5)',
}

const defaultStyles = {
  white: '#FFFFFF',
  red: '#FF0000',
  yellow: '#FFFF00',
  grassGreen: '#7BB736',
  cyan: '#41C7DB',
  black: '#000000',

  background: '#e2e2e2',
  background1: '#f3f3f3',
  background3: '#F1F1F1',
  headerBackground: '#959595',

  red1: '#d81e06',
  pink: '#FF9AA9',
  black1: '#222222',
  gray: '#959595',
  grayL: '#999999',
  gray1: '#94A0B2',
  gray2: '#A5AFBD',
  gray3: '#dbdfe5',
  gray4: '#DBDFE5',
  gray5: '#E9E9EF',
  gray6: '#D4D4D4',
  gray7: '#C0C0C0',
  grayLight: '#e2e2e2',
  grayLight2: '#BCC3CE',
  // border: '#e0e0e0',
  title2: '#454545',
  background2: '#f5f7fa',
  statusBarColor: 'white',
  blue1: '#4BA0FF',
  blue2: '#1296db',

  USUAL_SEPARATORCOLOR: 'rgba(59,55,56,0.3)',
  UNDERLAYCOLOR: 'rgba(34,26,38,0.1)',
  USUAL_GREEN: '#F5FCFF',
  USUAL_BLUE: '#2196f3',
  USUAL_PURPLE: '#871F78',

  green1: '#1afa29',

  /** 深色版 */
  content: '#555555',
  /** 浅色版 */
  item_separate_white: '#A0A0A0', // 分割线
  content_white: 'white', // 列表项目背景 '#FBFBFB'
  font_color_white: '#181818', // 列表项目文字颜色
  image_bg_white: '#727272',
  theme_white: '#181818',
  section_bg: '#505050', // 列表一级标题背景
  section_text: '#FBFBFB', // 列表一级标题文字
  bottomz: '#181818', // 底部工具栏背景
  overlay_tint: 'rgba(48,48,48,0.85)', // 遮罩颜色为#181818,85%不透明度
  item_selected_bg: '#4680DF', // 列表选中背景
  item_text_selected: '#FBFBFB', // 列表文字选中颜色

  // 提示消息颜色
  infoBg: '#EDF1FB',
  warningBg: '#FAF5EC',
  successBg: '#F2F9EB',
  errorBg: '#FAEFEF',
  info: '#8F9198',
  warning: '#D4A146',
  success: '#88C148',
  error: '#D96C6C',

  transOverlay: 'rgba(0, 0, 0, 0)',
  whiteOpacity50: 'rgba(255, 255, 255, 0.5)',
  colorFB: '#FBFBFB',
  colorEF: '#EFEFEF',
  color30: '#303030',
  colorD3: '#D3D3D3',
  containerHeaderBgColor: 'rgba(255, 255, 255, 1)',
  // containerHeaderBgColor: '#add8e6',
  containerTextColor: '#555555',
  // containerTextColor: '#fff',
  bottomTabBgColor: '#fff',
  bottomTabTextColor: '#505050',
  rightListBgColor: '#fff',
  rightListTextColor: '#000',
  leftBottomBtnBgColor: '#fff',
  toolbarBgColor: '#fff',
  MTbtnUnderLayer: '#D3D3D3',

}


const colors = [
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
  '#00A1E9',
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
  '#1D3A5F',
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
  '#13B044',
  '#93D150',
  '#70319F',
  '#00B4F0',
  '#D38968',
  '#FFBF00',
  '#FFFF00',
  '#C10000',
  '#F0F1A6',
  '#FF0000',
]

let customStyles
switch (global.ThemeType) {
  case ThemeType.DARK_THEME:
    customStyles = darkTheme
    break
  case ThemeType.LIGHT_THEME:
  default:
    customStyles = lightTheme
    break
}
let styles = Object.assign({colors}, defaultStyles, customStyles)

// '#0093f3'
/**
 * 添加或重置颜色风格
 * @param params 用户的颜色对象，{key: value}的形式 key的范围不定， value为字符串类型
 */
export const setAppColor = (params: Record<string, string>) => {
  styles  = Object.assign(styles, params)
}

export default styles
