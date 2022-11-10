/**
 * 声音工具类
 *
 * author: yangsl
 */
import Sound from "react-native-sound"

const sounds: {[key: string]: Sound} = {}

type Callback = () => void

function setSound(key: string, soundName: string, basePath: string) {
  if (sounds[key]) {
    sounds[key]?.stop?.()
    sounds[key]?.release?.()
  }
  sounds[key] = new Sound(soundName, basePath)
  return sounds[key]
}

function setCategory(key: string, value: "Ambient" | "SoloAmbient" | "Playback" | "Record" | "PlayAndRecord" | "AudioProcessing" | "MultiRoute" | "Alarm") {
  if (sounds[key]) {
    sounds[key]?.setCategory?.(value)
  }
}

function play(key: string, repeat?: boolean, params?: {
  /** 声音播放后执行 */
  afterAction?: Callback,
  /** 声音播放前执行 */
  preAction?: Callback,
}) {
  if (sounds[key]) {
    sounds[key].stop()
    sounds[key].play((success: boolean) => {
      if (success) {
        repeat && play(key, repeat, params)
      }
      !repeat && params?.afterAction?.()
    })
    params?.preAction?.()
  }
}

function pause(key: string) {
  if (sounds[key]) {
    sounds[key].pause()
  }
}

function stop(key: string, action?: Callback) {
  if (sounds[key]) {
    sounds[key].stop(()=> {
      action?.()
    })
  }
}

function release(key: string) {
  if (sounds[key]) {
    sounds[key].stop()
    sounds[key].release()
  }
}

function stopAll() {
  const keys = Object.keys(sounds)
  for (const key of keys) {
    if (sounds[key] && sounds[key] instanceof Sound) {
      sounds[key].stop()
    }
  }
}

function pauseAll() {
  const keys = Object.keys(sounds)
  for (const key of keys) {
    if (sounds[key] && sounds[key] instanceof Sound) {
      sounds[key].pause()
    }
  }
}

function releaseAll() {
  const keys = Object.keys(sounds)
  for (const key of keys) {
    if (sounds[key] && sounds[key] instanceof Sound) {
      sounds[key].stop()
      sounds[key].release()
    }
  }
}

function isPlaying(key: string) {
  if (sounds[key]) {
    return sounds[key].isPlaying()
  }
}

export {
  setSound,
  setCategory,
  play,
  pause,
  stop,
  release,
  stopAll,
  pauseAll,
  releaseAll,
  isPlaying,
}