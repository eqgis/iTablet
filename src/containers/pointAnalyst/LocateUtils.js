import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../NavigationService'
import { Toast, LayerUtils } from '../../utils'
import { getLanguage } from '../../language'

/**
 * zhangxt 2020-10-12 搜索后跳转到mapview显示结果，仅2维地图
 * 类别查询，如景点，医院等
 * @param item {title: '景点', radius: 5000, is3D: false}
 * @param cb
 * @returns {Promise.<void>}
 * @constructor
 */
async function SearchPoiInMapView(item, cb = () => {}) {
  if (!item.is3D) {
    let location = await SMap.getMapcenterPosition()
    this.location = location
    if (global.PoiInfoContainer) {
      global.PoiInfoContainer.setState({
        showList: true,
        location: location,
      })
      global.PoiInfoContainer.getSearchResult(
        {
          keyWords: item.title || item.content,
          location: JSON.stringify(location),
          radius: item.radius || 0,
        },
        data => {
          if (data) {
            NavigationService.navigate('MapStack', {screen: 'MapView'})
            global.PoiInfoContainer.setVisible(true)
            global.PoiTopSearchBar.setVisible(true)
            global.PoiTopSearchBar.setState({
              defaultValue: item.title || item.content,
            })
          }
          cb && cb(data)
        },
      )
    }
  }
}

async function SearchGeoInCurrentLayer(item, cb = () => {}) {
  if (item.is3D) return
  try {
    let result = null
    const key = (item.title || item.content)?.substring(0, 20) || ''
    if (!key) return
    if (global.currentLayer?.path) {
      result = await SMap.searchLayerAttribute(global.currentLayer.path, {
        key: key,
      }, 0, 100)
    }
    let location = await SMap.getMapcenterPosition()
    if (result?.data?.length > 0) {
      NavigationService.getCurrent() !== 'MapStack' && NavigationService.navigate('MapStack', {screen: 'MapView'})

      const resultList = []
      for (const dataItem of result.data) {
        let name, x, y
        for (const _item of dataItem) {
          if (_item.name.toLowerCase() === 'smid' && name === '') {
            name = _item.value
          }
          if (_item.name.toLowerCase() === 'name' || _item.name.toLowerCase() === 'title') {
            name = _item.value
          }
          if (_item.name.toLowerCase() === 'smx') {
            x = parseFloat(_item.value)
          }
          if (_item.name.toLowerCase() === 'smy') {
            y = parseFloat(_item.value)
          }
        }
        let _location = await SMap.translateLocationToLongitudeLatitude({x, y})
        // SMap.getLoca
        resultList.push({
          pointName: name || '',
          x: x,
          y: y,
          address: dataItem.address || `x:${_location.x} y:${_location.y}`,
          distance: getDistance(_location, location),
        })
      }
      resultList.sort(compare('distance')).forEach((dataItem, index) => {
        resultList[index].distance =
        dataItem.distance > 1000
          ? (dataItem.distance / 1000).toFixed(2) + 'km'
          : ~~dataItem.distance + 'm'
      })
      if (resultList.length > 0) {
        await SMap.addCallouts(resultList)
        global.PoiInfoContainer.show()
        global.PoiInfoContainer.setVisible(true, {resultList: resultList, radius: 50000, showList: true})
        global.PoiTopSearchBar.setVisible(true)
        global.PoiTopSearchBar.setState({
          defaultValue: item.title || item.content,
        })
      }

      // {
      //   pointName: item.name,
      //   x: item.location.x,
      //   y: item.location.y,
      //   address: item.address,
      //   distance: getDistance(item.location, location),
      // }

      cb && cb(result)
    } else {
      if (global.PoiInfoContainer) {
        global.PoiInfoContainer.setState({
          showList: true,
          location: location,
        })
        global.PoiInfoContainer.getSearchResult(
          {
            keyWords: item.title || item.content,
            location: JSON.stringify(location),
            radius: item.radius || 0,
          },
          async data => {
            if (data) {
              NavigationService.navigate('MapStack', {screen: 'MapView'})
              global.PoiInfoContainer.setVisible(true)
              global.PoiTopSearchBar.setVisible(true)
              global.PoiTopSearchBar.setState({
                defaultValue: item.title || item.content,
              })
            } else {
              // 没有搜索结果,在当前位置添加callout
              let _location = await SMap.getCurrentPosition()
              const resultList = []
              resultList.push({
                pointName: key || '',
                x: _location.x,
                y: _location.y,
                address: `x:${_location.x} y:${_location.y}`,
                distance: getDistance(_location, location),
              })
              resultList.sort(compare('distance')).forEach((dataItem, index) => {
                resultList[index].distance =
                dataItem.distance > 1000
                  ? (dataItem.distance / 1000).toFixed(2) + 'km'
                  : ~~dataItem.distance + 'm'
              })
              await SMap.addCallouts(resultList)
              NavigationService.navigate('MapStack', {screen: 'MapView'})
              global.PoiInfoContainer.show()
              global.PoiInfoContainer.setVisible(true, {resultList: resultList, radius: 50000, showList: true})
              global.PoiTopSearchBar.setVisible(true)
              global.PoiTopSearchBar.setState({
                defaultValue: item.title || item.content,
              })
              await SMap.toLocationPoint(_location)
            }
            cb && cb(data)
          },
        )
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    __DEV__ && console.warn(error)
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

function compare(prop) {
  return (a, b) => {
    return a[prop] - b[prop]
  }
}

/**
 * zhangxt 2020-10-12
 * @param {*} params 搜索参数 {keyWords: 'abc', location: '{x:123, y:456}', radius: 5000 }
 * @param {*} location 当前位置 { x: 123, y: 456}
 * @param {*} cb 结果通过回调返回，可能为空 {resultList: Array, poiInfos: Array, radius?:Number}
 */
function getSearchResult(params, location, cb = () => {}) {
  let searchStr = ''
  let keys = Object.keys(params)
  keys.map(key => {
    searchStr += `&${key}=${params[key]}`
  })
  let url = `https://www.supermapol.com/iserver/services/localsearch/rest/searchdatas/China/poiinfos.json?&key=tY5A7zRBvPY0fTHDmKkDjjlr${searchStr}`
  //console.warn(url)
  fetch(url)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        // TODO 根据状态提示错误消息
        return {error: response.status}
      }
    })
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
                resultList.sort(compare('distance')).forEach((item, index) => {
                  resultList[index].distance =
                    item.distance > 1000
                      ? (item.distance / 1000).toFixed(2) + 'km'
                      : ~~item.distance + 'm'
                })
                cb &&
                  cb({
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
          cb &&
            cb({
              resultList,
              poiInfos,
            })
        }
      }
    })
}

export default {
  SearchPoiInMapView,
  SearchGeoInCurrentLayer,
  getSearchResult,
}
