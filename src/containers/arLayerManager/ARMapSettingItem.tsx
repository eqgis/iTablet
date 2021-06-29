import React from 'react'
import { StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color } from '../../styles'
import { ARLayer } from 'imobile_for_reactnative'

const imgSize = scaleSize(44)
const styles = StyleSheet.create({
  item: {
    height: scaleSize(86),
    backgroundColor: color.content_white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginLeft: scaleSize(60),
    height: imgSize,
    width: imgSize,
  },
  text: {
    fontSize: setSpText(24),
    marginLeft: scaleSize(60),
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})

interface ItemProps {
  data: any,
  onPress?: (layer: ARLayer) => void,
  currentLayer?: ARLayer,
}

interface ItemState {
  visible: boolean
}

export default class ARMapSettingItem extends React.PureComponent<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props)
  }

  _onPress = () => {
    if (this.props.data.action) {
      this.props.data.action()
    } else if (this.props.onPress) {
      this.props.onPress(this.props.data)
    }
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this._onPress()
        }}
      >
        {this.props.data.image && (
          <Image
            resizeMode={'contain'}
            style={styles.image}
            source={this.props.data.image}
          />
        )}
        <Text style={styles.text}>
          {this.props.data.title}
        </Text>
      </TouchableOpacity>
    )
  }
}