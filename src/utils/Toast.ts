import Toast, { ToastOptions } from 'react-native-root-toast'
// import { POSITION, DURATION } from '../components/MyToast'

function show(msg: string, option?: ToastOptions) {
  const op = {
    duration: DURATION.TOAST_LONG,
    position: POSITION.TOP,
    shadow: true,
    animation: true,
    delay: 0,
    ...option,
  }
  // if (option.type === 'normal') {
  //   Toast.show(msg, op)
  // } else {
  //   global.Toast.show(msg, op)
  // }
  Toast.show(msg, op)
}

const DURATION = {
  TOAST_SHOT: 2000,
  TOAST_LONG: 3500,
}

const POSITION = {
  CENTER: Toast.positions.CENTER,
  // TOP: Toast.positions.TOP,
  TOP: 100,
  BOTTOM: Toast.positions.BOTTOM,
}

export default {
  show,
  DURATION,
  POSITION,
}
