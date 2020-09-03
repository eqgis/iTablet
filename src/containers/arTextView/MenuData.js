import * as React from 'react'
import { SARText } from 'imobile_for_reactnative'
import { Toast } from '../../utils'
import { getLanguage } from '../../language'
import NavigationService from '../NavigationService'
import XYZSlide from '../../components/XYZSlide'
import { Platform } from 'react-native'

function getPage(page, bottomBar = undefined) {
  let data = []
  let pageAction = () => {}
  let customView = null
  switch (page) {
    case 'main':
      data = [
        {
          key: 'inputToAdd',
          title: getLanguage(global.language).Analyst_Labels.ADD,
          image: require('../../assets/mapTools/icon_add_white.png'),
          action: () => inputText(bottomBar),
        },
        {
          key: 'modify',
          title: getLanguage(global.language).Analyst_Labels.Edit,
          image: require('../../assets/mapTools/edit_white.png'),
        },
        {
          key: 'delete',
          title: getLanguage(global.language).Analyst_Labels.DELETE,
          image: require('../../assets/mapTools/icon_delete_white.png'),
          action: () => {
            Toast.show(
              global.language === 'CN'
                ? '请点击需要删除的文字'
                : 'Tap the text to delete',
            )
            SARText.setTapAction('DELETE')
          },
        },
      ]
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
      }
      break
    case 'add':
      data = [
        {
          key: 'main',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
        {
          key: 'addAtCurrent',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_ADD_TO_CURRENT_POSITION,
          image: require('../../assets/mapTools/collect_point_normal.png'),
          action: () => {
            let { text, styles } = bottomBar.getData()
            SARText.addTextAtCurrentPosition(text, styles)
            bottomBar.goto('main')
          },
        },
        {
          key: 'addAtPlane',
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_ADD_TO_PLANE,
          image: require('../../assets/mapEdit/icon_action3d.png'),
          action: () => {
            let { text, styles } = bottomBar.getData()
            SARText.setTapAction('ADD')
            SARText.setText(text, styles)
            SARText.setPlaneVisible(true)
            SARText.setOnTextAddListener(() => {
              bottomBar.goto('main')
            })
          },
        },
      ]
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
      }
      break
    case 'addAtPlane':
      data = [
        {
          key: 'add',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
      ]
      break
    case 'modify':
      data = [
        {
          key: 'main',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
      ]
      pageAction = () => {
        Toast.show(
          global.language === 'CN'
            ? '请点击需要修改的文字'
            : 'Tap the text to modify',
        )
        SARText.setTapAction('SELECT')
        SARText.setOnTextTapListener(() => {
          if (bottomBar) {
            bottomBar.goto('modify_selected')
          }
        })
        SARText.setPlaneVisible(false)
      }
      break
    case 'modify_selected':
      data = [
        {
          key: 'modify',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
        {
          key: 'modifyToCurrent',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_MOVE_TO_CURRENT_POSITION,
          image: require('../../assets/mapTools/collect_point_normal.png'),
          action: () => {
            SARText.modifyTextToCurrentPosition()
            if (bottomBar) {
              bottomBar.goto('main')
            }
          },
        },
        {
          key: 'modifyToPlane',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_MOVE_TO_PLANE,
          image: require('../../assets/mapEdit/icon_action3d.png'),
        },
        {
          key: 'modifyBy',
          title: getLanguage(global.language).Common.PARAMETER,
          image: require('../../assets/mapEdit/icon_function_theme_param_menu.png'),
        },
      ]
      if (Platform.OS === 'ios') {
        data.splice(3, 1)
      }
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
      }
      break
    case 'modifyToPlane':
      data = [
        {
          key: 'modify_selected',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
      ]
      pageAction = () => {
        SARText.setTapAction('MODIFY')
        SARText.setPlaneVisible(true)
        SARText.setOnTextModifyListener(() => {
          if (bottomBar) {
            bottomBar.goto('main')
          }
        })
      }
      break
    case 'modifyBy':
      data = [
        {
          key: 'modify_selected',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
          action: () => {
            if (bottomBar) {
              SARText.move(0, 0, 0)
            }
          },
        },
        {
          key: 'modify_confirm',
          image: require('../../assets/mapEdit/commit.png'),
          action: () => {
            if (bottomBar) {
              let { currentX, currentY, currentZ } = bottomBar.getData()
              currentX = currentX === undefined ? 0 : currentX
              currentY = currentY === undefined ? 0 : currentY
              currentZ = currentZ === undefined ? 0 : currentZ
              SARText.move(currentX, currentY, currentZ, true)
              bottomBar.goto('main')
            }
          },
        },
      ]
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
        if (bottomBar) {
          bottomBar.addData({
            currentX: undefined,
            currentY: undefined,
            currentZ: undefined,
          })
        }
      }
      customView = (
        <XYZSlide
          rangeX={[-20, 20]}
          rangeY={[-20, 20]}
          rangeZ={[-20, 20]}
          onMoveX={value => {
            let currentX = value / 10
            bottomBar.addData({ currentX })
            let { currentY, currentZ } = bottomBar.getData()
            currentY = currentY === undefined ? 0 : currentY
            currentZ = currentZ === undefined ? 0 : currentZ
            SARText.move(currentX, currentY, currentZ)
          }}
          onMoveY={value => {
            let currentY = value / 10
            bottomBar.addData({ currentY })
            let { currentX, currentZ } = bottomBar.getData()
            currentX = currentX === undefined ? 0 : currentX
            currentZ = currentZ === undefined ? 0 : currentZ
            SARText.move(currentX, currentY, currentZ)
          }}
          onMoveZ={value => {
            let currentZ = value / 10
            bottomBar.addData({ currentZ })
            let { currentX, currentY } = bottomBar.getData()
            currentX = currentX === undefined ? 0 : currentX
            currentY = currentY === undefined ? 0 : currentY
            SARText.move(currentX, currentY, currentZ)
          }}
        />
      )
      break
  }

  return { data, pageAction, customView }
}

function inputText(bottomBar) {
  NavigationService.navigate('InputStyledText', {
    placeholder: getLanguage(global.language).Prompt.PLEASE_ENTER,
    cb: (result, styles) => {
      NavigationService.goBack()
      bottomBar.addData({ text: result, styles: styles })
      bottomBar.goto('add')
    },
  })
}

export default {
  getPage,
}
