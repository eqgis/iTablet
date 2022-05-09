export interface MEDIA_TYPES {
  PHOTO: 'photo',
  VIDEO: 'video',
  AUDIO: 'audio',
}

export interface VIDEO_STATUS_TYPES {
  PLAYING: 1, // 播放中
  PAUSE: 2, // 暂停
  STOP: 3, // 停止
}

export type MEDIA_TYPE = MEDIA_TYPES[keyof MEDIA_TYPES]

export type VIDEO_STATUS_TYPE = VIDEO_STATUS_TYPES[keyof VIDEO_STATUS_TYPES]

const TYPE: MEDIA_TYPES = {
  PHOTO: 'photo',
  VIDEO: 'video',
  AUDIO: 'audio',
}

const VIDEO_STATUS: VIDEO_STATUS_TYPES = {
  PLAYING: 1, // 播放中
  PAUSE: 2, // 暂停
  STOP: 3, // 停止
}

export {
  TYPE,
  VIDEO_STATUS,
}

