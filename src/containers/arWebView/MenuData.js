import { SARWebView } from 'imobile_for_reactnative'
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
          action: () => inputUrl(bottomBar),
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
                ? '请点击需要删除的网页'
                : 'Tap the web page to delete',
            )
            SARWebView.setTapAction('DELETE')
          },
        },
      ]
      pageAction = () => {
        SARWebView.setTapAction('NONE')
        SARWebView.setPlaneVisible(false)
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
            let { url } = bottomBar.getData()
            SARWebView.addWebViewAtCurrentPosition(url)
            bottomBar.goto('main')
          },
        },
        {
          key: 'addAtPlane',
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_ADD_TO_PLANE,
          image: require('../../assets/mapEdit/icon_action3d.png'),
          action: () => {
            let { url } = bottomBar.getData()
            SARWebView.setTapAction('ADD')
            SARWebView.setUrl(url)
            SARWebView.setPlaneVisible(true)
            SARWebView.setOnWebViewAddListener(() => {
              bottomBar.goto('main')
            })
          },
        },
      ]
      pageAction = () => {
        SARWebView.setTapAction('NONE')
        SARWebView.setPlaneVisible(false)
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
            ? '请点击需要修改的网页'
            : 'Tap the web page to modify',
        )
        SARWebView.setTapAction('SELECT')
        SARWebView.setOnWebViewTapListener(() => {
          if (bottomBar) {
            bottomBar.goto('modify_selected')
          }
        })
        SARWebView.setPlaneVisible(false)
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
            SARWebView.modifyWebViewToCurrentPosition()
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
        SARWebView.setTapAction('NONE')
        SARWebView.setPlaneVisible(false)
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
        Toast.show(
          global.language === 'CN'
            ? '请点击平面修改位置'
            : 'Tap the plane to modify location',
        )
        SARWebView.setTapAction('MODIFY')
        SARWebView.setPlaneVisible(true)
        SARWebView.setOnWebViewModifyListener(() => {
          if (bottomBar) {
            bottomBar.goto('main')
          }
        })
      }
      break
  }

  return { data, pageAction }
}

function inputUrl(bottomBar) {
  NavigationService.navigate('InputPage', {
    type: 'http',
    placeholder: 'http://',
    cb: result => {
      NavigationService.goBack()
      bottomBar.addData({ url: result })
      bottomBar.goto('add')
    },
  })
}

export default {
  getPage,
}
