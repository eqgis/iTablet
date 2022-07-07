interface MEDIA_TYPE {
    PHOTO: 1,
    VIDEO: 2,
    AUDIO: 3,
    BARCODE: 4,
  }
  
  interface RECORD_STATUS {
    UN_RECORD: 1, // 未拍摄
    RECORDING: 2, // 拍摄中，拍照没有这个状态
    RECORDED: 3, // 拍摄完
  }
  
  export const TYPE: MEDIA_TYPE = {
    PHOTO: 1,
    VIDEO: 2,
    AUDIO: 3,
    BARCODE: 4,
  }
  
  export const RECORD_STATUS: RECORD_STATUS = {
    UN_RECORD: 1, // 未拍摄
    RECORDING: 2, // 拍摄中，拍照没有这个状态
    RECORDED: 3, // 拍摄完
  }
  
  export type CAREMA_MEDIA_TYPE = MEDIA_TYPE[keyof MEDIA_TYPE]
  export type CAREMA_RECORD_STATUS = RECORD_STATUS[keyof RECORD_STATUS]
  