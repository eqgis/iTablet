import React from 'react'
import { Platform, View, Image, Text, KeyboardAvoidingView } from 'react-native'
import { MTBtn, Input, Button } from '../../../../../../components'
import { getPublicAssets } from '../../../../../../assets'
import { ConstToolType } from '../../../../../../constants'
import { scaleSize, fixedSize } from '../../../../../../utils'
import { color } from '../../../../../../styles'
import { getLanguage } from '../../../../../../language'
import AiVehicleActions from './AiVehicleActions'
import ToolbarModule from '../ToolbarModule'
import { SectionData, SectionItemData } from '../types'
import ScanVehicleView from './ScanVehicleView'
import styles from './styles'

function getData() {
  const buttons: any = []
  let data: SectionData[] | SectionItemData[] | string[] = []
  return {data, buttons}
}

function _headerLeft() {
  let imgSize
  if (global.getDevice().orientation && global.getDevice().orientation.indexOf('LANDSCAPE') === 0) {
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
  switch(type) {
    case ConstToolType.SM_MAP_AI_VEHICLE_PREVIEW:
      Preview = getPreviewCustomView()
      break
    case ConstToolType.SM_MAP_AI_VEHICLE_DETECT:
      Preview = <ScanVehicleView />
      break
  }
  return Preview
}

/** 预览底部组件 */
function getPreviewBottomView(type: string) {
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
          <Text style={styles.previewBottomTitle}>{getLanguage(global.language).AI.PLATE_NUMBER}</Text>
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
          title={getLanguage(global.language).Common.CONFIRM}
          onPress={async () => {
            if (type === ConstToolType.SM_MAP_AI_VEHICLE_PREVIEW) {
              AiVehicleActions.goToResultView()
            } else {
              AiVehicleActions.goToPreview()
            }
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
      bottomView = getPreviewBottomView(type)
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