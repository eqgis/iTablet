import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  Platform,
} from 'react-native'
import { Container } from '../../../../../components'
import { getLanguage } from '../../../../../language'
import { Toast } from '../../../../../utils'
import { color } from '../../../../../styles'
import { SMap } from 'imobile_for_reactnative'
import styles from '../styles'
import { connect } from 'react-redux'
import { setPrivateLicenseServer } from '../../../../../redux/models/license'

class ConnectServer extends Component {
  props: {
    navigation: Object,
    privateLicenseServer: String,
    setPrivateLicenseServer: () => {},
  }

  constructor(props) {
    super(props)
    this.server = this.props.privateLicenseServer || ''
  }

  queryLicense = async () => {
    try {
      if (this.server === '') {
        Toast.show(getLanguage(global.language).Profile.ENTER_SERVER_ADDRESS)
        return
      }
      if (
        this.server.indexOf('ws://') !== 0 &&
        this.server.indexOf('http') !== 0
      ) {
        this.server = 'ws://' + this.server
      }
      this.container &&
        this.container.setLoading(
          true,
          getLanguage(global.language).Profile.LICENSE_QUERYING,
        )
      await SMap.setPrivateServer(this.server)
      let modules = await SMap.queryPrivateCloudLicense()
      this.container && this.container.setLoading(false)
      if (modules) {
        this.props.setPrivateLicenseServer(this.server)
        this.props.navigation.replace('LicenseJoinPrivateCloud', {
          modules: modules,
        })
      } else {
        Toast.show(getLanguage(global.language).Profile.LICENSE_QUERY_FAIL)
      }
    } catch (e) {
      this.container && this.container.setLoading(false)
      Toast.show(getLanguage(global.language).Profile.LICENSE_QUERY_FAIL)
    }
  }

  renderAddress = () => {
    return (
      <View style={styles.addressView}>
        <View style={styles.inputBackgroud}>
          <TextInput
            clearButtonMode={'while-editing'}
            keyboardType={'default'}
            placeholder={
              getLanguage(global.language).Profile.ENTER_SERVER_ADDRESS
            }
            placeholderTextColor={'#A7A7A7'}
            multiline={false}
            defaultValue={this.server || ''}
            style={styles.textInputStyle}
            onChangeText={text => {
              this.server = text
            }}
          />
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={'query'}
          style={styles.connectStyle}
          onPress={() => {
            Keyboard.dismiss()
            this.queryLicense()
          }}
        >
          <Text style={styles.titleText}>
            {getLanguage(global.language).Profile.LICENSE_QUERY}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile
            .LICENSE_PRIVATE_CLOUD_SERVER,
          navigation: this.props.navigation,
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: color.bgW }}
          behavior={Platform.OS === 'ios' && "padding"}
        >
          {this.renderAddress()}
        </KeyboardAvoidingView>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  privateLicenseServer: state.license.toJS().privateLicenseServer,
})

const mapDispatchToProps = {
  setPrivateLicenseServer,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectServer)
