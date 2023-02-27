import { SMap, SMediaCollector } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../language'
import { Toast, LayerUtils } from '../../../../../../utils'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import ToolbarModule from '../ToolbarModule'
import AddData from './AddData'
import { LayerStyle } from 'imobile_for_reactnative/NativeModule/interfaces/data/SCartographyType'

/**
 * containerType为list时，listAction为列表行点击事件
 * @param type
 * @param params {item, section, index}
 * @returns {Promise.<void>}
 */
async function listAction(type, params = {}) {
  if (type === ConstToolType.SM_MAP_ADD) {
    // 数据源和地图列表点击事件
    const _params = ToolbarModule.getParams()
    if (
      params.section &&
      params.section.title ===
        getLanguage(_params.language).Map_Main_Menu.OPEN_DATASOURCE
    ) {
      // 打开数据源
      const _data = await AddData.getData(
        ConstToolType.SM_MAP_ADD_DATASET,
        params.item,
      )

      // const height =
      //   _params.device.orientation.indexOf('LANDSCAPE') === 0
      //     ? ConstToolType.THEME_HEIGHT[3]
      //     : ConstToolType.THEME_HEIGHT[5]
      const data = {
        type,
        getData: AddData.getData,
        lastData: ToolbarModule.getData().data,
        actions,
        // height,
      }
      const { selectList } = ToolbarModule.getData()
      _data.data[0].allSelectType = true
      if (
        selectList &&
        Object.keys(selectList).length > 0 &&
        _data.data.length > 0 &&
        selectList[_data.data[0].title]
      ) {
        for (const item of _data.data[0].data) {
          item.isSelected =
            selectList[_data.data[0].title].indexOf(item.datasetName) >= 0
        }
        Object.assign(data, { selectList: ToolbarModule.getData().selectList })
      }

      _params.showFullMap && _params.showFullMap(true)
      _params.setToolbarVisible(true, ConstToolType.SM_MAP_ADD_DATASET, {
        containerType: ToolbarType.selectableList,
        isFullScreen: true,
        isTouchProgress: false,
        showMenuDialog: false,
        // height,
        data: _data.data,
        buttons: _data.buttons,
      })
      ToolbarModule.addData(data)
    } else if (
      params.section &&
      params.section.title ===
        getLanguage(_params.language).MAP
    ) {
      // 添加地图
      _params.setContainerLoading &&
        _params.setContainerLoading(
          true,
          getLanguage(_params.language).Prompt.LOADING,
        )
      SMap.addMap(params.item.name || params.item.title).then(async result => {
        _params.setContainerLoading && _params.setContainerLoading(false)
        Toast.show(
          result
            ? getLanguage(_params.language).Prompt.ADD_SUCCESS
            : getLanguage(_params.language).Prompt.ADD_MAP_FAILED,
        )
        if (result) {
          await _params.getLayers(-1, async layers => {
            _params.setCurrentLayer(layers.length > 0 && layers[0])

            for (let i = layers.length; i > 0; i--) {
              if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
                await SMap.moveToTop(layers[i].name)
              }
            }
            SMap.refreshMap()
          })
        }
        _params.setToolbarVisible(false)
      })
    } else if (
      params.section &&
      params.section.title === getLanguage(_params.language).Profile.SYMBOL
    ) {
      const filePath = global.homePath + params.item.path
      ToolbarModule.addData({
        currentSymbolFile: filePath,
        lastData: ToolbarModule.getData().data,
      })
      _params.setToolbarVisible(true, ConstToolType.SM_MAP_ADD_SYMBOL_PATH, {
        containerType: ToolbarType.list,
      })
    } else if (
      params.section.title ===
        getLanguage(_params.language).Map_Main_Menu.PLOTS
    ) {
      const labelUDB = `Label_${_params.user.currentUser.userName}#`
      const resultArr = await SMap.addLayers([params.item.datasetName], labelUDB)
      if (resultArr.length > 0) {
        SMap.refreshMap()
        SMediaCollector.showMedia(resultArr[0].name, false)
        Toast.show(getLanguage(global.language).Prompt.ADD_SUCCESS)
        _params.setToolbarVisible(false)
      } else {
        SMap.refreshMap(getLanguage(global.language).Prompt.ADD_FAILED)
      }
    }
  } else if (type === ConstToolType.SM_MAP_ADD_DATASET) {
    // 数据集列表点击事件
    let data = ToolbarModule.getData()
    // if (data && data.selectList) {
    //   data = Object.assign(data.selectList, params.selectList)
    // } else {
    data = Object.assign(data || {}, { selectList: params.selectList })
    // }
    ToolbarModule.addData(data)
  }
}

async function listSelectableAction({ selectList }) {
  ToolbarModule.addData({ selectList })
}

function toolbarBack(type) {
  const _params = ToolbarModule.getParams()
  if (!_params) return
  if (type === ConstToolType.SM_MAP_ADD_SYMBOL_SYMBOLS) {
    ToolbarModule.addData({
      currentSymbolPath: '',
    })
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_ADD_SYMBOL_PATH, {
      containerType: ToolbarType.list,
    })
  } else {
    const _data = ToolbarModule.getData()
    const lastData = _data.lastData || {}
    const { selectList } = _data
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_ADD, {
      isFullScreen: true,
      isTouchProgress: false,
      showMenuDialog: false,
      containerType: ToolbarType.list,
      data: lastData.data,
      buttons: lastData.buttons,
      // height: _data.height,
    })

    ToolbarModule.addData({
      type: ConstToolType.SM_MAP_ADD,
      getData: AddData.getData,
      data: lastData,
      actions,
      selectList,
    })
  }
}

async function commit() {
  const _params = ToolbarModule.getParams()
  const selectList =
    (ToolbarModule.getData() && ToolbarModule.getData().selectList) || []
  if (!_params) return
  if (Object.keys(selectList).length === 0) {
    Toast.show(getLanguage(_params.language).Prompt.PLEASE_SELECT_DATASET_TO_ADD)
    return
  }
  const result = {}
  for (const key of Object.keys(selectList)) {
    const datasetNames = []
    for (const item of selectList[key]) {
      datasetNames.push(item.datasetName)
    }
    if (datasetNames.length === 0) continue
    const resultArr = await SMap.addLayers(datasetNames, key)

    // 找出有默认样式的数据集，并给对应图层设置
    for (let i = 0; i < resultArr.length; i++) {
      const description =
        resultArr[i].description &&
        resultArr[i].description !== 'NULL' &&
        JSON.parse(resultArr[i].description)
      if (description && description.geoStyle) {
        const layerStyle:LayerStyle = description.geoStyle
        layerStyle.MarkerSize = {width:8,height:8}
        await SMap.setLayerStyle(resultArr[i].name||"",layerStyle)
        // await SMap._setLayerStyle(
        //   resultArr[i].name,
        //   JSON.stringify(description.geoStyle),
        // )
      }
    }
    if (resultArr && resultArr.length > 0) result[key] = resultArr
  }

  if (Object.keys(result).length > 0) {
    _params.getLayers(-1, async layers => {
      if (layers.length > 0) {
        _params.setCurrentLayer(layers[0])
        SMap.setLayerEditable(layers[0].path, true)

        for (let i = layers.length; i > 0; i--) {
          if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
            await SMap.moveToTop(layers[i].name)
          }
        }
        SMap.refreshMap()
      }
    })

    _params.setToolbarVisible(false)
    global.prjDialog.setDialogVisible(true)
    Toast.show(getLanguage(_params.language).Prompt.ADD_SUCCESS)
  } else {
    Toast.show(getLanguage(_params.language).Prompt.CHOOSE_DATASET)
  }
}

const onSelectPath = path => {
  const _params = ToolbarModule.getParams()
  let { currentSymbolPath } = ToolbarModule.getData()
  if (!currentSymbolPath) {
    currentSymbolPath = ''
  }
  const symbolPath = currentSymbolPath + '/' + path
  ToolbarModule.addData({
    currentSymbolPath: symbolPath,
  })

  _params.setToolbarVisible(true, ConstToolType.SM_MAP_ADD_SYMBOL_SYMBOLS, {
    containerType: ToolbarType.symbol,
  })
}

const actions = {
  listAction,
  listSelectableAction,
  toolbarBack,
  commit,

  onSelectPath,
}
export default actions
