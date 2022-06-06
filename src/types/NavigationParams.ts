import { SelectedItems } from "@/components/ImagePicker/src/types"
import { CAREMA_MEDIA_TYPE } from "@/containers/camera/types"
import { AssetType } from '@react-native-community/cameraroll'

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

export interface GroupSourceManagePageParams {
  title?: string,
  keywords?: string,
  isManage?: boolean,
  hasDownload?: boolean,
  itemAction?: (params: unknown) => void,
}

export interface AlbumViewParams {
  groupName: string,
  assetType?: AssetType,
  total: number,
  maxSize: number,
  selectedItems?: SelectedItems,
  column?: number,
  autoConvertPath?: boolean,
  callback?: (arams: unknown) => void, // 确定回调
  onBack?: (groupName: string, params: unknown) => void,   // 返回回调
}

export interface CoworkManagePageParams {
  callBack: (params?: unknown) => void,
}