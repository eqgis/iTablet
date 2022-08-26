import { FloatBar } from '@/components'
import { FloatItem } from '@/components/FloatBar'
import { ARAction, SARMap } from 'imobile_for_reactnative'
import { ARElementType } from 'imobile_for_reactnative/NativeModule/dataTypes'
import React from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import { ModuleViewProps } from '../..'
import { getImage } from '../../../assets'
import { getLanguage } from '../../../language'
import { AppDialog, AppInputDialog, AppLog, AppToolBar, CheckSpell, dp, Toast } from '../../../utils'
import { saveARSandTable } from '../arSandTable/Actions'

export interface ARMapEditViewOption {
  showDelete: boolean
  addAnimationType: 'null' | 'node' | 'model'
}

type Props = ModuleViewProps<ARMapEditViewOption>


class ARMapEditView extends React.Component<Props> {

  deleteRight = new Animated.Value(-dp(80))

  constructor(props: Props) {
    super(props)
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.data?.showDelete !== this.props.data?.showDelete) {
      this.changeDeletePostion()
    }
  }

  changeDeletePostion = () => {
    const visible = !!this.props.data?.showDelete
    Animated.timing(this.deleteRight, {
      toValue: visible ? dp(25) : -dp(80),
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
  }

  getDeleteData = (): FloatItem[] => {
    const element = AppToolBar.getData().selectARElement
    const data: FloatItem[] = [
      {
        image: getImage().icon_delete_black,
        key: 'delete',
        title: getLanguage().Common.DELETE,
        action: () => {
          AppDialog.show({
            text: getLanguage().Common.DELETE_CURRENT_OBJ_CONFIRM,
            confirm: () => {
              this.deleteSelectItem()
            },
          })
        }
      },
    ]
    if(element && (element.type === ARElementType.AR_TEXT
       || element.type === ARElementType.AR_BUBBLE_TEXT
    )) {
      data.push({
        image: getImage().icon_edit_text,
        key: 'edit_text',
        title: getLanguage().Edit,
        action: async () => {
          const text = await SARMap.getARText(element.layerName, element.id)
          AppInputDialog.show({
            defaultValue: text,
            confirm: text => {
              SARMap.setARText(element.layerName, element.id, text)
            }
          })
        }
      })
    }
    if (element && element.type === ARElementType.AR_SAND_TABLE) {
      data.push(
        {
          image: getImage().icon_edit,
          key: 'edit_sand_table',
          title: getLanguage().EDIT,
          action: async () => {
            AppToolBar.show('ARSANDTABLE', 'AR_SAND_TABLE_MODIFY')
          }
        },
        {
          image: getImage().export_black,
          key: 'export_sand_table',
          title: getLanguage().REGISTRATION_EXPORT,
          action: async () => {
            AppInputDialog.show({
              title: getLanguage().EXPORT_SAND_TABLE_CONFIRM,
              placeholder: getLanguage().PLEASE_INPUT_MODEL_NAME,
              checkSpell: CheckSpell.defaultCheck,
              confirm: async text => {
                await SARMap.appointARSandTable(element.layerName, element.id)
                saveARSandTable(text).then(result => {
                  SARMap.closeARSandTable()
                  Toast.show(result ? getLanguage().EXPORT_TO : getLanguage().EXPORT_FAILED)
                }).catch(() => {
                  Toast.show(getLanguage().EXPORT_FAILED)
                })
              }
            })
          }
        })
    }

    if(element && (element.type === ARElementType.AR_MARKER_LINE
      || element.type === ARElementType.AR_LINE
    )) {
      const moduleKey = AppToolBar.getCurrentOption()?.key
      // 对象编辑
      // data.push({
      //   image: getImage().edit_obj,
      //   key: 'line_object_edit',
      //   title: getLanguage().ARMap.LINE_OBJECT_EDIT,
      //   action: async () => {
      //     AppToolBar.show('ARMAP_EDIT', 'AR_MAP_EDIT_GEOMETRY')
      //   }
      // })
      if(moduleKey === 'AR_MAP_EDIT_GEOMETRY') {
        // 节点添加
        data.push({
          image: getImage().icon_plus,
          title: getLanguage().ADD_NODES,
          key: 'line_point_add',
          action: async () => {
            SARMap.setAction(ARAction.VERTEX_ADD)
            AppToolBar.show('ARMAP_EDIT', 'AR_MAP_EDIT_GEOMETRY_LINE_ADD')
          }
        })
      }
      // 节点编辑
      // data.push({
      //   image: getImage().edit_node,
      //   key: 'edit_text',
      //   title: getLanguage().ARMap.LINE_POINT_EDIT,
      //   action: async () => {
      //     // SARMap.setAction(ARAction.VERTEX_ADD)
      //     // AppToolBar.show('ARMAP', 'AR_MAP_EDIT_GEOMETRY_LINE_ADD')
      //   }
      // })
    }

    return data
  }


  deleteSelectItem = () => {
    const element = AppToolBar.getData().selectARElement
    if(element) {
      SARMap.clearSelection()
      SARMap.removeEditElement()
      // AppToolBar.goBack()
      // 小组件添加完成后会直接跳转到编辑页面，所以删除对象按钮就不能直接返回上一个toolbar了，要跳转到选择对象页面
      AppToolBar.show('ARMAP', 'AR_MAP_SELECT_ELEMENT')
    } else {
      AppLog.error('没有选中对象')
    }
  }

  renderDelete = () => {
    return (
      <Animated.View style={[
        this.isPortrait ? {
          right: this.deleteRight,
          ...styles.settingButton
        } : {
          top: dp(30),
          left: this.deleteRight,
          ...styles.settingButtonL
        }]}>
        <FloatBar
          data={this.getDeleteData()}
          showSeperator={false}
          itemStyle = {{
            height: dp(45),
            width: dp(45),
          }}
        />
      </Animated.View>
    )
  }

  isPortrait = true
  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <>
        {this.renderDelete()}
      </>
    )
  }
}

export default ARMapEditView


const styles = StyleSheet.create({
  settingButton: {
    position: 'absolute',
    top: dp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingButtonL: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})