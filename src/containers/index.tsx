import React from 'react'
import {
  createNativeStackNavigator,
  ScreenOptions,
} from '@react-navigation/native-stack'

// 主页

// 我的
import {
  Tabs,
  MyService,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
  MyLocalData,
  MyMap,
  MyARMap,
  MyARModel,
  MyAREffect,
  MyScene,
  MyDatasource,
  MySymbol,
  MyTemplate,
  MyColor,
  MyApplet,
  MyAIModel,
  MySandTable,
  Personal,
  ToggleAccount,
  Setting,
  AboutITablet,
  Login,
  MyDataset,
  NewDataset,
  SearchMine,
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
  MyLabel,
  MyBaseMap,
  SuperMapKnown,
  PublicData,
  Applet,
  CoworkManagePage,
  FindSettingPage,
  Laboratory,
} from './tabs'

import GetBack from './register&getBack/GetBack'
// 地图二级设置菜单
import SecondMapSettings from './mapSetting/secondMapSettings'
// 地图功能页面
import MTLayerManager from './mtLayerManager'
import Layer3DManager from './Layer3DManager'
import MapSetting from './mapSetting'
import Map3DSetting from './setting'
import {
  LayerSelectionAttribute,
  LayerAttributeAdd,
  LayerAttributeSearch,
  LayerAttributeStatistic,
} from './layerAttribute'
// import dataSourcelist from './dataSourcelist'
import ColorPickerPage from './colorPickerPage'
import {
  MapStack,
  Map3DStack,
  // MapAnalystTabs,
  CoworkTabs,
  MapView,
} from './workspace'
import MapToolbarSetting from './workspace/components/MapToolbarSetting'
import TouchProgress from './workspace/components/TouchProgress'
import AnimationNodeEditView from './workspace/components/AnimationNodeEditView'
import AnimationNodeEditRotateView from './workspace/components/AnimationNodeEditRotateView'
import AddOnlineScense from './workspace/components/AddOnlineScense'
import InputPage from './InputPage'
import InputStyledText from './InputStyledText'
import Protocol from './tabs/Home/AboutITablet/Protocol'
import {
  LicensePage,
  LicenseTypePage,
  LicenseModule,
  LicenseJoin,
  LicenseJoinCloud,
  LoginCloud,
  LicenseJoinPrivateCloud,
  ConnectServer,
  LicenseJoinEducation,
} from './tabs/Home/License'
import SuggestionFeedback from './tabs/Home/SuggestionFeedback/SuggestionFeedback'
import PointAnalyst from './pointAnalyst'
import PublicMap from './publicMap'
import FriendMap from './friendMap'
import LoadServer from './tabs/Mine/MyBaseMap/LoadServer'
import { MapCut, MapCutDS } from './mapCut/page'
import {
  BufferAnalystView,
  AnalystRadiusSetting,
  AnalystListEntry,
  OverlayAnalystView,
  OnlineAnalystView,
  IServerLoginPage,
  SourceDatasetPage,
  AnalystRangePage,
  WeightAndStatistic,
  LocalAnalystView,
  RegistrationDatasetPage,
  RegistrationReferDatasetPage,
  RegistrationArithmeticPage,
  RegistrationExecutePage,
  ProjectionTransformationPage,
  SourceCoordsPage,
  ProjectionParameterSetPage,
  ProjectionTargetCoordsPage,
  RegistrationFastPage,
  RegistrationPage,
  ReferenceAnalystView,
  InterpolationAnalystView,
  InterpolationAnalystDetailView,
} from './analystView/pages'

import MediaEdit from './mediaEdit'
import Camera from './camera'
import MeasureView from './arMeasure'
import { MeasureAreaView } from './arMeasure/pages'
import ClassifyView from './aiClassifyView'
import ModelChoseView from './arModelChoseView'
import ClassifyResultEditView from './aiClassifyResultEdit'
import CollectSceneFormView from './arCollectSceneFormView'
import EnterDatumPoint from './arEnterDatumPoint/EnterDatumPoint'
import CollectSceneFormSet from './arEnterDatumPoint/CollectSceneFormSet'
import ClassifySettingsView from './ClassifySettingsView'
import IllegallyParkView from './aiIllegallyPark'
import AISelectModelView from './aiSelectModelView'
import AIDetectSettingView from './aiDetectSettingView'
import CastModelOperateView from './arCastModelOperateView'
import ARProjectModeView from './arProjectModel'
import ARNavigationView from './arNavigationView'
import ChooseWeather from './chooseWeather'
import AIPoseEstimationView from './aiPoseEstimationView'
import AIGestureBoneView from './aiGestureBoneView'
import ChooseLayer from './chooseLayer'

import NavigationView from './workspace/components/NavigationView'
import NavigationDataChangePage from './NavigationDataChangePage'
import CreateNavDataPage from './CreateNavDataPage'
import ChooseTaggingLayer from './ChooseTaggingLayer'
import ChooseNaviLayer from './ChooseNaviLayer'
import ChooseNaviDataImport from './ChooseNaviDataImport'
import LanguageSetting from './languageSetting'
import CollectSceneFormHistoryView from './arCollectSceneFormHistoryView'
import LocationSetting from './locationSetting'
import CustomModePage from './CustomModePage'
import CoworkMessage from './tabs/Friend/Cowork/CoworkMessage'
import {
  CreateGroupPage,
  GroupSelectPage,
  GroupFriendListPage,
  GroupApplyPage,
  GroupInvitePage,
  GroupSourceManagePage,
  GroupSourceUploadPage,
  GroupMessagePage,
  SelectModulePage,
  GroupSettingPage,
  CoworkMember,
} from './tabs/Find/CoworkManagePage/pages'
import {
  TemplateManager,
  TemplateDetail,
  TemplateSource,
} from './templateManager/pages'
import AppletManagement from './applet/appletManagement'
import AppletList from './applet/appletList'
import SampleMap from './sampleMap'
import SelectLocation from './workspace/pages/SelectLocation'
import ARLayerManager from './arLayerManager'
import ARMapSetting from './arMapSettings/ARMapSetting'
import ServiceShareSettings from './serviceShareSettings'
import NavigationView2D from './workspace/components/ArNavigation/NavigationView2D'
import RoadNet from './workspace/components/ArNavigation/RoadNet'
import Report from '../containers/tabs/Friend/Chat/Report'
import WebView from '../components/WebView'
import { ImagePickerStack } from '@/components/ImagePicker'
import { UserInfo } from '@/types'
import { Platform } from 'react-native'
import MapSelectList from '../containers/workspace/components/ToolBar/modules/arDrawingModule/MapSelectList'
import { DEVICE } from '@/redux/models/device'
import ChartManager from './ChartManager/ChartManager'
import * as ImagePicker from '@/components/ImagePicker/src'

const Stack = createNativeStackNavigator()

interface StackNavigatorProps {
  appConfig: any,
  device: DEVICE,
  currentUser: UserInfo,
}

/**
 * 不隐藏上一节面
 * ios使用transparentModal时,在该页面跳转的页面也需要使用transparentModal,否则跳转的页面会出现在下一层
 */
const modalOption = (params: StackNavigatorProps): ScreenOptions => {
  return {
    headerShown: false,
    animation: params.device.orientation.indexOf('PORTRAIT') >= 0 ? 'none' : 'fade',
    presentation: 'containedTransparentModal',
    // presentation: Platform.OS === 'ios' ? 'formSheet' : 'containedTransparentModal',
    // presentation: Platform.OS === 'ios' && params.device.orientation.indexOf('PORTRAIT') >= 0 ? 'card' : 'containedTransparentModal',
  }
}

export default function(params: StackNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName='Tabs'
      screenOptions={{
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        // presentation: Platform.OS === 'ios' ? 'card' : 'transparentModal',
        presentation: 'card',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Tabs">
        {() => Tabs(params.appConfig.tabModules)}
      </Stack.Screen>
      <Stack.Screen name="CreateGroupPage" component={CreateGroupPage} />
      <Stack.Screen name="MapStack" >
        {() => MapStack(params.device)}
      </Stack.Screen>
      <Stack.Screen name="Map3DStack" >
        {() => Map3DStack(params.device)}
      </Stack.Screen>
      <Stack.Screen name="CoworkTabs" >
        {() => CoworkTabs(params.device)}
      </Stack.Screen>
      <Stack.Screen name="MapViewSingle" component={MapView} />
      <Stack.Screen name="MapSetting" component={MapSetting} options={modalOption(params)}/>
      <Stack.Screen name="Map3DSetting" component={Map3DSetting} options={modalOption(params)}/>
      <Stack.Screen name="CoworkMember" component={CoworkMember} />
      <Stack.Screen name="CoworkMessage" component={CoworkMessage} />
      <Stack.Screen name="GroupSelectPage" component={GroupSelectPage} />
      <Stack.Screen name="GroupFriendListPage" component={GroupFriendListPage} />
      <Stack.Screen name="GroupApplyPage" component={GroupApplyPage} />
      <Stack.Screen name="GroupInvitePage" component={GroupInvitePage} />
      <Stack.Screen name="GroupSourceManagePage" component={GroupSourceManagePage} />
      <Stack.Screen name="GroupSourceUploadPage" component={GroupSourceUploadPage} />
      <Stack.Screen name="GroupMessagePage" component={GroupMessagePage} />
      <Stack.Screen name="SelectModulePage" component={SelectModulePage} />
      <Stack.Screen name="GroupSettingPage" component={GroupSettingPage} />
      <Stack.Screen name="LayerManager" component={MTLayerManager} options={modalOption(params)}/>
      <Stack.Screen name="Layer3DManager" component={Layer3DManager} options={modalOption(params)}/>
      <Stack.Screen name="LayerSelectionAttribute" component={LayerSelectionAttribute} />
      <Stack.Screen name="LayerAttributeAdd" component={LayerAttributeAdd} />
      <Stack.Screen name="LayerAttributeSearch" component={LayerAttributeSearch} />
      <Stack.Screen name="LayerAttributeStatistic" component={LayerAttributeStatistic} />
      <Stack.Screen name="ChooseLayer" component={ChooseLayer} />
      <Stack.Screen name="ColorPickerPage" component={ColorPickerPage} />
      <Stack.Screen name="MapCut" component={MapCut} />
      <Stack.Screen name="MapCutDS" component={MapCutDS} />
      <Stack.Screen name="MapToolbarSetting" component={MapToolbarSetting} />
      <Stack.Screen name="TouchProgress" component={TouchProgress} />
      <Stack.Screen name="InputPage" component={InputPage} options={modalOption(params)} />
      <Stack.Screen name="InputStyledText" component={InputStyledText} />
      <Stack.Screen name="AnimationNodeEditView" component={AnimationNodeEditView} />
      <Stack.Screen name="AnimationNodeEditRotateView" component={AnimationNodeEditRotateView} />
      <Stack.Screen name="AddOnlineScense" component={AddOnlineScense} />
      <Stack.Screen name="TemplateManager" component={TemplateManager} options={modalOption(params)} />
      <Stack.Screen name="TemplateDetail" component={TemplateDetail} options={modalOption(params)} />
      <Stack.Screen name="TemplateSource" component={TemplateSource} options={modalOption(params)} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="AddFriend" component={AddFriend} />
      <Stack.Screen name="InformMessage" component={InformMessage} />
      <Stack.Screen name="CreateGroupChat" component={CreateGroupChat} />
      <Stack.Screen name="RecommendFriend" component={RecommendFriend} />
      <Stack.Screen name="ManageFriend" component={ManageFriend} />
      <Stack.Screen name="ManageGroup" component={ManageGroup} />
      <Stack.Screen name="SelectModule" component={SelectModule} />
      <Stack.Screen name="GroupMemberList" component={GroupMemberList} />
      <Stack.Screen name="SelectFriend" component={SelectFriend} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ToggleAccount" component={ToggleAccount} />
      <Stack.Screen name="GetBack" component={GetBack} />
      <Stack.Screen name="SampleMap" component={SampleMap} options={modalOption(params)} />

      {/** 地图页面中跳转到以下界面 */}
      <Stack.Screen name="MyDatasource_InMap" component={MyDatasource} options={modalOption(params)} />
      <Stack.Screen name="MyDataset_InMap" component={MyDataset} options={modalOption(params)} />
      <Stack.Screen name="NewDataset_InMap" component={NewDataset} options={modalOption(params)} />
      {/** 非地图页面跳转到以下界面 */}
      <Stack.Screen name="MyDatasource" component={MyDatasource} />
      <Stack.Screen name="MyDataset" component={MyDataset} />
      <Stack.Screen name="NewDataset" component={NewDataset} />

      <Stack.Screen name="MyLocalData" component={MyLocalData} />
      <Stack.Screen name="MyMap" component={MyMap} />
      <Stack.Screen name="MyARMap" component={MyARMap} />
      <Stack.Screen name="MyARModel" component={MyARModel} />
      <Stack.Screen name="MyAREffect" component={MyAREffect} />
      <Stack.Screen name="MyScene" component={MyScene} />
      <Stack.Screen name="MySymbol" component={MySymbol} />
      <Stack.Screen name="MyTemplate" component={MyTemplate} />
      <Stack.Screen name="MyColor" component={MyColor} />
      <Stack.Screen name="SearchMine" component={SearchMine} />
      <Stack.Screen name="MyService" component={MyService} />
      <Stack.Screen name="MyOnlineMap" component={MyOnlineMap} />
      <Stack.Screen name="MyApplet" component={MyApplet} />
      <Stack.Screen name="AppletManagement" component={AppletManagement} />
      <Stack.Screen name="AppletList" component={AppletList} />
      <Stack.Screen name="MyAIModel" component={MyAIModel} />
      <Stack.Screen name="MySandTable" component={MySandTable} />
      <Stack.Screen name="ScanOnlineMap" component={ScanOnlineMap} />
      <Stack.Screen name="Personal" component={Personal} />
      <Stack.Screen name="WebView" component={WebView} />
      <Stack.Screen name="AboutITablet" component={AboutITablet} />
      <Stack.Screen name="LicensePage" component={LicensePage} />
      <Stack.Screen name="LicenseTypePage" component={LicenseTypePage} />
      <Stack.Screen name="LicenseModule" component={LicenseModule} />
      <Stack.Screen name="LicenseJoin" component={LicenseJoin} />
      <Stack.Screen name="LicenseJoinCloud" component={LicenseJoinCloud} />
      <Stack.Screen name="LoginCloud" component={LoginCloud} />
      <Stack.Screen name="LicenseJoinPrivateCloud" component={LicenseJoinPrivateCloud} />
      <Stack.Screen name="ConnectServer" component={ConnectServer} />
      <Stack.Screen name="LicenseJoinEducation" component={LicenseJoinEducation} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="LanguageSetting" component={LanguageSetting} />
      <Stack.Screen name="LocationSetting" component={LocationSetting} options={modalOption(params)} />
      <Stack.Screen name="Protocol" component={Protocol} />
      <Stack.Screen name="PublicMap" component={PublicMap} />
      <Stack.Screen name="PointAnalyst" component={PointAnalyst} options={modalOption(params)}/>
      <Stack.Screen name="FriendMap" component={FriendMap} />
      <Stack.Screen name="MyLabel" component={MyLabel} />
      <Stack.Screen name="MyBaseMap" component={MyBaseMap} />
      <Stack.Screen name="LoadServer" component={LoadServer} />
      <Stack.Screen name="SuperMapKnown" component={SuperMapKnown} />
      <Stack.Screen name="PublicData" component={PublicData} />
      <Stack.Screen name="Applet" component={Applet} />
      <Stack.Screen name="CoworkManagePage" component={CoworkManagePage} />
      <Stack.Screen name="FindSettingPage" component={FindSettingPage} />
      <Stack.Screen name="Laboratory" component={Laboratory} />
      <Stack.Screen name="MediaEdit" component={MediaEdit} options={modalOption(params)} />
      <Stack.Screen name="Camera" component={Camera} options={{
        headerShown: false,
        animation: 'none',
        presentation: 'containedTransparentModal',
      }} />
      <Stack.Screen name="MeasureView" component={MeasureView} />
      <Stack.Screen name="MeasureAreaView" component={MeasureAreaView} />
      <Stack.Screen name="SelectLocation" component={SelectLocation} />
      <Stack.Screen name="ARProjectModeView" component={ARProjectModeView} />
      <Stack.Screen name="ClassifyView" component={ClassifyView} />
      <Stack.Screen name="ModelChoseView" component={ModelChoseView} />
      <Stack.Screen name="ClassifyResultEditView" component={ClassifyResultEditView} />
      <Stack.Screen name="CollectSceneFormView" component={CollectSceneFormView} />
      <Stack.Screen name="EnterDatumPoint" component={EnterDatumPoint} />
      <Stack.Screen name="CollectSceneFormSet" component={CollectSceneFormSet} />
      <Stack.Screen name="ClassifySettingsView" component={ClassifySettingsView} />
      <Stack.Screen name="AIDetectSettingView" component={AIDetectSettingView} />
      <Stack.Screen name="AISelectModelView" component={AISelectModelView} />
      <Stack.Screen name="IllegallyParkView" component={IllegallyParkView} />
      <Stack.Screen name="AIPoseEstimationView" component={AIPoseEstimationView} />
      <Stack.Screen name="AIGestureBoneView" component={AIGestureBoneView} />
      <Stack.Screen name="ChooseTaggingLayer" component={ChooseTaggingLayer} />
      <Stack.Screen name="ChooseNaviLayer" component={ChooseNaviLayer} />
      <Stack.Screen name="ChooseNaviDataImport" component={ChooseNaviDataImport} />
      <Stack.Screen name="CastModelOperateView" component={CastModelOperateView} />
      <Stack.Screen name="ARNavigationView" component={ARNavigationView} />
      <Stack.Screen name="ChooseWeather" component={ChooseWeather} />
      <Stack.Screen name="SuggestionFeedback" component={SuggestionFeedback} />
      <Stack.Screen name="BufferAnalystView" component={BufferAnalystView} />
      <Stack.Screen name="AnalystRadiusSetting" component={AnalystRadiusSetting} />
      <Stack.Screen name="AnalystListEntry" component={AnalystListEntry} />
      <Stack.Screen name="OverlayAnalystView" component={OverlayAnalystView} />
      <Stack.Screen name="OnlineAnalystView" component={OnlineAnalystView} />
      <Stack.Screen name="IServerLoginPage" component={IServerLoginPage} />
      <Stack.Screen name="SourceDatasetPage" component={SourceDatasetPage} />
      <Stack.Screen name="AnalystRangePage" component={AnalystRangePage} />
      <Stack.Screen name="WeightAndStatistic" component={WeightAndStatistic} />
      <Stack.Screen name="LocalAnalystView" component={LocalAnalystView} />
      <Stack.Screen name="ReferenceAnalystView" component={ReferenceAnalystView} />
      <Stack.Screen name="RegistrationDatasetPage" component={RegistrationDatasetPage} />
      <Stack.Screen name="RegistrationReferDatasetPage" component={RegistrationReferDatasetPage} />
      <Stack.Screen name="RegistrationArithmeticPage" component={RegistrationArithmeticPage} />
      <Stack.Screen name="RegistrationExecutePage" component={RegistrationExecutePage} />
      <Stack.Screen name="ProjectionTransformationPage" component={ProjectionTransformationPage} />
      <Stack.Screen name="SourceCoordsPage" component={SourceCoordsPage} />
      <Stack.Screen name="ProjectionParameterSetPage" component={ProjectionParameterSetPage} />
      <Stack.Screen name="ProjectionTargetCoordsPage" component={ProjectionTargetCoordsPage} options={modalOption(params)}/>
      <Stack.Screen name="RegistrationFastPage" component={RegistrationFastPage} />
      <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
      <Stack.Screen name="InterpolationAnalystView" component={InterpolationAnalystView} />
      <Stack.Screen name="InterpolationAnalystDetailView" component={InterpolationAnalystDetailView} />
      <Stack.Screen name="SecondMapSettings" component={SecondMapSettings} options={modalOption(params)}  />
      <Stack.Screen name="SecondMapSettings1" component={SecondMapSettings} options={modalOption(params)}  />
      <Stack.Screen name="SecondMapSettings2" component={SecondMapSettings} options={modalOption(params)}  />
      <Stack.Screen name="SecondMapSettings3" component={SecondMapSettings} options={modalOption(params)}  />
      <Stack.Screen name="SecondMapSettings4" component={SecondMapSettings} options={modalOption(params)}  />
      <Stack.Screen name="SecondMapSettings5" component={SecondMapSettings} options={modalOption(params)}  />
      <Stack.Screen name="SecondMapSettings6" component={SecondMapSettings} options={modalOption(params)}  />
      <Stack.Screen name="SecondMapSettings7" component={SecondMapSettings} options={modalOption(params)}  />
      <Stack.Screen name="NavigationView" component={NavigationView} options={modalOption(params)} />
      <Stack.Screen name="NavigationDataChangePage" component={NavigationDataChangePage} />
      <Stack.Screen name="CreateNavDataPage" component={CreateNavDataPage} />
      <Stack.Screen name="CollectSceneFormHistoryView" component={CollectSceneFormHistoryView} />
      <Stack.Screen name="CustomModePage" component={CustomModePage} />
      <Stack.Screen name="ARLayerManager" component={ARLayerManager} options={modalOption(params)}/>
      <Stack.Screen name="ARMapSetting" component={ARMapSetting} options={modalOption(params)}/>
      <Stack.Screen name="ServiceShareSettings" component={ServiceShareSettings} />
      <Stack.Screen name="NavigationView2D" component={NavigationView2D} />
      <Stack.Screen name="RoadNet" component={RoadNet} />
      <Stack.Screen name="Report" component={Report} />
      {/* <Stack.Screen name="ImagePickerStack" component={ImagePickerStack} options={{
        headerShown: false,
        animation: 'slide_from_bottom',
        presentation: 'containedTransparentModal',
      }} /> */}
      <Stack.Screen name={'AlbumListPage'} component={ImagePicker.AlbumListView} options={{
        headerShown: false,
        animation: 'slide_from_bottom',
        presentation: 'containedTransparentModal',
      }} />
      <Stack.Screen name={'AlbumViewPage'} component={ImagePicker.AlbumView} options={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        presentation: 'containedTransparentModal',
      }} />
      <Stack.Screen name="MapSelectList" component={MapSelectList} options={modalOption(params)}/>
      <Stack.Screen name="ChartManager" component={ChartManager} />
    </Stack.Navigator>
  )
}