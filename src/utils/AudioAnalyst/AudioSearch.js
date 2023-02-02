import { AudioKeywords, ChunkType } from '../../constants'
import NavigationService from '../../containers/NavigationService'
import LocateUtils from '../../containers/pointAnalyst/LocateUtils'
import { Audio } from '../../utils'

const { searchKeys, keywords } = AudioKeywords

function search(content = '') {
  if (!content) return
  content = content.toLowerCase()
  let value = '',
    key = ''
  const values = Object.values(searchKeys)
  for (let i = 0; i < values.length; i++) {
    if (values[i].includes(',')) {
      let keys = values[i].split(',')
      for (let j = 0; j < keys.length; j++) {
        if (content.includes(keys[j])) {
          value = values[i]
          key = keys[j]
          break
        }
      }
      if (value) break
    } else if (content.indexOf(values[i]) >= 0) {
      value = values[i]
      key = values[i]
      break
    }
  }

  // 判断关键字 搜索
  let searches = keywords.SEARCH.split(',')
  let newContent = content
  let _searchKey = ''
  for (let item of searches) {
    if (content.indexOf(item) === 0) {
      newContent = content.slice(content.indexOf(item) + item.length)
      _searchKey = item
      break
    }
  }

  let item = { content: newContent }
  switch (value) {
    // case keywords.SEARCH:
    //   global.AudioDialog.setVisible(false)
    //   NavigationService.navigate('PointAnalyst', {
    //     type: 'pointSearch',
    //   })
    //   break
    default:
      if (key !== '') {
        item.title = key
      }
  }

  if (item.title || item.content) {
    LocateUtils.SearchPoiInMapView(
      {
        ...item,
        radius: 5000,
        is3D: global.Type === ChunkType.MAP_3D,
      },
      async data => {
        if (data) {
          Audio.hideAudio()
        }
        // this.location = location
        // if (global.Type !== ChunkType.MAP_3D) {
        //   if (global.Type === ChunkType.MAP_NAVIGATION) {
        //     global.TouchType = TouchType.NORMAL
        //     await SMap.clearTrackingLayer()
        //     // this.props.setNavigationChangeAR(true)
        //     this.props.setMapNavigation({
        //       isShow: true,
        //       name: item.title,
        //     })
        //   }
        // }
      },
    )
  } else if (_searchKey) {
    Audio.hideAudio()
    NavigationService.navigate('PointAnalyst', {
      type: 'pointSearch',
    })
  }
}

export default {
  search,
}
