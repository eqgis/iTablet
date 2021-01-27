import React, { Component } from 'react'
import { FlatList, View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native'
import { Container, ListSeparator } from '../../../../../components'
import { ChunkType } from '../../../../../constants'
// import TouchableItemView from '../TouchableItemView'
import { getLanguage } from '../../../../../language'
import { connect } from 'react-redux'
import { setCurrentMapModule } from '../../../../../redux/models/mapModules'
import { scaleSize } from '../../../../../utils'
import { size, color } from '../../../../../styles'

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(114),
  },
  itemImage: {
    marginLeft: scaleSize(44),
    height: scaleSize(64),
    width: scaleSize(64),
  },
  itemText: {
    marginLeft: scaleSize(48),
    fontSize: size.fontSize.fontSizeXXl,
    color: color.contentColorGray,
  },
  separator: {
    height: scaleSize(2),
    marginLeft: scaleSize(150),
    backgroundColor: color.separateColorGray3,
  },
})

interface Props {
  language: string,
  navigation: any,
  mapModules: any,
  setCurrentMapModule: () => any,
}

interface State {
  modules: Array<any>,
}

class SelectModulePage extends Component<Props, State> {

  callBack: (data: {module: any, index: number}) => void

  constructor(props: Props) {
    super(props)
    this.callBack = this.props.navigation.getParam('callBack')
    let _modules = this.props.mapModules.modules
      .filter((item: any) => {
        return item.key === ChunkType.MAP_EDIT ||
        item.key === ChunkType.MAP_COLLECTION
      })
      .map((item: any) => {
        return item.getChunk(this.props.language)
      })
    this.state = {
      modules: _modules,
    }
  }

  _onPress = (module: any, index: number) => {
    if (this.callBack) {
      this.callBack({module, index})
    }
  }

  _renderItem = ({item, index}: {item: any, index: number}) => {
    if (
      item.title === getLanguage(GLOBAL.language).Map_Module.MAP_3D
    ) {
      return null
    }
    return (
      <View>
        <TouchableOpacity
          style={styles.item}
          onPress={() => this._onPress(item, index)}
        >
          <Image
            resizeMode={'contain'}
            source={item.moduleImage}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>{item.getTitle()}</Text>
        </TouchableOpacity>
        <ListSeparator style={styles.separator} />
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(GLOBAL.language).Friends.SELECT_MODULE,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          data={this.state.modules}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state: any) => ({
  language: state.setting.toJS().language,
  mapModules: state.mapModules.toJS(),
})
const mapDispatchToProps = {
  setCurrentMapModule,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectModulePage)
