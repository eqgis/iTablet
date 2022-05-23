import Dialog, { DialogOption } from "../components/Dialog2"


let DialogRef: Dialog

function setDialog(ref: Dialog | null) {
  if(!ref) return
  DialogRef = ref
}

/** 根据设置显示弹窗 */
function show(option: Partial<DialogOption>) {
  DialogRef.set(option)
  DialogRef.setVisible(true)
}

/** 隐藏弹窗 */
function hide() {
  DialogRef.setVisible(false)
}

export default {
  setDialog,
  show,
  hide,
}