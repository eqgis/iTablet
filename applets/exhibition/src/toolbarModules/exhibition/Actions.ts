import { SARMap } from "imobile_for_reactnative"
import { Pose } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"

/** 进模块后扫描图片的的通用pose */
let globalScanPose: Pose | null = null

export function getGlobalPose(): Pose | null {
  return null // globalScanPose ? JSON.parse(JSON.stringify(globalScanPose)) : null
}

export function setGolbalPose(pose: Pose) {
  globalScanPose = JSON.parse(JSON.stringify(pose))
}



let flatMapRefresh = false
export async function shouldRefreshFlatMapData(): Promise<boolean> {
  const needToImport = await SARMap.needToImport()
  return needToImport && !flatMapRefresh
}

export async function flatMapImported() {
  const needToImport = await SARMap.needToImport()
  flatMapRefresh = needToImport
}

let buildingRefresh = false
export async function shouldBuildingMapData(): Promise<boolean> {
  const needToImport = await SARMap.needToImport()
  return needToImport && !buildingRefresh
}

export async function buildingImported() {
  const needToImport = await SARMap.needToImport()
  buildingRefresh = needToImport
}


let flatMapGuided = true
export function setFlatMapGuided() {
  flatMapGuided = true
}

export function isFlatMapGuided() {
  return flatMapGuided
}

let ar3dMapGuided = true
export function setAr3dMapGuided() {
  ar3dMapGuided = true
}

export function isAr3dMapGuided() {
  return ar3dMapGuided
}

let coverGuided = true
export function setCoverGuided() {
  coverGuided = true
}

export function isCoverGuided() {
  return coverGuided
}

let doctorMapGuided = false
export function setDoctorMapGuided() {
  doctorMapGuided = true
}

export function isDoctorMapGuided() {
  return doctorMapGuided
}