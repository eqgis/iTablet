import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'Contrat de service utilisateurs SuperMap',
  AGREE: "D'accord",
  READ_AND_AGREE: "J'ai lu et j'accepte les conditions ci-dessus",
  AGAIN:'See Again',//need to translate
  CONFIRM_EXIT:'Confirm Exit',//need to translate
  REMINDER:'Reminder',//need to translate
  AGREEMENT:'We attach great importance to the protection of your personal information and promise to protect and process your information in strict accordance with the hypergraph privacy policy. If we disagree with the policy, we regret that we will not be able to provide services',//need to translate
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
  NONE: 'Aucun',

  DELETE_CURRENT_OBJ_CONFIRM: "Voulez-vous supprimer l'objet actuel ?",
  NO_SELECTED_OBJ: 'Aucun objet sélectionné',
}

export { Protocol, Common }
