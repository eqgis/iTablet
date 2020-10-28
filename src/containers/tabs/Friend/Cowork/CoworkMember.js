import React, { Component } from 'react'
import { View, Text, FlatList, Switch } from 'react-native'
import { Container } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import { scaleSize } from '../../../../utils'
import CoworkInfo from './CoworkInfo'
import color from '../../../../styles/color'

class CoworkMember extends Component {
  props: {
    language: String,
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    let data = []
    if (CoworkInfo.coworkId !== '') {
      data = data.concat(CoworkInfo.members)
      this.setState({ data })
    }
  }

  render() {
    return (
      <Container
        style={{ backgroundColor: 'rgba(240,240,240,1.0)' }}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(GLOBAL.language).Friends.COWORK_MEMBER,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          data={this.state.data}
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
                <View
                  style={{
                    marginHorizontal: scaleSize(20),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ flex: 1, fontSize: scaleSize(26) }}>
                    {item.name}
                  </Text>
                  <Switch
                    trackColor={{ false: color.bgG, true: color.switch }}
                    thumbColor={item.show ? color.bgW : color.bgW}
                    ios_backgroundColor={item.show ? color.switch : color.bgG}
                    value={item.show}
                    onValueChange={value => {
                      if (value) {
                        CoworkInfo.showUserTrack(item.id)
                      } else {
                        CoworkInfo.hideUserTrack(item.id)
                      }
                      this.getData()
                    }}
                  />
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
