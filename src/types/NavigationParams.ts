import { CAREMA_MEDIA_TYPE } from "@/containers/camera/types";

export interface NAVIGATION_CAREMA {
  type?: CAREMA_MEDIA_TYPE,
  datasourceAlias?: string,
  datasetName?: string,
  cb?: (params: {
    datasourceName: string,
    datasetName: string,
    mediaPaths: string[],
  }) => void,
  qrCb?: (params: unknown) => void,
  limit?: number,
  index?: number,
  cancelCb?: () => void,
  atcb?: (params: {
    datasourceName: string,
    datasetName: string,
    mediaPaths: string[],
  }) => void,
  attribute?: boolean,
  selectionAttribute?: boolean,
  layerAttribute?: boolean,
}