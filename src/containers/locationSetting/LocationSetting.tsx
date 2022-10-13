import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator ,Switch,TextInput, Platform} from 'react-native'
import { SLocation } from 'imobile_for_reactnative'
import Container from '../../components/Container'
import { dp, scaleSize ,Toast} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import color from '../../styles/color'
import { getImage } from '@/assets'

const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

interface Props {
  navigation: any
  peripheralDevice: SLocation.LocationConnectionParam
  setDevice: (param: SLocation.LocationConnectionParam) => void
}

interface State {
  devices: SLocation.LocationConnectionParam[]
  currentOption: SLocation.LocationConnectionParam
  // showSearch: boolean
  // searchNotify: string
  distanceLocation: boolean
  timeLocation: boolean
  distanceLocationText: string
  timeLocationText: string
  // selectDevicesType: string
}

class LocationSetting extends React.Component<Props, State> {
  prevOption: SLocation.LocationConnectionParam

  constructor(props:Props) {
    super(props)
    this.prevOption = this.props.peripheralDevice
    this.state = {
      devices: [{type: 'local'}],
      currentOption: this.prevOption,
      // showSearch: true,
      // searchNotify: getLanguage(global.language).Prompt.SEARCHING,
      distanceLocation: false,
      timeLocation:false,
      distanceLocationText: "",
      timeLocationText: "",
      // selectDevicesType: this.prevOption.type,
    }
  }

  componentDidMount() {
    // this.addListener()
    // SLocation.searchDevice(true)
    // this.startShowSearching()
    this.getLocationType()
   
  }

  componentWillUnmount() {
    SLocation.searchDevice(false)
    SLocation.removeDeviceListener()
  }

  // addListener() {
  //   SLocation.addDeviceListener(device => {
  //     const devices = this.state.devices.clone()
  //     if (devices.indexOf(device) === -1) {
  //       devices.push(device)
  //       this.setState({ devices })
  //     }
  //   })
  // }

  changeDevice = () => {
    if(this.state.distanceLocation){
      SLocation.setDistanceLocation(true)
      SLocation.setTimeLocation(false)
      if(this.state.distanceLocationText === ""){
        SLocation.setLocationDistance(0+"")
      }else{
        if(isNaN(Number(this.state.distanceLocationText))){
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
        if(isNaN(Number(this.state.timeLocationText))){
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

    // 直接将redux里的值拿给原生, 选择好的设备先放在了redux里，所以保存的时候直接修改原生的设备就好了
    SLocation.changeLocationDevice(this.props.peripheralDevice).then(() => {
      let toastText = getLanguage().CHANGE_DEVICE_LOCAL
      switch (this.props.peripheralDevice.type) {
        case "local":
          toastText = getLanguage().CHANGE_DEVICE_LOCAL
          break
        case "external" :
          toastText = getLanguage().CHANGE_DEVICE_EXTERNAL
          break
        case "bluetooth" :
          toastText = getLanguage().CHANGE_DEVICE_BLUETOOTH
          break
      }
      Toast.show(toastText)
    })
    NavigationService.goBack()
  }

  getLocationType = async () => {
    if (await SLocation.getTimeLocation()) {
      const time = await SLocation.getLocationTime()
      this.setState({ timeLocation: true , timeLocationText:""+time})
    }
    if (await SLocation.getDistanceLocation()) {
      const distance = await SLocation.getLocationDistance()
      this.setState({ distanceLocation: true , distanceLocationText: ""+distance})
    }
  }

  selectLocalDevice = () => {
    // 与其他类型的设备同步，先更改redux里的设备，在保存的时候再去修改原生的设备
    this.props.setDevice({type: 'local',})
    this.setState({
      // selectDevicesType: 'local',
      currentOption: {
        type: 'local',
      },
    })
  }

  selectExternalDevice = () => {
    NavigationService.navigate("ExternalDevices")
  }

  selectBluetoothDevice = () => {
    NavigationService.navigate("BluetoothDevices")
  }

  gotoNtripSettingPage = () => {
    NavigationService.navigate("NtripSetting")
  }

  back = () => {
    // 恢复之前的设备
    this.props.setDevice(this.prevOption)
    // 返回上一个页面
    this.props.navigation.goBack()
  }

  renderList = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly',paddingVertical: dp(20) }}>
        {/* {this.renderItems()} */}
        {this.renderDevicesSelectItem('local', getLanguage(global.language).Profile.SETTING_LOCATION_LOCAL, this.selectLocalDevice)}
        {this.renderDevicesSelectItem('external', getLanguage(global.language).Profile.SETTING_LOCATION_EXTERNAL, this.selectExternalDevice)}
        {Platform.OS === "android" && this.renderDevicesSelectItem('bluetooth', getLanguage(global.language).Profile.SETTING_LOCATION_BLUETOOTH, this.selectBluetoothDevice)}
      </View>
    )
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

  renderOtherSetting = () => {
    return(
      <View style={{ flexDirection: 'column' }}>
        <TouchableOpacity
          style={styles.itemView}
          onPress={this.gotoNtripSettingPage}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.NTRIP_SETTING}</Text>
        </TouchableOpacity>
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

  renderDevicesSelectItem = (type: SLocation.DevicesType, title: string, action?: () => void) => {
    let imageSource = getImage().icon_devices_local
    switch(type){
      case 'local':
        imageSource = getImage().icon_devices_local
        break
      case 'external':
        imageSource = getImage().icon_devices_external
        break
      case 'bluetooth':
        imageSource = getImage().icon_devices_bluetooth
        break
    }
    return (
      <View>
        <TouchableOpacity
          style={[styles.devicesItemView,
            this.props.peripheralDevice.type === type && styles.devicesItemViewSelecter]}
          activeOpacity={0.9}
          onPress={() => {
            action && action()
          }}
        >
          <View
            style={[styles.devicesItenContent]}
          >
            <Image
              style={styles.ImageSize80}
              source={imageSource}
            />

            <Text style={styles.devicesText}>{title}</Text>

          </View>

          <Image
            style={[styles.ImageSize50, styles.devicesSelecter]}
            source={this.props.peripheralDevice.type === type ? radio_on : radio_off}
          />

        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.SETTING_LOCATION_DEVICE,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          isResponseHeader: true,
          backAction: this.back,
        }}
      >
        <View style={styles.container}>
          {this.renderList()}
          {this.renderLocation()}
          {this.props.peripheralDevice.type === 'bluetooth' && this.renderOtherSetting()}
          {/* {this.state.showSearch && this.renderSearch()} */}
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
  itemViewLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
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
  ImageSize50: {
    height: scaleSize(50),
    width: scaleSize(50),
  },
  ImageSize35: {
    height: scaleSize(35),
    width: scaleSize(35),
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

  devicesItemView: {
    width: dp(116),
    height: dp(100),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: dp(20),
    borderWidth: dp(1),
    borderColor: '#f8f8f8'
  },
  devicesItemViewSelecter: {
    // borderColor: '#007aff',
    borderColor: '#ccc',
  },
  devicesItenContent: {
    width: dp(80),
    height: dp(80),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ImageSize80: {
    width: dp(55),
    height: dp(55),
  },
  devicesSelecter: {
    position: 'absolute',
    top: dp(3),
    right: dp(3),
  },
  devicesText: {
    fontSize: scaleSize(24),
  }
})
export default LocationSetting
