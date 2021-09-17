import React from 'react'
import { Platform, View, Image, StyleSheet } from 'react-native'
import { MTBtn } from '../../../../../../components'
import { getThemeAssets, getPublicAssets } from '../../../../../../assets'
import { ConstPath, ConstToolType } from '../../../../../../constants'
import { scaleSize, fixedSize, DateUtil } from '../../../../../../utils'
import { color, zIndexLevel } from '../../../../../../styles'
import NavigationService from '../../../../../NavigationService'
import { FileTools } from '../../../../../../native'
import AiCollectionActions from './AiCollectionActions'
import ToolbarModule from '../ToolbarModule'
import { SectionData, SectionItemData } from '../types'
import { SMediaCollector, SAIDetectView, SMap } from 'imobile_for_reactnative'

const styles = StyleSheet.create({
  headerBack: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
    width: scaleSize(80),
    height: scaleSize(80),
    marginTop: scaleSize(20),
    marginLeft: scaleSize(40),
  },
  headerRightBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scaleSize(80),
    height: scaleSize(80),
    borderRadius: scaleSize(8),
    backgroundColor: color.white,
    marginTop: scaleSize(20),
  },
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0.8)',
    zIndex: zIndexLevel.FOUR + 2,
  },
  preview: {
    marginTop: scaleSize(120),
    height: fixedSize(800),
    width: fixedSize(600),
    alignSelf: 'center',
    borderRadius: scaleSize(40),
    overflow: 'hidden',
  },
  detectBottomView: {
    position: 'absolute',
    bottom: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    left: '-50%',
    right: '-50%',
  },
  bottomBtnImg: {
    width: scaleSize(120),
    height: scaleSize(120),
    marginRight: 3,
  },
  previewBottom: {
    position: 'absolute',
    bottom: scaleSize(60),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    zIndex: zIndexLevel.FOUR + 3,
  },
  previewBottomContent: {
    flexDirection: 'row',
    height: fixedSize(120),
    width: fixedSize(600),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

function getData() {
  const buttons: any = []
  let data: SectionData[] | SectionItemData[] | string[] = []
  return {data, buttons}
}

function _headerLeft() {
  let imgSize
  if (GLOBAL.getDevice().orientation && GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') === 0) {
    imgSize = scaleSize(40)
  } else {
    imgSize = scaleSize(60)
  }
  return (
    <MTBtn
      key={'backTo'}
      image={getPublicAssets().common.icon_back}
      style={styles.headerBack}
      imageStyle={{
        width: imgSize,
        height: imgSize,
        marginRight: 3,
      }}
      onPress={AiCollectionActions.close}
    />
  )
}

/** 自定义Header数据 */
function getHeaderData(type: string) {
  let headerData: any
  headerData = {
    type: 'floatNoTitle',
    headerLeft: _headerLeft(),
    headerRight: [{
      key: 'delete',
      // title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_CLEAR,
      action: AiCollectionActions.goToCollectType,
      size: 'large',
      image: getThemeAssets().setting.icon_detection_type,
      style: [styles.headerRightBtn, {marginRight: scaleSize(20)}],
    }, {
      key: 'setting',
      // title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_CLEAR,
      action: AiCollectionActions.setting,
      size: 'large',
      image: getThemeAssets().toolbar.icon_toolbar_setting,
      style: [styles.headerRightBtn, {marginRight: scaleSize(30)}],
    }],
  }
  return headerData
}

function getPreviewCustomView() {
  const _data: any = ToolbarModule.getData()
  const _params: any = ToolbarModule.getParams()
  let imgPath = _data.previewImage
  if (
    Platform.OS === 'android' &&
    imgPath.toLowerCase().indexOf('content://') !== 0
  ) {
    imgPath = 'file://' + imgPath
  }
  let height = _params.device.height - fixedSize(200)
  let width = _params.device.width - fixedSize(120)
  return (
    <View style={styles.overlay}>
      <View style={[styles.preview, {
        maxHeight: height,
        maxWidth: width,
      }]}>
        <Image
          // resizeMode={'contain'}
          style={{flex: 1}}
          source={{uri: imgPath}}
        />
      </View>
    </View>
  )
}

/** 自定义界面 */
function getCustomView(type: string) {
  let Preview = null
  switch(type) {
    case ConstToolType.SM_MAP_AI_ANALYSIS_PREVIEW:
      Preview = getPreviewCustomView()
      break
  }
  return Preview
}

/** 目标识别底部组件 */
function getDetectBottomView() {
  return (
    <View style={styles.detectBottomView}>
      <MTBtn
        key={'recognise'}
        opacity={0.8}
        image={getThemeAssets().toolbar.icon_tool_recognise}
        style={{
          backgroundColor: 'transparent',
        }}
        imageStyle={styles.bottomBtnImg}
        onPress={async () => {
          const _params: any = ToolbarModule.getParams()
          const homePath = await FileTools.appendingHomeDirectory()
          let targetPath = homePath + ConstPath.UserPath +
            _params.user.currentUser.userName + '/' +
            ConstPath.RelativeFilePath.Media
          await SMediaCollector.initMediaCollector(targetPath)

          // 获取对象识别信息
          let recognitionInfos = await SAIDetectView.getAIRecognitionInfos()
          const location = await SMap.getCurrentPosition()

          const date = new Date().getTime().toString()
          let path = await SAIDetectView.savePreviewBitmap(targetPath, date)
          if (path) {
            ToolbarModule.addData({
              previewImage: path,
              recognitionInfos: recognitionInfos,
              location: location,
              modifiedDate: DateUtil.formatDate(date),
              mediaName: date,
            })
            await SAIDetectView.pauseDetect()
            await SAIDetectView.clearDetectObjects()

            GLOBAL.toolBox?.setVisible(true, ConstToolType.SM_MAP_AI_ANALYSIS_PREVIEW, {
              isFullScreen: false,
              height: 0,
            })
          }
          // TODO 预览
        }}
      />
    </View>
  )
}

/** 预览底部组件 */
function getPreviewBottomView() {
  const _params: any = ToolbarModule.getParams()
  let height = _params.device.height - fixedSize(200)
  let width = _params.device.width - fixedSize(120)
  return (
    <View style={styles.previewBottom}>
      <View style={[styles.previewBottomContent, {
        maxHeight: height,
        maxWidth: width,
      }]}>
        <MTBtn
          key={'recognise'}
          opacity={0.8}
          image={getThemeAssets().toolbar.icon_tool_cancel}
          style={{
            backgroundColor: 'transparent',
          }}
          imageStyle={styles.bottomBtnImg}
          onPress={AiCollectionActions.aiDetect}
        />
        <MTBtn
          key={'recognise'}
          opacity={0.8}
          image={getThemeAssets().toolbar.icon_tool_submit}
          style={{
            backgroundColor: 'transparent',
          }}
          imageStyle={styles.bottomBtnImg}
          onPress={async () => {
            const _data: any = ToolbarModule.getData()
            const _params: any = ToolbarModule.getParams()

            let aiType
            switch(_data.type) {
              case ConstToolType.SM_MAP_AI_AGGREGATE:
                aiType = 'AI_AGGREGATE'
                break
              case ConstToolType.SM_MAP_AI_ANALYSIS:
              default:
                aiType = 'AI_DETECT'
                break
            }
            NavigationService.navigate('MediaEdit', {
              // title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
              title: _data.title,
              layerInfo: _params.currentLayer,
              backAction: () => {
                AiCollectionActions.aiDetect()
                NavigationService.goBack('MediaEdit')
              },
              cb: () => {
                AiCollectionActions.aiDetect()
                NavigationService.goBack('MediaEdit')
              },
              info: {
                // id: string,
                coordinate: _data.location,
                layerName: _params.currentLayer.name,
                // geoID: number,
                // medium: Array<any>,
                modifiedDate: _data.modifiedDate,
                mediaName: _data.mediaName,
                mediaFilePaths: [_data.previewImage],
                mediaServiceIds: [],
                httpAddress: '',
                description: '',
                location: _data.location,
                mediaData: {
                  type: aiType,
                  recognitionInfos: _data.recognitionInfos,
                },
              },
            })
          }}
        />
      </View>
    </View>
  )
}

/** 底部组件 */
function getBottomView(type: string) {
  let bottomView
  switch(type) {
    case ConstToolType.SM_MAP_AI_ANALYSIS_DETECT:
      bottomView = getDetectBottomView()
      break
    case ConstToolType.SM_MAP_AI_ANALYSIS_PREVIEW:
      bottomView = getPreviewBottomView()
      break
  }
  return bottomView
}

export default {
  getData,
  getHeaderData,
  getCustomView,
  getBottomView,
}
