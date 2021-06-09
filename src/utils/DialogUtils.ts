import InputDialog, { TempData } from '../components/InputDialog'
type InputDialogType = typeof InputDialog | null
let inputDialog: InputDialogType = null

function setInputDialog(ref: InputDialogType) {
  inputDialog = ref
}

function getInputDialog(): InputDialogType {
  return inputDialog
}

function showInputDailog(option: TempData) {
  inputDialog.setDialogVisible(true, option)
}

function hideInputDailog() {
  inputDialog.setDialogVisible(false)
}

export default {
  setInputDialog,
  getInputDialog,

  showInputDailog,
  hideInputDailog,
}