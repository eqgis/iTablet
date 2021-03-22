/**
 * APP启动引导页
 * 有新功能时展示，getGuide和getCustomGuide只需要使用一个，返回不会空的数组
 * getCustomGuide优先级高于getGuide
 */
import React from 'react'
import { GuideDataType } from '../../src/components/guide/LaunchGuidePage'

const data_en = [
  {
    title: 'AR Survey',
    subTitle: 'Surveying with AR, collecting vector data',
    image: require('./assets/ar_analyst.png'),
  },
  {
    title: 'Thematic Map',
    subTitle: 'Supporting 20+ thematic maps',
    image: require('./assets/theme.png'),
  },
  {
    title: 'Navigation',
    subTitle: 'Compiling road net, navigating instantly',
    image: require('./assets/navigation.png'),
  },
]

const data_cn = [
  {
    title: 'AR测图',
    subTitle: 'AR快速测量，矢量数据采集',
    image: require('./assets/ar_analyst.png'),
  },
  {
    title: '专题地图',
    subTitle: '指滑制作20+专题图',
    image: require('./assets/theme.png'),
  },
  {
    title: '室内外导航',
    subTitle: '编译路网，实时导航',
    image: require('./assets/navigation.png'),
  },
]

/**
 * 启动页到页数据
 * @param language 语言
 * @returns
 */
function getGuide(language: string): Array<GuideDataType> {
  let data
  switch (language) {
    case 'CN':
      data = data_cn
      break
    default:
      data = data_en
      break
  }
  return data
}

/**
 * 自定义启动引导页，优先级高于getGuide
 * @param language 语言
 * @returns
 */
function getCustomGuide(language: string): Array<React.ReactNode> {
  let pages: Array<React.ReactNode> = []
  return pages
}

export default {
  getGuide,
  getCustomGuide,
}