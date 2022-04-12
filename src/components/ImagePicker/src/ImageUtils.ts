import NavigationService from "@/containers/NavigationService"

let fromView = '' // 跳转到相册前的路径

export function setFromView(from?: string) {
  fromView = from || ''
}

export function getFromView() {
  return fromView
}

export function showImagePicker(options: any) {
  setFromView(NavigationService.getCurrent())
  NavigationService.navigate('ImagePickerStack', options)
}

export function hide () {
  if (fromView) {
    NavigationService.navigate(fromView)
    setFromView('')
  }
}