import { ToolbarResource } from "imobile_for_reactnative/components/ToolbarKit"
import { getImage } from "../assets"


const text: ToolbarResource['text'] = {
  slide_ratio: () => '滑动比例',
  apply: () => '应用'
}

const image: ToolbarResource['image'] = {
  back: getImage().back,
  commit: getImage().icon_submit,

  dropdown: getImage().icon_drop_down,
  dropup: getImage().icon_drop_up,

  check: getImage().icon_check,
  un_check: getImage().icon_uncheck,

  add_round: getImage().icon_add,

  option: getImage().icon_toolbar_option,
  toolbar_toggle: getImage().icon_toolbar_style,

  plus: getImage().icon_enlarge,
  minus: getImage().icon_narrow,
}


export const resource: ToolbarResource = {
  text,
  image,
}