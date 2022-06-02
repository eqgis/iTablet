import { SARMap } from 'imobile_for_reactnative'
import { ARAnimatorType } from 'imobile_for_reactnative/NativeModule/dataTypes'
import { ARGroupAnimatorParameter } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import React from 'react'
import { Image, ImageRequireSource, Text, TouchableOpacity, View } from 'react-native'
import { AppEvent, AppLog, AppStyle, AppToolBar, dp, Toast } from '../../../../utils'
import ARAnimation, { SelectItem } from './ARAnimation'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../../../redux/types'
import { AppendID, ARAnimatorWithID, deleteARAnimation, moveARAnimation, setARAnimation } from '@/redux/models/aranimation'
import { getLanguage } from '../../../../language'
import { ToolbarSlideCard } from 'imobile_for_reactnative/components/ToolbarKit'
import * as ModuleData from '../Actions'

interface Props extends ReduxProps {
  visible: boolean
}

interface State {
  currentID: string
}

class AnimationDetail extends React.Component<Props, State> {

  selectItem: SelectItem | null = null

  constructor(props: Props) {
    super(props)

    this.state = {
      currentID: ''
    }
  }

  componentDidMount() {
    this.addListener()
  }

  componentWillUnmount() {
    this.removeListener()
  }

  addListener = () => {
    AppEvent.addListener('ar_animation_save', this.goBack)
    AppEvent.addListener('ar_animation_play', this.play)
  }

  removeListener = () => {
    AppEvent.removeListener('ar_animation_save', this.goBack)
    AppEvent.removeListener('ar_animation_play', this.play)
  }

  goBack = () => {
    this.save()
    AppToolBar.goBack()
  }

  play = () => {
    try {
      if(this.props.arAnimation !== undefined) {
        SARMap.playARAnimation(JSON.parse(JSON.stringify(this.props.arAnimation)))
        AppToolBar.show('ARANIMATION', 'AR_MAP_ANIMATION_PLAY')
      } else {
        Toast.show(getLanguage().PLEASE_SELECT_ANIMATION)
      }
    } catch(e) {
      AppLog.error('parse error')
    }
  }

  edit = (id: string) => {
    const editItem = this.getSelectedAnimaor(this.props.arAnimation, id)
    if(editItem !== undefined) {
      ModuleData.onEditARAnimation(editItem)
    }
  }

  move = (offset: number) => {
    if(this.selectItem) {
      const { id, index, parentId, parentLength } = this.selectItem
      if(index + offset < 0 || index + offset >= parentLength) return
      this.props.moveARAnimation(id, parentId, index + offset)
      this.selectItem.index = index + offset
    }
  }

  moveFirst = () => {
    if(this.selectItem) {
      const { id, parentId } = this.selectItem
      this.props.moveARAnimation(id, parentId, 0)
      this.selectItem.index = 0
    }
  }

  moveLast = () => {
    if(this.selectItem) {
      const { id, parentId, parentLength } = this.selectItem
      this.props.moveARAnimation(id, parentId, -1)
      this.selectItem.index = parentLength - 1
    }
  }

  getSelectedAnimaor = (animtor: AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>> | undefined, id: string): ARAnimatorWithID | undefined => {
    if(animtor === undefined) return undefined
    for(let i = 0; i < animtor.animations.length; i++) {
      const _aniamtor = animtor.animations[i]
      if(_aniamtor.eid === id) {
        return _aniamtor
      }
      if(_aniamtor.type === ARAnimatorType.GROUP_TYPE) {
        const inner_animator = this.getSelectedAnimaor(_aniamtor, id)
        if(inner_animator !== undefined) {
          return inner_animator
        }
      }
    }
    return undefined
  }

  save = () => {
    if(this.props.arAnimation) {
      if(ModuleData.getCurrentAnimationIndex() > -1) {
        SARMap.editARAnimation(ModuleData.getCurrentAnimationIndex(), JSON.parse(JSON.stringify(this.props.arAnimation)))
      } else {
        SARMap.addARAnimation(JSON.parse(JSON.stringify(this.props.arAnimation)))
      }
      ModuleData.setCurrentAnimationIndex(-1)
      this.props.setARAnimation(undefined)
    }
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

  renderBottom = (btn: {text: string, action: () => void}): JSX.Element => {
    return (
      <TouchableOpacity
        onPress={btn.action}
        style={{borderWidth: 1, borderRadius: dp(5), padding: dp(2)}}
      >
        <Text  style={AppStyle.h2}>
          {btn.text}
        </Text>
      </TouchableOpacity>
    )
  }


  renderListBottom = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: dp(30),
          alignItems: 'center',
          height: dp(50),
          width: '100%',
        }}
      >
        {this.renderBottom({text: getLanguage().MOVE_UP, action: () => {this.move(-1)}})}
        {this.renderBottom({text: getLanguage().MOVE_DOWN, action: () => {this.move(1)}})}
        {this.renderBottom({text: getLanguage().LAYERS_TOP, action: () => {this.moveFirst()}})}
        {this.renderBottom({text: getLanguage().LAYERS_BOTTOM, action: () => {this.moveLast()}})}
      </View>
    )
  }


  render() {
    const isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <ToolbarSlideCard
        visible={this.props.visible}
        contentContainerStyle={[
          isPortrait && {
            height: this.props.windowSize.height * 0.5,
          }, {
            paddingTop: dp(20),
          }
        ]}
      >
        <Text
          style={[AppStyle.h2,{paddingHorizontal: dp(10), paddingBottom: dp(5)}]}
        >
          {getLanguage().ANIMATION_WINDOW}
        </Text>
        <View style={{flex: 1}} >
          {this.props.arAnimation && (
            <ARAnimation
              animator={this.props.arAnimation}
              selectID={this.state.currentID}
              onEdit={this.edit}
              onDelete={this.props.deleteARAnimation}
              onPress={item => {
                this.selectItem = item
                this.setState({
                  currentID: item.id
                })
              }}
            />
          )}
        </View>
        {this.renderListBottom()}
      </ToolbarSlideCard>
    )
  }
}


const mapStateToProp = (state: RootState) => ({
  arAnimation: state.aranimation.arAnimation,
  windowSize: state.device2.windowSize
})


const mapDispatch = {
  moveARAnimation,
  deleteARAnimation,
  setARAnimation,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(AnimationDetail)