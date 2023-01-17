import { ARElement } from "imobile_for_reactnative"

/** 记录一次添加中所有添加的对象 */
const _list: ARElement[] = []

export function getAddElements() {
  return _list
}

export function clearAddList() {
  _list.splice(0, _list.length)
}
