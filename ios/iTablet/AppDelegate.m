#import "AppDelegate.h"
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNFSManager.h"
#import "NativeUtil.h"
#import "Orientation.h"
#import "MyLaunchScreenViewController.h"
#import "BundleUtils.h"
#define IS_IPHONE (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone)

#define IS_PAD (UI_USER_INTERFACE_IDIOM()== UIUserInterfaceIdiomPad)

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

static NSString* g_sampleCodeName = @"#";
static BOOL isBundle = YES;
@implementation AppDelegate

//注册 APNS 成功并上报 DeviceToken
//- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
//  [JPUSHService registerDeviceToken:deviceToken];
//}

////iOS 7 APNS
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:  (NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
//  // iOS 10 以下 Required
//  NSLog(@"iOS 7 APNS");
//  [JPUSHService handleRemoteNotification:userInfo];
//  [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
//  completionHandler(UIBackgroundFetchResultNewData);
//}

//iOS 10 前台收到消息
//- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center  willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
//  NSDictionary * userInfo = notification.request.content.userInfo;
//  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
//    // Apns
//    NSLog(@"iOS 10 APNS 前台收到消息");
//    [JPUSHService handleRemoteNotification:userInfo];
//    [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
//  }
//  else {
//    // 本地通知 todo
//    NSLog(@"iOS 10 本地通知 前台收到消息");
//    [[NSNotificationCenter defaultCenter] postNotificationName:J_LOCAL_NOTIFICATION_ARRIVED_EVENT object:userInfo];
//  }
//  //需要执行这个方法，选择是否提醒用户，有 Badge、Sound、Alert 三种类型可以选择设置
//  completionHandler(UNNotificationPresentationOptionAlert);
//}

//iOS 10 消息事件回调
//- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler: (void (^)(void))completionHandler {
//  NSDictionary * userInfo = response.notification.request.content.userInfo;
//  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
//    // Apns
//    NSLog(@"iOS 10 APNS 消息事件回调");
//    [JPUSHService handleRemoteNotification:userInfo];
//    // 保障应用被杀死状态下，用户点击推送消息，打开app后可以收到点击通知事件
//    [[RCTJPushEventQueue sharedInstance]._notificationQueue insertObject:userInfo atIndex:0];
//    [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_OPENED_EVENT object:userInfo];
//  }
//  else {
//    // 本地通知
//    NSLog(@"iOS 10 本地通知 消息事件回调");
//    // 保障应用被杀死状态下，用户点击推送消息，打开app后可以收到点击通知事件
//    [[RCTJPushEventQueue sharedInstance]._localNotificationQueue insertObject:userInfo atIndex:0];
//    [[NSNotificationCenter defaultCenter] postNotificationName:J_LOCAL_NOTIFICATION_OPENED_EVENT object:userInfo];
//  }
//  // 系统要求执行这个方法
//  completionHandler();
//}

//- (void)jpushNotificationAuthorization:(JPAuthorizationStatus)status withInfo:(NSDictionary *)info {
//
//}



- (void)application:(UIApplication *)application handleEventsForBackgroundURLSession:(NSString *)identifier completionHandler:(void (^)(void))completionHandler
{
  [RNFSManager setCompletionHandlerForIdentifier:identifier completionHandler:completionHandler];
}

+(void)SetSampleCodeName:(NSString*)name
{
  g_sampleCodeName = name;
  
}

/**添加启动页闪屏*/
-(void)addLaunchSlogan {
  UIViewController *viewController = [[UIStoryboard storyboardWithName:@"MyLaunchScreen" bundle:nil] instantiateViewControllerWithIdentifier:@"MyLaunchScreen"];

  UIWindow *mainWindow = [UIApplication sharedApplication].keyWindow;
  launchView = viewController.view;
  launchView.frame = [UIApplication sharedApplication].keyWindow.frame;
  [mainWindow addSubview:launchView];
  
  [NSTimer scheduledTimerWithTimeInterval:4 target:self selector:@selector(removeLanchSlogan) userInfo:nil repeats:NO];
}

-(void)removeLanchSlogan {
  [launchView removeFromSuperview];
//  self.allowRotation = UIInterfaceOrientationMaskAll;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif
  
  // 初始化bundle
  [BundleUtils initBundle];

//  [JPUSHService setupWithOption:launchOptions appKey:@"7d2470baad20e273cd6e53cc"
//                        channel:nil apsForProduction:nil];
  // APNS
//  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
//  if (@available(iOS 12.0, *)) {
//    entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionProvidesAppNotificationSettings;
//  }
//  [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
//  [launchOptions objectForKey: UIApplicationLaunchOptionsRemoteNotificationKey];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"base"
                                            initialProperties:nil];
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  [AppInfo setKeyWindow:self.window];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  _nav=[[UINavigationController alloc]initWithRootViewController:rootViewController];
  _nav.navigationBarHidden = YES;
  
  [_nav.navigationBar setBackgroundImage:[UIImage new] forBarMetrics:UIBarMetricsDefault];
  
  [_nav.navigationBar setShadowImage:[UIImage new]];
  
  self.window.rootViewController = _nav;
  [self.window makeKeyAndVisible];
  
//  if(IS_IPHONE){
//    self.allowRotation = UIInterfaceOrientationMaskPortrait;
//  }else{
//    self.allowRotation = UIInterfaceOrientationMaskLandscape;
//  }
  [self addLaunchSlogan];
  

  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(deviceOrientationChange:) name:@"SMOrientations" object:nil];
  
  [NSThread sleepForTimeInterval:1];
  //  [RNSplashScreen show];
  //注册微信
  [WeiXinUtils registerApp];
  [[NSNotificationCenter defaultCenter] postNotificationName:@"dowloadFile"
                                                      object:nil];
  // 开启网络监听
//  [[HWNetworkReachabilityManager shareManager] monitorNetworkStatus];
    
//  @try {
//    //初始化极光推送
//    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
//    if (@available(iOS 12.0, *)) {
//      entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionProvidesAppNotificationSettings;
//    } else {
//      // Fallback on earlier versions
//      entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound;
//    }
//    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
//    
//  } @catch (NSException *exception) {
//    NSLog(@"%@", exception.description);
//  }
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [NativeUtil openGPS];
    });
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
         [NativeUtil closeGPS];
     });
  return YES;
}
- (void)deviceOrientationChange:(NSNotification*)info{
  NSNumber* mask = info.object;
  self.allowRotation = (UIInterfaceOrientationMask)mask.intValue;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  NSURL* jsCoreLocation;
  NSString* jsBundlePath = NSHomeDirectory();
  NSString* baseBundePath = [jsBundlePath stringByAppendingFormat:@"/Documents/Bundles/base/base.bundle"];

  NSFileManager* fileManager = [NSFileManager defaultManager];
  if (isBundle && [fileManager fileExistsAtPath:baseBundePath]) {
    // 加载本地base.bundle
    return [NSURL URLWithString:baseBundePath];
  } else {
    #if DEBUG
    //  [[RCTBundleURLProvider sharedSettings] setJsLocation:@"192.168.11.76"];
      [[RCTBundleURLProvider sharedSettings] setJsLocation:@"10.10.0.69"];
      return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    #else
      return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
    #endif
  }
}

#pragma mark - 微信打开压缩包
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  if(![[url absoluteString] containsString:@"platformId=wechat"]){
       [FileTools getUriState:url];
  }
  return [WXApi handleOpenURL:url delegate:self];
}

#pragma mark - 加载bundle包,App初始化不使用该方法
+(RCTRootView *)loadBunle:(NSDictionary *)launchOptions {
  NSURL *jsCodeLocation;
  NSString* jsBundlePath = [AppInfo getBundleFile];
  if (![jsBundlePath isEqualToString:@""]) {
    jsCodeLocation = [NSURL URLWithString:jsBundlePath];
  } else {
    #if DEBUG
//    [[RCTBundleURLProvider sharedSettings] setJsLocation:@"localhost"];
//    [[RCTBundleURLProvider sharedSettings] setJsLocation:@"10.10.7.199"];
    [[RCTBundleURLProvider sharedSettings] setJsLocation:@"10.10.7.65"];

    #endif
      jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  }

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                              moduleName:@"iTablet"
                                                       initialProperties:nil
                                                           launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  return rootView;
}

#pragma mark - 初始化默认数据
- (void)initDefaultData {
  [self initCustomWorkspace];
  [self initDefaultWorkspace];
}

#pragma mark - 初始化游客工作空间
- (void)initCustomWorkspace {
  NSString *srclic = [[NSBundle mainBundle] pathForResource:@"Customer" ofType:@"smwu"];
  NSString* dataPath = @"/Documents/iTablet/User/Customer/Data/";
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @""]];
  if (srclic) {
    NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Customer.smwu"];
    if(![[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
      if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
        NSLog(@"拷贝数据失败");
    }
  }
}

#pragma mark - 初始化默认工作空间数据
-(void)initDefaultWorkspace {
  [FileTools initUserDefaultData:@"Customer"];
}


// onReq是微信终端向第三方程序发起请求，要求第三方程序响应。第三方程序响应完后必须调用sendRsp返回。在调用sendRsp返回时，会切回到微信终端程序界面
- (void)onReq:(BaseReq *)req
{
  
}

// 如果第三方程序向微信发送了sendReq的请求，那么onResp会被回调。sendReq请求调用后，会切到微信终端程序界面
- (void)onResp:(BaseResp *)resp
{
  // 处理 分享请求 回调
  [FileTools sendShareResult];
}
- (void)applicationDidEnterBackground:(UIApplication *)application {
  // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
  // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
  
  self.taskId = [application beginBackgroundTaskWithExpirationHandler:^(void) {
    //当申请的后台时间用完的时候调用这个block
    [self endTask];
  }];
  
  
}


- (void)applicationWillEnterForeground:(UIApplication *)application {
  // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
  
  [[NSNotificationCenter defaultCenter] postNotificationName:@"dowloadFile"
                                                      object:nil];
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
  // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
  
  [self endTask];
  
}

-(void)endTask
{
  [[UIApplication sharedApplication] endBackgroundTask:_taskId];
  _taskId = UIBackgroundTaskInvalid;
}
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(nullable UIWindow *)window
{
//  if (self.allowRotation == YES) {
//    //横屏
//    return UIInterfaceOrientationMaskLandscape;
//  } else{
//    //竖屏
//    return UIInterfaceOrientationMaskPortrait;
//  }
//  NSString* strDevice = [[UIDevice currentDevice].model substringToIndex:4];
//  if ([strDevice isEqualToString:@"iPad"]){
//    return [Orientation getOrientation];
//  } else {
//    return UIInterfaceOrientationMaskPortrait;
//  }
  return [Orientation getOrientation];
//  return self.allowRotation;
//  return UIInterfaceOrientationMaskPortrait;
}
@end
