import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { getPublicAssets } from '../../assets'
import { Container } from '../../components'
// import { RootState } from '../../redux/types'
import { scaleSize } from '../../utils'
import { color, size } from '../../styles'
import { getLanguage } from '../../language'
import { setDatumPoint , arPoiSearch } from '../../redux/models/setting'
import { MapToolbar } from '../workspace/components'
import NavigationService from '../NavigationService'

type Props = ReduxProps

interface State {
  poiSearch?: boolean
}
class ARMapSetting extends React.Component<Props,State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      poiSearch: this.props.navigation?.state?.params?.poiSearch
    }
  }

  renderCommonSettings = () => {
    return (
      <View style={styles.settingView}>
        <TouchableOpacity style={styles.settingItem}
          onPress={() => {
            NavigationService.navigate('MapStack', {screen: 'MapView', params: param})
            this.props.setDatumPoint(true)
            if(this.state.poiSearch){
              this.props.arPoiSearch(true)
            }
          }}
        >
          <Text style={styles.itemText}>
            {getLanguage(global.language).Profile.MAR_AR_POSITION_CORRECT}
          </Text>
          <Image
            style={styles.itemImage}
            source={getPublicAssets().common.icon_move}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        type={global.Type}
        initIndex={2}
        mapModules={this.props.mapModules}
        ARView={true}
      />
    )
  }

  render() {
    return(
      <Container
        style={styles.conatiner}
        headerProps={{
          withoutBack: !this.state.poiSearch,
          title: getLanguage(global.language).Map_Label.SETTING,
          navigation: this.props.navigation,
          headerTitleViewStyle: {
            textAlign: 'left',
            marginLeft: scaleSize(80),
          },
        }}
        bottomBar={!this.state.poiSearch && this.renderToolBar()}
      >
        {this.renderCommonSettings()}
      </Container>
    )
  }
}

const mapStateToProp = (state: any) => ({
  mapModules: state.mapModules.toJS(),
})

const mapDispatch = {
  setDatumPoint,
  arPoiSearch,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(ARMapSetting)

const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: color.bgG3,
  },
  settingView: {
    backgroundColor: color.white,
    marginTop: scaleSize(20),
    marginHorizontal: scaleSize(20),
    borderRadius: scaleSize(10),
  },
  settingItem: {
    height: scaleSize(80),
    marginLeft: scaleSize(20),
    paddingRight: scaleSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: color.WHITE,
  },
  itemText: {
    flex: 1,
    fontSize: size.fontSize.fontSizeMd,
    color: color.BLACK,
  },
  itemImage: {
    width: scaleSize(36),
    height: scaleSize(36),
  },
})