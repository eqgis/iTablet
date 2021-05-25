import { ARLayer, SARMap } from 'imobile_for_reactnative'
import React from 'react'
import { Container, ListSeparator, BackButton, InputDialog } from '../../components'
// import ARLayers from './Home/component/ARLayers'
import { getLanguage } from '../../language'
import { Image, Text, TouchableOpacity, FlatList, Platform, StyleSheet, ListRenderItemInfo, View } from 'react-native'
import { scaleSize, screen, Toast } from '../../utils'
import { getThemeAssets } from '../../assets'
import { size, color } from '../../styles'
import { UserInfo } from '../../redux/models/user'
import { ARMapInfo } from '../../redux/models/arlayer'
import { ARMapState } from '../../redux/models/armap'
import { DEVICE } from '../../redux/models/device'
import ARLayerItem from './ARLayerItem'
import ToolbarModule from '../workspace/components/ToolBar/modules/ToolbarModule'
import { arDrawingModule } from '../workspace/components/ToolBar/modules'
import ARMapSettingItem from '../arLayerManager/ARMapSettingItem'
import ToolBarSectionList from '../workspace/components/ToolBar/components/ToolBarSectionList'

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
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
})

interface Props {
  language: string,
  currentUser: UserInfo,
  arlayer: ARMapInfo,
  armap: ARMapState,
  navigation: any,
  device: DEVICE,

  setCurrentARLayer: (layer: ARLayer | undefined) => void,
  getARLayers: () => Promise<ARLayer[]>,
  createARMap: () => Promise<boolean>,
  saveARMap: (name?: string) => Promise<boolean>,
  closeARMap: () => Promise<boolean>,
}

interface State {
  menuVisible: boolean,
  selectLayer?: ARLayer,
  menuData: Array<any>,
}

export default class ARLayerManager extends React.Component<Props, State> {
  inputDialog: InputDialog | undefined | null

  constructor(props: Props) {
    super(props)

    this.state = {
      menuVisible: false,
      menuData: [{
        title: '',
        data: [{
          title: getLanguage(GLOBAL.language).Map_Layer.LAYERS_REMOVE,
          image: getThemeAssets().layer.icon_remove_layer,
          action: async () => {
            if (this.props.arlayer.currentLayer) {
              await SARMap.removeARLayer(this.props.arlayer.currentLayer.name)
              await this.props.getARLayers()
              this.setState({
                menuVisible: false,
              })
            }
          },
        }],
      }],
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
      JSON.stringify(this.props.device.orientation) !== JSON.stringify(nextProps.device.orientation) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  _getLayer = async () => {
    try {
      await this.props.getARLayers()
    } catch (error) {
      Toast.show(error)
    }
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
          this.props.setCurrentARLayer(layer)
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
              showMode: 'tap',
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
    if (!this.props.armap.currentMap?.mapName && !this.props.arlayer.layers?.length) return null
    return [
      this._renderHeaderRightBtn({
        image: getThemeAssets().publicAssets.icon_cancel,
        title: getLanguage().ARMap.CLOSE_MAP,
        action: async () => {
          await this.props.closeARMap()
          await this.props.getARLayers()
        },
      }),
      this._renderHeaderRightBtn({
        image: getThemeAssets().layer.icon_add_layer,
        title: getLanguage().ARMap.ADD_LAYER,
        action: () => {
          this.props.navigation.goBack()
          arDrawingModule().action()
          ToolbarModule.addData({
            addNewDsetWhenCreate: true,
          })
        },
      }),
      this._renderHeaderRightBtn({
        image: getThemeAssets().start.icon_save,
        title: getLanguage().ARMap.SAVE,
        action: () => {
          this.inputDialog && this.inputDialog.setDialogVisible(true)
        },
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

  _renderInputDialog = () => {
    return (
      <InputDialog
        ref={ref => (this.inputDialog = ref)}
        title={getLanguage(GLOBAL.language).Map_Main_Menu.START_SAVE_MAP}
        placeholder={getLanguage(GLOBAL.language).Profile.MAP_NAME}
        confirmAction={value => {
          this.props.saveARMap(value)
          this.inputDialog?.setDialogVisible(false)
        }}
        confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.SAVE_YES}
        cancelBtnTitle={getLanguage(GLOBAL.language).Prompt.CANCEL}
      />
    )
  }

  _renderListItem = ({ item }: any) => {
    return (
      <ARMapSettingItem
        data={item}
      />
    )
  }

  _renderList = () => {
    if (!this.state.menuVisible || this.state.menuData.length === 0) return
    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.setState({
              menuVisible: false,
            })
          }}
          style={styles.overlay}
        />
        <ToolBarSectionList
          sections={this.state.menuData}
          device={this.props.device}
          renderItem={this._renderListItem}
        />
      </>
    )
  }

  render() {
    return(
      <Container
        headerProps={{
          navigation: this.props.navigation,
          withoutBack: true,
          headerLeft: this._renderHeaderLeft(),
          headerRight: this._renderHeaderRight(),
          headerStyle: {
            paddingTop: this.props.device.orientation.indexOf('LANDSCAPE') !== 0 && (
              screen.isIphoneX()
                ? screen.X_TOP
                : (Platform.OS === 'ios' ? 20 : 0)
            ),
          },
        }}
      >
        {this._renderLayers()}
        {this._renderInputDialog()}
        {this._renderList()}
      </Container>
    )
  }
}