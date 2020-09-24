import React, { Component } from 'react'
import {
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
  FlatList,
} from 'react-native'
import { Container, Button } from '../../../../components'
import { color, size } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { Toast, scaleSize, dataUtil } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { SMap } from 'imobile_for_reactnative'
import { getLayerIconByType } from '../../../../assets'

const radio_on = require('../../../../assets/public/radio_select.png')
const radio_off = require('../../../../assets/public/radio_select_no.png')

export default class LoadServer extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.baseMaps = params.baseMaps || []
    this.setBaseMap = params.setBaseMap
    this.user = params.user
    if (params.item) {
      //修改原来 add xiezhy
      this.item = {
        server: params.item.DSParams.server,
        name: params.item.mapName,
        engineType: params.item.engineType,
      }
      this.state = {
        server: params.item.DSParams.server,
        name: params.item.mapName,
      }
    } else {
      this.item = undefined
      this.state = {
        server: '',
        name: '',
        engineType: 225,
        driver: 'WMS',
        datasetArr: [],
        selcetIndex: -1,
        isCanSave: false,
      }
    }
  }

  sure = async () => {
    try {
      let _DSParams = {}
      let alias = this.state.name
      // let layerName =
      //   this.state.server.substring(
      //     this.state.server.lastIndexOf('/') + 1,
      //     this.state.server.length,
      //   ) +
      //   '@' +
      //   alias
      let checkURL = dataUtil.isLegalURL(this.state.server)
      if (!checkURL.result) {
        Toast.show(checkURL.error)
        return
      }
      if (this.state.engineType === 23) {
        _DSParams = {
          server: this.state.server,
          engineType: this.state.engineType,
          alias: alias,
          driver: this.state.driver,
        }
      } else {
        _DSParams = {
          server: this.state.server,
          engineType: this.state.engineType,
          alias: alias,
        }
      }
      let datasetInfo = await SMap.getDatasourceInfo(_DSParams)
      if (datasetInfo.isCanOpen) {
        let _datasetArr = datasetInfo.datasetArr
        this.setState({
          datasetArr: _datasetArr,
        })
      } else {
        Toast.show(
          getLanguage(global.language).Prompt.INCORRECT_IPORTAL_ADDRESS,
        )
        this.setState({
          datasetArr: [],
        })
      }
    } catch (e) {
      return
    }
  }

  renderItem = ({ item }) => {
    let _backgroundColor =
      this.state.selcetIndex === item.index ? color.blue1 : color.black
    return (
      <View>
        <TouchableOpacity
          // style={{backgroundColor:_backgroundColor,paddingLeft:scaleSize(30),paddingRight:scaleSize(30)}}
          style={{ paddingLeft: scaleSize(30), paddingRight: scaleSize(30) }}
          onPress={() => {
            this.setState({
              datasetArr: this.state.datasetArr.concat(),
              selcetIndex: item.index,
              isCanSave: true,
            })
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={styles.image}
              source={getLayerIconByType(item.datasetType)}
            />
            <Text style={[styles.title, { color: _backgroundColor }]}>
              {item.datasetName}
            </Text>
          </View>
        </TouchableOpacity>
        {this.state.datasetArr.length - 1 === item.index ? null : (
          <View style={styles.lineStyle} />
        )}
      </View>
    )
  }

  renderDatasetList = () => {
    return (
      <View
        style={{
          marginTop: scaleSize(20),
          marginHorizontal: scaleSize(30),
          flex: 1,
        }}
      >
        <View style={[styles.titleView, { backgroundColor: color.white }]}>
          <Text style={styles.title}>
            {getLanguage(global.language).Analyst_Labels.Dataset}
          </Text>
        </View>
        <FlatList
          data={this.state.datasetArr}
          keyExtractor={(item, index) => String(index)}
          renderItem={this.renderItem}
        />
      </View>
    )
  }

  _renderHeaderBtn = () => {
    let thisHandle = this
    return (
      <TouchableOpacity
        onPress={() => {
          try {
            if (!this.state.isCanSave) {
              return
            }
            if (this.state.name === '') {
              Toast.show(getLanguage(global.language).Prompt.ENTER_MAP_NAME)
              //'请输入底图名称')
              return
            }
            if (this.state.server === '') {
              Toast.show(
                getLanguage(global.language).Prompt.ENTER_SERVICE_ADDRESS,
              )
              //'请输入服务地址')
              return
            }
            let alias = this.state.name
            let layerName =
              this.state.server.substring(
                this.state.server.lastIndexOf('/') + 1,
                this.state.server.length,
              ) +
              '@' +
              alias //this.state.server.lastIndexOf('/')
            let _DSParams = {}
            if (this.state.engineType === 23) {
              _DSParams = {
                server: this.state.server,
                engineType: this.state.engineType,
                alias: alias,
                driver: this.state.driver,
                // datasetIndex: this.state.selcetIndex,
                layerIndex: this.state.selcetIndex,
              }
            } else {
              _DSParams = {
                server: this.state.server,
                engineType: this.state.engineType,
                alias: alias,
                // datasetIndex: this.state.selcetIndex,
                layerIndex: this.state.selcetIndex,
              }
            }
            let item = {
              type: 'Datasource',
              DSParams: _DSParams,
              // DSParams: {
              //   server: this.state.server,
              //   engineType: this.state.engineType,
              //   alias: alias,
              // },
              // layerIndex: 0,
              layerIndex: this.state.selcetIndex,
              mapName: this.state.name,
              layerName: layerName,
              userAdd: true,
            }
            let list = this.baseMaps
            //add xiezhy
            if (thisHandle.item != undefined) {
              for (let i = 0, n = list.length; i < n; i++) {
                if (
                  list[i].DSParams.server === thisHandle.item.server &&
                  list[i].mapName === thisHandle.item.name
                ) {
                  list.splice(i, 1)
                  break
                }
              }
            }
            list.push(item)
            let count = list.length
            for (let i = 0; i < count; i++) {
              list[i].index = i
            }
            this.setBaseMap &&
              this.setBaseMap({
                userId: this.user.currentUser.userId,
                baseMaps: list,
              })
            NavigationService.goBack()
          } catch (error) {
            Toast.show(getLanguage(global.language).Prompt.SAVE_FAILED)
            //'保存失败')
          }

          // console.log(this.props.navigation.state)
        }}
      >
        <Text
          style={[
            styles.text,
            { color: this.state.isCanSave ? color.fontColorBlack : color.gray },
          ]}
        >
          {getLanguage(global.language).Profile.SAVE}

          {/* {'保存'} */}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    let _isCanSure = this.state.name !== '' && this.state.server !== ''
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.SERVICE_ADDRESS,
          //'服务地址',
          navigation: this.props.navigation,
          headerRight: this._renderHeaderBtn(),
        }}
      >
        <TextInput
          value={this.state.name}
          placeholder={getLanguage(global.language).Profile.MAP_NAME}
          placeholderTextColor={color.fontColorGray}
          style={styles.textInput}
          ref={ref => (this.name = ref)}
          onChangeText={text => this.setState({ name: text })}
        />
        <TextInput
          value={this.state.server}
          placeholder={
            getLanguage(global.language).Profile.ENTER_SERVICE_ADDRESS
          }
          placeholderTextColor={color.fontColorGray}
          style={[styles.textInput, { marginTop: 20 }]}
          ref={ref => (this.server = ref)}
          onChangeText={text => this.setState({ server: text })}
        />
        <View
          style={{
            flexDirection: 'row',
            marginLeft: scaleSize(25),
            marginTop: 10,
            height: scaleSize(60),
            alignItems: 'center',
          }}
        >
          <Text state={styles.textRadio}>
            {getLanguage(global.language).Profile.DATASOURCE_TYPE + ' :'}
          </Text>
          <TouchableOpacity
            style={[styles.itemView, { alignItems: 'center' }]}
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ engineType: 225 })
            }}
          >
            <Image
              style={styles.image}
              source={this.state.engineType === 225 ? radio_on : radio_off}
            />
            <Text state={styles.textRadio}>{'REST'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.itemView,
              { alignItems: 'center', marginLeft: scaleSize(20) },
            ]}
            activeOpacity={0.9}
            onPress={() => {
              if (this.state.server != '') {
                let name = this.state.server.substring(
                  this.state.server.lastIndexOf('/') + 1,
                  this.state.server.length,
                )
                let upName = name.toUpperCase()
                if (
                  upName === 'WMS' ||
                  upName === 'WFS' ||
                  upName === 'WCS' ||
                  upName === 'TMS' ||
                  upName === 'WMTS'
                ) {
                  this.setState({ engineType: 23, driver: upName })
                } else {
                  this.setState({ engineType: 23 })
                }
              } else {
                this.setState({ engineType: 23 })
              }
            }}
          >
            <Image
              style={styles.image}
              source={this.state.engineType === 23 ? radio_on : radio_off}
            />
            <Text state={styles.textRadio}>{'OGC'}</Text>
          </TouchableOpacity>
        </View>

        {this.state.engineType !== 23 ? null : (
          <View
            style={{
              flexDirection: 'row',
              marginLeft: scaleSize(25),
              paddingRight: scaleSize(25),
              marginTop: 10,
              alignItems: 'center',
            }}
          >
            <Text state={styles.textRadio}>
              {getLanguage(global.language).Profile.SERVICE_TYPE + ' :'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <TouchableOpacity
                style={[
                  styles.itemView,
                  { alignItems: 'center', marginLeft: scaleSize(20) },
                ]}
                activeOpacity={0.9}
                onPress={() => {
                  this.setState({ driver: 'WMS' })
                }}
              >
                <Image
                  style={styles.image}
                  source={this.state.driver === 'WMS' ? radio_on : radio_off}
                />
                <Text state={styles.textRadio}>{'WMS'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.itemView,
                  { alignItems: 'center', marginLeft: scaleSize(20) },
                ]}
                activeOpacity={0.9}
                onPress={() => {
                  this.setState({ driver: 'WFS' })
                }}
              >
                <Image
                  style={styles.image}
                  source={this.state.driver === 'WFS' ? radio_on : radio_off}
                />
                <Text state={styles.textRadio}>{'WFS'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.itemView,
                  { alignItems: 'center', marginLeft: scaleSize(20) },
                ]}
                activeOpacity={0.9}
                onPress={() => {
                  this.setState({ driver: 'WCS' })
                }}
              >
                <Image
                  style={styles.image}
                  source={this.state.driver === 'WCS' ? radio_on : radio_off}
                />
                <Text state={styles.textRadio}>{'WCS'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.itemView,
                  { alignItems: 'center', marginLeft: scaleSize(20) },
                ]}
                activeOpacity={0.9}
                onPress={() => {
                  this.setState({ driver: 'TMS' })
                }}
              >
                <Image
                  style={styles.image}
                  source={this.state.driver === 'TMS' ? radio_on : radio_off}
                />
                <Text state={styles.textRadio}>{'TMS'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.itemView,
                  { alignItems: 'center', marginLeft: scaleSize(20) },
                ]}
                activeOpacity={0.9}
                onPress={() => {
                  this.setState({ driver: 'WMTS' })
                }}
              >
                <Image
                  style={styles.image}
                  source={this.state.driver === 'WMTS' ? radio_on : radio_off}
                />
                <Text state={styles.textRadio}>{'WMTS'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ alignItems: 'center' }}>
          <Button
            title={getLanguage(global.language).Prompt.CONFIRM}
            ref={ref => (this.sureButton = ref)}
            type={_isCanSure ? 'BLUE' : 'GRAY'}
            style={{
              width: '94%',
              height: scaleSize(60),
              marginTop: scaleSize(30),
            }}
            titleStyle={{ fontSize: scaleSize(24) }}
            disabled={!_isCanSure}
            onPress={() => {
              if (_isCanSure) {
                this.sure()
              }
            }}
          />
        </View>

        {this.renderDatasetList()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: size.fontSize.fontSizeMd,
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: color.bgG,
  },
  text: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.reverseTheme,
  },
  itemView: {
    height: scaleSize(60),
    marginLeft: scaleSize(15),
    flexDirection: 'row',
  },
  image: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  textRadio: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.black,
    marginLeft: scaleSize(20),
  },
  titleView: {
    height: scaleSize(60),
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleSize(24),
    marginLeft: scaleSize(30),
    color: color.gray,
  },
  lineStyle: {
    width: '100%',
    height: 1,
    marginRight: scaleSize(20),
    backgroundColor: color.background,
  },
})
