import { FileTools, SMap, FileInfo  } from 'imobile_for_reactnative'
import { Platform } from 'react-native'
import { ExternalDataType } from '@/types'
import { ConstPath } from '@/constants'


interface FileDetailInfo extends FileInfo {
  /** 当为文件夹时其中的内容,当为文件时是空数组 */
  contentList: FileDetailInfo[]
  /** 是否已扫描过 */
  check?: boolean
  /** 工作空间文件详细信息 */
  wsInfo?: SMap.WorkspaceInfo
}

export interface IExternalData {
  /** 所在文件夹路径 */
  directory: string
  fileName: string
  /** 文件路径 */
  filePath: string
  /** 数据类型 */
  fileType: ExternalDataType
  /** 工作空间详细信息 */
  wsInfo?: SMap.WorkspaceInfo
  /** 工作空间等的其他相关文件 */
  relatedFiles?: RelatedFiles
  id?:number
}

type UncheckedFiles = Array<string>
type RelatedFiles = Array<string>

/**
 * 判断所有文件类型，优先级：
 * 1.External/Plotting中的标绘模版
 * 2.2维工作空间 smwu和关联udb，还存在3维scene时不check
 * 3.3维工作空间 sxwu和关联文件夹，符号库
 * 4.其他udb，符号等
 */
async function getExternalData(path: string, types:ExternalDataType[]= [], uncheckedChildFileList = []) {
  let resultList: IExternalData[] = []
  try {
    if (path.lastIndexOf('/') === path.length - 1) {
      path = path.substring(0, path.length - 1)
    }
    const contentList = await _getDirectoryContentDeep(path)

    let PL:IExternalData[] = []
    let WS:IExternalData[] = []
    let WS3D:IExternalData[] = []
    let DS:IExternalData[] = []
    let SCI:IExternalData[] = []
    let TIF:IExternalData[] = []
    let SHP:IExternalData[] = []
    let MIF:IExternalData[] = []
    let KML:IExternalData[] = []
    let KMZ:IExternalData[] = []
    let DWG:IExternalData[] = []
    let DXF:IExternalData[] = []
    let GPX:IExternalData[] = []
    let IMG:IExternalData[] = []
    let COLOR:IExternalData[] = []
    let SYMBOL:IExternalData[] = []
    let AIMODEL:IExternalData[] = []
    let SANDTABLE:IExternalData[] = []
    let ARMODEL:IExternalData[] = []
    let ARMAP:IExternalData[] = []
    let AREFFECT:IExternalData[] = []
    // 专题制图导出的xml
    let Xml_Template:IExternalData[] = []

    // 过滤临时文件： ~[0]@xxxx
    _checkTempFile(contentList)

    if(types.length === 0 || types.indexOf('plotting') > -1) {
      PL = getPLList(path, contentList)
    }
    if(types.length === 0 || types.indexOf('armap') > -1) {
      ARMAP = await getARMAPList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('workspace') > -1) {
      WS = await getWSList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('workspace3d') > -1) {
      WS3D = await getWS3DList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('datasource') > -1) {
      DS = getDSList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('symbol') > -1) {
      SYMBOL = getSymbolList(path, contentList)
    }
    if(types.length === 0 || types.indexOf('aimodel') > -1) {
      AIMODEL = getAIModelList(path, contentList)
    }
    if(types.length === 0 || types.indexOf('sandtable') > -1) {
      SANDTABLE = getARSandTableList(path, contentList)
    }
    if(types.length === 0 || types.indexOf('armodel') > -1) {
      ARMODEL = getARModelList(path, contentList)
    }
    if(types.length === 0 || types.indexOf('areffect') > -1) {
      AREFFECT = getAREffectList(path, contentList)
    }
    if(types.length === 0 || types.indexOf('sci') > -1) {
      SCI = getSCIDSList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('tif') > -1) {
      TIF = getTIFList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('shp') > -1) {
      SHP = getSHPList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('mif') > -1) {
      MIF = getMIFList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('kml') > -1) {
      KML = getKMLList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('kmz') > -1) {
      KMZ = getKMZList(path, contentList, uncheckedChildFileList)
    }
    if (Platform.OS === 'ios') {
      if(types.length === 0 || types.indexOf('dwg') > -1) {
        DWG = getDWGList(path, contentList, uncheckedChildFileList)
      }
      if(types.length === 0 || types.indexOf('dxf') > -1) {
        DXF = getDXFList(path, contentList, uncheckedChildFileList)
      }
    }
    if(types.length === 0 || types.indexOf('gpx') > -1) {
      GPX = getGPXList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('img') > -1) {
      IMG = getIMGList(path, contentList, uncheckedChildFileList)
    }
    if(types.length === 0 || types.indexOf('color') > -1) {
      COLOR = getColorList(path, contentList)
    }
    if(types.length === 0 || types.indexOf('xml_template') > -1) {
      Xml_Template = getXmlTemplateList(path, contentList, uncheckedChildFileList)
    }

    resultList = resultList
      .concat(PL)
      .concat(WS)
      .concat(WS3D)
      .concat(DS)
      .concat(SCI)
      .concat(TIF)
      .concat(SHP)
      .concat(MIF)
      .concat(KML)
      .concat(KMZ)
      .concat(DWG)
      .concat(DXF)
      .concat(GPX)
      .concat(IMG)
      .concat(COLOR)
      .concat(SYMBOL)
      .concat(AIMODEL)
      .concat(Xml_Template)
      .concat(ARMAP)
      .concat(AREFFECT)
      .concat(SANDTABLE)
      .concat(ARMODEL)
    return resultList
  } catch (e) {
    // console.log(e)
    return resultList
  }
}


async function deleteExternalData(data: IExternalData) {
  const homePath = await FileTools.getHomeDirectory()
  const externalPath = homePath + ConstPath.ExternalData
  let dirs: string[] = []
  if((data.fileType === 'workspace' || data.fileType === 'workspace3d')&& data.directory !== externalPath) {
    dirs = [data.directory]
  } else {
    dirs = [data.filePath]
    if(data.relatedFiles && data.relatedFiles.length > 0) {
      dirs = dirs.concat(data.relatedFiles)
    }
  }

  let result = false
  for (let i = 0; i < dirs.length; i++) {
    if (await FileTools.fileIsExist(dirs[i])) {
      result = await FileTools.deleteFile(dirs[i])
      if (!result) {
        break
      }
    }
  }

  //删除空文件夹
  if (data.directory !== externalPath && await FileTools.fileIsExist(data.directory)) {
    const contents = await FileTools.getDirectoryContent(
      data.directory,
    )
    if (contents.length === 0) {
      await FileTools.deleteFile(data.directory)
    }
  }

  return result
}

/** 获取标绘模版 */
function getPLList(path: string, contentList: FileDetailInfo[],) {
  let PL: IExternalData[] = []
  const relatedFiles: RelatedFiles = []
  try {
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'directory') {
        if(_isPlotDir(contentList[i].contentList)) {
          _checkPlotDir(relatedFiles, `${path}/${contentList[i].name}` ,contentList[i].contentList)
          PL.push({
            filePath: `${path}/${contentList[i].name}`,
            fileName: contentList[i].name,
            directory: path,
            fileType: 'plotting',
            relatedFiles,
          })
        } else {
          PL = PL.concat(
            getPLList(
              `${path}/${contentList[i].name}`,
              contentList[i].contentList,
            ),
          )
        }
      }
    }
    return PL
  } catch (error) {
    // console.log(error)
    return PL
  }
}

/** 获取二维工作空间 */
async function getWSList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let WS: IExternalData[] = []
  const relatedFiles: RelatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isWorkspace(contentList[i].name)) {
          // 检查工作空间类型，3维工作空间跳出；同时存在3维scence时不check
          const wsInfo = await _getLocalWorkspaceInfo(
            `${path}/${contentList[i].name}`,
          )
          contentList[i].wsInfo = wsInfo
          if (wsInfo.maps.length === 0 && wsInfo.scenes.length === 0) {
            contentList[i].check = true
            continue
          } else if (wsInfo.maps.length === 0 && wsInfo.scenes.length !== 0) {
            continue
          } else if (wsInfo.scenes.length === 0) {
            contentList[i].check = true
          }
          const relatedDatasources = wsInfo.datasources
          _checkDatasources(
            relatedFiles,
            relatedDatasources,
            path,
            contentList,
            uncheckedChildFileList,
          )
          WS.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'workspace',
            relatedFiles,
            wsInfo: contentList[i].wsInfo,
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        WS = WS.concat(
          await getWSList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return WS
  } catch (e) {
    // console.log(e)
    return WS
  }
}

/** 获取三维工作空间 */
async function getWS3DList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let WS3D: IExternalData[] = []
  const relatedFiles: RelatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isWorkspace(contentList[i].name)) {
          // 过滤2维工作空间后，剩下的都是3维工作空间或包含3维的工作空间
          contentList[i].check = true
          // 过滤udb
          const wsInfo = contentList[i].wsInfo
          if(wsInfo) {
            _checkDatasources(
              relatedFiles,
              wsInfo.datasources,
              path,
              contentList,
              uncheckedChildFileList,
            )
            _checkRelated3DSymbols(
              relatedFiles,
              wsInfo.scenes,
              path,
              contentList,
            )
          }

          //三维图层不再过滤 add xiezhy
          // 获取3维缓存图层的信息
          // const layerInfo = await _getLayerInfo3D(
          //   `${path}/${contentList[i].name}`,
          //   path,
          // )
          // _checkRelated3DLayer(
          //   relatedFiles,
          //   layerInfo,
          //   path,
          //   contentList,
          //   uncheckedChildFileList,
          // )
          _checkFlyingFiles(relatedFiles, path, contentList)
          //if (layerInfo.length !== 0)
          _checkWS3DKML(relatedFiles, path, contentList)
          {
            WS3D.push({
              directory: path,
              fileName: contentList[i].name,
              filePath: `${path}/${contentList[i].name}`,
              fileType: 'workspace3d',
              relatedFiles,
              wsInfo: contentList[i].wsInfo,
            })
          }
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        WS3D = WS3D.concat(
          await getWS3DList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return WS3D
  } catch (error) {
    // console.log(error)
    return WS3D
  }
}

// 过滤掉三维工作空间下的kml
function _checkWS3DKML(relatedFiles: RelatedFiles, path: string, contentList:FileDetailInfo[]){
  for(let i = 0; i < contentList.length; i++){
    if(contentList[i].type === 'file' && contentList[i].name.indexOf('.kml') > 0){
      contentList[i].check = true
      relatedFiles.push(`${path}/${contentList[i].name}`)
    }
  }
}

/** 获取SCI数据源 */
function getSCIDSList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let DS: IExternalData[] = []
  const relatedFiles: RelatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isSCIDatasource(contentList[i].name)) {
          contentList[i].check = true
          DS.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'sci',
            relatedFiles,
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        DS = DS.concat(
          getSCIDSList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return DS
  } catch (error) {
    // console.log(error)
    return DS
  }
}
/** 获取数据源 */
function getDSList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let DS: IExternalData[] = []
  const relatedFiles: RelatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isDatasource2(contentList[i].name)) {
          contentList[i].check = true
          // 获取同名udd等
          _checkRelatedDS(relatedFiles, contentList[i].name, path, contentList)
          DS.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'datasource',
            relatedFiles,
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        DS = DS.concat(
          getDSList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return DS
  } catch (error) {
    // console.log(error)
    return DS
  }
}

function getTIFList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let TIF: IExternalData[] = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isTIF(contentList[i].name)) {
          contentList[i].check = true
          TIF.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'tif',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        TIF = TIF.concat(
          getTIFList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return TIF
  } catch (error) {
    return TIF
  }
}

function getSHPList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let SHP: IExternalData[] = []
  const relatedFiles: RelatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isSHP(contentList[i].name)) {
          contentList[i].check = true
          _checkRelatedSHP(relatedFiles, contentList[i].name, path, contentList)
          SHP.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'shp',
            relatedFiles,
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        SHP = SHP.concat(
          getSHPList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return SHP
  } catch (error) {
    return SHP
  }
}

function getMIFList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let MIF: IExternalData[] = []
  const relatedFiles: RelatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isMIF(contentList[i].name)) {
          contentList[i].check = true
          _checkRelatedMIF(relatedFiles, contentList[i].name, path, contentList)
          MIF.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'mif',
            relatedFiles,
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        MIF = MIF.concat(
          getMIFList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return MIF
  } catch (error) {
    return MIF
  }
}

function getKMLList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let KML: IExternalData[] = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isKML(contentList[i].name)) {
          contentList[i].check = true
          KML.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'kml',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        KML = KML.concat(
          getKMLList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return KML
  } catch (error) {
    return KML
  }
}

function getKMZList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let KMZ: IExternalData[] = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isKMZ(contentList[i].name)) {
          contentList[i].check = true
          KMZ.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'kmz',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        KMZ = KMZ.concat(
          getKMZList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return KMZ
  } catch (error) {
    return KMZ
  }
}

function getDWGList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let DWG: IExternalData[] = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isDWG(contentList[i].name)) {
          contentList[i].check = true
          DWG.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'dwg',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        DWG = DWG.concat(
          getDWGList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return DWG
  } catch (error) {
    return DWG
  }
}

function getDXFList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let DXF: IExternalData[] = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isDXF(contentList[i].name)) {
          contentList[i].check = true
          DXF.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'dxf',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        DXF = DXF.concat(
          getDXFList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return DXF
  } catch (error) {
    return DXF
  }
}

function getGPXList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let GPX: IExternalData[] = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isGPX(contentList[i].name)) {
          contentList[i].check = true
          GPX.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'gpx',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        GPX = GPX.concat(
          getGPXList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return GPX
  } catch (error) {
    return GPX
  }
}

function getIMGList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let IMG: IExternalData[] = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isIMG(contentList[i].name)) {
          contentList[i].check = true
          IMG.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'img',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        IMG = IMG.concat(
          getIMGList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return IMG
  } catch (error) {
    return IMG
  }
}

function getColorList(path: string, contentList: FileDetailInfo[]) {
  let COLOR: IExternalData[] = []
  try {
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isColor(contentList[i].name)) {
          contentList[i].check = true
          COLOR.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'color',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        COLOR = COLOR.concat(
          getColorList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
          ),
        )
      }
    }
    return COLOR
  } catch (error) {
    return COLOR
  }
}

function getSymbolList(path: string, contentList: FileDetailInfo[]) {
  let SYMBOL: IExternalData[] = []
  try {
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isSymbol(contentList[i].name)) {
          contentList[i].check = true
          SYMBOL.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'symbol',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        SYMBOL = SYMBOL.concat(
          getSymbolList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
          ),
        )
      }
    }
    return SYMBOL
  } catch (error) {
    return SYMBOL
  }
}

function getAIModelList(path: string, contentList: FileDetailInfo[]) {
  let AIModel: IExternalData[] = []
  const relatedFiles: RelatedFiles = []
  try {
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isAIModel(contentList[i].name)) {
          contentList[i].check = true
          _checkRelatedAIModel(
            relatedFiles,
            contentList[i].name,
            path,
            contentList,
          )
          AIModel.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'aimodel',
            relatedFiles,
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        AIModel = AIModel.concat(
          getAIModelList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
          ),
        )
      }
    }
    return AIModel
  } catch (error) {
    return AIModel
  }
}

function getAREffectList (path: string, contentList: FileDetailInfo[]) {
  let AREFFECT: IExternalData[] = []
  try {
    for(let item of contentList) {
      if(item.check) continue
      if(item.type === 'file' && _isAREffect(item.name)) {
        item.check = true
        AREFFECT.push({
          directory: path,
          fileName: item.name,
          filePath: `${path}/${item.name}`,
          fileType: 'areffect',
        })
      } else if(item.type === 'directory') {
        AREFFECT = AREFFECT.concat(getAREffectList(`${path}/${item.name}`, item.contentList))
      }
    }
    return AREFFECT
  } catch(err){
    return AREFFECT
  }
}


function getARSandTableList(path: string, contentList: FileDetailInfo[]) {
  let SANDTABLE: IExternalData[] = []
  const relatedFiles: RelatedFiles = []
  try {
    for(let i = 0; i < contentList.length; i++) {
      if(contentList[i].check) continue
      if(contentList[i].type === 'file') {
        if(_isSandTable(contentList[i].name)) {
          contentList[i].check = true
          //todo 从xml中读取每个glb名称再去查找
          _checkRelatedSandTableModel(
            relatedFiles,
            path,
            contentList
          )
          SANDTABLE.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'sandtable',
            relatedFiles
          })
        }
      } else if(contentList[i].type === 'directory') {
        SANDTABLE = SANDTABLE.concat(getARSandTableList(`${path}/${contentList[i].name}`, contentList[i].contentList))
      }
    }
    return SANDTABLE
  } catch(err){
    console.warn(err)
    return SANDTABLE
  }
}

function getARModelList(path: string, contentList: FileDetailInfo[]) {
  let ARMODEL: IExternalData[] = []
  try {
    for(let item of contentList) {
      if(item.check) continue
      if(item.type === 'file' && _isType(item.name, ['glb'])) {
        item.check = true
        ARMODEL.push({
          directory: path,
          fileName: item.name,
          filePath: `${path}/${item.name}`,
          fileType: 'armodel',
        })
      } else if(item.type === 'directory') {
        ARMODEL = ARMODEL.concat(getARModelList(`${path}/${item.name}`, item.contentList))
      }
    }
    return ARMODEL
  } catch(err){
    return ARMODEL
  }
}

/** 获取AR地图 */
function getARMAPList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let DATA: IExternalData[] = []
  const relatedFiles: RelatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let item of contentList) {
      if (!item.check && item.type === 'file') {
        if (_isARMap(item.name)) {
          item.check = true
          // 获取数据源
          _checkARDatasource(relatedFiles, path, contentList)
          // 获取resource
          _checkARResource(relatedFiles, path, contentList)
          DATA.push({
            directory: path,
            fileName: item.name,
            filePath: `${path}/${item.name}`,
            fileType: 'armap',
            relatedFiles,
          })
        }
      } else if (!item.check && item.type === 'directory') {
        DATA = DATA.concat(
          getARMAPList(
            `${path}/${item.name}`,
            item.contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return DATA
  } catch(e) {
    return DATA
  }
}

function getXmlTemplateList(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  let DATA: IExternalData[] = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isXmlTemplate(contentList[i].name)) {
          contentList[i].check = true
          DATA.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: `${path}/${contentList[i].name}`,
            fileType: 'xml_template',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        DATA = DATA.concat(
          getXmlTemplateList(
            `${path}/${contentList[i].name}`,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return DATA
  } catch (error) {
    return DATA
  }
}

function _checkPlotDir(relatedFiles: RelatedFiles, path: string, contentList: FileDetailInfo[]) {
  for (let i = 0; i < contentList.length; i++) {
    if (!contentList[i].check && contentList[i].type === 'directory') {
      if(contentList[i].name === 'Symbol' || contentList[i].name === 'SymbolIcon') {
        contentList[i].check = true
        relatedFiles.push(`${path}/${contentList[i].name}`)
      }
    }
  }
}

// async function _checkRelatedARDS(relatedFiles, name, path, contentList) {
//   try {
//     const mapXml = await RNFS.readFile(`${path}/${name}`)
//     const $ = cheerio.load(mapXml)
//     const nodes = $('DatasourceServer')
//     const datasourceArr = []
//     for(let i = 0; i < nodes.length; i++) {
//       const datasourceNode = nodes[i].children[0]
//       const datasource = datasourceNode
//       datasourceArr.push(datasource.nodeValue)
//     }
//     for (let i = 0; i < contentList.length; i++) {
//       if (!contentList[i].check && contentList[i].type === 'file') {
//         for(let n = 0; n < datasourceArr.length; n ++) {
//           const index = contentList[i].name.lastIndexOf('.')
//           let nameNoExt =  contentList[i].name
//           if(index > 0) {
//             nameNoExt = contentList[i].name.substring(0, index)
//           }
//           if(datasourceArr[n].indexOf(nameNoExt) === 0) {
//             contentList[i].check = true
//             relatedFiles.push(`${path}/${contentList[i].name}`)
//           }
//         }
//       }
//     }
//   } catch(e) {
//     // console.warn(e)
//   }
// }

function _checkARDatasource(relatedFiles: RelatedFiles, path: string, contentList:FileDetailInfo[]) {
  for (let i = 0; i < contentList.length; i++) {
    if (!contentList[i].check && contentList[i].type === 'directory' && contentList[i].name === 'Datasource') {
      contentList[i].check = true
      relatedFiles.push(`${path}/${contentList[i].name}`)
      break
    }
  }
}

function _checkARResource(relatedFiles: RelatedFiles, path: string, contentList:FileDetailInfo[]) {
  for (let i = 0; i < contentList.length; i++) {
    if (!contentList[i].check && contentList[i].type === 'directory' && contentList[i].name === 'Resource') {
      contentList[i].check = true
      relatedFiles.push(`${path}/${contentList[i].name}`)
      break
    }
  }
}

/**
 * 检查同级目录下的相关数据源(UDB)
 * 其他文件夹下的文件加入uncheckedChildFileList
 */
function _checkDatasources(
  relatedFiles: RelatedFiles,
  relatedDatasources: Array<{alias: string, server: string}>,
  path: string,
  contentList: FileDetailInfo[],
  uncheckedChildFileList: UncheckedFiles,
) {
  try {
    for (let n = 0; n < relatedDatasources.length; n++) {
      const ServerPathNoExt = relatedDatasources[n].server.substring(
        0,
        relatedDatasources[n].server.lastIndexOf('.'),
      )
      let type = relatedDatasources[n].server.substring(
        relatedDatasources[n].server.lastIndexOf('.') + 1,
      )
      if (type === 'udb') {
        relatedFiles.push(`${ServerPathNoExt}.udb`)
        relatedFiles.push(`${ServerPathNoExt}.udd`)
      } else {
        relatedFiles.push(relatedDatasources[n].server)
      }
      let datasourceChecked = false
      for (let i = 0; i < contentList.length; i++) {
        if (!contentList[i].check && contentList[i].type === 'file') {
          if (
            `${path}/${contentList[i].name}` === `${ServerPathNoExt}.udb` ||
            `${path}/${contentList[i].name}` === `${ServerPathNoExt}.udd` ||
            `${path}/${contentList[i].name}` === relatedDatasources[n].server
          ) {
            contentList[i].check = true
            datasourceChecked = true
          }
        }
      }
      if (!datasourceChecked) {
        uncheckedChildFileList.push(relatedDatasources[n].server)
      }
    }
  } catch (error) {
    // console.log(error)
  }
}

// function _checkRelated3DLayer(
//   relatedFiles,
//   layerInfo,
//   path,
//   contentList,
//   uncheckedChildFileList,
// ) {
//   try {
//     for (let n = 0; n < layerInfo.length; n++) {
//       relatedFiles.push(layerInfo[n].path)
//       let layerChecked = false
//       for (let i = 0; i < contentList.length; i++) {
//         if (!contentList[i].check && contentList[i].type === 'directory') {
//           if (`${path}/${contentList[i].name}` === layerInfo[n].path) {
//             contentList[i].check = true
//             layerChecked = true
//             break
//           }
//         }
//       }
//       if (!layerChecked) {
//         uncheckedChildFileList.push(layerInfo[n].path)
//       }
//     }
//   } catch (error) {
//     // console.log(error)
//   }
// }

// 关联当前文件夹下所有和场景同名的符号
function _checkRelated3DSymbols(relatedFiles: RelatedFiles, scenes: string[], path: string, contentList: FileDetailInfo[]) {
  for (let n = 0; n < scenes.length; n++) {
    for (let i = 0; i < contentList.length; i++) {
      if (
        !contentList[i].check &&
        contentList[i].type === 'file' &&
        _isSymbol(contentList[i].name)
      ) {
        const symName = contentList[i].name.substring(
          0,
          contentList[i].name.lastIndexOf('.'),
        )
        if (symName === scenes[n]) {
          contentList[i].check = true
          relatedFiles.push(`${path}/${contentList[i].name}`)
        }
      }
    }
  }
}

function _checkFlyingFiles(relatedFiles: RelatedFiles, path: string, contentList: FileDetailInfo[]) {
  for (let i = 0; i < contentList.length; i++) {
    if (
      !contentList[i].check &&
      contentList[i].type === 'file' &&
      _isFlyingFile(contentList[i].name)
    ) {
      contentList[i].check = true
      relatedFiles.push(`${path}/${contentList[i].name}`)
    }
  }
}

function _checkRelatedDS(relatedFiles: RelatedFiles, name: string, path: string, contentList: FileDetailInfo[]) {
  for (let i = 0; i < contentList.length; i++) {
    if (
      !contentList[i].check &&
      contentList[i].type === 'file' &&
      _isRelatedDS(name, contentList[i].name)
    ) {
      contentList[i].check = true
      relatedFiles.push(`${path}/${contentList[i].name}`)
    }
  }
}

// 关联同名的其他shp文件
function _checkRelatedSHP(relatedFiles: RelatedFiles, name: string, path: string, contentList: FileDetailInfo[]) {
  for (let i = 0; i < contentList.length; i++) {
    if (
      !contentList[i].check &&
      contentList[i].type === 'file' &&
      _isRelatedSHP(name, contentList[i].name)
    ) {
      contentList[i].check = true
      relatedFiles.push(`${path}/${contentList[i].name}`)
    }
  }
}

function _checkRelatedMIF(relatedFiles: RelatedFiles, name: string, path: string, contentList: FileDetailInfo[]) {
  for (let i = 0; i < contentList.length; i++) {
    if (
      !contentList[i].check &&
      contentList[i].type === 'file' &&
      _isRelatedMIF(name, contentList[i].name)
    ) {
      contentList[i].check = true
      relatedFiles.push(`${path}/${contentList[i].name}`)
    }
  }
}

function _checkRelatedAIModel(relatedFiles: RelatedFiles, name: string, path: string, contentList: FileDetailInfo[]) {
  for (let i = 0; i < contentList.length; i++) {
    if (
      !contentList[i].check &&
      contentList[i].type === 'file' &&
      _isRelatedAIModel(name, contentList[i].name)
    ) {
      contentList[i].check = true
      relatedFiles.push(`${path}/${contentList[i].name}`)
    }
  }
}

/**
 * 检查此文件夹内是否包含 Symbol 和 SymbolIcon 文件夹
 * 且 Symbol 文件夹含有 plot 文件
 */
function _isPlotDir(contentList: FileDetailInfo[]) {
  let hasIcon = false
  let plots = []
  for (let i = 0; i < contentList.length; i++) {
    if (!contentList[i].check && contentList[i].type === 'directory') {
      if(contentList[i].name === 'Symbol') {
        plots = contentList[i].contentList.filter(item => {
          return _isPlot(item.name)
        })
      }
      if(contentList[i].name === 'SymbolIcon') {
        hasIcon = true
      }
    }
  }
  return plots.length > 0 && hasIcon
}


function _isType(name: string, types: string[] = []): boolean {
  name = name.toLowerCase()
  const index = name.lastIndexOf('.')
  let ext
  if (index < 1) {
    return false
  }
  ext = name.substr(index + 1)
  let result = false
  for (let i = 0; i < types.length; i++) {
    if (ext === types[i]) {
      result = true
      break
    }
  }
  return result
}

function _isPlot(name: string) {
  return _isType(name, ['plot'])
}

function _isWorkspace(name: string) {
  return _isType(name, ['smwu', 'sxwu', 'sxw', 'smw'])
}

/**
 * 所有datasource
 * @param {*} name
 */
// function _isDatasource(name) {
//   return _isType(name, ['udb', 'udd'])
// }

/**
 * 不含同名的udd等的datasource
 * @param {*} name
 */

function _isARMap(name: string) {
  return _isType(name, ['arxml'])
}

function _isSCIDatasource(name: string) {
  return _isType(name, ['SCI', 'sci'])
}

function _isDatasource2(name: string) {
  return _isType(name, ['udb'])
}

function _isSubDS(name: string) {
  return _isType(name, ['udd'])
}

function _isRelatedDS(name: string, checkName: string) {
  if (_isSubDS(checkName)) {
    name = name.substring(0, name.lastIndexOf('.'))
    checkName = checkName.substring(0, checkName.lastIndexOf('.'))
    return name === checkName
  }
  return false
}

function _isTIF(name: string) {
  return _isType(name, ['tif', 'tiff'])
}

function _isSHP(name: string) {
  return _isType(name, ['shp'])
}

function _isSubSHP(name: string) {
  return _isType(name, ['dbf', 'prj', 'shx'])
}

function _isRelatedSHP(name: string, checkName: string) {
  if (_isSubSHP(checkName)) {
    name = name.substring(0, name.lastIndexOf('.'))
    checkName = checkName.substring(0, checkName.lastIndexOf('.'))
    return name === checkName
  }
  return false
}

function _isMIF(name: string) {
  return _isType(name, ['mif'])
}

function _isSubMIF(name: string) {
  return _isType(name, ['mid'])
}

function _isRelatedMIF(name: string, checkName: string) {
  if (_isSubMIF(checkName)) {
    name = name.substring(0, name.lastIndexOf('.'))
    checkName = checkName.substring(0, checkName.lastIndexOf('.'))
    return name === checkName
  }
  return false
}

function _isKML(name: string) {
  return _isType(name, ['kml'])
}

function _isKMZ(name: string) {
  return _isType(name, ['kmz'])
}

function _isDWG(name: string) {
  return _isType(name, ['dwg'])
}

function _isDXF(name: string) {
  return _isType(name, ['dxf'])
}

function _isGPX(name: string) {
  return _isType(name, ['gpx'])
}

function _isIMG(name: string) {
  return _isType(name, ['img'])
}

function _isSymbol(name: string) {
  return _isType(name, ['sym', 'lsl', 'bru'])
}

function _isColor(name: string) {
  return _isType(name, ['scs'])
}

function _isFlyingFile(name: string) {
  return _isType(name, ['fpf'])
}

function _isAIModel(name: string) {
  return _isType(name, ['tflite'])
}

function _isSubAIModel(name: string) {
  return _isType(name, ['txt', 'json'])
}

function _isAREffect(name: string) {
  return _isType(name, ['areffect'])
}

function _isARModel(name: string) {
  return _isType(name, ['glb'])
}

function _isSandTable(name: string) {
  return _isType(name, ['stxml'])
}

function _isRelatedAIModel(name: string, checkName: string) {
  if (_isSubAIModel(checkName)) {
    name = name.substring(0, name.lastIndexOf('.'))
    checkName = checkName.substring(0, checkName.lastIndexOf('.'))
    return checkName.indexOf(name) === 0
  }
  return false
}

function _isXmlTemplate(name: string) {
  return  _isType(name, ['xml']) && name.toLowerCase().indexOf('_template') > -1
}


async function _getLocalWorkspaceInfo(serverPath: string) {
  return await SMap.getLocalWorkspaceInfo(serverPath)
}

// async function _getLayerInfo3D(serverUrl, currentPath) {
//   const layers = []
//   try {
//     if (Platform.OS === 'android') {
//       const scenes = await SScene.getSceneXMLfromWorkspace(serverUrl)
//       for (let i = 0; i < scenes.length; i++) {
//         const { xml } = scenes[i]
//         const $ = cheerio.load(xml)
//         const nodes = $('sml\\:DataSourceAlias')
//         for (let n = 0; n < nodes.length; n++) {
//           let rpath = nodes[n].children[0].nodeValue
//           // 处理反斜线
//           rpath = rpath.replace(/\\/g, '/')
//           // 目前只获取工作空间同级的图层文件夹
//           if (rpath.indexOf('./') === 0) {
//             const pathArr = rpath.split('/')
//             const path = pathArr[1]
//             layers.push({
//               name: scenes[i].name,
//               path: `${currentPath}/${path}`,
//             })
//           }
//         }
//       }
//     } else {
//       const wsType = serverUrl
//         .substr(serverUrl.lastIndexOf('.') + 1)
//         .toLowerCase()
//       // ios目前直接从工作空间文件读取
//       if (wsType === 'sxwu') {
//         let workspaceStr = await RNFS.readFile(serverUrl, 'base64')
//         const rawStr = Buffer.from(workspaceStr, 'base64')
//         workspaceStr = iconv.decode(rawStr, 'gb2312')

//         const $ = cheerio.load(workspaceStr)
//         const nodes = $('sml\\:DataSourceAlias')
//         for (let n = 0; n < nodes.length; n++) {
//           let rpath = nodes[n].children[0].nodeValue
//           // 处理反斜线
//           rpath = rpath.replace(/\\/g, '/')
//           // 目前只获取工作空间同级的图层文件夹
//           if (rpath.indexOf('./') === 0) {
//             const pathArr = rpath.split('/')
//             const path = pathArr[1]
//             layers.push({
//               name: path,
//               path: `${currentPath}/${path}`,
//             })
//           }
//         }
//       }
//     }
//     return layers
//   } catch (error) {
//     // console.log(error)
//     return layers
//   }
// }

function _checkUncheckedFile(path: string, contentList: FileDetailInfo[], uncheckedChildFileList: UncheckedFiles) {
  for (let i = uncheckedChildFileList.length - 1; i >= 0; i--) {
    for (let n = 0; n < contentList.length; n++) {
      if (`${path}/${contentList[n].name}` === uncheckedChildFileList[i]) {
        contentList[n].check = true
        uncheckedChildFileList.splice(i, 1)
      }
    }
  }
}

function _checkTempFile(contentList: FileDetailInfo[]) {
  for (let i = 0; i < contentList.length; i++) {
    if (contentList[i].name.indexOf('~[') === 0) {
      contentList[i].check = true
    } else if (
      contentList[i].name.indexOf('~[') !== 0 &&
      contentList[i].type === 'directory'
    ) {
      _checkTempFile(contentList[i].contentList)
    }
  }
}

function _checkRelatedSandTableModel(relatedFiles: RelatedFiles, path: string, contentList: FileDetailInfo[]) {
  for(let i = 0; i < contentList.length; i++) {
    if (
      !contentList[i].check &&
      contentList[i].type === 'file' &&
      _isARModel(contentList[i].name)
    ) {
      contentList[i].check = true
      relatedFiles.push(`${path}/${contentList[i].name}`)
    }
  }
}

/** 递归获取所有文件 */
async function _getDirectoryContentDeep(path: string) {
  let contentList: FileDetailInfo[] = []
  try {
    const fileInfos = await FileTools.getDirectoryContent(path)
    Object.assign(contentList, fileInfos)
    for (let i = 0; i < contentList.length; i++) {
      if (contentList[i].type === 'directory') {
        contentList[i].contentList = await _getDirectoryContentDeep(
          `${path}/${contentList[i].name}`,
        )
      }
    }
    return contentList
  } catch (error) {
    // console.log(e)
    return contentList
  }
}

export default {
  getExternalData,
  deleteExternalData,
}