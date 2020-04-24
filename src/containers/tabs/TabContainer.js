/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React from 'react'
import { Container } from '../../components/Container'
import TabBar from './TabBar'
import { connect } from 'react-redux'

class TabContainer extends Container {
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

const mapStateToProps = state => {
  return {
    device: state.device.toJS().device,
  }
}

export default connect(
  mapStateToProps,
  null,
  null,
  {
    forwardRef: true,
  },
)(TabContainer)
