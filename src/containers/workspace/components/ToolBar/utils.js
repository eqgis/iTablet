import { getLanguage } from '../../../../language'

/**
 * 判断Toolbar当前操作是否是指滑菜单操作
 * @param selectKey
 * @returns {boolean}
 */
function isTouchProgress(selectKey) {
  if (
    selectKey === getLanguage(global.language).Map_Main_Menu.STYLE_LINE_WIDTH ||
    selectKey === getLanguage(global.language).Map_Main_Menu.STYLE_SIZE ||
    selectKey ===
      getLanguage(global.language).Map_Main_Menu.STYLE_TRANSPARENCY ||
    selectKey === getLanguage(global.language).Map_Main_Menu.CONTRAST ||
    selectKey === getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST ||
    selectKey === getLanguage(global.language).Map_Main_Menu.SATURATION ||
    selectKey === getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS ||
    selectKey ===
      getLanguage(global.language).Map_Main_Menu.NUMBER_OF_SEGMENTS ||
    selectKey === getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION ||
    selectKey === getLanguage(global.language).Map_Main_Menu.STYLE_FONT_SIZE ||
    selectKey === getLanguage(global.language).Map_Main_Menu.DOT_VALUE ||
    selectKey ===
      getLanguage(global.language).Map_Main_Menu.STYLE_SYMBOL_SIZE ||
    selectKey === getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH ||
    selectKey ===
      getLanguage(global.language).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE ||
    selectKey === getLanguage(global.language).Map_Main_Menu.LEGEND_COLUMN ||
    selectKey === getLanguage(global.language).Map_Main_Menu.LEGEND_HEIGHT ||
    selectKey === getLanguage(global.language).Map_Main_Menu.LEGEND_WIDTH ||
    selectKey === getLanguage(global.language).Map_Main_Menu.LEGEND_FONT ||
    selectKey === getLanguage(global.language).Map_Main_Menu.LEGEND_ICON ||
    selectKey === getLanguage(global.language).Map_Main_Menu.RANGE_COUNT ||
    selectKey === getLanguage(global.language).Map_Main_Menu.DATUM_VALUE ||
    selectKey ===
      getLanguage(global.language).Map_Main_Menu.THEME_HEATMAP_RADIUS ||
    selectKey ===
      getLanguage(global.language).Map_Main_Menu.THEME_HEATMAP_FUZZY_DEGREE ||
    selectKey ===
      getLanguage(global.language).Map_Main_Menu
        .THEME_HEATMAP_MAXCOLOR_WEIGHT ||
    selectKey === getLanguage(global.language).Map_Main_Menu.STYLE_BORDER_WIDTH
  ) {
    return true
  }
  return false
}

export default {
  isTouchProgress,
}
