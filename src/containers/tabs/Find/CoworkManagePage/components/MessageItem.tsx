import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Button } from '../../../../../components'
import styles from './styles'

interface State {
  [name: string]: any,
  title?: string,
  content?: Array<any>,
  buttonTitle?: string,
  buttonAction?: (item?: any) => void,
}

interface Props {
  [name: string]: any,
  data: any, 
}

export default class MessageItem extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      title: '',
      content: [],
      buttonTitle: '',
    }
  }

  _onPress = () => {}

  _renderContentItemView = (item: State): JSX.Element => {
    return (
      <View style={styles.contentItemView}>
        <View style={styles.contentTextView}>
          <Text style={styles.contentText}>{item.title}</Text>
          <Text style={styles.contentText}>:</Text>
        </View>
        <View style={styles.contentTextView2}>
          <Text style={styles.contentText}>{item.value}</Text>
        </View>
      </View>
    )
  }

  _renderContentView = (): JSX.Element | null => {
    if (!this.state.content) return null
    return (
      <View style={styles.contentView}>
        {
          this.state.content.map((element: any) => this._renderContentItemView(element))
        }
      </View>
    )
  }

  /**
   * 可自定义button
   */
  _renderButtons = (): JSX.Element | null => {
    if (!this.state.buttonTitle) return null
    return (
      <Button style={styles.button} title={this.state.buttonTitle} />
    )
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.itemContainer}
        onPress={this._onPress}
      >
        {
          this.state.title &&
          <Text style={styles.title}>{this.state.title}</Text>
        }
        {this._renderContentView()}
        {this._renderButtons()}
      </TouchableOpacity>
    )
  }
}
