import React from 'react'
import { connect } from 'react-redux'
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { color } from '../../styles'
import { scaleSize } from '../../utils'

class TabItem extends React.Component {
  props: {
    item: Object,
    language: String,
    selected: boolean,
    onPress: () => {},
    renderExtra: () => {},
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.props.onPress}
        style={styles.touchView}
      >
        <View style={styles.labelView}>
          <Image
            resizeMode="contain"
            source={
              this.props.selected
                ? this.props.item.selectedImage
                : this.props.item.image
            }
            style={styles.icon}
          />
          <Text style={styles.tabText}>{this.props.item.title}</Text>
          {this.props.renderExtra && this.props.renderExtra()}
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.toJS(),
    language: state.setting.toJS().language,
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabItem)

const styles = StyleSheet.create({
  tabText: {
    textAlign: 'center',
    color: color.itemColorGray,
    fontSize: scaleSize(20),
  },
  icon: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  touchView: {
    alignItems: 'center',
  },
  labelView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
