import MapData from './MapData'
import MapAction from './MapAction'
import utils from './utils'

export default function(type, title) {
  return {
    key: title,
    title: title,
    getData: MapData.getData,
    actions: MapAction,
    getLayout: utils.getLayout,
  }
}
