import { SARText } from 'imobile_for_reactnative'
import { Toast } from '../../utils'
import { getLanguage } from '../../language'
import NavigationService from '../NavigationService'

function getPage(page, bottomBar = undefined) {
  let data = []
  let pageAction = () => {}
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
      ]
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
  }

  return { data, pageAction }
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
