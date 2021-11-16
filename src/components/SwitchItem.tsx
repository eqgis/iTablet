import React from 'react'
import { Switch, Text, View } from 'react-native'
import { AppStyle } from '../styles'

interface Props {
  text: string,
  value: boolean,
  onPress: (value: boolean) => void,
}

interface State {
  value: boolean,
}

class SwitchItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      value: this.props.value,
    }
  }

  onPress = (value: boolean) => {
    this.props.onPress(value)
    this.setState({value})
  }

  render() {
    return(
      <View style={AppStyle.ListItemStyleNS}>
        <Text style={{...AppStyle.Text_Style, flex: 1}}>
          {this.props.text}
        </Text>
        <Switch
          value={this.state.value}
          onValueChange={this.onPress}
        />
      </View>
    )
  }
}

export default SwitchItem