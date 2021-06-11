export interface DATA_ITEM {
  key: string,
  title?: string,
  action: () => void,
  size?: 'large' | 'small',
  image: any,
}

/** 外部数据类型 */
export type ExternalDataType = 'workspace' | 'datasource' | 'symbol' | 'armap' | 'armodel' | 'workspace3d' | 'areffect'

export interface ToolBarListItem {
  image: any,
  disableImage?: any, // 不可点击图片
  disable?: boolean,  // 是否可点击
  text?: string,
  onPress: () => void,
  /** 点击后下载识别key，用以监听进度 */
  downloadKeys?: string[],
}
