import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'SuperMap User Service Agreement',
  AGREE: 'Agree',
  READ_AND_AGREE: "I've read and agree to the above terms",
  AGAIN:'See Again',//need to translate
  CONFIRM_EXIT:'Confirm Exit',//need to translate
  REMINDER:'Reminder',//need to translate
  AGREEMENT:'We attach great importance to the protection of your personal information and promise to protect and process your information in strict accordance with the hypergraph privacy policy. If we disagree with the policy, we regret that we will not be able to provide services',//need to translate
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
