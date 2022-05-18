#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "FileTools.h"
#import "AppInfo.h"
#import "WeiXinUtils.h"
#import "JPUSHService.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, WXApiDelegate, JPUSHRegisterDelegate>{
  UIView *launchView;
}

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) UINavigationController *nav;
@property (nonatomic, assign) UIInterfaceOrientationMask allowRotation;
@property (nonatomic, unsafe_unretained) UIBackgroundTaskIdentifier taskId;
+(void)SetSampleCodeName:(NSString*)name;
+(RCTRootView *)loadBunle:(NSDictionary *)launchOptions;
@end
