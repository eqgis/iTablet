import React, { Component } from 'react'
import { View, Text, FlatList } from 'react-native'
import { Container } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import { scaleSize } from '../../../../utils'
import CoworkInfo from './CoworkInfo'

class CoworkMember extends Component {
  props: {
    language: String,
    navigation: Object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    let data = []
    if (CoworkInfo.coworkId !== '') {
      data = data.concat(CoworkInfo.members)
    }
    return (
      <Container
        style={{ backgroundColor: 'rgba(240,240,240,1.0)' }}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Friends.COWORK_MEMBER,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  backgroundColor: 'white',
                  height: scaleSize(80),
                  justifyContent: 'center',
                }}
              >
                <View style={{ marginLeft: scaleSize(20) }}>
                  <Text style={{ fontSize: scaleSize(26) }}>{item.name}</Text>
                </View>
              </View>
            )
          }}
        />
      </Container>
    )
  }
}

export default CoworkMember
