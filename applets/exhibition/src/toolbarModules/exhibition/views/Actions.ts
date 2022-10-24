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