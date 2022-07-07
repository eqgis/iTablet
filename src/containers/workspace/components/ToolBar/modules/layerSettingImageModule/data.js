import { getLanguage } from '../../../../../../language'

function getDisplayMode() {
  return [
    {
      key: getLanguage(global.language).Map_Layer.DISPLAY_MODE_COMPOSITE,
      value: 0,
    },
    {
      key: getLanguage(global.language).Map_Layer.DISPLAY_MODE_STRETCHED,
      value: 1,
    },
  ]
}

function getStretchType() {
  return [
    {
      key: getLanguage(global.language).Map_Layer.STRETCH_TYPE_NONE,
      value: 0,
    },
    {
      key: getLanguage(global.language).Map_Layer
        .STRETCH_TYPE_STANDARDDEVIATION,
      value: 1,
    },
    {
      key: getLanguage(global.language).Map_Layer.STRETCH_TYPE_MINIMUMMAXIMUM,
      value: 2,
    },
    {
      key: getLanguage(global.language).Map_Layer
        .STRETCH_TYPE_HISTOGRAMEQUALIZATION,
      value: 3,
    },
    {
      key: getLanguage(global.language).Map_Layer
        .STRETCH_TYPE_HISTOGRAMSPECIFICATION,
      value: 4,
    },
    {
      key: getLanguage(global.language).Map_Layer.STRETCH_TYPE_GAUSSIAN,
      value: 5,
    },
  ]
}

export default {
  getDisplayMode,
  getStretchType,
}
