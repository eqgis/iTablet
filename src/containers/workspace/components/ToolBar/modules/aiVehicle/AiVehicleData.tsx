import React from 'react'
import { Platform, View, Image, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { MTBtn, Input, Button } from '../../../../../../components'
import { getPublicAssets } from '../../../../../../assets'
import { ConstPath, ConstToolType } from '../../../../../../constants'
import { scaleSize, fixedSize, DateUtil } from '../../../../../../utils'
import { zIndexLevel, color, size } from '../../../../../../styles'
import { getLanguage } from '../../../../../../language'
import NavigationService from '../../../../../NavigationService'
import { FileTools } from '../../../../../../native'
import AiVehicleActions from './AiVehicleActions'
import ToolbarModule from '../ToolbarModule'
import { SectionData, SectionItemData } from '../types'
import { SMediaCollector, SMap, SMIllegallyParkView, SIllegallyParkView } from 'imobile_for_reactnative'

const styles = StyleSheet.create({
  headerBack: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
    width: scaleSize(60),
    height: scaleSize(60),
  },
  headerRightBtn: {
    width: scaleSize(60),
    height: scaleSize(60),
    borderRadius: scaleSize(8),
    backgroundColor: color.white,
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
    paddingHorizontal: scaleSize(26),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleSize(16),
    backgroundColor: 'white',
  },
  previewBottomLeftContent: {
    flex: 1,
    padding: scaleSize(16),
    flexDirection: 'column',
    alignContent: 'flex-start',
    justifyContent: 'center',
    // borderRadius: scaleSize(16),
    // backgroundColor: 'white',
  },
  previewBottomTitle: {
    color: color.black,
    fontSize: size.fontSize.fontSizeMd,
  },
  input: {
    flex: 1,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
    fontSize: size.fontSize.fontSizeLg,
    borderBottomWidth: 1,
    borderBottomColor: '#BBBBBB',
  },
  confirmBtn: {
    height: scaleSize(80),
    width: scaleSize(140),
    backgroundColor: color.contentColorGray,
    borderRadius: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
})

function getData() {
  const buttons: any = []
  let data: SectionData[] | SectionItemData[] | string[] = []
  return {data, buttons}
}

function _headerLeft(type: string) {
  let imgSize
  if (GLOBAL.getDevice().orientation && GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') === 0) {
    imgSize = scaleSize(40)
  } else {
    imgSize = scaleSize(60)
  }
  return (
    <View style={{
      width: 60,
    }}>
      <MTBtn
        key={'backTo'}
        image={getPublicAssets().common.icon_back}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: scaleSize(8),
          width: scaleSize(80),
          height: scaleSize(80),
          marginTop: scaleSize(20),
          marginLeft: scaleSize(40),
        }}
        imageStyle={{
          width: imgSize,
          height: imgSize,
          marginRight: 3,
        }}
        onPress={AiVehicleActions.close}
      />
    </View>
  )
}

/** 自定义Header数据 */
function getHeaderData(type: string) {
  let headerData: any
  headerData = {
    type: 'floatNoTitle',
    headerLeft: _headerLeft(type),
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
    <View
      style={{
        flex: 1,
        backgroundColor: '#rgba(0, 0, 0, 0.8)',
        // zIndex: zIndexLevel.FOUR + 1,
      }}
    >
      <View
        style={{
          marginTop: scaleSize(120),
          height: fixedSize(800),
          width: fixedSize(600),
          maxHeight: height,
          maxWidth: width,
          alignSelf: 'center',
          borderRadius: scaleSize(40),
          overflow: 'hidden',
        }}
      >
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
  const _params: any = ToolbarModule.getParams()
  switch(type) {
    case ConstToolType.SM_MAP_AI_VEHICLE_PREVIEW:
      Preview = getPreviewCustomView()
      break
    case ConstToolType.SM_MAP_AI_VEHICLE_DETECT:
      Preview = (
        <SMIllegallyParkView
          language={GLOBAL.language}
          onStart={async () => {
            let targetPath = await FileTools.appendingHomeDirectory(
              ConstPath.UserPath +
                _params.user.currentUser.userName +
                '/' +
                ConstPath.RelativeFilePath.Media,
            )
            SMediaCollector.initMediaCollector(targetPath)

            SIllegallyParkView.setIllegallyParkListener({
              callback: async result => {
                const date = new Date().getTime().toString()
                const location = await SMap.getCurrentPosition()
                ToolbarModule.addData({
                  previewImage: result.carImage,
                  mediaName: result.carImage.substring(result.carImage.lastIndexOf('/') + 1, result.carImage.lastIndexOf('.')),
                  plateNubmer: result.carPlate,
                  location: location,
                  modifiedDate: DateUtil.formatDate(date),
                })
                _params.setToolbarVisible(true, ConstToolType.SM_MAP_AI_VEHICLE_PREVIEW, {
                  isFullScreen: false,
                  height: 0,
                })
              },
            })
          }}
          onDestroy={() => {
            SMap.setDynamicviewsetVisible(false)
          }}
        />
      )
      break
  }
  return Preview
}

/** 预览底部组件 */
function getPreviewBottomView() {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  let height = _params.device.height - fixedSize(200)
  let width = _params.device.width - fixedSize(120)
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' && 'position'}
      style={styles.previewBottom}
    >
      <View style={[styles.previewBottomContent, {
        maxHeight: height,
        maxWidth: width,
      }]}>
        <View style={styles.previewBottomLeftContent}>
          <Text style={styles.previewBottomTitle}>{getLanguage(GLOBAL.language).AI.PLATE_NUMBER}</Text>
          <Input
            style={{ paddingHorizontal: 0 }}
            textAlign={'left'}
            inputStyle={styles.input}
            defaultValue={_data.plateNubmer}
            placeholderTextColor={color.themePlaceHolder}
            textContentType={'URL'}
            onChangeText={text => {
              ToolbarModule.addData({
                plateNubmer: text.toLocaleUpperCase(),
              })
            }}
            showClear
            isKeyboardAvoiding
          />
        </View>
        <Button
          key="loginBtn"
          style={styles.confirmBtn}
          title={getLanguage(GLOBAL.language).Common.CONFIRM}
          onPress={async () => {
            const _data: any = ToolbarModule.getData()
            const _params: any = ToolbarModule.getParams()
            NavigationService.navigate('MediaEdit', {
              layerInfo: _params.currentLayer,
              backAction: () => {
                AiVehicleActions.illegallyParkCollect()
                NavigationService.goBack('MediaEdit')
              },
              cb: () => {
                AiVehicleActions.illegallyParkCollect()
                NavigationService.goBack('MediaEdit')
              },
              info: {
                coordinate: _data.location,
                layerName: _params.currentLayer.name,
                modifiedDate: _data.modifiedDate,
                mediaName: _data.mediaName,
                mediaFilePaths: [_data.previewImage],
                mediaServiceIds: [],
                httpAddress: '',
                description: '',
                location: _data.location,
                mediaData: {
                  type: 'AI_VEHICLE',
                  mediaName: _data.mediaName,
                  plateNubmer: _data.plateNubmer,
                },
              },
            })
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

/** 底部组件 */
function getBottomView(type: string) {
  let bottomView
  switch(type) {
    case ConstToolType.SM_MAP_AI_VEHICLE_PREVIEW:
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
