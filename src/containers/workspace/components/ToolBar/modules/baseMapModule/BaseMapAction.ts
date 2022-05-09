import { SMap } from 'imobile_for_reactnative'
import { OpenData } from '../../../../../../constants'

/**
 * containerType为list时，listAction为列表行点击事件
 * @param type
 * @param params {item, section, index}
 * @returns {Promise.<void>}
 */
async function listAction(type: string, params: any) {
  try {
    switch (params.item.type) {
      case 'Dataset':
        addLayers(params)
        break
      case 'Datasource':
        OpenData(params.item, params.item.layerIndex)
        break
    }
  } catch(e) {
    console.error(e.message)
  }
}

async function addLayers(params: any) {
  try {
    let result = await SMap.removeAllLayer()
    if (result) {
      await SMap.addLayers([params.item.data.datasetName], params.item.data.datasourceName)
    }
  } catch(e) {
    console.error(e.message)
  }
}

const actions = {
  listAction,
}
export default actions
