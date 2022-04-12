import React, { Component } from 'react'
import { Container } from '../components'
import { getLanguage } from '../language/index'
import {
  SMWebViewUI,
} from 'imobile_for_reactnative'

interface Props {
  navigation: Object,
}

class WebView extends Component<Props> {
  constructor(props: Props) {
    super(props)
  }


  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.CANCELLATION,
          navigation: this.props.navigation,
        }}
      >
        <SMWebViewUI/>
      </Container>
    )
  }
}


export default WebView