import { ARAnimatorType } from 'imobile_for_reactnative/NativeModule/dataTypes'
import { ARGroupAnimatorParameter } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import React from 'react'
import { FlatList, Image, ListRenderItemInfo, Text, TouchableOpacity, View } from 'react-native'
import { getImage } from '../../../../assets'
import { getLanguage } from '../../../../language'
import { AppendID, ARAnimatorWithID } from '@/redux/models/aranimation'
import { AppDialog, AppStyle, dp } from '../../../../utils'


interface AnimationsProps {
  animator: AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>>
  selectID: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPress: (item: SelectItem) => void
}

interface AnimatorItemProps {
  parentId: string
  animator: ARAnimatorWithID
  index: number
  parentLength: number
  selectID: string
  onPress: (item: SelectItem) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export interface SelectItem {
  id: string
  parentId: string
  index: number
  parentLength: number
}

class ARAnimation extends React.Component<AnimationsProps> {
  constructor(props: AnimationsProps) {
    super(props)
  }


  renderAnimationList = (info: ListRenderItemInfo<ARAnimatorWithID>): JSX.Element => {
    return (
      <AnimatorItem
        animator={info.item}
        index={info.index}
        parentId={this.props.animator.eid}
        parentLength={this.props.animator.animations.length}
        selectID={this.props.selectID}
        onEdit={this.props.onEdit}
        onDelete={this.props.onDelete}
        onPress={this.props.onPress}
      />
    )
  }

  render() {
    return(
      <FlatList
        data={this.props.animator.animations}
        renderItem={this.renderAnimationList}
        keyExtractor={(_item, index) => index.toString()}
      />
    )
  }
}



class AnimatorItem extends React.Component<AnimatorItemProps> {

  animation: ARAnimation | null = null

  constructor(props: AnimatorItemProps) {
    super(props)
  }


  render() {
    return(
      <>
        <TouchableOpacity
          style={[
            {
              height: dp(40),
              paddingLeft: dp(10),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: dp(20),
            },
            this.props.selectID === this.props.animator.eid &&
            {backgroundColor: AppStyle.Color.BLUE}
          ]}
          onPress={() => {
            this.props.onPress({
              id: this.props.animator.eid,
              parentId: this.props.parentId,
              index: this.props.index,
              parentLength: this.props.parentLength
            })
          }}
        >
          <Text style={AppStyle.h2}>
            {this.props.animator.name}
          </Text>

          <View
            style={{flexDirection: 'row'}}
          >
            <TouchableOpacity
              style={{marginRight: dp(15)}}
              onPress={() => {
                this.props.onEdit(this.props.animator.eid)
              }}
            >
              <Image
                source={getImage().icon_edit}
                style={AppStyle.Image_Style_Small}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                AppDialog.show({
                  text: getLanguage().DELETE_COMFIRM,
                  confirm: () => {
                    this.props.onDelete(this.props.animator.eid)
                  }
                })
              }}
            >
              <Image
                source={getImage().icon_delete_black}
                style={AppStyle.Image_Style_Small}
              />
            </TouchableOpacity>
          </View>

        </TouchableOpacity>

        {this.props.animator.type === ARAnimatorType.GROUP_TYPE && (
          <View
            style={{paddingLeft: dp(15)}}
          >
            <ARAnimation
              ref={ref => this.animation = ref}
              animator={this.props.animator}
              selectID={this.props.selectID}
              onEdit={this.props.onEdit}
              onDelete={this.props.onDelete}
              onPress={this.props.onPress}
            />
          </View>
        )}
      </>
    )
  }
}


export default ARAnimation