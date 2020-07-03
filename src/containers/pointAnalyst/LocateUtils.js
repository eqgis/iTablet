import { SScene, SMap } from 'imobile_for_reactnative'
import NavigationService from '../NavigationService'
import { Toast } from '../../utils'
import { getLanguage } from '../../language'

/**
 * 类别查询，如景点，医院等
 * @param item {title: '景点', radius: 5000, is3D: false}
 * @param cb
 * @returns {Promise.<void>}
 * @constructor
 */
async function SearchCategories (item, cb = () => {}) {
  if (!item.is3D) {
    let location = await SMap.getMapcenterPosition()
    this.location = location
    if (GLOBAL.PoiInfoContainer) {
      GLOBAL.PoiInfoContainer.setState({
        showList: true,
        location: location,
      })
      GLOBAL.PoiInfoContainer.getSearchResult(
        {
          keyWords: item.title || item.content,
          location: JSON.stringify(location),
          radius: item.radius || 0,
        },
        data => {
          if (data) {
            NavigationService.navigate('MapView')
            GLOBAL.PoiInfoContainer.setVisible(true)
            GLOBAL.PoiTopSearchBar.setVisible(true)
            GLOBAL.PoiTopSearchBar.setState({ defaultValue: item.title || item.content })
          }
          cb && cb(data)
        },
      )
    }
  } else {
    let location = await SScene.getSceneCenter()
    cb && cb(location)
    getSearchResult({
      keyWords: item.title,
      location: JSON.stringify(location),
      radius: item.radius || 0,
    })
  }
}

function getDistance(p1, p2) {
  //经纬度差值转距离 单位 m
  let R = 6371393
  return Math.abs(
    ((p2.x - p1.x) *
    Math.PI *
    R *
    Math.cos((((p2.y + p1.y) / 2) * Math.PI) / 180)) /
    180,
  )
}

compare = prop => (a, b) => {
  return a[prop] - b[prop]
}

function getSearchResult(params, location, cb = () => {}) {
  let searchStr = ''
  let keys = Object.keys(params)
  keys.map(key => {
    searchStr += `&${key}=${params[key]}`
  })
  let url = `http://www.supermapol.com/iserver/services/localsearch/rest/searchdatas/China/poiinfos.json?&key=tY5A7zRBvPY0fTHDmKkDjjlr${searchStr}`
  //console.warn(url)
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.error || data.poiInfos.length === 0) {
        Toast.show(getLanguage(global.language).Prompt.NO_SEARCH_RESULTS)
        cb && cb()
      } else {
        let poiInfos = data.poiInfos
        if (poiInfos.length < 10 && url.indexOf('radius=5000') !== -1) {
          fetch(url.replace('radius=5000', 'radius=50000'))
            .then(response => response.json())
            .then(data2 => {
              if (data.error || data.poiInfos.length === 0) {
                Toast.show(
                  getLanguage(global.language).Prompt.NO_SEARCH_RESULTS,
                )
              } else {
                poiInfos = data2.poiInfos
                let resultList = poiInfos.map(item => {
                  return {
                    pointName: item.name,
                    x: item.location.x,
                    y: item.location.y,
                    address: item.address,
                    distance: getDistance(item.location, location),
                  }
                })
                resultList
                  .sort(compare('distance'))
                  .forEach((item, index) => {
                    resultList[index].distance =
                      item.distance > 1000
                        ? (item.distance / 1000).toFixed(2) + 'km'
                        : ~~item.distance + 'm'
                  })
                cb && cb({
                  resultList,
                  poiInfos,
                  radius: 50000,
                })
              }
            })
        } else {
          let resultList = poiInfos.map(item => {
            return {
              pointName: item.name,
              x: item.location.x,
              y: item.location.y,
              address: item.address,
              distance: getDistance(item.location, location),
            }
          })
          resultList.sort(compare('distance')).forEach((item, index) => {
            resultList[index].distance =
              item.distance > 1000
                ? (item.distance / 1000).toFixed(2) + 'km'
                : ~~item.distance + 'm'
          })
          cb && cb({
            resultList,
            poiInfos,
          })
        }
      }
    })
}

export default {
  SearchCategories,
  getSearchResult,
}