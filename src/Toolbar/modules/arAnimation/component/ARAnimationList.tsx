import { ARAnimatorType } from 'imobile_for_reactnative/NativeModule/dataTypes'
import { ARAnimatorParameter } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import React from 'react'
import { FlatList, Image, ImageRequireSource, ListRenderItemInfo, Text, TouchableOpacity, View } from 'react-native'
import { getImage } from '../../../../assets'
import { AppDialog, AppEvent, AppInputDialog, AppStyle, AppToolBar, CheckSpell, dp } from '../../../../utils'
import { ListItemStyleNS } from '../../../../utils/AppStyle'
import { connect, ConnectedProps } from 'react-redux'
import { setARAnimation } from '@/redux/models/aranimation'
import { SARMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import { RootState } from '../../../../redux/types'
import { ToolbarSlideCard } from 'imobile_for_reactnative/components/ToolbarKit'
import * as ModuleData from '../Actions'


interface Props extends ReduxProps {
  visible: boolean
}

interface State {
  animationList: ARAnimatorParameter[]
}


class ARAnimationList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      animationList: []
    }
  }

  componentDidMount() {
    AppEvent.addListener('ar_animation_exit', this.clearCurrentAnimation)
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.visible !== this.props.visible && this.props.visible) {
      this.onVisible()
    }
  }

  clearCurrentAnimation = () => {
    this.props.setARAnimation(undefined)
    ModuleData.setCurrentAnimationIndex(-1)
  }

  onVisible = async () => {
    const animationList = await SARMap.getARAnimations()
    this.setState({
      animationList
    })
  }

  goBack = () => {
    AppToolBar.goBack()
  }

  rename = (index: number) => {
    AppInputDialog.show({
      defaultValue: this.state.animationList[index].name,
      checkSpell: CheckSpell.checkLayerCaption,
      confirm: text => {
        const newAnimation = JSON.parse(JSON.stringify(this.state.animationList[index])) as ARAnimatorParameter
        newAnimation.name = text
        SARMap.editARAnimation(index, newAnimation).then(this.onVisible)
      }
    })
  }

  delete = (index: number) => {
    AppDialog.show({
      text: getLanguage().DELETE_COMFIRM,
      confirm: () => {
        SARMap.deleteARAnimation(index).then(this.onVisible)
      }
    })
  }

  renderHeadButton = (btn: {img: ImageRequireSource, action: () => void}): JSX.Element => {
    return (
      <TouchableOpacity
        onPress={btn.action}
      >
        <Image
          source={btn.img}
          style={AppStyle.Image_Style_Small}
        />
      </TouchableOpacity>
    )
  }

  renderAnimationList = (info: ListRenderItemInfo<ARAnimatorParameter>) => {
    const animator = info.item
    if(animator.type !== ARAnimatorType.GROUP_TYPE) return null
    const isSelected = info.index === ModuleData.getCurrentAnimationIndex()
    return (
      <TouchableOpacity
        onPress={() => {
          if(ModuleData.getCurrentAnimationIndex() === info.index) {
            this.props.setARAnimation(undefined)
            ModuleData.setCurrentAnimationIndex(-1)
            this.forceUpdate()
          } else {
            this.props.setARAnimation(animator)
            ModuleData.setCurrentAnimationIndex(info.index)
            AppToolBar.goBack()
          }
        }}
        style={[ListItemStyleNS, {
          justifyContent: 'space-between'
        }, isSelected && {
          backgroundColor: AppStyle.Color.BLUE
        }
        ]}
      >
        <Text numberOfLines={1} style={AppStyle.h2}>
          {info.item.name}
        </Text>

        <View
          style={{flexDirection: 'row'}}
        >
          <TouchableOpacity
            style={{marginRight: dp(15)}}
            onPress={() => {
              this.rename(info.index)
            }}
          >
            <Image
              source={getImage().icon_edit}
              style={AppStyle.Image_Style_Small}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.delete(info.index)
            }}
          >
            <Image
              source={getImage().icon_delete_black}
              style={AppStyle.Image_Style_Small}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <ToolbarSlideCard
        visible={this.props.visible}
        contentContainerStyle={[isPortrait && {
          height: this.props.windowSize.height * 0.5,
        }, {
          paddingTop: dp(20),
        }
        ]}
      >
        <Text
          style={[AppStyle.h2,{paddingHorizontal: dp(10), paddingBottom: dp(5)}]}
        >
          {getLanguage().ANIMATION_LIST}
        </Text>
        <FlatList
          data={this.state.animationList}
          renderItem={this.renderAnimationList}
          keyExtractor={(item, index) => index.toString()}
        />
      </ToolbarSlideCard>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  windowSize: state.device2.windowSize
})

const mapDispatch = {
  setARAnimation
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(ARAnimationList)