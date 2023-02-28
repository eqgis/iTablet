import * as React from 'react'
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize, AnalystTools } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { Const, TouchType, ConstToolType } from '../../../../constants'
import { getThemeAssets } from '../../../../assets'
import { TextBtn } from '../../../../components'
// import { Analyst_Types } from '../../../analystView/AnalystType'
import { SMap } from 'imobile_for_reactnative'
import { Action } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'

const styles = StyleSheet.create({
  buttons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: scaleSize(40),
    borderTopRightRadius: scaleSize(40),
    // overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 20,
  },
  button: {
    // flex: 1,
    height: scaleSize(60),
    width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.white,
  },
  img: {
    height: scaleSize(45),
    width: scaleSize(45),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: color.itemColorBlack,
    fontSize: size.fontSize.fontSizeXl,
  },
})

export default class AnalystMapToolbar extends React.Component {
  props: {
    type: Number, // 界面样式
    actionType: Number, // 按钮事件  select | draw
    back: () => {},
    analyst?: () => {},
    setAnalystParams?: () => {},
    language: string,
  }

  reset = () => {
    switch (this.props.actionType) {
      case 'select':
        SMap.setAction(Action.SELECT)
        break
      case 'draw':
        SMap.setAction(Action.CREATEPOLYGON)
        break
    }
  }

  renderBottomBtn = (img, action) => {
    return (
      <TouchableOpacity onPress={() => action()} style={styles.button}>
        <Image style={styles.img} resizeMode={'contain'} source={img} />
      </TouchableOpacity>
    )
  }

  renderBottomTextBtn = (text, action) => {
    return (
      <TextBtn btnText={text} textStyle={styles.btnText} btnClick={action} />
    )
  }

  renderToolbarWithBack = () => {
    return (
      <View style={styles.buttons}>
        {this.renderBottomBtn(
          getThemeAssets().toolbar.icon_toolbar_quit,
          () => {
            this.props.back && this.props.back()
          },
        )}
        {this.renderBottomBtn(
          getThemeAssets().toolbar.icon_toolbar_submit,
          async () => {
            if (this.props.analyst) {
              this.props.analyst()
            } else {
              AnalystTools.analyst(this.props.type)
                .then(({ edges }) => {
                  if (edges && edges.length > 0) {
                    global.TouchType = TouchType.NORMAL // 关闭分析界面，触摸事件设置为normal
                    this.props.setAnalystParams(null)
                    AnalystTools.showMsg(
                      this.props.type,
                      true,
                      this.props.language,
                    )
                  } else {
                    AnalystTools.showMsg(
                      this.props.type,
                      false,
                      this.props.language,
                    )
                  }
                })
                .catch(() => {
                  AnalystTools.showMsg(
                    this.props.type,
                    false,
                    this.props.language,
                  )
                })
            }
          },
        )}
      </View>
    )
  }

  renderToolbarWithReset = () => {
    return (
      <View style={styles.buttons}>
        {this.renderBottomTextBtn(
          getLanguage(this.props.language).Analyst_Labels.RESET,
          this.reset,
        )}
        {this.renderBottomTextBtn(
          getLanguage(this.props.language).Analyst_Labels.CONFIRM,
          () => {
            this.props.back && this.props.back()
          },
        )}
      </View>
    )
  }

  render() {
    switch (this.props.type) {
      case ConstToolType.SM_MAP_ANALYSIS_OPTIMAL_PATH:
      case ConstToolType.SM_MAP_ANALYSIS_CONNECTIVITY_ANALYSIS:
      case ConstToolType.SM_MAP_ANALYSIS_FIND_TSP_PATH:
        return this.renderToolbarWithBack()
      case ConstToolType.SM_MAP_ANALYSIS_THIESSEN_POLYGON:
        return this.renderToolbarWithReset()
    }
  }
}
