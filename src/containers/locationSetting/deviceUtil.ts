import { SLocation } from "imobile_for_reactnative"


let selectDevice: SLocation.LocationConnectionParam = {type: 'local'}

export function setSelectDevice(device: SLocation.LocationConnectionParam): void {
  try {
    selectDevice = JSON.parse(JSON.stringify(device))
  } catch (error) {
    // to do
  }
}

export function getSelectDevice(): SLocation.LocationConnectionParam {
  return selectDevice
}