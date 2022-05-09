import * as React from 'react'
import { View, TouchableOpacity, Image, Text } from 'react-native'
import { scaleSize } from '../../utils'

export default class BottomBar extends React.Component {
  props: {
    data: [],
    getData: () => {},
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      customView: undefined,
    }
    this._data = {}
  }

  componentDidMount() {
    this.goto('main')
  }

  goto = pageKey => {
    let { data, pageAction, customView } = this.props.getData(pageKey, this)
    if (data.length > 0) {
      this.setState({
        data: data,
        customView,
      })
      pageAction(this)
    }
  }

  getData = () => {
    return this._data
  }

  addData = data => {
    Object.assign(this._data, data)
  }

  renderItems = () => {
    let items = []
    for (let i = 0; i < this.state.data.length; i++) {
      items.push(this.renderItem(this.state.data[i]))
    }
    return items
  }

  renderItem = item => {
    return (
      <TouchableOpacity
        key={item.key}
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          if (item.action) {
            item.action()
          }
          this.goto(item.key)
        }}
      >
        <Image
          source={item.image}
          style={{ width: scaleSize(60), height: scaleSize(60) }}
        />
        {item.title && (
          <Text style={{ color: 'white', fontSize: scaleSize(20) }}>
            {item.title}
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View
       style={{position: 'absolute',
      left: 0,
      bottom: 0,  height: scaleSize(96) , width: '100%'}}
      >
        {this.state.customView || null}
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: scaleSize(96),
            backgroundColor: 'black',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingHorizontal: scaleSize(40),
          }}
        >
          {this.renderItems()}
        </View>
      </View>
    )
  }
}
