import React, { Component } from 'react'
import {
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native'
import { Container } from '../../../../components'
import { connect } from 'react-redux'
import LocalDataItem from './LocalDataItem'
import { getLanguage } from '../../../../language/index'
import { scaleSize ,setSpText,Toast} from '../../../../utils'

// let AppUtils = NativeModules.AppUtils

class Report extends Component {
  props: {
    navigation: Object,
    latestMap: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          name: '发布不是当内容对我造成骚扰',
        },
        {
          name: '垃圾广告、售卖假货等',
        },
        {
          name: '色情低俗',
        },
        {
          name: '违法犯罪',
        },
        {
          name: '时政不实信息',
        },
        {
          name: '未成年相关',
        },
        {
          name: '涉嫌诈骗',
        },
        {
          name: '此账号可能被盗用',
        },
      ],
      selectedData:[],
    }
  }

  renderList = () => {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this.renderItem}
        extraData={this.state}
      />
    )
  }

  isItemSelected = item => {
    return this.state.selectedData.some(data => {
      return item.name === data.name
    })
  }

  renderItem = ({ item }) => {
    return (
      <LocalDataItem
        item={item}
        text={item.name}
        onSelectPress={this._onSelectPress}
        isSelected={this.isItemSelected(item)}
      />
    )
  }

  _onSelectPress = item => {
    const index = this.state.selectedData.findIndex(data => {
      return item.name === data.name
    })
    if(index === -1) {
      this.setState({
        selectedData: [...this.state.selectedData, item],
      })
    } else {
      const newArr = this.state.selectedData
      newArr.splice(index, 1)
      this.setState({
        selectedData: newArr,
      })
    }
  }

  render() {
    let backgroundColor,disabled
    if(this.state.selectedData.length>0){
      backgroundColor = 'black'
      disabled = false
    }else{
      backgroundColor = 'gray'
      disabled = true
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          withoutBack: false,
          navigation: this.props.navigation,
          title:'私信举报',
          headerTitleViewStyle: {
            textAlign: 'left',
            marginLeft: scaleSize(80),
          },
        }}
      >
        {this.renderList()}
        <TouchableOpacity
          style={{
            position: 'absolute',
            left:'50%',
            marginLeft:-scaleSize(100),
            bottom: scaleSize(100),
            justifyContent: 'center',
            alignItems: 'center',
            width: scaleSize(200),
            height: scaleSize(80),
            borderRadius: scaleSize(30),
            backgroundColor: backgroundColor,
          }}
          onPress={() => {
            GLOBAL.Loading?.setLoading(true)
            this.timer = setTimeout(() => {
              Toast.show(
                "举报成功"
              )
              GLOBAL.Loading?.setLoading(false)
              clearTimeout(this.timer)
              this.timer = null
            }, 2000)
          }}
          disabled={disabled}
        >
          <Text style={{ color: 'white', fontSize: setSpText(26) }}>
            {getLanguage(this.language).Friends.REPORT}
          </Text>
        </TouchableOpacity>
      </Container>
    )
  }

}

const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Report)
