import InputDialog, { TempData } from '../components/Dialog/InputDialog'
type InputDialogType = InputDialog | null
let inputDialog: InputDialogType = null

function setInputDialog(ref: InputDialogType) {
  inputDialog = ref
}

function getInputDialog(): InputDialogType {
  return inputDialog
}

function showInputDailog(option: TempData) {
  inputDialog?.setDialogVisible(true, option)
}

function hideInputDailog() {
  inputDialog?.setDialogVisible(false)
}

export default {
  setInputDialog,
  getInputDialog,

  showInputDailog,
  hideInputDailog,
}