import { createStackNavigator } from 'react-navigation'
// eslint-disable-next-line
// import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator'
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
import protocol from './tabs/Home/AboutITablet/Protocol'
import {
  LicensePage,
  LicenseTypePage,
  LicenseModule,
  LicenseJoin,
  LicenseJoinCloud,
  LicenseJoinPrivateCloud,
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
import ARVideoView from './arVideoView'
import ARWeatherView from './arWeatherView'
import ChooseWeather from './chooseWeather'
import ARImageView from './arImageView'
import AIPoseEstimationView from './aiPoseEstimationView'
import AIGestureBoneView from './aiGestureBoneView'
import ARWebView from './arWebView'
import ARTextView from './arTextView'
import ARSceneView from './arSceneView'
import ChooseLayer from './chooseLayer'

import NavigationView from './workspace/components/NavigationView'
import NavigationDataChangePage from './NavigationDataChangePage'
import CreateNavDataPage from './CreateNavDataPage'
import ChooseTaggingLayer from './ChooseTaggingLayer'
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

export default function (appConfig) {
  return createStackNavigator(
    {
      Tabs: {
        screen: Tabs(appConfig.tabModules),
        navigationOptions: {
          header: null,
        },
      },

      MapStack: {
        screen: MapStack,
        navigationOptions: {
          header: null,
          gesturesEnabled: false,
        },
      },
      Map3DStack: {
        screen: Map3DStack,
        navigationOptions: {
          header: null,
          gesturesEnabled: false,
        },
      },
      MapViewSingle: {
        screen: MapView,
        navigationOptions: {
          header: null,
        },
      },
      CoworkTabs: {
        screen: CoworkTabs,
        navigationOptions: {
          header: null,
        },
      },
      CoworkMember: {
        screen: CoworkMember,
        navigationOptions: {
          header: null,
        },
      },
      CoworkMessage: {
        screen: CoworkMessage,
        navigationOptions: {
          header: null,
        },
      },
      CreateGroupPage: {
        screen: CreateGroupPage,
        navigationOptions: {
          header: null,
        },
      },
      GroupSelectPage: {
        screen: GroupSelectPage,
        navigationOptions: {
          header: null,
        },
      },
      GroupFriendListPage: {
        screen: GroupFriendListPage,
        navigationOptions: {
          header: null,
        },
      },
      GroupApplyPage: {
        screen: GroupApplyPage,
        navigationOptions: {
          header: null,
        },
      },
      GroupInvitePage: {
        screen: GroupInvitePage,
        navigationOptions: {
          header: null,
        },
      },
      GroupSourceManagePage: {
        screen: GroupSourceManagePage,
        navigationOptions: {
          header: null,
        },
      },
      GroupSourceUploadPage: {
        screen: GroupSourceUploadPage,
        navigationOptions: {
          header: null,
        },
      },
      GroupMessagePage: {
        screen: GroupMessagePage,
        navigationOptions: {
          header: null,
        },
      },
      SelectModulePage: {
        screen: SelectModulePage,
        navigationOptions: {
          header: null,
        },
      },
      GroupSettingPage: {
        screen: GroupSettingPage,
        navigationOptions: {
          header: null,
        },
      },
      // MapAnalystTabs: {
      //   screen: MapAnalystTabs,
      //   navigationOptions: {
      //     header: null,
      //   },
      // },

      LayerManager: {
        screen: MTLayerManager,
        navigationOptions: {
          header: null,
        },
      },
      Layer3DManager: {
        screen: Layer3DManager,
        navigationOptions: {
          header: null,
        },
      },
      LayerSelectionAttribute: {
        screen: LayerSelectionAttribute,
        navigationOptions: {
          header: null,
        },
      },
      LayerAttributeAdd: {
        screen: LayerAttributeAdd,
        navigationOptions: {
          header: null,
        },
      },
      LayerAttributeSearch: {
        screen: LayerAttributeSearch,
        navigationOptions: {
          header: null,
        },
      },
      LayerAttributeStatistic: {
        screen: LayerAttributeStatistic,
        navigationOptions: {
          header: null,
        },
      },
      ChooseLayer: {
        screen: ChooseLayer,
        navigationOptions: {
          header: null,
        },
      },
      ColorPickerPage: {
        screen: ColorPickerPage,
        navigationOptions: {
          header: null,
        },
      },
      MapCut: {
        screen: MapCut,
        navigationOptions: {
          header: null,
        },
      },
      MapCutDS: {
        screen: MapCutDS,
        navigationOptions: {
          header: null,
        },
      },
      MapToolbarSetting: {
        screen: MapToolbarSetting,
        navigationOptions: {
          header: null,
        },
      },
      TouchProgress: {
        screen: TouchProgress,
        navigationOptions: {
          header: null,
        },
      },
      InputPage: {
        screen: InputPage,
        navigationOptions: {
          header: null,
        },
      },
      InputStyledText: {
        screen: InputStyledText,
        navigationOptions: {
          header: null,
        },
      },
      AnimationNodeEditView: {
        screen: AnimationNodeEditView,
        navigationOptions: {
          header: null,
        },
      },
      AnimationNodeEditRotateView: {
        screen: AnimationNodeEditRotateView,
        navigationOptions: {
          header: null,
        },
      },
      AddOnlineScense: {
        screen: AddOnlineScense,
        navigationOptions: {
          header: null,
        },
      },
      TemplateManager: {
        screen: TemplateManager,
        navigationOptions: {
          header: null,
        },
      },
      TemplateDetail: {
        screen: TemplateDetail,
        navigationOptions: {
          header: null,
        },
      },
      TemplateSource: {
        screen: TemplateSource,
        navigationOptions: {
          header: null,
        },
      },
      /** ****************************** Friend ********************* */
      // onechat
      Chat: {
        screen: Chat,
        navigationOptions: {
          header: null,
        },
      },
      AddFriend: {
        screen: AddFriend,
        navigationOptions: {
          header: null,
        },
      },
      InformMessage: {
        screen: InformMessage,
        navigationOptions: {
          header: null,
        },
      },
      CreateGroupChat: {
        screen: CreateGroupChat,
        navigationOptions: {
          header: null,
        },
      },
      RecommendFriend: {
        screen: RecommendFriend,
        navigationOptions: {
          header: null,
        },
      },
      ManageFriend: {
        screen: ManageFriend,
        navigationOptions: {
          header: null,
        },
      },
      ManageGroup: {
        screen: ManageGroup,
        navigationOptions: {
          header: null,
        },
      },
      SelectModule: {
        screen: SelectModule,
        navigationOptions: {
          header: null,
        },
      },
      GroupMemberList: {
        screen: GroupMemberList,
        navigationOptions: {
          header: null,
        },
      },
      SelectFriend: {
        screen: SelectFriend,
        navigationOptions: {
          header: null,
        },
      },
      /** ****************************** Mine ********************* */
      Register: {
        screen: Register,
        navigationOptions: {
          header: null,
        },
      },
      Login: {
        screen: Login,
        navigationOptions: {
          header: null,
        },
      },
      ToggleAccount: {
        screen: ToggleAccount,
        navigationOptions: {
          header: null,
        },
      },
      GetBack: {
        screen: GetBack,
        navigationOptions: {
          header: null,
        },
      },
      MyLocalData: {
        screen: MyLocalData,
        navigationOptions: {
          header: null,
        },
      },
      MyMap: {
        screen: MyMap,
        navigationOptions: {
          header: null,
        },
      },
      MyARMap: {
        screen: MyARMap,
        navigationOptions: {
          header: null,
        },
      },
      MyARModel: {
        screen: MyARModel,
        navigationOptions: {
          header: null,
        },
      },
      MyAREffect: {
        screen: MyAREffect,
        navigationOptions: {
          header: null,
        },
      },
      MyScene: {
        screen: MyScene,
        navigationOptions: {
          header: null,
        },
      },
      MyDatasource: {
        screen: MyDatasource,
        navigationOptions: {
          header: null,
        },
      },
      MySymbol: {
        screen: MySymbol,
        navigationOptions: {
          header: null,
        },
      },
      MyTemplate: {
        screen: MyTemplate,
        navigationOptions: {
          header: null,
        },
      },
      MyColor: {
        screen: MyColor,
        navigationOptions: {
          header: null,
        },
      },
      MyDataset: {
        screen: MyDataset,
        navigationOptions: {
          header: null,
        },
      },
      NewDataset: {
        screen: NewDataset,
        navigationOptions: {
          header: null,
        },
      },
      SearchMine: {
        screen: SearchMine,
        navigationOptions: {
          header: null,
        },
      },
      MyService: {
        screen: MyService,
        navigationOptions: {
          header: null,
        },
      },
      MyOnlineMap: {
        screen: MyOnlineMap,
        navigationOptions: {
          header: null,
        },
      },
      MyApplet: {
        screen: MyApplet,
        navigationOptions: {
          header: null,
        },
      },
      AppletManagement: {
        screen: AppletManagement,
        navigationOptions: {
          header: null,
        },
      },
      AppletList: {
        screen: AppletList,
        navigationOptions: {
          header: null,
        },
      },
      MyAIModel: {
        screen: MyAIModel,
        navigationOptions: {
          header: null,
        },
      },
      ScanOnlineMap: {
        screen: ScanOnlineMap,
        navigationOptions: {
          header: null,
        },
      },
      Personal: {
        screen: Personal,
        navigationOptions: {
          header: null,
        },
      },
      SampleMap: {
        screen: SampleMap,
        navigationOptions: {
          header: null,
        },
      },
      WebView: {
        screen: WebView,
        navigationOptions: {
          header: null,
        },
      },
      /** ************************** Home ************************** */
      AboutITablet: {
        screen: AboutITablet,
        navigationOptions: {
          header: null,
        },
      },
      LicensePage: {
        screen: LicensePage,
        navigationOptions: {
          header: null,
        },
      },
      LicenseTypePage: {
        screen: LicenseTypePage,
        navigationOptions: {
          header: null,
        },
      },
      LicenseModule: {
        screen: LicenseModule,
        navigationOptions: {
          header: null,
        },
      },
      LicenseJoin: {
        screen: LicenseJoin,
        navigationOptions: {
          header: null,
        },
      },
      LicenseJoinCloud: {
        screen: LicenseJoinCloud,
        navigationOptions: {
          header: null,
        },
      },
      LicenseJoinPrivateCloud: {
        screen: LicenseJoinPrivateCloud,
        navigationOptions: {
          header: null,
        },
      },
      LicenseJoinEducation: {
        screen: LicenseJoinEducation,
        navigationOptions: {
          header: null,
        },
      },
      Setting: {
        screen: Setting,
        navigationOptions: {
          header: null,
        },
      },
      LanguageSetting: {
        screen: LanguageSetting,
        navigationOptions: {
          header: null,
        },
      },
      LocationSetting: {
        screen: LocationSetting,
        navigationOptions: {
          header: null,
        },
      },
      Protocol: {
        screen: protocol,
        navigationOptions: {
          header: null,
        },
      },
      PointAnalyst: {
        screen: PointAnalyst,
        navigationOptions: {
          header: null,
        },
      },
      PublicMap: {
        screen: PublicMap,
        navigationOptions: {
          header: null,
        },
      },
      FriendMap: {
        screen: FriendMap,
        navigationOptions: {
          header: null,
        },
      },
      MyLabel: {
        screen: MyLabel,
        navigationOptions: {
          header: null,
        },
      },
      MyBaseMap: {
        screen: MyBaseMap,
        navigationOptions: {
          header: null,
        },
      },
      LoadServer: {
        screen: LoadServer,
        navigationOptions: {
          header: null,
        },
      },
      SuperMapKnown: {
        screen: SuperMapKnown,
        navigationOptions: {
          header: null,
        },
      },
      PublicData: {
        screen: PublicData,
        navigationOptions: {
          header: null,
        },
      },
      Applet: {
        screen: Applet,
        navigationOptions: {
          header: null,
        },
      },
      CoworkManagePage: {
        screen: CoworkManagePage,
        navigationOptions: {
          header: null,
        },
      },
      FindSettingPage: {
        screen: FindSettingPage,
        navigationOptions: {
          header: null,
        },
      },
      Laboratory: {
        screen: Laboratory,
        navigationOptions: {
          header: null,
        },
      },
      /** 多媒体编辑 * */
      MediaEdit: {
        screen: MediaEdit,
        navigationOptions: {
          header: null,
        },
      },
      /** 相机界面 * */
      Camera: {
        screen: Camera,
        navigationOptions: {
          header: null,
        },
      },
      MeasureView: {
        screen: MeasureView,
        navigationOptions: {
          header: null,
        },
      },
      MeasureAreaView: {
        screen: MeasureAreaView,
        navigationOptions: {
          header: null,
        },
      },
      SelectLocation: {
        screen: SelectLocation,
        navigationOptions: {
          header: null,
        },
      },
      ARProjectModeView: {
        screen: ARProjectModeView,
        navigationOptions: {
          header: null,
        },
      },
      ClassifyView: {
        screen: ClassifyView,
        navigationOptions: {
          header: null,
        },
      },
      ModelChoseView: {
        screen: ModelChoseView,
        navigationOptions: {
          header: null,
        },
      },
      ClassifyResultEditView: {
        screen: ClassifyResultEditView,
        navigationOptions: {
          header: null,
        },
      },
      CollectSceneFormView: {
        screen: CollectSceneFormView,
        navigationOptions: {
          header: null,
        },
      },
      EnterDatumPoint: {
        screen: EnterDatumPoint,
        navigationOptions: {
          header: null,
        },
      },
      CollectSceneFormSet: {
        screen: CollectSceneFormSet,
        navigationOptions: {
          header: null,
        },
      },
      ClassifySettingsView: {
        screen: ClassifySettingsView,
        navigationOptions: {
          header: null,
        },
      },
      AIDetectSettingView: {
        screen: AIDetectSettingView,
        navigationOptions: {
          header: null,
        },
      },
      AISelectModelView: {
        screen: AISelectModelView,
        navigationOptions: {
          header: null,
        },
      },
      IllegallyParkView: {
        screen: IllegallyParkView,
        navigationOptions: {
          header: null,
        },
      },
      AIPoseEstimationView: {
        screen: AIPoseEstimationView,
        navigationOptions: {
          header: null,
        },
      },
      AIGestureBoneView: {
        screen: AIGestureBoneView,
        navigationOptions: {
          header: null,
        },
      },
      ChooseTaggingLayer: {
        screen: ChooseTaggingLayer,
        navigationOptions: {
          header: null,
        },
      },
      CastModelOperateView: {
        screen: CastModelOperateView,
        navigationOptions: {
          header: null,
        },
      },
      ARNavigationView: {
        screen: ARNavigationView,
        navigationOptions: {
          header: null,
        },
      },
      ARVideoView: {
        screen: ARVideoView,
        navigationOptions: {
          header: null,
        },
      },
      ARImageView: {
        screen: ARImageView,
        navigationOptions: {
          header: null,
        },
      },
      ARWeatherView: {
        screen: ARWeatherView,
        navigationOptions: {
          header: null,
        },
      },
      ChooseWeather: {
        screen: ChooseWeather,
        navigationOptions: {
          header: null,
        },
      },
      ARWebView: {
        screen: ARWebView,
        navigationOptions: {
          header: null,
        },
      },
      ARTextView: {
        screen: ARTextView,
        navigationOptions: {
          header: null,
        },
      },
      SuggestionFeedback: {
        screen: SuggestionFeedback,
        navigationOptions: {
          header: null,
        },
      },
      ARSceneView: {
        screen: ARSceneView,
        navigationOptions: {
          header: null,
        },
      },
      /** ************************** Analyst ************************** */
      // AnalystTools: {
      //   screen: AnalystTools,
      //   navigationOptions: {
      //     header: null,
      //     gesturesEnabled: true,
      //   },
      // },
      BufferAnalystView: {
        screen: BufferAnalystView,
        navigationOptions: {
          header: null,
        },
      },
      AnalystRadiusSetting: {
        screen: AnalystRadiusSetting,
        navigationOptions: {
          header: null,
        },
      },
      AnalystListEntry: {
        screen: AnalystListEntry,
        navigationOptions: {
          header: null,
        },
      },
      OverlayAnalystView: {
        screen: OverlayAnalystView,
        navigationOptions: {
          header: null,
        },
      },
      OnlineAnalystView: {
        screen: OnlineAnalystView,
        navigationOptions: {
          header: null,
        },
      },
      IServerLoginPage: {
        screen: IServerLoginPage,
        navigationOptions: {
          header: null,
        },
      },
      SourceDatasetPage: {
        screen: SourceDatasetPage,
        navigationOptions: {
          header: null,
        },
      },
      AnalystRangePage: {
        screen: AnalystRangePage,
        navigationOptions: {
          header: null,
        },
      },
      WeightAndStatistic: {
        screen: WeightAndStatistic,
        navigationOptions: {
          header: null,
        },
      },
      LocalAnalystView: {
        screen: LocalAnalystView,
        navigationOptions: {
          header: null,
        },
      },
      ReferenceAnalystView: {
        screen: ReferenceAnalystView,
        navigationOptions: {
          header: null,
        },
      },
      RegistrationDatasetPage: {
        screen: RegistrationDatasetPage,
        navigationOptions: {
          header: null,
        },
      },
      RegistrationReferDatasetPage: {
        screen: RegistrationReferDatasetPage,
        navigationOptions: {
          header: null,
        },
      },
      RegistrationArithmeticPage: {
        screen: RegistrationArithmeticPage,
        navigationOptions: {
          header: null,
        },
      },
      RegistrationExecutePage: {
        screen: RegistrationExecutePage,
        navigationOptions: {
          header: null,
        },
      },
      ProjectionTransformationPage: {
        screen: ProjectionTransformationPage,
        navigationOptions: {
          header: null,
        },
      },
      SourceCoordsPage: {
        screen: SourceCoordsPage,
        navigationOptions: {
          header: null,
        },
      },
      ProjectionParameterSetPage: {
        screen: ProjectionParameterSetPage,
        navigationOptions: {
          header: null,
        },
      },
      ProjectionTargetCoordsPage: {
        screen: ProjectionTargetCoordsPage,
        navigationOptions: {
          header: null,
        },
      },
      RegistrationFastPage: {
        screen: RegistrationFastPage,
        navigationOptions: {
          header: null,
        },
      },
      RegistrationPage: {
        screen: RegistrationPage,
        navigationOptions: {
          header: null,
        },
      },
      InterpolationAnalystView: {
        screen: InterpolationAnalystView,
        navigationOptions: {
          header: null,
        },
      },
      InterpolationAnalystDetailView: {
        screen: InterpolationAnalystDetailView,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings1: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings2: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings3: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings4: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings5: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings6: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      SecondMapSettings7: {
        screen: SecondMapSettings,
        navigationOptions: {
          header: null,
        },
      },
      NavigationView: {
        screen: NavigationView,
        navigationOptions: {
          header: null,
        },
      },
      NavigationDataChangePage: {
        screen: NavigationDataChangePage,
        navigationOptions: {
          header: null,
        },
      },
      CreateNavDataPage: {
        screen: CreateNavDataPage,
        navigationOptions: {
          header: null,
        },
      },
      CollectSceneFormHistoryView: {
        screen: CollectSceneFormHistoryView,
        navigationOptions: {
          header: null,
        },
      },
      CustomModePage: {
        screen: CustomModePage,
        navigationOptions: {
          header: null,
        },
      },
      ARLayerManager: {
        screen: ARLayerManager,
        navigationOptions: {
          header: null,
        },
      },
      ARMapSetting: {
        screen: ARMapSetting,
        navigationOptions: {
          header: null,
        },
      },
      ServiceShareSettings: {
        screen: ServiceShareSettings,
        navigationOptions: {
          header: null,
        },
      },
      NavigationView2D: {
        screen: NavigationView2D,
        navigationOptions: {
          header: null,
        },
      },
      RoadNet: {
        screen: RoadNet,
        navigationOptions: {
          header: null,
        },
      },
      Report: {
        screen: Report,
        navigationOptions: {
          header: null,
        },
      },
    },
    {
      defaultNavigationOptions: {
        gesturesEnabled: false,
      },
      navigationOptions: {
        headerBackTitle: null,
        headerTintColor: '#333333',
        showIcon: true,
        swipeEnabled: false,
        gesturesEnabled: false,
        animationEnabled: false,
        headerTitleStyle: { alignSelf: 'center' },
      },
      lazy: true,
      // mode: 'card',
      // transitionConfig: () => ({
      // screenInterpolator: StackViewStyleInterpolator.forHorizontal,
      // }),
      mode: 'modal',
      headerMode: 'none',
      transparentCard: true,
      cardStyle: {
        backgroundColor: 'transparent',
        opacity: 1,
      },
      transitionConfig: () => ({
        screenInterpolator: sceneProps => {
          const { layout, position, scene } = sceneProps
          if (
            (scene.route.routeName === 'NavigationView' ||
              scene.route.routeName === 'PointAnalyst') &&
            GLOBAL.getDevice().orientation.indexOf('LANDSCAPE') === 0
          ) {
            return fromLeft(sceneProps)
          } else {
            const { index } = scene

            const width = layout.initWidth
            const translateX = position.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [width, 0, 0],
            })
            const opacity = position.interpolate({
              inputRange: [index - 1, index - 0.99, index],
              outputRange: [0, 1, 1],
            })
            return { opacity, transform: [{ translateX: translateX }] }
          }
        },
      }),
    },
  )
}
//从左出现的组件
const fromLeft = sceneProps => {
  const { layout, position, scene } = sceneProps
  const { index } = scene

  const width = layout.initWidth
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [-width, 0, 0],
  })
  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index],
    outputRange: [0, 1, 1],
  })
  return { opacity, transform: [{ translateX: translateX }] }
}

// export default (function (a) {
//   console.warn(a && JSON.stringify(a) || '0000')
//   return createAppContainer(AppNavigator([
//     "Home",
//     "Find",
//     "Mine",
//   ]))
// })()
