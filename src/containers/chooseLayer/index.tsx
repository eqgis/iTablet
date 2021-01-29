import { DatasetType, SMap } from 'imobile_for_reactnative'
import React from 'react'
import { FlatList, Image, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { getLayerIconByType, getPublicAssets } from '../../assets'
import { dp } from '../../utils'
import Container from '../../components/Container'
import { setCurrentLayer } from '../../redux/models/layers'
import { getLanguage } from '../../language'

interface Props extends ReduxProps {
  navigation: any
}

interface State {

}

class ChooseLayer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }


  renderLayer = ({item}:  ListRenderItemInfo<SMap.LayerInfo>) => {
    if(item.themeType === 0 && (
      item.type === DatasetType.CAD ||
      item.type === DatasetType.POINT ||
      item.type === DatasetType.LINE ||
      item.type === DatasetType.REGION)
    ) {
      const isCurrent = this.props.currentLayer.name === item.name
      return (
        <TouchableOpacity
          style={styles.ListItemStyleNS}
          onPress={() => {
            this.props.setCurrentLayer(item)
          }}
        >
          <Image
            style={styles.Image_Style_Small}
            source={isCurrent ? getPublicAssets().common.icon_select : getPublicAssets().common.icon_radio_unselected}
          />
          <Image
            style={styles.Image_Style_Small}
            source={getLayerIconByType(item.type)}
          />
          <Text style={[styles.Text_Style_Center, {marginHorizontal: dp(5)}]}>
            {item.caption}
          </Text>
        </TouchableOpacity>
      )
    } else if(item.type === 'layerGroup') {
      return (
        <>
          <View
            style={styles.ListItemStyleNS}
          >
            <Image
              style={styles.Image_Style_Small}
              source={getPublicAssets().common.icon_slide_down}
            />
            <Image
              style={styles.Image_Style_Small}
              source={getLayerIconByType(item.type)}
            />
            <Text style={[styles.Text_Style_Center, {marginHorizontal: dp(5)}]}>
              {item.caption}
            </Text>
          </View>
          {item.child && (
            this.renderLayers(item.child)
          )}
        </>
      )
    }
    return null
  }

  renderLayers = (layers: SMap.LayerInfo[] | undefined) => {
    return (
      <FlatList
        style={{flex: 1}}
        data={layers}
        renderItem={this.renderLayer}
        keyExtractor={item => item.name}
      />
    )
  }


  render() {
    const layers = this.props.layers
    return(
      <Container
        headerProps={{
          title: getLanguage().Prompt.CHOOSE_LAYER,
          navigation: this.props.navigation,
        }}
      >
        {this.renderLayers(layers)}
      </Container>
    )
  }
}

const mapStateToProp = (state: any/** state: RootState */) => ({
  layers: state.layers.toJS().layers,
  currentLayer:  state.layers.toJS().currentLayer,
})

const mapDispatch = {
  setCurrentLayer,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(ChooseLayer)

const styles = StyleSheet.create({
  ListItemStyleNS: {
    height: dp(47),
    marginLeft: dp(20),
    paddingRight: dp(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  Image_Style_Small: {
    width: dp(20),
    height: dp(20),
  },
  Text_Style_Center: {
    fontSize: dp(14),
    color: 'black',
    textAlign: 'center',
  },
})