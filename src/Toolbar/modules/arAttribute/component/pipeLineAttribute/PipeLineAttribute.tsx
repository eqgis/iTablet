import React, { Component } from 'react'
import { View, Text, FlatList, ListRenderItemInfo } from 'react-native'
import styles from './styles'

export interface PipeLineAttributeType {
  title: string
  value: string
}

interface Props {
  // data?:Array<PipeLineAttributeType>
  pipeLineAttribute?:Array<PipeLineAttributeType>
  setPipeLineAttribute?: (params: Array<PipeLineAttributeType>) => void
}

class PipeLineAttribute extends Component<Props> {
  constructor(props: Props) {
    super(props)
    this.state = {
    }
  }


  componentWillUnmount = () => {
    this.props.setPipeLineAttribute && this.props.setPipeLineAttribute([])
  }


  renderItem = ({item} : ListRenderItemInfo<PipeLineAttributeType>) => {
    return (
      <View style = {[styles.row]} >
        <View style = {[styles.col]} >
          <Text style = {[styles.textStyle]} >{item.title}</Text>
        </View>
        <View style = {[styles.col]} >
          <Text style = {[styles.textStyle]} >{item.value}</Text>
        </View>
      </View>
    )
  }

  renderHead = () => {
    return (
      <View style = {[styles.row]} >
        <View style = {[styles.col]} >
          <Text style = {[styles.textStyle]} >{'title'}</Text>
        </View>
        <View style = {[styles.col]} >
          <Text style = {[styles.textStyle]} >{'value'}</Text>
        </View>
      </View>
    )
  }


  render() {
    if(!this.props?.pipeLineAttribute
      || (this.props.pipeLineAttribute && this.props.pipeLineAttribute.length <= 0)
    ) {
      return null
    }

    return (
      <View
        style = {[styles.container]}
      >
        { this.renderHead()}
        <FlatList
          data = {this.props.pipeLineAttribute}
          renderItem = {this.renderItem}
          keyExtractor = {item => item.title}
          // ListHeaderComponent = {this.renderHead}
        />
      </View>
    )
  }
}

export default PipeLineAttribute