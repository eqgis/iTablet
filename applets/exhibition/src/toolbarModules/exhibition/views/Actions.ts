import { SARMap } from "imobile_for_reactnative"


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