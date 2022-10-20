import { getImage } from '../../../../assets'
import React, { Component } from 'react'
import { View, Text, FlatList, ListRenderItemInfo, ImageBackground } from 'react-native'
import styles from './styles'
import { dp } from 'imobile_for_reactnative/utils/size'

export interface PipeLineAttributeType {
  title: string
  value: string
}

interface Props {
  pipeLineAttribute?:Array<PipeLineAttributeType>
  setPipeLineAttribute?: (params: Array<PipeLineAttributeType>) => void
}

interface State {
  attribute: Array<PipeLineAttributeType>,
}

class PipeLineAttribute extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const attribute = this.getFilterData()
    this.state = {
      attribute: attribute,
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (JSON.stringify(prevProps.pipeLineAttribute) !== JSON.stringify(this.props.pipeLineAttribute)) {
      const attribute = this.getFilterData()
      this.setState({
        attribute: attribute,
      })
    }
  }

  componentWillUnmount = () => {
    this.props.setPipeLineAttribute && this.props.setPipeLineAttribute([])
  }

  getFilterData = () => {
    const attribute = []
    if (this.props.pipeLineAttribute) {
      for (const item of this.props.pipeLineAttribute) {
        if(item.title === 'SmID' || item.value === '' || item.value === undefined) {
          continue
        } else {
          attribute.push(item)
        }
      }
    }
    return attribute
  }


  render() {
    if(!this.props?.pipeLineAttribute
      || (this.props.pipeLineAttribute && this.props.pipeLineAttribute.length <= 0)
    ) {
      return null
    }

    const data1 = { title: '类别', value: ''}
    const data2 = { title: '族', value: ''}
    const data3 = { title: '标高', value: ''}
    const data4 = { title: '偏移', value: ''}
    const data5 = { title: '流量', value: ''}
    for(const item of this.props.pipeLineAttribute) {
      if (item.title === data1.title) {
        data1.value = item.value
      } else if (item.title === '族') {
        data2.value = item.value
      } else if (item.title === data3.title) {
        data3.value = item.value || '0'
      } else if (item.title === data4.title) {
        data4.value = item.value || '0'
      } else if (item.title === data5.title) {
        data5.value = item.value || '0m³/h'
      }
    }

    return (
      <View
        style = {[styles.container]}
      >
        <ImageBackground source={getImage().bg_02} resizeMode={'stretch'} style={styles.row}>
          <Text style={styles.title}>{data1.title}</Text>
          <Text style={styles.valueText}>{data1.value}</Text>
        </ImageBackground>

        <ImageBackground source={getImage().bg_02} resizeMode={'stretch'} style={[styles.row, { marginTop: dp(10)}]}>
          <Text style={styles.title}>{data2.title}</Text>
          <Text style={styles.valueText}>{data2.value}</Text>
        </ImageBackground>

        <View style={[styles.row2, { marginTop: dp(10)}]}>
          <ImageBackground source={getImage().bg_01} resizeMode={'stretch'} style={styles.column}>
            <Text style={styles.title2}>{data3.title}</Text>
            <Text style={styles.valueText2}>{data3.value}</Text>
          </ImageBackground>
          <ImageBackground source={getImage().bg_01} resizeMode={'stretch'} style={styles.column}>
            <Text style={styles.title2}>{data4.title}</Text>
            <Text style={styles.valueText2}>{data4.value}</Text>
          </ImageBackground>
          <ImageBackground source={getImage().bg_01} resizeMode={'stretch'} style={styles.column}>
            <Text style={styles.title2}>{data5.title}</Text>
            <Text style={styles.valueText2}>{data5.value}</Text>
          </ImageBackground>
        </View>
        {/* <View style={styles.close} /> */}
      </View>
    )
  }
}

export default PipeLineAttribute
