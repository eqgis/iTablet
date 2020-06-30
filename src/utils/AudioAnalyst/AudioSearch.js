import { AudioKeywords, ChunkType } from '../../constants'
import NavigationService from '../../containers/NavigationService'
import LocateUtils from '../../containers/pointAnalyst/LocateUtils'

const { searchKeys, keywords } = AudioKeywords

function search(content = '') {
  if (!content) return
  content = content.toLowerCase()
  let value = '', key = ''
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
  
  let item = {content: newContent}
  switch (value) {
    // case keywords.SEARCH:
    //   GLOBAL.AudioDialog.setVisible(false)
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
    LocateUtils.SearchCategories({
      ...item,
      radius: 5000,
      is3D: GLOBAL.Type === ChunkType.MAP_3D,
    }, async data => {
      if (data) {
        GLOBAL.AudioDialog.setVisible(false)
      }
      // this.location = location
      // if (GLOBAL.Type !== ChunkType.MAP_3D) {
      //   if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
      //     GLOBAL.TouchType = TouchType.NORMAL
      //     await SMap.clearTrackingLayer()
      //     // this.props.setNavigationChangeAR(true)
      //     this.props.setMapNavigation({
      //       isShow: true,
      //       name: item.title,
      //     })
      //   }
      // }
    })
  } else if (_searchKey) {
    GLOBAL.AudioDialog.setVisible(false)
    NavigationService.navigate('PointAnalyst', {
      type: 'pointSearch',
    })
  }
}

export default {
  search,
}