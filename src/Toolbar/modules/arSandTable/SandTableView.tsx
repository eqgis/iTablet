import { SARMap} from 'imobile_for_reactnative'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import {Animated,  Easing } from 'react-native'
import { getImage } from '../../../assets'
import { getLanguage } from '../../../language'
import {  AppEvent,  AppLog,  AppStyle, AppToolBar, dp } from '../../../utils'
import { ModuleViewProps } from '../../../Toolbar'
import { ARElement } from 'imobile_for_reactnative/types/interface/ar'

import { ARSAndTableViewOption } from './BottomView'
import { FloatBar } from '@/components'
import { FloatItem } from '@/components/FloatBar'
import AppDialog from '@/utils/AppDialog'



type Props = ModuleViewProps<ARSAndTableViewOption>

interface State {
  currentArElement?: ARElement
  showAdd: boolean
}

class SandTableView extends React.Component<Props, State> {
  right = new Animated.Value(-dp(80))

  deleteRight = new Animated.Value(-dp(80))


  constructor(props: Props) {
    super(props)

    this.state = {
      showAdd: false,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.data?.showDelete !== this.props.data?.showDelete) {
      this.chnageDeletePostion()
    }
    if(prevProps.visible !== this.props.visible) {
      if(this.props.visible) {
        this.addListener()
      } else {
        this.removeListener()
      }
    }
    this.props.visibleChange
  }

  addListener = () => {
    AppEvent.addListener('ar_sandtable_add', this.onAdd)
    AppEvent.addListener('ar_sandtable_add_end', this.onAddEnd)
  }

  removeListener = () => {
    AppEvent.removeListener('ar_sandtable_add', this.onAdd)
    AppEvent.removeListener('ar_sandtable_add_end', this.onAddEnd)
  }

  onAdd = () => {
    this.setState({showAdd: true})
  }

  onAddEnd = () => {
    this.setState({currentArElement: undefined, showAdd: false})
  }

  chnageDeletePostion = () => {
    const visible = !!this.props.data?.showDelete
    Animated.timing(this.deleteRight, {
      toValue: visible ? dp(25) : -dp(80),
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
  }

  getDeleteData = (): FloatItem[] => {
    const data: FloatItem[] = [
      {
        image: getImage().icon_delete_black,
        key: 'delete',
        title: getLanguage().DELETE,
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

    return data
  }


  deleteSelectItem = () => {
    this.deleteInnerElement()
  }

  deleteInnerElement = () => {
    const element = AppToolBar.getData().selectARElement
    if(element) {
      SARMap.deleteModelFromSandTable()
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

  renderAddButton = () => {
    return (
      <TouchableOpacity
        style={[styles.addButton, !this.isPortrait && {bottom: dp(30)}]}
        onPress={()=>{
          AppEvent.emitEvent('ar_sandtable_on_add')
        }}
      >
        <Image
          style={{width: dp(80), height: dp(80)}}
          source={getImage().icon_ar_measure_add}
        />
      </TouchableOpacity>
    )
  }


  isPortrait = this.props.windowSize.height > this.props.windowSize.width

  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <>
        {this.renderDelete()}
        {this.state.showAdd && this.renderAddButton()}
      </>
    )
  }
}

export default SandTableView


const styles = StyleSheet.create({
  typeContainer: {
    ...AppStyle.FloatStyle,
    position: 'absolute',
    height: dp(50),
    left: dp(30),
    backgroundColor: AppStyle.Color.Background_Page,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: dp(25),
  },
  typeItem: {
    height: dp(40),
    width: dp(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dp(20),
  },
  addButton: {
    ...AppStyle.FloatStyle,
    position: 'absolute',
    alignSelf: 'center',
    bottom: dp(130),
  },
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
  item: {
    flexDirection: 'row',
    height: dp(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: dp(15),
    borderRadius: 17,
  }
})