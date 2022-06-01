import { SARMap } from "imobile_for_reactnative"
import { ModuleList } from ".."
import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { IToolbarOption, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar } from "../../../utils"


export function getData(key: ModuleList['ARMAP_SETTING']): IToolbarOption {
  const option = new ToolbarOption()

  switch(key) {
    case 'AR_MAP_SETTING_VIEW_BOUNDS':
      settingViewBounds(option)
      break
    case 'AR_MAP_SETTING_ANIMATION':
      settingAnimation(option)
      break
    case 'AR_MAP_SECONDS_TO_PLAY':
      settingSecondsToPlay(option)
      break
  }


  return option
}


/** 点击可见距离的页面数据构造及功能的实现 */
function settingViewBounds(option: IToolbarOption) {
  let minVisible = AppToolBar.getData().minVisibleBounds || 0
  let maxVisible = AppToolBar.getData().maxVisibleBounds || 0
  let isMaxVisibleChange = false
  let isMinVisibleChange = false
  let keepVisible = minVisible === 0 && maxVisible === 0

  // 底部工具栏 可见距离的滑动条的数据
  option.slideData = {
    data: [{
      type: 'double',
      bottomLeft: {type: 'text', text: getLanguage().VISIBLE_DISTANCE},
      defaultMaxValue: maxVisible,
      defaultMinValue: minVisible,
      range: [0, 100],
      disableText: getLanguage().KEEP_VISIBLE,
      disabled: keepVisible,
      onMove: (loc, isMin) => {
        if(isMin) {
          isMinVisibleChange = true
          minVisible = loc
        } else {
          isMaxVisibleChange = true
          maxVisible = loc
        }
      },
      onDisable: isDisabled => {
        keepVisible = isDisabled
      }
    }]
  }


  // 底部工具栏 可见距离的两个按钮选项的数据
  option.bottomData=[
    {
      image: getImage().back,
      onPress: AppToolBar.goBack,
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        const layer = AppToolBar.getData().selectARLayer
        if(layer) {
          const results: Promise<boolean>[] = []
          if(keepVisible) {
            results.push(SARMap.setLayerMaxVisibleBounds(layer.name, 0))
            results.push(SARMap.setLayerMinVisibleBounds(layer.name, 0))
          } else {
            if(isMaxVisibleChange) {
              results.push(SARMap.setLayerMaxVisibleBounds(layer.name, maxVisible))
            }
            if(isMinVisibleChange) {
              results.push(SARMap.setLayerMinVisibleBounds(layer.name, minVisible))
            }
          }
          if(results.length > 0) {
            Promise.all(results).then(AppToolBar.getProps().getARLayers)
          }
        }
        AppToolBar.goBack()
      }
    }
  ]
}



/** 点击特效图层的持续时间及功能的实现 */
function settingSecondsToPlay(option: IToolbarOption){
  // 拿到当前的特效持续时间
  let secondsToPlay = AppToolBar.getData().secondsToPlay || 0
  // 特效持续时间是否改变标识
  let isSecondsChange = false
  // 是否一直播放标识
  let keepPlay = secondsToPlay === 0

  // 底部工具栏 持续时间的滑动条的数据
  option.slideData = {
    data: [{
      type: 'single',
      left: {type: 'text', text: getLanguage().SECONDS_TO_PLAY},
      defaultValue: secondsToPlay,
      range: [0, 100],
      disableText: getLanguage().KEEP_VISIBLE,
      disabled: keepPlay,
      onMove: (loc, isMin) => {
        if(isMin){
          isSecondsChange = true
          secondsToPlay = loc
        } else {
          isSecondsChange = true
          secondsToPlay = loc
        }
      },
      onDisable: isDisabled => {
        keepPlay = isDisabled
      }
    }]
  }

  // 底部工具栏 持续时间的两个按钮选项的数据
  option.bottomData=[
    {
      image: getImage().back,
      onPress: AppToolBar.goBack,
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        const layer = AppToolBar.getData().selectARLayer
        if(layer) {
          const results: Promise<boolean>[] = []
          if(keepPlay) {
            // 当持续时间为永久时，将持续时间的值设为0
            results.push(SARMap.setEffectLayerSecondsToPlay(layer.name, 0))
          } else if(isSecondsChange) {
            // 当持续时间为某一具体的数值时，就设置为哪个值
            results.push(SARMap.setEffectLayerSecondsToPlay(layer.name, secondsToPlay))
          }
          if(results.length > 0) {
            Promise.all(results).then(AppToolBar.getProps().getARLayers)
          }
        }
        AppToolBar.goBack()
      }
    }
  ]


}

function settingAnimation(option: IToolbarOption) {
  const layer = AppToolBar.getData().selectARLayer

  let repeatCount:number
  if(layer && 'animationRepeatCount' in layer) {
    repeatCount = layer.animationRepeatCount
  } else {
    repeatCount = -1
  }

  let isInfinitRepeat = repeatCount === -1
  let isRepeatCountChange = false

  let minAnimation = AppToolBar.getData().minAnimationBounds || 0
  let maxAnimation = AppToolBar.getData().maxAnimationBounds || 0
  let isMaxAnimationChange = false
  let isMinAnimationChange = false
  let keepAnimation = minAnimation === 0 && maxAnimation === 0

  option.menuData.data = [{
    type: 'slide',
    title: getLanguage().ANIMATION_BOUNDS,
    slideData: [{
      type: 'double',
      left: {type: 'indicator', unit: getLanguage().METER},
      right: {type: 'indicator', unit: getLanguage().METER},
      bottomLeft: {type: 'text', text: getLanguage().ANIMATION_BOUNDS},
      defaultMaxValue: maxAnimation,
      defaultMinValue: minAnimation,
      range: [0, 100],
      disabled: keepAnimation,
      disableText: getLanguage().KEEP_VISIBLE,
      onMove:  (loc, isMin) => {
        if(isMin) {
          isMinAnimationChange = true
          minAnimation = loc
        } else {
          isMaxAnimationChange = true
          maxAnimation = loc
        }
      },
      onDisable: isDisabled => {
        keepAnimation = isDisabled
      }
    }]
  },{
    type: 'slide',
    title: getLanguage().REPEAT_COUNT,
    slideData:[{
      type: 'single',
      defaultValue: repeatCount > -1 ? repeatCount : 0,
      range: [0, 100],
      disabled: isInfinitRepeat,
      disableText: getLanguage().KEEP_REPEATE,
      onMove: loc => {
        isRepeatCountChange = true
        repeatCount =loc
      },
      onDisable: isDisabled => {
        isInfinitRepeat = isDisabled
        if(!isDisabled && repeatCount === -1) {
          isRepeatCountChange = true
          repeatCount = 0
        }
      }
    }]
  }]

  option.bottomData=[
    {
      image: getImage().back,
      onPress: AppToolBar.goBack,
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        const layer = AppToolBar.getData().selectARLayer
        if(layer) {
          const results: Promise<boolean>[] = []
          if(keepAnimation) {
            results.push(SARMap.setLayerMaxAnimationBounds(layer.name, 0))
            results.push(SARMap.setLayerMinAnimationBounds(layer.name, 0))
          } else {
            if(isMaxAnimationChange) {
              results.push(SARMap.setLayerMaxAnimationBounds(layer.name, maxAnimation))
            }
            if(isMinAnimationChange) {
              results.push(SARMap.setLayerMinAnimationBounds(layer.name, minAnimation))
            }
          }
          if(isInfinitRepeat) {
            results.push(SARMap.setLayerAnimationRepeatCount(layer.name, -1))
          } else {
            if(isRepeatCountChange) {
              results.push(SARMap.setLayerAnimationRepeatCount(layer.name, repeatCount))
            }
          }
          if(results.length > 0) {
            Promise.all(results).then(AppToolBar.getProps().getARLayers)
          }
        }
        AppToolBar.goBack()
      }
    }
  ]
}