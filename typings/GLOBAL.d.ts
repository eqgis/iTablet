/**
 * 声明全局GLOBAL
 */
declare namespace GLOBAL {
  let language: string                // 语言
  let markerTag: string
  let SYSTEM_VERSION: string
  let TouchType: string               // 地图触摸事件类型
  let STARTX: Point                   // 离线导航起点
  let ENDX: Point                     // 离线导航终点
  let ThemeType: string               // TODO 动态切换主题，将 GLOBAL.ThemeType 放入Redux中管理
  let BaseMapSize: number             // 底图数量

  let scaleView: string | null        // 地图比例尺组件
}

type Point = {
  x: number
  y: number
}