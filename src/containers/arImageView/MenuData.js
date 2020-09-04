import * as React from 'react'
import { SARImage } from 'imobile_for_reactnative'
import { ImagePicker } from '../../components'
import { Toast } from '../../utils'
import { getLanguage } from '../../language'
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
          key: 'selectToAdd',
          title: getLanguage(global.language).Analyst_Labels.ADD,
          image: require('../../assets/mapTools/icon_add_white.png'),
          action: () => selectImage(bottomBar),
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
                ? '请点击需要删除的图片'
                : 'Tap the image to delete',
            )
            SARImage.setTapAction('DELETE')
          },
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
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
          action: () => addImage(bottomBar),
        },
        {
          key: 'addAtPlane',
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_ADD_TO_PLANE,
          image: require('../../assets/mapEdit/icon_action3d.png'),
          action: () => addImageToPlane(bottomBar),
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
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
            ? '请点击需要修改的图片'
            : 'Tap the image to modify',
        )
        SARImage.setTapAction('SELECT')
        SARImage.setOnImageTapListener(() => {
          if (bottomBar) {
            bottomBar.goto('modify_selected')
          }
        })
        SARImage.setPlaneVisible(false)
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
            SARImage.modifyImageToCurrentPosition()
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
      // if (Platform.OS === 'ios') {
      //   data.splice(3, 1)
      // }
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
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
        SARImage.setTapAction('MODIFY')
        SARImage.setPlaneVisible(true)
        SARImage.setOnImageModifyListener(() => {
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
              SARImage.move(0, 0, 0)
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
              SARImage.move(currentX, currentY, currentZ, true)
              bottomBar.goto('main')
            }
          },
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
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
            SARImage.move(currentX, currentY, currentZ)
          }}
          onMoveY={value => {
            let currentY = value / 10
            bottomBar.addData({ currentY })
            let { currentX, currentZ } = bottomBar.getData()
            currentX = currentX === undefined ? 0 : currentX
            currentZ = currentZ === undefined ? 0 : currentZ
            SARImage.move(currentX, currentY, currentZ)
          }}
          onMoveZ={value => {
            let currentZ = value / 10
            bottomBar.addData({ currentZ })
            let { currentX, currentY } = bottomBar.getData()
            currentX = currentX === undefined ? 0 : currentX
            currentY = currentY === undefined ? 0 : currentY
            SARImage.move(currentX, currentY, currentZ)
          }}
        />
      )
      break
  }

  return { data, pageAction, customView }
}

function selectImage(bottomBar) {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
  ImagePicker.getAlbum({
    maxSize: 1,
    callback: async data => {
      if (data && data.length > 0) {
        let path = data[0].uri
        bottomBar.addData({ path: path })
        bottomBar.goto('add')
      }
    },
  })
}

function addImage(bottomBar) {
  let { path } = bottomBar.getData()
  SARImage.addImageAtCurrentPosition(path)
  bottomBar.goto('main')
}

function addImageToPlane(bottomBar) {
  let { path } = bottomBar.getData()
  SARImage.setTapAction('ADD')
  SARImage.setImagePath(path)
  SARImage.setPlaneVisible(true)
  SARImage.setOnImageAddListener(() => {
    bottomBar.goto('main')
  })
}

export default {
  getPage,
}
