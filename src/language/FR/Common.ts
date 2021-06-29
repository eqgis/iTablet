import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'Contrat de service utilisateurs SuperMap',
  AGREE: "D'accord",
  READ_AND_AGREE: "J'ai lu et j'accepte les conditions ci-dessus",
}

const Common: typeof CN.Common = {
  UP: 'Haut',
  DOWN: 'Bas',
  LEFT: 'Gauche',
  RIGHT: 'Droit',
  FRONT: 'Avant',
  BACK: 'Arrière',

  PARAMETER: 'Paramètre',
  CONFIRM: 'confirmer',

  ADD: 'Ajouter',
  NONE: 'None',

  DELETE_CURRENT_OBJ_CONFIRM: 'Do you want to delete current object?',  //to be translated
  NO_SELECTED_OBJ: 'No selected object',  //to be translated
}

export { Protocol, Common }
