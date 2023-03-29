import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator ,Switch,TextInput, Platform} from 'react-native'
import { SLocation } from 'imobile_for_reactnative'
import Container from '../../components/Container'
import { dp, scaleSize ,Toast} from '../../utils'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import color from '../../styles/color'
import { getImage } from '@/assets'
// import { LocationConnectionParam } from '../BluetoothDevices/BluetoothDevices'
import { TSNonNullExpression } from '@babel/types'
import { Picker } from '@react-native-picker/picker'
import { PositionAccuracyType } from 'imobile_for_reactnative/NativeModule/interfaces/SLocation'
import { BluetoothDeviceInfoType, DeviceManufacturer, DeviceType } from '@/redux/models/location'

const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

interface Props {
  navigation: any
  peripheralDevice: SLocation.LocationConnectionParam
  setDevice: (param: SLocation.LocationConnectionParam) => void
  positionAccuracy: PositionAccuracyType
  setPositionAccuracy: (type: PositionAccuracyType) => void
  deviceManufacturer: DeviceManufacturer
  setDeviceManufacturer: (manufacturer: DeviceManufacturer) => void
  deviceType: DeviceType,
	setDeviceType: (devicetype: DeviceType) => void
  isOpenBlutooth: boolean,
  setDeviceConnectionMode: (isBluetoothMode: boolean) => void,
  bluetoohDevice: BluetoothDeviceInfoType,
  setBluetoothDeviceInfo: (bluetoothInfo: BluetoothDeviceInfoType) => void,
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
  positionAccuracy: PositionAccuracyType
}

interface positionAccuracyItemType {
  label: string
  value: PositionAccuracyType
}

interface RowType {
  title: string,
  value?: string,
  action?: () => void,
}


class LocationSetting extends React.Component<Props, State> {
  prevOption: SLocation.LocationConnectionParam

  positionAccuracyArray: Array<positionAccuracyItemType> = [
    {label: getLanguage().METER_LEVEL, value:1},
    {label: getLanguage().SUBMETER_LEVEL, value:5},
    {label: getLanguage().CENTIMETER_LEVEL, value:4},
  ]

  positionAccuracyName = {
    1: getLanguage().METER_LEVEL,
    4: getLanguage().CENTIMETER_LEVEL,
    5: getLanguage().SUBMETER_LEVEL,
  }

  manufactureName = {
    'other': getLanguage().LOCAL_DEVICE,
    'mijiaH20': getLanguage().HUACHE,
    'woncan': getLanguage().QIANXUN,
    'situoli': getLanguage().SITUOLI,
  }


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
      positionAccuracy: this.props.positionAccuracy || 5,
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

    // 当当前选择的精度与之前的精度不同时，才去设置
    // if(this.state.positionAccuracy !== this.props.positionAccuracy) {
    //   SLocation.setPositionAccuracy(this.state.positionAccuracy)
    //   this.props.setPositionAccuracy(this.state.positionAccuracy)
    // }





    // 直接将redux里的值拿给原生, 选择好的设备先放在了redux里，所以保存的时候直接修改原生的设备就好了
    let tempDevice: SLocation.LocationConnectionParam | null = null


    const brand = this.props.deviceManufacturer
    let gnssTppe: 'gps' | 'rtk' = 'gps'
    switch(this.props.deviceType) {
      case "GPS" :
        gnssTppe = 'gps'
        break
      case "RTK" :
        gnssTppe = 'rtk'
        break
    }


    // 蓝牙打开和选择了准备连接的蓝牙设备
    if(this.props.isOpenBlutooth && this.props.bluetoohDevice && this.props.deviceManufacturer !== 'other') {
      tempDevice = {
        type: 'bluetooth',
        mac: this.props.bluetoohDevice.address,
        gnssTppe: gnssTppe,
        brand: brand,
      }
    } else {
      tempDevice = {
        type: 'local',
      }
    }

    // if(this.props.peripheralDevice.type === 'bluetooth') {
    //   tempDevice = {
    //     type: 'bluetooth',
    //     mac: this.props.peripheralDevice.mac,
    //     gnssTppe: this.props.peripheralDevice.gnssTppe,
    //     brand: this.props.peripheralDevice.brand,
    //   }
    // } else {
    //   tempDevice = this.props.peripheralDevice
    // }
    tempDevice && SLocation.changeLocationDevice(tempDevice).then(() => {
      if(tempDevice) {
        // 设置成功了，将redux里的数据也更新一下
        this.props.setDevice(tempDevice)
        let toastText = getLanguage().CHANGE_DEVICE_LOCAL
        switch (tempDevice.type) {
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
      }

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

  /** 去修改设备厂家页面 */
  gotoLocationDevice = () => {
    NavigationService.navigate("LocationDevice")
  }

  /** 去修改设备类型页面 */
  gotoChangeDeviceTypePage = () => {
    NavigationService.navigate("LocationDeviceType")
  }

  /** 去连接模式的页面 */
  gotoDeviceConnectionMode = async () => {
    NavigationService.navigate("LocationDeviceConnectionMode")
  }

  /** 去往精度选择页面 */
  gotoLocationAccuracy = () => {
    NavigationService.navigate("LocationAccuracy")
  }

  back = () => {
    // 恢复之前的设备
    this.props.setDevice(this.prevOption)
    // 返回上一个页面
    this.props.navigation.goBack()
  }

  renderList01 = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly',paddingVertical: dp(20) }}>
        {/* {this.renderItems()} */}
        {this.renderDevicesSelectItem('local', getLanguage(global.language).Profile.SETTING_LOCATION_LOCAL, this.selectLocalDevice)}
        {this.renderDevicesSelectItem('external', getLanguage(global.language).Profile.SETTING_LOCATION_EXTERNAL, this.selectExternalDevice)}
        {Platform.OS === "android" && this.renderDevicesSelectItem('bluetooth', getLanguage(global.language).Profile.SETTING_LOCATION_BLUETOOTH, this.selectBluetoothDevice)}
      </View>
    )
  }

  renderRowItem = (param: RowType) => {
    return (
      <TouchableOpacity
        style={styles.itemView}
        onPress={param.action}
      >
        <Text style={styles.text}>{param.title}</Text>
        {param.value && (
          <View
            style={[{
              flex: 1,
              height: '100%',
              justifyContent:'center',
              alignItems:'flex-end',
              marginRight: dp(20),
            }]}
          >
            <Text style={styles.titleText}>{param.value}</Text>
          </View>
        )}

        <Image
          source={getImage().arrow}
          style={[{
            width: dp(15),
            height: dp(15),
            // marginRight: dp(10),
          }]}
        />
      </TouchableOpacity>
    )
  }

  renderList = () => {
    return (
      <View style={{ flexDirection: 'column' }}>
        {this.renderRowItem({
          title:getLanguage(global.language).Profile.SETTING_LOCATION_DEVICE,
          value: this.manufactureName[this.props.deviceManufacturer],
          action: this.gotoLocationDevice,
        })}
        {this.renderItemSeperator()}
        {this.renderRowItem({
          title:getLanguage(global.language).Profile.DEVICE_TYPE,
          value: this.props.deviceType,
          action: this.gotoChangeDeviceTypePage,
        })}
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
            style={styles.switch}
            trackColor={{ false: '#F0F0F0', true:  "#2D2D2D" }}
            thumbColor={this.state.distanceLocation ? "#fff" : "#fff"}
            ios_backgroundColor={this.state.distanceLocation ?"#2D2D2D" : '#F0F0F0'}
            value={this.state.distanceLocation}
            onValueChange={value => {
              this.setState({ distanceLocation: value ,timeLocation:false})
            }}
          />
        </View>
        {this.renderItemSeperator()}
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
            style={styles.switch}
            trackColor={{ false: '#F0F0F0', true: "#2D2D2D" }}
            thumbColor={this.state.timeLocation ? "#fff" : "#fff"}
            ios_backgroundColor={this.state.timeLocation ? "#2D2D2D" : '#F0F0F0'}
            value={this.state.timeLocation}
            onValueChange={value => {
              this.setState({ timeLocation: value ,distanceLocation:false})
            }}
          />
        </View>
        {/* {this.renderItemSeperator()} */}
      </View>
    )
  }

  renderOtherSetting = () => {
    return(
      <View style={{ flexDirection: 'column' }}>


        {/* 连接模式 */}
        {this.renderRowItem({
          title:getLanguage(global.language).Profile.CONNECTION_MODE,
          value: this.props.isOpenBlutooth ? getLanguage(global.language).Profile.SETTING_LOCATION_BLUETOOTH : undefined,
          action: this.gotoDeviceConnectionMode,
        })}
        {this.renderItemSeperator()}

        {/* 精度选择 */}
        {this.renderRowItem({
          title:getLanguage(global.language).Profile.POSITION_ACCURACY,
          value: this.positionAccuracyName[this.props.positionAccuracy],
          action: this.gotoLocationAccuracy,
        })}
        {this.renderItemSeperator()}

        {/* 差分服务 */}
        {this.renderRowItem({
          title:getLanguage(global.language).Profile.NTRIP_SETTING,
          action: this.gotoNtripSettingPage,
        })}


        {/* <TouchableOpacity
          style={styles.itemView}
          onPress={this.gotoNtripSettingPage}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.NTRIP_SETTING}</Text>
        </TouchableOpacity>
        {this.renderItemSeperator()} */}

        {/* <View
          style={[styles.itemView]}
        >
          <Text style={styles.text}>{getLanguage(global.language).Profile.POSITION_ACCURACY}</Text>
          <Picker
            selectedValue={this.state.positionAccuracy}
            mode={'dropdown'}
            style={[styles.pickerSize]}
            onValueChange={value => {
              // setValue(value)
              // value !== null && props.onValueChange(value)
              this.setState({positionAccuracy: value})
            } }
          >
            {this.positionAccuracyArray.map((item, index) => {
              return <Picker.Item label={item.label} value={item.value} key={item.label + index} />
            })}

          </Picker>
        </View>
        {this.renderItemSeperator()} */}
      </View>
    )
  }

  /** 分割线 */
  renderSeperator = () => {
    return  <View style={styles.seperator} />
  }

  renderItemSeperator = () => {
    return (
      <View style={[styles.itemSeperator]}>
        <View style={[styles.itemSeperatorLine]}></View>
      </View>
    )
  }

  renderRight = () => {
    let textColor
    // if (this.state.currentOption === this.prevOption) {
    // textColor = '#A0A0A0'
    // } else {
    textColor = 'black'
    // }
    return (
      <View style={[{
        marginRight: scaleSize(30),
      }]}>
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
          title: getLanguage(global.language).Profile.LOCATION_SETTING,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          isResponseHeader: true,
          backAction: this.back,
        }}
      >
        <View style={styles.container}>
          {/* {this.renderList01()} */}
          {this.renderList()}
          {this.renderSeperator()}
          {this.props.deviceManufacturer !== 'other' && this.renderOtherSetting()}
          {this.renderSeperator()}
          {this.renderLocation()}
          {this.renderSeperator()}

          {this.renderRowItem({
            title:getLanguage(global.language).Profile.LOCATION_INFORMATION,
            // value: this.props.deviceType,
            action: () => {
              NavigationService.navigate('LocationInformation')
            },
          })}
          {this.renderSeperator()}
          {/* {this.props.peripheralDevice.type === 'bluetooth' && this.renderOtherSetting()} */}
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
    marginHorizontal: scaleSize(30),
    marginLeft: scaleSize(60),
    height:scaleSize(80),
    // marginVertical: scaleSize(20),
    // backgroundColor: '#f00',
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
  titleText: {
    fontSize: scaleSize(26),
  },
  text: {
    fontSize: scaleSize(28),
    color: '#333',
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
    height: dp(5),
    backgroundColor: '#f9f9f9',
    // marginTop: dp(10),
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
  },
  pickerView:{
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: dp(10),
  },
  pickerSize: {
    width: dp(140),
    height: dp(30),
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dp(10),
    paddingLeft: dp(40),
    height:dp(50),
  },
  itemSeperator: {
    width: '100%',
    height: dp(1),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemSeperatorLine: {
    // width: '90%',
    // width:'100%',
    flex:1,
    height: dp(1),
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: scaleSize(60),
    marginRight: scaleSize(30),
  },
  switch: {
    marginRight: dp(-10),
  },
})
export default LocationSetting
