import { Container } from '../../components'
import { getLanguage } from "@/language"
import { MainStackScreenNavigationProps } from "@/types/NavigationTypes"
import React, {Component} from "react"
import { Image, TouchableOpacity, View, Text, ActivityIndicator } from "react-native"
import styles from "./styles"
import { SLocation } from "imobile_for_reactnative"
import NavigationService from "../NavigationService"


const radio_on = require('../../assets/public/radio_select.png')
const radio_off = require('../../assets/public/radio_select_no.png')

interface Props{
  navigation: MainStackScreenNavigationProps<'ExternalDevices'>,
  // route: MainStackScreenRouteProp<'ExternalDevices'>,
  peripheralDevice: SLocation.LocationConnectionParam,
  setDevice: (param: SLocation.LocationConnectionParam) => void
}

interface State {
  devices: SLocation.LocationConnectionParam[],
  currentOption: SLocation.LocationConnectionParam,
  showSearch: boolean
  searchNotify: string
}

class ExternalDevices extends Component<Props, State> {

  prevOption: SLocation.LocationConnectionParam

  constructor(props: Props) {
    super(props)
    this.prevOption = this.props.peripheralDevice
    this.state = {
      devices: [
        // {type: 'external', name: 'null'},
        // {type: 'external', name: 'external01'},
        // {type: 'external', name: 'external02'},
        // {type: 'external', name: 'external03'},
      ],
      currentOption: this.prevOption,
      showSearch: true,
      searchNotify: getLanguage(global.language).Prompt.SEARCHING,
    }
  }

  componentDidMount() {
    this.addListener()
    SLocation.searchDevice(true)
    this.startShowSearching()
  }

  addListener() {
    SLocation.addDeviceListener(device => {
      const devices = JSON.parse(JSON.stringify(this.state.devices))
      const ownitem =  devices.filter((item: SLocation.LocationConnectionParam) => {
        return item.type === "external" && item.name === device
      })
      if(!ownitem) {
        devices.push(device)
        this.setState({ devices })
      }

      // const devices = this.state.devices.clone()
      // if (devices.indexOf(device) === -1) {
      //   devices.push(device)
      //   this.setState({ devices })
      // }
    })
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

  /** 修改临时设备 */
  changeDevice = () => {
    const currentOption = this.state.currentOption
    if(currentOption.type === 'external') {
      // 不能直接修改redux里的设备  to do
      this.props.setDevice(currentOption)
      // setSelectDevice(currentOption)
    }
    NavigationService.goBack()
  }

  /** 确认按钮 */
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
            {getLanguage(global.language).Profile.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** 分割线 */
  renderSeperator = () => {
    return <View style={styles.seperator} />
  }

  /** 列表项 */
  renderItem = (device: SLocation.LocationConnectionParam) => {
    if(device.type !== 'external') {
      return null
    }
    if(device.name === 'null'){
      return null
    }
    const title = device.name
    console.log(device)
    return (
      <View key={device.name}>
        <TouchableOpacity
          style={styles.itemView}
          activeOpacity={0.9}
          onPress={() => {
            this.setState({ currentOption: device })
          }}
        >
          <Text style={styles.text}>{title}</Text>
          <Image
            style={styles.image}
            source={JSON.stringify(this.state.currentOption) === JSON.stringify(device) || JSON.stringify(this.props.peripheralDevice) === JSON.stringify(device) ? radio_on : radio_off}
          />
        </TouchableOpacity>
        {this.renderSeperator()}
      </View>
    )
  }

  /** 渲染列表 */
  renderItems = () => {
    return this.state.devices.map(device => {
      return this.renderItem(device)
    })
  }

  /** 搜素 */
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
        // ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.SETTING_LOCATION_EXTERNAL,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          isResponseHeader: true,
        }}
      >
        <View style={styles.container}>
          {this.renderItems()}
          {/* 搜索 */}
          {this.state.showSearch && this.renderSearch()}
        </View>
      </Container>
    )
  }
}

export default ExternalDevices
