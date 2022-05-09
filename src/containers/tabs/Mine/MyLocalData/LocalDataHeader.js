import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
//eslint-disable-next-line
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { getThemeAssets } from '../../../../assets'

export default class LocalDtaHeader extends Component {
  props: {
    info: Object,
    changeHearShowItem: () => {},
  }
  constructor(props) {
    super(props)
  }

  render() {
    let title = this.props.info.section.title
    if (title !== undefined) {
      let imageSource = this.props.info.section.isShowItem
        ? getThemeAssets().publicAssets.icon_drop_down
        : getThemeAssets().publicAssets.icon_drop_up
      let imageWidth = scaleSize(52)
      let height = scaleSize(80)
      let fontSize = size.fontSize.fontSizeXl
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.changeHearShowItem &&
              this.props.changeHearShowItem(title)
          }}
          style={{
            width: '100%',
            height: height,
            backgroundColor: color.bgW2,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Image
            resizeMode={'contain'}
            style={{
              tintColor: color.imageColorWhite,
              marginLeft: 10,
              width: imageWidth,
              height: imageWidth,
            }}
            source={imageSource}
          />
          <Text
            style={[
              {
                color: color.fontColorBlack,
                paddingLeft: 15,
                fontSize: fontSize,
                fontWeight: 'bold',
                backgroundColor: 'transparent',
              },
            ]}
          >
            {title}
          </Text>
        </TouchableOpacity>
      )
    } else {
      return <View />
    }
  }
}
