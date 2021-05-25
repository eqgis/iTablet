import * as React from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, setSpText } from '../../../../utils'
import { TableItemType } from './types'

interface Props {
  data: TableItemType,
  isSelected?: boolean,
  rowIndex: number,
  cellIndex: number
}

interface State {
  // selected: boolean,
}

export default class Tabs extends React.Component<Props, State> {
  static defaultProps = {
    isSelected: false,
  }

  constructor(props: Props) {
    super(props)
    // this.state = {
    //   selected: false,
    // }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  _action = () => {
    if (this.props.data?.action) {
      this.props.data.action(this.props.data)
    }
  }

  render() {
    let icon, isSelected = this.props.isSelected && this.props.data.selectedImage
    if (isSelected) {
      icon = this.props.data.selectedImage
    } else {
      icon = this.props.data.image
    }
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={this._action}
          style={[styles.imageView, isSelected && styles.selectImageBg]}
        >
          <Image
            resizeMode={'contain'}
            source={icon}
            style={styles.smallIcon}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          {this.props.data.title}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    width: scaleSize(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageView: {
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(40),
    backgroundColor: color.itemColorGray4,
  },
  selectImageBg: {
    backgroundColor: color.itemColorGray,
  },
  smallIcon: {
    width: scaleSize(50),
    height: scaleSize(50),
  },
  title: {
    marginTop: scaleSize(10),
    color: color.font_color_white,
    fontSize: setSpText(15),
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})
