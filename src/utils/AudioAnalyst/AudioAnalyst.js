import {
  SMap,
  SScene,
} from 'imobile_for_reactnative'
import { AudioKeywords, ChunkType } from '../../constants/index'
import { getLanguage } from '../../language/index'
import { Toast } from '../index'
import AudioSearch from './AudioSearch'

const { keywords } = AudioKeywords

function analyst(content = '') {
  if (!content) return
  content = content.toLowerCase()
  let value = ''
  // let index = -1
  // let type = ''
  const values = Object.values(keywords)
  for (let i = 0; i < values.length; i++) {
    if (values[i].includes(',')) {
      let keys = values[i].split(',')
      for (let j = 0; j < keys.length; j++) {
        if (content.includes(keys[j])) {
          value = values[i]
          break
        }
      }
      if (value) break
    } else if (content.indexOf(values[i]) >= 0) {
      value = values[i]
      break
    }
  }
  let isMapControl = false
  switch (value) {
    case keywords.LOCATION:
      (async function() {
        if (GLOBAL.Type === ChunkType.MAP_3D) {
          await SScene.setHeading()
          // 定位到当前位置
          await SScene.location()
          // await SScene.resetCamera()
          this.mapController.setCompass(0)
        } else {
          SMap.moveToCurrent().then(result => {
            !result &&
              Toast.show(
                getLanguage(this.props.language).Prompt.OUT_OF_MAP_BOUNDS,
              )
          })
        }
        isMapControl = true
      }.bind(this)())
      break
    case keywords.CLOSE:
      GLOBAL.back && GLOBAL.back()
      isMapControl = true
      break
    case keywords.ZOOM_IN:
      SMap.zoom(2)
      isMapControl = true
      break
    case keywords.ZOOM_OUT:
      SMap.zoom(0.5)
      isMapControl = true
      break
  }
  !isMapControl && AudioSearch.search(content)
}

export default {
  analyst,
}
