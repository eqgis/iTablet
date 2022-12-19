import React from 'react'
import { MyDataPage } from '../component'
import {
  SMap,
  EngineType,
  DatasetType,
  SProcess,
  SData,
} from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import { Toast, scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { connect } from 'react-redux'
import ExportList from '../component/ExportList'
import { Platform } from 'react-native'
import NavigationService from '../../../NavigationService'

class MyDataset extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.dataset
    const { params } = this.props.route
    this.datasourceName = params.data.name && params.data.name.substr(0, params.data.name.lastIndexOf('.')) // 加入到工作空间时,数据源的名称,防止同名不同文件的数据源
    this.state = {
      ...this.state,
      shareToLocal: true,
      shareToOnline: false,
      shareToIPortal: false,
      shareToWechat: false,
      title: this.datasourceName, // 数据源文件名称,不一定是数据源的名称
      data: params.data,
    }
    this.from = params.from
    this.showMore = this.from === 'MapView' ? false : undefined
  }

  exportTypes = {
    TIF: 'tif',
    SHP: 'shp',
    MIF: 'mif',
    KML: 'kml',
    KMZ: 'kmz',
    DWG: 'dwg',
    DXF: 'dxf',
    GPX: 'gpx',
    IMG: 'img',
  }

  componentDidMount() {
    this._openDatasource().then(() => this._getSectionData(true))
  }

  componentWillUnmount() {
    if (!this.isAlreadyOpen) {
      if(this.from !== 'MapView'){
        SData.closeDatasource(this.datasourceName)
      }  
    }
    this.container && this.container.setLoading(false)
  }

  _openDatasource = async () => {
    try {
      let datasources = await SData.getDatasources()
      let homePath = await FileTools.appendingHomeDirectory()
      this.isAlreadyOpen = false
      if (datasources.length !== 0) {
        for (let i = 0; i < datasources.length; i++) {
          if (
            datasources[i].server === (homePath + this.state.data.path)
          ) {
            this.datasourceName = datasources[i].alias
            this.isAlreadyOpen = true
            break
          }
        }
      }
      if (!this.isAlreadyOpen) {
        let datasourceParams = {}
        datasourceParams.server = homePath + this.state.data.path
        datasourceParams.engineType = EngineType.UDB
        datasourceParams.alias = this.state.title
        await SData.openDatasource(datasourceParams)
      }
      // let datasourceParams = {}
      // datasourceParams.server = homePath + this.state.data.path
      // datasourceParams.engineType = EngineType.UDB
      // datasourceParams.alias = this.state.title
      // await SMap.openTempDatasource(datasourceParams)
    } catch (error) {
      Toast.show(getLanguage(global.language).Profile.OPEN_DATASROUCE_FAILED)
    }
  }

  getData = async () => {
    let userTempWorkspace = !this.isAlreadyOpen && this.from === 'MapView'
    let dataset = await SData.getDatasetsByDatasource({
      alias: userTempWorkspace ? this.datasourceName : this.state.title,
      server: await FileTools.appendingHomeDirectory(this.state.data.path),
    })
    let data = dataset.list

    let sectionData = []
    sectionData.push({
      title: 'DATASET',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    try {
      if (!this.itemInfo) return false
      let datasetName = this.itemInfo.item.datasetName
      let result  = await SData.deleteDataset(this.datasourceName, datasetName)
      return result
    } catch (e) {
      return false
    }
  }

  exportData = async (name, exportToTemp = true) => {
    let datasetParams = Object.assign({}, this.itemInfo.item)
    let homePath = await FileTools.appendingHomeDirectory()

    //先导出，再根据情况是否打包
    let exportPath = homePath + this.getRelativeExportPath()
    let availableName = await this._getAvailableFileName(
      exportPath,
      name,
      this.exportType,
    )
    /** 单个文件 */
    let filePath = exportPath + availableName
    let result = await SData.exportDataset(
      this.exportType,
      filePath,
      datasetParams,
    )

    if(!result) return false

    if (exportToTemp) {
      let tempPath = homePath + this.getRelativeTempPath()
      let zipName = await this._getAvailableFileName(
        tempPath,
        'MyExport',
        'zip',
      )
      let targetPath = tempPath + zipName

      result = await FileTools.zipFile(filePath, targetPath)
      FileTools.deleteFile(filePath)
      this.exportPath = targetPath
    } else {
      this.exportPath = this.getRelativeExportPath() + availableName
    }

    return result
  }

  showAttribute = () => {
    global.NEEDREFRESHTABLE = true
    NavigationService.navigate('LayerSelectionAttribute',{type:'MY_DATA',datasetName:this.itemInfo.item.datasetName})
  }

  setProjection = () => {
    NavigationService.navigate('ProjectionTargetCoordsPage', {
      title: getLanguage(global.language).Analyst_Labels.PRJCOORDSYS,
      cb: async targetCoords => {
        NavigationService.goBack()
        global.Loading.setLoading(
          true,
          getLanguage(global.language).Profile.SET_PROJECTION,
        )
        let result = false
        //设置数据集投影
        let datasetName = this.itemInfo.item.datasetName
        result = await SProcess.setPrjCoordSys(
          this.datasourceName,
          datasetName,
          targetCoords.value+"",
          !this.isAlreadyOpen && this.from === 'MapView',
        )
        global.Loading.setLoading(false)
        if (result) {
          Toast.show(getLanguage(global.language).Prompt.SETTING_SUCCESS)
        } else {
          Toast.show(getLanguage(global.language).Prompt.SETTING_FAILED)
        }
      },
    })
  }

  buildPyramid = () => {
    let build = async () => {
      try {
        global.Loading.setLoading(
          true,
          getLanguage(global.language).Profile.BUILDING,
        )
        let datasetName = this.itemInfo.item.datasetName
        let result = await SData.buildPyramid(this.datasourceName, datasetName)
        global.Loading.setLoading(false)
        Toast.show(
          result
            ? getLanguage(global.language).Profile.BUILD_SUCCESS
            : getLanguage(global.language).Profile.BUILD_FAILED,
        )
      } catch (e) {
        global.Loading.setLoading(false)
      }
    }
    this.SimpleDialog.set({
      text: getLanguage(global.language).Profile.TIME_SPEND_OPERATION,
      confirmAction: build,
    })
    this.SimpleDialog.setVisible(true)
  }

  updataStatistics = async () => {
    let build = async () => {
      try {
        global.Loading.setLoading(
          true,
          getLanguage(global.language).Profile.BUILDING,
        )
        let datasetName = this.itemInfo.item.datasetName
        let result = await SData.updataStatistics(this.datasourceName, datasetName)
        global.Loading.setLoading(false)
        Toast.show(
          result
            ? getLanguage(global.language).Profile.BUILD_SUCCESS
            : getLanguage(global.language).Profile.BUILD_FAILED,
        )
      } catch (e) {
        global.Loading.setLoading(false)
      }
    }
    this.SimpleDialog.set({
      text: getLanguage(global.language).Profile.TIME_SPEND_OPERATION,
      confirmAction: build,
    })
    this.SimpleDialog.setVisible(true)
  }

  getItemPopupData = () => {
    if(this.itemInfo && this.itemInfo.item.datasetType === DatasetType.TEXT) {
      let customedata = this.getCustomItemPopupData()
      return customedata.concat([
        {
          title:
            getLanguage(global.language).Profile[`DELETE_${this.type}`] ||
            getLanguage(global.language).Profile.DELETE_DATA,
          action: this._onDeleteData,
        },
      ])
    }
    return []
  }

  getCustomItemPopupData = () => {
    let data = [
      {
        title: getLanguage(global.language).Map_Label.ATTRIBUTE,
        action: this.showAttribute,
      },
      {
        title: getLanguage(global.language).Profile.SET_PROJECTION,
        action: this.setProjection,
      },
    ]
    if (
      this.itemInfo &&
      (this.itemInfo.item.datasetType === DatasetType.IMAGE ||
        this.itemInfo.item.datasetType === DatasetType.MBImage)
    ) {
      data.push({
        title: getLanguage(global.language).Profile.DATASET_BUILD_PYRAMID,
        action: this.buildPyramid,
      })
      data.push({
        title: getLanguage(global.language).Profile.DATASET_BUILD_STATISTICS,
        action: this.updataStatistics,
      })
    }
    return data
  }

  getPagePopupData = () => {
    if (this.from === 'MapView') {
      return this.getCustomPagePopupData()
    }
    return []
  }

  getCustomPagePopupData = () => [
    {
      title: getLanguage(global.language).Profile.NEW_DATASET,
      action: () => {
        this._closeModal()
        NavigationService.navigate('NewDataset', {
          title: this.datasourceName,
          userTempWorkspace: !this.isAlreadyOpen && this.from === 'MapView',
          getDatasets: () => this.state.sectionData[0].data,
          refreshCallback: async () => {
            await this._getSectionData()
          },
        })
      },
    },
  ]

  isExportable = itemInfo => {
    let datasetType = itemInfo.item.datasetType
    if (
      datasetType === DatasetType.POINT ||
      datasetType === DatasetType.LINE ||
      datasetType === DatasetType.REGION ||
      datasetType === DatasetType.TEXT ||
      datasetType === DatasetType.CAD ||
      datasetType === DatasetType.IMAGE ||
      datasetType === DatasetType.MBImage ||
      datasetType === DatasetType.GRID
    ) {
      return true
    }
    return false
  }

  showUnableExportDialog = () => {
    this.SimpleDialog.set({
      text: getLanguage(global.language).Profile.DATASET_EXPORT_NOT_SUPPORTED,
    })
    this.SimpleDialog.setVisible(true)
  }

  showSelectExportTypeDialog = () => {
    let data = []
    let datasetType = this.itemInfo.item.datasetType
    switch (datasetType) {
      case DatasetType.IMAGE:
      case DatasetType.MBImage:
      case DatasetType.GRID:
        data.push(this.exportTypes.TIF)
        data.push(this.exportTypes.IMG)
        break
      case DatasetType.CAD:
        if (Platform.OS === 'ios') {
          data.push(this.exportTypes.DWG)
          data.push(this.exportTypes.DXF)
        } else {
          data.push(this.exportTypes.MIF)
        }
        break
      case DatasetType.POINT:
      case DatasetType.LINE:
      case DatasetType.REGION:
      case DatasetType.TEXT:
        data.push(this.exportTypes.SHP)
        if (Platform.OS === 'android') {
          data.push(this.exportTypes.MIF)
        }
        data.push(this.exportTypes.KML)
        data.push(this.exportTypes.KMZ)
        // if (Platform.OS === 'ios') {
        //   data.push(this.exportTypes.DWG)
        //   data.push(this.exportTypes.DXF)
        // }
        if (datasetType === DatasetType.POINT && Platform.OS === 'android') {
          data.push(this.exportTypes.GPX)
        }
        break
      default:
        break
    }
    this.exportType = data[0]
    let dialogHeight =
      scaleSize(130) + Math.ceil(data.length / 2) * scaleSize(70)
    this.SimpleDialog.set({
      text: getLanguage(global.language).Profile.SELECT_DATASET_EXPORT_TYPE,
      confirmAction: async () => {
        if (
          this.exportType === this.exportTypes.KML ||
          this.exportType === this.exportTypes.KMZ ||
          this.exportType === this.exportTypes.GPX
        ) {
          let datasetParams = Object.assign({}, this.itemInfo.item)
          if (!(await SData.isPrgCoordSysWGS1984(datasetParams))) {
            this.SimpleDialog.set({
              text: getLanguage(global.language).Prompt.REQUIRE_PRJ_1984,
              cancelBtnVisible:false,
            })
            this.SimpleDialog.setVisible(true)
            return
          }
        }
        this._onShareData(this.shareType)
      },
      renderExtra: () => this.renderExportList(data),
      dialogStyle: { height: dialogHeight },
      showTitleImage: false,
    })
    this.SimpleDialog.setVisible(true)
  }

  renderExportList = data => {
    return (
      <ExportList
        data={data}
        selectedItem={this.exportType}
        onPress={type => (this.exportType = type)}
      />
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyDataset)
