import { UserInfo } from '../types'

let currentUser: UserInfo


function setCurrentUser(user: UserInfo) {
  currentUser = user
}

function getCurrentUser() {
  return currentUser
}

export default {
  setCurrentUser,
  getCurrentUser,
}