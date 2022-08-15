import React, { Component } from 'react'
import { View, Text, FlatList } from 'react-native'
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

interface State {
  // data: Array<PipeLineAttributeType>
}

class PipeLineAttribute extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      // data: this.props.pipeLineAttribute || [],
    }
  }

  // componentDidUpdate = () => {
  //   console.warn('pipe line attribute update ')
  // }

  componentWillUnmount = () => {
    this.props.setPipeLineAttribute && this.props.setPipeLineAttribute([])
  }


  renderItem = ({item}) => {
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
        {/* <Text style = {[styles.textStyle]} >{"这是管线属性表"}</Text> */}
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