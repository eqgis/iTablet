import CN from "../CN"

const Protocol: typeof CN.Protocol = {
  PROTOCOL: "SuperMap User Service Agreement",
  AGREE: "Agree",
  READ_AND_AGREE: "I\"ve read and agree to the above terms",
  AGAIN:"See Again",
  CONFIRM_EXIT:"Quit",
  REMINDER:"Warm-tip",
  AGREEMENT:"We strictly follow and obey SuperMap Privacy Policy to protect your personal information. To serve you well, please agree the policy",
}

const Common: typeof CN.Common = {
  UP: "Up",
  DOWN: "Down",
  LEFT: "Left",
  RIGHT: "Right",
  FRONT: "Front",
  BACK: "Back",

  PARAMETER: "Parameter",
  CONFIRM: "Confirm",

  ADD: "Add",
  NONE: "None",

  DELETE_CURRENT_OBJ_CONFIRM: "Do you want to delete current object?",
  NO_SELECTED_OBJ: "No selected object",

  CURRENT: 'Current',
  SELECTED: 'Selected',
  DEFAULT: 'Default',

  SELECT_MODEL: 'Select Model',

  PLEASE_SELECT_MODEL: 'Please select model',

  SHOULD_BE_DECIMAL_FRACTION: 'should be a ddecimal fraction',
  SHOULD_BE_INTEGER: 'shoud be an integer',
  SHOULD_BE_POSITIVE_NUMBER: 'shoud be a positive number',


  TRANVERSE: 'Tranverse',
  LONGITUDINAL: 'Longitudinal',
  HORIZONTAL: 'Horizontal',
  VERTICAL: 'Vertical',

  EXIT_SAND_TABLE_CONFIRM: 'Do you want to quit editing the sand table?',
  PLEASE_INPUT_MODEL_NAME: 'Please input model name',
  SAND_TABLE: 'Sand Table',
  EXPORT_SAND_TABLE_CONFIRM: 'Do you want to export the sand table?',
  MODEL_LIST: 'Model List',

  ALIGN: 'Alignment',

  VISIBILITY: 'Visibility',
  SHOW: 'Show',
  HIDE: 'Hide',

  CUSTOME_ANIMATION: 'Custome Animation',
  MODEL_ANIMATION: 'Model Animation',
  BONE_ANIMATION: 'Bone Animation',
  ANIMATION_BOUNDS: 'Animation Bounds',
  ANIMATION_SETTING: 'Animation Settings',
  REPEAT_COUNT: 'Repeat Count',

  DELAY: 'Delay',
  ORDER: 'Order',
  AFTER_PREV_ANIMATION: 'Start After Previous',
  WITH_PREV_ANIMATION: 'Start With Previous',
  TOUCH_TO_START: 'Touch To Start',

  START_FRAME: 'Start Frame',
  END_FRAME: 'End Frame',

  START_FROM_CURRENT_POSITION: 'Start From Current Position',
  START_FROM_CURRENT_DGREE: 'Start From Current Degree',

  START_POSITION: 'Start Postion',
  END_POSITION: 'End Position',
  START_DEGREE: 'Start Degree',
  END_DEGREE: 'End Degree',

  KEEP_VISIBLE: 'Keep Visible',
  KEEP_REPEATE: 'Keep Repeat',

  ANIMATION_LIST: 'Animation list',
  ANIMATION_WINDOW: 'Animation window',

  PLEASE_SELECT_ANIMATION: 'Please Select Animation',

  DELETE_COMFIRM: 'Would you like to delete it?',

  NULL_DATA: 'Null Data', // to be translated

  PLEASE_SELECT_OBJ: 'Please select object', // to be translated
  PLEASE_SELECT_LAYER_OR_OBJECT: "Please select a layer or object", // to be translated
  PLEASE_SELECT_AR_OBJECT_LAYER: "Please select ar object layer", // to be translated

  ATTRIBUTE_ADD_TO_AR_SCENE: "Add Attribute table to AR scene",  // to be translated

  ALIGNMENT: 'Alignment',
  LEFT_START: 'Left Top',
  LEFT_END: 'Left Bottom',
  RIGHT_START: 'Right Top',
  RIGHT_END: 'Right Bottom',
  TOP_START: 'Top Left',
  TOP_END: 'Top Right',
  BOTTOM_START: 'Bottom Left',
  BOTTOM_END: 'Bottom Right',

  LINE_POINT_INTERVAL: 'Line point interval',  // To be translated
  LINE_MARKER_SPEED: 'Speed', // To be translated
  LINE_MARKER: 'Line marker',  // To be translated

  BUBBLE_TEXT: 'Bubble Text',
}

export { Protocol, Common }
