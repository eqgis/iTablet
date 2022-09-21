import React, { Component } from 'react'
import { View, Text, FlatList, ListRenderItemInfo } from 'react-native'
import styles from './styles'

export interface PipeLineAttributeType {
  title: string
  value: string
}

interface Props {
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


  renderItem = ({item}: ListRenderItemInfo<PipeLineAttributeType> ) => {
    if(item.title === 'SmID') {
      return null
    }
    return (
      <View style = {[styles.row]} >
        <View style = {[styles.colLeft]} >
          <Text style = {[styles.textStyle]} >{item.title}</Text>
        </View>
        <View style = {[styles.colRight]} >
          <Text style = {[styles.textStyle]} >{item.value}</Text>
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

        <FlatList
          data = {this.props.pipeLineAttribute}
          renderItem = {this.renderItem}
          keyExtractor = {item => item.title}
          showsVerticalScrollIndicator = {true}
        />
      </View>
    )
  }
}

export default PipeLineAttribute
