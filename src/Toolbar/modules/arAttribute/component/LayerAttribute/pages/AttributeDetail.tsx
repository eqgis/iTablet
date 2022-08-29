import { Input } from '@/components'
import * as React from 'react'
import { Text, View, FlatList, ListRenderItemInfo, StyleSheet, Modal, Platform, TouchableOpacity, Image } from 'react-native'
import { getImage } from '../../../../../../assets'
import { AppStyle, dp } from '../../../../../../utils'
import { Color } from '../../../../../../utils/AppStyle'

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  containerP: {
    borderTopLeftRadius: dp(20),
    borderTopRightRadius: dp(20),
    paddingTop: dp(20),
  },
  itemView: {
    flexDirection: 'column',
  },
  subItemView: {
    flexDirection: 'row',
    height: dp(40),
    alignItems: 'center',
    paddingHorizontal: dp(20),
  },
  subItemLeftView: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: dp(20),
  },
  subItemRightView: {
    flex: 2,
    alignItems: 'center',
  },
  header: {
    height: dp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...AppStyle.h1,
  },
  titleText: {
    width: '100%',
    fontSize: dp(18),
    color: AppStyle.Color.BLACK,
    textAlign: 'left',
  },
  valueText: {
    width: '100%',
    fontSize: dp(14),
    color: AppStyle.Color.Text_Tool,
    textAlign: 'right',
  },
  inputStyle: {
    width: '100%',
    fontSize: dp(14),
    color: AppStyle.Color.Text_Tool,
    textAlign: 'right',
  },
})

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
  device: any, //todo
  confirm: (modelID: number, data: SandTableData) => void,
  close?: () => void,
  visible?: boolean,
  modelID?: number,
  data?:SandTableData | null,
}

interface State {
  detailData: Array<DataType>,
  visible: boolean,
}

export default class AttributeDetail extends React.Component<Props, State> {

  modelID: number
  data: SandTableData

  constructor(props: Props) {
    super(props)
    this.state = {
      detailData: [],
      visible: false,
    }
    this.modelID = -1
    this.data = {
      SandTable: {
        Model: [],
      },
    }
  }

  componentDidMount = () => {
    if(this.props.visible && this.props.data) {
      this.setVisible(this.props.visible, this.props.modelID, this.props.data)
    }
  }

  setVisible = (visible: boolean, modelID?: number, params?: SandTableData) => {
    if (modelID !== undefined && params) {
      this.modelID = modelID
      this.data = JSON.parse(JSON.stringify(params))
      const _data = this.data.SandTable.Model
      if (
        JSON.stringify(_data) !== JSON.stringify(this.state.detailData) ||
        visible !== this.state.visible
      ) {
        this.setState({
          detailData: _data,
          visible: visible,
        })
      }
    } else if (!params) {
      if (visible !== this.state.visible) {
        this.setState({
          visible: visible,
        })
      }
    }
  }

  close = () => {
    this.setState({
      visible: false,
    })
    this.props.close && this.props.close()
  }

  confirm = () => {
    this.setState({
      visible: false,
    })
    this.props.confirm(this.modelID, this.data)
  }

  _onRequestClose = () => {
    if (Platform.OS === 'android') {
      this.close()
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

  renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>模型数据</Text>
      </View>
    )
  }

  render() {
    return (
      <Modal
        animationType={'none'}
        transparent={true}
        onRequestClose={this._onRequestClose}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        statusBarTranslucent={true}
        // presentationStyle={'fullScreen'}
        style={{ flex: 1 }}
        visible={this.state.visible}
      >
        <View style={[
          styles.container,
          this.props.device.orientation.indexOf('LANDSCAPE') < 0 && styles.containerP,
          {backgroundColor: 'transparent', overflow: 'hidden', flex: 1},
          // this.props.contentStyle,
        ]}>
          <TouchableOpacity style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right:0, backgroundColor: AppStyle.Color.OVERLAY }} onPress={this._onRequestClose} />
          <View style={{ flex: 1, backgroundColor: '#rgba(0,0,0,0)' }} pointerEvents='none' />
          <View
            style={[
              styles.container,
              this.props.device.orientation.indexOf('LANDSCAPE') < 0 && styles.containerP,
              {
                height:
                  this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                    ? '100%'
                    : '80%',
                width:
                  this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                    ? '40%'
                    : '100%',
                right: 0,
                left:
                  this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                    ? '60%'
                    : 0,
                overflow: 'hidden'
              },
            ]}
          >
            {this.renderHeader()}
            <FlatList
              data={this.state.detailData}
              renderItem={this.renderItem}
              keyExtractor={item => item.ModelPath}
              ItemSeparatorComponent={this.renderSeperator}
            />
          </View>
          {this.renderBottom()}
        </View>
      </Modal>
    )
  }
}