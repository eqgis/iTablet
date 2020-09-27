import React from 'react'
import { FlatList, Text, View, Image, Switch } from 'react-native'
import { Container } from '../../../components'
import { scaleSize } from '../../../utils'
import { color } from '../../../styles'
import { getLanguage } from '../../../language'
import { getThemeAssets } from '../../../assets'
import { connect } from 'react-redux'
import { toggleFindItem } from '../../../redux/models/setting'

class FindSettingPage extends React.Component {
  props: {
    navigation: Object,
    find: Object,
    toggleFindItem: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.getData(),
    }
  }

  getData = () => [
    {
      key: getLanguage(global.language).Prompt.PUBLIC_MAP,
      value: 'showPublicMap',
      image: getThemeAssets().find.public_map,
    },
    {
      key: getLanguage(global.language).Find.PUBLIC_DATA,
      value: 'showPublicData',
      image: getThemeAssets().find.public_data,
    },
    {
      key: getLanguage(global.language).Prompt.SUPERMAP_GROUP,
      value: 'showSuperMapGroup',
      image: getThemeAssets().find.supermap,
    },
    {
      key: getLanguage(global.language).Prompt.SUPERMAP_KNOW,
      value: 'showSuperMapKnow',
      image: getThemeAssets().find.supermapkonw,
    },
    {
      key: getLanguage(global.language).Prompt.SUPERMAP_FORUM,
      value: 'showSuperMapForum',
      image: getThemeAssets().find.forum,
    },
    {
      key: getLanguage(global.language).Find.GIS_ACADEMY,
      value: 'showGisAcademy',
      image: getThemeAssets().find.college,
    },
    {
      key: getLanguage(global.language).Find.ONLINE_COWORK,
      value: 'showCowork',
      image: getThemeAssets().find.onlineCowork,
    },
    {
      key: getLanguage(global.language).Find.LABORATORY,
      value: 'showLab',
      image: getThemeAssets().find.laboratory,
    },
  ]

  renderItem = ({ index, item }) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: scaleSize(10),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: scaleSize(80),
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={item.image}
              style={{
                width: scaleSize(50),
                height: scaleSize(50),
                marginHorizontal: scaleSize(10),
              }}
            />
            <Text style={{ fontSize: scaleSize(26) }}>{item.key}</Text>
          </View>
          <Switch
            trackColor={{ false: color.bgG, true: color.switch }}
            thumbColor={this.props.find[item.value] ? color.bgW : color.bgW}
            ios_backgroundColor={
              this.props.find[item.value] ? color.switch : color.bgG
            }
            value={this.props.find[item.value]}
            onValueChange={value => {
              let data = Object.assign({}, this.props.find)
              data[item.value] = value
              this.props.toggleFindItem(data)
            }}
          />
        </View>
        {this.state.data.length !== index + 1 && (
          <View
            style={{
              height: scaleSize(1),
              backgroundColor: color.itemColorGray2,
            }}
          />
        )}
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Map_Label.SETTING,
          navigation: this.props.navigation,
        }}
      >
        <View>
          <View
            style={{
              justifyContent: 'flex-end',
              height: scaleSize(80),
              padding: scaleSize(15),
            }}
          >
            <Text style={{ fontSize: scaleSize(24) }}>
              {getLanguage(global.language).Find.TOGGLE_FIND_ITEM}
            </Text>
          </View>
          <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.props.find}
          />
        </View>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  find: state.setting.toJS().find,
})

const mapDispatchToProps = {
  toggleFindItem,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FindSettingPage)
