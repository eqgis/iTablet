import InputDialog, { InputDialogOption } from "../components/InputDialog2"


let DialogRef: InputDialog

function setDialog(ref: InputDialog | null) {
  if(!ref) return
  DialogRef = ref
}

function show(option: InputDialogOption) {
  DialogRef.set(option)
  DialogRef.setVisible(true)
}

function hide() {
  DialogRef.setVisible(false)
}

export default {
  setDialog,
  show,
  hide,
}