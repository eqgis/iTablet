import { scaleSize } from '../utils'

const HEIGHT_1 = scaleSize(80)
const HEIGHT_2 = scaleSize(88)
const HEIGHT_3 = scaleSize(100)
const HEIGHT_4 = scaleSize(120)
const HEIGHT_5 = scaleSize(160)

export default {
  TABLE_ROW_HEIGHT_1: HEIGHT_1,
  TABLE_ROW_HEIGHT_2: HEIGHT_2,
  TABLE_ROW_HEIGHT_3: HEIGHT_3,
  TABLE_ROW_HEIGHT_4: HEIGHT_4,
  TABLE_ROW_HEIGHT_5: HEIGHT_5,

  LIST_HEIGHT_P: scaleSize(800), // 列表竖屏高度
  LIST_HEIGHT_L: scaleSize(600), // 列表横屏高度

  COLOR_TABLE_HEIGHT_P: scaleSize(400), // 列表竖屏高度
  COLOR_TABLE_HEIGHT_L: scaleSize(250), // 列表横屏高度

  TOOLBAR_BUTTONS: scaleSize(96), // 底部Bottom

  PICKER_HEIGHT: HEIGHT_1 * 3,
}
