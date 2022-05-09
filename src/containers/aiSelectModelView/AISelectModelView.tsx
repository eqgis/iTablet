import { SARMap, RNFS } from 'imobile_for_reactnative'
import React from 'react'

import { connect, ConnectedProps } from 'react-redux'
import { Image, ScrollView, Text, View, Platform } from 'react-native'
import { getThemeAssets } from '../../assets'
import { Button, Container } from '../../components'
import { FileTools } from '../../native'
import { getLanguage } from '../../language'
import { dp } from '../../utils'
import { color } from '../../styles'
import { ILocalData } from '../tabs/Mine/DataHandler/DataLocal'
import { setAIClassifyModel, setAIDetectModel } from '../../redux/models/setting'
import { Users } from '../../redux/models/user'
import DataHandler from '../tabs/Mine/DataHandler'

interface Props extends ReduxProps {
  navigation: any,
  user: Users,
  aiDetectData: any,
  aiClassifyData: any,

  setAIDetectModel: (model?: ILocalData) => void,
  setAIClassifyModel: (model?: ILocalData) => void,
}

interface State {
  data: ILocalData[]
}

class AISelectModelView extends React.Component<Props, State> {
  modelType: 'detect' | 'classify'
  container: typeof Container
  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
    }
    this.modelType = this.props.route.params?.modelType === 'detect' || !this.props.route.params?.modelType ? 'detect' : 'classify'
  }

  componentDidMount() {
    try {
      this.getModel()
    } catch (error) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(error)
    }
  }

  getModel = async () => {
    try {
      const data = await DataHandler.getLocalData(this.props.user.currentUser, 'AIMODEL')
      this.setState({data})
    } catch (error) {
      this.setState({data: []})
    }
  }

  onSelectModel = async (model: ILocalData) => {
    try {
      const selectedData = this.modelType === 'detect'
        ? this.props.aiDetectData
        : this.props.aiClassifyData
      if(model.aiModelInfo &&
        (selectedData?.path !== model.path)
      ) {
        this.container?.setLoading(true, getLanguage().Prompt.CHANGING)
        if(model.aiModelInfo) {
          const homePath = await FileTools.getHomeDirectory()
          const modelPath = homePath + model.path + '/' + model.aiModelInfo.modelName

          //获取对应语言文件
          const labelDefault = model.aiModelInfo.labels.filter(item => (
            item.indexOf('_cn.txt') === -1
            && item.indexOf('_jp.txt') === -1
          ))
          let labelPath: string
          if(labelDefault.length > 0) {
            labelPath = homePath + model.path + '/' + labelDefault[0]
          } else {
            labelPath = homePath + model.path + '/' + model.aiModelInfo.labels[0]
          }

          if(global.language === 'CN') {
            const name = model.aiModelInfo.labels.find(item => item.toLowerCase().indexOf('_cn.txt') > -1)
            name && (labelPath = homePath + model.path + '/' + name)
          } else if(global.language === 'JP') {
            const name = model.aiModelInfo.labels.find(item => item.toLowerCase().indexOf('_jp.txt') > -1)
            name && (labelPath = homePath + model.path + '/' + name)
          }

          //读取额外配置信息
          let param
          if(Platform.OS === 'android' && model.aiModelInfo.paramJsonName) {
            const paramPath =  homePath + model.path + '/' + model.aiModelInfo.paramJsonName
            const file = await RNFS.readFile(paramPath)
            param = JSON.parse(file)
          }

          if(this.modelType === 'detect') {
            await SARMap.setAIDetectModel({
              modelPath: modelPath,
              labelPath: labelPath,
              param: param,
            })
          } else if(this.modelType === 'classify') {
            await SARMap.setAIClassifyModel({
              modelPath: modelPath,
              labelPath: labelPath,
              param: param,
            })
          }
        }
        if(this.modelType === 'detect') {
          this.props.setAIDetectModel(model)
        } else {
          this.props.setAIClassifyModel(model)
        }
        this.container?.setLoading(false)
      }
    } catch(error) {
      this.container?.setLoading(false)
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(error)
    }
  }

  onSelectDefaultModel = async () => {
    try {
      if(this.modelType === 'detect') {
        if(this.props.aiDetectData !== undefined) {
          this.container?.setLoading(true, getLanguage().Prompt.CHANGING)
          this.props.setAIDetectModel(undefined)
          await SARMap.setAIDetectDefaultModel(global.language)
          this.container?.setLoading(false)
        }
      } else {
        if(this.props.aiClassifyData !== undefined) {
          this.container?.setLoading(true, getLanguage().Prompt.CHANGING)
          this.props.setAIClassifyModel(undefined)
          await SARMap.setAIClassifyDefaultModel(global.language)
          this.container?.setLoading(false)
        }
      }
    } catch (error) {
      this.container?.setLoading(false)
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(error)
    }
  }

  _renderItems = () => {
    const selectedData = this.modelType === 'detect'
      ? this.props.aiDetectData
      : this.props.aiClassifyData
    return this.state.data.map((item, index) => {
      return (
        <ModelItem
          key={index + ''}
          isSelected={selectedData?.path === item.path}
          name={item.name}
          onPress={() => this.onSelectModel(item)}
        />
      )
    })
  }

  render() {
    const isSelected = this.modelType === 'detect'
      ? this.props.aiDetectData?.path === undefined
      : this.props.aiClassifyData?.path === undefined
    return(
      <Container
        ref={(ref: typeof Container) => (this.container = ref)}
        headerProps={{
          title: getLanguage().Common.SELECT_MODEL,
          navigation: this.props.navigation,
        }}
        headerStyle={{marginBottom: dp(10)}}
      >
        <ScrollView>
          <ModelItem
            isSelected={isSelected}
            name={getLanguage().Common.DEFAULT}
            onPress={this.onSelectDefaultModel}
          />
          {this._renderItems()}
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProp = (state: any) => ({
  user: state.user.toJS(),
  aiDetectData: state.setting.toJS().aiDetectData,
  aiClassifyData: state.setting.toJS().aiClassifyData,
})

const mapDispatch = {
  setAIDetectModel,
  setAIClassifyModel,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(AISelectModelView)

interface ItemProps {
  isSelected: boolean,
  name: string,
  onPress: () => void,
}

class ModelItem extends React.Component<ItemProps> {
  constructor(props: ItemProps) {
    super(props)
  }


  render() {
    return (
      <View
        style={{
          height: dp(101),
          marginHorizontal: dp(13),
          marginVertical: dp(4),
          backgroundColor: color.white,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: dp(8),
          paddingLeft: dp(22),
          paddingRight: dp(32),
        }}
      >
        <Image
          source={getThemeAssets().ar.img_default_pic}
          style={{
            width: dp(75),
            height: dp(75),
          }}
        />
        <Text numberOfLines={2} style={{flex: 1, fontSize: dp(15), marginLeft: dp(18), marginRight: dp(10)}}>
          {this.props.name}
        </Text>
        <Button
          onPress={this.props.onPress}
          style={{
            width: dp(75),
            height: dp(34),
            backgroundColor: this.props.isSelected ? color.selected_blue : color.bgG3,
          }}
          titleStyle={{color: this.props.isSelected ? color.white : color.black}}
          title={this.props.isSelected ? getLanguage().Common.CURRENT : getLanguage().Common.SELECTED}
        />
      </View>
    )
  }

}

