import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'Contrat de service utilisateurs SuperMap',
  AGREE: "D'accord",
  READ_AND_AGREE: "J'ai lu et j'accepte les conditions ci-dessus",
  AGAIN:'Voir encore',
  CONFIRM_EXIT:'Confirmer la sortie',
  REMINDER:'Rappel',
  AGREEMENT:"Nous attachons une grande importance à la protection de vos informations personnelles et nous promettons de protéger et de traiter vos informations en stricte conformité avec la politique de confidentialité d'hypergraph. Si nous ne sommes pas d'accord avec la politique, nous regrettons de ne pas être en mesure de fournir des services",
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
