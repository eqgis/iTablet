import React from 'react'
import { FlatList, Image, ListRenderItemInfo, ScaledSize, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AppStyle, AppToolBar, dp } from '../../../../utils'
import { SARMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import { ToolbarSlideCard } from 'imobile_for_reactnative/components/ToolbarKit'
import { getImage } from '../../../../assets'

interface Props {
  visible: boolean
  windowSize: ScaledSize
}

interface State {
  modelList: string[],
  visibleList: number[],
}

class SandTableModelList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      modelList: [],
      visibleList: [],
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.visible !== this.props.visible) {
      this.getData()
    }
  }

  getData = async () => {
    if(this.props.visible) {
      const list = await SARMap.getSandTableModelList()
      const visibleList = await SARMap.getSandTableVisibleModelIndexList()
      this.setState({
        modelList: list,
        visibleList
      })
    }
  }

  renderItem = ({item, index}: ListRenderItemInfo<string>) => {
    const isVisible = this.state.visibleList.indexOf(index) > -1
    const visibleIcon = isVisible ? getImage().icon_visible : getImage().icon_invisible

    const i = item.lastIndexOf('/')
    if(i > -1) {
      item = item.substring(i + 1)
    }
    const j = item.lastIndexOf('.')
    if(j > -1) {
      item = item.substring(0, j)
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: dp(40),
          paddingHorizontal: dp(10),
        }}
      >
        <TouchableOpacity
          onPress={() => {
            SARMap.setSandTableModelVisible(index, !isVisible).then(result => {
              if(result) {
                SARMap.getSandTableVisibleModelIndexList().then(list => {
                  this.setState({visibleList: list})
                })
              }
            })
          }}
          style={{
            height: dp(40),
            justifyContent: 'center',
          }}
        >
          <Image
            source={visibleIcon}
            style={AppStyle.Image_Style}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if(!isVisible) return
            SARMap.appointARSandTableModel(index).then(element => {
              const selectElement = AppToolBar.getData().selectARElement
              AppToolBar.addData({selectedChildIndex: index})
              if(!selectElement && element) {
                AppToolBar.addData({selectARElement: element})
              }
              AppToolBar.insert('ARSANDTABLE', 'AR_SAND_TABLE_EDIT', -1)
              AppToolBar.goBack()
            })
          }}
          style={{
            flex: 1,
            marginHorizontal: dp(10),
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Text style={AppStyle.h2} numberOfLines={1}>
            {item}
          </Text>
        </TouchableOpacity>
      </View>

    )
  }

  render() {
    const isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <ToolbarSlideCard
        visible={this.props.visible}
        contentContainerStyle={[isPortrait && {
          height: this.props.windowSize.height * 0.5,
        }, styles.bottomContainer]}
      >
        <Text
          style={[AppStyle.h2,{paddingHorizontal: dp(10), paddingBottom: dp(5)}]}
        >
          {getLanguage().MODEL_LIST}
        </Text>
        <FlatList
          data={this.state.modelList}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item + '_' + index}
        />
      </ToolbarSlideCard>
    )
  }
}

export default SandTableModelList

const styles = StyleSheet.create({
  bottomContainer: {
    paddingTop: dp(20),
  },
})
