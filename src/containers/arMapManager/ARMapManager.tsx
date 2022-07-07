import { ARLayer } from 'imobile_for_reactnative'
import React from 'react'
import { Container, ListSeparator, BackButton } from '../../components'
// import ARLayers from './Home/component/ARLayers'
import { getLanguage } from '../../language'
import { Image, Text, TouchableOpacity, FlatList, Platform, StyleSheet, ListRenderItemInfo, View } from 'react-native'
import { scaleSize, screen, Toast } from '../../utils'
import { getThemeAssets } from '../../assets'
import { size, color } from '../../styles'
import { UserInfo } from '../../redux/models/user'
import { ARMapInfo } from '../../redux/models/arlayer'
import { ARMapState } from '../../redux/models/armap'
import ARLayerItem from './ARMapItem'

const styles = StyleSheet.create({
  headerBtnTitle: {
    fontSize: size.fontSize.fontSizeSm,
    marginTop: scaleSize(8),
  },
  headerBtnImage: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  separator: {
    marginLeft: scaleSize(30),
  },
  headerLeft: {
    flexDirection: 'row',
  },
  headerBack: {
    marginLeft: scaleSize(20),
  },
  headerArrowDown: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  headerLeftTitle: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.black,
  },
})

interface Props {
  language: string,
  currentUser: UserInfo,
  arlayer: ARMapInfo,
  armap: ARMapState,
  navigation: any,
  orientation: string,

  setCurrentARLayer: (layer: ARLayer | undefined) => void,
  getARLayers: () => Promise<ARLayer[]>,
  createARMap: () => Promise<boolean>,
  saveARMap: (name?: string) => Promise<boolean>,
  closeARMap: () => Promise<boolean>,
}

interface State {
  menuVisible: boolean,
  selectLayer?: ARLayer,
}

export default class ARLayerManager extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      menuVisible: false,
    }
  }

  componentDidMount() {
    this._getLayer()
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.currentUser) !== JSON.stringify(nextProps.currentUser) ||
      JSON.stringify(this.props.arlayer) !== JSON.stringify(nextProps.arlayer) ||
      JSON.stringify(this.props.armap) !== JSON.stringify(nextProps.armap) ||
      JSON.stringify(this.props.orientation) !== JSON.stringify(nextProps.orientation) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  _getLayer = async () => {
    try {
      let layers = await this.props.getARLayers()
      Toast.show(JSON.stringify(layers))
    } catch (error) {
      Toast.show(error)
    }
  }

  /** 保存ar地图 */
  _onSave = () => {
    // if(!this.props.armap.currentMap) return
    // if(this.props.armap.currentMap.mapName !== '') {
    //   this.props.saveARMap()
    // } else {
    //   AppInputDialog.show({
    //     placeholder: '地图名称',
    //     checkSpell: CheckSpell.checkLayerCaption,
    //     confirm: (text: string) => {
    //       this.props.saveARMap(text)
    //     },
    //   })
    // }
  }

  _renderLayerItem = ({item}: ListRenderItemInfo<ARLayer>) => {
    return (
      <ARLayerItem
        layer={item}
        currentLayer={this.props.arlayer.currentLayer}
        onPress={layer => {
          this.props.setCurrentARLayer(layer)
        }}
        onPressMore={layer => {
          this.setState({
            menuVisible: true,
            selectLayer: layer,
          })
        }}
      />)
  }

  _renderSeperator = () => {
    return <ListSeparator color={color.bgW2} style={styles.separator} />
  }

  _renderLayers = () => {
    if(!this.props.arlayer.layers) return null
    return (
      <FlatList
        data={this.props.arlayer.layers}
        renderItem={this._renderLayerItem}
        keyExtractor={item => item.name}
        ItemSeparatorComponent={this._renderSeperator}
      />
    )
  }

  _renderHeaderLeft = () => {
    let mapName = getLanguage().ARMap.OPEN_MAP
    if(this.props.armap.currentMap) {
      if(this.props.armap.currentMap?.mapName) {
        mapName = this.props.armap.currentMap.mapName
      } else {
        mapName = getLanguage().ARMap.UNTITLED_MAP
      }
    }
    return (
      <View style={styles.headerLeft}>
        <BackButton
          // style={styles.headerBack}
          onPress={() => {
            this.props.navigation.goBack()
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={()=>{
            this.props.navigation.navigate('MyARMap', {
              // showMode: 'tap',
            })
          }}
        >
          <Text
            style={styles.headerLeftTitle}
            numberOfLines={1}
          >
            {mapName}
          </Text>
          <Image
            source={getThemeAssets().publicAssets.icon_drop_down}
            style={styles.headerArrowDown}
          />
        </TouchableOpacity>
      </View>
    )
  }

  _renderHeaderRightBtn = (item: {
    image: any,
    title: string,
    action: (params?: any) => void,
  }) => {
    return (
      <TouchableOpacity
        key={item.title}
        style={{
          marginHorizontal: scaleSize(20),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          item.action && item.action()
        }}
      >
        <Image
          source={item.image}
          style={styles.headerBtnImage}
        />
        <Text style={styles.headerBtnTitle}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  _renderHeaderRight = () => {
    return [
      this._renderHeaderRightBtn({
        image: getThemeAssets().publicAssets.icon_cancel,
        title: getLanguage().ARMap.CLOSE_MAP,
        action: this.props.closeARMap,
      }),
      this._renderHeaderRightBtn({
        image: getThemeAssets().layer.icon_add_layer,
        title: getLanguage().ARMap.ADD_LAYER,
        action: this.props.closeARMap,
      }),
      this._renderHeaderRightBtn({
        image: getThemeAssets().start.icon_save,
        title: getLanguage().ARMap.SAVE,
        action: this.props.closeARMap,
      }),
    ]
  }

  // renderMenu = () => {
  //   if(this.state.selectLayer) {
  //     return (
  //       <ARLayerMenu
  //         navigation={this.props.navigation}
  //         selectLayer={this.state.selectLayer}
  //         arMapInfo={this.props.arMapInfo}
  //         onClose={() => {
  //           this.setState({
  //             menuVisible: false
  //           })
  //         }}
  //       />
  //     )
  //   }
  // }


  render() {
    return(
      <Container
        headerProps={{
          navigation: this.props.navigation,
          withoutBack: true,
          headerLeft: this._renderHeaderLeft(),
          headerRight: this._renderHeaderRight(),
          headerStyle: {
            paddingTop: this.props.orientation.indexOf('LANDSCAPE') !== 0 && (
              screen.isIphoneX()
                ? screen.X_TOP
                : (Platform.OS === 'ios' ? 20 : 0)
            ),
          },
        }}
      >
        {this._renderLayers()}
        {/* <SlideCard visible={this.state.menuVisible}>
          {this.renderMenu()}
        </SlideCard> */}
      </Container>
    )
  }
}