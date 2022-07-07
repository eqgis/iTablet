import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator ,Switch,TextInput} from 'react-native'
import { SLocation } from 'imobile_for_reactnative'
import Container from '../../components/Container'
import { scaleSize ,Toast} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import color from '../../styles/color'
import {size } from '../../styles'

const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

class LocationSetting extends React.Component {
  props: {
    navigation: Object,
    peripheralDevice: String,
    setDevice: () => {},
  }

  constructor(props) {
    super(props)
    this.prevOption = this.props.peripheralDevice
    this.state = {
      devices: ['local'],
      currentOption: this.prevOption,
      showSearch: true,
      searchNotify: getLanguage(global.language).Prompt.SEARCHING,
      distanceLocation: false,
      timeLocation:false,
      distanceLocationText: "",
      timeLocationText: "",
    }
  }

  componentDidMount() {
    this.addListener()
    SLocation.searchDevice(true)
    this.startShowSearching()
    this.getLocationType()
  }

  componentWillUnmount() {
    SLocation.searchDevice(false)
    SLocation.removeDeviceListener()
  }

  addListener() {
    SLocation.addDeviceListener(device => {
      let devices = this.state.devices.clone()
      if (devices.indexOf(device) === -1) {
        devices.push(device)
        this.setState({ devices })
      }
    })
  }

  changeDevice = async () => {
    if(this.state.distanceLocation){
      SLocation.setDistanceLocation(true)
      SLocation.setTimeLocation(false)
      if(this.state.distanceLocationText === ""){
        SLocation.setLocationDistance(0+"")
      }else{
        if(isNaN(this.state.distanceLocationText)){
          Toast.show(getLanguage(global.language).Profile.INPUT_NUMBER)
          return
        }else{
          SLocation.setLocationDistance(this.state.distanceLocationText)
        }
      }
    }else if(this.state.timeLocation){
      SLocation.setTimeLocation(true)
      SLocation.setDistanceLocation(false)
      if(this.state.timeLocationText === ""){
        SLocation.setLocationTime(0+"")
      }else{
        if(isNaN(this.state.timeLocationText)){
          Toast.show(getLanguage(global.language).Profile.INPUT_NUMBER)
          return
        }else{
          SLocation.setLocationTime(this.state.timeLocationText)
        }
      }
    }else{
      SLocation.setDistanceLocation(false)
      SLocation.setTimeLocation(false)
    }
    let currentOption = this.state.currentOption
    this.props.setDevice(currentOption)
    SLocation.changeDevice(currentOption)
    NavigationService.goBack()
  }

  startShowSearching = async () => {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, 10000)
    })
    if(this.state.devices.length === 1) {
      this.setState({ searchNotify: getLanguage(global.language).Prompt.SEARCHING_DEVICE_NOT_FOUND})
    } else if(this.state.devices.length > 1) {
      this.setState({ showSearch: false})
    }
  }

  getLocationType = async () => {
    if (await SLocation.getTimeLocation()) {
      let time = await SLocation.getLocationTime()
      this.setState({ timeLocation: true , timeLocationText:""+time})
    }
    if (await SLocation.getDistanceLocation()) {
      let distance = await SLocation.getLocationDistance()
      this.setState({ distanceLocation: true , distanceLocationText: ""+distance})
    }
  }

  renderItem = key => {
    let title
    switch (key) {
      case 'local':
        title = getLanguage(global.language).Profile.SETTING_LOCATION_LOCAL
        break
      default:
        title = key
        //外部设备添加前缀
        key = 'external_' + key
        break
    }
    return (
      <View key={key}>
        <TouchableOpacity
          style={styles.itemView}
          activeOpacity={0.9}
          onPress={() => {
            this.setState({ currentOption: key })
          }}
        >
          <Text style={styles.text}>{title}</Text>
          <Image
            style={styles.image}
            source={this.state.currentOption === key ? radio_on : radio_off}
          />
        </TouchableOpacity>
        {this.renderSeperator()}
      </View>
    )
  }

  renderItems = () => {
    return this.state.devices.map(device => {
      return this.renderItem(device)
    })
  }

  renderList = () => {
    return <View style={{ flexDirection: 'column' }}>{this.renderItems()}</View>
  }

  renderLocation = () => {
    return(
      <View style={{ flexDirection: 'column' }}>
        <View style={styles.itemView}>
          <Text style={styles.text}>{getLanguage(global.language).Profile.DISTANCE_LOCATION}</Text>
          {this.state.distanceLocation && !this.state.timeLocation && <TextInput
            value={this.state.distanceLocationText}
            placeholder={getLanguage(global.language).Profile.DISTANCE_METER}
            keyboardType="numeric"
            placeholderTextColor={color.fontColorGray}
            style={styles.textInput}
            onChangeText={text => this.setState({ distanceLocationText: text })}
            returnKeyLabel={'完成'}
            returnKeyType={'done'}
          />}
          <Switch
            // style={styles.switch}
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={this.state.distanceLocation ? color.bgW : color.bgW}
            ios_backgroundColor={this.state.distanceLocation ? color.switch : color.bgG}
            value={this.state.distanceLocation}
            onValueChange={value => {
              this.setState({ distanceLocation: value ,timeLocation:false})
            }}
          />
        </View>
        {this.renderSeperator()}
        <View style={styles.itemView}>
          <Text style={styles.text}>{getLanguage(global.language).Profile.TIME_LOCATION}</Text>
          {this.state.timeLocation && !this.state.distanceLocation && <TextInput
            value={this.state.timeLocationText}
            placeholder={getLanguage(global.language).Profile.TIME}
            keyboardType="numeric"
            placeholderTextColor={color.fontColorGray}
            style={styles.textInput}
            onChangeText={text => this.setState({ timeLocationText: text })}
            returnKeyLabel={'完成'}
            returnKeyType={'done'}
          />}
          <Switch
            // style={styles.switch}
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={this.state.timeLocation ? color.bgW : color.bgW}
            ios_backgroundColor={this.state.timeLocation ? color.switch : color.bgG}
            value={this.state.timeLocation}
            onValueChange={value => {
              this.setState({ timeLocation: value ,distanceLocation:false})
            }}
          />
        </View>
        {this.renderSeperator()}
      </View>
    )
  }

  renderSeperator = () => {
    return <View style={styles.seperator} />
  }

  renderRight = () => {
    let textColor
    // if (this.state.currentOption === this.prevOption) {
    // textColor = '#A0A0A0'
    // } else {
    textColor = 'black'
    // }
    return (
      <View>
        <TouchableOpacity
          // disabled={this.state.currentOption === this.prevOption}
          onPress={this.changeDevice}
        >
          <Text style={[styles.headerRightText, { color: textColor }]}>
            {getLanguage(global.language).Profile.SAVE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderSearch() {
    return (
      <View style={styles.searchItem}>
        {this.state.searchNotify === getLanguage(global.language).Prompt.SEARCHING && (<ActivityIndicator size="small" color="#505050" />)}
        <Text style={styles.searchText}>
          {this.state.searchNotify}
        </Text>

      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.SETTING_LOCATION_DEVICE,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          isResponseHeader: true,   
        }}
      >
        <View style={styles.container}>
          {this.renderList()}
          {this.renderLocation()}
          {this.state.showSearch && this.renderSearch()}
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(20),
    height:scaleSize(80),
    // marginVertical: scaleSize(20),
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scaleSize(20),
    marginVertical: scaleSize(10),
  },
  searchText: {
    fontSize: scaleSize(26),
    marginHorizontal: scaleSize(20),
  },
  text: {
    fontSize: scaleSize(26),
  },
  image: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  seperator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  headerRightText: {
    fontSize: scaleSize(26),
  },
  textInput: {
    fontSize: scaleSize(20),
    marginLeft: scaleSize(200),
    height: scaleSize(60),
    width: scaleSize(150),
    borderWidth: 0.5,
    borderColor: color.bgG,
  },
})
export default LocationSetting
