import React from 'react'
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { MTBtn, ImageButton } from '../../../../../../components'
import { SectionData, SectionItemData } from '../types'
import { getThemeAssets, getPublicAssets } from '../../../../../../assets'
import { ConstToolType } from '../../../../../../constants'
import { scaleSize, fixedSize } from '../../../../../../utils'
import { color, zIndexLevel } from '../../../../../../styles'
import AICategoryActions from './AICategoryActions'
import Preview from './Preview'
import ToolbarModule from '../ToolbarModule'

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
  albumBtn: {
    position: 'absolute',
    width: scaleSize(120),
    height: scaleSize(120),
    // bottom: scaleSize(40),
    left: scaleSize(0),
    top: '50%',
    marginTop: -scaleSize(60),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumImgBtn: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  capture: {
    position: 'absolute',
    width: scaleSize(120),
    height: scaleSize(120),
    // bottom: scaleSize(40),
    left: '50%',
    marginLeft: -scaleSize(60),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconBg: {
    width: scaleSize(120),
    height: scaleSize(120),
  },
  cameraIcon: {
    width: scaleSize(120),
    height: scaleSize(120),
  },
  buttonView: {
    position: 'absolute',
    flexDirection: 'row',
    height: scaleSize(120),
    paddingHorizontal: scaleSize(80),
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    left: scaleSize(60),
    right: scaleSize(60),
    borderRadius: scaleSize(32),
    bottom: scaleSize(32),
  },
  iconView: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  smallIcon: {
    width: scaleSize(44),
    height: scaleSize(44),
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
      onPress={AICategoryActions.close}
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
      key: 'setting',
      // title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_CLEAR,
      action: AICategoryActions.setting,
      size: 'large',
      image: getThemeAssets().toolbar.icon_toolbar_setting,
      style: [styles.headerRightBtn, {marginRight: scaleSize(30)}],
    }],
  }
  return headerData
}

function getDetectBottomView() {
  const _params: any = ToolbarModule.getParams()
  let height = _params.device.height - fixedSize(200)
  let width = _params.device.width - fixedSize(120)
  return (
    <View style={styles.previewBottom}>
      <View style={[styles.previewBottomContent, {
        maxHeight: height,
        maxWidth: width,
      }]}>
        <ImageButton
          containerStyle={styles.albumBtn}
          iconStyle={styles.albumImgBtn}
          activeOpacity={0.8}
          icon={getThemeAssets().toolbar.icon_photo_picture}
          onPress={() => {
            AICategoryActions.openAlbum()
          }}
        />
        <ImageButton
          containerStyle={styles.capture}
          iconStyle={styles.cameraIcon}
          activeOpacity={0.8}
          icon={getThemeAssets().toolbar.icon_tool_photograph}
          onPress={() => {
            AICategoryActions.takeCamera()
          }}
        />
      </View>
    </View>
  )
}

function getPreviewBottomView() {
  return (
    <View style={styles.buttonView}>
      <TouchableOpacity
        onPress={() => AICategoryActions.clear()}
        style={styles.iconView}
      >
        <Image
          resizeMode={'contain'}
          source={getThemeAssets().edit.icon_delete}
          style={styles.smallIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => AICategoryActions.save()}
        style={styles.iconView}
      >
        <Image
          resizeMode={'contain'}
          source={getThemeAssets().start.icon_save}
          style={styles.smallIcon}
        />
      </TouchableOpacity>
    </View>
  )
}

/** 底部组件 */
function getBottomView(type: string) {
  let bottomView
  switch(type) {
    case ConstToolType.SM_MAP_AI_CATEGORY_DETECT:
      bottomView = getDetectBottomView()
      break
    case ConstToolType.SM_MAP_AI_CATEGORY_PREVIEW:
      bottomView = getPreviewBottomView()
      break
  }
  return bottomView
}

function getCustomView(type: string) {
  const _data: any = ToolbarModule.getData()
  let customView
  switch(type) {
    case ConstToolType.SM_MAP_AI_CATEGORY_PREVIEW:
      customView = (
        <Preview
          data={_data.classResult || []}
          previewImage={_data.captureImgPath}
          onChange={(item, index) => {
            ToolbarModule.addData({
              selectedCategoryData: item,
            })
          }}
        />
      )
      break
  }
  return customView
}

export default {
  getData,
  getHeaderData,
  getBottomView,
  getCustomView,
}