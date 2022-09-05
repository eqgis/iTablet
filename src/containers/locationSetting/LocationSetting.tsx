import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator ,Switch,TextInput} from 'react-native'
import { SLocation } from 'imobile_for_reactnative'
import Container from '../../components/Container'
import { scaleSize ,Toast} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import color from '../../styles/color'
import { getImage } from '@/assets'
import { getSelectDevice } from './deviceUtil'

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
  selectDevicesType: string
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
      selectDevicesType: this.prevOption.type,
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

    // 当选择此设备时，需要修改redux里的设置，其他类型的在他们自己的页面已经设置过了，直接用就好
    let currentOption
    if(this.state.selectDevicesType === 'local') {
      currentOption = this.state.currentOption
      this.props.setDevice(currentOption)
    } else {
      currentOption = getSelectDevice()
    }

    console.warn("save device: " + JSON.stringify(currentOption))
    // const currentOption = this.state.currentOption
    this.props.setDevice(currentOption)
    SLocation.changeLocationDevice(currentOption)
    NavigationService.goBack()
  }

  // startShowSearching = async () => {
  //   await new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve(true)
  //     }, 10000)
  //   })
  //   if(this.state.devices.length === 1) {
  //     this.setState({ searchNotify: getLanguage(global.language).Prompt.SEARCHING_DEVICE_NOT_FOUND})
  //   } else if(this.state.devices.length > 1) {
  //     this.setState({ showSearch: false})
  //   }
  // }

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
    this.setState({
      selectDevicesType: 'local',
      currentOption: {
        type: 'local',
      },
    })
  }

  selectExternalDevice = () => {
    this.setState({
      selectDevicesType: 'external',
    })
    NavigationService.navigate("ExternalDevices")
  }

  selectBluetoothDevice = () => {
    this.setState({
      selectDevicesType: 'bluetooth',
    })
    NavigationService.navigate("BluetoothDevices")
  }

  gotoNtripSettingPage = () => {
    NavigationService.navigate("NtripSetting")
  }

  // renderItem = (device: SLocation.LocationConnectionParam) => {
  //   const title = getLanguage(global.language).Profile.SETTING_LOCATION_LOCAL
  //   console.log(device)
  //   return (
  //     <View key={device.type}>
  //       <TouchableOpacity
  //         style={styles.itemView}
  //         activeOpacity={0.9}
  //         onPress={() => {
  //           this.setState({ currentOption: device })
  //         }}
  //       >
  //         <Text style={styles.text}>{title}</Text>
  //         <Image
  //           style={styles.image}
  //           source={this.state.currentOption === device ? radio_on : radio_off}
  //         />
  //       </TouchableOpacity>
  //       {this.renderSeperator()}
  //     </View>
  //   )
  // }

  // renderItems = () => {
  //   return this.state.devices.map(device => {
  //     return this.renderItem(device)
  //   })
  // }

  renderList = () => {
    return (
      <View style={{ flexDirection: 'column' }}>
        {/* {this.renderItems()} */}
        {this.renderDevicesSelectItem('local', getLanguage(global.language).Profile.SETTING_LOCATION_LOCAL, this.selectLocalDevice)}
        {this.renderDevicesSelectItem('external', getLanguage(global.language).Profile.SETTING_LOCATION_EXTERNAL, this.selectExternalDevice)}
        {this.renderDevicesSelectItem('bluetooth', getLanguage(global.language).Profile.SETTING_LOCATION_BLUETOOTH, this.selectBluetoothDevice)}
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

  // renderSearch() {
  //   return (
  //     <View style={styles.searchItem}>
  //       {this.state.searchNotify === getLanguage(global.language).Prompt.SEARCHING && (<ActivityIndicator size="small" color="#505050" />)}
  //       <Text style={styles.searchText}>
  //         {this.state.searchNotify}
  //       </Text>

  //     </View>
  //   )
  // }

  renderDevicesSelectItem = (type: SLocation.DevicesType, title: string, action?: () => void) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemView}
          activeOpacity={0.9}
          onPress={() => {
            // this.setState({ currentOption: device })
            if(action){
              action()
            } else {
              this.setState({
                selectDevicesType: type,
              })
            }
          }}
        >
          <View
            style={[styles.itemViewLeft]}
          >
            <Image
              style={styles.ImageSize50}
              source={this.state.selectDevicesType === type ? radio_on : radio_off}
            />
            <Text style={styles.text}>{title}</Text>

          </View>


          {type !== 'local' && (
            <Image
              style={styles.ImageSize35}
              source={getImage().arrow}
            />
          )}
        </TouchableOpacity>
        {this.renderSeperator()}
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
        }}
      >
        <View style={styles.container}>
          {this.renderList()}
          {this.renderLocation()}
          {this.renderOtherSetting()}
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
})
export default LocationSetting
