import { getImage } from '@/assets'
import { Input } from '@/components'
import { getLanguage } from '@/language'
import { MainStackScreenNavigationProps, MainStackScreenRouteProp } from '@/types'
import { AppStyle, AppToolBar } from '@/utils'
import { Color } from '@/utils/AppStyle'
import { ARAction, SARMap } from 'imobile_for_reactnative'
import { dp } from 'imobile_for_reactnative/utils/size'
import * as React from 'react'
import { Text, View, FlatList, ListRenderItemInfo, TouchableOpacity, Image } from 'react-native'
import { Container } from '../../components'
import styles from "./style"

interface Point3D {
  X: number,
  Y: number,
  Z: number,
}

interface DataType {
  ModelPath: string,
  Position: Point3D,
  Rotation: Point3D,
  Scale: Point3D,
  ModelInfo: string,
}

export interface SandTableData {
  SandTable: {
    Model: Array<DataType>
  },
}

interface Props {
  navigation: MainStackScreenNavigationProps<'AttributeDetail'>,
  route: MainStackScreenRouteProp<'AttributeDetail'>
  device: any, //todo
}

interface State {
  detailData: Array<DataType>,
}

export default class AttributeDetail extends React.Component<Props, State> {

  modelID: number
  data: SandTableData

  constructor(props: Props) {
    super(props)
    this.state = {
      detailData: [],
    }
    this.modelID = -1
    this.data = {
      SandTable: {
        Model: [],
      },
    }
  }

  componentDidMount = () => {
    const data = this.props.route.params?.data
    const modelID = this.props.route.params?.modelID
    if(data) {
      this.setVisible(modelID, data)
    }
  }

  setVisible = (modelID?: number, params?: SandTableData) => {
    if (modelID !== undefined && params) {
      this.modelID = modelID
      this.data = JSON.parse(JSON.stringify(params))
      const _data = this.data.SandTable.Model
      if (JSON.stringify(_data) !== JSON.stringify(this.state.detailData)) {
        this.setState({
          detailData: _data,
        })
      }
    }
  }

  close = () => {
    this.props.navigation.goBack()
  }

  confirm = () => {
    this.modifyModelInfo(this.modelID, this.data)
    this.props.navigation.goBack()
  }

  modifyModelInfo = (modelID: number, data: SandTableData) => {
    try {
      const selectARElement = AppToolBar.getData().selectARElement
      if(selectARElement) {
        SARMap.setARSandTableData(selectARElement.layerName, modelID, JSON.stringify(data))
      }

      SARMap.setAction(ARAction.SELECT)
    } catch (error) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(error)
    }
  }

  onChangeText = (index: number, text: string) => {
    this.data.SandTable.Model[index].ModelInfo = text
  }

  renderSubItem = (title: string, index: number, value: string, isInput?: boolean) => {
    return (
      <View style={styles.subItemView} key={title + index}>
        <View style={styles.subItemLeftView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        {
          isInput
            ? (
              <Input
                defaultValue={value}
                style={styles.subItemRightView}
                inputStyle={styles.inputStyle}
                onChangeText={text => {
                  this.onChangeText(index, text)
                }}
              />
            )
            : (
              <View style={styles.subItemRightView}>
                <Text style={styles.valueText}>{value}</Text>
              </View>
            )
        }
      </View>
    )
  }

  renderSubItemSeperator = (key: string) => (
    <View
      key={key}
      style={{
        flex: 1,
        height: dp(1),
        backgroundColor: Color.Seperator,
        marginHorizontal: dp(20),
      }}
    />
  )

  renderItem = ({item, index}: ListRenderItemInfo<DataType>) => {
    return (
      <View style={styles.itemView} key={item.ModelPath}>
        {this.renderSubItem('名称', index, item.ModelPath)}
        {this.renderSubItemSeperator(item.ModelPath + 1)}
        {this.renderSubItem('位置', index, `${item.Position.X.toFixed(6)},${item.Position.Y.toFixed(6)},${item.Position.Z.toFixed(6)}`)}
        {this.renderSubItemSeperator(item.ModelPath + 2)}
        {this.renderSubItem('旋转', index, `${item.Rotation.X.toFixed(6)},${item.Rotation.Y.toFixed(6)},${item.Rotation.Z.toFixed(6)}`)}
        {this.renderSubItemSeperator(item.ModelPath + 3)}
        {this.renderSubItem('比例', index, `${item.Scale.X.toFixed(6)},${item.Scale.Y.toFixed(6)},${item.Scale.Z.toFixed(6)}`)}
        {this.renderSubItemSeperator(item.ModelPath + 4)}
        {this.renderSubItem('标签', index, item.ModelInfo, true)}
      </View>
    )
  }

  renderBottom = () => {
    return (
      <View
        style={{
          height: dp(60),
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: dp(37),
          backgroundColor: AppStyle.Color.WHITE,
        }}
      >
        <TouchableOpacity
          onPress={this.close}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={getImage().icon_toolbar_quit}
            style={{width: dp(22), height:dp(22)}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.confirm}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={getImage().icon_submit}
            style={{width: dp(22), height:dp(22)}}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderSeperator = () => {
    return (
      <View style={{...AppStyle.SeperatorStyle, height: dp(4)}}/>
    )
  }

  render() {
    return (
      <Container
        // ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage().MODEL_DATA,
          withoutBack: true,
          navigation: this.props.navigation,
          // isResponseHeader: true,
        }}
      >
        <View style={[
          styles.container,
          {backgroundColor: 'transparent', overflow: 'hidden', flex: 1},
        ]}>
          <FlatList
            data={this.state.detailData}
            renderItem={this.renderItem}
            keyExtractor={item => item.ModelPath}
            ItemSeparatorComponent={this.renderSeperator}
          />
          {this.renderBottom()}
        </View>
      </Container>
    )
  }

}