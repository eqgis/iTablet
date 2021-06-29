import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'SuperMap User Service Agreement',
  AGREE: 'Agree',
  READ_AND_AGREE: "I've read and agree to the above terms",
}

const Common: typeof CN.Common = {
  UP: 'Up',
  DOWN: 'Down',
  LEFT: 'Left',
  RIGHT: 'Right',
  FRONT: 'Front',
  BACK: 'Back',

  PARAMETER: 'Parameter',
  CONFIRM: 'Confirm',

  ADD: 'Add',
  NONE: 'None',

  DELETE_CURRENT_OBJ_CONFIRM: 'Do you want to delete current object?',
  NO_SELECTED_OBJ: 'No selected object',
}

export { Protocol, Common }
