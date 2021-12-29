/**
 * 首页Tab item
 */

/** App预留Tab名称 **/
import { AppTabs } from '../../src/constants'

/** 自定义Tab **/
// import Example from './Example'
import QuestionView from './QuestionView'

/** export顺序为首页Tabs显示顺序, 默认第一个为Home **/
export default [
  AppTabs.Friend,
  // AppTabs.Find,
  // Example,
  QuestionView,
  AppTabs.Mine,
]