import * as React from 'react'

import { View, StyleSheet, Text, TextInput } from 'react-native'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../utils'
import { SMap } from 'imobile_for_reactnative'
import Input from '../../../../components/Input'
export default class MapSelectPointLatitudeAndLongitude extends React.Component {
  props: {
    isEdit: Boolean,
  }

  constructor(props) {
    super(props)
    this.state = {
      show: true,
      //   isEdit: false,
      isEdit: this.props.isEdit,
      latitude: '',
      longitude: '',
    }
  }

  componentDidMount = async () => {
    let position
    if(GLOBAL.DATUMPOINTHISTORY){
      position = GLOBAL.DATUMPOINTHISTORY
    }
    else if (GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE) {
      position = GLOBAL.SELECTPOINTLATITUDEANDLONGITUDE
    } else {
      position = await SMap.getCurrentPosition()
    }
    this.updateLatitudeAndLongitude(position)
  }

  setVisible = iShow => {
    this.setState({ show: iShow })
  }

  updateLatitudeAndLongitude(point) {
    this.setState({
      longitude: point.x,
      latitude: point.y,
    })
  }

  getLatitudeAndLongitude() {
    return {
      x: Number(this.state.longitude),
      y: Number(this.state.latitude),
    }
  }

  clearNoNum = value => {
    value = value.replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if (value.indexOf('.') < 0 && value != '') {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value = parseFloat(value)
    } else if (value == '') {
      value = 0
    }
    return value + ''
  }

  render() {
    if (this.state.show) {
      return (
        <View
          style={{
            //   position: 'absolute',
            //   top: 0,
            width: '100%',
          }}
        >
          <View style={{ backgroundColor: color.background }}>
            <View style={styles.item}>
              <Text style={styles.itemtitle}>
                {getLanguage(GLOBAL.language).Profile.X_COORDINATE}
              </Text>
              {/* <TextInput
                editable={this.state.isEdit}
                style={styles.itemInput}
                keyboardType="numeric"
                onChangeText={text => {
                  // let longitude=Number(text)
                  let longitude = this.clearNoNum(text)
                  this.setState({
                    longitude: longitude,
                  })
                }}
                value={this.state.longitude + ''}
              /> */}
              {/* 替换为具有清除按钮的输入框 */}
              <Input
                editable={this.state.isEdit}
                style={styles.itemInput}
                keyboardType="numeric"
                onChangeText={text => {
                  // let longitude=Number(text)
                  let longitude = this.clearNoNum(text)
                  this.setState({
                    longitude: longitude,
                  })
                }}
                value={this.state.longitude + ''}
                showClear={true}
                inputStyle={{textAlign: 'left'}}
              />
            </View>

            <View style={styles.separateLine} />

            <View style={styles.item}>
              <Text style={styles.itemtitle}>
                {getLanguage(GLOBAL.language).Profile.Y_COORDINATE}
              </Text>
              {/* <TextInput
                editable={this.state.isEdit}
                style={styles.itemInput}
                keyboardType="numeric"
                onChangeText={text => {
                  let latitude = this.clearNoNum(text)
                  this.setState({
                    latitude: latitude,
                  })
                }}
                value={this.state.latitude + ''}
              /> */}
              <Input
                editable={this.state.isEdit}
                style={styles.itemInput}
                keyboardType="numeric"
                onChangeText={text => {
                  let latitude = this.clearNoNum(text)
                  this.setState({
                    latitude: latitude,
                  })
                }}
                value={this.state.latitude + ''}
                showClear={true}
                inputStyle={{textAlign: 'left'}}
              />
            </View>
            <View style={styles.separateLine} />
          </View>
        </View>
      )
    } else {
      return <View />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgW,
  },

  item: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  title: {
    fontSize: scaleSize(18),
    color: color.gray,
    marginLeft: 15,
  },
  subTitle: {
    fontSize: scaleSize(20),
    marginLeft: 15,
  },
  separateLine: {
    width: '100%',
    height: scaleSize(1),
    backgroundColor: color.item_separate_white,
  },
  input: {
    width: '100%',
    height: scaleSize(120),
    fontSize: scaleSize(22),
    padding: scaleSize(15),

    // textAlignVertical: 'center',

    backgroundColor: color.white,
  },

  titleHeader: {
    fontSize: scaleSize(24),
    color: color.gray,
  },
  itemHeader: {
    width: '100%',
    height: scaleSize(240),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: color.content_white,
  },

  itemtitle: {
    fontSize: scaleSize(20),
    color: color.black,
    paddingLeft: scaleSize(15),
    paddingRight: scaleSize(15),
    backgroundColor: color.white,
  },
  itemInput: {
    // width: '100%',
    flex: 1,
    // height: scaleSize(120),
    fontSize: scaleSize(22),
    padding: scaleSize(15),

    // textAlignVertical: 'center',

    backgroundColor: color.white,
  },
  itemButton: {
    fontSize: scaleSize(20),
    padding: scaleSize(15),
    color: color.blue1,
    paddingLeft: scaleSize(15),
    paddingRight: scaleSize(15),
  },
  buttonTouable: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonItem: {
    width: '100%',
    height: scaleSize(80),
    paddingRight: scaleSize(15),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
