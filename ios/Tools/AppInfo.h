//
//  Version.h
//  Supermap
//
//  Created by Shanglong Yang on 2020/8/19.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface AppInfo : NSObject<RCTBridgeModule>
+(NSString *)getBundleFile;
+(void) setRootPath:(NSString*)path;
+(NSString*) getRootPath;
+(void) setUserName:(NSString*)name;
+(NSString*) getUserName;
+(NSString *)getBundleFile;
+(void) setCookie:(NSString*)cookie;
+(NSString*) getCookie;
+(void) setMyServiceUrl:(NSString*)url;
+(NSString*) getMyServiceUrl;
//+(void) setAppType:(NSString*)mtype;
//+(NSString *) getAppType;
+(UIWindow*)getKeyWindow;
+(void)setKeyWindow:(UIWindow*)w;
@end
