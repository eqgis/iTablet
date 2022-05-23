import { SARMap } from 'imobile_for_reactnative'
import { Vector3 } from 'imobile_for_reactnative/types/data'
import React from 'react'
import { Image, ImageRequireSource, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { getImage } from '../../../../assets'
import { getLanguage } from '../../../../language'
import { RootState } from '../../../../redux/types'
import ToolbarSlideCard from '../../../../SMToolbar/component/ToolbarSlideCard'
import { AppStyle, CheckSpell, DialogUtils, dp } from '../../../../utils'

interface Props extends ReduxProps {
  visible: boolean
}

interface State {
  currentAlign: Align
  currentSpace: number
}

type Align = 'x' | 'y' | '-z'

interface Item {
  align: Align
  image: ImageRequireSource
  text: string
  onPress: () => void
}

class SandTableAlignView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      currentAlign: '-z',
      currentSpace: 0.1
    }
  }

  setAlign = (align: Align, space: number ) => {
    const direction: Vector3 = {
      x: align === 'x' ? 1 : 0,
      y: align === 'y' ? 1 : 0,
      z: align === '-z' ? -1 : 0,
    }
    SARMap.alignModel(direction, space)
  }

  getAlignData = (): Item[] => {
    const data: Item[] = []

    data.push({
      align: 'x',
      image: getImage().ar_translation,
      text: getLanguage().TRANVERSE,
      onPress: () => {
        this.setState({currentAlign: 'x'})
        this.setAlign('x', this.state.currentSpace)
      }
    }, {
      align: '-z',
      image: getImage().ar_translation,
      text: getLanguage().LONGITUDINAL,
      onPress: () => {
        this.setState({currentAlign: '-z'})
        this.setAlign('-z', this.state.currentSpace)
      }
    }, {
      align: 'y',
      image: getImage().ar_translation,
      text: getLanguage().VERTICAL,
      onPress: () => {
        this.setState({currentAlign: 'y'})
        this.setAlign('y', this.state.currentSpace)
      }
    }
    )

    return data
  }

  renderAlignItem = (item: Item, index: number) => {
    const isSelected = this.state.currentAlign === item.align
    return (
      <TouchableOpacity
        key={index+''}
        onPress={() => {
          item.onPress()
        }}
        style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: dp(10)}}
      >
        <View>
          <Image
            source={item.image}
            style={AppStyle.Image_Style}
          />
          <Text style={AppStyle.h3}>
            {item.text}
          </Text>
        </View>
        <View
          style={[{
            width: dp(20),
            height: dp(3),
            backgroundColor: 'transparent',
            borderRadius: dp(5),
          }, isSelected && {backgroundColor: AppStyle.Color.BLACK}]}
        />
      </TouchableOpacity>
    )
  }

  renderAlign = () => {
    return (
      <View style={{paddingHorizontal: dp(20)}}>
        <Text style={AppStyle.h2}>
          {getLanguage().ALIGN}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: dp(10)}}>
          {this.getAlignData().map((item, index) => {
            return this.renderAlignItem(item, index)
          })}
        </View>
      </View>
    )
  }

  renderSpace = () => {
    return (
      <View style={styles.CurrentSpaceCloum} >
        <Text style={AppStyle.h2}>
          {getLanguage().DISTANCE}
        </Text>
        <Pressable
          style={styles.CurrentSpaceTextContainer}
          onPress={() => {
            DialogUtils.showInputDailog({
              value: this.state.currentSpace + '',
              checkSpell: CheckSpell.checkFloat('positive'),
              confirmAction: text => {
                const space = parseFloat(text)
                this.setState({
                  currentSpace: space
                })
                this.setAlign(this.state.currentAlign, space)
              }
            })
          }}
        >
          <Text>
            {this.state.currentSpace}
          </Text>
        </Pressable>
      </View>
    )
  }

  renderParam = () => {
    return (
      <>
        {this.renderAlign()}
        {this.renderSpace()}
      </>
    )
  }

  renderBottom = () => {

  }

  render() {
    return(
      <ToolbarSlideCard
        visible={this.props.visible}
        contentContainerStyle={styles.bottomContainer}
      >
        {this.renderParam()}
      </ToolbarSlideCard>
    )
  }
}


const mapStateToProp = (state: RootState) => ({
  windowSize: state.device2.windowSize
})

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp)

export default connector(SandTableAlignView)


const styles = StyleSheet.create({
  bottomContainer: {
    paddingTop: dp(20),
  },
  CurrentSpaceCloum: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dp(20),
    justifyContent: 'space-between',
    marginTop: dp(10)
  },
  CurrentSpaceTextContainer: {
    paddingHorizontal: dp(10),
    borderBottomWidth: 1,
  }

})