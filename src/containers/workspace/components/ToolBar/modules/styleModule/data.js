import ToolbarBtnType from '../../ToolbarBtnType'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import constants from '../../../../constants'
import { getLanguage } from '../../../../../../language'
import StyleAction from './StyleAction'

const line = param => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    // '符号线',
    action: () => {
      global.toolBox && global.toolBox.menu({
        type: ConstToolType.SM_MAP_STYLE,
        selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL
      })
      global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE, {
          containerType: ToolbarType.symbol,
          isFullScreen: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    selectName: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
        })
    },
    // 线宽
    selectName: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      global.toolBox && global.toolBox.menu({
        type: ConstToolType.SM_MAP_STYLE_LINE_COLOR,
        selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR
      })
      global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE_LINE_COLOR, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
  },
]

const point = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    action: () => {
      global.toolBox && global.toolBox.menu({
        type: ConstToolType.SM_MAP_STYLE,
        selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL
      })
      global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE, {
          containerType: ToolbarType.symbol,
          isFullScreen: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
          selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      global.toolBox && global.toolBox.menu({
        type: ConstToolType.SM_MAP_STYLE_POINT_COLOR,
        selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR
      })
      global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE_POINT_COLOR, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
  },
]

const region = param => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    // '面符号',
    action: () => {
      global.toolBox && global.toolBox.menu({
        type: ConstToolType.SM_MAP_STYLE,
        selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL
      })
      global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE, {
          containerType: ToolbarType.symbol,
          isFullScreen: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    // '面符号',
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FOREGROUND,
    action: () => {
      global.toolBox && global.toolBox.menu({
        type: ConstToolType.SM_MAP_STYLE_REGION_BEFORE_COLOR,
        selectKey: getLanguage(param).Map_Main_Menu.STYLE_FOREGROUND
      })
      global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE_REGION_BEFORE_COLOR, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_FOREGROUND,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FOREGROUND,
  },
  // {
  //   key: getLanguage(param).Map_Main_Menu.STYLE_BACKGROUND,
  //   action: () => {
  //     global.toolBox && global.toolBox.menu()
  //     let height, column
  //     if (orientation.indexOf('PORTRAIT') >= 0) {
  //       height = ConstToolType.THEME_HEIGHT[3]
  //       column = 8
  //     } else {
  //       height = ConstToolType.TOOLBAR_HEIGHT_2[3]
  //       column = 12
  //     }
  //     global.toolBox &&
  //       global.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE_REGION_AFTER_COLOR, {
  //         containerType: ToolbarType.colorTable,
  //         column,
  //         isFullScreen: false,
  //         height,
  //         buttons: [
  //           ToolbarBtnType.CANCEL,
  //           ToolbarBtnType.MENU,
  //           ToolbarBtnType.MENU_FLEX,
  //           ToolbarBtnType.TOOLBAR_COMMIT,
  //         ],
  //         selectKey: getLanguage(param).Map_Main_Menu.STYLE_BACKGROUND,
  //       })
  //   },
  //   selectKey: getLanguage(param).Map_Main_Menu.STYLE_BACKGROUND,
  // },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BORDER,
    action: () => {
      global.toolBox && global.toolBox.menu({
        type: ConstToolType.SM_MAP_STYLE_REGION_BORDER_COLOR,
        selectKey: getLanguage(param).Map_Main_Menu.STYLE_BORDER
      })
      global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE_REGION_BORDER_COLOR, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_BORDER,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_BORDER,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BORDER_WIDTH,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.STYLE_BORDER_WIDTH,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_BORDER_WIDTH,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_BORDER_WIDTH,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
  },
  // {
  //   key: '渐变',
  //   action: () => {
  //     global.toolBox && global.toolBox.setState({
  //       isTouchProgress: true,
  //       showMenuDialog: false,
  //       buttons: [
  //         ToolbarBtnType.CANCEL,
  //         ToolbarBtnType.MENUS,
  //         ToolbarBtnType.PLACEHOLDER,
  //       ],
  //     })
  //   },
  // },
]

const grid = param => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
  },
  {
    key: getLanguage(param).Map_Main_Menu.CONTRAST,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.CONTRAST,
          selectKey: getLanguage(param).Map_Main_Menu.CONTRAST,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.CONTRAST,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
  },
]

const text = param => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT,
    action: () => {
      global.toolBox && global.toolBox.menu({
        type: ConstToolType.SM_MAP_STYLE_TEXT_FONT,
        selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT
      })
      global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE_TEXT_FONT, {
          isFullScreen: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.STYLE_FONT,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT,
        })
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
        })
    },
  },
  {
    key: getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION,
    selectKey: getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION,
    action: () => {
      global.toolBox &&
        global.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION,
          selectKey: getLanguage(global.language).Map_Main_Menu.STYLE_ROTATION,
        })
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      global.toolBox && global.toolBox.menu({
        type: ConstToolType.SM_MAP_STYLE_TEXT_COLOR,
        selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR
      })
      global.toolBox &&
        global.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE_TEXT_COLOR, {
          containerType: ToolbarType.colorTable,
          isFullScreen: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
        })
    },
  },
]

const font = function (language) {
  return (
    [
      {
        key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_BOLD,
        title: getLanguage(language).Map_Main_Menu.STYLE_BOLD,
        // action: StyleAction.setTextFont,
        action: StyleAction.setTextFont,
        size: 'large',
        image: require('../../../../../../assets/mapTools/style_font_bold.png'),
        selectedImage: require('../../../../../../assets/mapTools/style_font_bold.png'),
      },
      {
        key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_ITALIC,
        title: getLanguage(language).Map_Main_Menu.STYLE_ITALIC,
        action: StyleAction.setTextFont,
        size: 'large',
        image: require('../../../../../../assets/mapTools/style_font_italic.png'),
        selectedImage: require('../../../../../../assets/mapTools/style_font_italic.png'),
      },
      {
        key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_UNDERLINE,
        title: getLanguage(language).Map_Main_Menu.STYLE_UNDERLINE,
        action: StyleAction.setTextFont,
        size: 'large',
        image: require('../../../../../../assets/mapTools/style_font_underline.png'),
        selectedImage: require('../../../../../../assets/mapTools/style_font_underline.png'),
      },
      {
        key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_STRIKEOUT,
        title: getLanguage(language).Map_Main_Menu.STYLE_STRIKEOUT,
        action: StyleAction.setTextFont,
        size: 'large',
        image: require('../../../../../../assets/mapTools/style_font_strikeout.png'),
        selectedImage: require('../../../../../../assets/mapTools/style_font_strikeout.png'),
      },
      {
        key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_SHADOW,
        title: getLanguage(language).Map_Main_Menu.STYLE_SHADOW,
        action: StyleAction.setTextFont,
        size: 'large',
        image: require('../../../../../../assets/mapTools/style_font_shadow.png'),
        selectedImage: require('../../../../../../assets/mapTools/style_font_shadow.png'),
      },
      {
        key: constants.MAP_THEME_PARAM_UNIFORMLABEL_FONT_OUTLINE,
        title: getLanguage(language).Map_Main_Menu.STYLE_OUTLINE,
        action: StyleAction.setTextFont,
        size: 'large',
        image: require('../../../../../../assets/mapTools/style_font_outline.png'),
        selectedImage: require('../../../../../../assets/mapTools/style_font_outline.png'),
      },
    ]
  )
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

const colorsWithNull = [
  {
    key: 'NULL',
    text: 'NULL',
  },
].concat(colors)

export { line, point, region, grid, text, font, colors, colorsWithNull }
