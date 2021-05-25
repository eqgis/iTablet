import { createBottomTabNavigator } from 'react-navigation'
import Home, { Setting, AboutITablet } from './Home'
import Mine, {
  MyService,
  MyLocalData,
  MyMap,
  MyARMap,
  MyScene,
  MyDatasource,
  MySymbol,
  MyTemplate,
  MyColor,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  Login,
  MyLabel,
  MyBaseMap,
  MyDataset,
  NewDataset,
  SearchMine,
  MyApplet,
  MyAIModel,
} from './Mine'
import Find from './Find'
import FindSettingPage from './Find/FindSettingPage'
import SuperMapKnown from './Find/superMapKnown'
import PublicData from './Find/PublicData'
import Applet from './Find/Applet'
import Laboratory from './Find/Laboratory'
import CoworkManagePage from './Find/CoworkManagePage'
import Friend, {
  Chat,
  AddFriend,
  InformMessage,
  CreateGroupChat,
  RecommendFriend,
  ManageFriend,
  ManageGroup,
  SelectModule,
  GroupMemberList,
  SelectFriend,
} from './Friend'
import { AppTabs } from '../../constants'

const Tabs = function(arr) {
  const tabs = {
    Home: {
      screen: Home,
    },
  }
  for (let i = 0; i < arr.length; i++) {
    switch (arr[i]) {
      case AppTabs.Friend:
        tabs.Friend = {
          screen: Friend,
        }
        break
      case AppTabs.Find:
        tabs.Find = {
          screen: Find,
        }
        break
      case AppTabs.Mine:
        tabs.Mine = {
          screen: Mine,
        }
        break
      default:
        if (arr[i] && arr[i].Screen) {
          tabs[arr[i].key] = {
            screen: arr[i].Screen,
          }
        }
    }
  }
  return createBottomTabNavigator(tabs, {
    tabBarComponent: () => {
      return null
    },
    animationEnabled: false, // 切换页面时是否有动画效果
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 是否可以左右滑动切换tab
    backBehavior: 'initialRoute', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    lazy: false,
    tabBarOptions: {
      showLabel: false,
      showIcon: false,
      indicatorStyle: {
        height: 0, // 如TabBar下面显示有一条线，可以设高度为0后隐藏
      },
      style: {
        backgroundColor: '#EEEEEE', // TabBar 背景色
        height: 0,
      },
    },
  })
}

export {
  Tabs,
  /** Mine */
  MyService,
  MyLocalData,
  MyMap,
  MyARMap,
  MyScene,
  MyDatasource,
  MySymbol,
  MyTemplate,
  MyColor,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  MyDataset,
  NewDataset,
  SearchMine,
  MyApplet,
  MyAIModel,
  /** Home */
  Setting,
  AboutITablet,
  Login,
  /** friend */
  Chat,
  InformMessage,
  AddFriend,
  CreateGroupChat,
  RecommendFriend,
  ManageFriend,
  ManageGroup,
  SelectModule,
  GroupMemberList,
  SelectFriend,
  //-----------
  MyLabel,
  MyBaseMap,
  SuperMapKnown,
  PublicData,
  Applet,
  CoworkManagePage,
  FindSettingPage,
  Laboratory,
}
