//
//  AppUtils.m
//  iTablet
//
//  Created by imobile-xzy on 2019/1/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "AppUtils.h"
#import <UIKit/UIKit.h>
#import <CoreLocation/CLLocationManager.h>
#import "WeiXinUtils.h"
#import "AppDelegate.h"

@implementation AppUtils
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(initApp, initAppWithResolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    resolve(nil);
  }@catch (NSException *exception) {
    resolve(nil);
  }
}

RCT_REMAP_METHOD(AppExit,AppExit:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  dispatch_async(dispatch_get_main_queue(), ^{
    UIWindow* window = [UIApplication sharedApplication].keyWindow;
    [UIView animateWithDuration:1.0f animations:^{
      window.alpha = 0;
      //window.frame = CGRectMake(0, window.bounds.size.height, 0, 0);
    } completion:^(BOOL finished) {
      exit(0);
    }];
  });
  resolve(@(1));
  
}

RCT_REMAP_METHOD(getLocale, getLocaleWithResolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    NSString * language = [[NSLocale preferredLanguages] firstObject];
    if([language hasPrefix:@"zh-Hans"]){
      language = @"zh-CN";
    }
    resolve(language);
  }@catch (NSException *exception) {
    reject(@"getLocale", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(isWXInstalled, installedResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  @try {
    resolve([NSNumber numberWithBool:[WeiXinUtils isWXInstalled]]);
  } @catch (NSException *exception) {
    reject(@"AppUtils", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(sendFileOfWechat, sendFileOfWechat:(NSDictionary*)data resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      BOOL result = [WeiXinUtils sendFileContent:data];
      resolve(@(result));
    } @catch (NSException *exception) {
      reject(@"AppUtils", exception.reason, nil);
    }
  });
}
RCT_REMAP_METHOD(isLocationOpen, LocationOpenWithresolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL isOpen = [CLLocationManager locationServicesEnabled];
    resolve([NSNumber numberWithBool:isOpen]);
  } @catch (NSException *exception) {
    reject(@"AppUtils", exception.reason, nil);
  }
}

bool foo(void){
  if (sizeof(void*) == 4) {
    NSLog(@"32-bit App");
    return false;

  } else if (sizeof(void*) == 8) {
    NSLog(@"64-bit App");
    return true;
  }
}
RCT_REMAP_METHOD(is64Bit, is64BitResolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL res = foo();
    resolve([NSNumber numberWithBool:res]);
  } @catch (NSException *exception) {
    reject(@"AppUtils", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(isLocationAllowed, LocationAllowWithresolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL isAllowed;
    if([CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied) {
      isAllowed = NO;
    } else {
      isAllowed = YES;
    }
    resolve([NSNumber numberWithBool:isAllowed]);
  } @catch (NSException *exception) {
    reject(@"AppUtils", exception.reason, nil);
  }
}
RCT_REMAP_METHOD(startAppLoactionSetting, startLocationWithresolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    NSURL * url = [[NSURL alloc] initWithString:UIApplicationOpenSettingsURLString];
    if([[UIApplication sharedApplication] canOpenURL:url]) {
      [[UIApplication sharedApplication] openURL:url];
      resolve([NSNumber numberWithBool:YES]);
    } else {
      resolve([NSNumber numberWithBool:NO]);
    }
  } @catch (NSException *exception) {
    reject(@"AppUtils", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(pause, pauseTime:(int) time resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(time * NSEC_PER_SEC)), dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
      resolve(@(YES));
    });
  } @catch (NSException *exception) {
    reject(@"AppUtils", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(reloadBundle, reloadBundleWithResolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    dispatch_async(dispatch_get_main_queue(), ^{
      AppDelegate *delegate = (AppDelegate *)([UIApplication sharedApplication].delegate);

      RCTRootView *rootView = [AppDelegate loadBunle:nil];
      delegate.nav.topViewController.view = rootView;
      
    });
  } @catch (NSException *exception) {
    reject(@"AppUtils", exception.reason, nil);
  }
}


@end
