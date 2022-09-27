import { getImage, getThemeAssets } from '@/assets'
import { Container, PopMenu } from '@/components'
import { PopMenuItem } from '@/components/PopMenu/PopMenu'
import SlideCard from '@/components/SlideCard'
import { getLanguage } from '@/language'
import { RootState } from '@/redux/types'
import AnimationSetting from '@/Toolbar/modules/arAnimation/component/AnimationSetting/AnimationSetting'
import { AppInputDialog, AppLog, AppStyle, AppToolBar, CheckSpell, dp } from '@/utils'
import { SARMap } from 'imobile_for_reactnative'
import { ARAnimatorType, ARNodeAnimatorType } from 'imobile_for_reactnative/NativeModule/dataTypes'
import { ARAnimatorParameter, ARModelAnimatorParameter, ARNodeAnimatorParameter, ModelAnimation } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import React from 'react'
import { createRef } from 'react'
import { Platform, View } from 'react-native'
import { Text, FlatList, Image, ListRenderItemInfo, TouchableOpacity} from 'react-native'
import { connect, ConnectedProps } from 'react-redux'


// type Props = ReduxProps

interface Props extends ReduxProps {
  navigation: Object
}

interface State {
 animations: IARAnimation[]
 settingVisible: boolean
 selectAnimation?: number
}

interface IARAnimation {
  id: number,
  name: string,
  type: 'rotation' | 'translation' | 'model'
}

class ARAnimationPage extends React.Component<Props, State> {
  popMenu = createRef<PopMenu>()

  selectItem: IARAnimation | undefined = undefined

  selectAnimator: ARAnimatorParameter & {id: number} | undefined = undefined

  /** 编辑模型动画时读取列表 */
  modelAnimations?: ModelAnimation[] = undefined

  constructor(props: Props) {
    super(props)

    this.state = {
      animations: [],
      settingVisible: false,
    }
  }

  componentDidMount() {
    this.getAnimations()
  }

  getAnimations = async () => {
    let aniamtons: IARAnimation[]
    if(Platform.OS === 'ios') {
      aniamtons = await SARMap.getAnimationList()
    } else {
      const results = await SARMap.getAnimations()
      aniamtons = results.filter(item => {
        const selectElement = AppToolBar.getData().selectARElement //todo
        if(selectElement && item.type === ARAnimatorType.MODEL_TYPE) {
          return item.layerName === selectElement.layerName && item.elementID === selectElement.id
        }
        return true
      }).map(item => {
        let type: IARAnimation['type'] = 'model'
        if(item.type === ARAnimatorType.NODE_TYPE) {
          if(item.nodeType === ARNodeAnimatorType.TRANSLATION) {
            type = 'translation'
          } else {
            type = 'rotation'
          }
        }
        return {
          id: item.id,
          name: item.name,
          type: type,
        }
      })
    }

    this.setState({
      animations: aniamtons,
    })
  }

  editAnimation = async () => {
    const selectItem = this.selectItem
    const selectElement = AppToolBar.getData().selectARElement
    if(!selectItem || !selectElement) {
      AppLog.error('未选中对象')
      return
    }

    if(selectItem.type === 'model') {
      if(this.modelAnimations === undefined) {
        this.modelAnimations = await SARMap.getModelAnimation(selectElement.layerName, selectElement.id)
      }
    }

    const animators = await SARMap.getAnimations()
    const editAnimator = animators.find(item => item.id === selectItem.id)

    if(!editAnimator) {
      AppLog.error('未找到数据')
    } else {
      this.selectAnimator = editAnimator
    }

    this.setState({settingVisible: true})
  }

  saveEditAnimation = async (param: ARModelAnimatorParameter | ARNodeAnimatorParameter) => {
    if(!this.selectItem) {
      AppLog.error('未选中对象')
      return
    }
    await SARMap.editAnimation(this.selectItem.id, param)
    this.getAnimations()
    this.setState({settingVisible: false})
    AppToolBar.resetPage()
  }

  _getImage = (type: IARAnimation['type']) => {
    switch(type) {
      case 'model':
        return getImage().ar_scale
      case 'translation':
        return getImage().ar_translation
      case 'rotation':
        return getImage().ar_rotate
    }
  }

  showRenameDialog = () => {
    AppInputDialog.show({
      placeholder: getLanguage().Common.INPUT_NAME,
      confirm: name => {
        this.rename(name)
      },
      checkSpell: CheckSpell.checkLayerCaption
    })
  }

  rename = async (name: string) => {
    if(this.selectItem) {
      await SARMap.renameAnimation(this.selectItem.id, name)
      this.getAnimations()
      AppToolBar.resetTabData()
    }
  }

  deleteAnimation = async () => {
    if(this.selectItem) {
      await SARMap.removeAnimation(this.selectItem.id)
      SARMap.refresh()
      this.getAnimations()
      AppToolBar.resetTabData()
    }
  }

  getMenuData = (): PopMenuItem[] => {
    const data: PopMenuItem[] = [
      {
        title: getLanguage().Common.RENAME,
        action: this.showRenameDialog,
      },
      {
        title: getLanguage().EDIT,
        action: this.editAnimation,
      },
      {
        title: getLanguage().Common.DELETE,
        action: this.deleteAnimation,
      },
    ]

    if(Platform.OS === 'ios') {
      data.splice(1, 1)
    } else {
      data.shift()
    }

    return data
  }

  showMapMenu = (x: number, y: number) => {
    this.popMenu.current?.setVisible(true, {x, y})
  }


  renderAnimation = ({item}: ListRenderItemInfo<IARAnimation>) => {
    return (
      <>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            height: dp(50),
            alignItems: 'center',
            backgroundColor: AppStyle.Color.Background_Page,
            paddingHorizontal: dp(20),
          }}
          onPress={e => {
            this.selectItem = item
            this.showMapMenu(e.nativeEvent.pageX, e.nativeEvent.pageY)
          }}
        >
          <Image
            source={this._getImage(item.type)}
            style={AppStyle.Image_Style}
          />
          <Text style={{...AppStyle.h2, flex: 1, marginLeft: dp(20)}}>{item.name}</Text>
          <Image
            source={getThemeAssets().publicAssets.icon_move}
            style={AppStyle.Image_Style}
          />
        </TouchableOpacity>
        <View style={{...AppStyle.SeperatorStyle, marginLeft: dp(20)}}/>
      </>
    )
  }



  render() {
    return(
      <Container
        // title={getLanguage().ANIMATION_MANAGEMENT}
        headerProps={{
          title: getLanguage().ANIMATION_MANAGEMENT,
          navigation: this.props.navigation,
        }}
        style={{
          backgroundColor: AppStyle.Color.Background_Page
        }}
      >
        <FlatList
          data={this.state.animations}
          renderItem={this.renderAnimation}
          keyExtractor={item => item.id.toString()}
        />
        <PopMenu
          ref={this.popMenu}
          data={[]}
          getData={this.getMenuData}
          hasCancel={false}
          device={this.props.device}
        />
        <SlideCard
          visible={this.state.settingVisible}
          onClose={() => {
            this.setState({settingVisible: false})
          }}
        >
          <View style={{backgroundColor: AppStyle.Color.Background_Container}}>
            <AnimationSetting
              onSave={this.saveEditAnimation}
              onCancel={() => {this.setState({settingVisible: false})}}
              animationType={'setting'}
              modelAnimationList={this.modelAnimations || []}
              editAnimator={this.selectAnimator}
              windowSize={this.props.windowSize}
              filters={this.selectItem?.type === 'model' ? [1] : [2, 3]}
            />
          </View>
        </SlideCard>
      </Container>
    )
  }
}


const mapStateToProp = (state: RootState) => ({
  windowSize: state.device.toJS().windowSize,
  device: state.device.toJS().device
})

const mapDispatch = {

}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(ARAnimationPage)

