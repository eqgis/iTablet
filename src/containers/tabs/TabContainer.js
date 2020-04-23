/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React from 'react'
import { Container } from '../../components'
import TabBar from './TabBar'

export default class TabContainer extends Container {
  renderTabBar = () => {
    return <TabBar navigation={this.props.navigation} />
  }

  render() {
    return (
      <Container {...this.props} bottomBar={this.renderTabBar()}>
        {this.props.children}
      </Container>
    )
  }
}
